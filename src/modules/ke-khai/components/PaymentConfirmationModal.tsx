import React, { useState } from 'react';
import { X, CheckCircle, Upload, Calendar, DollarSign, User, Building, FileText } from 'lucide-react';
import { ThanhToan, DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import keKhaiService from '../services/keKhaiService';
import uploadService from '../../../shared/services/uploadService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';

interface PaymentConfirmationModalProps {
  payment: ThanhToan;
  keKhai: DanhSachKeKhai;
  onClose: () => void;
  onConfirmed: () => void;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  payment,
  keKhai,
  onClose,
  onConfirmed
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [confirmationNote, setConfirmationNote] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      const validation = uploadService.validateImageFile(file);
      if (!validation.isValid) {
        showToast(validation.error!, 'error');
        return;
      }

      setProofImage(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setProofImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Handle confirm payment
  const handleConfirmPayment = async () => {
    if (!transactionId.trim()) {
      showToast('Vui lòng nhập mã giao dịch', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Confirming payment with data:', {
        keKhaiId: keKhai.id,
        paymentId: payment.id,
        transactionId: transactionId.trim(),
        userId: user?.id,
        confirmationNote,
        hasProofImage: !!proofImage
      });

      // Upload proof image if provided
      let proofImageUrl = null;
      if (proofImage) {
        console.log('Uploading proof image...');
        try {
          proofImageUrl = await uploadService.uploadPaymentProof(proofImage, payment.id);
          console.log('Image uploaded successfully:', proofImageUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Không thể tải lên ảnh chứng minh';
          showToast(errorMessage, 'error');
          setLoading(false);
          return; // Stop the process if image upload fails
        }
      }

      // Confirm payment
      await keKhaiService.confirmPayment(
        keKhai.id,
        payment.id,
        transactionId.trim(),
        user?.id?.toString(),
        proofImageUrl || undefined,
        confirmationNote.trim() || undefined
      );

      showToast('Đã xác nhận thanh toán thành công', 'success');
      onConfirmed();
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      const errorMessage = error?.message || 'Không thể xác nhận thanh toán';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Xác nhận thanh toán
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Mã kê khai:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {keKhai.ma_ke_khai}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Số tiền:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(payment.so_tien)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Mã thanh toán:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {payment.ma_thanh_toan}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Ngân hàng:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  AGRIBANK
                </span>
              </div>
            </div>

            {/* Payment Description */}
            <div className="mt-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Nội dung chuyển khoản:</span>
              <div className="mt-1 p-2 bg-white dark:bg-gray-600 rounded border text-sm font-mono">
                {payment.payment_description || `BHXH 103 00 ${payment.ma_thanh_toan}`}
              </div>
            </div>
          </div>

          {/* Confirmation Form */}
          <div className="space-y-4">
            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã giao dịch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mã giao dịch từ ngân hàng"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mã giao dịch có thể tìm thấy trong SMS hoặc lịch sử giao dịch ngân hàng
              </p>
            </div>

            {/* Confirmation Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú xác nhận
              </label>
              <textarea
                value={confirmationNote}
                onChange={(e) => setConfirmationNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ghi chú thêm về việc xác nhận thanh toán (tùy chọn)"
              />
            </div>

            {/* Proof Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ảnh chứng minh thanh toán (tùy chọn)
              </label>
              
              {!proofImage ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500">Tải lên ảnh</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <span className="text-gray-500"> hoặc kéo thả vào đây</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF tối đa 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl!}
                    alt="Proof of payment"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={loading || !transactionId.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Xác nhận thanh toán</span>
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Lưu ý:</strong> Việc xác nhận thanh toán sẽ chuyển trạng thái kê khai thành "Đã thanh toán" 
              và không thể hoàn tác. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
