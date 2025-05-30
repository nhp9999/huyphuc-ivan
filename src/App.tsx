import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
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


const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentPage } = useNavigation();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'bhyt-lookup':
        return <BhytLookup />;
      case 'bhxh-lookup':
        return <BhxhLookup />;
      case 'bhxh-id-lookup':
        return <BhxhIdLookup />;
      case 'family-lookup':
        return <FamilyLookup />;
      case 'declaration-categories':
        return <DeclarationCategories />;
      case 'declaration-history':
        return <DeclarationHistory />;
      case 'ke-khai-603':
        return <KeKhai603 />;
      case 'bhyt-declaration':
        return <KeKhai603Form />;
      case 'don-vi-management':
        return <DonViManagement />;
      case 'dai-ly-management':
        return <DaiLyManagement />;
      case 'dai-ly-don-vi-link':
        return <DaiLyDonViLinkManagement />;

      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

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
    return <Login />;
  }

  return (
    <Layout>
      {renderCurrentPage()}
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;