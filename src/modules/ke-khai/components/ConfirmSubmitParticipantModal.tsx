import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';

interface ConfirmSubmitParticipantModalProps {
  isOpen: boolean;
  participant: {
    hoTen: string;
    maSoBHXH: string;
    noiDangKyKCB: string;
  } | null;
  onConfirm: (notes?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmSubmitParticipantModal: React.FC<ConfirmSubmitParticipantModalProps> = ({
  isOpen,
  participant,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [notes, setNotes] = useState('');

  if (!isOpen || !participant) return null;

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
  };

  const handleCancel = () => {
    setNotes('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Xác nhận nộp người tham gia
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Participant Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Thông tin người tham gia
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Họ tên:</span> {participant.hoTen}
                  </p>
                  <p className="text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Mã BHXH:</span> {participant.maSoBHXH}
                  </p>
                  <p className="text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Nơi KCB:</span> {participant.noiDangKyKCB}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ Sau khi nộp, bạn sẽ không thể chỉnh sửa thông tin người tham gia này cho đến khi được xử lý.
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={3}
              placeholder="Nhập ghi chú nếu cần..."
              disabled={loading}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang nộp...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Nộp người tham gia
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmitParticipantModal;
