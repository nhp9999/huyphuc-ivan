import { useEffect } from 'react';
import { usePaymentNotification } from '../contexts/PaymentNotificationContext';

interface PaymentNotificationControlOptions {
  hideOnThisPage?: boolean;
  refreshOnMount?: boolean;
}

/**
 * Hook to control payment notification behavior on specific pages
 */
export const usePaymentNotificationControl = (options: PaymentNotificationControlOptions = {}) => {
  const { 
    setIsVisible, 
    refreshNotifications,
    pendingPayments,
    showNotification 
  } = usePaymentNotification();

  const { hideOnThisPage = false, refreshOnMount = true } = options;

  useEffect(() => {
    // Set visibility based on page preference
    setIsVisible(!hideOnThisPage);

    // Refresh notifications when mounting if requested
    if (refreshOnMount && !hideOnThisPage) {
      refreshNotifications();
    }

    // Cleanup: restore visibility when leaving page
    return () => {
      if (hideOnThisPage) {
        setIsVisible(true);
      }
    };
  }, [hideOnThisPage, refreshOnMount, setIsVisible, refreshNotifications]);

  return {
    pendingPaymentsCount: pendingPayments.length,
    hasNotifications: showNotification,
    refreshNotifications
  };
};
