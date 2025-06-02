import React, { useState, useEffect } from 'react';
import { X, Building2, Save, AlertCircle } from 'lucide-react';
import { DmCongTy } from '../../../shared/services/api/supabaseClient';
import congTyService, { UpdateCongTyRequest } from '../services/congTyService';
import DaiLyManagementSection from './DaiLyManagementSection';

interface CongTyEditModalProps {
  congTy: DmCongTy;
  onClose: () => void;
  onSuccess: () => void;
}

const CongTyEditModal: React.FC<CongTyEditModalProps> = ({ congTy, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateCongTyRequest>({
    id: congTy.id,
    ma_cong_ty: congTy.ma_cong_ty,
    ten_cong_ty: congTy.ten_cong_ty,
    dia_chi: congTy.dia_chi || '',
    so_dien_thoai: congTy.so_dien_thoai || '',
    email: congTy.email || '',
    ma_so_thue: congTy.ma_so_thue || '',
    nguoi_dai_dien: congTy.nguoi_dai_dien || '',
    ghi_chu: congTy.ghi_chu || '',
    updated_by: 'current_user'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [daiLyCount, setDaiLyCount] = useState(0);

  const validateForm = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    // Validate required fields
    if (!formData.ma_cong_ty?.trim()) {
      errors.ma_cong_ty = 'Mã công ty là bắt buộc';
    } else if (formData.ma_cong_ty.length < 3) {
      errors.ma_cong_ty = 'Mã công ty phải có ít nhất 3 ký tự';
    }

    if (!formData.ten_cong_ty?.trim()) {
      errors.ten_cong_ty = 'Tên công ty là bắt buộc';
    } else if (formData.ten_cong_ty.length < 5) {
      errors.ten_cong_ty = 'Tên công ty phải có ít nhất 5 ký tự';
    }

    // Validate email format
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
      }
    }

    // Validate phone number
    if (formData.so_dien_thoai && formData.so_dien_thoai.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.so_dien_thoai.replace(/\s/g, ''))) {
        errors.so_dien_thoai = 'Số điện thoại không hợp lệ (10-11 số)';
      }
    }

    // Check if company code already exists (exclude current company)
    if (formData.ma_cong_ty?.trim() && formData.ma_cong_ty !== congTy.ma_cong_ty) {
      try {
        const exists = await congTyService.checkMaCongTyExists(formData.ma_cong_ty.trim(), congTy.id);
        if (exists) {
          errors.ma_cong_ty = 'Mã công ty đã tồn tại trong hệ thống';
        }
      } catch (err) {
        console.error('Error checking company code:', err);
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof UpdateCongTyRequest, value: string) => {
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
      await congTyService.updateCongTy({
        ...formData,
        ma_cong_ty: formData.ma_cong_ty?.trim().toUpperCase(),
        ten_cong_ty: formData.ten_cong_ty?.trim(),
        email: formData.email?.trim() || undefined,
        so_dien_thoai: formData.so_dien_thoai?.trim() || undefined,
        dia_chi: formData.dia_chi?.trim() || undefined,
        ma_so_thue: formData.ma_so_thue?.trim() || undefined,
        nguoi_dai_dien: formData.nguoi_dai_dien?.trim() || undefined,
        ghi_chu: formData.ghi_chu?.trim() || undefined
      });

      onSuccess();
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Không thể cập nhật công ty. Vui lòng thử lại.');
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
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chỉnh sửa công ty
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cập nhật thông tin công ty và quản lý đại lý ({daiLyCount} đại lý)
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
                Mã công ty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ma_cong_ty || ''}
                onChange={(e) => handleInputChange('ma_cong_ty', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.ma_cong_ty 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="VD: CT001"
                maxLength={50}
              />
              {validationErrors.ma_cong_ty && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.ma_cong_ty}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ten_cong_ty || ''}
                onChange={(e) => handleInputChange('ten_cong_ty', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.ten_cong_ty 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Tên đầy đủ của công ty"
                maxLength={255}
              />
              {validationErrors.ten_cong_ty && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.ten_cong_ty}
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
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.email 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="contact@company.com"
                maxLength={100}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Legal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã số thuế
              </label>
              <input
                type="text"
                value={formData.ma_so_thue || ''}
                onChange={(e) => handleInputChange('ma_so_thue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0123456789"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Người đại diện
              </label>
              <input
                type="text"
                value={formData.nguoi_dai_dien || ''}
                onChange={(e) => handleInputChange('nguoi_dai_dien', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Họ tên người đại diện"
                maxLength={100}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Địa chỉ
            </label>
            <textarea
              value={formData.dia_chi || ''}
              onChange={(e) => handleInputChange('dia_chi', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Địa chỉ đầy đủ của công ty"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.ghi_chu || ''}
              onChange={(e) => handleInputChange('ghi_chu', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Ghi chú thêm về công ty"
            />
          </div>

          {/* Dai Ly Management Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <DaiLyManagementSection
              congTyId={congTy.id}
              onDaiLyCountChange={setDaiLyCount}
            />
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
                  Cập nhật
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CongTyEditModal;

