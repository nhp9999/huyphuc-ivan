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
  CreditCard
} from 'lucide-react';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import KeKhaiApprovalModal from '../components/KeKhaiApprovalModal';
import PaymentQRModal from '../components/PaymentQRModal';
import paymentService from '../services/paymentService';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';

const KeKhaiManagement: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // State management
  const [keKhaiList, setKeKhaiList] = useState<DanhSachKeKhai[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Loading states for specific actions
  const [completingKeKhaiId, setCompletingKeKhaiId] = useState<number | null>(null);
  
  // Modal states
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

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
        // SECURITY FIX: Tạm thời force filter theo created_by để đảm bảo bảo mật
        const FORCE_USER_FILTER = true; // Set false khi đã fix logic admin

        if (FORCE_USER_FILTER) {
          console.log('🔒 SECURITY: Force filtering by user ID for security');
          searchParams.created_by = user.id;
          data = await keKhaiService.getKeKhaiForApproval(searchParams);
        } else {
          const isAdmin = await keKhaiService.isUserAdmin(user.id);
          if (isAdmin) {
            // Admin có thể xem tất cả kê khai (không filter theo created_by)
            data = await keKhaiService.getKeKhaiForApprovalForAdmin(searchParams);
          } else {
            // Chỉ hiển thị kê khai của user hiện tại nếu không phải admin
            searchParams.created_by = user.id;
            data = await keKhaiService.getKeKhaiForApproval(searchParams);
          }
        }
      } else {
        // Nếu không có user, không hiển thị gì
        data = [];
      }

      setKeKhaiList(data);
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
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          <span>{keKhaiList.length} kê khai</span>
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
                          {keKhai.created_by || 'N/A'}
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

                          {keKhai.trang_thai === 'pending_payment' && (
                            <button
                              onClick={() => handleViewPayment(keKhai)}
                              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                              title="Xem thông tin thanh toán"
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
    </div>
  );
};

export default KeKhaiManagement;
