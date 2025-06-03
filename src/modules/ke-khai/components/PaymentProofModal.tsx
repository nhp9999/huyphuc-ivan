import React, { useState, useCallback } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, ExternalLink } from 'lucide-react';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';

interface PaymentProofModalProps {
  payment: ThanhToan;
  onClose: () => void;
}

const PaymentProofModal: React.FC<PaymentProofModalProps> = ({ payment, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Check if URL is base64
  const isBase64Image = (url: string) => {
    return url.startsWith('data:image/');
  };

  // Image controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.25, 0.5);
    setZoom(newZoom);
    if (newZoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetView = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
    setZoom(newZoom);

    // Reset position when zooming out to 1x or less
    if (newZoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [zoom, position.x, position.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setPosition({
        x: newX,
        y: newY
      });
    }
  }, [isDragging, zoom, dragStart.x, dragStart.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Download image
  const handleDownload = () => {
    if (payment.proof_image_url) {
      const link = document.createElement('a');
      link.href = payment.proof_image_url;
      link.download = `payment-proof-${payment.ma_thanh_toan}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Open image in new tab
  const handleOpenInNewTab = () => {
    if (payment.proof_image_url) {
      if (isBase64Image(payment.proof_image_url)) {
        // For base64 images, create a blob URL
        const byteCharacters = atob(payment.proof_image_url.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        window.open(payment.proof_image_url, '_blank');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Ảnh chứng minh thanh toán
          </h2>

          {/* Image Controls */}
          {payment.proof_image_url && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={handleRotate}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Xoay ảnh"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Tải xuống"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenInNewTab}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Mở trong tab mới"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {payment.proof_image_url ? (
            <>
              {/* Image Container */}
              <div
                className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden relative"
                onWheel={handleWheel}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  userSelect: 'none'
                }}
              >
                <div className="relative">
                  <img
                    src={payment.proof_image_url}
                    alt="Ảnh chứng minh thanh toán"
                    className={`max-w-none max-h-[70vh] object-contain rounded-lg shadow-xl select-none ${
                      isDragging ? '' : 'transition-transform duration-200 ease-in-out'
                    }`}
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: 'center'
                    }}
                    onMouseDown={handleMouseDown}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.png';
                    }}
                    draggable={false}
                  />
                </div>

                {/* Zoom indicator */}
                {zoom !== 1 && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(zoom * 100)}%
                  </div>
                )}

                {/* Instructions */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                  {zoom > 1 ? 'Kéo để di chuyển • Lăn chuột để zoom' : 'Lăn chuột để zoom • Click để kéo'}
                </div>
              </div>

              {/* Payment Info Sidebar */}
              <div className="w-80 bg-white border-l flex flex-col">
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 text-lg">Thông tin thanh toán</h3>

                  {/* Main Payment Info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Mã thanh toán</span>
                      <p className="font-medium text-gray-900">{payment.ma_thanh_toan}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Số tiền</span>
                      <p className="text-xl font-bold text-green-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(payment.so_tien)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Trạng thái</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payment.trang_thai === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.trang_thai === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.trang_thai === 'completed' ? 'Đã thanh toán' :
                           payment.trang_thai === 'pending' ? 'Chờ thanh toán' : 'Khác'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Ngày tạo</span>
                          <p className="font-medium text-gray-900">
                            {new Date(payment.created_at).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        {payment.paid_at && (
                          <div>
                            <span className="text-sm text-gray-500">Ngày thanh toán</span>
                            <p className="font-medium text-gray-900">
                              {new Date(payment.paid_at).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        )}
                        {payment.transaction_id && (
                          <div>
                            <span className="text-sm text-gray-500">Mã giao dịch</span>
                            <p className="font-medium text-gray-900">{payment.transaction_id}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Description */}
                    {payment.payment_description && (
                      <div className="border-t pt-4">
                        <span className="text-sm text-gray-500">Nội dung chuyển khoản</span>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                          <p className="text-sm font-mono text-gray-800 break-all">
                            {payment.payment_description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Confirmation Note */}
                    {payment.confirmation_note && (
                      <div className="border-t pt-4">
                        <span className="text-sm text-gray-500">Ghi chú xác nhận</span>
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">{payment.confirmation_note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reset View Button */}
                {(zoom !== 1 || rotation !== 0 || position.x !== 0 || position.y !== 0) && (
                  <div className="p-4 border-t">
                    <button
                      onClick={handleResetView}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                    >
                      Đặt lại view
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có ảnh chứng minh
                </h3>
                <p className="text-gray-500">
                  Thanh toán này chưa có ảnh chứng minh được tải lên
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProofModal;
