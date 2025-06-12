import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Download, ZoomIn, ZoomOut, RotateCw, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { DanhSachKeKhai, ThanhToan } from '../../../shared/services/api/supabaseClient';
import paymentService from '../services/paymentService';
import { useToast } from '../../../shared/hooks/useToast';

interface AllPaymentProofsModalProps {
  keKhai: DanhSachKeKhai;
  onClose: () => void;
}

const AllPaymentProofsModal: React.FC<AllPaymentProofsModalProps> = ({
  keKhai,
  onClose
}) => {
  const { showToast } = useToast();

  // State
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<ThanhToan[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Load all payments with proof images
  const loadPaymentsWithProofs = async () => {
    setLoading(true);
    try {
      const allPayments = await paymentService.getAllPaymentsByKeKhaiId(keKhai.id);
      const paymentsWithProofs = allPayments.filter(payment => payment.proof_image_url);
      setPayments(paymentsWithProofs);
      
      if (paymentsWithProofs.length > 0) {
        setSelectedPayment(paymentsWithProofs[0]);
      }
    } catch (error) {
      console.error('Error loading payments with proofs:', error);
      showToast('Không thể tải ảnh chứng minh thanh toán', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentsWithProofs();
  }, [keKhai.id]);

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

  // Select payment
  const handleSelectPayment = (payment: ThanhToan) => {
    setSelectedPayment(payment);
    handleResetView();
  };

  // Download image
  const handleDownload = () => {
    if (selectedPayment?.proof_image_url) {
      const link = document.createElement('a');
      link.href = selectedPayment.proof_image_url;
      link.download = `payment-proof-${selectedPayment.ma_thanh_toan}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Open image in new tab
  const handleOpenInNewTab = () => {
    if (selectedPayment?.proof_image_url) {
      window.open(selectedPayment.proof_image_url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tất cả ảnh chứng minh thanh toán
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kê khai: {keKhai.ma_ke_khai} - {payments.length} ảnh chứng minh
              </p>
            </div>
          </div>

          {/* Image Controls */}
          {selectedPayment?.proof_image_url && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
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
        <div className="flex-1 overflow-hidden flex" style={{ height: 'calc(95vh - 80px)' }}>
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex items-center justify-center w-full">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Không có ảnh chứng minh
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Kê khai này chưa có ảnh chứng minh thanh toán nào
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Payment List Sidebar */}
              <div className="w-80 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Danh sách thanh toán ({payments.length})
                  </h3>
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        onClick={() => handleSelectPayment(payment)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedPayment?.id === payment.id
                            ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600'
                            : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={payment.proof_image_url!}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.png';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {payment.ma_thanh_toan}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {paymentService.formatCurrency(payment.so_tien)}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {payment.created_at ? new Date(payment.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Viewer */}
              {selectedPayment && (
                <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                  <div className="relative">
                    <img
                      src={selectedPayment.proof_image_url!}
                      alt="Ảnh chứng minh thanh toán"
                      className="max-w-none max-h-[80vh] object-contain rounded-lg shadow-xl select-none transition-transform duration-200 ease-in-out"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                        transformOrigin: 'center'
                      }}
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

                  {/* Payment info overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">{selectedPayment.ma_thanh_toan}</p>
                    <p className="text-xs opacity-90">{paymentService.formatCurrency(selectedPayment.so_tien)}</p>
                  </div>

                  {/* Reset View Button */}
                  {(zoom !== 1 || rotation !== 0 || position.x !== 0 || position.y !== 0) && (
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={handleResetView}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                      >
                        Đặt lại view
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPaymentProofsModal;
