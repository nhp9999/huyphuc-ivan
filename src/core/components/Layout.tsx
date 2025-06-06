import React, { useState, useEffect } from 'react';
import SidebarOptimized from './SidebarOptimized';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';
import PaymentNotification from '../../modules/ke-khai/components/PaymentNotification';
import { useAuth } from '../../modules/auth';
import { useRoleContext } from '../contexts/RoleContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { isNhanVienThu, isCongTacVien } = useRoleContext();

  // Show payment notifications for collection staff (nhân viên thu) and collaborators (cộng tác viên)
  const shouldShowPaymentNotifications = user && (isNhanVienThu || isCongTacVien);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Handle backdrop click on mobile
  const handleBackdropClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className={`${theme} flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900`}>
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <SidebarOptimized
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        onClose={closeSidebar}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {/* Global Payment Notifications - Only for collection staff and collaborators */}
      {shouldShowPaymentNotifications && <PaymentNotification />}
    </div>
  );
};

export default Layout;