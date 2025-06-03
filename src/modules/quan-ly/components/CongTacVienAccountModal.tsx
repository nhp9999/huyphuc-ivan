import React, { useState } from 'react';
import { X, User, Key, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { VCongTacVienChiTiet } from '../../../shared/services/api/supabaseClient';
import congTacVienAccountService from '../services/congTacVienAccountService';

interface CongTacVienAccountModalProps {
  congTacVien: VCongTacVienChiTiet;
  onClose: () => void;
  onSuccess: () => void;
}

const CongTacVienAccountModal: React.FC<CongTacVienAccountModalProps> = ({ 
  congTacVien, 
  onClose, 
  onSuccess 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const hasAccount = !!congTacVien.nguoi_dung_id;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Không cần kiểm tra email nữa vì hệ thống sử dụng username
    // Chỉ cần kiểm tra mật khẩu
    if (!password || password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await congTacVienAccountService.createAccountForExistingCongTacVien(
        congTacVien.id, 
        password
      );
      onSuccess();
    } catch (err: any) {
      console.error('Error creating account:', err);
      setError(err.message || 'Không thể tạo tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'password') {
      setPassword(value);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Key className="w-5 h-5 mr-2" />
            {hasAccount ? 'Thông tin tài khoản' : 'Tạo tài khoản đăng nhập'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            </div>
          </div>
        )}

        {/* Thông tin cộng tác viên */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {congTacVien.ho_ten}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {congTacVien.ma_ctv}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {congTacVien.email || 'Chưa có email'}
              </div>
            </div>
          </div>
        </div>

        {hasAccount ? (
          /* Hiển thị thông tin tài khoản đã có */
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                  Tài khoản đã được tạo
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Cộng tác viên đã có thể đăng nhập bằng email: {congTacVien.email}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Trạng thái tài khoản: {congTacVien.trang_thai_tai_khoan === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Form tạo tài khoản mới */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Thông tin cộng tác viên */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Tạo tài khoản đăng nhập cho cộng tác viên: <strong>{congTacVien.ho_ten}</strong>
                  <br />
                  Tên đăng nhập sẽ là: <strong>{congTacVien.ma_ctv}</strong>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={congTacVien.ma_ctv || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Cộng tác viên sẽ sử dụng mã này để đăng nhập
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.password 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.confirmPassword 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                <strong>Lưu ý:</strong> Sau khi tạo tài khoản, cộng tác viên sẽ có thể đăng nhập bằng mã cộng tác viên và mật khẩu này để thực hiện kê khai.
                Khi kê khai, hệ thống sẽ tự động sử dụng mã nhân viên của nhân viên thu quản lý.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
            </div>
          </form>
        )}

        {/* Footer cho trường hợp đã có tài khoản */}
        {hasAccount && (
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CongTacVienAccountModal;
