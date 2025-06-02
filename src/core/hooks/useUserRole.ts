import { useState, useEffect } from 'react';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import phanQuyenService from '../../modules/quan-ly/services/phanQuyenService';

export interface UserRole {
  id: number;
  ma_vai_tro: string;
  ten_vai_tro: string;
  cap_do: string;
  quyen_han?: string;
}

export interface UserPermission {
  id: number;
  vai_tro_id: number;
  cap_do_quyen: string;
  loai_to_chuc: string;
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  dai_ly_id?: number;
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadUserRoleAndPermissions();
    } else {
      setUserRoles([]);
      setUserPermissions([]);
      setLoading(false);
    }
  }, [user?.id]);

  const loadUserRoleAndPermissions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Lấy phân quyền của người dùng
      const permissions = await phanQuyenService.getPhanQuyenByUserId(parseInt(user.id));
      setUserPermissions(permissions);

      // Lấy thông tin vai trò
      const allRoles = await phanQuyenService.getAllVaiTro();
      const userRoleIds = permissions.map(p => p.vai_tro_id);
      const roles = allRoles.filter(role => userRoleIds.includes(role.id));
      setUserRoles(roles);

    } catch (err) {
      console.error('Error loading user role and permissions:', err);
      setError('Không thể tải thông tin vai trò người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra xem người dùng có vai trò cụ thể không
  const hasRole = (roleName: string): boolean => {
    return userRoles.some(role => 
      role.ten_vai_tro.toLowerCase().includes(roleName.toLowerCase()) ||
      role.ma_vai_tro.toLowerCase().includes(roleName.toLowerCase())
    );
  };

  // Kiểm tra xem người dùng có cấp độ quyền cụ thể không
  const hasPermissionLevel = (level: string): boolean => {
    return userPermissions.some(permission => permission.cap_do_quyen === level);
  };

  // Kiểm tra xem có phải nhân viên thu không
  const isNhanVienThu = (): boolean => {
    return hasRole('nhân viên thu') || hasRole('nhan_vien_thu');
  };

  // Kiểm tra xem có phải nhân viên tổng hợp không
  const isNhanVienTongHop = (): boolean => {
    return hasRole('nhân viên tổng hợp') || hasRole('nhan_vien_tong_hop');
  };

  // Kiểm tra xem có phải admin không
  const isAdmin = (): boolean => {
    return hasPermissionLevel('admin') || hasPermissionLevel('super_admin');
  };

  // Kiểm tra xem có phải super admin không
  const isSuperAdmin = (): boolean => {
    return hasPermissionLevel('super_admin');
  };

  // Lấy vai trò chính (vai trò có cấp độ cao nhất)
  const getPrimaryRole = (): UserRole | null => {
    if (userRoles.length === 0) return null;

    // Sắp xếp theo thứ tự ưu tiên: super_admin > admin > user
    const sortedRoles = [...userRoles].sort((a, b) => {
      const levelOrder = { 'super_admin': 3, 'admin': 2, 'user': 1 };
      return (levelOrder[b.cap_do as keyof typeof levelOrder] || 0) - 
             (levelOrder[a.cap_do as keyof typeof levelOrder] || 0);
    });

    return sortedRoles[0];
  };

  // Lấy tên vai trò hiển thị
  const getRoleDisplayName = (): string => {
    const primaryRole = getPrimaryRole();
    return primaryRole?.ten_vai_tro || 'Người dùng';
  };

  // Lấy cấp độ quyền cao nhất
  const getHighestPermissionLevel = (): string => {
    if (isSuperAdmin()) return 'super_admin';
    if (isAdmin()) return 'admin';
    return 'user';
  };

  return {
    userRoles,
    userPermissions,
    loading,
    error,
    hasRole,
    hasPermissionLevel,
    isNhanVienThu,
    isNhanVienTongHop,
    isAdmin,
    isSuperAdmin,
    getPrimaryRole,
    getRoleDisplayName,
    getHighestPermissionLevel,
    reload: loadUserRoleAndPermissions
  };
};
