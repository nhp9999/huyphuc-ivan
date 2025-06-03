import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useToast } from '../../../shared/hooks/useToast';

interface PaymentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (proofImageUrl?: string) => void;
  paymentAmount: number;
  paymentCode: string;
  isLoading?: boolean;
}

const PaymentConfirmModal: React.FC<PaymentConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  paymentAmount,
  paymentCode,
  isLoading = false
}) => {
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofImagePreview, setProofImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file ảnh', 'error');
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Kích thước file không được vượt quá 5MB', 'error');
        return;
      }

      setProofImage(file);
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProofImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    try {
      let proofImageUrl = undefined;

      if (proofImage) {
        proofImageUrl = await uploadProofImage(proofImage);
      }

      onConfirm(proofImageUrl);
    } catch (error) {
      console.error('Error uploading proof image:', error);
      showToast('Không thể upload ảnh chứng từ', 'error');
    } finally {
      setIsUploading(false);
    }
  };



  const removeImage = () => {
    setProofImage(null);
    setProofImagePreview(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Xác nhận thanh toán</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Payment Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Số tiền</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(paymentAmount)}</p>
            <p className="text-sm text-gray-500">Mã: {paymentCode}</p>
          </div>

          {/* Confirmation Message */}
          <div className="text-center">
            <p className="text-sm text-gray-700 mb-3">
              Bạn đã thanh toán thành công?
            </p>
            <p className="text-xs text-gray-500">
              Upload ảnh chứng từ (không bắt buộc)
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Chọn ảnh chứng từ</p>
                <p className="text-xs text-gray-500 mt-1">Tối đa 5MB</p>
              </div>
            </label>

            {/* Image Preview */}
            {proofImagePreview && (
              <div className="relative">
                <img
                  src={proofImagePreview}
                  alt="Preview chứng từ"
                  className="w-full max-h-32 object-contain rounded-lg border"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <button
            onClick={handleConfirm}
            disabled={isLoading || isUploading}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
          >
            {isUploading ? (
              <span>Đang xử lý...</span>
            ) : isLoading ? (
              <span>Đang xác nhận...</span>
            ) : (
              <span>Xác nhận thanh toán</span>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmModal;
