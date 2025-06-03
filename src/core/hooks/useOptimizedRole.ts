import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { roleStorage } from '../utils/roleStorage';
import { UserRole, UserPermission } from './useUserRole';
import phanQuyenService from '../../modules/quan-ly/services/phanQuyenService';

interface OptimizedRoleState {
  isNhanVienThu: boolean;
  isNhanVienTongHop: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  initialized: boolean;
}

// Hàm helper để khởi tạo state từ localStorage
const getInitialRoleState = (userId?: string) => {
  if (!userId) {
    return {
      roles: [],
      permissions: [],
      initialized: true,
      loading: false
    };
  }

  const storedData = roleStorage.load(userId);
  if (storedData) {
    return {
      roles: storedData.roles,
      permissions: storedData.permissions,
      initialized: true,
      loading: false
    };
  }

  return {
    roles: [],
    permissions: [],
    initialized: false,
    loading: true
  };
};

export const useOptimizedRole = (): OptimizedRoleState => {
  const { user } = useAuth();

  // Khởi tạo state ngay từ localStorage
  const initialState = getInitialRoleState(user?.id);
  const [roles, setRoles] = useState<UserRole[]>(initialState.roles);
  const [permissions, setPermissions] = useState<UserPermission[]>(initialState.permissions);
  const [loading, setLoading] = useState(initialState.loading);
  const [initialized, setInitialized] = useState(initialState.initialized);

  // Effect để handle user change và load data khi cần
  useEffect(() => {
    if (!user?.id) {
      setRoles([]);
      setPermissions([]);
      setInitialized(true);
      setLoading(false);
      return;
    }

    // Kiểm tra lại localStorage cho user mới
    const storedData = roleStorage.load(user.id);
    if (storedData) {
      setRoles(storedData.roles);
      setPermissions(storedData.permissions);
      setInitialized(true);
      setLoading(false);
      return;
    }

    // Nếu chưa có cache và chưa initialized, load từ API
    if (!initialized) {
      loadRolesFromAPI();
    }
  }, [user?.id]);

  const loadRolesFromAPI = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const [userPermissions, allRoles] = await Promise.all([
        phanQuyenService.getPhanQuyenByUserId(parseInt(user.id)),
        phanQuyenService.getAllVaiTro()
      ]);

      const userRoleIds = userPermissions.map(p => p.vai_tro_id);
      const userRoles = allRoles.filter(role => userRoleIds.includes(role.id));

      // Lưu vào cache
      roleStorage.save(user.id, userRoles, userPermissions);

      setRoles(userRoles);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Memoized role checks
  const roleChecks = useMemo(() => {
    const hasRole = (roleName: string): boolean => {
      return roles.some(role => 
        role.ten_vai_tro.toLowerCase().includes(roleName.toLowerCase()) ||
        role.ma_vai_tro.toLowerCase().includes(roleName.toLowerCase())
      );
    };

    const hasPermissionLevel = (level: string): boolean => {
      return permissions.some(permission => permission.cap_do_quyen === level);
    };

    return {
      isNhanVienThu: hasRole('nhân viên thu') || hasRole('nhan_vien_thu'),
      isNhanVienTongHop: hasRole('nhân viên tổng hợp') || hasRole('nhan_vien_tong_hop'),
      isAdmin: hasPermissionLevel('admin') || hasPermissionLevel('super_admin'),
      isSuperAdmin: hasPermissionLevel('super_admin')
    };
  }, [roles, permissions]);

  return {
    ...roleChecks,
    loading,
    initialized
  };
};
