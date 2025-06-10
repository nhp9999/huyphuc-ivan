import React, { useState } from 'react';
import { X, CreditCard, User, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatters';
import { calculateKeKhai603AmountThucTe } from '../hooks/useKeKhai603FormData';

interface ConfirmSubmitParticipantWithPaymentModalProps {
  isOpen: boolean;
  participant: {
    hoTen: string;
    maSoBHXH: string;
    noiDangKyKCB: string;
    sttHo?: string;
    soThangDong?: string;
    mucLuong?: string;
    tienDong?: number;
    tienDongThucTe?: number;
  } | null;
  doiTuongThamGia?: string;
  onConfirm: (notes?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmSubmitParticipantWithPaymentModal: React.FC<ConfirmSubmitParticipantWithPaymentModalProps> = ({
  isOpen,
  participant,
  doiTuongThamGia,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [notes, setNotes] = useState('');

  if (!isOpen || !participant) return null;

  // Calculate payment amount
  const getPaymentAmount = (): number => {
    // First, try to use pre-calculated values
    if (participant.tienDongThucTe && participant.tienDongThucTe > 0) {
      return participant.tienDongThucTe;
    }
    if (participant.tienDong && participant.tienDong > 0) {
      return participant.tienDong;
    }

    // If no pre-calculated values, calculate on-the-fly
    if (participant.sttHo && participant.soThangDong) {
      const mucLuongNumber = participant.mucLuong ?
        parseFloat(participant.mucLuong.replace(/[.,]/g, '')) : 2340000;

      return calculateKeKhai603AmountThucTe(
        participant.sttHo,
        participant.soThangDong,
        mucLuongNumber,
        doiTuongThamGia
      );
    }

    return 0;
  };

  const paymentAmount = getPaymentAmount();

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
    setNotes('');
  };

  const handleCancel = () => {
    onCancel();
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <CreditCard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Xác nhận nộp & thanh toán ngay
            </h3>
          </div>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Participant Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Thông tin người tham gia
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Họ và tên:</span>
                <span className="font-semibold text-blue-900 dark:text-blue-100">{participant.hoTen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Mã số BHXH:</span>
                <span className="font-mono font-semibold text-blue-900 dark:text-blue-100">{participant.maSoBHXH}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Nơi đăng ký KCB:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100 text-right max-w-xs truncate" title={participant.noiDangKyKCB}>
                  {participant.noiDangKyKCB}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Thông tin thanh toán
            </h4>
            <div className="space-y-2 text-sm">
              {participant.soThangDong && (
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Số tháng đóng:</span>
                  <span className="font-semibold text-green-900 dark:text-green-100">{participant.soThangDong} tháng</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-700">
                <span className="text-green-700 dark:text-green-300 font-medium">Số tiền thanh toán:</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {paymentAmount > 0 ? formatCurrency(paymentAmount) : 'Chưa tính được'}
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Lưu ý:</strong> Sau khi xác nhận, người tham gia này sẽ được nộp ngay lập tức và bạn sẽ được chuyển đến trang thanh toán QR code để thanh toán.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
              rows={3}
              placeholder="Nhập ghi chú nếu cần..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || paymentAmount <= 0}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Xác nhận nộp & thanh toán
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmitParticipantWithPaymentModal;
