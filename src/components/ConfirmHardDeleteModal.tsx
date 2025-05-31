import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, Skull } from 'lucide-react';

interface ConfirmHardDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmHardDeleteModal: React.FC<ConfirmHardDeleteModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [understood, setUnderstood] = useState(false);
  
  const requiredText = 'XÓA VĨNH VIỄN';
  const canConfirm = confirmText === requiredText && understood && !loading;

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border-4 border-red-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center animate-pulse">
              <Skull className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900 dark:text-red-100">
                ⚠️ {title}
              </h2>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                SUPER ADMIN ONLY - NGUY HIỂM
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Warning */}
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">
                  XÓA VĨNH VIỄN - KHÔNG THỂ KHÔI PHỤC
                </h3>
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Item Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
            <p className="font-medium text-gray-900 dark:text-white mb-1">
              Sẽ xóa vĩnh viễn:
            </p>
            <p className="text-red-600 dark:text-red-400 font-bold">
              {itemName}
            </p>
          </div>

          {/* Consequences */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
            <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Hậu quả không thể hoàn tác:
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 ml-7">
              <li>• Tài khoản bị xóa hoàn toàn khỏi database</li>
              <li>• Tất cả phân quyền bị xóa vĩnh viễn</li>
              <li>• Không thể khôi phục bằng bất kỳ cách nào</li>
              <li>• Email có thể được tái sử dụng ngay lập tức</li>
              <li>• Mất tất cả dữ liệu liên quan</li>
            </ul>
          </div>

          {/* Confirmation Steps */}
          <div className="space-y-4">
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tôi hiểu rằng đây là hành động <strong className="text-red-600">XÓA VĨNH VIỄN</strong> và 
                  <strong className="text-red-600"> KHÔNG THỂ HOÀN TÁC</strong>. Tôi chấp nhận hoàn toàn trách nhiệm.
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Để xác nhận, hãy gõ chính xác: <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-red-800 dark:text-red-200 font-bold">{requiredText}</code>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  confirmText === requiredText 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-red-300 dark:border-red-600'
                }`}
                placeholder={`Gõ "${requiredText}" để xác nhận`}
                disabled={loading}
                autoComplete="off"
              />
              {confirmText && confirmText !== requiredText && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Chưa chính xác. Vui lòng gõ đúng: "{requiredText}"
                </p>
              )}
              {confirmText === requiredText && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  ✓ Xác nhận chính xác
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-lg transition-colors"
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold ${
              canConfirm
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xóa vĩnh viễn...
              </>
            ) : (
              <>
                <Skull className="w-4 h-4" />
                XÓA VĨNH VIỄN
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmHardDeleteModal;
