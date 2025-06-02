import React from 'react';
import { X, Download, Calendar, User, FileText, ExternalLink } from 'lucide-react';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';

interface PaymentProofModalProps {
  payment: ThanhToan;
  onClose: () => void;
}

const PaymentProofModal: React.FC<PaymentProofModalProps> = ({ payment, onClose }) => {
  // Check if URL is base64
  const isBase64Image = (url: string) => {
    return url.startsWith('data:image/');
  };

  // Get image type and size info
  const getImageInfo = (url: string) => {
    if (isBase64Image(url)) {
      const sizeInBytes = Math.round((url.length * 3) / 4);
      const sizeInKB = Math.round(sizeInBytes / 1024);
      const mimeType = url.split(';')[0].split(':')[1];
      return {
        type: 'Base64',
        size: sizeInKB > 1024 ? `${Math.round(sizeInKB / 1024 * 10) / 10} MB` : `${sizeInKB} KB`,
        format: mimeType.split('/')[1].toUpperCase()
      };
    } else {
      return {
        type: 'URL',
        size: 'N/A',
        format: 'N/A'
      };
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ảnh chứng minh thanh toán
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mã thanh toán: {payment.ma_thanh_toan}
            </p>
            {payment.proof_image_url && (
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {(() => {
                  const info = getImageInfo(payment.proof_image_url);
                  return `${info.type} • ${info.format} • ${info.size}`;
                })()}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {payment.proof_image_url && (
              <>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Tải xuống"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleOpenInNewTab}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Mở trong tab mới"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {payment.proof_image_url ? (
            <div className="space-y-4">
              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={payment.proof_image_url}
                  alt="Ảnh chứng minh thanh toán"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.png'; // Fallback image
                  }}
                />
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Thông tin thanh toán
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Mã thanh toán:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {payment.ma_thanh_toan}
                    </span>
                  </div>

                  {payment.transaction_id && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Mã giao dịch:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {payment.transaction_id}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Ngày thanh toán:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {payment.paid_at 
                        ? new Date(payment.paid_at).toLocaleString('vi-VN')
                        : 'Chưa thanh toán'
                      }
                    </span>
                  </div>

                  {payment.updated_by && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Xác nhận bởi:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {payment.updated_by}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Số tiền:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(payment.so_tien)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.trang_thai === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {payment.trang_thai === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>

                {/* Confirmation Note */}
                {payment.confirmation_note && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Ghi chú xác nhận:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 p-3 rounded border">
                      {payment.confirmation_note}
                    </p>
                  </div>
                )}

                {/* Payment Description */}
                {payment.payment_description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Nội dung chuyển khoản:
                    </h4>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 p-3 rounded border break-all">
                      {payment.payment_description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Không có ảnh chứng minh
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Thanh toán này chưa có ảnh chứng minh được tải lên
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentProofModal;
