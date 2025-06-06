import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import keKhaiService from '../services/keKhaiService';
import { useAuth } from '../../auth';
import { eventEmitter, EVENTS } from '../../../shared/utils/eventEmitter';

interface PaymentNotificationContextType {
  pendingPayments: DanhSachKeKhai[];
  showNotification: boolean;
  loading: boolean;
  dismissNotification: () => void;
  refreshNotifications: () => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const PaymentNotificationContext = createContext<PaymentNotificationContextType | undefined>(undefined);

interface PaymentNotificationProviderProps {
  children: ReactNode;
}

export const PaymentNotificationProvider: React.FC<PaymentNotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [pendingPayments, setPendingPayments] = useState<DanhSachKeKhai[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null);

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
      
      // Show notification if there are pending payments and not dismissed
      const now = Date.now();
      const shouldShow = data.length > 0 && isVisible && (!dismissedUntil || now > dismissedUntil);
      setShowNotification(shouldShow);
      
      console.log('🔔 PaymentNotification: Loaded', data.length, 'pending payments');
    } catch (error) {
      console.error('Error loading pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    loadPendingPayments();
  };

  // Dismiss notification temporarily (30 minutes)
  const dismissNotification = () => {
    const dismissDuration = 30 * 60 * 1000; // 30 minutes
    const dismissUntil = Date.now() + dismissDuration;
    setDismissedUntil(dismissUntil);
    setShowNotification(false);
    
    console.log('🔔 PaymentNotification: Dismissed until', new Date(dismissUntil).toLocaleString());
  };

  // Initial load and polling
  useEffect(() => {
    loadPendingPayments();
    
    // Poll for updates every 2 minutes
    const interval = setInterval(loadPendingPayments, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user?.id, isVisible]);

  // Listen for payment-related events
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('🔔 PaymentNotification: Payment confirmed event received', data);
      loadPendingPayments();
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      console.log('🔔 PaymentNotification: Ke khai status changed event received', data);
      // Only refresh if status changed to pending_payment
      if (data.newStatus === 'pending_payment') {
        loadPendingPayments();
      }
    };

    const handleRefreshAllPages = () => {
      console.log('🔔 PaymentNotification: Refresh all pages event received');
      loadPendingPayments();
    };

    // Subscribe to events
    eventEmitter.on(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    eventEmitter.on(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
    eventEmitter.on(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
    eventEmitter.on(EVENTS.REFRESH_MY_PAYMENTS, loadPendingPayments);

    // Cleanup on unmount
    return () => {
      eventEmitter.off(EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      eventEmitter.off(EVENTS.KE_KHAI_STATUS_CHANGED, handleKeKhaiStatusChanged);
      eventEmitter.off(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, handleRefreshAllPages);
      eventEmitter.off(EVENTS.REFRESH_MY_PAYMENTS, loadPendingPayments);
    };
  }, []);

  // Check if dismiss period has expired
  useEffect(() => {
    if (dismissedUntil) {
      const checkInterval = setInterval(() => {
        const now = Date.now();
        if (now > dismissedUntil) {
          setDismissedUntil(null);
          if (pendingPayments.length > 0 && isVisible) {
            setShowNotification(true);
          }
        }
      }, 60000); // Check every minute

      return () => clearInterval(checkInterval);
    }
  }, [dismissedUntil, pendingPayments.length, isVisible]);

  const value: PaymentNotificationContextType = {
    pendingPayments,
    showNotification,
    loading,
    dismissNotification,
    refreshNotifications,
    isVisible,
    setIsVisible
  };

  return (
    <PaymentNotificationContext.Provider value={value}>
      {children}
    </PaymentNotificationContext.Provider>
  );
};

export const usePaymentNotification = (): PaymentNotificationContextType => {
  const context = useContext(PaymentNotificationContext);
  if (context === undefined) {
    throw new Error('usePaymentNotification must be used within a PaymentNotificationProvider');
  }
  return context;
};
