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
  User,
  CreditCard,
  FileSpreadsheet,
  Download,
  Trash2,
  Play,
  DollarSign
} from 'lucide-react';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';
import paymentService from '../services/paymentService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import KeKhaiApprovalModal from '../components/KeKhaiApprovalModal';
import PaymentQRModal from '../components/PaymentQRModal';
import DebugKeKhaiList from '../components/DebugKeKhaiList';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import nguoiDungService from '../../quan-ly/services/nguoiDungService';
import { exportD03TK1VNPTExcel } from '../../../shared/utils/excelExport';

const KeKhaiManagement: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // State management
  const [keKhaiList, setKeKhaiList] = useState<DanhSachKeKhai[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User names mapping state
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loadingUserNames, setLoadingUserNames] = useState(false);

  // Payment amounts mapping state
  const [paymentAmounts, setPaymentAmounts] = useState<Record<number, number>>({});
  const [loadingPaymentAmounts, setLoadingPaymentAmounts] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Loading states for specific actions
  const [completingKeKhaiId, setCompletingKeKhaiId] = useState<number | null>(null);
  const [exportingKeKhaiId, setExportingKeKhaiId] = useState<number | null>(null);
  const [processingKeKhaiId, setProcessingKeKhaiId] = useState<number | null>(null);
  
  // Modal states
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    keKhai: DanhSachKeKhai | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    keKhai: null,
    isDeleting: false
  });

  // Function to fetch user names
  const fetchUserNames = async (userIds: string[]) => {
    if (userIds.length === 0) return;

    setLoadingUserNames(true);
    try {
      const uniqueUserIds = [...new Set(userIds)].filter(id => id && !userNames[id]);

      if (uniqueUserIds.length === 0) {
        setLoadingUserNames(false);
        return;
      }

      console.log('🔍 Fetching user names for IDs:', uniqueUserIds);

      const userPromises = uniqueUserIds.map(async (userId) => {
        try {
          const user = await nguoiDungService.getNguoiDungById(parseInt(userId));
          return { id: userId, name: user?.ho_ten || `User ${userId}` };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return { id: userId, name: `User ${userId}` };
        }
      });

      const userResults = await Promise.all(userPromises);

      const newUserNames = { ...userNames };
      userResults.forEach(({ id, name }) => {
        newUserNames[id] = name;
      });

      setUserNames(newUserNames);
      console.log('🔍 Updated user names:', newUserNames);
    } catch (error) {
      console.error('Error fetching user names:', error);
    } finally {
      setLoadingUserNames(false);
    }
  };

  // Function to fetch payment amounts for ke khai records
  const fetchPaymentAmounts = async (keKhaiIds: number[]) => {
    if (keKhaiIds.length === 0) return;

    setLoadingPaymentAmounts(true);
    try {
      const uniqueKeKhaiIds = [...new Set(keKhaiIds)].filter(id => id && !paymentAmounts[id]);

      if (uniqueKeKhaiIds.length === 0) {
        setLoadingPaymentAmounts(false);
        return;
      }

      console.log('🔍 Fetching payment amounts for ke khai IDs:', uniqueKeKhaiIds);

      const amountPromises = uniqueKeKhaiIds.map(async (keKhaiId) => {
        try {
          // Try to get existing payment first
          const existingPayment = await paymentService.getPaymentByKeKhaiId(keKhaiId);
          if (existingPayment) {
            return { id: keKhaiId, amount: existingPayment.so_tien };
          }

          // If no payment exists, calculate the total amount
          const totalAmount = await paymentService.calculateTotalAmount(keKhaiId);
          return { id: keKhaiId, amount: totalAmount };
        } catch (error) {
          console.error(`Error fetching payment amount for ke khai ${keKhaiId}:`, error);
          return { id: keKhaiId, amount: 0 };
        }
      });

      const amountResults = await Promise.all(amountPromises);

      const newPaymentAmounts = { ...paymentAmounts };
      amountResults.forEach(({ id, amount }) => {
        newPaymentAmounts[id] = amount;
      });

      setPaymentAmounts(newPaymentAmounts);
      console.log('🔍 Updated payment amounts:', newPaymentAmounts);
    } catch (error) {
      console.error('Error fetching payment amounts:', error);
    } finally {
      setLoadingPaymentAmounts(false);
    }
  };

  // Load data
  const loadKeKhaiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams: KeKhaiSearchParams = {};

      if (searchTerm) {
        searchParams.ma_ke_khai = searchTerm;
      }

      if (filterStatus !== 'all') {
        searchParams.trang_thai = filterStatus;
      }

      if (filterType !== 'all') {
        searchParams.loai_ke_khai = filterType;
      }

      if (dateFrom) {
        searchParams.tu_ngay = dateFrom;
      }

      if (dateTo) {
        searchParams.den_ngay = dateTo;
      }

      // QUAN TRỌNG: Kiểm tra quyền user để quyết định filter
      let data: any[] = [];
      if (user?.id) {
        console.log('🔍 KeKhaiManagement: Loading data for user:', user.id);

        // Management page should show all declarations that need approval, not just user's own
        // This is for synthesis staff to review declarations from collection staff
        try {
          const isAdmin = await keKhaiService.isUserAdmin(user.id);
          console.log('🔍 User admin status:', isAdmin);

          if (isAdmin) {
            // Admin có thể xem tất cả kê khai (không filter theo created_by)
            console.log('🔍 Loading data for admin user');
            data = await keKhaiService.getKeKhaiForApprovalForAdmin(searchParams);
          } else {
            // Synthesis staff should see all declarations that need approval, not just their own
            // Remove created_by filter to allow synthesis staff to see collection staff submissions
            console.log('🔍 Loading data for synthesis staff (all declarations needing approval)');
            data = await keKhaiService.getKeKhaiForApprovalForAdmin(searchParams);
          }
        } catch (adminCheckError) {
          console.error('Error checking admin status, falling back to regular approval list:', adminCheckError);
          // Fallback: show all declarations needing approval
          data = await keKhaiService.getKeKhaiForApprovalForAdmin(searchParams);
        }
      } else {
        // Nếu không có user, không hiển thị gì
        console.log('🔍 No user found, showing empty list');
        data = [];
      }

      console.log('🔍 KeKhaiManagement: Loaded data count:', data.length);
      console.log('🔍 KeKhaiManagement: Sample data:', data.slice(0, 3).map(item => ({
        id: item.id,
        ma_ke_khai: item.ma_ke_khai,
        trang_thai: item.trang_thai,
        created_by: item.created_by
      })));

      // If no data found with approval filter, try getting all declarations for debugging
      if (data.length === 0) {
        console.log('🔍 No data found with approval filter, trying to get all declarations for debugging...');
        try {
          const allData = await keKhaiService.getKeKhaiListForAdmin(searchParams);
          console.log('🔍 All declarations count:', allData.length);
          console.log('🔍 All declarations sample:', allData.slice(0, 5).map(item => ({
            id: item.id,
            ma_ke_khai: item.ma_ke_khai,
            trang_thai: item.trang_thai,
            created_by: item.created_by
          })));

          // For debugging purposes, show all declarations if approval filter returns empty
          // TODO: Remove this in production and fix the root cause
          data = allData;
        } catch (debugError) {
          console.error('Error getting all declarations for debugging:', debugError);
        }
      }

      setKeKhaiList(data);

      // Fetch user names for creators
      const userIds = data
        .map(item => item.created_by)
        .filter(id => id) as string[];

      if (userIds.length > 0) {
        await fetchUserNames(userIds);
      }

      // Fetch payment amounts for ke khai records
      const keKhaiIds = data
        .map(item => item.id)
        .filter(id => id) as number[];

      if (keKhaiIds.length > 0) {
        await fetchPaymentAmounts(keKhaiIds);
      }
    } catch (err) {
      console.error('Error loading ke khai data:', err);
      setError('Không thể tải danh sách kê khai. Vui lòng thử lại.');
      showToast('Không thể tải danh sách kê khai', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    loadKeKhaiData();
  }, [searchTerm, filterStatus, filterType, dateFrom, dateTo]);

  // Listen for payment confirmation events to auto-reload data
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('KeKhaiManagement: Payment confirmed event received', data);
      loadKeKhaiData();
      showToast('Kê khai đã được cập nhật trạng thái sau thanh toán', 'success');
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      console.log('KeKhaiManagement: Ke khai status changed event received', data);
      loadKeKhaiData();
    };

    const handleRefreshAllPages = (data: any) => {
      console.log('KeKhaiManagement: Refresh all pages event received', data);
      loadKeKhaiData();
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_KE_KHAI_MANAGEMENT, loadKeKhaiData);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_KE_KHAI_MANAGEMENT, loadKeKhaiData);
    };
  }, []);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
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
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ thanh toán
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã thanh toán
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
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
            {status}
          </span>
        );
    }
  };

  // Handle view detail
  const handleViewDetail = (keKhai: DanhSachKeKhai) => {
    setSelectedKeKhai(keKhai);
    setShowDetailModal(true);
  };

  // Handle approve/reject
  const handleApprovalAction = (keKhai: DanhSachKeKhai, action: 'approve' | 'reject') => {
    setSelectedKeKhai(keKhai);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  // Handle approval success
  const handleApprovalSuccess = () => {
    setShowApprovalModal(false);
    setSelectedKeKhai(null);
    loadKeKhaiData(); // Reload data
    showToast(
      approvalAction === 'approve' ? 'Đã duyệt kê khai thành công' : 'Đã từ chối kê khai thành công',
      'success'
    );
  };

  // Handle complete ke khai (chuyển từ processing sang completed)
  const handleCompleteKeKhai = async (keKhai: DanhSachKeKhai) => {
    // Prevent multiple clicks
    if (completingKeKhaiId === keKhai.id) return;

    setCompletingKeKhaiId(keKhai.id);

    try {
      console.log('Starting to complete ke khai:', keKhai.id);

      // Cập nhật trạng thái kê khai thành completed
      const result = await keKhaiService.updateKeKhaiStatus(
        keKhai.id,
        'completed',
        user?.id?.toString(),
        'Hoàn thành xử lý kê khai'
      );

      console.log('Successfully updated ke khai status:', result);

      // Emit events để đồng bộ dữ liệu
      eventEmitter.emit(EVENTS.KE_KHAI_STATUS_CHANGED, {
        keKhaiId: keKhai.id,
        oldStatus: 'processing',
        newStatus: 'completed',
        keKhaiData: result,
        timestamp: new Date().toISOString()
      });

      eventEmitter.emit(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, {
        reason: 'ke_khai_completed',
        keKhaiId: keKhai.id,
        keKhaiData: result
      });

      // Reload data và hiển thị thông báo
      await loadKeKhaiData();
      showToast(`Đã hoàn thành kê khai ${keKhai.ma_ke_khai} thành công`, 'success');

    } catch (error: any) {
      console.error('Error completing ke khai:', error);

      // Hiển thị lỗi cụ thể
      const errorMessage = error?.message || 'Không thể hoàn thành kê khai';
      showToast(`Lỗi: ${errorMessage}`, 'error');

      // Log chi tiết để debug
      console.error('Detailed error:', {
        keKhaiId: keKhai.id,
        userId: user?.id,
        error: error
      });
    } finally {
      setCompletingKeKhaiId(null);
    }
  };

  // Handle view payment
  const handleViewPayment = async (keKhai: DanhSachKeKhai) => {
    try {
      const payment = await paymentService.getPaymentByKeKhaiId(keKhai.id);
      if (payment) {
        setPaymentInfo(payment);
        setShowPaymentModal(true);
      } else {
        showToast('Không tìm thấy thông tin thanh toán', 'error');
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
      showToast('Không thể lấy thông tin thanh toán', 'error');
    }
  };

  // Handle payment confirmed
  const handlePaymentConfirmed = () => {
    setShowPaymentModal(false);
    setPaymentInfo(null);
    loadKeKhaiData(); // Reload data
    showToast('Thanh toán đã được xác nhận', 'success');
  };

  // Helper function to convert participant data for export
  const convertParticipantToExportFormat = (item: any, keKhaiInfo: DanhSachKeKhai) => {
    return {
      id: item.id,
      hoTen: item.ho_ten || '',
      maSoBHXH: item.ma_so_bhxh || '',
      ngaySinh: item.ngay_sinh || '',
      gioiTinh: item.gioi_tinh || '',
      soCCCD: item.so_cccd || '',
      noiDangKyKCB: item.noi_dang_ky_kcb || '',
      soDienThoai: item.so_dien_thoai || '',
      soTheBHYT: item.so_the_bhyt || '',
      maTinhNkq: item.ma_tinh_nkq || '',
      maHuyenNkq: item.ma_huyen_nkq || '',
      maXaNkq: item.ma_xa_nkq || '',
      noiNhanHoSo: item.noi_nhan_ho_so || '',
      mucLuong: item.muc_luong || 0,
      tyLeDong: item.ty_le_dong || 0,
      soTienDong: item.tien_dong || 0,
      tienDong: item.tien_dong || 0,
      tienDongThucTe: item.tien_dong_thuc_te || 0,
      tinhKCB: item.tinh_kcb || '',
      maBenhVien: item.ma_benh_vien || '',
      phuongAn: item.phuong_an || '',
      soThangDong: item.so_thang_dong || 0,
      sttHo: item.stt_ho || '',
      tuNgayTheMoi: item.tu_ngay_the_moi || '',
      denNgayTheMoi: item.den_ngay_the_moi || '',
      ngayBienLai: item.ngay_bien_lai || '',
      // Additional fields for export
      danToc: item.dan_toc || '',
      quocTich: item.quoc_tich || 'VN',
      maTinhKS: item.ma_tinh_ks || '',
      maHuyenKS: item.ma_huyen_ks || '',
      maXaKS: item.ma_xa_ks || '',
      maHoGiaDinh: item.ma_ho_gia_dinh || '',
      tuNgayTheCu: item.tu_ngay_the_cu || '',
      denNgayTheCu: item.den_ngay_the_cu || '',
      tenBenhVien: '', // Will be resolved from ma_benh_vien if needed
      ke_khai: keKhaiInfo
    };
  };

  // Get employee code for export tracking
  const getEmployeeCode = async (): Promise<string> => {
    try {
      if (user?.id) {
        const userData = await nguoiDungService.getNguoiDungById(parseInt(user.id));
        return userData?.ma_nhan_vien || user.id;
      }
      return 'UNKNOWN';
    } catch (error) {
      console.error('Error getting employee code:', error);
      return user?.id || 'UNKNOWN';
    }
  };

  // Handle export D03 TK1 VNPT for a specific ke khai
  const handleExportD03TK1VNPT = async (keKhai: DanhSachKeKhai) => {
    if (exportingKeKhaiId === keKhai.id) return;

    setExportingKeKhaiId(keKhai.id);

    try {
      console.log('Starting D03 TK1 VNPT export for ke khai:', keKhai.id);

      // Get participants for this ke khai
      const participants = await keKhaiService.getNguoiThamGiaByKeKhai(keKhai.id);

      if (!participants || participants.length === 0) {
        showToast('Kê khai này chưa có người tham gia nào để xuất Excel', 'warning');
        return;
      }

      console.log('Found participants for export:', participants.length);

      // Convert participants to export format
      const convertedParticipants = participants.map(participant =>
        convertParticipantToExportFormat(participant, keKhai)
      );

      // Get employee code for tracking
      const maNhanVienThu = await getEmployeeCode();

      // Generate filename
      const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const fileName = `D03-TK1-VNPT_${keKhai.ma_ke_khai}_${currentDate}.xlsx`;

      // Export Excel
      await exportD03TK1VNPTExcel(convertedParticipants, keKhai, maNhanVienThu, fileName);

      showToast(`Đã xuất file Excel D03-TK1-VNPT cho kê khai ${keKhai.ma_ke_khai} thành công!`, 'success');
    } catch (error) {
      console.error('Error exporting D03-TK1-VNPT Excel:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xuất Excel';
      showToast(`Lỗi xuất Excel: ${errorMessage}`, 'error');
    } finally {
      setExportingKeKhaiId(null);
    }
  };

  // Handle bulk export D03 TK1 VNPT for all visible ke khai
  const handleBulkExportD03TK1VNPT = async () => {
    if (exportingKeKhaiId !== null || keKhaiList.length === 0) return;

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const keKhai of keKhaiList) {
        try {
          await handleExportD03TK1VNPT(keKhai);
          successCount++;
          // Add a small delay between exports to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error exporting ke khai ${keKhai.ma_ke_khai}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast(`Đã xuất thành công ${successCount} file D03-TK1-VNPT${errorCount > 0 ? `, ${errorCount} file lỗi` : ''}`, 'success');
      } else {
        showToast('Không thể xuất file nào', 'error');
      }
    } catch (error) {
      console.error('Error in bulk export:', error);
      showToast('Có lỗi xảy ra khi xuất hàng loạt', 'error');
    }
  };

  // Handle delete ke khai
  const handleDeleteKeKhai = (keKhai: DanhSachKeKhai) => {
    setDeleteModal({
      isOpen: true,
      keKhai,
      isDeleting: false
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      keKhai: null,
      isDeleting: false
    });
  };

  // Confirm delete ke khai
  const confirmDeleteKeKhai = async () => {
    if (!deleteModal.keKhai) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      console.log('Deleting ke khai:', deleteModal.keKhai.id);

      await keKhaiService.deleteKeKhai(deleteModal.keKhai.id);

      // Remove from local list
      setKeKhaiList(prev => prev.filter(kk => kk.id !== deleteModal.keKhai!.id));

      showToast(`Đã xóa kê khai ${deleteModal.keKhai.ma_ke_khai} thành công`, 'success');

      // Close modal
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting ke khai:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa kê khai';
      showToast(`Lỗi xóa kê khai: ${errorMessage}`, 'error');
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Handle set ke khai to processing status
  const handleSetProcessing = async (keKhai: DanhSachKeKhai) => {
    if (processingKeKhaiId === keKhai.id) return;

    setProcessingKeKhaiId(keKhai.id);

    try {
      console.log('Setting ke khai to processing:', keKhai.id);

      const result = await keKhaiService.setKeKhaiProcessing(
        keKhai.id,
        user?.id || '',
        'Chuyển sang trạng thái đang xử lý'
      );

      // Update local list
      setKeKhaiList(prev =>
        prev.map(kk =>
          kk.id === keKhai.id
            ? { ...kk, trang_thai: 'processing', updated_at: result.updated_at }
            : kk
        )
      );

      showToast(`Đã chuyển kê khai ${keKhai.ma_ke_khai} sang trạng thái đang xử lý`, 'success');

      // Emit events để đồng bộ dữ liệu
      eventEmitter.emit(EVENTS.KE_KHAI_STATUS_CHANGED, {
        keKhaiId: keKhai.id,
        oldStatus: keKhai.trang_thai,
        newStatus: 'processing',
        keKhaiData: result,
        timestamp: new Date().toISOString()
      });

      eventEmitter.emit(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, {
        reason: 'ke_khai_set_processing',
        keKhaiId: keKhai.id,
        keKhaiData: result
      });
    } catch (error) {
      console.error('Error setting ke khai to processing:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi chuyển trạng thái';
      showToast(`Lỗi chuyển trạng thái: ${errorMessage}`, 'error');
    } finally {
      setProcessingKeKhaiId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Component - Remove in production */}
      <DebugKeKhaiList />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý kê khai
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Duyệt và quản lý các kê khai từ nhân viên thu
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>{keKhaiList.length} kê khai</span>
          </div>

          {/* Bulk Export Button */}
          {keKhaiList.length > 0 && (
            <button
              onClick={handleBulkExportD03TK1VNPT}
              disabled={exportingKeKhaiId !== null}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                exportingKeKhaiId !== null
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
              title="Xuất D03 TK1 VNPT cho tất cả kê khai hiển thị"
            >
              {exportingKeKhaiId !== null ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Xuất tất cả D03 TK1
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo mã kê khai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="submitted">Chờ duyệt</option>
            <option value="pending_payment">Chờ thanh toán</option>
            <option value="processing">Đang xử lý</option>
            <option value="approved">Đã duyệt</option>
            <option value="completed">Hoàn thành</option>
            <option value="rejected">Từ chối</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả loại</option>
            <option value="603">Kê khai 603</option>
            <option value="604">Kê khai 604</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />

          {/* Date To */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Ke Khai List */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {keKhaiList.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không có kê khai nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có kê khai nào cần duyệt hoặc không tìm thấy kết quả phù hợp.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mã kê khai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tên kê khai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Người tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {keKhaiList.map((keKhai) => (
                    <tr key={keKhai.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {keKhai.ma_ke_khai}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {keKhai.ten_ke_khai}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {keKhai.doi_tuong_tham_gia || 'Chưa xác định'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {keKhai.loai_ke_khai}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(keKhai.trang_thai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(keKhai.created_at || '').toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {keKhai.created_by ? (
                            loadingUserNames ? (
                              <span className="text-gray-400">Đang tải...</span>
                            ) : (
                              userNames[keKhai.created_by] || keKhai.created_by
                            )
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center justify-end">
                          <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                          {loadingPaymentAmounts ? (
                            <span className="text-gray-400">Đang tải...</span>
                          ) : (
                            <span className="font-medium">
                              {paymentAmounts[keKhai.id]
                                ? paymentService.formatCurrency(paymentAmounts[keKhai.id])
                                : '0 ₫'
                              }
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetail(keKhai)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Approval/Action buttons - available for all statuses */}
                          {keKhai.trang_thai === 'submitted' && (
                            <>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'approve')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Duyệt"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Từ chối"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {keKhai.trang_thai === 'processing' && (
                            <>
                              <button
                                onClick={() => handleCompleteKeKhai(keKhai)}
                                disabled={completingKeKhaiId === keKhai.id}
                                className={`${
                                  completingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                }`}
                                title={completingKeKhaiId === keKhai.id ? 'Đang xử lý...' : 'Hoàn thành kê khai'}
                              >
                                {completingKeKhaiId === keKhai.id ? (
                                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                disabled={completingKeKhaiId === keKhai.id}
                                className={`${
                                  completingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                }`}
                                title="Từ chối"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Approval buttons for other statuses */}
                          {(keKhai.trang_thai === 'draft' ||
                            keKhai.trang_thai === 'approved' ||
                            keKhai.trang_thai === 'completed' ||
                            keKhai.trang_thai === 'paid') && (
                            <>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'approve')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title={
                                  keKhai.trang_thai === 'draft' ? 'Duyệt kê khai nháp' :
                                  keKhai.trang_thai === 'approved' ? 'Duyệt lại' :
                                  keKhai.trang_thai === 'completed' ? 'Duyệt lại kê khai đã hoàn thành' :
                                  keKhai.trang_thai === 'paid' ? 'Duyệt lại kê khai đã thanh toán' :
                                  'Duyệt'
                                }
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title={
                                  keKhai.trang_thai === 'draft' ? 'Từ chối kê khai nháp' :
                                  keKhai.trang_thai === 'approved' ? 'Hủy duyệt' :
                                  keKhai.trang_thai === 'completed' ? 'Từ chối kê khai đã hoàn thành' :
                                  keKhai.trang_thai === 'paid' ? 'Từ chối kê khai đã thanh toán' :
                                  'Từ chối'
                                }
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Special handling for rejected status */}
                          {keKhai.trang_thai === 'rejected' && (
                            <button
                              onClick={() => handleApprovalAction(keKhai, 'approve')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Duyệt lại kê khai đã bị từ chối"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {keKhai.trang_thai === 'pending_payment' && (
                            <>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'approve')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Duyệt kê khai chờ thanh toán"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Từ chối kê khai chờ thanh toán"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleViewPayment(keKhai)}
                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                title="Xem thông tin thanh toán"
                              >
                                <CreditCard className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Export D03 TK1 VNPT button - available for all statuses */}
                          <button
                            onClick={() => handleExportD03TK1VNPT(keKhai)}
                            disabled={exportingKeKhaiId === keKhai.id}
                            className={`${
                              exportingKeKhaiId === keKhai.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                            }`}
                            title={exportingKeKhaiId === keKhai.id ? 'Đang xuất Excel...' : 'Xuất D03 TK1 VNPT'}
                          >
                            {exportingKeKhaiId === keKhai.id ? (
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileSpreadsheet className="w-4 h-4" />
                            )}
                          </button>

                          {/* Set Processing button - available for non-processing statuses */}
                          {keKhai.trang_thai !== 'processing' && (
                            <button
                              onClick={() => handleSetProcessing(keKhai)}
                              disabled={processingKeKhaiId === keKhai.id}
                              className={`${
                                processingKeKhaiId === keKhai.id
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                              }`}
                              title={
                                processingKeKhaiId === keKhai.id
                                  ? 'Đang chuyển trạng thái...'
                                  : 'Chuyển sang trạng thái đang xử lý'
                              }
                            >
                              {processingKeKhaiId === keKhai.id ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Delete button - available for all statuses */}
                          <button
                            onClick={() => handleDeleteKeKhai(keKhai)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Xóa kê khai"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
          action={approvalAction}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedKeKhai(null);
          }}
          onSuccess={handleApprovalSuccess}
        />
      )}

      {showPaymentModal && paymentInfo && (
        <PaymentQRModal
          payment={paymentInfo}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentInfo(null);
          }}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.keKhai && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Xác nhận xóa kê khai
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Bạn có chắc chắn muốn xóa kê khai{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {deleteModal.keKhai.ma_ke_khai}
                  </span>{' '}
                  không?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Tên kê khai: {deleteModal.keKhai.ten_ke_khai}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Trạng thái: {deleteModal.keKhai.trang_thai}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteModal.isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteKeKhai}
                  disabled={deleteModal.isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteModal.isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                      Đang xóa...
                    </>
                  ) : (
                    'Xóa kê khai'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeKhaiManagement;
