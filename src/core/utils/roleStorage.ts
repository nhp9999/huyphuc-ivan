import { UserRole, UserPermission } from '../hooks/useUserRole';

interface StoredRoleData {
  roles: UserRole[];
  permissions: UserPermission[];
  timestamp: number;
  userId: string;
}

const STORAGE_KEY = 'user_roles_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export const roleStorage = {
  // Lưu roles vào localStorage
  save: (userId: string, roles: UserRole[], permissions: UserPermission[]) => {
    try {
      const data: StoredRoleData = {
        roles,
        permissions,
        timestamp: Date.now(),
        userId
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save roles to localStorage:', error);
    }
  },

  // Lấy roles từ localStorage
  load: (userId: string): { roles: UserRole[], permissions: UserPermission[] } | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data: StoredRoleData = JSON.parse(stored);
      
      // Kiểm tra userId và thời gian hết hạn
      if (data.userId !== userId || Date.now() - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return {
        roles: data.roles,
        permissions: data.permissions
      };
    } catch (error) {
      console.warn('Failed to load roles from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  // Xóa cache
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear roles cache:', error);
    }
  },

  // Kiểm tra cache có hợp lệ không
  isValid: (userId: string): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;

      const data: StoredRoleData = JSON.parse(stored);
      return data.userId === userId && Date.now() - data.timestamp < CACHE_DURATION;
    } catch (error) {
      return false;
    }
  }
};

// Hook để sử dụng roleStorage với React
export const useRoleStorage = () => {
  return roleStorage;
};
