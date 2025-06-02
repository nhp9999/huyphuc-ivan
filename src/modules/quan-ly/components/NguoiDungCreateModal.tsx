import React, { useState, useEffect } from 'react';
import { X, User, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import nguoiDungService, { CreateNguoiDungRequest } from '../services/nguoiDungService';

interface NguoiDungCreateModalProps {
  onClose: () => void;
  onSuccess: (userId?: number) => void;
}

const NguoiDungCreateModal: React.FC<NguoiDungCreateModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateNguoiDungRequest>({
    email: '',
    mat_khau: '',
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: '',
    ngay_sinh: '',
    gioi_tinh: undefined,
    created_by: 'current_user'
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    // Validate required fields
    if (!formData.email.trim()) {
      errors.email = 'Username là bắt buộc';
    } else if (formData.email.trim().length < 3) {
      errors.email = 'Username phải có ít nhất 3 ký tự';
    }

    if (!formData.ho_ten.trim()) {
      errors.ho_ten = 'Họ tên là bắt buộc';
    } else if (formData.ho_ten.length < 2) {
      errors.ho_ten = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.mat_khau) {
      errors.mat_khau = 'Mật khẩu là bắt buộc';
    } else if (formData.mat_khau.length < 6) {
      errors.mat_khau = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.mat_khau !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Validate phone number
    if (formData.so_dien_thoai && formData.so_dien_thoai.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.so_dien_thoai.replace(/\s/g, ''))) {
        errors.so_dien_thoai = 'Số điện thoại không hợp lệ (10-11 số)';
      }
    }

    // Check if username already exists
    if (formData.email.trim()) {
      try {
        const exists = await nguoiDungService.checkEmailExists(formData.email.trim());
        if (exists) {
          errors.email = 'Username đã tồn tại trong hệ thống';
        }
      } catch (err) {
        console.error('Error checking username:', err);
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof CreateNguoiDungRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newUser = await nguoiDungService.createNguoiDung({
        ...formData,
        email: formData.email.trim().toLowerCase(),
        ho_ten: formData.ho_ten.trim(),
        so_dien_thoai: formData.so_dien_thoai?.trim() || undefined,
        dia_chi: formData.dia_chi?.trim() || undefined,
        ngay_sinh: formData.ngay_sinh || undefined,
        gioi_tinh: formData.gioi_tinh || undefined
      });

      onSuccess(newUser.id);
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Không thể tạo người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Thêm người dùng mới
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tạo tài khoản người dùng mới trong hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.email
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập username (có thể là email)"
                maxLength={100}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ho_ten}
                onChange={(e) => handleInputChange('ho_ten', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.ho_ten 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nguyễn Văn A"
                maxLength={100}
              />
              {validationErrors.ho_ten && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.ho_ten}
                </p>
              )}
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.mat_khau}
                  onChange={(e) => handleInputChange('mat_khau', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    validationErrors.mat_khau 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập mật khẩu"
                  maxLength={255}
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
              {validationErrors.mat_khau && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.mat_khau}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors(prev => ({
                        ...prev,
                        confirmPassword: ''
                      }));
                    }
                  }}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    validationErrors.confirmPassword 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập lại mật khẩu"
                  maxLength={255}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.so_dien_thoai}
                onChange={(e) => handleInputChange('so_dien_thoai', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.so_dien_thoai 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0901234567"
                maxLength={20}
              />
              {validationErrors.so_dien_thoai && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.so_dien_thoai}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giới tính
              </label>
              <select
                value={formData.gioi_tinh || ''}
                onChange={(e) => handleInputChange('gioi_tinh', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Chọn giới tính</option>
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
                <option value="khac">Khác</option>
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.ngay_sinh}
                onChange={(e) => handleInputChange('ngay_sinh', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.dia_chi}
                onChange={(e) => handleInputChange('dia_chi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Địa chỉ của người dùng"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Tạo người dùng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NguoiDungCreateModal;
