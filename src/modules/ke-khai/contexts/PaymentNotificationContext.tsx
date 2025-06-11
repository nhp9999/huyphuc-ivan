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
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(true);

  // Minimum time between API calls (5 seconds)
  const MIN_LOAD_INTERVAL = 5000;

  // Cleanup on unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Load pending payments with throttling
  const loadPendingPayments = async () => {
    if (!user?.id || !isMounted) return;

    // Throttle API calls to prevent excessive requests
    const now = Date.now();
    if (now - lastLoadTime < MIN_LOAD_INTERVAL) {
      console.log('🚫 PaymentNotification: Throttling API call, too soon since last request');
      return;
    }

    if (!isMounted) return; // Double check before making API call

    setLoading(true);
    setLastLoadTime(now);

    try {
      console.log('🔔 PaymentNotification: Loading pending payments...');
      const data = await keKhaiService.getKeKhaiForApproval({
        created_by: user.id,
        trang_thai: 'pending_payment'
      });

      console.log(`🔔 PaymentNotification: Loaded ${data.length} pending payments`);

      // Only update state if component is still mounted
      if (isMounted) {
        setPendingPayments(data);

        // Show notification if there are pending payments and not dismissed
        const shouldShow = data.length > 0 && isVisible && (!dismissedUntil || now > dismissedUntil);
        setShowNotification(shouldShow);
      }
    } catch (error) {
      console.error('❌ PaymentNotification: Error loading pending payments:', error);
      // Reset lastLoadTime on error to allow retry sooner
      if (isMounted) {
        setLastLoadTime(0);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
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
  };

  // Initial load and polling
  useEffect(() => {
    if (!user?.id) return;

    loadPendingPayments();

    // Poll for updates every 2 minutes
    const interval = setInterval(() => {
      if (user?.id) {
        loadPendingPayments();
      }
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id]); // Remove isVisible from dependencies to prevent infinite loop

  // Listen for payment-related events
  useEffect(() => {
    const handlePaymentConfirmed = (data: any) => {
      console.log('🎉 PaymentNotification: Payment confirmed event received');
      setTimeout(loadPendingPayments, 1000); // Delay to allow DB to update
    };

    const handleKeKhaiStatusChanged = (data: any) => {
      // Only refresh if status changed to pending_payment
      if (data.newStatus === 'pending_payment') {
        console.log('📝 PaymentNotification: Ke khai status changed to pending_payment');
        setTimeout(loadPendingPayments, 1000); // Delay to allow DB to update
      }
    };

    const handleRefreshAllPages = () => {
      console.log('🔄 PaymentNotification: Refresh all pages event received');
      setTimeout(loadPendingPayments, 500);
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
