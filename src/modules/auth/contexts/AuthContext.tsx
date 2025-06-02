import React, { createContext, useContext, useState, useEffect } from 'react';
import nguoiDungService, { UserOrganization } from '../../quan-ly/services/nguoiDungService';

interface User {
  id: string;
  email: string;
  name: string;
  organizations?: UserOrganization[];
  currentOrganization?: UserOrganization;
  roles?: string[]; // Thêm thông tin vai trò
  permissions?: string[]; // Thêm thông tin quyền
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  setCurrentOrganization: (org: UserOrganization) => void;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra localStorage để xem có user đã đăng nhập không
    const savedUser = localStorage.getItem('user');
    const savedOrganization = localStorage.getItem('currentOrganization');

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        let currentOrganization = null;

        if (savedOrganization) {
          try {
            currentOrganization = JSON.parse(savedOrganization);
          } catch (error) {
            localStorage.removeItem('currentOrganization');
          }
        }

        setUser({ ...userData, currentOrganization });
        // Load organizations for the user
        loadUserOrganizations(userData.id);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('currentOrganization');
      }
    }
    setIsLoading(false);
  }, []);

  const loadUserOrganizations = async (userId: string) => {
    try {
      const organizations = await nguoiDungService.getUserOrganizations(parseInt(userId));
      setUser(prev => {
        if (!prev) return null;

        const updatedUser = { ...prev, organizations };

        // Auto-select first organization if user has only one and no current organization
        if (organizations.length === 1 && !prev.currentOrganization) {
          updatedUser.currentOrganization = organizations[0];
          localStorage.setItem('currentOrganization', JSON.stringify(organizations[0]));
        }

        return updatedUser;
      });
    } catch (error) {
      console.error('Error loading user organizations:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Gọi service để đăng nhập (sử dụng username như email)
      const loginResult = await nguoiDungService.login(username, password);

      if (loginResult) {
        const userData: User = {
          id: loginResult.id.toString(),
          email: loginResult.email,
          name: loginResult.ho_ten
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Load organizations for the user
        await loadUserOrganizations(userData.id);

        setIsLoading(false);
        return true;
      } else {
        setLoginError('Tên đăng nhập hoặc mật khẩu không đúng');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      setIsLoading(false);
      return false;
    }
  };

  const setCurrentOrganization = (org: UserOrganization) => {
    setUser(prev => prev ? { ...prev, currentOrganization: org } : null);
    localStorage.setItem('currentOrganization', JSON.stringify(org));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentOrganization');
    setLoginError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    setCurrentOrganization,
    loginError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
