import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, FileText, CreditCard } from 'lucide-react';
import { DanhSachKeKhai, ThanhToan } from '../../../shared/services/api/supabaseClient';
import keKhaiService, { ApproveKeKhaiRequest, RejectKeKhaiRequest } from '../services/keKhaiService';
import { useAuth } from '../../auth';
import PaymentQRModal from './PaymentQRModal';

interface KeKhaiApprovalModalProps {
  keKhai: DanhSachKeKhai;
  action: 'approve' | 'reject';
  onClose: () => void;
  onSuccess: () => void;
}

const KeKhaiApprovalModal: React.FC<KeKhaiApprovalModalProps> = ({
  keKhai,
  action,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingNotes, setProcessingNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<ThanhToan | null>(null);

  const isApprove = action === 'approve';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Không thể xác định người dùng hiện tại');
      return;
    }

    if (!isApprove && !rejectionReason.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isApprove) {
        const approveData: ApproveKeKhaiRequest = {
          approved_by: user.id,
          processing_notes: processingNotes.trim() || undefined
        };

        // Duyệt kê khai và tạo yêu cầu thanh toán
        const result = await keKhaiService.approveKeKhaiWithPayment(keKhai.id, approveData);

        // Hiển thị modal thanh toán
        setPaymentInfo(result.payment);
        setShowPaymentModal(true);
      } else {
        const rejectData: RejectKeKhaiRequest = {
          rejected_by: user.id,
          rejection_reason: rejectionReason.trim(),
          processing_notes: processingNotes.trim() || undefined
        };
        await keKhaiService.rejectKeKhai(keKhai.id, rejectData);
        onSuccess();
      }
    } catch (err) {
      console.error('Error processing approval:', err);
      setError(
        isApprove 
          ? 'Không thể duyệt kê khai. Vui lòng thử lại.'
          : 'Không thể từ chối kê khai. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetProcessing = async () => {
    if (!user?.id) {
      setError('Không thể xác định người dùng hiện tại');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await keKhaiService.setKeKhaiProcessing(
        keKhai.id, 
        user.id, 
        'Đang xem xét và xử lý kê khai'
      );
      onSuccess();
    } catch (err) {
      console.error('Error setting processing:', err);
      setError('Không thể cập nhật trạng thái kê khai. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {isApprove ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isApprove ? 'Duyệt kê khai' : 'Từ chối kê khai'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {keKhai.ma_ke_khai}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Ke Khai Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Thông tin kê khai
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Tên:</span> {keKhai.ten_ke_khai}</p>
              <p><span className="font-medium">Loại:</span> {keKhai.loai_ke_khai}</p>
              <p><span className="font-medium">Đối tượng:</span> {keKhai.doi_tuong_tham_gia || 'Chưa xác định'}</p>
              <p><span className="font-medium">Người tạo:</span> {keKhai.created_by || 'N/A'}</p>
              <p><span className="font-medium">Ngày tạo:</span> {new Date(keKhai.created_at || '').toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className={`mb-6 p-4 rounded-lg ${
            isApprove 
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {isApprove ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <p className={`text-sm font-medium ${
                isApprove 
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {isApprove 
                  ? 'Bạn có chắc chắn muốn duyệt kê khai này không?'
                  : 'Bạn có chắc chắn muốn từ chối kê khai này không?'
                }
              </p>
            </div>
            <p className={`text-xs mt-1 ${
              isApprove 
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {isApprove
                ? 'Kê khai sẽ được duyệt và mã QR thanh toán sẽ được tạo cho nhân viên thu.'
                : 'Kê khai sẽ được chuyển sang trạng thái "Từ chối" và cần được tạo lại.'
              }
            </p>
          </div>

          {/* Rejection Reason (only for reject action) */}
          {!isApprove && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập lý do từ chối kê khai..."
                required
              />
            </div>
          )}

          {/* Processing Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú xử lý (tùy chọn)
            </label>
            <textarea
              value={processingNotes}
              onChange={(e) => setProcessingNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập ghi chú về quá trình xử lý..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <div>
              {keKhai.trang_thai === 'submitted' && (
                <button
                  type="button"
                  onClick={handleSetProcessing}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                >
                  Đánh dấu đang xử lý
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || (!isApprove && !rejectionReason.trim())}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  isApprove
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  isApprove ? 'Duyệt kê khai & Tạo thanh toán' : 'Từ chối kê khai'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Payment QR Modal */}
      {showPaymentModal && paymentInfo && (
        <PaymentQRModal
          payment={paymentInfo}
          onClose={() => {
            setShowPaymentModal(false);
            onClose();
          }}
          onPaymentConfirmed={() => {
            setShowPaymentModal(false);
            onSuccess();
          }}
        />
      )}
    </div>
  );
};

export default KeKhaiApprovalModal;
