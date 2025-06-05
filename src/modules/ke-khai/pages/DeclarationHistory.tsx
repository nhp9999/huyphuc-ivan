import React, { useState, useEffect } from 'react';
import { History, FileText, Calendar, User, Eye, Download, Filter, Search, RefreshCw, CreditCard, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { DanhSachKeKhai, DanhSachNguoiThamGia } from '../../../shared/services/api/supabaseClient';
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';

interface ParticipantWithKeKhai extends DanhSachNguoiThamGia {
  ke_khai: DanhSachKeKhai;
}

const DeclarationHistory: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // State
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<ParticipantWithKeKhai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'BHYT' | 'BHXH'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'submitted' | 'approved' | 'rejected' | 'processing' | 'paid'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // 20 items per page

  // Load data
  const loadParticipantsData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // SECURITY FIX: Tạm thời force filter theo created_by để đảm bảo bảo mật
      const FORCE_USER_FILTER = true; // Set false khi đã fix logic admin

      // Lấy tất cả kê khai của user
      let keKhaiList: any[] = [];
      if (FORCE_USER_FILTER) {
        console.log('🔒 SECURITY: Force filtering by user ID for security in DeclarationHistory');
        keKhaiList = await keKhaiService.getKeKhaiList({
          created_by: user.id
        });
      } else {
        const isAdmin = await keKhaiService.isUserAdmin(user.id);
        if (isAdmin) {
          keKhaiList = await keKhaiService.getKeKhaiListForAdmin({});
        } else {
          keKhaiList = await keKhaiService.getKeKhaiList({
            created_by: user.id
          });
        }
      }

      // Lấy tất cả người tham gia từ các kê khai này
      const allParticipants: ParticipantWithKeKhai[] = [];

      for (const keKhai of keKhaiList) {
        try {
          const nguoiThamGiaList = await keKhaiService.getNguoiThamGiaByKeKhai(keKhai.id);

          // Thêm thông tin kê khai vào mỗi người tham gia
          const participantsWithKeKhai = nguoiThamGiaList.map(participant => ({
            ...participant,
            ke_khai: keKhai
          }));

          allParticipants.push(...participantsWithKeKhai);
        } catch (error) {
          console.error(`Error loading participants for ke khai ${keKhai.id}:`, error);
        }
      }

      // Sắp xếp theo ngày tạo mới nhất
      allParticipants.sort((a, b) =>
        new Date(b.ke_khai.created_at || '').getTime() - new Date(a.ke_khai.created_at || '').getTime()
      );

      console.log('💰 DeclarationHistory: Sample participant payment data:', allParticipants.slice(0, 3).map(p => ({
        ho_ten: p.ho_ten,
        tien_dong: p.tien_dong,
        tien_dong_thuc_te: p.tien_dong_thuc_te,
        ke_khai_id: p.ke_khai_id
      })));

      setParticipants(allParticipants);
    } catch (error) {
      console.error('Error loading participants data:', error);
      showToast('Không thể tải lịch sử kê khai', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user?.id) {
      loadParticipantsData();
    }
  }, [user?.id]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending_payment':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Nháp';
      case 'submitted':
        return 'Đã nộp';
      case 'processing':
        return 'Đang xử lý';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending_payment':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      default:
        return status;
    }
  };

  // Filter participants
  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.ke_khai.ma_ke_khai.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (participant.ke_khai.ma_ho_so && participant.ke_khai.ma_ho_so.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (participant.ma_so_bhxh && participant.ma_so_bhxh.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || participant.ke_khai.loai_ke_khai === filterType;
    const matchesStatus = filterStatus === 'all' || participant.ke_khai.trang_thai === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredParticipants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <History className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử kê khai</h1>
              <p className="text-gray-600 dark:text-gray-400">Chi tiết từng người tham gia BHYT</p>
            </div>
          </div>

          <button
            onClick={loadParticipantsData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã kê khai, mã hồ sơ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả loại</option>
            <option value="BHYT">BHYT</option>
            <option value="BHXH">BHXH</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="submitted">Đã nộp</option>
            <option value="processing">Đang xử lý</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="paid">Đã thanh toán</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalItems} người tham gia • Trang {currentPage}/{totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mã kê khai / Mã hồ sơ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mã số BHXH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Số tiền đóng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày nộp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentParticipants.map((participant) => (
                  <tr key={`${participant.ke_khai.id}-${participant.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="text-gray-400 mr-2" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {participant.ke_khai.ma_ke_khai}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {participant.ke_khai.loai_ke_khai}
                          </div>
                          {participant.ke_khai.ma_ho_so && (
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-mono mt-1">
                              HS: {participant.ke_khai.ma_ho_so}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="text-gray-400 mr-2" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {participant.ho_ten}
                          </div>
                          {participant.so_dien_thoai && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {participant.so_dien_thoai}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {participant.ma_so_bhxh || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {participant.ngay_sinh ? new Date(participant.ngay_sinh).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {participant.tien_dong_thuc_te ? formatCurrency(participant.tien_dong_thuc_te) :
                           participant.tien_dong ? formatCurrency(participant.tien_dong) : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.ke_khai.trang_thai)}`}>
                        {getStatusText(participant.ke_khai.trang_thai)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {participant.ke_khai.created_at ? new Date(participant.ke_khai.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {participant.ke_khai.updated_at && participant.ke_khai.trang_thai !== 'draft' ?
                            new Date(participant.ke_khai.updated_at).toLocaleDateString('vi-VN') :
                            <span className="text-gray-400 dark:text-gray-500 text-xs">Chưa nộp</span>
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết kê khai"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Tải xuống"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalItems === 0 && (
          <div className="text-center py-12">
            <History className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có người tham gia nào</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Không tìm thấy người tham gia nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalItems > 0 && totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)} trong tổng số {totalItems} người tham gia
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeclarationHistory;
