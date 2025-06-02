import React, { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';
import paymentService from '../services/paymentService';
import keKhaiService from '../services/keKhaiService';
import { useToast } from '../../../shared/hooks/useToast';
import { useAuth } from '../../auth';
import PaymentConfirmModal from './PaymentConfirmModal';

interface PaymentQRModalProps {
  payment: ThanhToan;
  onClose: () => void;
  onPaymentConfirmed: () => void;
}

const PaymentQRModal: React.FC<PaymentQRModalProps> = ({
  payment,
  onClose,
  onPaymentConfirmed
}) => {
  const [currentPayment, setCurrentPayment] = useState<ThanhToan>(payment);
  const [isChecking, setIsChecking] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Tính thời gian còn lại
  useEffect(() => {
    if (!currentPayment.expired_at) return;

    const updateTimeLeft = () => {
      const expiredTime = new Date(currentPayment.expired_at!).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, expiredTime - now);
      setTimeLeft(remaining);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [currentPayment.expired_at]);

  // Auto-check payment status
  useEffect(() => {
    if (currentPayment.trang_thai === 'completed') {
      onPaymentConfirmed();
      return;
    }

    const checkInterval = setInterval(async () => {
      try {
        const updatedPayment = await paymentService.checkPaymentStatus(currentPayment.id);
        setCurrentPayment(updatedPayment);
        
        if (updatedPayment.trang_thai === 'completed') {
          showToast('Thanh toán thành công!', 'success');
          onPaymentConfirmed();
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [currentPayment.id, currentPayment.trang_thai, onPaymentConfirmed, showToast]);

  // Format thời gian còn lại
  const formatTimeLeft = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Copy QR data to clipboard
  const copyQRData = async () => {
    try {
      const noiDung = currentPayment.payment_description || `BHXH 103 00 ${currentPayment.ma_thanh_toan}`;
      const copyText = `Ngân hàng: AGRIBANK\nSố tài khoản: 6706202903085\nTên tài khoản: BAO HIEM XA HOI THI XA TINH BIEN\nSố tiền: ${paymentService.formatCurrency(currentPayment.so_tien)}\nMã thanh toán: ${currentPayment.ma_thanh_toan}\nNội dung: ${noiDung}`;
      await navigator.clipboard.writeText(copyText);
      showToast('Đã sao chép thông tin thanh toán', 'success');
    } catch (error) {
      showToast('Không thể sao chép thông tin', 'error');
    }
  };

  // Manual refresh payment status
  const refreshPaymentStatus = async () => {
    setIsChecking(true);
    try {
      const updatedPayment = await paymentService.checkPaymentStatus(currentPayment.id);
      setCurrentPayment(updatedPayment);

      if (updatedPayment.trang_thai === 'completed') {
        showToast('Thanh toán thành công!', 'success');
        onPaymentConfirmed();
      } else {
        showToast('Chưa nhận được thanh toán', 'info');
      }
    } catch (error) {
      showToast('Không thể kiểm tra trạng thái thanh toán', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const confirmPaymentManually = () => {
    setShowConfirmModal(true);
  };

  const handlePaymentConfirm = async (proofImageUrl?: string) => {
    setIsConfirming(true);
    try {
      // Sử dụng keKhaiService.confirmPayment để cập nhật cả payment và kê khai
      await keKhaiService.confirmPayment(
        currentPayment.ke_khai_id, // keKhaiId
        currentPayment.id, // paymentId
        undefined, // transactionId
        user?.id?.toString(), // confirmedBy
        proofImageUrl, // proofImageUrl
        'Xác nhận thủ công bởi người dùng' // confirmationNote
      );

      // Cập nhật trạng thái payment local
      const updatedPayment = {
        ...currentPayment,
        trang_thai: 'completed' as const,
        paid_at: new Date().toISOString(),
        proof_image_url: proofImageUrl,
        confirmation_note: 'Xác nhận thủ công bởi người dùng'
      };

      setCurrentPayment(updatedPayment);
      setShowConfirmModal(false);
      showToast('Đã xác nhận thanh toán thành công!', 'success');
      onPaymentConfirmed();
    } catch (error) {
      console.error('Error confirming payment:', error);
      showToast('Không thể xác nhận thanh toán', 'error');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
  };

  const getStatusIcon = () => {
    switch (currentPayment.trang_thai) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (currentPayment.trang_thai) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'processing':
        return 'Đang xử lý';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium">Thanh toán QR</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
            {timeLeft > 0 && currentPayment.trang_thai === 'pending' && (
              <div className="text-sm font-mono text-red-500">
                {formatTimeLeft(timeLeft)}
              </div>
            )}
          </div>

          {/* QR Code */}
          {currentPayment.qr_code_url && (
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <img
                src={currentPayment.qr_code_url}
                alt="QR Code"
                className={`w-64 h-64 ${currentPayment.trang_thai === 'completed' ? 'grayscale' : ''}`}
              />
            </div>
          )}

          {/* Payment Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-blue-50 rounded">
              <span>Mã thanh toán:</span>
              <span className="font-medium">{currentPayment.ma_thanh_toan}</span>
            </div>
            <div className="flex justify-between p-2 bg-green-50 rounded">
              <span>Số tiền:</span>
              <span className="font-medium">{paymentService.formatCurrency(currentPayment.so_tien)}</span>
            </div>
            <div className="p-2 bg-gray-50 rounded space-y-2">
              <div className="flex justify-between">
                <span>Ngân hàng:</span>
                <span className="font-medium">AGRIBANK</span>
              </div>
              <div className="flex justify-between">
                <span>Số tài khoản:</span>
                <span className="font-medium">6706202903085</span>
              </div>
              <div className="flex justify-between">
                <span>Tên TK:</span>
                <span className="font-medium">BAO HIEM XA HOI THI XA TINH BIEN</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <button
                onClick={copyQRData}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Sao chép thông tin</span>
              </button>
              <button
                onClick={refreshPaymentStatus}
                disabled={isChecking}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Kiểm tra</span>
              </button>
            </div>

            {/* Manual Confirmation Button - Only show for pending payments */}
            {currentPayment.trang_thai === 'pending' && (
              <button
                onClick={confirmPaymentManually}
                disabled={isConfirming}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                <span>✅ Tôi đã thanh toán</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Tự động cập nhật</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Đóng
          </button>
        </div>

        {/* Payment Confirmation Modal */}
        <PaymentConfirmModal
          isOpen={showConfirmModal}
          onClose={handleConfirmModalClose}
          onConfirm={handlePaymentConfirm}
          paymentAmount={currentPayment.so_tien}
          paymentCode={currentPayment.ma_thanh_toan}
          isLoading={isConfirming}
        />
      </div>
    </div>
  );
};

export default PaymentQRModal;
