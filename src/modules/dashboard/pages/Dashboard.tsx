import React from 'react';
import { useRoleContext } from '../../../core/contexts/RoleContext';
import NhanVienThuDashboard from './NhanVienThuDashboard';
import NhanVienTongHopDashboard from './NhanVienTongHopDashboard';
import AdminDashboard from './AdminDashboard';

// Dashboard chính với phân luồng theo role

const Dashboard: React.FC = () => {
  const { isNhanVienThu, isNhanVienTongHop, isCongTacVien, isAdmin, isSuperAdmin, loading } = useRoleContext();

  // Hiển thị loading khi đang tải role
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Phân luồng dashboard theo role
  // Cộng tác viên sử dụng dashboard tương tự nhân viên thu
  if (isCongTacVien && !isAdmin && !isSuperAdmin) {
    return <NhanVienThuDashboard />;
  }

  if (isNhanVienThu && !isAdmin && !isSuperAdmin) {
    return <NhanVienThuDashboard />;
  }

  if (isNhanVienTongHop && !isAdmin && !isSuperAdmin) {
    return <NhanVienTongHopDashboard />;
  }

  if (isAdmin || isSuperAdmin) {
    return <AdminDashboard />;
  }

  // Fallback - hiển thị dashboard mặc định nếu không xác định được role
  return <AdminDashboard />;
};



export default Dashboard;