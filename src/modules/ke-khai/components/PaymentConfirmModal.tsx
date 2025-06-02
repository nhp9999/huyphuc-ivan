import React, { useState } from 'react';
import { X, Upload, Image, CheckCircle, AlertCircle } from 'lucide-react';
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

  const handleSkip = () => {
    onConfirm(); // Xác nhận không có ảnh
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-medium">Xác nhận thanh toán</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Payment Info */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-center">
              <p className="text-sm text-blue-600 mb-1">Số tiền đã thanh toán</p>
              <p className="text-xl font-bold text-blue-800">{formatCurrency(paymentAmount)}</p>
              <p className="text-xs text-blue-500 mt-1">Mã: {paymentCode}</p>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Bạn đã thanh toán thành công?
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Vui lòng upload ảnh chứng từ để xác nhận (không bắt buộc)
                </p>
              </div>
            </div>
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Nhấn để chọn ảnh chứng từ
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF (tối đa 5MB)
                </p>
              </div>
            </label>

            {/* Image Preview */}
            {proofImagePreview && (
              <div className="relative">
                <img
                  src={proofImagePreview}
                  alt="Preview chứng từ"
                  className="w-full max-h-48 object-contain rounded-lg border"
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

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-700">
                Chỉ xác nhận khi bạn đã thực sự thanh toán thành công. 
                Việc xác nhận sai có thể ảnh hưởng đến quá trình xử lý.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSkip}
            disabled={isLoading || isUploading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Bỏ qua ảnh
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || isUploading}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 animate-pulse" />
                <span>Đang xử lý...</span>
              </>
            ) : isLoading ? (
              <>
                <CheckCircle className="w-4 h-4 animate-pulse" />
                <span>Đang xác nhận...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Xác nhận</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmModal;
