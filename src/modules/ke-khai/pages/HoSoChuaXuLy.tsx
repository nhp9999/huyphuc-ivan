import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  CreditCard,
  RefreshCw,
  Filter,
  FileX,
  User,
  Users,
  Building
} from 'lucide-react';
import { DanhSachKeKhai, DanhSachNguoiThamGia, ThanhToan } from '../../../shared/services/api/supabaseClient';

// Interface for unprocessed participant with declaration info
interface UnprocessedParticipant extends DanhSachNguoiThamGia {
  ke_khai: DanhSachKeKhai;
}
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import KeKhaiApprovalModal from '../components/KeKhaiApprovalModal';
import PaymentQRModal from '../components/PaymentQRModal';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import paymentService from '../services/paymentService';

const HoSoChuaXuLy: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // State
  const [loading, setLoading] = useState(false);
  const [participantsList, setParticipantsList] = useState<UnprocessedParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [itemsPerPage] = useState(20);

  // Selection state
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);
  const [submittedParticipants, setSubmittedParticipants] = useState<UnprocessedParticipant[]>([]);

  // Load unprocessed participants data
  const loadUnprocessedParticipantsData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      console.log('HoSoChuaXuLy: Loading unprocessed participants with params:', {
        userId: user.id,
        page: currentPage,
        pageSize: itemsPerPage,
        searchTerm,
        filterStatus
      });

      // Debug: Check user data first
      await keKhaiService.debugUserData(user.id);

      // Load unprocessed participants using the new service method
      const result = await keKhaiService.getUnprocessedNguoiThamGiaWithPagination({
        userId: user.id,
        page: currentPage,
        pageSize: itemsPerPage,
        // loaiKeKhai: '603', // Tạm thời bỏ filter để test
        searchTerm: searchTerm || undefined,
        participantStatus: filterStatus !== 'all' ? filterStatus : undefined
      });

      console.log('HoSoChuaXuLy: Loaded unprocessed participants:', result.data.length, 'of', result.total);

      setParticipantsList(result.data);
      setTotalParticipants(result.total);
    } catch (error) {
      console.error('Error loading unprocessed participants data:', error);
      showToast('Không thể tải danh sách người tham gia chưa xử lý', 'error');
      setParticipantsList([]);
      setTotalParticipants(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedParticipants(new Set()); // Clear selection when filters change
  }, [searchTerm, filterStatus]);

  // Clear selection when page changes
  useEffect(() => {
    setSelectedParticipants(new Set());
  }, [currentPage]);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadUnprocessedParticipantsData();
  }, [user?.id, searchTerm, filterStatus, currentPage]);

  // Listen for payment confirmation events to auto-reload data
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('HoSoChuaXuLy: Payment confirmed event received', data);
      loadUnprocessedParticipantsData();
      showToast('Kê khai đã được chuyển sang xử lý sau thanh toán', 'success');
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      console.log('HoSoChuaXuLy: Ke khai status changed event received', data);
      loadUnprocessedParticipantsData();
    };

    const handleRefreshAllPages = (data: any) => {
      console.log('HoSoChuaXuLy: Refresh all pages event received', data);
      loadUnprocessedParticipantsData();
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_HO_SO_CHUA_XU_LY, loadUnprocessedParticipantsData);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_HO_SO_CHUA_XU_LY, loadUnprocessedParticipantsData);
    };
  }, []);

  // Get status badge for declaration status
  const getDeclarationStatusBadge = (status: string) => {
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
      case 'pending_payment':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <CreditCard className="w-3 h-3 mr-1" />
            Chờ thanh toán
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

  // Handle view details
  const handleViewDetails = (keKhai: DanhSachKeKhai) => {
    setSelectedKeKhai(keKhai);
    setShowDetailModal(true);
  };

  // Handle view participant details
  const handleViewParticipantDetails = (participant: UnprocessedParticipant) => {
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
Ngày nộp: ${participant.submitted_at ? formatDate(participant.submitted_at) : 'Chưa nộp'}

Thông tin kê khai:
Mã kê khai: ${participant.ke_khai.ma_ke_khai}
Tên kê khai: ${participant.ke_khai.ten_ke_khai}
Trạng thái kê khai: ${participant.ke_khai.trang_thai}
    `.trim();

    alert(participantInfo);
  };

  // Handle approve
  const handleApprove = (keKhai: DanhSachKeKhai) => {
    setSelectedKeKhai(keKhai);
    setShowApprovalModal(true);
  };

  // Handle payment
  const handlePayment = async (keKhai: DanhSachKeKhai) => {
    try {
      // Check if payment already exists
      const existingPayment = await paymentService.getPaymentByKeKhaiId(keKhai.id);

      if (existingPayment) {
        setSelectedKeKhai(keKhai);
        setSelectedPayment(existingPayment);
        setShowPaymentModal(true);
      } else {
        showToast('Chưa có thông tin thanh toán cho kê khai này', 'warning');
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      showToast('Không thể kiểm tra thông tin thanh toán', 'error');
    }
  };

  // Handle approval success
  const handleApprovalSuccess = () => {
    setShowApprovalModal(false);
    setSelectedKeKhai(null);
    loadUnprocessedParticipantsData();
    showToast('Đã duyệt kê khai thành công', 'success');
  };

  // Handle participant selection
  const handleParticipantSelect = (participantId: number, checked: boolean) => {
    const newSelected = new Set(selectedParticipants);
    if (checked) {
      newSelected.add(participantId);
    } else {
      newSelected.delete(participantId);
    }
    setSelectedParticipants(newSelected);
  };

  // Handle select all participants on current page
  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedParticipants);
    const draftParticipants = getDraftParticipants();

    if (checked) {
      draftParticipants.forEach(p => newSelected.add(p.id));
    } else {
      draftParticipants.forEach(p => newSelected.delete(p.id));
    }
    setSelectedParticipants(newSelected);
  };

  // Handle submit selected participants
  const handleSubmitSelected = async () => {
    const selectedDraftParticipants = getDraftParticipants()
      .filter(p => selectedParticipants.has(p.id));

    if (selectedDraftParticipants.length === 0) {
      showToast('Vui lòng chọn ít nhất một người tham gia nháp để nộp', 'warning');
      return;
    }

    // Store selected participants for payment confirmation
    setSubmittedParticipants(selectedDraftParticipants);
    setShowPaymentConfirmModal(true);
  };

  // Handle confirm submission (with or without payment)
  const handleConfirmSubmission = async (createPayment: boolean = false) => {
    setIsSubmitting(true);
    setShowPaymentConfirmModal(false);

    try {
      const selectedIds = submittedParticipants.map(p => p.id);
      console.log('Submitting participants:', selectedIds);

      // Update participant status to 'submitted'
      for (const participantId of selectedIds) {
        try {
          // Test update first
          console.log(`🧪 Testing update for participant ${participantId}...`);
          const testResult = await keKhaiService.testUpdateParticipant(participantId);
          console.log(`🧪 Test result:`, testResult);

          if (!testResult.success) {
            throw new Error(`Test update failed: ${testResult.error?.message || 'Unknown error'}`);
          }

          // Now do the actual update
          await keKhaiService.updateParticipantStatus(
            participantId,
            'submitted',
            user?.id || '',
            'Nộp cá nhân từ giao diện người tham gia nháp'
          );
          console.log(`✅ Successfully updated participant ${participantId}`);
        } catch (participantError) {
          console.error(`❌ Failed to update participant ${participantId}:`, participantError);
          throw new Error(`Không thể cập nhật người tham gia ID ${participantId}: ${participantError.message}`);
        }
      }

      showToast(`Đã nộp thành công ${selectedIds.length} người tham gia`, 'success');
      setSelectedParticipants(new Set());

      // If user wants to create payment immediately
      if (createPayment) {
        await handleCreatePaymentForSubmitted();
      }

      loadUnprocessedParticipantsData();
    } catch (error) {
      console.error('Error submitting participants:', error);
      showToast('Có lỗi xảy ra khi nộp người tham gia', 'error');
    } finally {
      setIsSubmitting(false);
      setSubmittedParticipants([]);
    }
  };

  // Handle create payment for submitted participants
  const handleCreatePaymentForSubmitted = async () => {
    try {
      // Calculate total amount for submitted participants
      const totalAmount = submittedParticipants.reduce((sum, participant) => {
        return sum + (participant.tien_dong || participant.tien_dong_thuc_te || 0);
      }, 0);

      if (totalAmount <= 0) {
        showToast('Không thể tạo thanh toán: Số tiền không hợp lệ', 'error');
        return;
      }

      // Get the first participant's ke_khai for payment creation
      const firstParticipant = submittedParticipants[0];
      if (!firstParticipant?.ke_khai) {
        showToast('Không thể tạo thanh toán: Không tìm thấy thông tin kê khai', 'error');
        return;
      }

      // Create payment
      const payment = await paymentService.createPayment({
        ke_khai_id: firstParticipant.ke_khai.id,
        so_tien: totalAmount,
        phuong_thuc_thanh_toan: 'bank_transfer',
        payment_description: `Thanh toán cho ${submittedParticipants.length} người tham gia`,
        created_by: user?.id
      });

      // Show payment QR modal
      setSelectedKeKhai(firstParticipant.ke_khai);
      setSelectedPayment(payment);
      setShowPaymentModal(true);

      showToast('Đã tạo thanh toán thành công', 'success');
    } catch (error) {
      console.error('Error creating payment:', error);
      showToast('Có lỗi xảy ra khi tạo thanh toán', 'error');
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

  // Helper functions for selection
  const getDraftParticipants = () => participantsList.filter(p => p.participant_status === 'draft');
  const getSelectedDraftCount = () => getDraftParticipants().filter(p => selectedParticipants.has(p.id)).length;
  const getTotalDraftCount = () => getDraftParticipants().length;
  const getSelectedAmount = () => {
    return getDraftParticipants()
      .filter(p => selectedParticipants.has(p.id))
      .reduce((sum, p) => sum + (p.tien_dong || p.tien_dong_thuc_te || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-orange-600" />
            Người tham gia nháp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách người tham gia từ các kê khai đang ở trạng thái nháp
          </p>
        </div>

        <button
          onClick={loadUnprocessedParticipantsData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả người tham gia</option>
              <option value="draft">Nháp</option>
              <option value="submitted">Đã nộp</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            Tìm thấy {totalParticipants} người tham gia ({getTotalDraftCount()} có thể nộp)
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedParticipants.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <div className="font-medium">
                  Đã chọn {getSelectedDraftCount()} / {getTotalDraftCount()} người tham gia nháp
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Tổng tiền: {formatCurrency(getSelectedAmount())}
                </div>
              </div>
              <button
                onClick={() => setSelectedParticipants(new Set())}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Bỏ chọn tất cả
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubmitSelected}
                disabled={isSubmitting || getSelectedDraftCount() === 0}
                title={getSelectedDraftCount() === 0 ? 'Vui lòng chọn ít nhất một người tham gia' : `Nộp ${getSelectedDraftCount()} người tham gia và tạo thanh toán ${formatCurrency(getSelectedAmount())}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang nộp...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Nộp & Thanh toán
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
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
              Không có người tham gia nháp
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hiện tại không có người tham gia từ các kê khai đang ở trạng thái nháp.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={getTotalDraftCount() > 0 && getSelectedDraftCount() === getTotalDraftCount()}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = getSelectedDraftCount() > 0 && getSelectedDraftCount() < getTotalDraftCount();
                          }
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="ml-2">Chọn</span>
                    </div>
                  </th>
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
                    Kê khai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái kê khai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày tạo
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
                  <tr
                    key={participant.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedParticipants.has(participant.id)
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.participant_status === 'draft' ? (
                        <input
                          type="checkbox"
                          checked={selectedParticipants.has(participant.id)}
                          onChange={(e) => handleParticipantSelect(participant.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
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
                        {formatDate(participant.ke_khai.created_at)}
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

                        {participant.ke_khai.trang_thai === 'draft' && (
                          <button
                            onClick={() => handleViewDetails(participant.ke_khai)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Chỉnh sửa nháp"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}

                        {participant.ke_khai.trang_thai === 'submitted' && (
                          <button
                            onClick={() => handleApprove(participant.ke_khai)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Duyệt kê khai"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {participant.ke_khai.trang_thai === 'pending_payment' && (
                          <button
                            onClick={() => handlePayment(participant.ke_khai)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Xem thanh toán"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
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

      {/* Payment Confirmation Modal */}
      {showPaymentConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Xác nhận nộp hồ sơ
              </h3>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Bạn đang nộp <span className="font-semibold text-blue-600">{submittedParticipants.length} người tham gia</span>.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Thông tin thanh toán:</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Số tiền: <span className="font-semibold text-green-600">
                      {formatCurrency(submittedParticipants.reduce((sum, p) => sum + (p.tien_dong || p.tien_dong_thuc_te || 0), 0))}
                    </span></p>
                    <p>Số người: {submittedParticipants.length} người tham gia</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bạn có muốn tạo thanh toán ngay sau khi nộp không?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentConfirmModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleConfirmSubmission(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang nộp...' : 'Chỉ nộp'}
                </button>
                <button
                  onClick={() => handleConfirmSubmission(true)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Nộp & Thanh toán'}
                </button>
              </div>
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

      {showApprovalModal && selectedKeKhai && (
        <KeKhaiApprovalModal
          keKhai={selectedKeKhai}
          action="approve"
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedKeKhai(null);
          }}
          onSuccess={handleApprovalSuccess}
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
            showToast('Thanh toán đã được xác nhận thành công', 'success');
            loadUnprocessedParticipantsData();
          }}
        />
      )}
    </div>
  );
};

export default HoSoChuaXuLy;
