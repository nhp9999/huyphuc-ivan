import React, { useState, useEffect } from 'react';
import { Bell, CreditCard, X, Eye } from 'lucide-react';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import keKhaiService from '../services/keKhaiService';
import { useAuth } from '../../auth';
import { useNavigation } from '../../../core/contexts/NavigationContext';

const PaymentNotification: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentPage } = useNavigation();
  const [pendingPayments, setPendingPayments] = useState<DanhSachKeKhai[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load pending payments
  const loadPendingPayments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await keKhaiService.getKeKhaiForApproval({
        created_by: user.id,
        trang_thai: 'pending_payment'
      });
      
      setPendingPayments(data);
      setShowNotification(data.length > 0);
    } catch (error) {
      console.error('Error loading pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPayments();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadPendingPayments, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  // Handle view payments
  const handleViewPayments = () => {
    setCurrentPage('my-payments');
    setShowNotification(false);
  };

  // Handle dismiss notification
  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification || pendingPayments.length === 0) {
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

        {/* Auto-dismiss timer */}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Thông báo sẽ tự động ẩn sau 30 giây
        </div>
      </div>
    </div>
  );
};

export default PaymentNotification;
