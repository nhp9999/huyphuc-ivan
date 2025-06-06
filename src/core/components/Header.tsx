import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import {
  Bell,
  Search,
  Menu,
  Sun,
  Moon,
  MessageSquare,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { setCurrentPage } = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSettingsClick = () => {
    setCurrentPage('settings');
    setShowUserMenu(false);
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
      <div className="flex items-center lg:hidden">
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          onClick={toggleSidebar}
          aria-label={isMobile ? "Toggle mobile menu" : "Toggle sidebar"}
        >
          <Menu size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} className="text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <MessageSquare size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon size={20} className="text-gray-500" />
          )}
        </button>
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <div className="py-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User size={16} className="mr-3" />
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={16} className="mr-3" />
                  Cài đặt
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={logout}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} className="mr-3" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNotifications && (
        <div className="absolute top-16 right-4 w-80 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Mark all as read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">UN</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      User {item} sent you a message
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item} hour{item !== 1 ? 's' : ''} ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 text-center">
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all notifications
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;