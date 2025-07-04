import React from 'react';
import { Bell, CreditCard, X, Eye } from 'lucide-react';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import { usePaymentNotification } from '../contexts/PaymentNotificationContext';

interface PaymentNotificationProps {
  showOnPage?: boolean; // Allow hiding on specific pages
}

const PaymentNotification: React.FC<PaymentNotificationProps> = ({ showOnPage = true }) => {
  const { setCurrentPage } = useNavigation();
  const {
    pendingPayments,
    showNotification,
    loading,
    dismissNotification,
    isVisible,
    setIsVisible
  } = usePaymentNotification();

  // Handle view payments
  const handleViewPayments = () => {
    setCurrentPage('my-payments');
    dismissNotification();
  };

  // Handle dismiss notification
  const handleDismiss = () => {
    dismissNotification();
  };

  // Don't show if disabled for this page or no notifications to show
  if (!showOnPage || !showNotification || pendingPayments.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-orange-200 dark:border-orange-800 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Thông báo thanh toán
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-gray-900 dark:text-white">
              Bạn có <strong>{pendingPayments.length}</strong> kê khai cần thanh toán
            </span>
          </div>
          
          {/* List of pending payments */}
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {pendingPayments.slice(0, 3).map((keKhai) => (
              <div
                key={keKhai.id}
                className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2"
              >
                <div className="font-medium">{keKhai.ma_ke_khai}</div>
                <div className="truncate">{keKhai.ten_ke_khai}</div>
                {keKhai.total_amount && (
                  <div className="text-orange-600 dark:text-orange-400 font-medium">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(keKhai.total_amount)}
                  </div>
                )}
              </div>
            ))}
            
            {pendingPayments.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                và {pendingPayments.length - 3} kê khai khác...
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleViewPayments}
            className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>Xem & Thanh toán</span>
          </button>
        </div>

        {/* Auto-dismiss info */}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Thông báo sẽ ẩn trong 30 phút sau khi bỏ qua
        </div>
      </div>
    </div>
  );
};

export default PaymentNotification;
