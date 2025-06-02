import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { DanhSachKeKhai, ThanhToan } from '../../../shared/services/api/supabaseClient';
import keKhaiService from '../services/keKhaiService';
import paymentService from '../services/paymentService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import PaymentQRModal from '../components/PaymentQRModal';

const MyPayments: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // State
  const [loading, setLoading] = useState(false);
  const [keKhaiList, setKeKhaiList] = useState<DanhSachKeKhai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);

  // Load data
  const loadMyPayments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Lấy các kê khai cần thanh toán của user hiện tại
      const searchParams = {
        created_by: user.id,
        trang_thai: filterStatus === 'all' ? undefined : filterStatus
      };
      const data = await keKhaiService.getKeKhaiForApproval(searchParams);
      
      // Lọc chỉ những kê khai có liên quan đến thanh toán
      const paymentRelatedKeKhai = data.filter(kk => 
        kk.trang_thai === 'pending_payment' || 
        kk.trang_thai === 'paid' ||
        kk.payment_status
      );
      
      setKeKhaiList(paymentRelatedKeKhai);
    } catch (error) {
      console.error('Error loading my payments:', error);
      showToast('Không thể tải danh sách thanh toán', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyPayments();
  }, [user?.id, filterStatus]);

  // Filter data based on search term
  const filteredKeKhai = keKhaiList.filter(keKhai =>
    keKhai.ma_ke_khai.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keKhai.ten_ke_khai.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <Clock className="w-3 h-3 mr-1" />
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
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  // Handle view payment
  const handleViewPayment = async (keKhai: DanhSachKeKhai) => {
    try {
      const payment = await paymentService.getPaymentByKeKhaiId(keKhai.id);
      if (payment) {
        setSelectedPayment(payment);
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
    setSelectedPayment(null);
    loadMyPayments(); // Reload data
    showToast('Thanh toán đã được xác nhận', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Thanh toán của tôi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem và thanh toán các kê khai đã được duyệt
          </p>
        </div>
        <button
          onClick={loadMyPayments}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc tên kê khai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending_payment">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {filteredKeKhai.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Không có thanh toán nào
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Bạn chưa có kê khai nào cần thanh toán'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kê khai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày yêu cầu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredKeKhai.map((keKhai) => (
                    <tr key={keKhai.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {keKhai.ma_ke_khai}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {keKhai.ten_ke_khai}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {keKhai.total_amount ? paymentService.formatCurrency(keKhai.total_amount) : 'Chưa tính'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(keKhai.trang_thai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {keKhai.payment_required_at 
                            ? new Date(keKhai.payment_required_at).toLocaleDateString('vi-VN')
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {keKhai.trang_thai === 'pending_payment' && (
                            <button
                              onClick={() => handleViewPayment(keKhai)}
                              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                              title="Thanh toán QR Code"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          )}
                          
                          {keKhai.trang_thai === 'paid' && (
                            <button
                              onClick={() => handleViewPayment(keKhai)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Xem thông tin thanh toán"
                            >
                              <Eye className="w-4 h-4" />
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

      {/* Payment QR Modal */}
      {showPaymentModal && selectedPayment && (
        <PaymentQRModal
          payment={selectedPayment}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPayment(null);
          }}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </div>
  );
};

export default MyPayments;
