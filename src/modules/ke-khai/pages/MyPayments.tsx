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
  RefreshCw,
  Image
} from 'lucide-react';
import { DanhSachKeKhai, ThanhToan, supabase } from '../../../shared/services/api/supabaseClient';
import paymentService from '../services/paymentService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import PaymentQRModal from '../components/PaymentQRModal';
import PaymentProofModal from '../components/PaymentProofModal';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';
import { usePaymentNotificationControl } from '../hooks/usePaymentNotificationControl';

const MyPayments: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Control payment notifications on this page (don't hide, but refresh on mount)
  const { pendingPaymentsCount, refreshNotifications } = usePaymentNotificationControl({
    hideOnThisPage: false, // Show notifications on payment page
    refreshOnMount: true
  });
  
  // State
  const [loading, setLoading] = useState(false);
  const [keKhaiList, setKeKhaiList] = useState<DanhSachKeKhai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);

  // Get latest payment from a ke khai (sorted by created_at)
  const getLatestPayment = (keKhai: any) => {
    if (!keKhai.thanh_toan || keKhai.thanh_toan.length === 0) return null;

    // Sắp xếp theo created_at để lấy payment mới nhất
    return keKhai.thanh_toan.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  };

  // Check if payment is completed (check both payment and ke khai status)
  const isPaymentCompleted = (keKhai: any) => {
    const latestPayment = getLatestPayment(keKhai);
    return latestPayment?.trang_thai === 'completed' ||
           keKhai.payment_status === 'completed' ||
           keKhai.trang_thai === 'paid' ||
           keKhai.trang_thai === 'processing';
  };

  // Check if payment is pending
  const isPaymentPending = (keKhai: any) => {
    const latestPayment = getLatestPayment(keKhai);
    return latestPayment?.trang_thai === 'pending' ||
           keKhai.payment_status === 'pending' ||
           keKhai.trang_thai === 'pending_payment';
  };

  // Load data
  const loadMyPayments = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Lấy tất cả kê khai của user và join với thanh toán
      const { data: keKhaiWithPayments, error } = await supabase
        .from('danh_sach_ke_khai')
        .select(`
          *,
          thanh_toan:thanh_toan!ke_khai_id (
            id,
            ma_thanh_toan,
            so_tien,
            trang_thai,
            qr_code_url,
            created_at,
            paid_at,
            proof_image_url,
            transaction_id,
            confirmation_note
          )
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading my payments:', error);
        throw error;
      }

      // Lọc chỉ những kê khai có thanh toán
      const paymentRelatedKeKhai = keKhaiWithPayments?.filter((kk: any) =>
        kk.thanh_toan && kk.thanh_toan.length > 0
      ) || [];

      // Áp dụng filter status nếu có
      const filteredData = filterStatus === 'all'
        ? paymentRelatedKeKhai
        : paymentRelatedKeKhai.filter((kk: any) => {
            const latestPayment = getLatestPayment(kk);

            if (filterStatus === 'pending_payment') {
              return isPaymentPending(kk) || latestPayment?.trang_thai === 'pending';
            } else if (filterStatus === 'paid') {
              return isPaymentCompleted(kk) || latestPayment?.trang_thai === 'completed';
            } else if (filterStatus === 'processing') {
              return latestPayment?.trang_thai === 'processing';
            } else if (filterStatus === 'failed') {
              return latestPayment?.trang_thai === 'failed';
            } else if (filterStatus === 'cancelled') {
              return latestPayment?.trang_thai === 'cancelled';
            } else if (filterStatus === 'expired') {
              return latestPayment?.trang_thai === 'expired';
            }
            return true;
          });

      setKeKhaiList(filteredData);
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

  // Listen for payment confirmation events to auto-reload data
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('MyPayments: Payment confirmed event received', data);
      loadMyPayments();
      showToast('Thanh toán đã được xác nhận thành công', 'success');
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      console.log('MyPayments: Ke khai status changed event received', data);
      loadMyPayments();
    };

    const handleRefreshAllPages = (data: any) => {
      console.log('MyPayments: Refresh all pages event received', data);
      loadMyPayments();
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_MY_PAYMENTS, loadMyPayments);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_MY_PAYMENTS, loadMyPayments);
    };
  }, []);

  // Filter data based on search term
  const filteredKeKhai = keKhaiList.filter(keKhai =>
    keKhai.ma_ke_khai.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keKhai.ten_ke_khai.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get object type badge
  const getObjectTypeBadge = (loaiKeKhai: string) => {
    switch (loaiKeKhai) {
      case 'BHYT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            BHYT
          </span>
        );
      case 'BHXH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            BHXH
          </span>
        );
      case 'BHTN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            BHTN
          </span>
        );
      case 'BHTNLĐ':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            BHTNLĐ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {loaiKeKhai || 'N/A'}
          </span>
        );
    }
  };

  // Get ke khai status badge
  const getKeKhaiStatusBadge = (keKhai: any) => {
    switch (keKhai.trang_thai) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="w-3 h-3 mr-1" />
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
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            {keKhai.trang_thai || 'N/A'}
          </span>
        );
    }
  };

  // Get status badge based on payment status only
  const getPaymentStatusBadge = (keKhai: any) => {
    const latestPayment = getLatestPayment(keKhai);

    if (!latestPayment) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Chưa có thanh toán
        </span>
      );
    }

    // Dựa vào trạng thái thanh toán thực tế
    switch (latestPayment.trang_thai) {
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
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Thất bại
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Hết hạn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            {latestPayment.trang_thai}
          </span>
        );
    }
  };

  // Handle view payment
  const handleViewPayment = (keKhai: any) => {
    const latestPayment = getLatestPayment(keKhai);
    if (latestPayment) {
      setSelectedPayment(latestPayment);
      setShowPaymentModal(true);
    } else {
      showToast('Không tìm thấy thông tin thanh toán', 'error');
    }
  };

  // Handle view proof image
  const handleViewProof = (keKhai: any) => {
    const latestPayment = getLatestPayment(keKhai);
    if (latestPayment && latestPayment.proof_image_url) {
      setSelectedPayment(latestPayment);
      setShowProofModal(true);
    } else {
      showToast('Không có ảnh chứng từ', 'warning');
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
              <option value="processing">Đang xử lý</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã hủy</option>
              <option value="expired">Hết hạn</option>
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
                      Đối tượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái kê khai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày yêu cầu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày thanh toán
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
                        {getObjectTypeBadge(keKhai.loai_ke_khai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {(() => {
                              const latestPayment = getLatestPayment(keKhai);
                              return latestPayment?.so_tien
                                ? paymentService.formatCurrency(latestPayment.so_tien)
                                : 'Chưa tính';
                            })()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getKeKhaiStatusBadge(keKhai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(keKhai)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {(() => {
                            const latestPayment = getLatestPayment(keKhai);
                            if (latestPayment?.paid_at) {
                              return new Date(latestPayment.paid_at).toLocaleString('vi-VN');
                            } else if (isPaymentPending(keKhai)) {
                              return (
                                <span className="text-orange-500 italic">Chờ thanh toán</span>
                              );
                            }
                            return 'N/A';
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const latestPayment = getLatestPayment(keKhai);
                            if (!latestPayment) return null;

                            if (isPaymentPending(keKhai)) {
                              return (
                                <button
                                  onClick={() => handleViewPayment(keKhai)}
                                  className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                  title="Thanh toán QR Code"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>
                              );
                            } else if (isPaymentCompleted(keKhai)) {
                              return (
                                <>
                                  <button
                                    onClick={() => handleViewPayment(keKhai)}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                    title="Xem thông tin thanh toán"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  {latestPayment.proof_image_url && (
                                    <button
                                      onClick={() => handleViewProof(keKhai)}
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                      title="Xem ảnh chứng từ"
                                    >
                                      <Image className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              );
                            }
                            return null;
                          })()}
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

export default MyPayments;
