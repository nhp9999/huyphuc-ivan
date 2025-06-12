import React, { useState } from 'react';
import { X, Upload, DollarSign, FileText, CreditCard } from 'lucide-react';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import paymentService from '../services/paymentService';
import uploadService from '../../../shared/services/uploadService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';

interface AdditionalPaymentModalProps {
  keKhai: DanhSachKeKhai;
  totalRequiredAmount: number;
  totalPaidAmount: number;
  onClose: () => void;
  onPaymentCreated: () => void;
}

const AdditionalPaymentModal: React.FC<AdditionalPaymentModalProps> = ({
  keKhai,
  totalRequiredAmount,
  totalPaidAmount,
  onClose,
  onPaymentCreated
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // State
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Calculate remaining amount
  const remainingAmount = totalRequiredAmount - totalPaidAmount;

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

  // Handle create additional payment
  const handleCreatePayment = async () => {
    if (!amount.trim() || parseFloat(amount) <= 0) {
      showToast('Vui lòng nhập số tiền hợp lệ', 'error');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount > remainingAmount) {
      showToast(`Số tiền không được vượt quá số tiền còn thiếu (${paymentService.formatCurrency(remainingAmount)})`, 'error');
      return;
    }

    setLoading(true);
    try {
      // Create additional payment
      const payment = await paymentService.createAdditionalPayment({
        ke_khai_id: keKhai.id,
        so_tien: paymentAmount,
        phuong_thuc_thanh_toan: 'qr_code',
        payment_description: `Thanh toán bổ sung kê khai ${keKhai.ma_ke_khai}`,
        additional_note: note.trim() || 'Thanh toán bổ sung',
        created_by: user?.id
      });

      // Upload proof image if provided
      if (proofImage) {
        try {
          const proofImageUrl = await uploadService.uploadPaymentProof(proofImage, payment.id);
          
          // Update payment with proof image
          await paymentService.updatePaymentStatus(
            payment.id,
            'pending',
            undefined,
            user?.id,
            proofImageUrl,
            'Đã upload ảnh chứng minh thanh toán bổ sung'
          );
        } catch (uploadError) {
          console.error('Error uploading proof image:', uploadError);
          showToast('Tạo thanh toán thành công nhưng không thể upload ảnh chứng minh', 'warning');
        }
      }

      showToast('Tạo thanh toán bổ sung thành công', 'success');
      onPaymentCreated();
      onClose();
    } catch (error) {
      console.error('Error creating additional payment:', error);
      showToast(error instanceof Error ? error.message : 'Không thể tạo thanh toán bổ sung', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Format currency input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  // Format display amount
  const formatDisplayAmount = (value: string) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('vi-VN').format(numValue);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thanh toán bổ sung
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kê khai: {keKhai.ma_ke_khai}
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
        <div className="p-6 space-y-6">
          {/* Payment Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Thông tin thanh toán</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Tổng số tiền cần thanh toán:</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {paymentService.formatCurrency(totalRequiredAmount)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Đã thanh toán:</span>
                <p className="font-semibold text-green-600">
                  {paymentService.formatCurrency(totalPaidAmount)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Còn thiếu:</span>
                <p className="font-semibold text-red-600">
                  {paymentService.formatCurrency(remainingAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số tiền thanh toán bổ sung <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formatDisplayAmount(amount)}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            {amount && (
              <p className="mt-1 text-sm text-gray-500">
                Số tiền: {paymentService.formatCurrency(parseFloat(amount) || 0)}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú về thanh toán bổ sung..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Chọn ảnh chứng minh
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleCreatePayment}
            disabled={loading || !amount.trim() || parseFloat(amount) <= 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Tạo thanh toán
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalPaymentModal;
