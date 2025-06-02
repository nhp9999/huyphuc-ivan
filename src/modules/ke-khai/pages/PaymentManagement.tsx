import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  RefreshCw,
  Filter,
  Image
} from 'lucide-react';
import { DanhSachKeKhai, ThanhToan, supabase } from '../../../shared/services/api/supabaseClient';
import keKhaiService from '../services/keKhaiService';
import paymentService from '../services/paymentService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import PaymentQRModal from '../components/PaymentQRModal';
import PaymentConfirmationModal from '../components/PaymentConfirmationModal';
import PaymentProofModal from '../components/PaymentProofModal';

interface PaymentWithKeKhai extends ThanhToan {
  keKhai?: DanhSachKeKhai;
}

const PaymentManagement: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // State
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentWithKeKhai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithKeKhai | null>(null);

  // Load payments data
  const loadPayments = async () => {
    setLoading(true);
    try {
      // Get all payments directly from thanh_toan table
      const { data: paymentsData, error } = await supabase
        .from('thanh_toan')
        .select(`
          *,
          danh_sach_ke_khai:ke_khai_id (
            id,
            ma_ke_khai,
            ten_ke_khai,
            loai_ke_khai,
            trang_thai,
            total_amount,
            payment_required_at,
            payment_completed_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading payments:', error);
        showToast('Không thể tải danh sách thanh toán', 'error');
        return;
      }

      // Transform data
      const transformedPayments: PaymentWithKeKhai[] = paymentsData
        .filter(item => item.id) // Only items with payment
        .map(item => ({
          id: item.id,
          ke_khai_id: item.ke_khai_id,
          ma_thanh_toan: item.ma_thanh_toan,
          so_tien: item.so_tien,
          phuong_thuc_thanh_toan: item.phuong_thuc_thanh_toan,
          trang_thai: item.trang_thai,
          qr_code_url: item.qr_code_url,
          transaction_id: item.transaction_id,
          payment_gateway: item.payment_gateway,
          expired_at: item.expired_at,
          paid_at: item.paid_at,
          created_at: item.created_at,
          payment_description: item.payment_description || '',
          proof_image_url: item.proof_image_url, // Thêm trường ảnh chứng minh
          confirmation_note: item.confirmation_note, // Thêm ghi chú xác nhận
          keKhai: item.danh_sach_ke_khai as DanhSachKeKhai
        }));

      setPayments(transformedPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      showToast('Không thể tải danh sách thanh toán', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.ma_thanh_toan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.keKhai?.ma_ke_khai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.keKhai?.ten_ke_khai?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.trang_thai === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <Clock className="w-3 h-3 mr-1" />
            Chờ thanh toán
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã thanh toán
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status === 'failed' ? 'Thất bại' : 'Đã hủy'}
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
  const handleViewPayment = (payment: PaymentWithKeKhai) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  // Handle confirm payment
  const handleConfirmPayment = (payment: PaymentWithKeKhai) => {
    setSelectedPayment(payment);
    setShowConfirmModal(true);
  };

  // Handle view proof image
  const handleViewProof = (payment: PaymentWithKeKhai) => {
    setSelectedPayment(payment);
    setShowProofModal(true);
  };

  // Handle payment confirmed
  const handlePaymentConfirmed = () => {
    setShowConfirmModal(false);
    setSelectedPayment(null);
    loadPayments(); // Reload data
    showToast('Đã xác nhận thanh toán thành công', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Quản lý thanh toán
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem và xác nhận các thanh toán từ nhân viên thu
          </p>
        </div>
        <button
          onClick={loadPayments}
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
              placeholder="Tìm kiếm theo mã thanh toán, mã kê khai..."
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
              <option value="pending">Chờ thanh toán</option>
              <option value="completed">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Tổng: <strong>{filteredPayments.length}</strong> thanh toán
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
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Không có thanh toán nào
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có thanh toán nào trong hệ thống'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thanh toán
                    </th>
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
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ảnh CM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.ma_thanh_toan}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {payment.payment_gateway?.toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.keKhai?.ma_ke_khai}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {payment.keKhai?.ten_ke_khai}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {paymentService.formatCurrency(payment.so_tien)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.trang_thai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString('vi-VN')
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {payment.proof_image_url ? (
                          <div className="flex flex-col items-center space-y-1">
                            <button
                              onClick={() => handleViewProof(payment)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title={`Xem ảnh chứng minh (${payment.proof_image_url.startsWith('data:image/') ? 'Base64' : 'URL'})`}
                            >
                              <Image className="w-5 h-5 mx-auto" />
                            </button>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.proof_image_url.startsWith('data:image/') ? 'Base64' : 'URL'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-gray-400 dark:text-gray-500" title="Chưa có ảnh chứng minh">
                              <Image className="w-5 h-5 mx-auto opacity-30" />
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              Chưa có
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewPayment(payment)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {payment.trang_thai === 'pending' && (
                            <button
                              onClick={() => handleConfirmPayment(payment)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Xác nhận thanh toán"
                            >
                              <CheckCircle className="w-4 h-4" />
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
          onPaymentConfirmed={() => {
            setShowPaymentModal(false);
            setSelectedPayment(null);
            loadPayments();
          }}
        />
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmModal && selectedPayment && selectedPayment.keKhai && (
        <PaymentConfirmationModal
          payment={selectedPayment}
          keKhai={selectedPayment.keKhai}
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedPayment(null);
          }}
          onConfirmed={handlePaymentConfirmed}
        />
      )}

      {/* Payment Proof Modal */}
      {showProofModal && selectedPayment && (
        <PaymentProofModal
          payment={selectedPayment}
          onClose={() => {
            setShowProofModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default PaymentManagement;
