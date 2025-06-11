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
  Building,
  MapPin,
  Hash,
  FileCheck,
  Briefcase
} from 'lucide-react';
import {
  DanhSachKeKhai,
  DanhSachNguoiThamGia,
  ThanhToan,
  supabase,
  VDonViChiTiet,
  VDaiLyChiTiet,
  VCoQuanBhxhChiTiet
} from '../../../shared/services/api/supabaseClient';

// Interface for unprocessed participant with declaration info
interface UnprocessedParticipant extends DanhSachNguoiThamGia {
  ke_khai: DanhSachKeKhai;
}
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';
import { donViService } from '../../quan-ly/services/donViService';
import { daiLyService } from '../../quan-ly/services/daiLyService';
import { coQuanBhxhService } from '../../quan-ly/services/coQuanBhxhService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import KeKhaiApprovalModal from '../components/KeKhaiApprovalModal';
import PaymentQRModal from '../components/PaymentQRModal';
import BhxhCheckButton from '../components/BhxhCheckButton';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import paymentService from '../services/paymentService';

const HoSoChuaXuLy: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { setCurrentPage: navigateToPage } = useNavigation();
  
  // State
  const [loading, setLoading] = useState(false);
  const [participantsList, setParticipantsList] = useState<UnprocessedParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [itemsPerPage] = useState(20);

  // Advanced filter states
  const [maDonVi, setMaDonVi] = useState('');
  const [maTinh, setMaTinh] = useState('');
  const [maHuyen, setMaHuyen] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [maBhxh, setMaBhxh] = useState('');
  const [ketQua, setKetQua] = useState('all');
  const [daiLyId, setDaiLyId] = useState('');
  const [coQuanBhxhId, setCoQuanBhxhId] = useState('');
  const [hinhThuc, setHinhThuc] = useState('all');
  const [soHoSo, setSoHoSo] = useState('');

  // Data for dropdowns
  const [donViList, setDonViList] = useState<VDonViChiTiet[]>([]);
  const [daiLyList, setDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [coQuanBhxhList, setCoQuanBhxhList] = useState<VCoQuanBhxhChiTiet[]>([]);
  const [tinhList, setTinhList] = useState<any[]>([]);
  const [huyenList, setHuyenList] = useState<any[]>([]);

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
  const [pendingPaymentParticipants, setPendingPaymentParticipants] = useState<UnprocessedParticipant[]>([]);

  // Context menu states
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    participant: UnprocessedParticipant | null;
  }>({
    show: false,
    x: 0,
    y: 0,
    participant: null
  });

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
        filterStatus,
        maDonVi,
        maTinh,
        maHuyen,
        fromDate,
        toDate,
        maBhxh,
        ketQua,
        daiLyId,
        coQuanBhxhId,
        hinhThuc,
        soHoSo
      });

      // Debug: Check user data first
      await keKhaiService.debugUserData(user.id);

      // Load unprocessed participants using the new service method with advanced filters
      const result = await keKhaiService.getUnprocessedNguoiThamGiaWithPagination({
        userId: user.id,
        page: currentPage,
        pageSize: itemsPerPage,
        // loaiKeKhai: '603', // Tạm thời bỏ filter để test
        searchTerm: searchTerm || undefined,
        participantStatus: filterStatus !== 'all' ? filterStatus : undefined,
        // Advanced filters
        maDonVi: maDonVi || undefined,
        maTinh: maTinh || undefined,
        maHuyen: maHuyen || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        maBhxh: maBhxh || undefined,
        ketQua: ketQua !== 'all' ? ketQua : undefined,
        daiLyId: daiLyId || undefined,
        coQuanBhxhId: coQuanBhxhId || undefined,
        hinhThuc: hinhThuc !== 'all' ? hinhThuc : undefined,
        soHoSo: soHoSo || undefined
      });

      // Filter out participants with 'submitted' or 'processing' status (đã nộp lên công ty hoặc đang xử lý) from frontend
      const filteredData = result.data.filter(participant =>
        participant.participant_status !== 'submitted' &&
        participant.participant_status !== 'processing'
      );

      console.log('HoSoChuaXuLy: Filtered out processing participants:', result.data.length - filteredData.length);
      console.log('HoSoChuaXuLy: Loaded unprocessed participants:', filteredData.length, 'of', result.total);

      setParticipantsList(filteredData);
      setTotalParticipants(filteredData.length); // Update total to reflect filtered count

      // Log unique filter options for debugging
      if (filteredData.length > 0) {
        getUniqueFilterOptions();
      }
    } catch (error) {
      console.error('Error loading unprocessed participants data:', error);
      showToast('Không thể tải danh sách người tham gia chưa xử lý', 'error');
      setParticipantsList([]);
      setTotalParticipants(0);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values from current data for filter options
  const getUniqueFilterOptions = () => {
    const uniqueStatuses = [...new Set(participantsList.map(p => p.participant_status).filter(Boolean))];
    const uniqueKeKhaiStatuses = [...new Set(participantsList.map(p => p.ke_khai.trang_thai).filter(Boolean))];
    const uniqueDonViIds = [...new Set(participantsList.map(p => p.ke_khai.don_vi_id).filter(Boolean))];
    const uniqueTinh = [...new Set(participantsList.map(p => p.ma_tinh_nkq).filter(Boolean))];
    // Note: payment_status might not be available in all cases, so we'll use optional chaining
    const uniquePaymentStatuses = [...new Set(participantsList.map(p => (p as any).payment_status).filter(Boolean))];

    console.log('📊 Unique filter options from data:', {
      participantStatuses: uniqueStatuses,
      keKhaiStatuses: uniqueKeKhaiStatuses,
      donViIds: uniqueDonViIds,
      tinh: uniqueTinh,
      paymentStatuses: uniquePaymentStatuses
    });

    return {
      participantStatuses: uniqueStatuses,
      keKhaiStatuses: uniqueKeKhaiStatuses,
      donViIds: uniqueDonViIds,
      tinh: uniqueTinh,
      paymentStatuses: uniquePaymentStatuses
    };
  };

  // Load dropdown data
  const loadDropdownData = async () => {
    try {
      // Load đơn vị
      const donViData = await donViService.getAllDonVi();
      setDonViList(donViData);

      // Load đại lý
      const daiLyData = await daiLyService.getAllDaiLy();
      setDaiLyList(daiLyData);

      // Load cơ quan BHXH
      const coQuanData = await coQuanBhxhService.getCoQuanBhxhChiTiet();
      setCoQuanBhxhList(coQuanData);

      // Load tỉnh thành (mock data - có thể thay bằng API thực tế)
      const mockTinhList = [
        { ma: '01', ten: 'Hà Nội' },
        { ma: '79', ten: 'TP. Hồ Chí Minh' },
        { ma: '48', ten: 'Đà Nẵng' },
        { ma: '92', ten: 'Cần Thơ' },
        { ma: '31', ten: 'Hải Phòng' },
        { ma: '89', ten: 'An Giang' }
      ];
      setTinhList(mockTinhList);

    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  // Load huyện based on selected tỉnh
  const loadHuyenData = async (maTinhSelected: string) => {
    try {
      // Mock data - có thể thay bằng API thực tế
      const mockHuyenList = [
        { ma: '001', ten: 'Quận Ba Đình', ma_tinh: '01' },
        { ma: '002', ten: 'Quận Hoàn Kiếm', ma_tinh: '01' },
        { ma: '003', ten: 'Quận Tây Hồ', ma_tinh: '01' },
        { ma: '760', ten: 'Quận 1', ma_tinh: '79' },
        { ma: '761', ten: 'Quận 3', ma_tinh: '79' },
        { ma: '762', ten: 'Quận 4', ma_tinh: '79' }
      ];

      const filteredHuyen = mockHuyenList.filter(h => h.ma_tinh === maTinhSelected);
      setHuyenList(filteredHuyen);
    } catch (error) {
      console.error('Error loading huyen data:', error);
    }
  };

  // Load dropdown data on component mount
  useEffect(() => {
    loadDropdownData();
  }, []);

  // Load huyện when tỉnh changes
  useEffect(() => {
    if (maTinh) {
      loadHuyenData(maTinh);
    } else {
      setHuyenList([]);
      setMaHuyen(''); // Reset huyện when tỉnh is cleared
    }
  }, [maTinh]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedParticipants(new Set()); // Clear selection when filters change
  }, [searchTerm, filterStatus, maDonVi, maTinh, maHuyen, fromDate, toDate, maBhxh, ketQua, daiLyId, coQuanBhxhId, hinhThuc, soHoSo]);

  // Clear selection when page changes
  useEffect(() => {
    setSelectedParticipants(new Set());
  }, [currentPage]);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadUnprocessedParticipantsData();
  }, [user?.id, searchTerm, filterStatus, currentPage, maDonVi, maTinh, maHuyen, fromDate, toDate, maBhxh, ketQua, daiLyId, coQuanBhxhId, hinhThuc, soHoSo]);

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

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        closeContextMenu();
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contextMenu.show) {
        closeContextMenu();
      }
    };

    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [contextMenu.show]);

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
            <Clock className="w-3 h-3 mr-1" />
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
            ✓ Đã nộp lên công ty
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            🔄 Đang xử lý
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

  // Handle view details - Navigate to form page
  const handleViewDetails = (keKhai: DanhSachKeKhai) => {
    // Navigate to the form page with the keKhaiId to view/edit
    navigateToPage('ke-khai-603-form', {
      declarationCode: '603',
      declarationName: 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT',
      keKhaiId: keKhai.id
    });
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

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, participant: UnprocessedParticipant) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      participant
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({
      show: false,
      x: 0,
      y: 0,
      participant: null
    });
  };

  // Handle context menu actions
  const handleContextMenuAction = (action: string, participant: UnprocessedParticipant) => {
    closeContextMenu();

    switch (action) {
      case 'view-participant':
        handleViewParticipantDetails(participant);
        break;
      case 'view-kekhai':
        handleViewDetails(participant.ke_khai);
        break;
      case 'approve':
        handleApprove(participant.ke_khai);
        break;
      case 'payment':
        handlePayment(participant.ke_khai);
        break;
      case 'select':
        handleParticipantSelect(participant.id, !selectedParticipants.has(participant.id));
        break;
      default:
        break;
    }
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
        // If no payment exists and ke khai is submitted, create payment
        if (keKhai.trang_thai === 'submitted') {
          await handleCreatePaymentForSubmittedKeKhai(keKhai);
        } else {
          showToast('Chưa có thông tin thanh toán cho kê khai này', 'warning');
        }
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
    const selectableParticipants = getSelectableParticipants();

    if (checked) {
      selectableParticipants.forEach(p => newSelected.add(p.id));
    } else {
      selectableParticipants.forEach(p => newSelected.delete(p.id));
    }
    setSelectedParticipants(newSelected);
  };

  // Handle submit selected participants
  const handleSubmitSelected = async () => {
    const selectedDraftParticipants = getDraftParticipants()
      .filter(p => selectedParticipants.has(p.id));
    const selectedSubmittedParticipants = getSubmittedParticipants()
      .filter(p => selectedParticipants.has(p.id));
    const selectedPendingPaymentParticipants = getPendingPaymentParticipants()
      .filter(p => selectedParticipants.has(p.id));

    const totalSelected = selectedDraftParticipants.length + selectedSubmittedParticipants.length + selectedPendingPaymentParticipants.length;

    if (totalSelected === 0) {
      showToast('Vui lòng chọn ít nhất một người tham gia', 'warning');
      return;
    }

    // If only draft participants are selected, proceed with normal submission
    if (selectedDraftParticipants.length > 0 && selectedSubmittedParticipants.length === 0 && selectedPendingPaymentParticipants.length === 0) {
      setSubmittedParticipants(selectedDraftParticipants);
      setShowPaymentConfirmModal(true);
      return;
    }

    // If only submitted participants are selected, create payment directly
    if (selectedDraftParticipants.length === 0 && selectedSubmittedParticipants.length > 0 && selectedPendingPaymentParticipants.length === 0) {
      await handleCreatePaymentForSelectedSubmitted(selectedSubmittedParticipants);
      return;
    }

    // If only pending payment participants are selected, show existing payment
    if (selectedDraftParticipants.length === 0 && selectedSubmittedParticipants.length === 0 && selectedPendingPaymentParticipants.length > 0) {
      await handleViewPaymentForSelectedPendingPayment(selectedPendingPaymentParticipants);
      return;
    }

    // If mixed types are selected, show error
    showToast('Không thể xử lý cùng lúc người tham gia ở các trạng thái khác nhau. Vui lòng chọn một loại', 'warning');
  };

  // Check if we need to create new declaration for partial submission
  const checkIfNeedsNewDeclaration = async (selectedParticipants: UnprocessedParticipant[]): Promise<boolean> => {
    try {
      if (selectedParticipants.length === 0) return false;

      // Group participants by ke_khai_id
      const participantsByKeKhai = selectedParticipants.reduce((acc, participant) => {
        const keKhaiId = participant.ke_khai.id;
        if (!acc[keKhaiId]) {
          acc[keKhaiId] = [];
        }
        acc[keKhaiId].push(participant);
        return acc;
      }, {} as Record<number, UnprocessedParticipant[]>);

      // Check each ke_khai to see if we're submitting all participants
      for (const [keKhaiIdStr, selectedFromKeKhai] of Object.entries(participantsByKeKhai)) {
        const keKhaiId = parseInt(keKhaiIdStr);

        // Get total participants in this ke_khai
        const allParticipantsInKeKhai = participantsList.filter(p => p.ke_khai.id === keKhaiId);

        // If we're not submitting all participants from this ke_khai, we need new declaration
        if (selectedFromKeKhai.length < allParticipantsInKeKhai.length) {
          console.log(`🔍 Partial submission detected for ke_khai ${keKhaiId}: ${selectedFromKeKhai.length}/${allParticipantsInKeKhai.length} participants`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking if needs new declaration:', error);
      return false;
    }
  };

  // Handle create new declaration and submit for partial submission
  const handleCreateNewDeclarationAndSubmit = async (selectedParticipants: UnprocessedParticipant[]) => {
    try {
      if (!user?.id) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Group participants by ke_khai_id
      const participantsByKeKhai = selectedParticipants.reduce((acc, participant) => {
        const keKhaiId = participant.ke_khai.id;
        if (!acc[keKhaiId]) {
          acc[keKhaiId] = {
            keKhai: participant.ke_khai,
            participants: []
          };
        }
        acc[keKhaiId].participants.push(participant);
        return acc;
      }, {} as Record<number, { keKhai: DanhSachKeKhai, participants: UnprocessedParticipant[] }>);

      // Process each ke_khai separately
      for (const [keKhaiIdStr, data] of Object.entries(participantsByKeKhai)) {
        const keKhaiId = parseInt(keKhaiIdStr);
        const { keKhai, participants } = data;

        console.log(`🚀 Creating new declaration for ${participants.length} participants from ke_khai ${keKhaiId}`);

        // Create new declaration and move participants
        const result = await keKhaiService.createDeclarationAndMoveParticipants(
          keKhaiId,
          participants.map(p => p.id),
          user.id,
          `Tách từ kê khai ${keKhai.ma_ke_khai} - ${participants.length} người tham gia`
        );

        console.log(`✅ Created new declaration ${result.newKeKhai.ma_ke_khai} with ${result.movedParticipants.length} participants`);

        // Calculate total amount for new declaration
        const totalAmount = result.movedParticipants.reduce((sum, participant) => {
          return sum + (participant.tien_dong_thuc_te || participant.tien_dong || 0);
        }, 0);

        if (totalAmount <= 0) {
          throw new Error('Số tiền thanh toán không hợp lệ');
        }

        // Create payment for new declaration
        const payment = await paymentService.createPayment({
          ke_khai_id: result.newKeKhai.id,
          so_tien: totalAmount,
          phuong_thuc_thanh_toan: 'qr_code',
          payment_description: `Thanh toán kê khai mới ${result.newKeKhai.ma_ke_khai} - ${result.movedParticipants.length} người tham gia`,
          created_by: user.id
        });

        // Update payment_id for participants
        for (const participant of result.movedParticipants) {
          try {
            await supabase
              .from('danh_sach_nguoi_tham_gia')
              .update({
                payment_id: payment.id,
                payment_status: 'pending',
                updated_at: new Date().toISOString()
              })
              .eq('id', participant.id);
            console.log(`✅ Updated payment_id for participant ${participant.id}`);
          } catch (error) {
            console.error(`❌ Failed to update payment_id for participant ${participant.id}:`, error);
          }
        }

        // Save participants for later status update when payment is confirmed
        // Convert DanhSachNguoiThamGia to UnprocessedParticipant by adding ke_khai info
        const participantsWithKeKhai: UnprocessedParticipant[] = result.movedParticipants.map(participant => ({
          ...participant,
          ke_khai: result.newKeKhai
        }));
        setPendingPaymentParticipants(participantsWithKeKhai);

        // Show payment QR modal for user confirmation
        setSelectedKeKhai(result.newKeKhai);
        setSelectedPayment(payment);
        setShowPaymentModal(true);

        showToast(`Đã tạo kê khai mới "${result.newKeKhai.ma_ke_khai}" và tạo thanh toán thành công!`, 'success');

        // Reload data to show changes
        loadUnprocessedParticipantsData();

        break; // For now, handle only one ke_khai at a time
      }
    } catch (error) {
      console.error('Error creating new declaration and submitting:', error);
      showToast('Có lỗi xảy ra khi tạo kê khai mới và thanh toán', 'error');
    }
  };

  // Handle confirm submission with payment
  const handleConfirmSubmission = async (createPayment: boolean = true) => {
    setIsSubmitting(true);
    setShowPaymentConfirmModal(false);

    try {
      const selectedIds = submittedParticipants.map(p => p.id);
      console.log('Submitting participants for payment:', selectedIds);

      // Check if we need to create new declaration for partial submission
      const needsNewDeclaration = await checkIfNeedsNewDeclaration(submittedParticipants);

      if (needsNewDeclaration) {
        console.log('🚀 Creating new declaration for partial submission');
        await handleCreateNewDeclarationAndSubmit(submittedParticipants);
      } else {
        // Create payment and show QR modal for full declaration
        await handleCreatePaymentForSubmitted();
      }

      // Don't clear submittedParticipants yet - will be cleared after payment confirmation
      setSelectedParticipants(new Set());
    } catch (error) {
      console.error('Error submitting participants:', error);
      showToast('Có lỗi xảy ra khi tạo thanh toán', 'error');
    } finally {
      setIsSubmitting(false);
      // submittedParticipants will be cleared after payment confirmation
    }
  };

  // Handle create payment for submitted participants - Show QR modal for confirmation
  const handleCreatePaymentForSubmitted = async () => {
    try {
      // Calculate total amount for submitted participants
      const totalAmount = submittedParticipants.reduce((sum, participant) => {
        return sum + (participant.tien_dong_thuc_te || participant.tien_dong || 0);
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

      // Create payment (without updating ke khai status yet)
      const payment = await paymentService.createPayment({
        ke_khai_id: firstParticipant.ke_khai.id,
        so_tien: totalAmount,
        phuong_thuc_thanh_toan: 'qr_code',
        payment_description: `Thanh toán cho ${submittedParticipants.length} người tham gia`,
        created_by: user?.id
      });

      // Update payment_id for participants
      for (const participant of submittedParticipants) {
        try {
          await supabase
            .from('danh_sach_nguoi_tham_gia')
            .update({
              payment_id: payment.id,
              payment_status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('id', participant.id);
          console.log(`✅ Updated payment_id for participant ${participant.id}`);
        } catch (error) {
          console.error(`❌ Failed to update payment_id for participant ${participant.id}:`, error);
        }
      }

      // Save participants for later status update when payment is confirmed
      setPendingPaymentParticipants(submittedParticipants);

      // Show payment QR modal for user confirmation
      // Status will be updated when payment is confirmed
      setSelectedKeKhai(firstParticipant.ke_khai);
      setSelectedPayment(payment);
      setShowPaymentModal(true);

      showToast('Vui lòng thực hiện thanh toán để hoàn tất quá trình nộp hồ sơ.', 'warning');
    } catch (error) {
      console.error('Error creating payment:', error);
      showToast('Có lỗi xảy ra khi tạo thanh toán', 'error');
    }
  };

  // Handle create payment for submitted ke khai (individual ke khai payment)
  const handleCreatePaymentForSubmittedKeKhai = async (keKhai: DanhSachKeKhai) => {
    try {
      // Get all participants in this ke khai to calculate total amount
      const { data: participants, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('*')
        .eq('ke_khai_id', keKhai.id);

      if (error) {
        console.error('Error fetching participants:', error);
        showToast('Không thể lấy danh sách người tham gia', 'error');
        return;
      }

      // Calculate total amount
      const totalAmount = participants.reduce((sum, participant) => {
        return sum + (participant.tien_dong_thuc_te || participant.tien_dong || 0);
      }, 0);

      if (totalAmount <= 0) {
        showToast('Không thể tạo thanh toán: Số tiền không hợp lệ', 'error');
        return;
      }

      // Create payment
      const payment = await paymentService.createPayment({
        ke_khai_id: keKhai.id,
        so_tien: totalAmount,
        phuong_thuc_thanh_toan: 'qr_code',
        payment_description: `Thanh toán kê khai ${keKhai.ma_ke_khai}`,
        created_by: user?.id
      });

      // Update ke khai status to pending_payment
      await keKhaiService.updateKeKhaiStatus(
        keKhai.id,
        'pending_payment',
        user?.id,
        'Tạo thanh toán cho kê khai đã nộp'
      );

      // Show payment QR modal
      setSelectedKeKhai(keKhai);
      setSelectedPayment(payment);
      setShowPaymentModal(true);

      showToast('Đã tạo thanh toán thành công', 'success');

      // Reload data to reflect status change
      loadUnprocessedParticipantsData();
    } catch (error) {
      console.error('Error creating payment for submitted ke khai:', error);
      showToast('Có lỗi xảy ra khi tạo thanh toán', 'error');
    }
  };

  // Handle create payment for selected submitted participants
  const handleCreatePaymentForSelectedSubmitted = async (selectedSubmittedParticipants: UnprocessedParticipant[]) => {
    try {
      // Group participants by ke_khai_id
      const participantsByKeKhai = selectedSubmittedParticipants.reduce((acc, participant) => {
        const keKhaiId = participant.ke_khai.id;
        if (!acc[keKhaiId]) {
          acc[keKhaiId] = {
            keKhai: participant.ke_khai,
            participants: []
          };
        }
        acc[keKhaiId].participants.push(participant);
        return acc;
      }, {} as Record<number, { keKhai: DanhSachKeKhai, participants: UnprocessedParticipant[] }>);

      // If participants belong to multiple ke khai, show error
      const keKhaiIds = Object.keys(participantsByKeKhai);
      if (keKhaiIds.length > 1) {
        showToast('Không thể tạo thanh toán cho người tham gia từ nhiều kê khai khác nhau', 'warning');
        return;
      }

      // Get the single ke khai
      const keKhaiData = Object.values(participantsByKeKhai)[0];
      const keKhai = keKhaiData.keKhai;

      // Calculate total amount for selected participants
      const totalAmount = selectedSubmittedParticipants.reduce((sum, participant) => {
        return sum + (participant.tien_dong_thuc_te || participant.tien_dong || 0);
      }, 0);

      if (totalAmount <= 0) {
        showToast('Không thể tạo thanh toán: Số tiền không hợp lệ', 'error');
        return;
      }

      // Create payment
      const payment = await paymentService.createPayment({
        ke_khai_id: keKhai.id,
        so_tien: totalAmount,
        phuong_thuc_thanh_toan: 'qr_code',
        payment_description: `Thanh toán cho ${selectedSubmittedParticipants.length} người tham gia từ kê khai ${keKhai.ma_ke_khai}`,
        created_by: user?.id
      });

      // Update ke khai status to pending_payment
      await keKhaiService.updateKeKhaiStatus(
        keKhai.id,
        'pending_payment',
        user?.id,
        'Tạo thanh toán cho người tham gia đã nộp'
      );

      // Show payment QR modal
      setSelectedKeKhai(keKhai);
      setSelectedPayment(payment);
      setShowPaymentModal(true);

      showToast('Đã tạo thanh toán thành công', 'success');

      // Clear selection and reload data
      setSelectedParticipants(new Set());
      loadUnprocessedParticipantsData();
    } catch (error) {
      console.error('Error creating payment for selected submitted participants:', error);
      showToast('Có lỗi xảy ra khi tạo thanh toán', 'error');
    }
  };

  // Handle view payment for selected pending payment participants
  const handleViewPaymentForSelectedPendingPayment = async (selectedPendingPaymentParticipants: UnprocessedParticipant[]) => {
    try {
      // Group participants by ke_khai_id
      const participantsByKeKhai = selectedPendingPaymentParticipants.reduce((acc, participant) => {
        const keKhaiId = participant.ke_khai.id;
        if (!acc[keKhaiId]) {
          acc[keKhaiId] = {
            keKhai: participant.ke_khai,
            participants: []
          };
        }
        acc[keKhaiId].participants.push(participant);
        return acc;
      }, {} as Record<number, { keKhai: DanhSachKeKhai, participants: UnprocessedParticipant[] }>);

      // If participants belong to multiple ke khai, show error
      const keKhaiIds = Object.keys(participantsByKeKhai);
      if (keKhaiIds.length > 1) {
        showToast('Không thể xem thanh toán cho người tham gia từ nhiều kê khai khác nhau', 'warning');
        return;
      }

      // Get the single ke khai
      const keKhaiData = Object.values(participantsByKeKhai)[0];
      const keKhai = keKhaiData.keKhai;

      // Get existing payment
      const existingPayment = await paymentService.getPaymentByKeKhaiId(keKhai.id);

      if (existingPayment) {
        setSelectedKeKhai(keKhai);
        setSelectedPayment(existingPayment);
        setShowPaymentModal(true);

        // Clear selection
        setSelectedParticipants(new Set());
      } else {
        showToast('Không tìm thấy thông tin thanh toán cho kê khai này', 'warning');
      }
    } catch (error) {
      console.error('Error viewing payment for selected pending payment participants:', error);
      showToast('Có lỗi xảy ra khi xem thanh toán', 'error');
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

  // Get processing unit based on participant data
  const getProcessingUnit = (participant: UnprocessedParticipant) => {
    // Return processing unit based on ke khai or participant data
    return participant.ke_khai.loai_ke_khai || '603';
  };

  // Get form type (online/offline)
  const getFormType = (participant: UnprocessedParticipant) => {
    // All submissions through this system are online
    return 'Qua web';
  };

  // Get BHXH submission date
  const getBhxhSubmissionDate = (participant: UnprocessedParticipant) => {
    // Return BHXH submission date if available
    return participant.ke_khai.approved_at ? formatDate(participant.ke_khai.approved_at) : '—';
  };

  // Get BHXH receipt date
  const getBhxhReceiptDate = (participant: UnprocessedParticipant) => {
    // Return BHXH receipt date if available
    return '—'; // Placeholder for now
  };

  // Get notification/result message
  const getNotificationMessage = (participant: UnprocessedParticipant) => {
    // Return notification message based on status
    if (participant.ke_khai.trang_thai === 'processing') {
      return 'Đang xử lý';
    }
    return '—';
  };

  // Helper functions for selection - ưu tiên trạng thái kê khai
  const getDraftParticipants = () => {
    const result = participantsList.filter(p =>
      p.participant_status === 'draft' &&
      p.ke_khai.trang_thai !== 'pending_payment' &&
      p.ke_khai.trang_thai !== 'processing'
    );
    console.log('📊 Draft Participants:', result.length, result.map(p => ({ id: p.id, name: p.ho_ten, status: p.participant_status, keKhaiStatus: p.ke_khai.trang_thai })));
    return result;
  };

  const getSubmittedParticipants = () => {
    const result = participantsList.filter(p =>
      p.participant_status === 'submitted' &&
      p.ke_khai.trang_thai !== 'pending_payment' &&
      p.ke_khai.trang_thai !== 'processing'
    );
    console.log('📊 Submitted Participants:', result.length, result.map(p => ({ id: p.id, name: p.ho_ten, status: p.participant_status, keKhaiStatus: p.ke_khai.trang_thai })));
    return result;
  };

  const getPendingPaymentParticipants = () => {
    const result = participantsList.filter(p => p.ke_khai.trang_thai === 'pending_payment');
    console.log('📊 Pending Payment Participants:', result.length, result.map(p => ({ id: p.id, name: p.ho_ten, status: p.participant_status, keKhaiStatus: p.ke_khai.trang_thai })));
    return result;
  };

  const getProcessingParticipants = () => {
    const result = participantsList.filter(p =>
      p.participant_status === 'processing' || p.ke_khai.trang_thai === 'processing'
    );
    console.log('📊 Processing Participants:', result.length, result.map(p => ({ id: p.id, name: p.ho_ten, status: p.participant_status, keKhaiStatus: p.ke_khai.trang_thai })));
    return result;
  };

  const getSelectableParticipants = () => {
    const result = participantsList.filter(p =>
      // Chỉ cho phép chọn những người tham gia có trạng thái 'draft' (nháp)
      // Vì 'submitted' = đã nộp lên công ty, 'processing' = đang xử lý
      p.participant_status === 'draft' ||
      p.ke_khai.trang_thai === 'pending_payment'
    );
    console.log('📊 Selectable Participants:', result.length, result.map(p => ({ id: p.id, name: p.ho_ten, status: p.participant_status, keKhaiStatus: p.ke_khai.trang_thai })));
    return result;
  };

  const getSelectedDraftCount = () => {
    const count = getDraftParticipants().filter(p => selectedParticipants.has(p.id)).length;
    console.log('🔍 Selected Draft Count:', count);
    return count;
  };

  const getSelectedSubmittedCount = () => {
    const count = getSubmittedParticipants().filter(p => selectedParticipants.has(p.id)).length;
    console.log('🔍 Selected Submitted Count:', count);
    return count;
  };

  const getSelectedPendingPaymentCount = () => {
    const count = getPendingPaymentParticipants().filter(p => selectedParticipants.has(p.id)).length;
    console.log('🔍 Selected Pending Payment Count:', count);
    return count;
  };

  const getSelectedProcessingCount = () => {
    const count = getProcessingParticipants().filter(p => selectedParticipants.has(p.id)).length;
    console.log('🔍 Selected Processing Count:', count);
    return count;
  };

  const getSelectedSelectableCount = () => {
    const count = getSelectableParticipants().filter(p => selectedParticipants.has(p.id)).length;
    console.log('🔍 Selected Selectable Count:', count);
    return count;
  };

  const getTotalDraftCount = () => getDraftParticipants().length;
  const getTotalSubmittedCount = () => getSubmittedParticipants().length;
  const getTotalPendingPaymentCount = () => getPendingPaymentParticipants().length;
  const getTotalProcessingCount = () => getProcessingParticipants().length;
  const getTotalSelectableCount = () => getSelectableParticipants().length;

  const getSelectedAmount = () => {
    return getSelectableParticipants()
      .filter(p => selectedParticipants.has(p.id))
      .reduce((sum, p) => sum + (p.tien_dong_thuc_te || p.tien_dong || 0), 0);
  };

  // Context Menu Component
  const ContextMenu: React.FC = () => {
    if (!contextMenu.show || !contextMenu.participant) return null;

    const participant = contextMenu.participant;
    const isSelectable = participant.participant_status === 'draft' ||
      participant.ke_khai.trang_thai === 'pending_payment';

    const menuItems = [
      {
        id: 'view-participant',
        label: 'Xem chi tiết người tham gia',
        icon: <User className="w-4 h-4" />,
        onClick: () => handleContextMenuAction('view-participant', participant)
      },
      {
        id: 'view-kekhai',
        label: 'Xem chi tiết hồ sơ',
        icon: <Building className="w-4 h-4" />,
        onClick: () => handleContextMenuAction('view-kekhai', participant)
      }
    ];

    // Add conditional menu items based on status
    if (isSelectable) {
      menuItems.push({
        id: 'select',
        label: selectedParticipants.has(participant.id) ? 'Bỏ chọn' : 'Chọn',
        icon: selectedParticipants.has(participant.id) ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />,
        onClick: () => handleContextMenuAction('select', participant)
      });
    }

    if (participant.ke_khai.trang_thai === 'submitted') {
      menuItems.push(
        {
          id: 'approve',
          label: 'Duyệt kê khai',
          icon: <CheckCircle className="w-4 h-4" />,
          onClick: () => handleContextMenuAction('approve', participant)
        },
        {
          id: 'payment',
          label: 'Tạo thanh toán',
          icon: <CreditCard className="w-4 h-4" />,
          onClick: () => handleContextMenuAction('payment', participant)
        }
      );
    }

    if (participant.ke_khai.trang_thai === 'pending_payment') {
      menuItems.push({
        id: 'payment',
        label: 'Xem thanh toán',
        icon: <CreditCard className="w-4 h-4" />,
        onClick: () => handleContextMenuAction('payment', participant)
      });
    }

    return (
      <div
        className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 min-w-[200px]"
        style={{
          left: contextMenu.x,
          top: contextMenu.y,
          transform: 'translate(-50%, 0)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    );
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

        <div className="flex items-center space-x-3">
          <BhxhCheckButton className="rounded-lg" />

          <button
            onClick={loadUnprocessedParticipantsData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Mã đơn vị */}
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={maDonVi}
                onChange={(e) => setMaDonVi(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="">Mã đơn vị</option>
                {donViList.map((donVi) => (
                  <option key={donVi.id} value={donVi.ma_don_vi}>
                    {donVi.ma_don_vi} - {donVi.ten_don_vi}
                  </option>
                ))}
              </select>
            </div>

            {/* Tỉnh/TP */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={maTinh}
                onChange={(e) => setMaTinh(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="">Tỉnh/TP</option>
                {tinhList.map((tinh) => (
                  <option key={tinh.ma} value={tinh.ma}>
                    {tinh.ma} - {tinh.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* Từ ngày */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                placeholder="Từ ngày"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Đến ngày */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                placeholder="Đến ngày"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Mã BHXH */}
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Mã BHXH"
                value={maBhxh}
                onChange={(e) => setMaBhxh(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Trạng thái */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="draft">Nháp</option>
                <option value="submitted">Đã nộp lên công ty</option>
                <option value="pending_payment">Chờ thanh toán</option>
                <option value="processing">Đang xử lý</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>

            {/* Kết quả */}
            <div className="relative">
              <FileCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={ketQua}
                onChange={(e) => setKetQua(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="all">Tất cả kết quả</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
                <option value="processing">Đang xử lý</option>
                <option value="pending">Chờ xử lý</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>

            {/* Quận/Huyện */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={maHuyen}
                onChange={(e) => setMaHuyen(e.target.value)}
                disabled={!maTinh}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none disabled:opacity-50"
              >
                <option value="">Quận/Huyện</option>
                {huyenList.map((huyen) => (
                  <option key={huyen.ma} value={huyen.ma}>
                    {huyen.ma} - {huyen.ten}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Đại lý/CTV */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={daiLyId}
                onChange={(e) => setDaiLyId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="">Đại lý/CTV</option>
                {daiLyList.map((daiLy) => (
                  <option key={daiLy.id} value={daiLy.id}>
                    {daiLy.ma} - {daiLy.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* Đơn vị */}
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={maDonVi}
                onChange={(e) => setMaDonVi(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="">Đơn vị</option>
                {donViList.map((donVi) => (
                  <option key={donVi.id} value={donVi.ma_don_vi}>
                    {donVi.ma_don_vi} - {donVi.ten_don_vi}
                  </option>
                ))}
              </select>
            </div>

            {/* Cơ quan BHXH */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={coQuanBhxhId}
                onChange={(e) => setCoQuanBhxhId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="">Cơ quan BHXH</option>
                {coQuanBhxhList.map((coQuan) => (
                  <option key={coQuan.id} value={coQuan.id}>
                    {coQuan.ma_co_quan} - {coQuan.ten_co_quan}
                  </option>
                ))}
              </select>
            </div>

            {/* Hình thức */}
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={hinhThuc}
                onChange={(e) => setHinhThuc(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="all">Tất cả hình thức</option>
                <option value="online">Qua web</option>
                <option value="offline">Trực tiếp</option>
                <option value="mobile">Qua app</option>
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Số hồ sơ */}
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Số hồ sơ"
                value={soHoSo}
                onChange={(e) => setSoHoSo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

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

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Reset all filters
                  setMaDonVi('');
                  setMaTinh('');
                  setMaHuyen('');
                  setFromDate('');
                  setToDate('');
                  setMaBhxh('');
                  setFilterStatus('all');
                  setKetQua('all');
                  setDaiLyId('');
                  setCoQuanBhxhId('');
                  setHinhThuc('all');
                  setSoHoSo('');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={loadUnprocessedParticipantsData}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Results count */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              Tìm thấy {totalParticipants} người tham gia ({getTotalDraftCount()} nháp, {getTotalSubmittedCount()} đã nộp, {getTotalPendingPaymentCount()} chờ thanh toán, {getTotalProcessingCount()} đang xử lý)
            </div>
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
                  Đã chọn {getSelectedSelectableCount()} người tham gia
                  {getSelectedDraftCount() > 0 && ` (${getSelectedDraftCount()} nháp`}
                  {getSelectedSubmittedCount() > 0 && ` ${getSelectedDraftCount() > 0 ? ', ' : '('}${getSelectedSubmittedCount()} đã nộp`}
                  {getSelectedPendingPaymentCount() > 0 && ` ${(getSelectedDraftCount() > 0 || getSelectedSubmittedCount() > 0) ? ', ' : '('}${getSelectedPendingPaymentCount()} chờ thanh toán`}
                  {(getSelectedDraftCount() > 0 || getSelectedSubmittedCount() > 0 || getSelectedPendingPaymentCount() > 0) && ')'}
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
                disabled={isSubmitting || getSelectedSelectableCount() === 0}
                title={(() => {
                  const selectedCount = getSelectedSelectableCount();
                  const draftCount = getSelectedDraftCount();
                  const submittedCount = getSelectedSubmittedCount();
                  const pendingPaymentCount = getSelectedPendingPaymentCount();

                  if (selectedCount === 0) {
                    return 'Vui lòng chọn ít nhất một người tham gia';
                  }

                  // Only draft participants selected
                  if (draftCount > 0 && submittedCount === 0 && pendingPaymentCount === 0) {
                    return `Nộp và tạo thanh toán cho ${draftCount} người tham gia nháp`;
                  }

                  // Only submitted participants selected
                  if (draftCount === 0 && submittedCount > 0 && pendingPaymentCount === 0) {
                    return `Tạo thanh toán cho ${submittedCount} người tham gia đã nộp`;
                  }

                  // Only pending payment participants selected
                  if (draftCount === 0 && submittedCount === 0 && pendingPaymentCount > 0) {
                    return `Xem thanh toán cho ${pendingPaymentCount} người tham gia chờ thanh toán`;
                  }

                  // Mixed selection
                  return 'Không thể xử lý cùng lúc người tham gia ở các trạng thái khác nhau';
                })()}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (() => {
                  const draftCount = getSelectedDraftCount();
                  const submittedCount = getSelectedSubmittedCount();
                  const pendingPaymentCount = getSelectedPendingPaymentCount();

                  console.log('🎯 Button Logic Debug:', {
                    draftCount,
                    submittedCount,
                    pendingPaymentCount,
                    selectedParticipants: Array.from(selectedParticipants),
                    participantsList: participantsList.map(p => ({
                      id: p.id,
                      name: p.ho_ten,
                      participant_status: p.participant_status,
                      ke_khai_trang_thai: p.ke_khai.trang_thai,
                      selected: selectedParticipants.has(p.id)
                    }))
                  });

                  // Only draft participants selected
                  if (draftCount > 0 && submittedCount === 0 && pendingPaymentCount === 0) {
                    console.log('✅ Showing: Nộp & Thanh toán');
                    return (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Nộp & Thanh toán
                      </>
                    );
                  }

                  // Only submitted participants selected
                  if (draftCount === 0 && submittedCount > 0 && pendingPaymentCount === 0) {
                    console.log('✅ Showing: Tạo thanh toán');
                    return (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Tạo thanh toán
                      </>
                    );
                  }

                  // Only pending payment participants selected
                  if (draftCount === 0 && submittedCount === 0 && pendingPaymentCount > 0) {
                    console.log('✅ Showing: Xem thanh toán');
                    return (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Xem thanh toán
                      </>
                    );
                  }

                  // Mixed selection or other cases
                  console.log('⚠️ Showing: Xử lý (fallback)');
                  return (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Xử lý
                    </>
                  );
                })()}
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
          <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{minWidth: '2000px'}}>
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '50px', minWidth: '50px'}}>
                    <input
                      type="checkbox"
                      checked={getTotalSelectableCount() > 0 && getSelectedSelectableCount() === getTotalSelectableCount()}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = getSelectedSelectableCount() > 0 && getSelectedSelectableCount() < getTotalSelectableCount();
                        }
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      title="Chọn tất cả người tham gia có thể chọn"
                    />
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '60px', minWidth: '60px'}}>
                    STT
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '160px', minWidth: '160px'}}>
                    Họ tên
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '140px', minWidth: '140px'}}>
                    Mã BHXH
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '130px', minWidth: '130px'}}>
                    Số CCCD
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '120px', minWidth: '120px'}}>
                    Số tiền
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '110px', minWidth: '110px'}}>
                    Ngày lập
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '110px', minWidth: '110px'}}>
                    Ngày nộp
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '120px', minWidth: '120px'}}>
                    TT hồ sơ
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '120px', minWidth: '120px'}}>
                    Kết quả
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '100px', minWidth: '100px'}}>
                    Đơn vị
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '100px', minWidth: '100px'}}>
                    Hình thức
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '110px', minWidth: '110px'}}>
                    Nộp BHXH
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-blue-500 dark:border-blue-600" style={{width: '110px', minWidth: '110px'}}>
                    Nhận BHXH
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                    Thông báo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {participantsList.map((participant, index) => {
                  const participantKey = `${participant.ke_khai.id}-${participant.id}`;
                  const isSelected = selectedParticipants.has(participant.id);
                  return (
                  <tr
                    key={participantKey}
                    className={`
                      transition-all duration-200 cursor-pointer
                      ${isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      border-b border-gray-200 dark:border-gray-700
                    `}
                    onContextMenu={(e) => handleContextMenu(e, participant)}
                    title="Chuột phải để xem menu"
                  >
                    <td className="px-3 py-4 text-center whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '50px', minWidth: '50px'}}>
                      {(participant.participant_status === 'draft' ||
                        participant.ke_khai.trang_thai === 'pending_payment') ? (
                        <input
                          type="checkbox"
                          checked={selectedParticipants.has(participant.id)}
                          onChange={(e) => handleParticipantSelect(participant.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          title={
                            participant.participant_status === 'submitted' ? 'Chọn để tạo thanh toán' :
                            participant.ke_khai.trang_thai === 'pending_payment' ? 'Chọn để xem thanh toán' :
                            participant.ke_khai.trang_thai === 'processing' || participant.participant_status === 'processing' ? 'Đã nộp lên công ty' :
                            'Chọn để nộp'
                          }
                          disabled={participant.ke_khai.trang_thai === 'processing' || participant.participant_status === 'processing'}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '60px', minWidth: '60px'}}>
                      {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="px-3 py-4 text-left border-r border-gray-200 dark:border-gray-700" style={{width: '160px', minWidth: '160px'}}>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={participant.ho_ten}>
                        {participant.ho_ten}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 font-mono whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '140px', minWidth: '140px'}}>
                      {participant.ma_so_bhxh || <span className="text-gray-400 dark:text-gray-500">-</span>}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 font-mono whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '130px', minWidth: '130px'}}>
                      {participant.so_cccd || <span className="text-gray-400 dark:text-gray-500">-</span>}
                    </td>
                    <td className="px-3 py-4 text-right text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '120px', minWidth: '120px'}}>
                      {formatCurrency(participant.tien_dong_thuc_te || participant.tien_dong || 0)}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '110px', minWidth: '110px'}}>
                      {formatDate(participant.ke_khai.created_at)}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '110px', minWidth: '110px'}}>
                      {participant.submitted_at ? formatDate(participant.submitted_at) : <span className="text-gray-400 dark:text-gray-500">—</span>}
                    </td>
                    <td className="px-3 py-4 text-center whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '120px', minWidth: '120px'}}>
                      {getParticipantStatusBadge(participant.participant_status)}
                    </td>
                    <td className="px-3 py-4 text-center whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '120px', minWidth: '120px'}}>
                      {getDeclarationStatusBadge(participant.ke_khai.trang_thai)}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '100px', minWidth: '100px'}}>
                      {getProcessingUnit(participant)}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '100px', minWidth: '100px'}}>
                      {getFormType(participant)}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '110px', minWidth: '110px'}}>
                      {getBhxhSubmissionDate(participant)}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-200 dark:border-gray-700" style={{width: '110px', minWidth: '110px'}}>
                      {getBhxhReceiptDate(participant)}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                      {getNotificationMessage(participant)}
                    </td>
                  </tr>
                  );
                })}
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
                Xác nhận nộp hồ sơ và thanh toán
              </h3>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Bạn đang nộp <span className="font-semibold text-blue-600">{submittedParticipants.length} người tham gia</span>.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Thông tin thanh toán:</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Số tiền: <span className="font-semibold text-green-600">
                      {formatCurrency(submittedParticipants.reduce((sum, p) => sum + (p.tien_dong_thuc_te || p.tien_dong || 0), 0))}
                    </span></p>
                    <p>Số người: {submittedParticipants.length} người tham gia</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">Luồng thanh toán</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Hệ thống sẽ hiển thị mã QR để bạn thanh toán. Sau khi xác nhận thanh toán thành công, trạng thái sẽ chuyển thẳng thành "Đã nộp và đã thanh toán" (Đang xử lý).
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bạn có muốn tiếp tục nộp hồ sơ và thanh toán không?
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

      {/* Context Menu */}
      <ContextMenu />

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
            // Clear pending data when modal is closed without payment
            setPendingPaymentParticipants([]);
            setSubmittedParticipants([]);
            showToast('Đã hủy thanh toán. Vui lòng thử lại nếu muốn nộp hồ sơ.', 'warning');
          }}
          onPaymentConfirmed={async () => {
            // When payment is confirmed, update both participant and ke_khai status
            try {
              const selectedIds = pendingPaymentParticipants.map(p => p.id);
              const keKhaiId = selectedKeKhai?.id;

              console.log('🎉 Payment confirmed! Updating statuses...', { selectedIds, keKhaiId });

              // Step 1: Update payment status to 'completed' for all participants
              if (selectedPayment?.id) {
                try {
                  console.log('💳 Updating payment status for payment ID:', selectedPayment.id);
                  console.log('💳 Participants to update:', selectedIds);

                  const paymentUpdateResult = await keKhaiService.updateParticipantPaymentStatus(
                    selectedPayment.id,
                    'completed'
                  );
                  console.log('💳 Payment status update result:', paymentUpdateResult);

                  if (paymentUpdateResult.count === 0) {
                    console.warn('⚠️ No participants were updated with payment status. Checking payment_id linkage...');

                    // Check if participants have the correct payment_id
                    for (const participantId of selectedIds) {
                      const { data: participant } = await supabase
                        .from('danh_sach_nguoi_tham_gia')
                        .select('id, payment_id, payment_status')
                        .eq('id', participantId)
                        .single();
                      console.log(`Participant ${participantId} payment info:`, participant);
                    }
                  }
                } catch (paymentError) {
                  console.error('❌ Failed to update payment status:', paymentError);
                }
              } else {
                console.warn('⚠️ No selectedPayment.id found for payment status update');
              }

              // Step 2: Update participant status to 'submitted' (đã nộp lên công ty) and ensure payment_status is 'completed'
              for (const participantId of selectedIds) {
                try {
                  // Update participant status to 'submitted' = đã nộp lên công ty
                  await keKhaiService.updateParticipantStatus(
                    participantId,
                    'submitted',
                    user?.id || '',
                    'Đã nộp lên công ty và thanh toán thành công'
                  );

                  // Ensure payment_status is also updated (backup method)
                  await supabase
                    .from('danh_sach_nguoi_tham_gia')
                    .update({
                      payment_status: 'completed',
                      paid_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    })
                    .eq('id', participantId);

                  console.log(`✅ Successfully updated participant ${participantId} to submitted (đã nộp lên công ty) with completed payment`);
                } catch (participantError) {
                  console.error(`❌ Failed to update participant ${participantId}:`, participantError);
                }
              }

              // Step 3: Update ke_khai status to 'processing' (đã nộp lên công ty)
              if (keKhaiId) {
                try {
                  await keKhaiService.updateKeKhaiStatus(
                    keKhaiId,
                    'processing',
                    user?.id || '',
                    'Đã nộp lên công ty sau thanh toán thành công'
                  );
                  console.log(`✅ Successfully updated ke_khai ${keKhaiId} to processing (đã nộp lên công ty)`);
                } catch (keKhaiError) {
                  console.error(`❌ Failed to update ke_khai ${keKhaiId}:`, keKhaiError);
                }
              }

              setShowPaymentModal(false);
              setSelectedKeKhai(null);
              setSelectedPayment(null);
              setSelectedParticipants(new Set());
              setPendingPaymentParticipants([]); // Clear pending participants
              setSubmittedParticipants([]); // Clear submitted participants
              showToast('Thanh toán thành công! Hồ sơ đã được nộp lên công ty và đang xử lý.', 'success');
              loadUnprocessedParticipantsData();
            } catch (error) {
              console.error('Error updating statuses after payment confirmation:', error);
              setShowPaymentModal(false);
              setSelectedKeKhai(null);
              setSelectedPayment(null);
              setPendingPaymentParticipants([]); // Clear pending participants even on error
              setSubmittedParticipants([]); // Clear submitted participants even on error
              showToast('Thanh toán thành công nhưng có lỗi khi cập nhật trạng thái', 'warning');
              loadUnprocessedParticipantsData();
            }
          }}
        />
      )}
    </div>
  );
};

export default HoSoChuaXuLy;
