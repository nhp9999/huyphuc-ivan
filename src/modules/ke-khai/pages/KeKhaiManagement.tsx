import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  DollarSign,
  Edit3,
  Save,
  X,
  Bell,
  Image,
  SearchCheck,
  ExternalLink
} from 'lucide-react';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';
import { Pagination } from '../../../shared/components/ui';
import paymentService from '../services/paymentService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import KeKhaiApprovalModal from '../components/KeKhaiApprovalModal';
import PaymentQRModal from '../components/PaymentQRModal';
import PaymentProofModal from '../components/PaymentProofModal';
import BhxhCheckUnsentModal from '../components/BhxhCheckUnsentModal';
import BhxhSearchResultModal from '../components/BhxhSearchResultModal';
import KeKhaiTableRow from '../components/KeKhaiTableRow';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import nguoiDungService from '../../quan-ly/services/nguoiDungService';
import { exportD03TK1VNPTExcel } from '../../../shared/utils/excelExport';
import bhxhNotificationService from '../services/bhxhNotificationService';

const KeKhaiManagement: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { setCurrentPage: navigateToPage } = useNavigation();
  
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
  
  // Helper function to get saved filter state from localStorage
  const getSavedFilterState = () => {
    try {
      const saved = localStorage.getItem('keKhaiManagement_filters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          searchTerm: parsed.searchTerm || '',
          searchBhxh: parsed.searchBhxh || '',
          filterStatus: parsed.filterStatus || 'all',
          filterType: parsed.filterType || 'all',
          dateFrom: parsed.dateFrom || '',
          dateTo: parsed.dateTo || '',
          sortField: parsed.sortField || 'created_at',
          sortDirection: parsed.sortDirection || 'desc'
        };
      }
    } catch (error) {
      console.warn('Error loading saved filter state:', error);
    }
    return {
      searchTerm: '',
      searchBhxh: '',
      filterStatus: 'all',
      filterType: 'all',
      dateFrom: '',
      dateTo: '',
      sortField: 'created_at' as const,
      sortDirection: 'desc' as const
    };
  };

  // Initialize states with saved values
  const savedState = getSavedFilterState();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(savedState.searchTerm);
  const [searchBhxh, setSearchBhxh] = useState(savedState.searchBhxh || '');
  const [filterStatus, setFilterStatus] = useState<string>(savedState.filterStatus);
  const [filterType, setFilterType] = useState<string>(savedState.filterType);
  const [dateFrom, setDateFrom] = useState(savedState.dateFrom);
  const [dateTo, setDateTo] = useState(savedState.dateTo);

  // Sort states
  const [sortField, setSortField] = useState<'created_at' | 'submitted_at' | 'paid_at' | 'updated_at'>(savedState.sortField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(savedState.sortDirection);

  // Memoized helper function to save filter state to localStorage
  const saveFilterState = useCallback(() => {
    try {
      const filterState = {
        searchTerm,
        searchBhxh,
        filterStatus,
        filterType,
        dateFrom,
        dateTo,
        sortField,
        sortDirection
      };
      localStorage.setItem('keKhaiManagement_filters', JSON.stringify(filterState));
    } catch (error) {
      console.warn('Error saving filter state:', error);
    }
  }, [searchTerm, searchBhxh, filterStatus, filterType, dateFrom, dateTo, sortField, sortDirection]);

  // Helper function to clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSearchBhxh('');
    setFilterStatus('all');
    setFilterType('all');
    setDateFrom('');
    setDateTo('');
    setSortField('created_at');
    setSortDirection('desc');

    // Also clear from localStorage
    try {
      localStorage.removeItem('keKhaiManagement_filters');
    } catch (error) {
      console.warn('Error clearing filter state:', error);
    }
  }, []);

  // Loading states for specific actions
  const [completingKeKhaiId, setCompletingKeKhaiId] = useState<number | null>(null);
  const [exportingKeKhaiId, setExportingKeKhaiId] = useState<number | null>(null);
  const [processingKeKhaiId, setProcessingKeKhaiId] = useState<number | null>(null);

  // State cho chỉnh sửa mã hồ sơ inline
  const [editingHoSoId, setEditingHoSoId] = useState<number | null>(null);
  const [editingHoSoValue, setEditingHoSoValue] = useState<string>('');
  const [savingHoSo, setSavingHoSo] = useState<number | null>(null);

  // State cho thông báo BHXH
  const [bhxhNotifications, setBhxhNotifications] = useState<Record<string, any>>({});
  const [loadingBhxhNotifications, setLoadingBhxhNotifications] = useState(false);

  // Pagination states - Optimized for faster loading
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Reduced from 20 to 10 for better performance
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showBhxhCheckModal, setShowBhxhCheckModal] = useState(false);
  const [showBhxhSearchModal, setShowBhxhSearchModal] = useState(false);
  const [bhxhSearchResult, setBhxhSearchResult] = useState<any>(null);

  // Context menu states
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    keKhai: DanhSachKeKhai | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    keKhai: null
  });

  // Loading state for proof modal
  const [loadingProof, setLoadingProof] = useState(false);

  // Cache for payment data to reduce API calls
  const [paymentCache, setPaymentCache] = useState<Map<number, any>>(new Map());

  // Selection states for bulk operations
  const [selectedKeKhaiIds, setSelectedKeKhaiIds] = useState<Set<number>>(new Set());

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

  // Bulk delete modal state
  const [bulkDeleteModal, setBulkDeleteModal] = useState<{
    isOpen: boolean;
    isDeleting: boolean;
  }>({
    isOpen: false,
    isDeleting: false
  });

  // Optimized function to fetch user names with caching
  const fetchUserNames = async (userIds: string[]) => {
    if (userIds.length === 0) return;

    setLoadingUserNames(true);
    try {
      const uniqueUserIds = [...new Set(userIds)].filter(id => id && !userNames[id]);

      if (uniqueUserIds.length === 0) {
        setLoadingUserNames(false);
        return;
      }

      // Batch process user requests to reduce server load
      const batchSize = 3; // Optimized for 10 records per page
      const batches = [];

      for (let i = 0; i < uniqueUserIds.length; i += batchSize) {
        batches.push(uniqueUserIds.slice(i, i + batchSize));
      }

      const allResults = [];

      for (const batch of batches) {
        const userPromises = batch.map(async (userId) => {
          try {
            const user = await nguoiDungService.getNguoiDungById(parseInt(userId));
            return { id: userId, name: user?.ho_ten || `User ${userId}` };
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return { id: userId, name: `User ${userId}` };
          }
        });

        const batchResults = await Promise.all(userPromises);
        allResults.push(...batchResults);

        // Small delay between batches (reduced for smaller page size)
        if (batches.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 25));
        }
      }

      const newUserNames = { ...userNames };
      allResults.forEach(({ id, name }) => {
        newUserNames[id] = name;
      });

      setUserNames(newUserNames);
    } catch (error) {
      console.error('Error fetching user names:', error);
    } finally {
      setLoadingUserNames(false);
    }
  };

  // Optimized function to fetch payment amounts for ke khai records
  const fetchPaymentAmounts = async (keKhaiIds: number[]) => {
    if (keKhaiIds.length === 0) return;

    setLoadingPaymentAmounts(true);
    try {
      const uniqueKeKhaiIds = [...new Set(keKhaiIds)].filter(id => id && !paymentAmounts[id]);

      if (uniqueKeKhaiIds.length === 0) {
        setLoadingPaymentAmounts(false);
        return;
      }

      // Batch fetch payment amounts to reduce API calls
      const batchSize = 5; // Optimized for 10 records per page
      const batches = [];

      for (let i = 0; i < uniqueKeKhaiIds.length; i += batchSize) {
        batches.push(uniqueKeKhaiIds.slice(i, i + batchSize));
      }

      const allResults = [];

      for (const batch of batches) {
        const batchPromises = batch.map(async (keKhaiId) => {
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

        const batchResults = await Promise.all(batchPromises);
        allResults.push(...batchResults);

        // Small delay between batches (reduced for smaller page size)
        if (batches.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      const newPaymentAmounts = { ...paymentAmounts };
      allResults.forEach(({ id, amount }) => {
        newPaymentAmounts[id] = amount;
      });

      setPaymentAmounts(newPaymentAmounts);
    } catch (error) {
      console.error('Error fetching payment amounts:', error);
    } finally {
      setLoadingPaymentAmounts(false);
    }
  };

  // Function to fetch BHXH notifications
  const fetchBhxhNotifications = async (keKhaiList: DanhSachKeKhai[]) => {
    if (keKhaiList.length === 0) return;

    setLoadingBhxhNotifications(true);
    try {
      // Lấy danh sách số hồ sơ từ các kê khai có mã hồ sơ
      const soHoSoList = keKhaiList
        .filter(keKhai => keKhai.ma_ho_so && keKhai.ma_ho_so.trim() !== '')
        .map(keKhai => keKhai.ma_ho_so!)
        .filter(soHoSo => !bhxhNotifications[soHoSo]); // Chỉ fetch những cái chưa có

      if (soHoSoList.length === 0) {
        setLoadingBhxhNotifications(false);
        return;
      }

      const notifications = await bhxhNotificationService.getNotificationsForMultipleHoSo(soHoSoList);

      setBhxhNotifications(prev => ({
        ...prev,
        ...notifications
      }));
    } catch (error) {
      console.error('Error fetching BHXH notifications:', error);
    } finally {
      setLoadingBhxhNotifications(false);
    }
  };

  // Memoized load data function with pagination
  const loadKeKhaiData = useCallback(async (page: number = currentPage, size: number = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams: KeKhaiSearchParams = {};

      if (searchTerm) {
        searchParams.ma_ke_khai = searchTerm;
      }

      if (searchBhxh) {
        searchParams.ma_so_bhxh = searchBhxh;
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

      // Add sort parameters
      searchParams.sort_field = sortField;
      searchParams.sort_direction = sortDirection;

      console.log('🔍 Loading ke khai data with filters:', {
        page,
        size,
        searchParams,
        filterStatus,
        searchTerm,
        searchBhxh,
        filterType,
        dateFrom,
        dateTo,
        sortField,
        sortDirection
      });

      // Use paginated API
      if (user?.id) {
        const result = await keKhaiService.getKeKhaiForApprovalForAdminPaginated({
          page,
          pageSize: size,
          searchParams
        });

        // Update pagination state
        setCurrentPage(result.page);
        setPageSize(result.pageSize);
        setTotalRecords(result.total);
        setTotalPages(result.totalPages);
        setKeKhaiList(result.data);

        // Fetch additional data in parallel for better performance
        const userIds = result.data
          .map(item => item.created_by)
          .filter(id => id) as string[];

        const keKhaiIds = result.data
          .map(item => item.id)
          .filter(id => id) as number[];

        // Run all API calls in parallel
        const promises = [];

        if (userIds.length > 0) {
          promises.push(fetchUserNames(userIds));
        }

        if (keKhaiIds.length > 0) {
          promises.push(fetchPaymentAmounts(keKhaiIds));
        }

        if (result.data.length > 0) {
          promises.push(fetchBhxhNotifications(result.data));
        }

        // Wait for all parallel requests to complete
        if (promises.length > 0) {
          await Promise.allSettled(promises);
        }
      } else {
        // Nếu không có user, không hiển thị gì
        setKeKhaiList([]);
        setTotalRecords(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Error loading ke khai data:', err);
      setError('Không thể tải danh sách kê khai. Vui lòng thử lại.');
      showToast('Không thể tải danh sách kê khai', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, user?.id, showToast]);

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Clear selections when changing page
      setSelectedKeKhaiIds(new Set());
      loadKeKhaiData(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    // Clear selections when changing page size
    setSelectedKeKhaiIds(new Set());
    loadKeKhaiData(1, newSize); // Reset to first page when changing page size
  };

  // Debounced filter effect to prevent excessive API calls
  const debouncedFilters = useMemo(() => ({
    searchTerm,
    searchBhxh,
    filterStatus,
    filterType,
    dateFrom,
    dateTo,
    sortField,
    sortDirection
  }), [searchTerm, searchBhxh, filterStatus, filterType, dateFrom, dateTo, sortField, sortDirection]);

  // Load data with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('🔄 Filter effect triggered (debounced):', debouncedFilters);

      // Always reset to page 1 when filters or sort change
      const hasFilters = debouncedFilters.searchTerm || debouncedFilters.searchBhxh ||
                        debouncedFilters.filterStatus !== 'all' || debouncedFilters.filterType !== 'all' ||
                        debouncedFilters.dateFrom || debouncedFilters.dateTo;
      const hasSortChange = debouncedFilters.sortField !== 'created_at' || debouncedFilters.sortDirection !== 'desc';

      if (hasFilters || hasSortChange) {
        console.log('📋 Loading with filters/sort, resetting to page 1');
        setCurrentPage(1);
        loadKeKhaiData(1, pageSize);
      } else {
        console.log('📋 Loading without filters');
        loadKeKhaiData(1, pageSize);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [debouncedFilters, pageSize]);

  // Save filter state when it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFilterState();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [saveFilterState]);

  // Load data on component mount only
  useEffect(() => {
    // Initial load without debounce
    loadKeKhaiData(1, pageSize);

    // Show notification if filters were restored from localStorage
    const hasRestoredFilters = savedState.searchTerm || savedState.searchBhxh || savedState.filterStatus !== 'all' ||
                              savedState.filterType !== 'all' || savedState.dateFrom ||
                              savedState.dateTo || savedState.sortField !== 'created_at' ||
                              savedState.sortDirection !== 'desc';

    if (hasRestoredFilters) {
      showToast('Đã khôi phục bộ lọc từ lần truy cập trước', 'success');
    }
  }, []); // Only run once on mount

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.visible]);

  // Listen for payment confirmation events to auto-reload data
  useEffect(() => {
    const handlePaymentConfirmed = () => {
      loadKeKhaiData(currentPage, pageSize);
      showToast('Kê khai đã được cập nhật trạng thái sau thanh toán', 'success');
    };

    const handleKeKhaiStatusChanged = () => {
      loadKeKhaiData(currentPage, pageSize);
    };

    const handleRefreshAllPages = () => {
      loadKeKhaiData(currentPage, pageSize);
    };

    // Create a wrapper function for the event listener
    const handleRefreshKeKhaiManagement = () => {
      loadKeKhaiData(currentPage, pageSize);
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_KE_KHAI_MANAGEMENT, handleRefreshKeKhaiManagement);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_KE_KHAI_MANAGEMENT, handleRefreshKeKhaiManagement);
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

  // Handle sorting
  const handleSort = (field: 'created_at' | 'submitted_at' | 'paid_at' | 'updated_at') => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default desc direction
      setSortField(field);
      setSortDirection('desc');

      // Show warning for unsupported fields
      if (field === 'submitted_at' || field === 'paid_at') {
        showToast(
          `Sắp xếp theo ${field === 'submitted_at' ? 'ngày nộp' : 'ngày thanh toán'} tạm thời sử dụng ngày tạo. Tính năng này sẽ được cải thiện trong phiên bản tới.`,
          'warning'
        );
      }
    }
  };

  // Get sort icon
  const getSortIcon = (field: 'created_at' | 'submitted_at' | 'paid_at' | 'updated_at') => {
    if (sortField !== field) {
      return null; // No icon for non-active fields
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Handle view detail
  const handleViewDetail = (keKhai: DanhSachKeKhai) => {
    setSelectedKeKhai(keKhai);
    setShowDetailModal(true);
  };

  // Handle navigate to ke khai form
  const handleNavigateToKeKhai = (keKhai: DanhSachKeKhai | any, openInNewTab: boolean = false) => {
    // For now, use ke-khai-603-form for all types (can be extended later)
    const declarationName = keKhai.loai_ke_khai === '604'
      ? 'Đăng ký đóng BHYT đối với người lao động'
      : 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT';

    if (openInNewTab) {
      // Open in new tab (for future implementation)
      showToast('Tính năng mở trong tab mới sẽ được hỗ trợ trong phiên bản tới', 'warning');
    } else {
      navigateToPage('ke-khai-603-form', {
        declarationCode: keKhai.loai_ke_khai,
        declarationName,
        keKhaiId: keKhai.id
      });
    }
  };

  // Handle BHXH search
  const handleBhxhSearch = async (bhxhNumber: string) => {
    if (!bhxhNumber.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    try {
      setLoadingBhxhNotifications(true);
      const result = await keKhaiService.findUnsentKeKhaiBySoBhxh(bhxhNumber.trim());

      setBhxhSearchResult(result);
      setShowBhxhSearchModal(true);

      if (result) {
        showToast(`Tìm thấy kê khai ${result.ma_ke_khai} chứa mã số BHXH ${bhxhNumber}`, 'success');
      } else {
        showToast(`Không tìm thấy kê khai nào chứa mã số BHXH ${bhxhNumber}`, 'warning');
      }
    } catch (error) {
      console.error('Error searching BHXH:', error);
      showToast('Có lỗi khi tìm kiếm mã số BHXH', 'error');
    } finally {
      setLoadingBhxhNotifications(false);
    }
  };

  // Handle context menu with optimization
  const handleContextMenu = useCallback((e: React.MouseEvent, keKhai: DanhSachKeKhai) => {
    e.preventDefault();
    e.stopPropagation();

    // Close any existing context menu first
    setContextMenu(prev => ({ ...prev, visible: false }));

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        keKhai
      });
    });
  }, []);

  // Handle view proof from context menu with optimization and caching
  const handleViewProof = useCallback(async (keKhai: DanhSachKeKhai) => {
    // Prevent multiple calls
    if (loadingProof) return;

    try {
      setLoadingProof(true);
      setContextMenu(prev => ({ ...prev, visible: false }));

      // Check cache first
      let payment = paymentCache.get(keKhai.id);

      if (!payment) {
        console.log('🔄 Loading payment proof for ke khai:', keKhai.ma_ke_khai);
        payment = await paymentService.getPaymentByKeKhaiId(keKhai.id);

        // Cache the result
        if (payment) {
          setPaymentCache(prev => new Map(prev.set(keKhai.id, payment)));
        }
      } else {
        console.log('✅ Using cached payment data for ke khai:', keKhai.ma_ke_khai);
      }

      if (payment && payment.proof_image_url) {
        setSelectedKeKhai(keKhai);
        setSelectedPayment(payment);

        // Use requestAnimationFrame to ensure smooth modal opening
        requestAnimationFrame(() => {
          setShowProofModal(true);
        });

        showToast('Đã tải ảnh chứng từ thành công', 'success');
      } else {
        showToast('Không có ảnh chứng từ thanh toán cho kê khai này', 'warning');
      }
    } catch (error) {
      console.error('Error loading payment proof:', error);
      showToast('Không thể tải ảnh chứng từ', 'error');
    } finally {
      setLoadingProof(false);
    }
  }, [loadingProof, showToast, paymentCache]);

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
    loadKeKhaiData(currentPage, pageSize); // Reload data
    showToast(
      approvalAction === 'approve' ? 'Đã duyệt kê khai thành công' : 'Đã từ chối kê khai thành công',
      'success'
    );
  };

  // Handle send request (chuyển từ processing sang request_sent)
  const handleSendRequest = async (keKhai: DanhSachKeKhai) => {
    // Prevent multiple clicks
    if (processingKeKhaiId === keKhai.id) return;

    setProcessingKeKhaiId(keKhai.id);

    try {
      // Step 1: Cập nhật trạng thái kê khai thành request_sent
      const result = await keKhaiService.updateKeKhaiStatus(
        keKhai.id,
        'request_sent',
        user?.id?.toString(),
        'Đã gửi yêu cầu phát sinh lên cơ quan BHXH'
      );

      // Step 2: Cập nhật trạng thái tất cả người tham gia trong kê khai
      await keKhaiService.updateAllParticipantsStatusByKeKhaiId(
        keKhai.id,
        'request_sent',
        user?.id?.toString() || '',
        'Đã gửi yêu cầu phát sinh lên cơ quan BHXH'
      );

      // Emit events để đồng bộ dữ liệu
      eventEmitter.emit(EVENTS.KE_KHAI_STATUS_CHANGED, {
        keKhaiId: keKhai.id,
        oldStatus: 'processing',
        newStatus: 'request_sent',
        keKhaiData: result,
        timestamp: new Date().toISOString()
      });

      eventEmitter.emit(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, {
        reason: 'ke_khai_request_sent',
        keKhaiId: keKhai.id,
        keKhaiData: result
      });

      // Reload data và hiển thị thông báo
      await loadKeKhaiData(currentPage, pageSize);
      showToast(`Đã gửi yêu cầu phát sinh cho kê khai ${keKhai.ma_ke_khai} thành công`, 'success');

    } catch (error: any) {
      console.error('Error sending request:', error);

      // Hiển thị lỗi cụ thể
      const errorMessage = error?.message || 'Không thể gửi yêu cầu phát sinh';
      showToast(`Lỗi: ${errorMessage}`, 'error');
    } finally {
      setProcessingKeKhaiId(null);
    }
  };

  // Handle complete ke khai (chuyển từ request_sent sang completed)
  const handleCompleteKeKhai = async (keKhai: DanhSachKeKhai) => {
    // Prevent multiple clicks
    if (completingKeKhaiId === keKhai.id) return;

    setCompletingKeKhaiId(keKhai.id);

    try {
      // Step 1: Cập nhật trạng thái kê khai thành completed
      const result = await keKhaiService.updateKeKhaiStatus(
        keKhai.id,
        'completed',
        user?.id?.toString(),
        'Hoàn thành xử lý kê khai'
      );

      // Step 2: Cập nhật trạng thái tất cả người tham gia trong kê khai
      await keKhaiService.updateAllParticipantsStatusByKeKhaiId(
        keKhai.id,
        'completed',
        user?.id?.toString() || '',
        'Hoàn thành xử lý kê khai'
      );

      // Emit events để đồng bộ dữ liệu
      eventEmitter.emit(EVENTS.KE_KHAI_STATUS_CHANGED, {
        keKhaiId: keKhai.id,
        oldStatus: keKhai.trang_thai,
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
      await loadKeKhaiData(currentPage, pageSize);
      showToast(`Đã hoàn thành kê khai ${keKhai.ma_ke_khai} thành công`, 'success');

    } catch (error: any) {
      console.error('Error completing ke khai:', error);

      // Hiển thị lỗi cụ thể
      const errorMessage = error?.message || 'Không thể hoàn thành kê khai';
      showToast(`Lỗi: ${errorMessage}`, 'error');
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
    loadKeKhaiData(currentPage, pageSize); // Reload data
    showToast('Thanh toán đã được xác nhận', 'success');
  };

  // Bắt đầu chỉnh sửa mã hồ sơ
  const handleStartEditHoSo = (keKhai: DanhSachKeKhai) => {
    setEditingHoSoId(keKhai.id);
    setEditingHoSoValue(keKhai.ma_ho_so || '');
  };

  // Hủy chỉnh sửa mã hồ sơ
  const handleCancelEditHoSo = () => {
    setEditingHoSoId(null);
    setEditingHoSoValue('');
  };

  // Lưu mã hồ sơ
  const handleSaveHoSo = async (keKhaiId: number) => {
    setSavingHoSo(keKhaiId);
    try {
      const maHoSo = editingHoSoValue.trim() || null;

      // Tìm kê khai hiện tại để kiểm tra trạng thái
      const currentKeKhai = keKhaiList.find(kk => kk.id === keKhaiId);

      // Step 1: Cập nhật mã hồ sơ
      await keKhaiService.updateMaHoSo(keKhaiId, maHoSo);

      // Step 2: Nếu có nhập mã hồ sơ và trạng thái hiện tại là 'request_sent',
      // tự động chuyển sang 'request_confirmed'
      let updatedKeKhai = currentKeKhai;
      if (maHoSo && currentKeKhai?.trang_thai === 'request_sent') {
        console.log(`🔄 Auto-confirming request for ke khai ${keKhaiId} after entering ma_ho_so: ${maHoSo}`);

        try {
          updatedKeKhai = await keKhaiService.updateKeKhaiStatus(
            keKhaiId,
            'request_confirmed',
            user?.id?.toString(),
            `Đã xác nhận yêu cầu phát sinh với mã hồ sơ: ${maHoSo}`
          );

          // Cập nhật trạng thái tất cả người tham gia
          await keKhaiService.updateAllParticipantsStatusByKeKhaiId(
            keKhaiId,
            'request_confirmed',
            user?.id?.toString() || '',
            `Đã xác nhận yêu cầu phát sinh với mã hồ sơ: ${maHoSo}`
          );

          // Emit events để đồng bộ dữ liệu
          eventEmitter.emit(EVENTS.KE_KHAI_STATUS_CHANGED, {
            keKhaiId: keKhaiId,
            oldStatus: 'request_sent',
            newStatus: 'request_confirmed',
            keKhaiData: updatedKeKhai,
            timestamp: new Date().toISOString()
          });

          console.log(`✅ Successfully auto-confirmed request for ke khai ${keKhaiId}`);
        } catch (statusError) {
          console.error('Error auto-confirming request status:', statusError);
          // Don't throw error here, just log it since ma_ho_so was already updated
        }
      }

      // Step 3: Cập nhật state local
      setKeKhaiList(prev => prev.map(item =>
        item.id === keKhaiId
          ? {
              ...item,
              ma_ho_so: maHoSo || undefined,
              trang_thai: updatedKeKhai?.trang_thai || item.trang_thai,
              updated_at: updatedKeKhai?.updated_at || item.updated_at
            }
          : item
      ));

      setEditingHoSoId(null);
      setEditingHoSoValue('');

      // Show success message
      const statusMessage = maHoSo && currentKeKhai?.trang_thai === 'request_sent'
        ? ` và đã xác nhận yêu cầu phát sinh`
        : '';

      showToast(
        maHoSo
          ? `Đã cập nhật mã hồ sơ thành công${statusMessage}`
          : 'Đã xóa mã hồ sơ thành công',
        'success'
      );
    } catch (error: any) {
      console.error('Error updating ma ho so:', error);
      showToast(`Không thể cập nhật mã hồ sơ: ${error.message}`, 'error');
    } finally {
      setSavingHoSo(null);
    }
  };

  // Xử lý phím Enter khi chỉnh sửa mã hồ sơ
  const handleHoSoKeyPress = (e: React.KeyboardEvent, keKhaiId: number) => {
    if (e.key === 'Enter') {
      handleSaveHoSo(keKhaiId);
    } else if (e.key === 'Escape') {
      handleCancelEditHoSo();
    }
  };

  // Refresh thông báo BHXH cho một kê khai cụ thể
  const handleRefreshBhxhNotification = async (keKhai: DanhSachKeKhai) => {
    if (!keKhai.ma_ho_so) {
      showToast('Kê khai chưa có mã hồ sơ', 'warning');
      return;
    }

    try {
      setLoadingBhxhNotifications(true);
      const notification = await bhxhNotificationService.getNotificationByHoSo(keKhai.ma_ho_so);

      setBhxhNotifications(prev => ({
        ...prev,
        [keKhai.ma_ho_so!]: notification
      }));

      showToast('Đã cập nhật thông báo BHXH', 'success');
    } catch (error) {
      console.error('Error refreshing BHXH notification:', error);
      showToast('Không thể cập nhật thông báo BHXH', 'error');
    } finally {
      setLoadingBhxhNotifications(false);
    }
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
      // Get participants for this ke khai
      const participants = await keKhaiService.getNguoiThamGiaByKeKhai(keKhai.id);

      if (!participants || participants.length === 0) {
        showToast('Kê khai này chưa có người tham gia nào để xuất Excel', 'warning');
        return;
      }

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
      await keKhaiService.deleteKeKhai(deleteModal.keKhai.id);

      // Remove from local list
      setKeKhaiList(prev => prev.filter(kk => kk.id !== deleteModal.keKhai!.id));

      // Remove from selected list if it was selected
      setSelectedKeKhaiIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(deleteModal.keKhai!.id);
        return newSet;
      });

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

  // Handle checkbox selection
  const handleSelectKeKhai = (keKhaiId: number, checked: boolean) => {
    setSelectedKeKhaiIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(keKhaiId);
      } else {
        newSet.delete(keKhaiId);
      }
      return newSet;
    });
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = keKhaiList.map(kk => kk.id);
      setSelectedKeKhaiIds(new Set(allIds));
    } else {
      setSelectedKeKhaiIds(new Set());
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedKeKhaiIds.size === 0) {
      showToast('Vui lòng chọn ít nhất một kê khai để xóa', 'warning');
      return;
    }

    setBulkDeleteModal({
      isOpen: true,
      isDeleting: false
    });
  };

  // Close bulk delete modal
  const closeBulkDeleteModal = () => {
    setBulkDeleteModal({
      isOpen: false,
      isDeleting: false
    });
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    if (selectedKeKhaiIds.size === 0) return;

    setBulkDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const selectedIds = Array.from(selectedKeKhaiIds);

      let successCount = 0;
      let errorCount = 0;

      // Delete each selected ke khai
      for (const keKhaiId of selectedIds) {
        try {
          await keKhaiService.deleteKeKhai(keKhaiId);
          successCount++;
        } catch (error) {
          console.error(`Error deleting ke khai ${keKhaiId}:`, error);
          errorCount++;
        }
      }

      // Remove successfully deleted items from local list
      if (successCount > 0) {
        setKeKhaiList(prev => prev.filter(kk => !selectedIds.includes(kk.id) || errorCount > 0));
        setSelectedKeKhaiIds(new Set());
      }

      // Show result message
      if (successCount > 0) {
        showToast(
          `Đã xóa thành công ${successCount} kê khai${errorCount > 0 ? `, ${errorCount} kê khai lỗi` : ''}`,
          'success'
        );
      } else {
        showToast('Không thể xóa kê khai nào', 'error');
      }

      // Close modal
      closeBulkDeleteModal();

      // Reload data to ensure consistency
      await loadKeKhaiData(currentPage, pageSize);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      showToast('Có lỗi xảy ra khi xóa hàng loạt', 'error');
    } finally {
      setBulkDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Handle set ke khai to processing status
  const handleSetProcessing = async (keKhai: DanhSachKeKhai) => {
    if (processingKeKhaiId === keKhai.id) return;

    setProcessingKeKhaiId(keKhai.id);

    try {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý kê khai
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Duyệt và quản lý các kê khai từ nhân viên thu
          </p>
          <div className="mt-2 flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
              ⚡ Đã tối ưu: 10 bản ghi/trang để tăng tốc độ load
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>
                {loading ? (
                  'Đang tải...'
                ) : totalRecords > 0 ? (
                  `${keKhaiList.length} / ${totalRecords.toLocaleString()} kê khai (trang ${currentPage}/${totalPages})`
                ) : (
                  '0 kê khai'
                )}
              </span>
            </div>

            {/* Sort indicator */}
            <div className="flex items-center space-x-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <span>Sắp xếp:</span>
              <span className="font-medium">
                {sortField === 'created_at' && 'Ngày tạo'}
                {sortField === 'updated_at' && 'Ngày cập nhật'}
                {sortField === 'submitted_at' && 'Ngày nộp'}
                {sortField === 'paid_at' && 'Ngày thanh toán'}
              </span>
              <span>{sortDirection === 'desc' ? '↓' : '↑'}</span>
            </div>

            {/* Usage hints */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>💡 Bấm chuột phải vào kê khai để xem menu tùy chọn</span>
              <span>🔍 Nhập mã số BHXH và bấm Enter hoặc nút tìm kiếm để tìm kê khai</span>
            </div>
          </div>

          {/* Bulk Delete Button */}
          {selectedKeKhaiIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleteModal.isDeleting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                bulkDeleteModal.isDeleting
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              }`}
              title={`Xóa ${selectedKeKhaiIds.size} kê khai đã chọn`}
            >
              {bulkDeleteModal.isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa đã chọn ({selectedKeKhaiIds.size})
                </>
              )}
            </button>
          )}

          {/* BHXH Check Button */}
          <button
            onClick={() => setShowBhxhCheckModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            title="Kiểm tra các kê khai chưa gửi yêu cầu phát sinh theo mã số BHXH"
          >
            <SearchCheck className="w-4 h-4 mr-2" />
            Kiểm tra BHXH chưa gửi
          </button>

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bộ lọc và sắp xếp</h3>
            {/* Active filters indicator */}
            {(searchTerm || searchBhxh || filterStatus !== 'all' || filterType !== 'all' || dateFrom || dateTo || sortField !== 'created_at' || sortDirection !== 'desc') && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Đang lọc
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            disabled={!searchTerm && !searchBhxh && filterStatus === 'all' && filterType === 'all' && !dateFrom && !dateTo && sortField === 'created_at' && sortDirection === 'desc'}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Xóa tất cả bộ lọc và về mặc định"
          >
            <X className="w-4 h-4 mr-1" />
            Xóa bộ lọc
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
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

          {/* Search BHXH */}
          <div className="relative flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm theo mã số BHXH..."
                value={searchBhxh}
                onChange={(e) => setSearchBhxh(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBhxhSearch(searchBhxh);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                title="Nhập mã số BHXH để tìm kê khai chứa người tham gia có mã số này"
              />
            </div>
            <button
              onClick={() => handleBhxhSearch(searchBhxh)}
              disabled={!searchBhxh.trim() || loadingBhxhNotifications}
              className="px-3 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Tìm kiếm kê khai theo mã số BHXH"
            >
              {loadingBhxhNotifications ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="submitted">Chờ duyệt</option>
            <option value="pending_payment">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="processing">Đang xử lý</option>
            <option value="request_sent">Đã gửi yêu cầu phát sinh</option>
            <option value="request_confirmed">Đã xác nhận yêu cầu phát sinh</option>
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

          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => {
              const field = e.target.value as 'created_at' | 'submitted_at' | 'paid_at' | 'updated_at';
              setSortField(field);

              // Show warning for unsupported fields
              if (field === 'submitted_at' || field === 'paid_at') {
                showToast(
                  `Sắp xếp theo ${field === 'submitted_at' ? 'ngày nộp' : 'ngày thanh toán'} tạm thời sử dụng ngày tạo. Tính năng này sẽ được cải thiện trong phiên bản tới.`,
                  'warning'
                );
              }
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            title="Chọn trường để sắp xếp"
          >
            <option value="created_at">Ngày tạo</option>
            <option value="updated_at">Ngày cập nhật</option>
            <option value="submitted_at">Ngày nộp (tạm thời dùng ngày tạo)</option>
            <option value="paid_at">Ngày thanh toán (tạm thời dùng ngày tạo)</option>
          </select>

          {/* Sort Direction */}
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </select>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {keKhaiList.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không có kê khai nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {totalRecords === 0
                  ? 'Chưa có kê khai nào cần duyệt hoặc không tìm thấy kết quả phù hợp.'
                  : `Không có kê khai nào trong trang ${currentPage}. Tổng cộng có ${totalRecords.toLocaleString()} kê khai.`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-hidden">
              <table className="w-full min-w-[1600px] border border-gray-300 dark:border-gray-600">
                <thead className="bg-blue-100 dark:bg-blue-900/30">
                  <tr>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={keKhaiList.length > 0 && selectedKeKhaiIds.size === keKhaiList.length}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = selectedKeKhaiIds.size > 0 && selectedKeKhaiIds.size < keKhaiList.length;
                            }
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          title="Chọn tất cả kê khai"
                        />
                      </div>
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Mã kê khai
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Mã hồ sơ
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Tên kê khai
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Loại
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Ngày tạo
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Người tạo
                    </th>
                    <th className="px-2 py-4 text-right text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Số tiền
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Thông báo BHXH
                    </th>
                    <th className="px-2 py-4 text-right text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {keKhaiList.map((keKhai, index) => (
                    <tr
                      key={keKhai.id}
                      className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-context-menu ${
                        selectedKeKhaiIds.has(keKhai.id)
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500'
                          : index % 2 === 0
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                      onContextMenu={(e) => handleContextMenu(e, keKhai)}
                      title="Bấm chuột phải để xem menu tùy chọn"
                    >
                      <td className="px-2 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedKeKhaiIds.has(keKhai.id)}
                          onChange={(e) => handleSelectKeKhai(keKhai.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          title="Chọn kê khai"
                        />
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate" title={keKhai.ma_ke_khai}>
                          {keKhai.ma_ke_khai}
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {editingHoSoId === keKhai.id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              value={editingHoSoValue}
                              onChange={(e) => setEditingHoSoValue(e.target.value)}
                              onKeyDown={(e) => handleHoSoKeyPress(e, keKhai.id)}
                              className="w-20 px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Mã hồ sơ"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveHoSo(keKhai.id)}
                              disabled={savingHoSo === keKhai.id}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                              title="Lưu"
                            >
                              {savingHoSo === keKhai.id ? (
                                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEditHoSo}
                              disabled={savingHoSo === keKhai.id}
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                              title="Hủy"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 group">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={keKhai.ma_ho_so || 'Chưa có mã hồ sơ'}>
                              {keKhai.ma_ho_so || (
                                <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                  Chưa có
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleStartEditHoSo(keKhai)}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity"
                              title="Chỉnh sửa mã hồ sơ"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <div className="text-sm text-gray-900 dark:text-white truncate" title={keKhai.ten_ke_khai}>
                          {keKhai.ten_ke_khai}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={keKhai.doi_tuong_tham_gia || 'Chưa xác định'}>
                          {keKhai.doi_tuong_tham_gia || 'Chưa xác định'}
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {keKhai.loai_ke_khai}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {getStatusBadge(keKhai.trang_thai)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="truncate">
                            {new Date(keKhai.created_at || '').toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate" title={keKhai.created_by ? (
                            loadingUserNames ? 'Đang tải...' : (userNames[keKhai.created_by] || keKhai.created_by)
                          ) : 'N/A'}>
                            {keKhai.created_by ? (
                              loadingUserNames ? (
                                <span className="text-gray-400">...</span>
                              ) : (
                                userNames[keKhai.created_by] || keKhai.created_by
                              )
                            ) : (
                              'N/A'
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-right text-xs text-gray-900 dark:text-white">
                        <div className="flex items-center justify-end">
                          <DollarSign className="w-3 h-3 text-green-500 mr-1" />
                          {loadingPaymentAmounts ? (
                            <span className="text-gray-400">...</span>
                          ) : (
                            <span className="font-medium truncate" title={
                              paymentAmounts[keKhai.id]
                                ? paymentService.formatCurrency(paymentAmounts[keKhai.id])
                                : '0 ₫'
                            }>
                              {paymentAmounts[keKhai.id]
                                ? paymentService.formatCurrency(paymentAmounts[keKhai.id])
                                : '0 ₫'
                              }
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-left text-xs">
                        <div className="flex items-center space-x-1 group">
                          <div className="flex-1 min-w-0">
                            {keKhai.ma_ho_so ? (
                              loadingBhxhNotifications ? (
                                <div className="flex items-center">
                                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-1" />
                                  <span className="text-gray-400 text-xs">...</span>
                                </div>
                              ) : bhxhNotifications[keKhai.ma_ho_so] ? (
                                <div className="w-full">
                                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium w-full ${
                                    bhxhNotificationService.getNotificationStatus(bhxhNotifications[keKhai.ma_ho_so]) === 'success'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : bhxhNotificationService.getNotificationStatus(bhxhNotifications[keKhai.ma_ho_so]) === 'warning'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : bhxhNotificationService.getNotificationStatus(bhxhNotifications[keKhai.ma_ho_so]) === 'error'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  }`}>
                                    <Bell className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <div className="truncate" title={bhxhNotificationService.formatNotificationMessage(bhxhNotifications[keKhai.ma_ho_so])}>
                                      {bhxhNotificationService.formatNotificationMessage(bhxhNotifications[keKhai.ma_ho_so])}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                  Chưa có thông báo
                                </span>
                              )
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                Chưa có mã hồ sơ
                              </span>
                            )}
                          </div>
                          {keKhai.ma_ho_so && (
                            <button
                              onClick={() => handleRefreshBhxhNotification(keKhai)}
                              disabled={loadingBhxhNotifications}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity disabled:opacity-50 flex-shrink-0"
                              title="Cập nhật thông báo BHXH"
                            >
                              <Bell className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex items-center justify-end space-x-1">
                          {/* View Detail Button */}
                          <button
                            onClick={() => handleViewDetail(keKhai)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3 h-3" />
                          </button>

                          {/* Status-specific Action Buttons */}
                          {keKhai.trang_thai === 'submitted' && (
                            <>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'approve')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                                title="Duyệt"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                                title="Từ chối"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {keKhai.trang_thai === 'processing' && (
                            <>
                              <button
                                onClick={() => handleSendRequest(keKhai)}
                                disabled={processingKeKhaiId === keKhai.id}
                                className={`p-1 ${
                                  processingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300'
                                }`}
                                title={processingKeKhaiId === keKhai.id ? 'Đang gửi...' : 'Gửi yêu cầu phát sinh'}
                              >
                                {processingKeKhaiId === keKhai.id ? (
                                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Play className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                disabled={processingKeKhaiId === keKhai.id}
                                className={`p-1 ${
                                  processingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                }`}
                                title="Từ chối"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {keKhai.trang_thai === 'request_sent' && (
                            <>
                              <button
                                onClick={() => handleCompleteKeKhai(keKhai)}
                                disabled={completingKeKhaiId === keKhai.id}
                                className={`p-1 ${
                                  completingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                }`}
                                title={completingKeKhaiId === keKhai.id ? 'Đang hoàn thành...' : 'Hoàn thành kê khai'}
                              >
                                {completingKeKhaiId === keKhai.id ? (
                                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                disabled={completingKeKhaiId === keKhai.id}
                                className={`p-1 ${
                                  completingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                }`}
                                title="Từ chối"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {keKhai.trang_thai === 'request_confirmed' && (
                            <>
                              <button
                                onClick={() => handleCompleteKeKhai(keKhai)}
                                disabled={completingKeKhaiId === keKhai.id}
                                className={`p-1 ${
                                  completingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                }`}
                                title={completingKeKhaiId === keKhai.id ? 'Đang hoàn thành...' : 'Hoàn thành kê khai'}
                              >
                                {completingKeKhaiId === keKhai.id ? (
                                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                disabled={completingKeKhaiId === keKhai.id}
                                className={`p-1 ${
                                  completingKeKhaiId === keKhai.id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                }`}
                                title="Từ chối"
                              >
                                <XCircle className="w-3 h-3" />
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
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                                title={
                                  keKhai.trang_thai === 'draft' ? 'Duyệt kê khai nháp' :
                                  keKhai.trang_thai === 'approved' ? 'Duyệt lại' :
                                  keKhai.trang_thai === 'completed' ? 'Duyệt lại kê khai đã hoàn thành' :
                                  keKhai.trang_thai === 'paid' ? 'Duyệt lại kê khai đã thanh toán' :
                                  'Duyệt'
                                }
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                                title={
                                  keKhai.trang_thai === 'draft' ? 'Từ chối kê khai nháp' :
                                  keKhai.trang_thai === 'approved' ? 'Hủy duyệt' :
                                  keKhai.trang_thai === 'completed' ? 'Từ chối kê khai đã hoàn thành' :
                                  keKhai.trang_thai === 'paid' ? 'Từ chối kê khai đã thanh toán' :
                                  'Từ chối'
                                }
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {/* Special handling for rejected status */}
                          {keKhai.trang_thai === 'rejected' && (
                            <button
                              onClick={() => handleApprovalAction(keKhai, 'approve')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                              title="Duyệt lại kê khai đã bị từ chối"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          )}

                          {keKhai.trang_thai === 'pending_payment' && (
                            <>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'approve')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                                title="Duyệt kê khai chờ thanh toán"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(keKhai, 'reject')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                                title="Từ chối kê khai chờ thanh toán"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleViewPayment(keKhai)}
                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 p-1"
                                title="Xem thông tin thanh toán"
                              >
                                <CreditCard className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {/* More Actions - Dropdown for secondary actions */}
                          <div className="relative group">
                            <button
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                              title="Thêm thao tác"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="py-1">
                                {/* Export D03 TK1 VNPT button */}
                                <button
                                  onClick={() => handleExportD03TK1VNPT(keKhai)}
                                  disabled={exportingKeKhaiId === keKhai.id}
                                  className={`w-full text-left px-4 py-2 text-xs flex items-center ${
                                    exportingKeKhaiId === keKhai.id
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                  }`}
                                >
                                  {exportingKeKhaiId === keKhai.id ? (
                                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                                  ) : (
                                    <FileSpreadsheet className="w-3 h-3 mr-2" />
                                  )}
                                  {exportingKeKhaiId === keKhai.id ? 'Đang xuất...' : 'Xuất D03 TK1'}
                                </button>

                                {/* Set Processing button */}
                                {keKhai.trang_thai !== 'processing' && (
                                  <button
                                    onClick={() => handleSetProcessing(keKhai)}
                                    disabled={processingKeKhaiId === keKhai.id}
                                    className={`w-full text-left px-4 py-2 text-xs flex items-center ${
                                      processingKeKhaiId === keKhai.id
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    }`}
                                  >
                                    {processingKeKhaiId === keKhai.id ? (
                                      <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                                    ) : (
                                      <Play className="w-3 h-3 mr-2" />
                                    )}
                                    {processingKeKhaiId === keKhai.id ? 'Đang xử lý...' : 'Chuyển xử lý'}
                                  </button>
                                )}

                                {/* Delete button */}
                                <button
                                  onClick={() => handleDeleteKeKhai(keKhai)}
                                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                >
                                  <Trash2 className="w-3 h-3 mr-2" />
                                  Xóa kê khai
                                </button>
                              </div>
                            </div>
                          </div>
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

      {/* Pagination */}
      {!loading && totalRecords > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
          className="mt-6"
          pageSizeOptions={[5, 10, 15, 20]} // Optimized options for better performance
        />
      )}

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.keKhai && (
        <div
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50 min-w-[200px] animate-in fade-in-0 zoom-in-95 duration-100"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 220),
            top: Math.min(contextMenu.y, window.innerHeight - 120),
            willChange: 'transform, opacity',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleViewProof(contextMenu.keKhai!)}
            disabled={loadingProof}
            title="Xem ảnh chứng từ thanh toán"
            className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
              loadingProof
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {loadingProof ? (
              <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Image className="w-4 h-4 mr-2" />
            )}
            {loadingProof ? 'Đang tải...' : 'Xem ảnh hóa đơn'}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

          <button
            onClick={() => {
              handleViewDetail(contextMenu.keKhai!);
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            disabled={loadingProof}
            title="Xem thông tin chi tiết kê khai trong modal"
            className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
              loadingProof
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết
          </button>

          <button
            onClick={() => {
              handleNavigateToKeKhai(contextMenu.keKhai!);
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            disabled={loadingProof}
            title="Chuyển đến trang form kê khai để chỉnh sửa"
            className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
              loadingProof
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Chuyển đến trang kê khai
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

      {showProofModal && selectedPayment && (
        <div className="fixed inset-0 z-50">
          <PaymentProofModal
            payment={selectedPayment}
            onClose={() => {
              setShowProofModal(false);
              setSelectedKeKhai(null);
              setSelectedPayment(null);
            }}
          />
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Xác nhận xóa nhiều kê khai
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Bạn có chắc chắn muốn xóa{' '}
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {selectedKeKhaiIds.size} kê khai
                  </span>{' '}
                  đã chọn không?
                </p>
                <div className="mt-3 max-h-32 overflow-y-auto">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Danh sách kê khai sẽ bị xóa:</p>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    {keKhaiList
                      .filter(kk => selectedKeKhaiIds.has(kk.id))
                      .map(kk => (
                        <li key={kk.id} className="flex justify-between">
                          <span className="truncate">{kk.ma_ke_khai}</span>
                          <span className="ml-2 text-gray-400">{kk.trang_thai}</span>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeBulkDeleteModal}
                  disabled={bulkDeleteModal.isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmBulkDelete}
                  disabled={bulkDeleteModal.isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkDeleteModal.isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                      Đang xóa...
                    </>
                  ) : (
                    `Xóa ${selectedKeKhaiIds.size} kê khai`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* BHXH Check Unsent Modal */}
      <BhxhCheckUnsentModal
        isOpen={showBhxhCheckModal}
        onClose={() => setShowBhxhCheckModal(false)}
      />

      {/* BHXH Search Result Modal */}
      <BhxhSearchResultModal
        isOpen={showBhxhSearchModal}
        onClose={() => setShowBhxhSearchModal(false)}
        searchTerm={searchBhxh}
        result={bhxhSearchResult}
        onNavigateToKeKhai={handleNavigateToKeKhai}
      />
    </div>
  );
};

export default KeKhaiManagement;
