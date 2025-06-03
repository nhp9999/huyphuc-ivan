import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Building, Shield, Users, FileText } from 'lucide-react';
import { VCongTacVienChiTiet } from '../../../shared/services/api/supabaseClient';

interface CongTacVienViewModalProps {
  congTacVien: VCongTacVienChiTiet;
  onClose: () => void;
}

const CongTacVienViewModal: React.FC<CongTacVienViewModalProps> = ({ congTacVien, onClose }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      inactive: { label: 'Không hoạt động', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getLoaiToChucInfo = (loaiToChuc: string) => {
    const loaiConfig = {
      cong_ty: { 
        label: 'Công ty', 
        icon: <Building className="w-5 h-5 text-blue-600" />,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
      },
      co_quan_bhxh: { 
        label: 'Cơ quan BHXH', 
        icon: <Shield className="w-5 h-5 text-green-600" />,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      },
      he_thong: { 
        label: 'Hệ thống', 
        icon: <Users className="w-5 h-5 text-purple-600" />,
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
      }
    };

    return loaiConfig[loaiToChuc as keyof typeof loaiConfig] || loaiConfig.he_thong;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const loaiToChucInfo = getLoaiToChucInfo(congTacVien.loai_to_chuc);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Chi tiết cộng tác viên
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Thông tin cơ bản
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Mã cộng tác viên
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                  {congTacVien.ma_ctv}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Họ và tên
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                  {congTacVien.ho_ten}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Trạng thái
                </label>
                <div className="mt-1">
                  {getStatusBadge(congTacVien.trang_thai)}
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Thông tin liên hệ
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                  {congTacVien.email ? (
                    <>
                      <Mail className="w-3 h-3 mr-1" />
                      {congTacVien.email}
                    </>
                  ) : (
                    <span className="text-gray-400">Chưa có thông tin</span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Số điện thoại
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                  {congTacVien.so_dien_thoai ? (
                    <>
                      <Phone className="w-3 h-3 mr-1" />
                      {congTacVien.so_dien_thoai}
                    </>
                  ) : (
                    <span className="text-gray-400">Chưa có thông tin</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Nhân viên thu quản lý */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Nhân viên thu quản lý
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tên nhân viên thu
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                  {congTacVien.ten_nhan_vien_thu}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email nhân viên thu
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {congTacVien.email_nhan_vien_thu}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin tổ chức */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              {loaiToChucInfo.icon}
              <span className="ml-2">Thông tin tổ chức</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Loại tổ chức
                </label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${loaiToChucInfo.className}`}>
                    {loaiToChucInfo.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tên tổ chức
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {congTacVien.ten_cong_ty || congTacVien.ten_co_quan || 'Hệ thống'}
                </p>
              </div>

              {congTacVien.ma_cong_ty && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mã công ty
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {congTacVien.ma_cong_ty}
                  </p>
                </div>
              )}

              {congTacVien.ma_co_quan && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mã cơ quan
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {congTacVien.ma_co_quan}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Thời gian làm việc */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Thời gian làm việc
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Ngày bắt đầu
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(congTacVien.ngay_bat_dau)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Ngày kết thúc
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(congTacVien.ngay_ket_thuc)}
                </p>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {/* Note: Ghi chú không có trong VCongTacVienChiTiet, cần load từ bảng gốc nếu cần */}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongTacVienViewModal;
