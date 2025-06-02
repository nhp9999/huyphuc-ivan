import React, { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';
import paymentService from '../services/paymentService';
import { useToast } from '../../../shared/hooks/useToast';

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
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { showToast } = useToast();

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
      const copyText = `Ngân hàng: AGRIBANK\nSố tài khoản: 6706202903085\nTên tài khoản: BAO HIEM XA HOI THI XA TINH BIEN\nSố tiền: ${paymentService.formatCurrency(currentPayment.so_tien)}\nMã thanh toán: ${currentPayment.ma_thanh_toan}\nNội dung: Thanh toán kê khai ${currentPayment.ma_thanh_toan}`;
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

  const qrData = currentPayment.qr_code_data ? JSON.parse(currentPayment.qr_code_data) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Thanh toán QR Code
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Status */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                {getStatusText()}
              </span>
            </div>
          </div>

          {/* Timer */}
          {timeLeft > 0 && currentPayment.trang_thai === 'pending' && (
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Thời gian còn lại:
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatTimeLeft(timeLeft)}
              </p>
            </div>
          )}

          {/* QR Code */}
          {currentPayment.qr_code_url && currentPayment.trang_thai === 'pending' && (
            <div className="text-center mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 inline-block">
                <img
                  src={currentPayment.qr_code_url}
                  alt="QR Code thanh toán"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Quét mã QR để thanh toán
              </p>
            </div>
          )}

          {/* Payment Info */}
          {qrData && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Thông tin thanh toán
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mã thanh toán:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentPayment.ma_thanh_toan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Số tiền:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentService.formatCurrency(currentPayment.so_tien)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ngân hàng:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    AGRIBANK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Số tài khoản:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    6706202903085
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tên tài khoản:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    BAO HIEM XA HOI THI XA TINH BIEN
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nội dung:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {qrData.description}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={copyQRData}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Sao chép thông tin</span>
            </button>
            
            <button
              onClick={refreshPaymentStatus}
              disabled={isChecking}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <strong>Hướng dẫn thanh toán:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Mở ứng dụng ngân hàng trên điện thoại</li>
              <li>Chọn chức năng quét QR Code</li>
              <li>Quét mã QR ở trên</li>
              <li>Kiểm tra thông tin và xác nhận thanh toán</li>
              <li>Hệ thống sẽ tự động cập nhật trạng thái</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRModal;
