import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Eye,
  EyeOff,
  Mail,
  Building2,
  AlertCircle,
  Shield,
  Phone,
  MapPin,
  Clock,
  Zap,
  Users,
  Award,
  ArrowRight,
  KeyRound
} from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const { login, isLoading } = useAuth();
  const { theme } = useTheme();

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  // Form validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsFormValid(emailRegex.test(email) && password.length >= 6);
  }, [email, password]);

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className={`${theme} h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative h-screen flex">
        {/* Left Panel - Company Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-gentle-glow"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white bg-opacity-5 rounded-full animate-gentle-glow delay-200"></div>
            <div className="absolute top-1/2 right-32 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-gentle-glow delay-100"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-8 py-8 text-white animate-fade-in h-full">
            {/* Company Logo */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white border-opacity-30">
                  <Building2 className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Huy Phuc Company</h1>
                  <p className="text-blue-100 text-lg font-medium">Kê khai BHYT và BHXH tự nguyện</p>
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 leading-tight">Đối tác tin cậy của bạn</h2>
              <p className="text-blue-100 text-base leading-relaxed mb-6 font-light">
                Chuyên cung cấp dịch vụ kê khai bảo hiểm y tế và bảo hiểm xã hội tự nguyện.
                Với đội ngũ chuyên nghiệp và hệ thống hiện đại.
              </p>

              {/* Compact Features Grid */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
                  <div className="w-8 h-8 bg-green-400 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-green-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Tra cứu nhanh chóng</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
                  <div className="w-8 h-8 bg-blue-400 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Hỗ trợ chuyên nghiệp</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
                  <div className="w-8 h-8 bg-purple-400 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Bảo mật tuyệt đối</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 border-t border-white border-opacity-20 pt-4">
              <div className="flex items-center space-x-3 p-2 bg-white bg-opacity-5 rounded-lg">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-300" />
                <span className="text-sm font-medium text-blue-100">Hotline: 1900-xxxx</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-white bg-opacity-5 rounded-lg">
                <MapPin className="h-4 w-4 flex-shrink-0 text-blue-300" />
                <span className="text-sm font-medium text-blue-100">Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-white bg-opacity-5 rounded-lg">
                <Clock className="h-4 w-4 flex-shrink-0 text-blue-300" />
                <span className="text-sm font-medium text-blue-100">8:00 - 17:30 (T2-T6)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 lg:px-8 h-full">
          <div className="max-w-md w-full space-y-6 animate-slide-in-right">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center">
              <div className="flex items-center justify-center space-x-3 mb-6 animate-smooth-scale">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg animate-float">
                  <Building2 className="text-white" size={24} />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Huy Phuc Company
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Kê khai BHYT và BHXH tự nguyện
                  </p>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center animate-fade-in delay-100">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                Đăng nhập hệ thống
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 font-light">
                Chào mừng bạn quay trở lại. Vui lòng đăng nhập để tiếp tục.
              </p>
              <div className="mt-3 flex items-center justify-center space-x-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-gentle-glow"></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-500"></div>
              </div>
            </div>

            {/* Login Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 backdrop-blur-sm animate-smooth-scale delay-200">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3 animate-smooth-scale">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 form-input"
                      placeholder="Nhập địa chỉ email của bạn"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                      className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 form-input ${
                        password && passwordStrength < 50
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                          : password && passwordStrength >= 50 && passwordStrength < 75
                          ? 'border-yellow-300 dark:border-yellow-600 focus:ring-yellow-500 focus:border-yellow-500'
                          : password && passwordStrength >= 75
                          ? 'border-green-300 dark:border-green-600 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                      placeholder="Nhập mật khẩu của bạn"
                      aria-describedby="password-strength"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600 rounded-r-xl transition-all duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div id="password-strength" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              passwordStrength < 50
                                ? 'bg-red-500'
                                : passwordStrength < 75
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength < 50
                            ? 'text-red-600 dark:text-red-400'
                            : passwordStrength < 75
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {passwordStrength < 50 ? 'Yếu' : passwordStrength < 75 ? 'Trung bình' : 'Mạnh'}
                        </span>
                      </div>
                    </div>
                  )}
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
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 btn-primary ${
                    isFormValid && !isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-blue-500/25'
                      : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-smooth-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Đăng nhập hệ thống</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </button>

                {/* Form Validation Hint */}
                {!isFormValid && (email || password) && (
                  <div className="text-center animate-smooth-scale">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Vui lòng nhập email hợp lệ và mật khẩu tối thiểu 6 ký tự
                    </p>
                  </div>
                )}
              </form>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="h-3 w-3" />
                <span>Kết nối được bảo mật bằng SSL</span>
              </div>

              {/* Demo Credentials */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-gentle-glow"></div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                    Thông tin đăng nhập demo
                  </p>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <p><span className="font-medium">Email:</span> admin@example.com</p>
                  <p><span className="font-medium">Mật khẩu:</span> password</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>© 2024 Huy Phuc Company. Tất cả quyền được bảo lưu.</p>
              <p className="mt-1">
                Bằng việc đăng nhập, bạn đồng ý với{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Điều khoản sử dụng</a>
                {' '}và{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Chính sách bảo mật</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
