import React from 'react';
import { X, FileText, User, Building, Calendar, AlertCircle } from 'lucide-react';

interface BhxhSearchResult {
  id: number;
  ma_ke_khai: string;
  ten_ke_khai: string;
  loai_ke_khai: string;
  trang_thai: string;
  created_at: string;
  participantInfo: {
    ho_ten: string;
    don_vi_id?: number;
    don_vi_name?: string;
  };
}

interface BhxhSearchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  result: BhxhSearchResult | null;
  onNavigateToKeKhai: (keKhai: BhxhSearchResult) => void;
}

const BhxhSearchResultModal: React.FC<BhxhSearchResultModalProps> = ({
  isOpen,
  onClose,
  searchTerm,
  result,
  onNavigateToKeKhai
}) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
      submitted: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      request_sent: { label: 'Đã gửi yêu cầu phát sinh', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      request_confirmed: { label: 'Đã xác nhận yêu cầu phát sinh', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
      pending_payment: { label: 'Chờ thanh toán', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
      paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      completed: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
      rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Kết quả tìm kiếm mã số BHXH
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-300">
                Tìm kiếm mã số BHXH: <strong>{searchTerm}</strong>
              </span>
            </div>
          </div>

          {result ? (
            <div className="space-y-6">
              {/* Ke Khai Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Thông tin kê khai
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mã kê khai
                    </label>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {result.ma_ke_khai}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Loại kê khai
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {result.loai_ke_khai}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên kê khai
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {result.ten_ke_khai}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trạng thái
                    </label>
                    <div>{getStatusBadge(result.trang_thai)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ngày tạo
                    </label>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(result.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participant Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Thông tin người tham gia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Họ tên
                    </label>
                    <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                      <User className="w-4 h-4" />
                      <span>{result.participantInfo.ho_ten}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Đơn vị
                    </label>
                    <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                      <Building className="w-4 h-4" />
                      <span>{result.participantInfo.don_vi_name || 'Chưa xác định'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    onNavigateToKeKhai(result);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Chuyển đến kê khai
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Không tìm thấy kê khai nào chứa người tham gia có mã số BHXH: <strong>{searchTerm}</strong>
              </p>
              <div className="mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BhxhSearchResultModal;
