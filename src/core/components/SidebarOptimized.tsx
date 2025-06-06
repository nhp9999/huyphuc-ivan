import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { roleStorage } from '../utils/roleStorage';
import { UserRole, UserPermission } from '../hooks/useUserRole';
import phanQuyenService from '../../modules/quan-ly/services/phanQuyenService';
import Tooltip from '../../shared/components/ui/Tooltip';
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  Building2,
  FileText,
  History,
  Users,
  CreditCard,
  Shield,
  Hash,
  Store,
  UserCheck,
  Building,
  CheckCircle,
  DollarSign,
  FileX,
  FileCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

interface MenuSection {
  title: string;
  items: Array<{
    icon: React.ReactElement;
    label: string;
    page: string;
  }>;
  hidden?: boolean;
}

const SidebarOptimized: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobile = false, onClose }) => {
  const { currentPage, setCurrentPage } = useNavigation();
  const { user } = useAuth();

  // Khởi tạo state với dữ liệu từ localStorage ngay lập tức
  const [roleState, setRoleState] = useState<{
    roles: UserRole[];
    permissions: UserPermission[];
    initialized: boolean;
    loading: boolean;
  }>(() => {
    // Hàm này chạy synchronous khi component mount
    if (!user?.id) {
      return { roles: [], permissions: [], initialized: true, loading: false };
    }

    const storedData = roleStorage.load(user.id);
    if (storedData) {
      return {
        roles: storedData.roles,
        permissions: storedData.permissions,
        initialized: true,
        loading: false
      };
    }

    return { roles: [], permissions: [], initialized: false, loading: true };
  });

  // Load roles từ API khi cần
  useEffect(() => {
    if (!user?.id || roleState.initialized) return;

    const loadRoles = async () => {
      try {
        const [permissions, allRoles] = await Promise.all([
          phanQuyenService.getPhanQuyenByUserId(parseInt(user.id)),
          phanQuyenService.getAllVaiTro()
        ]);

        const userRoleIds = permissions.map(p => p.vai_tro_id);
        const roles = allRoles.filter(role => userRoleIds.includes(role.id));

        roleStorage.save(user.id, roles, permissions);

        setRoleState({
          roles,
          permissions,
          initialized: true,
          loading: false
        });
      } catch (error) {
        console.error('Error loading roles:', error);
        setRoleState(prev => ({ ...prev, initialized: true, loading: false }));
      }
    };

    loadRoles();
  }, [user?.id, roleState.initialized]);

  // Memoized role checks
  const { isNhanVienThu, isCongTacVien, isAdmin, isSuperAdmin } = useMemo(() => {
    const hasRole = (roleName: string): boolean => {
      return roleState.roles.some(role =>
        role.ten_vai_tro.toLowerCase().includes(roleName.toLowerCase()) ||
        role.ma_vai_tro.toLowerCase().includes(roleName.toLowerCase())
      );
    };

    const hasPermissionLevel = (level: string): boolean => {
      return roleState.permissions.some(permission => permission.cap_do_quyen === level);
    };

    return {
      isNhanVienThu: hasRole('nhân viên thu') || hasRole('nhan_vien_thu'),
      isCongTacVien: hasRole('cộng tác viên') || hasRole('cong_tac_vien'),
      isAdmin: hasPermissionLevel('admin') || hasPermissionLevel('super_admin'),
      isSuperAdmin: hasPermissionLevel('super_admin')
    };
  }, [roleState.roles, roleState.permissions]);

  // Định nghĩa menu cho nhân viên thu
  const nhanVienThuSections = [
    {
      title: 'Kê khai',
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Tổng quan', page: 'dashboard' as const },
        { icon: <FileText size={20} />, label: 'Danh mục kê khai', page: 'declaration-categories' as const },
        { icon: <History size={20} />, label: 'Lịch sử kê khai', page: 'declaration-history' as const },
        { icon: <CreditCard size={20} />, label: 'Thanh toán của tôi', page: 'my-payments' as const }
      ]
    },
    {
      title: 'Doanh thu',
      items: [
        { icon: <DollarSign size={20} />, label: 'Doanh thu & Hoa hồng', page: 'revenue-commission' as const }
      ]
    },
    {
      title: 'Xử lý hồ sơ',
      items: [
        { icon: <FileX size={20} />, label: 'Hồ sơ chưa xử lý', page: 'ho-so-chua-xu-ly' as const },
        { icon: <FileCheck size={20} />, label: 'Hồ sơ đã xử lý', page: 'ho-so-da-xu-ly' as const }
      ]
    },
    {
      title: 'Quản lý',
      items: [
        { icon: <UserCheck size={20} />, label: 'Cộng tác viên của tôi', page: 'my-cong-tac-vien' as const }
      ]
    },
    {
      title: 'Tra cứu',
      items: [
        { icon: <CreditCard size={20} />, label: 'Tra cứu BHYT', page: 'bhyt-lookup' as const },
        { icon: <Shield size={20} />, label: 'Tra cứu BHXH', page: 'bhxh-lookup' as const },
        { icon: <Hash size={20} />, label: 'Tra cứu mã BHXH', page: 'bhxh-id-lookup' as const },
        { icon: <Users size={20} />, label: 'Tra cứu hộ gia đình', page: 'family-lookup' as const }
      ],
      hidden: true // Ẩn section tra cứu cho nhân viên thu
    },
    {
      title: 'Cài đặt',
      items: [
        { icon: <Settings size={20} />, label: 'Cài đặt', page: 'settings' as const }
      ]
    }
  ];

  // Định nghĩa menu cho cộng tác viên (tương tự nhân viên thu)
  const congTacVienSections = [
    {
      title: 'Kê khai',
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Tổng quan', page: 'dashboard' as const },
        { icon: <FileText size={20} />, label: 'Danh mục kê khai', page: 'declaration-categories' as const },
        { icon: <History size={20} />, label: 'Lịch sử kê khai', page: 'declaration-history' as const },
        { icon: <CreditCard size={20} />, label: 'Thanh toán của tôi', page: 'my-payments' as const }
      ]
    },
    {
      title: 'Doanh thu',
      items: [
        { icon: <DollarSign size={20} />, label: 'Doanh thu & Hoa hồng', page: 'revenue-commission' as const }
      ]
    },
    {
      title: 'Xử lý hồ sơ',
      items: [
        { icon: <FileX size={20} />, label: 'Hồ sơ chưa xử lý', page: 'ho-so-chua-xu-ly' as const },
        { icon: <FileCheck size={20} />, label: 'Hồ sơ đã xử lý', page: 'ho-so-da-xu-ly' as const }
      ]
    },
    {
      title: 'Tra cứu',
      items: [
        { icon: <CreditCard size={20} />, label: 'Tra cứu BHYT', page: 'bhyt-lookup' as const },
        { icon: <Shield size={20} />, label: 'Tra cứu BHXH', page: 'bhxh-lookup' as const },
        { icon: <Hash size={20} />, label: 'Tra cứu mã BHXH', page: 'bhxh-id-lookup' as const },
        { icon: <Users size={20} />, label: 'Tra cứu hộ gia đình', page: 'family-lookup' as const }
      ]
    },
    {
      title: 'Cài đặt',
      items: [
        { icon: <Settings size={20} />, label: 'Cài đặt', page: 'settings' as const }
      ]
    }
  ];

  // Menu đầy đủ cho các vai trò khác
  const fullNavSections = [
    {
      title: 'Tổng quan',
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', page: 'dashboard' as const }
      ]
    },
    {
      title: 'Tra cứu',
      items: [
        { icon: <CreditCard size={20} />, label: 'Tra cứu BHYT', page: 'bhyt-lookup' as const },
        { icon: <Shield size={20} />, label: 'Tra cứu BHXH', page: 'bhxh-lookup' as const },
        { icon: <Hash size={20} />, label: 'Tra cứu mã BHXH', page: 'bhxh-id-lookup' as const },
        { icon: <Users size={20} />, label: 'Tra cứu hộ gia đình', page: 'family-lookup' as const }
      ]
    },
    {
      title: 'Kê khai',
      items: [
        { icon: <FileText size={20} />, label: 'Danh mục kê khai', page: 'declaration-categories' as const },
        { icon: <CheckCircle size={20} />, label: 'Kê khai 603', page: 'ke-khai-603' as const },
        { icon: <History size={20} />, label: 'Lịch sử kê khai', page: 'declaration-history' as const },
        { icon: <FileText size={20} />, label: 'Quản lý kê khai', page: 'ke-khai-management' as const }
      ]
    },
    {
      title: 'Xử lý hồ sơ',
      items: [
        { icon: <FileX size={20} />, label: 'Hồ sơ chưa xử lý', page: 'ho-so-chua-xu-ly' as const },
        { icon: <FileCheck size={20} />, label: 'Hồ sơ đã xử lý', page: 'ho-so-da-xu-ly' as const }
      ]
    },
    {
      title: 'Thanh toán',
      items: [
        { icon: <CreditCard size={20} />, label: 'Thanh toán của tôi', page: 'my-payments' as const },
        { icon: <DollarSign size={20} />, label: 'Quản lý thanh toán', page: 'payment-management' as const }
      ]
    },
    {
      title: 'Quản lý đơn vị',
      items: [
        { icon: <Building size={20} />, label: 'Quản lý đơn vị', page: 'don-vi-management' as const },
        { icon: <Store size={20} />, label: 'Quản lý đại lý', page: 'dai-ly-management' as const },
        { icon: <UserCheck size={20} />, label: 'Liên kết đại lý - đơn vị', page: 'dai-ly-don-vi-link' as const }
      ]
    },
    {
      title: 'Hệ thống Multi-Company',
      items: [
        { icon: <Building2 size={20} />, label: 'Quản lý công ty', page: 'cong-ty-management' as const },
        { icon: <Building size={20} />, label: 'Quản lý cơ quan BHXH', page: 'co-quan-bhxh-management' as const },
        { icon: <Users size={20} />, label: 'Quản lý người dùng', page: 'nguoi-dung-management' as const },
        { icon: <UserCheck size={20} />, label: 'Quản lý cộng tác viên', page: 'cong-tac-vien-management' as const },
        { icon: <Shield size={20} />, label: 'Phân quyền hệ thống', page: 'phan-quyen-management' as const }
      ]
    },
    {
      title: 'Hệ thống',
      items: [
        { icon: <Settings size={20} />, label: 'Cài đặt', page: 'settings' as const }
      ]
    }
  ];

  // Chọn menu dựa trên role
  const navSections = useMemo(() => {
    if (!roleState.initialized) {
      return []; // Không hiển thị menu khi chưa initialized
    }

    // Cộng tác viên có menu tương tự nhân viên thu
    if (isCongTacVien && !isAdmin && !isSuperAdmin) {
      return congTacVienSections;
    }

    if (isNhanVienThu && !isAdmin && !isSuperAdmin) {
      return nhanVienThuSections;
    }

    return fullNavSections;
  }, [roleState.initialized, isNhanVienThu, isCongTacVien, isAdmin, isSuperAdmin]);

  // Skeleton loading component
  const MenuSkeleton = () => (
    <div className="px-3 space-y-6">
      {[1, 2, 3].map((section) => (
        <div key={section}>
          {isOpen && (
            <div className="px-3 mb-3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          )}
          <ul className="space-y-1">
            {[1, 2, 3].map((item) => (
              <li key={item}>
                <div className={`w-full flex items-center px-3 py-3 rounded-xl ${isOpen ? 'space-x-3' : 'justify-center'}`}>
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  {isOpen && <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  // Handle swipe gestures on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const diff = startX - currentX;

      // If swiping left more than 50px, close sidebar
      if (diff > 50 && isOpen) {
        onClose?.();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <aside
      className={`
        ${isMobile
          ? `fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            } w-72`
          : `${isOpen ? 'w-72' : 'w-20'} transition-all duration-300 ease-in-out`
        }
        bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800
        border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg
      `}
      onTouchStart={handleTouchStart}
    >
      {/* Header với Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">Huy Phuc Company</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kê khai BHYT và BHXH TN</p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="text-white" size={20} />
            </div>
          </div>
        )}
        <button
          className="sidebar-toggle-btn p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isOpen}
        >
          <ChevronLeft
            size={18}
            className={`text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {!roleState.initialized ? (
          <MenuSkeleton />
        ) : (
          <div className="px-3 space-y-6">
            {navSections.filter(section => !(section as any).hidden).map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {isOpen && (
                  <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Tooltip content={item.label} disabled={isOpen}>
                        <button
                          onClick={() => {
                            setCurrentPage(item.page);
                            // Close sidebar on mobile after navigation
                            if (isMobile) {
                              onClose?.();
                            }
                          }}
                          className={`
                            sidebar-nav-item group w-full flex items-center justify-between rounded-xl transition-all duration-200 text-left relative
                            ${isMobile ? 'px-4 py-4' : 'px-3 py-3'}
                            ${currentPage === item.page
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                              : 'hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-[1.02]'}
                          `}
                          aria-current={currentPage === item.page ? 'page' : undefined}
                        >
                          <div className="flex items-center">
                            <span className={`flex-shrink-0 ${currentPage === item.page ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                              {item.icon}
                            </span>
                            {isOpen && (
                              <span className="ml-3 whitespace-nowrap font-medium">
                                {item.label}
                              </span>
                            )}
                          </div>
                        </button>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
                {sectionIndex < navSections.filter(section => !(section as any).hidden).length - 1 && isOpen && (
                  <div className="mt-4 mx-3 border-t border-gray-200 dark:border-gray-700"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default SidebarOptimized;
