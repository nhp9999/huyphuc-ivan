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
  Briefcase,
  DollarSign,
  Image,
  Bell,
  Play,
  UserCheck
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
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';

import { useToast } from '../../../shared/hooks/useToast';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import PaymentQRModal from '../components/PaymentQRModal';
import PaymentProofModal from '../components/PaymentProofModal';
import paymentService from '../services/paymentService';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import { useAuth } from '../../auth';
import bhxhNotificationService from '../services/bhxhNotificationService';
import DuplicateCheckModal from '../components/DuplicateCheckModal';

// Interface for processed participant with declaration info
interface ProcessedParticipant extends DanhSachNguoiThamGia {
  ke_khai: DanhSachKeKhai;
}

const HoSoDaXuLy: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { setCurrentPage: navigateToPage } = useNavigation();

  // State
  const [loading, setLoading] = useState(false);
  const [participantsList, setParticipantsList] = useState<ProcessedParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
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

  // Filter options data
  const [donViList, setDonViList] = useState<VDonViChiTiet[]>([]);
  const [tinhList, setTinhList] = useState<any[]>([]);
  const [huyenList, setHuyenList] = useState<any[]>([]);
  const [daiLyList, setDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [coQuanBhxhList, setCoQuanBhxhList] = useState<VCoQuanBhxhChiTiet[]>([]);

  // Selection states
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());

  // State cho thông báo BHXH
  const [bhxhNotifications, setBhxhNotifications] = useState<Record<string, any>>({});
  const [loadingBhxhNotifications, setLoadingBhxhNotifications] = useState(false);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);

  // Context menu states
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    participant: ProcessedParticipant | null;
  }>({
    show: false,
    x: 0,
    y: 0,
    participant: null
  });

  // Duplicate check modal state
  const [showDuplicateCheckModal, setShowDuplicateCheckModal] = useState(false);
  const [quickScanLoading, setQuickScanLoading] = useState(false);

  // Function to fetch BHXH notifications
  const fetchBhxhNotifications = async (participantsList: ProcessedParticipant[]) => {
    if (participantsList.length === 0) return;

    setLoadingBhxhNotifications(true);
    try {
      // Lấy danh sách số hồ sơ từ cả participant và kê khai
      const soHoSoSet = new Set<string>();

      participantsList.forEach(participant => {
        // Ưu tiên mã hồ sơ của participant trước, sau đó mới đến kê khai
        const maHoSo = participant.ma_ho_so || participant.ke_khai.ma_ho_so;
        console.log('🔍 Debug participant ma_ho_so:', {
          participantId: participant.id,
          participantMaHoSo: participant.ma_ho_so,
          keKhaiMaHoSo: participant.ke_khai.ma_ho_so,
          finalMaHoSo: maHoSo,
          alreadyHasNotification: maHoSo ? !!bhxhNotifications[maHoSo] : false
        });

        if (maHoSo && maHoSo.trim() !== '' && !bhxhNotifications[maHoSo]) {
          soHoSoSet.add(maHoSo);
        }
      });

      const soHoSoList = Array.from(soHoSoSet);

      if (soHoSoList.length === 0) {
        setLoadingBhxhNotifications(false);
        return;
      }

      console.log('🔔 HoSoDaXuLy: Fetching BHXH notifications for ho so list:', soHoSoList);

      const notifications = await bhxhNotificationService.getNotificationsForMultipleHoSo(soHoSoList);

      setBhxhNotifications(prev => ({
        ...prev,
        ...notifications
      }));

      console.log('🔔 HoSoDaXuLy: Updated BHXH notifications:', notifications);
    } catch (error) {
      console.error('Error fetching BHXH notifications:', error);
    } finally {
      setLoadingBhxhNotifications(false);
    }
  };

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
        filterPaymentStatus,
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

      // Load processed participants using the new service method with advanced filters
      const result = await keKhaiService.getProcessedNguoiThamGiaWithPagination({
        userId: user.id,
        page: currentPage,
        pageSize: itemsPerPage,
        loaiKeKhai: '603', // Focus on KeKhai603
        searchTerm: searchTerm || undefined,
        participantStatus: filterStatus !== 'all' ? filterStatus : undefined,
        paymentStatus: filterPaymentStatus !== 'all' ? filterPaymentStatus : undefined,
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

      console.log('HoSoDaXuLy: Loaded processed participants:', result.data.length, 'of', result.total);



      setParticipantsList(result.data);
      setTotalParticipants(result.total);

      // Fetch BHXH notifications for participants with ma_ho_so
      if (result.data.length > 0) {
        await fetchBhxhNotifications(result.data);
        getUniqueFilterOptions();
      }
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
  }, [searchTerm, filterStatus, filterPaymentStatus, maDonVi, maTinh, maHuyen, fromDate, toDate, maBhxh, ketQua, daiLyId, coQuanBhxhId, hinhThuc, soHoSo]);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadProcessedParticipantsData();
  }, [user?.id, searchTerm, filterStatus, filterPaymentStatus, currentPage, maDonVi, maTinh, maHuyen, fromDate, toDate, maBhxh, ketQua, daiLyId, coQuanBhxhId, hinhThuc, soHoSo]);

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions();
  }, [user?.id]);

  // Load filter options
  const loadFilterOptions = async () => {
    try {
      // Load don vi list
      const { data: donViData } = await supabase
        .from('v_don_vi_chitiet')
        .select('*')
        .order('ma_don_vi');
      if (donViData) setDonViList(donViData);

      // Load tinh list
      const { data: tinhData } = await supabase
        .from('dm_tinh')
        .select('*')
        .order('value');
      if (tinhData) setTinhList(tinhData);

      // Load dai ly list
      const { data: daiLyData } = await supabase
        .from('v_dai_ly_chitiet')
        .select('*')
        .order('ma');
      if (daiLyData) setDaiLyList(daiLyData);

      // Load co quan BHXH list
      const { data: coQuanData } = await supabase
        .from('v_co_quan_bhxh_chi_tiet')
        .select('*')
        .order('ma_co_quan');
      if (coQuanData) setCoQuanBhxhList(coQuanData);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  // Load huyen list when tinh changes
  useEffect(() => {
    const loadHuyenList = async () => {
      if (!maTinh) {
        setHuyenList([]);
        setMaHuyen('');
        return;
      }

      try {
        const { data: huyenData } = await supabase
          .from('dm_huyen')
          .select('*')
          .eq('ma_tinh', maTinh)
          .order('value');
        if (huyenData) setHuyenList(huyenData);
      } catch (error) {
        console.error('Error loading huyen list:', error);
      }
    };

    loadHuyenList();
  }, [maTinh]);

  // Get unique filter options for debugging
  const getUniqueFilterOptions = () => {
    const uniqueDonVi = [...new Set(participantsList.map(p => p.ke_khai?.don_vi_id).filter(Boolean))];
    const uniqueStatus = [...new Set(participantsList.map(p => p.participant_status).filter(Boolean))];

    console.log('HoSoDaXuLy: Unique filter options:', {
      donVi: uniqueDonVi,
      status: uniqueStatus
    });
  };

  // Quick scan for duplicates
  const handleQuickScan = async () => {
    if (!user?.id) return;

    setQuickScanLoading(true);
    try {
      const result = await keKhaiService.findAllDuplicates(user.id);

      const totalBhxhDuplicates = result.bhxhDuplicates.length;
      const totalNameDuplicates = result.nameDuplicates.length;
      const totalAffectedRecords =
        result.bhxhDuplicates.reduce((sum, group) => sum + group.participants.length, 0) +
        result.nameDuplicates.reduce((sum, group) => sum + group.participants.length, 0);

      if (totalBhxhDuplicates === 0 && totalNameDuplicates === 0) {
        showToast('🎉 Không tìm thấy dữ liệu trùng lặp trong hệ thống!', 'success');
      } else {
        const message = `⚠️ Tìm thấy ${totalBhxhDuplicates} nhóm trùng mã BHXH và ${totalNameDuplicates} nhóm trùng họ tên (${totalAffectedRecords} bản ghi bị ảnh hưởng)`;
        showToast(message, 'error');

        // Tự động mở modal để xem chi tiết
        setShowDuplicateCheckModal(true);
      }
    } catch (error) {
      console.error('Error in quick scan:', error);
      showToast('Có lỗi xảy ra khi quét dữ liệu trùng lặp', 'error');
    } finally {
      setQuickScanLoading(false);
    }
  };

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
            ✓ Đã nộp lên công ty
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            🔄 Đang xử lý
          </span>
        );
      case 'request_sent':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            📤 Đã gửi yêu cầu phát sinh
          </span>
        );
      case 'request_confirmed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            ✅ Đã xác nhận yêu cầu phát sinh
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            ✅ Hoàn thành
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

  // Get processing unit based on participant data
  const getProcessingUnit = (participant: ProcessedParticipant) => {
    // Return processing unit based on ke khai or participant data
    return participant.ke_khai.loai_ke_khai || '603';
  };

  // Get form type (online/offline)
  const getFormType = (participant: ProcessedParticipant) => {
    // All submissions through this system are online
    return 'Qua web';
  };

  // Get BHXH submission date
  const getBhxhSubmissionDate = (participant: ProcessedParticipant) => {
    // Return BHXH submission date if available
    return participant.ke_khai.approved_at ? formatDate(participant.ke_khai.approved_at) : '—';
  };

  // Get BHXH receipt date
  const getBhxhReceiptDate = (participant: ProcessedParticipant) => {
    // Return BHXH receipt date if available
    return '—'; // Placeholder for now
  };

  // Get mã hồ sơ từ participant hoặc kê khai
  const getMaHoSo = (participant: ProcessedParticipant): string | null => {
    return participant.ma_ho_so || participant.ke_khai.ma_ho_so || null;
  };

  // Refresh thông báo BHXH cho một participant cụ thể
  const handleRefreshBhxhNotification = async (participant: ProcessedParticipant) => {
    const maHoSo = getMaHoSo(participant);
    if (!maHoSo) {
      showToast('Người tham gia chưa có mã hồ sơ', 'warning');
      return;
    }

    try {
      setLoadingBhxhNotifications(true);
      const notification = await bhxhNotificationService.getNotificationByHoSo(maHoSo);

      setBhxhNotifications(prev => ({
        ...prev,
        [maHoSo]: notification
      }));

      showToast('Đã cập nhật thông báo BHXH', 'success');
    } catch (error) {
      console.error('Error refreshing BHXH notification:', error);
      showToast('Không thể cập nhật thông báo BHXH', 'error');
    } finally {
      setLoadingBhxhNotifications(false);
    }
  };

  // Get notification/result message
  const getNotificationMessage = (participant: ProcessedParticipant) => {
    // Kiểm tra thông báo BHXH trước
    const maHoSo = getMaHoSo(participant);
    if (maHoSo && bhxhNotifications[maHoSo]) {
      const notification = bhxhNotifications[maHoSo];
      return bhxhNotificationService.formatNotificationMessage(notification);
    }

    // Fallback về logic cũ
    if (participant.ke_khai.trang_thai === 'processing') {
      return 'Đang xử lý';
    }
    if (participant.ke_khai.trang_thai === 'request_sent') {
      return 'Đã gửi yêu cầu phát sinh';
    }
    if (participant.ke_khai.trang_thai === 'request_confirmed') {
      return 'Đã xác nhận yêu cầu phát sinh';
    }
    if (participant.ke_khai.trang_thai === 'completed') {
      return 'Hoàn thành';
    }
    if (participant.participant_status === 'approved') {
      return 'Đã duyệt';
    }
    if (participant.participant_status === 'rejected') {
      return 'Từ chối';
    }
    return '—';
  };

  // Get notification status for styling
  const getNotificationStatus = (participant: ProcessedParticipant): 'success' | 'warning' | 'error' | 'info' => {
    const maHoSo = getMaHoSo(participant);
    if (maHoSo && bhxhNotifications[maHoSo]) {
      return bhxhNotificationService.getNotificationStatus(bhxhNotifications[maHoSo]);
    }

    // Fallback status
    if (participant.participant_status === 'approved') return 'success';
    if (participant.participant_status === 'rejected') return 'error';
    if (participant.ke_khai.trang_thai === 'processing') return 'warning';
    if (participant.ke_khai.trang_thai === 'request_sent') return 'info';
    if (participant.ke_khai.trang_thai === 'request_confirmed') return 'success';
    if (participant.ke_khai.trang_thai === 'completed') return 'success';
    return 'info';
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, participant: ProcessedParticipant) => {
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
  const handleContextMenuAction = (action: string, participant: ProcessedParticipant) => {
    closeContextMenu();

    switch (action) {
      case 'view-participant':
        handleViewParticipantDetails(participant);
        break;
      case 'view-kekhai':
        // Navigate to the form page with the keKhaiId to view/edit
        navigateToPage('ke-khai-603-form', {
          declarationCode: '603',
          declarationName: 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT',
          keKhaiId: participant.ke_khai.id
        });
        break;
      default:
        break;
    }
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

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = participantsList.map(p => p.id);
      setSelectedParticipants(new Set(allIds));
    } else {
      setSelectedParticipants(new Set());
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.show]);

  // Handle view details
  const handleViewDetails = (keKhai: DanhSachKeKhai) => {
    // Navigate to the form page with the keKhaiId to view/edit
    navigateToPage('ke-khai-603-form', {
      declarationCode: '603',
      declarationName: 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT',
      keKhaiId: keKhai.id
    });
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
                {donViList.map((donVi, index) => (
                  <option key={donVi.id || `donvi-${index}`} value={donVi.ma_don_vi}>
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
                {tinhList.map((tinh, index) => (
                  <option key={tinh.ma || `tinh-${index}`} value={tinh.ma}>
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

            {/* Trạng thái cá nhân */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="all">Tất cả trạng thái cá nhân</option>
                <option value="submitted">Đã nộp lên công ty</option>
                <option value="processing">Đang xử lý</option>
                <option value="request_sent">Đã gửi yêu cầu phát sinh</option>
                <option value="request_confirmed">Đã xác nhận yêu cầu phát sinh</option>
                <option value="completed">Hoàn thành</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>

            {/* Trạng thái thanh toán */}
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
                {huyenList.map((huyen, index) => (
                  <option key={huyen.ma || `huyen-${index}`} value={huyen.ma}>
                    {huyen.ma} - {huyen.ten}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
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
                  setFilterPaymentStatus('all');
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
                onClick={loadProcessedParticipantsData}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tìm kiếm
              </button>
              <button
                onClick={() => setShowDuplicateCheckModal(true)}
                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                title="Kiểm tra trùng lặp mã BHXH và họ tên"
              >
                <UserCheck className="w-4 h-4" />
                <span>Kiểm tra trùng lặp</span>
              </button>
              <button
                onClick={handleQuickScan}
                disabled={quickScanLoading}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                title="Quét nhanh toàn bộ hệ thống để tìm trùng lặp"
              >
                <Search className={`w-4 h-4 ${quickScanLoading ? 'animate-spin' : ''}`} />
                <span>{quickScanLoading ? 'Đang quét...' : 'Quét nhanh'}</span>
              </button>
            </div>

            {/* Empty space */}
            <div></div>

            {/* Results count */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              Tìm thấy {totalParticipants} người tham gia
            </div>
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
            <table className="w-full min-w-[1600px] border border-gray-300 dark:border-gray-600">
              <thead className="bg-blue-100 dark:bg-blue-900/30">
                <tr>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={participantsList.length > 0 && selectedParticipants.size === participantsList.length}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = selectedParticipants.size > 0 && selectedParticipants.size < participantsList.length;
                          }
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        title="Chọn tất cả người tham gia"
                      />
                    </div>
                  </th>
                  <th className="px-2 py-4 text-center text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    STT
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Họ tên
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Mã BHXH
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Số CMND
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Số tiền
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Ngày lập
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Ngày nộp
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    TT hồ sơ
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Kết quả
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Đơn vị
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Hình thức
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Nộp BHXH
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Nhận BHXH
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                    Thông báo BHXH
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {participantsList.map((participant, index) => (
                  <tr
                    key={participant.id}
                    className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer ${
                      selectedParticipants.has(participant.id)
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500'
                        : index % 2 === 0
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                    onContextMenu={(e) => handleContextMenu(e, participant)}
                    title="Bấm chuột phải để xem menu tùy chọn"
                  >
                    <td className="px-2 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.has(participant.id)}
                        onChange={(e) => handleParticipantSelect(participant.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        title="Chọn người tham gia"
                      />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {participant.ho_ten}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {participant.ma_so_bhxh && participant.ma_so_bhxh.trim() ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {participant.ma_so_bhxh.trim()}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Chưa có mã BHXH</span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {participant.so_cccd}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(participant.tien_dong_thuc_te || participant.tien_dong || 0)}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(participant.ke_khai.created_at)}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {participant.submitted_at ? formatDate(participant.submitted_at) : '—'}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {getParticipantStatusBadge(participant.participant_status)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {getDeclarationStatusBadge(participant.ke_khai.trang_thai)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getProcessingUnit(participant)}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getFormType(participant)}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getBhxhSubmissionDate(participant)}
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getBhxhReceiptDate(participant)}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-left text-sm">
                      <div className="flex items-center space-x-2 group">
                        <div className="flex-1">
                          {(() => {
                            const maHoSo = getMaHoSo(participant);
                            if (maHoSo) {
                              if (loadingBhxhNotifications) {
                                return (
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                                    <span className="text-gray-400">Đang tải...</span>
                                  </div>
                                );
                              } else if (bhxhNotifications[maHoSo]) {
                                return (
                                  <div className="max-w-xs">
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      getNotificationStatus(participant) === 'success'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : getNotificationStatus(participant) === 'warning'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : getNotificationStatus(participant) === 'error'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                      <Bell className="w-3 h-3 mr-1" />
                                      <div className="truncate max-w-44" title={getNotificationMessage(participant)}>
                                        {getNotificationMessage(participant)}
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                    Chưa có thông báo
                                  </span>
                                );
                              }
                            } else {
                              return (
                                <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                  Chưa có mã hồ sơ
                                </span>
                              );
                            }
                          })()}
                        </div>
                        {getMaHoSo(participant) && (
                          <button
                            onClick={() => handleRefreshBhxhNotification(participant)}
                            disabled={loadingBhxhNotifications}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity disabled:opacity-50"
                            title="Cập nhật thông báo BHXH"
                          >
                            <Bell className="w-3 h-3" />
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

      {/* Context Menu */}
      {contextMenu.show && contextMenu.participant && (
        <div
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 min-w-[200px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            transform: 'translate(-50%, 0)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleContextMenuAction('view-participant', contextMenu.participant!)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Xem chi tiết người tham gia</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('view-kekhai', contextMenu.participant!)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          >
            <Building className="w-4 h-4" />
            <span>Xem chi tiết hồ sơ</span>
          </button>
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

      {/* Duplicate Check Modal */}
      <DuplicateCheckModal
        isOpen={showDuplicateCheckModal}
        onClose={() => setShowDuplicateCheckModal(false)}
        userId={user?.id}
      />
    </div>
  );
};

export default HoSoDaXuLy;
