import { useState, useEffect, useMemo, useCallback } from 'react';
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

// Cache cho roles và permissions
const roleCache = new Map<string, { roles: UserRole[], permissions: UserPermission[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra cache
  const getCachedData = useCallback((userId: string) => {
    const cached = roleCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    return null;
  }, []);

  // Lưu vào cache
  const setCachedData = useCallback((userId: string, roles: UserRole[], permissions: UserPermission[]) => {
    roleCache.set(userId, {
      roles,
      permissions,
      timestamp: Date.now()
    });
  }, []);

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
      // Kiểm tra cache trước
      const cachedData = getCachedData(user.id);
      if (cachedData) {
        setUserRoles(cachedData.roles);
        setUserPermissions(cachedData.permissions);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Gọi API song song để tăng tốc
      const [permissions, allRoles] = await Promise.all([
        phanQuyenService.getPhanQuyenByUserId(parseInt(user.id)),
        phanQuyenService.getAllVaiTro()
      ]);

      const userRoleIds = permissions.map(p => p.vai_tro_id);
      const roles = allRoles.filter(role => userRoleIds.includes(role.id));

      // Lưu vào cache
      setCachedData(user.id, roles, permissions);

      setUserPermissions(permissions);
      setUserRoles(roles);

    } catch (err) {
      console.error('Error loading user role and permissions:', err);
      setError('Không thể tải thông tin vai trò người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Memoize các function kiểm tra để tránh re-computation
  const hasRole = useCallback((roleName: string): boolean => {
    return userRoles.some(role =>
      role.ten_vai_tro.toLowerCase().includes(roleName.toLowerCase()) ||
      role.ma_vai_tro.toLowerCase().includes(roleName.toLowerCase())
    );
  }, [userRoles]);

  const hasPermissionLevel = useCallback((level: string): boolean => {
    return userPermissions.some(permission => permission.cap_do_quyen === level);
  }, [userPermissions]);

  // Memoize các role checks
  const isNhanVienThu = useMemo((): boolean => {
    return hasRole('nhân viên thu') || hasRole('nhan_vien_thu');
  }, [hasRole]);

  const isNhanVienTongHop = useMemo((): boolean => {
    return hasRole('nhân viên tổng hợp') || hasRole('nhan_vien_tong_hop');
  }, [hasRole]);

  const isCongTacVien = useMemo((): boolean => {
    return hasRole('cộng tác viên') || hasRole('cong_tac_vien');
  }, [hasRole]);

  const isAdmin = useMemo((): boolean => {
    return hasPermissionLevel('admin') || hasPermissionLevel('super_admin');
  }, [hasPermissionLevel]);

  const isSuperAdmin = useMemo((): boolean => {
    return hasPermissionLevel('super_admin');
  }, [hasPermissionLevel]);

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
    isCongTacVien,
    isAdmin,
    isSuperAdmin,
    getPrimaryRole,
    getRoleDisplayName,
    getHighestPermissionLevel,
    reload: loadUserRoleAndPermissions
  };
};
