import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../../../core/contexts/ThemeContext';
import {
  Eye,
  EyeOff,
  User,
  Building2,
  AlertCircle,
  Shield,
  KeyRound,
  ArrowRight
} from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { login, isLoading, loginError } = useAuth();
  const { theme } = useTheme();

  // Form validation
  useEffect(() => {
    setIsFormValid(username.trim().length >= 3 && password.length >= 6);
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    const success = await login(username, password);
    if (!success && loginError) {
      setError(loginError);
    }
  };

  return (
    <div className={`${theme} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8`}>
      <div className="max-w-4xl w-full mx-auto p-4">
        <div className="flex flex-col lg:flex-row shadow-xl rounded-xl overflow-hidden">
          {/* Left Panel - Brand */}
          <div className="lg:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white hidden lg:block">
            <div className="h-full flex flex-col">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Building2 className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Huy Phuc Company</h1>
                  <p className="text-blue-100 text-sm">Kê khai BHYT và BHXH tự nguyện</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-grow flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-4">Đối tác tin cậy của bạn</h2>
                <p className="text-blue-100 mb-6">
                  Chuyên cung cấp dịch vụ kê khai bảo hiểm y tế và bảo hiểm xã hội tự nguyện.
                </p>
                
                {/* Features */}
                <div className="space-y-3">
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                    <p className="font-medium">Tra cứu nhanh chóng</p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                    <p className="font-medium">Hỗ trợ chuyên nghiệp</p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                    <p className="font-medium">Bảo mật tuyệt đối</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Login Form */}
          <div className="lg:w-7/12 bg-white dark:bg-gray-800 p-8">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center mb-6 lg:hidden">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Huy Phuc Company
                </h1>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Đăng nhập hệ thống
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Vui lòng đăng nhập để tiếp tục
              </p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors ${
                  isFormValid && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  'Đang xử lý...'
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                Tài khoản demo:
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                <p><span className="font-medium">Admin:</span> superadmin@system.vn / password123</p>
                <p><span className="font-medium">Nhân viên:</span> thu1@abc.com / password123</p>
              </div>
            </div>
            
            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3 w-3 mr-1" />
              <span>Kết nối được bảo mật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
