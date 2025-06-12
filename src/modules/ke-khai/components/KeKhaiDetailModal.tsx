import React, { useState, useEffect } from 'react';
import { X, FileText, User, Calendar, Building, MapPin, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import { DanhSachKeKhai, DanhSachNguoiThamGia } from '../../../shared/services/api/supabaseClient';
import keKhaiService from '../services/keKhaiService';

interface KeKhaiDetailModalProps {
  keKhai: DanhSachKeKhai;
  onClose: () => void;
}

const KeKhaiDetailModal: React.FC<KeKhaiDetailModalProps> = ({ keKhai, onClose }) => {
  const [nguoiThamGiaList, setNguoiThamGiaList] = useState<DanhSachNguoiThamGia[]>([]);
  const [loading, setLoading] = useState(false);

  // Load participants data
  useEffect(() => {
    const loadNguoiThamGia = async () => {
      setLoading(true);
      try {
        const data = await keKhaiService.getNguoiThamGiaByKeKhai(keKhai.id);
        setNguoiThamGiaList(data);
      } catch (error) {
        console.error('Error loading participants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNguoiThamGia();
  }, [keKhai.id]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <FileText className="w-3 h-3 mr-1" />
            Nháp
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="w-3 h-3 mr-1" />
            Chờ duyệt
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case 'request_sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Play className="w-3 h-3 mr-1" />
            Đã gửi yêu cầu phát sinh
          </span>
        );
      case 'request_confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã xác nhận yêu cầu phát sinh
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chi tiết kê khai
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {keKhai.ma_ke_khai}
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Thông tin cơ bản
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mã kê khai</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">{keKhai.ma_ke_khai}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên kê khai</label>
                  <p className="text-sm text-gray-900 dark:text-white">{keKhai.ten_ke_khai}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại kê khai</label>
                  <p className="text-sm text-gray-900 dark:text-white">{keKhai.loai_ke_khai}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                  <div className="mt-1">
                    {getStatusBadge(keKhai.trang_thai)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đối tượng tham gia</label>
                  <p className="text-sm text-gray-900 dark:text-white">{keKhai.doi_tuong_tham_gia || 'Chưa xác định'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Thông tin bổ sung
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hình thức tính</label>
                  <p className="text-sm text-gray-900 dark:text-white">{keKhai.hinh_thuc_tinh || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lương cơ sở</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatCurrency(keKhai.luong_co_so)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nguồn đóng</label>
                  <p className="text-sm text-gray-900 dark:text-white">{keKhai.nguon_dong || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số tháng</label>
                  <p className="text-sm text-gray-900 dark:text-white">{keKhai.so_thang || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tỷ lệ NSNN hỗ trợ (%)</label>
                  <p className="text-sm text-gray-900 dark:text-white">{keKhai.ty_le_nsnn_ho_tro || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Thông tin thời gian
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày tạo</label>
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(keKhai.created_at || '').toLocaleString('vi-VN')}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Người tạo</label>
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    <User className="w-4 h-4 mr-2" />
                    {keKhai.created_by || 'N/A'}
                  </div>
                </div>
                
                {keKhai.updated_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cập nhật lần cuối</label>
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(keKhai.updated_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Thông tin duyệt
              </h3>
              
              <div className="space-y-3">
                {keKhai.approved_at && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày duyệt</label>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        {new Date(keKhai.approved_at).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Người duyệt</label>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <User className="w-4 h-4 mr-2" />
                        {keKhai.approved_by || 'N/A'}
                      </div>
                    </div>
                  </>
                )}
                
                {keKhai.rejected_at && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày từ chối</label>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <XCircle className="w-4 h-4 mr-2 text-red-600" />
                        {new Date(keKhai.rejected_at).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Người từ chối</label>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <User className="w-4 h-4 mr-2" />
                        {keKhai.rejected_by || 'N/A'}
                      </div>
                    </div>
                    
                    {keKhai.rejection_reason && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lý do từ chối</label>
                        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded">
                          {keKhai.rejection_reason}
                        </p>
                      </div>
                    )}
                  </>
                )}
                
                {keKhai.processing_notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ghi chú xử lý</label>
                    <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      {keKhai.processing_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {keKhai.ghi_chu && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Ghi chú
              </h3>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {keKhai.ghi_chu}
              </p>
            </div>
          )}

          {/* Participants */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Danh sách người tham gia ({nguoiThamGiaList.length})
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : nguoiThamGiaList.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Chưa có người tham gia nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Họ tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        CCCD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ngày sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Giới tính
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Số tiền đóng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {nguoiThamGiaList.map((nguoi) => (
                      <tr key={nguoi.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {nguoi.stt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {nguoi.ho_ten}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {nguoi.so_cccd || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {nguoi.ngay_sinh ? new Date(nguoi.ngay_sinh).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {nguoi.gioi_tinh || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(nguoi.tien_dong_thuc_te || nguoi.tien_dong)}
                          {nguoi.tien_dong_thuc_te && nguoi.tien_dong && nguoi.tien_dong_thuc_te !== nguoi.tien_dong && (
                            <div className="text-xs text-gray-500 mt-1">
                              Hiển thị: {formatCurrency(nguoi.tien_dong)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeKhaiDetailModal;
