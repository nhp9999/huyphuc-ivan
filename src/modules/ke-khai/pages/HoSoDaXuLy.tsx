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
  Image
} from 'lucide-react';
import { DanhSachKeKhai, ThanhToan } from '../../../shared/services/api/supabaseClient';
import keKhaiService, { KeKhaiSearchParams } from '../services/keKhaiService';

import { useToast } from '../../../shared/hooks/useToast';
import KeKhaiDetailModal from '../components/KeKhaiDetailModal';
import PaymentQRModal from '../components/PaymentQRModal';
import PaymentProofModal from '../components/PaymentProofModal';
import paymentService from '../services/paymentService';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import { useAuth } from '../../auth';

const HoSoDaXuLy: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // State
  const [loading, setLoading] = useState(false);
  const [keKhaiList, setKeKhaiList] = useState<DanhSachKeKhai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedKeKhai, setSelectedKeKhai] = useState<DanhSachKeKhai | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);

  // Load data
  const loadKeKhaiData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const params: KeKhaiSearchParams = {
        ma_ke_khai: searchTerm || undefined,
        trang_thai: filterStatus !== 'all' ? filterStatus : undefined
      };

      console.log('HoSoDaXuLy: Loading data with params:', params);

      // Lấy tất cả kê khai và filter các trạng thái đã xử lý
      let allData: DanhSachKeKhai[];

      // SECURITY FIX: Tạm thời force filter theo created_by để đảm bảo bảo mật
      const FORCE_USER_FILTER = true; // Set false khi đã fix logic admin

      if (FORCE_USER_FILTER) {
        console.log('🔒 SECURITY: Force filtering by user ID for security');
        allData = await keKhaiService.getKeKhaiList({
          ...params,
          created_by: user.id
        });
      } else {
        // Kiểm tra quyền admin để quyết định function nào sử dụng
        const isAdmin = await keKhaiService.isUserAdmin(user.id);
        console.log('HoSoDaXuLy: User is admin:', isAdmin);

        if (isAdmin) {
          // Admin có thể xem tất cả kê khai
          allData = await keKhaiService.getKeKhaiListForAdmin(params);
        } else {
          // User thường chỉ xem kê khai của mình
          allData = await keKhaiService.getKeKhaiList({
            ...params,
            created_by: user.id
          });
        }
      }

      console.log('HoSoDaXuLy: Raw data loaded:', allData.length, 'items');

      // Filter chỉ lấy các kê khai đã xử lý
      const processedStatuses = ['approved', 'paid', 'rejected', 'completed'];
      const processedData = allData.filter(item => processedStatuses.includes(item.trang_thai));

      console.log('HoSoDaXuLy: Processed data after filter:', processedData.length, 'items');
      console.log('HoSoDaXuLy: Status breakdown:', processedData.reduce((acc, item) => {
        acc[item.trang_thai] = (acc[item.trang_thai] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));

      setKeKhaiList(processedData);
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
  }, [user?.id, searchTerm, filterStatus]);

  // Listen for payment confirmation events to auto-reload data
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('HoSoDaXuLy: Payment confirmed event received', data);
      loadKeKhaiData();
      showToast('Kê khai đã được cập nhật trạng thái', 'success');
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      console.log('HoSoDaXuLy: Ke khai status changed event received', data);
      loadKeKhaiData();
    };

    const handleRefreshAllPages = (data: any) => {
      console.log('HoSoDaXuLy: Refresh all pages event received', data);
      loadKeKhaiData();
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_HO_SO_DA_XU_LY, loadKeKhaiData);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_HO_SO_DA_XU_LY, loadKeKhaiData);
    };
  }, []);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
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

  // Handle view details
  const handleViewDetails = (keKhai: DanhSachKeKhai) => {
    setSelectedKeKhai(keKhai);
    setShowDetailModal(true);
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
            <FileCheck className="w-8 h-8 text-green-600" />
            Hồ sơ đã xử lý
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các kê khai đã được duyệt, thanh toán hoặc từ chối
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
              <option value="approved">Đã duyệt</option>
              <option value="paid">Đã thanh toán</option>
              <option value="completed">Hoàn thành</option>
              <option value="rejected">Từ chối</option>
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
            <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có hồ sơ đã xử lý
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hiện tại chưa có kê khai nào được xử lý hoàn tất.
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
                        {formatDate(keKhai.approved_at || keKhai.payment_completed_at || keKhai.updated_at)}
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
                        
                        {(keKhai.trang_thai === 'paid' || keKhai.trang_thai === 'completed') && (
                          <>
                            <button
                              onClick={() => handleViewPayment(keKhai)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Xem thanh toán"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleViewProof(keKhai)}
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
            loadKeKhaiData();
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
