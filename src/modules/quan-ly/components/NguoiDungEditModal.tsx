import React, { useState, useEffect } from 'react';
import { X, User, Save, AlertCircle, Eye, EyeOff, UserCheck, Plus, Trash2, Building, Shield, Users } from 'lucide-react';
import { DmNguoiDung, PhanQuyenNguoiDung, DmVaiTro, DmCongTy, DmCoQuanBhxh } from '../../../shared/services/api/supabaseClient';
import nguoiDungService, { UpdateNguoiDungRequest } from '../services/nguoiDungService';
import phanQuyenService, { CreatePhanQuyenRequest } from '../services/phanQuyenService';
import congTyService from '../services/congTyService';
import coQuanBhxhService from '../services/coQuanBhxhService';

interface NguoiDungEditModalProps {
  nguoiDung: DmNguoiDung;
  onClose: () => void;
  onSuccess: () => void;
}

const NguoiDungEditModal: React.FC<NguoiDungEditModalProps> = ({ nguoiDung, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateNguoiDungRequest>({
    id: nguoiDung.id,
    email: nguoiDung.email,
    ho_ten: nguoiDung.ho_ten,
    so_dien_thoai: nguoiDung.so_dien_thoai || '',
    dia_chi: nguoiDung.dia_chi || '',
    ngay_sinh: nguoiDung.ngay_sinh || '',
    gioi_tinh: nguoiDung.gioi_tinh || undefined,
    updated_by: 'current_user'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tab system
  const [activeTab, setActiveTab] = useState<'info' | 'permissions'>('info');

  // Permission management
  const [userPermissions, setUserPermissions] = useState<PhanQuyenNguoiDung[]>([]);
  const [showAddPermission, setShowAddPermission] = useState(false);
  const [permissionFormData, setPermissionFormData] = useState<CreatePhanQuyenRequest>({
    nguoi_dung_id: nguoiDung.id,
    vai_tro_id: 0,
    loai_to_chuc: 'cong_ty',
    cap_do_quyen: 'user',
    created_by: 'current_user'
  });
  const [vaiTroList, setVaiTroList] = useState<DmVaiTro[]>([]);
  const [congTyList, setCongTyList] = useState<DmCongTy[]>([]);
  const [coQuanList, setCoQuanList] = useState<DmCoQuanBhxh[]>([]);
  const [permissionLoading, setPermissionLoading] = useState(false);

  // Load permissions and initial data
  useEffect(() => {
    loadUserPermissions();
    loadInitialData();
  }, [nguoiDung.id]);

  const loadUserPermissions = async () => {
    try {
      const permissions = await phanQuyenService.getPhanQuyenByUserId(nguoiDung.id);
      setUserPermissions(permissions);
    } catch (err) {
      console.error('Error loading user permissions:', err);
    }
  };

  const loadInitialData = async () => {
    try {
      const [vaiTroData, congTyData, coQuanData] = await Promise.all([
        phanQuyenService.getAllVaiTro(),
        congTyService.getAllCongTy(),
        coQuanBhxhService.getAllCoQuanBhxh()
      ]);

      setVaiTroList(vaiTroData);
      setCongTyList(congTyData);
      setCoQuanList(coQuanData);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  // Validation function
  const validateForm = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    // Username validation
    if (!formData.email?.trim()) {
      errors.email = 'Username là bắt buộc';
    } else if (formData.email.trim().length < 3) {
      errors.email = 'Username phải có ít nhất 3 ký tự';
    }

    // Name validation
    if (!formData.ho_ten?.trim()) {
      errors.ho_ten = 'Họ và tên là bắt buộc';
    } else if (formData.ho_ten.trim().length < 2) {
      errors.ho_ten = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // Phone validation
    if (formData.so_dien_thoai?.trim() && !/^[0-9+\-\s()]+$/.test(formData.so_dien_thoai.trim())) {
      errors.so_dien_thoai = 'Số điện thoại không hợp lệ';
    }

    // Password validation (only if changing password)
    if (changePassword) {
      if (!newPassword) {
        errors.newPassword = 'Mật khẩu mới là bắt buộc';
      } else if (newPassword.length < 6) {
        errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Xác nhận mật khẩu không khớp';
      }
    }

    // Check if username already exists (exclude current user)
    if (formData.email?.trim() && formData.email !== nguoiDung.email) {
      try {
        const exists = await nguoiDungService.checkEmailExists(formData.email.trim(), nguoiDung.id);
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

  const handleInputChange = (field: keyof UpdateNguoiDungRequest, value: string) => {
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
      const updateData: UpdateNguoiDungRequest = {
        ...formData,
        email: formData.email?.trim().toLowerCase(),
        ho_ten: formData.ho_ten?.trim(),
        so_dien_thoai: formData.so_dien_thoai?.trim() || undefined,
        dia_chi: formData.dia_chi?.trim() || undefined,
        ngay_sinh: formData.ngay_sinh || undefined,
        gioi_tinh: formData.gioi_tinh || undefined
      };

      // Add password if changing
      if (changePassword && newPassword) {
        updateData.mat_khau = newPassword;
      }

      await nguoiDungService.updateNguoiDung(updateData);
      onSuccess();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Không thể cập nhật người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Permission management functions
  const handleAddPermission = async () => {
    if (!permissionFormData.vai_tro_id) {
      setError('Vui lòng chọn vai trò');
      return;
    }

    if (permissionFormData.loai_to_chuc === 'cong_ty' && !permissionFormData.cong_ty_id) {
      setError('Vui lòng chọn công ty');
      return;
    }

    if (permissionFormData.loai_to_chuc === 'co_quan_bhxh' && !permissionFormData.co_quan_bhxh_id) {
      setError('Vui lòng chọn cơ quan BHXH');
      return;
    }

    setPermissionLoading(true);
    try {
      await phanQuyenService.createPhanQuyen(permissionFormData);
      await loadUserPermissions();
      setShowAddPermission(false);
      setPermissionFormData({
        nguoi_dung_id: nguoiDung.id,
        vai_tro_id: 0,
        loai_to_chuc: 'cong_ty',
        cap_do_quyen: 'user',
        created_by: 'current_user'
      });
      setError(null);
    } catch (err) {
      console.error('Error adding permission:', err);
      setError('Không thể thêm phân quyền. Vui lòng thử lại.');
    } finally {
      setPermissionLoading(false);
    }
  };

  const handleDeletePermission = async (permissionId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phân quyền này?')) {
      return;
    }

    setPermissionLoading(true);
    try {
      await phanQuyenService.deletePhanQuyen(permissionId, 'current_user');
      await loadUserPermissions();
    } catch (err) {
      console.error('Error deleting permission:', err);
      setError('Không thể xóa phân quyền. Vui lòng thử lại.');
    } finally {
      setPermissionLoading(false);
    }
  };

  const getOrganizationIcon = (type: string) => {
    switch (type) {
      case 'cong_ty':
        return <Building className="w-4 h-4 text-blue-600" />;
      case 'co_quan_bhxh':
        return <Shield className="w-4 h-4 text-green-600" />;
      case 'he_thong':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <Building className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPermissionLevelBadge = (level: string) => {
    switch (level) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Admin
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            User
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Không xác định
          </span>
        );
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
                Chỉnh sửa người dùng
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cập nhật thông tin: {nguoiDung.ho_ten}
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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin cơ bản
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Phân quyền ({userPermissions.length})
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'info' && (
            <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.email || ''}
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
                value={formData.ho_ten || ''}
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

          {/* Password Change Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="changePassword"
                checked={changePassword}
                onChange={(e) => {
                  setChangePassword(e.target.checked);
                  if (!e.target.checked) {
                    setNewPassword('');
                    setConfirmPassword('');
                    setValidationErrors(prev => {
                      const { newPassword, confirmPassword, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="changePassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Thay đổi mật khẩu
              </label>
            </div>

            {changePassword && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (validationErrors.newPassword) {
                          setValidationErrors(prev => ({ ...prev, newPassword: '' }));
                        }
                      }}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        validationErrors.newPassword 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Nhập mật khẩu mới"
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.newPassword}
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
                          setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        validationErrors.confirmPassword 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Xác nhận mật khẩu mới"
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.so_dien_thoai || ''}
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
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.ngay_sinh || ''}
                onChange={(e) => handleInputChange('ngay_sinh', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa chỉ
              </label>
              <textarea
                value={formData.dia_chi || ''}
                onChange={(e) => handleInputChange('dia_chi', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập địa chỉ"
                maxLength={500}
              />
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
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Cập nhật thông tin
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              {/* Add Permission Section */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Quản lý phân quyền
                  </h3>
                  <button
                    onClick={() => setShowAddPermission(!showAddPermission)}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm phân quyền
                  </button>
                </div>

                {showAddPermission && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Organization Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Loại tổ chức
                        </label>
                        <select
                          value={permissionFormData.loai_to_chuc}
                          onChange={(e) => setPermissionFormData(prev => ({ ...prev, loai_to_chuc: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="cong_ty">Công ty</option>
                          <option value="co_quan_bhxh">Cơ quan BHXH</option>
                          <option value="he_thong">Hệ thống</option>
                        </select>
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Vai trò
                        </label>
                        <select
                          value={permissionFormData.vai_tro_id}
                          onChange={(e) => setPermissionFormData(prev => ({ ...prev, vai_tro_id: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Chọn vai trò</option>
                          {vaiTroList.map(vaiTro => (
                            <option key={vaiTro.id} value={vaiTro.id}>
                              {vaiTro.ten_vai_tro}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Organization Selection */}
                      {permissionFormData.loai_to_chuc === 'cong_ty' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Công ty
                          </label>
                          <select
                            value={permissionFormData.cong_ty_id || ''}
                            onChange={(e) => setPermissionFormData(prev => ({ ...prev, cong_ty_id: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="">Chọn công ty</option>
                            {congTyList.map(congTy => (
                              <option key={congTy.id} value={congTy.id}>
                                {congTy.ten_cong_ty}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {permissionFormData.loai_to_chuc === 'co_quan_bhxh' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cơ quan BHXH
                          </label>
                          <select
                            value={permissionFormData.co_quan_bhxh_id || ''}
                            onChange={(e) => setPermissionFormData(prev => ({ ...prev, co_quan_bhxh_id: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="">Chọn cơ quan BHXH</option>
                            {coQuanList.map(coQuan => (
                              <option key={coQuan.id} value={coQuan.id}>
                                {coQuan.ten_co_quan}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Permission Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cấp độ quyền
                        </label>
                        <select
                          value={permissionFormData.cap_do_quyen}
                          onChange={(e) => setPermissionFormData(prev => ({ ...prev, cap_do_quyen: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddPermission(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleAddPermission}
                        disabled={permissionLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        {permissionLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang thêm...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Thêm phân quyền
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Permissions List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Phân quyền hiện tại ({userPermissions.length})
                </h3>

                {userPermissions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Chưa có phân quyền</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Người dùng này chưa được cấp phân quyền nào.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {getOrganizationIcon(permission.loai_to_chuc)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {permission.loai_to_chuc === 'cong_ty' ? 'Công ty' :
                                 permission.loai_to_chuc === 'co_quan_bhxh' ? 'Cơ quan BHXH' : 'Hệ thống'}
                              </span>
                              {getPermissionLevelBadge(permission.cap_do_quyen)}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Vai trò: {permission.vai_tro_id} • Trạng thái: {permission.trang_thai}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePermission(permission.id)}
                          disabled={permissionLoading}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Xóa phân quyền"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button for Permissions Tab */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NguoiDungEditModal;

