import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import BhytLookup from './pages/BhytLookup';
import BhxhLookup from './pages/BhxhLookup';
import BhxhIdLookup from './pages/BhxhIdLookup';
import FamilyLookup from './pages/FamilyLookup';
import DeclarationCategories from './pages/DeclarationCategories';
import KeKhai603 from './pages/KeKhai603';
import KeKhai603Form from './pages/KeKhai603Form';
import DeclarationHistory from './pages/DeclarationHistory';
import DonViManagement from './pages/DonViManagement';
import DaiLyManagement from './pages/DaiLyManagement';
import DaiLyDonViLinkManagement from './pages/DaiLyDonViLinkManagement';
import CongTyManagement from './pages/CongTyManagement';
import CoQuanBhxhManagement from './pages/CoQuanBhxhManagement';
import NguoiDungManagement from './pages/NguoiDungManagement';
import PhanQuyenManagement from './pages/PhanQuyenManagement';


// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
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

      <Route path="/phan-quyen-management" element={
        <ProtectedRoute>
          <PhanQuyenManagement />
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
        <Router>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;