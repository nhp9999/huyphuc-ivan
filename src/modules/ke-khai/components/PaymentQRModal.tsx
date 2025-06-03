import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Thanh toán QR</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* QR Code */}
          {currentPayment.qr_code_url && (
            <div className="flex justify-center">
              <img
                src={currentPayment.qr_code_url}
                alt="QR Code"
                className={`w-72 h-72 ${currentPayment.trang_thai === 'completed' ? 'grayscale' : ''}`}
              />
            </div>
          )}

          {/* Payment Info */}
          <div className="space-y-3 text-center">
            <div>
              <p className="text-sm text-gray-600">Số tiền</p>
              <p className="text-xl font-bold text-green-600">{paymentService.formatCurrency(currentPayment.so_tien)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mã thanh toán</p>
              <p className="text-lg font-medium">{currentPayment.ma_thanh_toan}</p>
            </div>
            {/* Payment Description */}
            {currentPayment.payment_description && (
              <div>
                <p className="text-sm text-gray-600">Nội dung chuyển khoản</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded border text-gray-800">
                  {currentPayment.payment_description}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Manual Confirmation Button - Only show for pending payments */}
            {currentPayment.trang_thai === 'pending' && (
              <button
                onClick={confirmPaymentManually}
                disabled={isConfirming}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                <span>Tôi đã thanh toán</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Đóng
            </button>
          </div>
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
