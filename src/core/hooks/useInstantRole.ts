import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { roleStorage } from '../utils/roleStorage';
import { UserRole, UserPermission } from './useUserRole';
import phanQuyenService from '../../modules/quan-ly/services/phanQuyenService';

interface InstantRoleState {
  isNhanVienThu: boolean;
  isNhanVienTongHop: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  initialized: boolean;
}

export const useInstantRole = (): InstantRoleState => {
  const { user } = useAuth();
  
  // Lazy initialization - chỉ chạy một lần khi component mount
  const [state, setState] = useState<{
    roles: UserRole[];
    permissions: UserPermission[];
    loading: boolean;
    initialized: boolean;
  }>(() => {
    // Hàm này chỉ chạy một lần khi component mount
    if (!user?.id) {
      return {
        roles: [],
        permissions: [],
        loading: false,
        initialized: true
      };
    }

    // Thử load từ localStorage ngay lập tức
    const storedData = roleStorage.load(user.id);
    if (storedData) {
      return {
        roles: storedData.roles,
        permissions: storedData.permissions,
        loading: false,
        initialized: true
      };
    }

    // Nếu không có cache, cần load từ API
    return {
      roles: [],
      permissions: [],
      loading: true,
      initialized: false
    };
  });

  // Effect để load data từ API khi cần
  useEffect(() => {
    if (!user?.id) {
      setState({
        roles: [],
        permissions: [],
        loading: false,
        initialized: true
      });
      return;
    }

    // Nếu đã có data từ cache, không cần load lại
    if (state.initialized) {
      return;
    }

    // Load từ API
    const loadRoles = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        const [userPermissions, allRoles] = await Promise.all([
          phanQuyenService.getPhanQuyenByUserId(parseInt(user.id)),
          phanQuyenService.getAllVaiTro()
        ]);

        const userRoleIds = userPermissions.map(p => p.vai_tro_id);
        const userRoles = allRoles.filter(role => userRoleIds.includes(role.id));

        // Lưu vào cache
        roleStorage.save(user.id, userRoles, userPermissions);

        setState({
          roles: userRoles,
          permissions: userPermissions,
          loading: false,
          initialized: true
        });
      } catch (error) {
        console.error('Error loading roles:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          initialized: true
        }));
      }
    };

    loadRoles();
  }, [user?.id, state.initialized]);

  // Memoized role checks
  const roleChecks = useMemo(() => {
    const hasRole = (roleName: string): boolean => {
      return state.roles.some(role => 
        role.ten_vai_tro.toLowerCase().includes(roleName.toLowerCase()) ||
        role.ma_vai_tro.toLowerCase().includes(roleName.toLowerCase())
      );
    };

    const hasPermissionLevel = (level: string): boolean => {
      return state.permissions.some(permission => permission.cap_do_quyen === level);
    };

    return {
      isNhanVienThu: hasRole('nhân viên thu') || hasRole('nhan_vien_thu'),
      isNhanVienTongHop: hasRole('nhân viên tổng hợp') || hasRole('nhan_vien_tong_hop'),
      isAdmin: hasPermissionLevel('admin') || hasPermissionLevel('super_admin'),
      isSuperAdmin: hasPermissionLevel('super_admin')
    };
  }, [state.roles, state.permissions]);

  return {
    ...roleChecks,
    loading: state.loading,
    initialized: state.initialized
  };
};
