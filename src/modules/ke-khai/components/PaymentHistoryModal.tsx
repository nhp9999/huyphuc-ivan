import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Eye, Image, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { DanhSachKeKhai, ThanhToan } from '../../../shared/services/api/supabaseClient';
import paymentService from '../services/paymentService';
import { useToast } from '../../../shared/hooks/useToast';
import PaymentQRModal from './PaymentQRModal';
import PaymentProofModal from './PaymentProofModal';

interface PaymentHistoryModalProps {
  keKhai: DanhSachKeKhai;
  onClose: () => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  keKhai,
  onClose
}) => {
  const { showToast } = useToast();

  // State
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<ThanhToan[]>([]);
  const [totalRequired, setTotalRequired] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);

  // Load payment history
  const loadPaymentHistory = async () => {
    setLoading(true);
    try {
      const [paymentsData, totalRequiredAmount, totalPaidAmount] = await Promise.all([
        paymentService.getAllPaymentsByKeKhaiId(keKhai.id),
        paymentService.calculateTotalAmount(keKhai.id),
        paymentService.getTotalPaidAmount(keKhai.id)
      ]);

      setPayments(paymentsData);
      setTotalRequired(totalRequiredAmount);
      setTotalPaid(totalPaidAmount);
    } catch (error) {
      console.error('Error loading payment history:', error);
      showToast('Không thể tải lịch sử thanh toán', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentHistory();
  }, [keKhai.id]);

  // Get payment status badge
  const getPaymentStatusBadge = (payment: ThanhToan) => {
    switch (payment.trang_thai) {
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
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            {payment.trang_thai}
          </span>
        );
    }
  };

  // Handle view payment
  const handleViewPayment = (payment: ThanhToan) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  // Handle view proof
  const handleViewProof = (payment: ThanhToan) => {
    if (payment.proof_image_url) {
      setSelectedPayment(payment);
      setShowProofModal(true);
    } else {
      showToast('Không có ảnh chứng từ', 'warning');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Lịch sử thanh toán
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kê khai: {keKhai.ma_ke_khai} - {keKhai.ten_ke_khai}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Summary */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">Tổng cần thanh toán</span>
                </div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {paymentService.formatCurrency(totalRequired)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 dark:text-green-400">Đã thanh toán</span>
                </div>
                <p className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {paymentService.formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-600 dark:text-red-400">Còn thiếu</span>
                </div>
                <p className="text-xl font-bold text-red-900 dark:text-red-100 mt-1">
                  {paymentService.formatCurrency(Math.max(0, totalRequired - totalPaid))}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Chưa có thanh toán nào
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Kê khai này chưa có lịch sử thanh toán
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mã thanh toán
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
                        Ngày thanh toán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ghi chú
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.ma_thanh_toan}
                          </div>
                          {payment.transaction_id && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              GD: {payment.transaction_id}
                            </div>
                          )}
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
                          {getPaymentStatusBadge(payment)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {payment.created_at
                              ? new Date(payment.created_at).toLocaleString('vi-VN')
                              : 'N/A'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {payment.paid_at
                              ? new Date(payment.paid_at).toLocaleString('vi-VN')
                              : payment.trang_thai === 'pending'
                              ? <span className="text-orange-500 italic">Chờ thanh toán</span>
                              : 'N/A'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="max-w-xs truncate" title={payment.ghi_chu || payment.confirmation_note || ''}>
                            {payment.ghi_chu || payment.confirmation_note || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewPayment(payment)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Xem chi tiết thanh toán"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {payment.proof_image_url && (
                              <button
                                onClick={() => handleViewProof(payment)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Xem ảnh chứng từ"
                              >
                                <Image className="w-4 h-4" />
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
        </div>
      </div>

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
            loadPaymentHistory(); // Reload data
          }}
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
    </>
  );
};

export default PaymentHistoryModal;
