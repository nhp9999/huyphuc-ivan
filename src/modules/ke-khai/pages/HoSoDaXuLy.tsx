import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  RefreshCw,
  Filter,
  FileCheck,
  DollarSign,
  Image,
  User,
  Users,
  ChevronDown,
  ChevronRight,
  Building
} from 'lucide-react';
import { DanhSachKeKhai, DanhSachNguoiThamGia, ThanhToan } from '../../../shared/services/api/supabaseClient';
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';

import { useToast } from '../../../shared/hooks/useToast';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import PaymentQRModal from '../components/PaymentQRModal';
import PaymentProofModal from '../components/PaymentProofModal';
import paymentService from '../services/paymentService';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import { useAuth } from '../../auth';

// Interface for processed participant with declaration info
interface ProcessedParticipant extends DanhSachNguoiThamGia {
  ke_khai: DanhSachKeKhai;
}

const HoSoDaXuLy: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // State
  const [loading, setLoading] = useState(false);
  const [participantsList, setParticipantsList] = useState<ProcessedParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [itemsPerPage] = useState(20);
  const [expandedDeclarations, setExpandedDeclarations] = useState<Set<number>>(new Set());
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);

  // Load processed participants data
  const loadProcessedParticipantsData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      console.log('HoSoDaXuLy: Loading processed participants with params:', {
        userId: user.id,
        page: currentPage,
        pageSize: itemsPerPage,
        searchTerm,
        filterStatus,
        filterPaymentStatus
      });

      // Load processed participants using the new service method
      const result = await keKhaiService.getProcessedNguoiThamGiaWithPagination({
        userId: user.id,
        page: currentPage,
        pageSize: itemsPerPage,
        loaiKeKhai: '603', // Focus on KeKhai603
        searchTerm: searchTerm || undefined,
        participantStatus: filterStatus !== 'all' ? filterStatus : undefined,
        paymentStatus: filterPaymentStatus !== 'all' ? filterPaymentStatus : undefined
      });

      console.log('HoSoDaXuLy: Loaded processed participants:', result.data.length, 'of', result.total);

      setParticipantsList(result.data);
      setTotalParticipants(result.total);
    } catch (error) {
      console.error('Error loading processed participants data:', error);
      showToast('Không thể tải danh sách người tham gia đã xử lý', 'error');
      setParticipantsList([]);
      setTotalParticipants(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterPaymentStatus]);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadProcessedParticipantsData();
  }, [user?.id, searchTerm, filterStatus, filterPaymentStatus, currentPage]);

  // Listen for payment confirmation events to auto-reload data
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('HoSoDaXuLy: Payment confirmed event received', data);
      loadProcessedParticipantsData();
      showToast('Kê khai đã được cập nhật trạng thái', 'success');
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      console.log('HoSoDaXuLy: Ke khai status changed event received', data);
      loadProcessedParticipantsData();
    };

    const handleRefreshAllPages = (data: any) => {
      console.log('HoSoDaXuLy: Refresh all pages event received', data);
      loadProcessedParticipantsData();
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_HO_SO_DA_XU_LY, loadProcessedParticipantsData);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_HO_SO_DA_XU_LY, loadProcessedParticipantsData);
    };
  }, []);

  // Get status badge for declaration status
  const getDeclarationStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <RefreshCw className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <CreditCard className="w-3 h-3 mr-1" />
            Đã thanh toán
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
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
            <FileText className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  // Get status badge for participant status
  const getParticipantStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            ✓ Đã nộp
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Đang xử lý
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✓ Đã duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            ✗ Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            Nháp
          </span>
        );
    }
  };

  // Get payment status badge
  const getPaymentStatusBadge = (paymentStatus?: string) => {
    switch (paymentStatus) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✓ Đã thanh toán
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            ⏳ Chờ thanh toán
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            ✗ Thất bại
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            ✗ Đã hủy
          </span>
        );
      case 'unpaid':
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            Chưa thanh toán
          </span>
        );
    }
  };

  // Toggle declaration expansion
  const toggleDeclarationExpansion = (declarationId: number) => {
    setExpandedDeclarations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(declarationId)) {
        newSet.delete(declarationId);
      } else {
        newSet.add(declarationId);
      }
      return newSet;
    });
  };

  // Handle view details
  const handleViewDetails = (keKhai: DanhSachKeKhai) => {
    setSelectedKeKhai(keKhai);
    setShowDetailModal(true);
  };

  // Handle view participant details
  const handleViewParticipantDetails = (participant: ProcessedParticipant) => {
    const participantInfo = `
Thông tin người tham gia:

Họ tên: ${participant.ho_ten}
Mã BHXH: ${participant.ma_so_bhxh}
Số CCCD: ${participant.so_cccd}
Ngày sinh: ${participant.ngay_sinh}
Giới tính: ${participant.gioi_tinh}
Số điện thoại: ${participant.so_dien_thoai}
Số thẻ BHYT: ${participant.so_the_bhyt}
Nơi đăng ký KCB: ${participant.noi_dang_ky_kcb}
Trạng thái cá nhân: ${participant.participant_status || 'Nháp'}
Trạng thái thanh toán: ${participant.payment_status || 'Chưa thanh toán'}
Ngày nộp: ${participant.submitted_at ? formatDate(participant.submitted_at) : 'Chưa nộp'}
Ngày thanh toán: ${participant.paid_at ? formatDate(participant.paid_at) : 'Chưa thanh toán'}

Thông tin kê khai:
Mã kê khai: ${participant.ke_khai.ma_ke_khai}
Tên kê khai: ${participant.ke_khai.ten_ke_khai}
Trạng thái kê khai: ${participant.ke_khai.trang_thai}
    `.trim();

    alert(participantInfo);
  };

  // Handle view payment
  const handleViewPayment = async (keKhai: DanhSachKeKhai) => {
    try {
      const payment = await paymentService.getPaymentByKeKhaiId(keKhai.id);

      if (payment) {
        setSelectedKeKhai(keKhai);
        setSelectedPayment(payment);
        setShowPaymentModal(true);
      } else {
        showToast('Không tìm thấy thông tin thanh toán', 'warning');
      }
    } catch (error) {
      console.error('Error loading payment:', error);
      showToast('Không thể tải thông tin thanh toán', 'error');
    }
  };

  // Handle view proof
  const handleViewProof = async (keKhai: DanhSachKeKhai) => {
    try {
      const payment = await paymentService.getPaymentByKeKhaiId(keKhai.id);

      if (payment && payment.proof_image_url) {
        setSelectedKeKhai(keKhai);
        setSelectedPayment(payment);
        setShowProofModal(true);
      } else {
        showToast('Không có ảnh chứng từ thanh toán', 'warning');
      }
    } catch (error) {
      console.error('Error loading payment proof:', error);
      showToast('Không thể tải ảnh chứng từ', 'error');
    }
  };

  // Format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-green-600" />
            Người tham gia đã xử lý
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách người tham gia từ các kê khai đang xử lý, đã được duyệt, thanh toán hoặc từ chối
          </p>
        </div>

        <button
          onClick={loadProcessedParticipantsData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã BHXH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Participant Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả trạng thái cá nhân</option>
              <option value="submitted">Đã nộp</option>
              <option value="processing">Đang xử lý</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả trạng thái thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="completed">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            Tìm thấy {totalParticipants} người tham gia
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        ) : participantsList.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có người tham gia đang/đã xử lý
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hiện tại chưa có người tham gia nào đang được xử lý hoặc đã xử lý hoàn tất.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mã BHXH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái cá nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kê khai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái kê khai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày xử lý
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {participantsList.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {participant.ho_ten}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {participant.so_cccd}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {participant.ma_so_bhxh}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getParticipantStatusBadge(participant.participant_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(participant.payment_status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {participant.ke_khai.ma_ke_khai}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {participant.ke_khai.ten_ke_khai}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDeclarationStatusBadge(participant.ke_khai.trang_thai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(
                          participant.submitted_at ||
                          participant.ke_khai.approved_at ||
                          participant.ke_khai.payment_completed_at ||
                          participant.ke_khai.updated_at
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(participant.tien_dong || participant.tien_dong_thuc_te)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewParticipantDetails(participant)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Xem chi tiết người tham gia"
                        >
                          <User className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleViewDetails(participant.ke_khai)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết kê khai"
                        >
                          <Building className="w-4 h-4" />
                        </button>

                        {(participant.ke_khai.trang_thai === 'paid' || participant.ke_khai.trang_thai === 'completed') && (
                          <>
                            <button
                              onClick={() => handleViewPayment(participant.ke_khai)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Xem thanh toán"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleViewProof(participant.ke_khai)}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              title="Xem ảnh chứng từ"
                            >
                              <Image className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalParticipants > itemsPerPage && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalParticipants)} trong tổng số {totalParticipants} người tham gia
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.ceil(totalParticipants / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(totalParticipants / itemsPerPage);
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                  return false;
                })
                .map((page, index, array) => {
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalParticipants / itemsPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil(totalParticipants / itemsPerPage)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showDetailModal && selectedKeKhai && (
        <KeKhaiDetailModal
          keKhai={selectedKeKhai}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedKeKhai(null);
          }}
        />
      )}

      {showPaymentModal && selectedPayment && (
        <PaymentQRModal
          payment={selectedPayment}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedKeKhai(null);
            setSelectedPayment(null);
          }}
          onPaymentConfirmed={() => {
            setShowPaymentModal(false);
            setSelectedKeKhai(null);
            setSelectedPayment(null);
            loadProcessedParticipantsData();
          }}
        />
      )}

      {showProofModal && selectedPayment && (
        <PaymentProofModal
          payment={selectedPayment}
          onClose={() => {
            setShowProofModal(false);
            setSelectedKeKhai(null);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default HoSoDaXuLy;
