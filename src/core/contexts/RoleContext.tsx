import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import phanQuyenService from '../../modules/quan-ly/services/phanQuyenService';
import { UserRole, UserPermission } from '../hooks/useUserRole';
import { roleStorage } from '../utils/roleStorage';

interface RoleContextType {
  userRoles: UserRole[];
  userPermissions: UserPermission[];
  loading: boolean;
  error: string | null;
  isNhanVienThu: boolean;
  isNhanVienTongHop: boolean;
  isCongTacVien: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  refreshRoles: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Cache global cho roles
const globalRoleCache = new Map<string, {
  roles: UserRole[];
  permissions: UserPermission[];
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Kiểm tra cache
  const getCachedData = (userId: string) => {
    const cached = globalRoleCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    return null;
  };

  // Lưu vào cache
  const setCachedData = (userId: string, roles: UserRole[], permissions: UserPermission[]) => {
    globalRoleCache.set(userId, {
      roles,
      permissions,
      timestamp: Date.now()
    });
  };

  const loadUserRoleAndPermissions = async () => {
    if (!user?.id) {
      setUserRoles([]);
      setUserPermissions([]);
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      // Kiểm tra localStorage trước (synchronous)
      const storedData = roleStorage.load(user.id);
      if (storedData) {
        setUserRoles(storedData.roles);
        setUserPermissions(storedData.permissions);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Kiểm tra memory cache
      const cachedData = getCachedData(user.id);
      if (cachedData) {
        setUserRoles(cachedData.roles);
        setUserPermissions(cachedData.permissions);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Chỉ set loading = true khi thực sự cần gọi API
      if (!initialized) {
        setLoading(true);
      }
      setError(null);

      // Gọi API song song để tăng tốc
      const [permissions, allRoles] = await Promise.all([
        phanQuyenService.getPhanQuyenByUserId(parseInt(user.id)),
        phanQuyenService.getAllVaiTro()
      ]);

      const userRoleIds = permissions.map(p => p.vai_tro_id);
      const roles = allRoles.filter(role => userRoleIds.includes(role.id));

      // Lưu vào cả memory cache và localStorage
      setCachedData(user.id, roles, permissions);
      roleStorage.save(user.id, roles, permissions);

      setUserPermissions(permissions);
      setUserRoles(roles);

    } catch (err) {
      console.error('Error loading user role and permissions:', err);
      setError('Không thể tải thông tin vai trò người dùng');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Khởi tạo synchronous từ localStorage khi component mount
  useEffect(() => {
    if (user?.id) {
      // Thử load từ localStorage ngay lập tức (synchronous)
      const storedData = roleStorage.load(user.id);
      if (storedData) {
        setUserRoles(storedData.roles);
        setUserPermissions(storedData.permissions);
        setLoading(false);
        setInitialized(true);
        return;
      }
    }

    // Nếu không có cache, mới gọi async function
    loadUserRoleAndPermissions();
  }, [user?.id]);

  // Computed values
  const hasRole = (roleName: string): boolean => {
    return userRoles.some(role => 
      role.ten_vai_tro.toLowerCase().includes(roleName.toLowerCase()) ||
      role.ma_vai_tro.toLowerCase().includes(roleName.toLowerCase())
    );
  };

  const hasPermissionLevel = (level: string): boolean => {
    return userPermissions.some(permission => permission.cap_do_quyen === level);
  };

  const isNhanVienThu = hasRole('nhân viên thu') || hasRole('nhan_vien_thu');
  const isNhanVienTongHop = hasRole('nhân viên tổng hợp') || hasRole('nhan_vien_tong_hop');
  const isCongTacVien = hasRole('cộng tác viên') || hasRole('cong_tac_vien');
  const isAdmin = hasPermissionLevel('admin') || hasPermissionLevel('super_admin');
  const isSuperAdmin = hasPermissionLevel('super_admin');

  const refreshRoles = async () => {
    if (user?.id) {
      // Xóa cache cũ
      globalRoleCache.delete(user.id);
      await loadUserRoleAndPermissions();
    }
  };

  const value: RoleContextType = {
    userRoles,
    userPermissions,
    loading,
    error,
    isNhanVienThu,
    isNhanVienTongHop,
    isCongTacVien,
    isAdmin,
    isSuperAdmin,
    refreshRoles
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
