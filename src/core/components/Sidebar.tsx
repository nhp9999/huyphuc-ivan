import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
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
  CheckCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { currentPage, setCurrentPage } = useNavigation();

  const navSections = [
    {
      title: 'Tổng quan',
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Tổng quan', page: 'dashboard' as const, badge: null },
      ]
    },
    {
      title: 'Kê khai',
      items: [
        { icon: <FileText size={20} />, label: 'Danh mục kê khai', page: 'declaration-categories' as const, badge: null },
        { icon: <History size={20} />, label: 'Lịch sử kê khai', page: 'declaration-history' as const, badge: null },
        { icon: <CheckCircle size={20} />, label: 'Quản lý kê khai', page: 'ke-khai-management' as const, badge: null },
        { icon: <CreditCard size={20} />, label: 'Thanh toán của tôi', page: 'my-payments' as const, badge: 'New' },
      ]
    },
    {
      title: 'Tra cứu',
      items: [
        { icon: <CreditCard size={20} />, label: 'Tra cứu thông tin BHYT', page: 'bhyt-lookup' as const, badge: null },
        { icon: <Shield size={20} />, label: 'Tra cứu thông tin BHXH', page: 'bhxh-lookup' as const, badge: null },
        { icon: <Hash size={20} />, label: 'Tra cứu mã số BHXH', page: 'bhxh-id-lookup' as const, badge: null },
        { icon: <Users size={20} />, label: 'Tra cứu hộ gia đình', page: 'family-lookup' as const, badge: null },
      ]
    },
    {
      title: 'Quản lý',
      items: [
        { icon: <Building2 size={20} />, label: 'Quản lý đơn vị', page: 'don-vi-management' as const, badge: null },
        { icon: <Store size={20} />, label: 'Quản lý đại lý', page: 'dai-ly-management' as const, badge: null },
        { icon: <Hash size={20} />, label: 'Liên kết Đại lý-Đơn vị', page: 'dai-ly-don-vi-link' as const, badge: null },
      ]
    },
    {
      title: 'Hệ thống Multi-Company',
      items: [
        { icon: <Building size={20} />, label: 'Quản lý công ty', page: 'cong-ty-management' as const, badge: null },
        { icon: <Shield size={20} />, label: 'Quản lý cơ quan BHXH', page: 'co-quan-bhxh-management' as const, badge: null },
        { icon: <Users size={20} />, label: 'Quản lý người dùng', page: 'nguoi-dung-management' as const, badge: null },
        { icon: <UserCheck size={20} />, label: 'Phân quyền hệ thống', page: 'phan-quyen-management' as const, badge: null },
      ]
    },
    {
      title: 'Hệ thống',
      items: [
        { icon: <Settings size={20} />, label: 'Cài đặt', page: 'settings' as const, badge: null },
      ]
    }
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-72' : 'w-20'
      } transition-all duration-300 ease-in-out bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg`}
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
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
          onClick={toggleSidebar}
        >
          <ChevronLeft
            size={18}
            className={`text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-3 space-y-6">
          {navSections.map((section, sectionIndex) => (
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
                        onClick={() => setCurrentPage(item.page)}
                        className={`
                          group w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 text-left relative
                          ${currentPage === item.page
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-[1.02]'}
                        `}
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
                        {isOpen && item.badge && (
                          <span className={`
                            px-2 py-1 text-xs font-semibold rounded-full
                            ${item.badge === 'New'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}
                          `}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </Tooltip>
                  </li>
                ))}
              </ul>
              {sectionIndex < navSections.length - 1 && isOpen && (
                <div className="mt-4 mx-3 border-t border-gray-200 dark:border-gray-700"></div>
              )}
            </div>
          ))}
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;