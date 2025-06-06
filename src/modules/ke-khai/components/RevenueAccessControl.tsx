import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useOptimizedRole } from '../../../core/hooks/useOptimizedRole';

interface RevenueAccessControlProps {
  children: React.ReactNode;
}

const RevenueAccessControl: React.FC<RevenueAccessControlProps> = ({ children }) => {
  const { isNhanVienThu, isCongTacVien, loading, initialized } = useOptimizedRole();

  // Show loading state while checking permissions
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user has permission to access revenue features
  const hasAccess = isNhanVienThu || isCongTacVien;

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Không có quyền truy cập
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tính năng doanh thu và hoa hồng chỉ dành cho nhân viên thu và cộng tác viên.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
              <span className="text-sm text-amber-800 dark:text-amber-200">
                Liên hệ quản trị viên để được cấp quyền truy cập
              </span>
            </div>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // User has access, render the children
  return <>{children}</>;
};

export default RevenueAccessControl;
