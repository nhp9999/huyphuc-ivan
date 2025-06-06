import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core imports
import { ThemeProvider } from './core/contexts/ThemeContext';
import { NavigationProvider } from './core/contexts/NavigationContext';
import { RoleProvider } from './core/contexts/RoleContext';
import { PaymentNotificationProvider } from './modules/ke-khai/contexts/PaymentNotificationContext';
import Layout from './core/components/Layout';

// Module imports
import { AuthProvider, useAuth, Login, OrganizationSelector } from './modules/auth';
import { Dashboard, Settings } from './modules/dashboard';
import {
  BhytLookup,
  BhxhLookup,
  BhxhIdLookup,
  FamilyLookup
} from './modules/tra-cuu';
import {
  CongTyManagement,
  CoQuanBhxhManagement,
  CongTacVienManagement,
  MyCongTacVienManagement,
  DaiLyManagement,
  DaiLyDonViLinkManagement,
  DonViManagement,
  NguoiDungManagement,
  PhanQuyenManagement
} from './modules/quan-ly';
import {
  KeKhai603,
  KeKhai603Form,
  DeclarationCategories,
  DeclarationHistory,
  KeKhaiManagement,
  MyPayments,
  PaymentManagement,
  HoSoChuaXuLy,
  HoSoDaXuLy,
  RevenueCommission
} from './modules/ke-khai';
import TestPaymentDisplay from './test-payment-display';


// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user, setCurrentOrganization } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu user có nhiều tổ chức và chưa chọn tổ chức hiện tại
  if (user?.organizations && user.organizations.length > 0 && !user.currentOrganization) {
    return (
      <OrganizationSelector
        organizations={user.organizations}
        onSelect={(org) => {
          setCurrentOrganization(org);
        }}
      />
    );
  }

  return (
    <PaymentNotificationProvider>
      <Layout>{children}</Layout>
    </PaymentNotificationProvider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/bhyt-lookup" element={
        <ProtectedRoute>
          <BhytLookup />
        </ProtectedRoute>
      } />

      <Route path="/bhxh-lookup" element={
        <ProtectedRoute>
          <BhxhLookup />
        </ProtectedRoute>
      } />

      <Route path="/bhxh-id-lookup" element={
        <ProtectedRoute>
          <BhxhIdLookup />
        </ProtectedRoute>
      } />

      <Route path="/family-lookup" element={
        <ProtectedRoute>
          <FamilyLookup />
        </ProtectedRoute>
      } />

      <Route path="/declaration-categories" element={
        <ProtectedRoute>
          <DeclarationCategories />
        </ProtectedRoute>
      } />

      <Route path="/declaration-history" element={
        <ProtectedRoute>
          <DeclarationHistory />
        </ProtectedRoute>
      } />

      <Route path="/ke-khai-603" element={
        <ProtectedRoute>
          <KeKhai603 />
        </ProtectedRoute>
      } />

      <Route path="/ke-khai-603-form" element={
        <ProtectedRoute>
          <KeKhai603Form />
        </ProtectedRoute>
      } />

      <Route path="/ke-khai-management" element={
        <ProtectedRoute>
          <KeKhaiManagement />
        </ProtectedRoute>
      } />

      <Route path="/my-payments" element={
        <ProtectedRoute>
          <MyPayments />
        </ProtectedRoute>
      } />

      <Route path="/payment-management" element={
        <ProtectedRoute>
          <PaymentManagement />
        </ProtectedRoute>
      } />

      <Route path="/ho-so-chua-xu-ly" element={
        <ProtectedRoute>
          <HoSoChuaXuLy />
        </ProtectedRoute>
      } />

      <Route path="/ho-so-da-xu-ly" element={
        <ProtectedRoute>
          <HoSoDaXuLy />
        </ProtectedRoute>
      } />

      <Route path="/test-payment-display" element={
        <ProtectedRoute>
          <TestPaymentDisplay />
        </ProtectedRoute>
      } />

      <Route path="/don-vi-management" element={
        <ProtectedRoute>
          <DonViManagement />
        </ProtectedRoute>
      } />

      <Route path="/dai-ly-management" element={
        <ProtectedRoute>
          <DaiLyManagement />
        </ProtectedRoute>
      } />

      <Route path="/dai-ly-don-vi-link" element={
        <ProtectedRoute>
          <DaiLyDonViLinkManagement />
        </ProtectedRoute>
      } />

      <Route path="/cong-ty-management" element={
        <ProtectedRoute>
          <CongTyManagement />
        </ProtectedRoute>
      } />

      <Route path="/co-quan-bhxh-management" element={
        <ProtectedRoute>
          <CoQuanBhxhManagement />
        </ProtectedRoute>
      } />

      <Route path="/nguoi-dung-management" element={
        <ProtectedRoute>
          <NguoiDungManagement />
        </ProtectedRoute>
      } />

      <Route path="/cong-tac-vien-management" element={
        <ProtectedRoute>
          <CongTacVienManagement />
        </ProtectedRoute>
      } />

      <Route path="/my-cong-tac-vien" element={
        <ProtectedRoute>
          <MyCongTacVienManagement />
        </ProtectedRoute>
      } />

      <Route path="/phan-quyen-management" element={
        <ProtectedRoute>
          <PhanQuyenManagement />
        </ProtectedRoute>
      } />

      <Route path="/revenue-commission" element={
        <ProtectedRoute>
          <RevenueCommission />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <Router>
            <NavigationProvider>
              <AppContent />
            </NavigationProvider>
          </Router>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;