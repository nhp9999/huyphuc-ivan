import React from 'react';
import { X, Building2, Phone, Mail, MapPin, User, FileText, Calendar, Hash } from 'lucide-react';
import { DmCongTy } from '../../../shared/services/api/supabaseClient';

interface CongTyViewModalProps {
  congTy: DmCongTy;
  onClose: () => void;
}

const CongTyViewModal: React.FC<CongTyViewModalProps> = ({ congTy, onClose }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Hoạt động
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Ngừng hoạt động
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Không xác định
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chi tiết công ty
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Thông tin chi tiết về công ty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Company Name and Status */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {congTy.ten_cong_ty}
            </h3>
            <div className="flex items-center justify-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">
                Mã: <span className="font-medium text-gray-900 dark:text-white">{congTy.ma_cong_ty}</span>
              </span>
              {getStatusBadge(congTy.trang_thai)}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Thông tin liên hệ
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                    <p className="text-gray-900 dark:text-white">
                      {congTy.so_dien_thoai || 'Chưa có thông tin'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">
                      {congTy.email || 'Chưa có thông tin'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                    <p className="text-gray-900 dark:text-white">
                      {congTy.dia_chi || 'Chưa có thông tin'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Thông tin pháp lý
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mã số thuế</p>
                    <p className="text-gray-900 dark:text-white">
                      {congTy.ma_so_thue || 'Chưa có thông tin'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Người đại diện</p>
                    <p className="text-gray-900 dark:text-white">
                      {congTy.nguoi_dai_dien || 'Chưa có thông tin'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {congTy.ghi_chu && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Ghi chú
              </h4>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {congTy.ghi_chu}
                </p>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
              Thông tin hệ thống
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Ngày tạo:</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(congTy.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Cập nhật:</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(congTy.updated_at)}
                </span>
              </div>

              {congTy.created_by && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">Tạo bởi:</span>
                  <span className="text-gray-900 dark:text-white">
                    {congTy.created_by}
                  </span>
                </div>
              )}

              {congTy.updated_by && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">Cập nhật bởi:</span>
                  <span className="text-gray-900 dark:text-white">
                    {congTy.updated_by}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongTyViewModal;

