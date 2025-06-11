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

  // Debug: Log when modal is mounted
  useEffect(() => {
    console.log('🎯 PaymentQRModal mounted with payment:', {
      id: payment.id,
      ke_khai_id: payment.ke_khai_id,
      hasKeKhaiId: !!payment.ke_khai_id,
      ma_thanh_toan: payment.ma_thanh_toan,
      so_tien: payment.so_tien,
      trang_thai: payment.trang_thai,
      qr_code_url: payment.qr_code_url,
      fullPayment: payment
    });

    // Warn if ke_khai_id is missing
    if (!payment.ke_khai_id) {
      console.warn('⚠️ PaymentQRModal: ke_khai_id is missing from payment data!', payment);
    }
  }, [payment]);

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
      console.log('🚀 Starting payment confirmation process...', {
        paymentId: currentPayment.id,
        keKhaiId: currentPayment.ke_khai_id,
        userId: user?.id,
        fullPaymentData: currentPayment
      });

      // Validate that ke_khai_id exists
      if (!currentPayment.ke_khai_id) {
        console.error('❌ Missing ke_khai_id in payment data:', currentPayment);

        // Try to fetch fresh payment data to get ke_khai_id
        try {
          console.log('🔄 Attempting to fetch fresh payment data...');
          const freshPayment = await paymentService.checkPaymentStatus(currentPayment.id);
          if (freshPayment.ke_khai_id) {
            console.log('✅ Found ke_khai_id in fresh payment data:', freshPayment.ke_khai_id);
            setCurrentPayment(freshPayment);
            // Use the fresh payment data for confirmation
            await keKhaiService.confirmPayment(
              freshPayment.ke_khai_id,
              freshPayment.id,
              undefined,
              user?.id?.toString(),
              proofImageUrl,
              'Xác nhận thủ công bởi người dùng'
            );
          } else {
            throw new Error('Không thể lấy thông tin kê khai ID từ dữ liệu thanh toán.');
          }
        } catch (fetchError) {
          console.error('❌ Failed to fetch fresh payment data:', fetchError);
          throw new Error('Thiếu thông tin kê khai ID trong dữ liệu thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
        }
      } else {
        // Normal flow with valid ke_khai_id
        await keKhaiService.confirmPayment(
          currentPayment.ke_khai_id, // keKhaiId
          currentPayment.id, // paymentId
          undefined, // transactionId
          user?.id?.toString(), // confirmedBy
          proofImageUrl, // proofImageUrl
          'Xác nhận thủ công bởi người dùng' // confirmationNote
        );
      }

      console.log('✅ Payment confirmation completed successfully');

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
      showToast('Đã xác nhận thanh toán thành công! Trạng thái kê khai và người tham gia đã được cập nhật.', 'success');

      // Notify parent component
      onPaymentConfirmed();
    } catch (error) {
      console.error('❌ Error confirming payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể xác nhận thanh toán';
      showToast(errorMessage, 'error');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-payment-modal>
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
