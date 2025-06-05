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
  FileX
} from 'lucide-react';
import { DanhSachKeKhai, ThanhToan } from '../../../shared/services/api/supabaseClient';
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
  const [keKhaiList, setKeKhaiList] = useState<DanhSachKeKhai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);

  // Load data
  const loadKeKhaiData = async () => {
    setLoading(true);
    try {
      const params: KeKhaiSearchParams = {
        ma_ke_khai: searchTerm || undefined,
        // Nếu user chọn trạng thái cụ thể, dùng nó. Nếu không, không filter ở DB level
        trang_thai: filterStatus !== 'all' ? filterStatus : undefined
      };

      // SECURITY FIX: Tạm thời force filter theo created_by để đảm bảo bảo mật
      const FORCE_USER_FILTER = true; // Set false khi đã fix logic admin

      // Lấy tất cả kê khai trước, sau đó filter
      let allData: DanhSachKeKhai[];
      if (FORCE_USER_FILTER && user?.id) {
        console.log('🔒 SECURITY: Force filtering by user ID for security');
        allData = await keKhaiService.getKeKhaiList({
          ...params,
          created_by: user.id
        });
      } else {
        allData = await keKhaiService.getKeKhaiList(params);
      }

      // Filter chỉ lấy các kê khai chưa xử lý (bao gồm cả draft)
      const unprocessedStatuses = ['draft', 'submitted', 'processing', 'pending_payment'];
      const excludedStatuses = ['completed', 'approved', 'rejected'];

      console.log('🔍 HoSoChuaXuLy: All data before filter:', allData.map(item => ({
        id: item.id,
        ma_ke_khai: item.ma_ke_khai,
        trang_thai: item.trang_thai
      })));

      // Filter để chỉ lấy các trạng thái chưa xử lý và loại bỏ các trạng thái không mong muốn
      const unprocessedData = allData.filter(item => {
        const isUnprocessed = unprocessedStatuses.includes(item.trang_thai);
        const isNotExcluded = !excludedStatuses.includes(item.trang_thai);
        return isUnprocessed && isNotExcluded;
      });

      console.log('📋 HoSoChuaXuLy: Filtered unprocessed data:', unprocessedData.map(item => ({
        id: item.id,
        ma_ke_khai: item.ma_ke_khai,
        trang_thai: item.trang_thai
      })));

      console.log('❌ HoSoChuaXuLy: Excluded statuses:', excludedStatuses);
      console.log('✅ HoSoChuaXuLy: Allowed statuses:', unprocessedStatuses);

      setKeKhaiList(unprocessedData);
    } catch (error) {
      console.error('Error loading ke khai data:', error);
      showToast('Không thể tải danh sách kê khai', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    loadKeKhaiData();
  }, [searchTerm, filterStatus]);

  // Listen for payment confirmation events to auto-reload data
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('HoSoChuaXuLy: Payment confirmed event received', data);
      loadKeKhaiData();
      showToast('Kê khai đã được chuyển sang xử lý sau thanh toán', 'success');
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      console.log('HoSoChuaXuLy: Ke khai status changed event received', data);
      loadKeKhaiData();
    };

    const handleRefreshAllPages = (data: any) => {
      console.log('HoSoChuaXuLy: Refresh all pages event received', data);
      loadKeKhaiData();
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_HO_SO_CHUA_XU_LY, loadKeKhaiData);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_HO_SO_CHUA_XU_LY, loadKeKhaiData);
    };
  }, []);

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

  // Handle view details
  const handleViewDetails = (keKhai: DanhSachKeKhai) => {
    setSelectedKeKhai(keKhai);
    setShowDetailModal(true);
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
    loadKeKhaiData();
    showToast('Đã duyệt kê khai thành công', 'success');
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
            <FileX className="w-8 h-8 text-orange-600" />
            Hồ sơ chưa xử lý
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý các kê khai nháp, đang chờ duyệt và xử lý
          </p>
        </div>
        
        <button
          onClick={loadKeKhaiData}
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
              placeholder="Tìm kiếm theo mã kê khai..."
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
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="submitted">Chờ duyệt</option>
              <option value="processing">Đang xử lý</option>
              <option value="pending_payment">Chờ thanh toán</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4 mr-2" />
            Tìm thấy {keKhaiList.length} kê khai
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        ) : keKhaiList.length === 0 ? (
          <div className="text-center py-12">
            <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có hồ sơ chưa xử lý
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hiện tại không có kê khai nháp hoặc đang chờ duyệt, xử lý.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mã kê khai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tên kê khai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
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
                {keKhaiList.map((keKhai) => (
                  <tr key={keKhai.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {keKhai.ma_ke_khai}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {keKhai.ten_ke_khai}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {keKhai.loai_ke_khai}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(keKhai.trang_thai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(keKhai.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(keKhai.total_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(keKhai)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {keKhai.trang_thai === 'draft' && (
                          <button
                            onClick={() => handleViewDetails(keKhai)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Chỉnh sửa nháp"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}

                        {keKhai.trang_thai === 'submitted' && (
                          <button
                            onClick={() => handleApprove(keKhai)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Duyệt kê khai"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {keKhai.trang_thai === 'pending_payment' && (
                          <button
                            onClick={() => handlePayment(keKhai)}
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
            loadKeKhaiData();
          }}
        />
      )}
    </div>
  );
};

export default HoSoChuaXuLy;
