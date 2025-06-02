import React, { useState, useEffect } from 'react';
import { X, UserCheck, Save, AlertCircle, Building, Shield, Users } from 'lucide-react';
import phanQuyenService, { CreatePhanQuyenRequest } from '../services/phanQuyenService';
import congTyService from '../services/congTyService';
import coQuanBhxhService from '../services/coQuanBhxhService';
import { DmVaiTro, DmCongTy, DmCoQuanBhxh } from '../../../shared/services/api/supabaseClient';

interface PhanQuyenCreateModalProps {
  nguoiDungId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PhanQuyenCreateModal: React.FC<PhanQuyenCreateModalProps> = ({ nguoiDungId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreatePhanQuyenRequest>({
    nguoi_dung_id: nguoiDungId || 0,
    vai_tro_id: 0,
    loai_to_chuc: 'cong_ty',
    cap_do_quyen: 'user',
    created_by: 'current_user'
  });

  const [vaiTroList, setVaiTroList] = useState<DmVaiTro[]>([]);
  const [congTyList, setCongTyList] = useState<DmCongTy[]>([]);
  const [coQuanList, setCoQuanList] = useState<DmCoQuanBhxh[]>([]);
  const [daiLyList, setDaiLyList] = useState<any[]>([]); // Thêm state cho đại lý
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [vaiTro, congTy, coQuan] = await Promise.all([
        phanQuyenService.getAllVaiTro(),
        congTyService.getActiveCongTy(),
        coQuanBhxhService.getActiveCoQuanBhxh()
      ]);

      setVaiTroList(vaiTro);
      setCongTyList(congTy);
      setCoQuanList(coQuan);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nguoi_dung_id) {
      errors.nguoi_dung_id = 'Người dùng là bắt buộc';
    }

    if (!formData.vai_tro_id) {
      errors.vai_tro_id = 'Vai trò là bắt buộc';
    }

    if (formData.loai_to_chuc === 'cong_ty' && !formData.cong_ty_id) {
      errors.cong_ty_id = 'Công ty là bắt buộc';
    }

    if (formData.loai_to_chuc === 'co_quan_bhxh' && !formData.co_quan_bhxh_id) {
      errors.co_quan_bhxh_id = 'Cơ quan BHXH là bắt buộc';
    }

    // Validation cho đại lý (bắt buộc với nhân viên thu)
    if (isNhanVienThu() && !formData.dai_ly_id) {
      errors.dai_ly_id = 'Đại lý là bắt buộc cho nhân viên thu';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof CreatePhanQuyenRequest, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Reset organization fields when changing type
      if (field === 'loai_to_chuc') {
        newData.cong_ty_id = undefined;
        newData.co_quan_bhxh_id = undefined;
        newData.dai_ly_id = undefined; // Reset đại lý khi thay đổi loại tổ chức
      }

      return newData;
    });

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Load đại lý khi thay đổi tổ chức
    if (field === 'cong_ty_id' || field === 'co_quan_bhxh_id') {
      loadDaiLyByOrganization(value);
    }
  };

  // Load đại lý theo tổ chức được chọn
  const loadDaiLyByOrganization = async (organizationId?: number) => {
    const orgId = organizationId || (formData.loai_to_chuc === 'cong_ty' ? formData.cong_ty_id : formData.co_quan_bhxh_id);

    if (!orgId) {
      setDaiLyList([]);
      return;
    }

    try {
      const daiLyData = await phanQuyenService.getDaiLyByOrganization(formData.loai_to_chuc, orgId);
      setDaiLyList(daiLyData);
    } catch (err) {
      console.error('Error loading dai ly:', err);
      setDaiLyList([]);
    }
  };

  // Kiểm tra xem có phải vai trò nhân viên thu không
  const isNhanVienThu = () => {
    const selectedRole = vaiTroList.find(role => role.id === formData.vai_tro_id);
    return selectedRole?.ten_vai_tro?.toLowerCase().includes('nhân viên thu') || selectedRole?.id === 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await phanQuyenService.createPhanQuyen(formData);
      onSuccess();
    } catch (err) {
      console.error('Error creating permission:', err);
      setError('Không thể tạo phân quyền. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationIcon = (type: string) => {
    switch (type) {
      case 'cong_ty':
        return <Building className="w-5 h-5 text-blue-600" />;
      case 'co_quan_bhxh':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'he_thong':
        return <Users className="w-5 h-5 text-purple-600" />;
      default:
        return <Building className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Phân quyền người dùng
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cấp quyền truy cập cho người dùng trong tổ chức
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

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vai trò <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.vai_tro_id}
              onChange={(e) => handleInputChange('vai_tro_id', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                validationErrors.vai_tro_id 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Chọn vai trò</option>
              {vaiTroList.map(vaiTro => (
                <option key={vaiTro.id} value={vaiTro.id}>
                  {vaiTro.ten_vai_tro} ({vaiTro.cap_do})
                </option>
              ))}
            </select>
            {validationErrors.vai_tro_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.vai_tro_id}
              </p>
            )}
          </div>

          {/* Organization Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại tổ chức <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'cong_ty', label: 'Công ty', icon: 'building' },
                { value: 'co_quan_bhxh', label: 'Cơ quan BHXH', icon: 'shield' },
                { value: 'he_thong', label: 'Hệ thống', icon: 'users' }
              ].map(option => (
                <label
                  key={option.value}
                  className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.loai_to_chuc === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="loai_to_chuc"
                    value={option.value}
                    checked={formData.loai_to_chuc === option.value}
                    onChange={(e) => handleInputChange('loai_to_chuc', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    {getOrganizationIcon(option.value)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Organization Selection */}
          {formData.loai_to_chuc === 'cong_ty' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Công ty <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cong_ty_id || ''}
                onChange={(e) => handleInputChange('cong_ty_id', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.cong_ty_id 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Chọn công ty</option>
                {congTyList.map(congTy => (
                  <option key={congTy.id} value={congTy.id}>
                    {congTy.ten_cong_ty} ({congTy.ma_cong_ty})
                  </option>
                ))}
              </select>
              {validationErrors.cong_ty_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.cong_ty_id}
                </p>
              )}
            </div>
          )}

          {formData.loai_to_chuc === 'co_quan_bhxh' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cơ quan BHXH <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.co_quan_bhxh_id || ''}
                onChange={(e) => handleInputChange('co_quan_bhxh_id', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.co_quan_bhxh_id 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Chọn cơ quan BHXH</option>
                {coQuanList.map(coQuan => (
                  <option key={coQuan.id} value={coQuan.id}>
                    {coQuan.ten_co_quan} ({coQuan.ma_co_quan})
                  </option>
                ))}
              </select>
              {validationErrors.co_quan_bhxh_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.co_quan_bhxh_id}
                </p>
              )}
            </div>
          )}

          {/* Đại lý Selection - chỉ hiển thị cho nhân viên thu */}
          {isNhanVienThu() && (formData.cong_ty_id || formData.co_quan_bhxh_id) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn đại lý <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.dai_ly_id || ''}
                onChange={(e) => handleInputChange('dai_ly_id', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.dai_ly_id
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">
                  {daiLyList.length === 0 ? 'Không có đại lý nào' : 'Chọn đại lý'}
                </option>
                {daiLyList.map(daiLy => (
                  <option key={daiLy.id} value={daiLy.id}>
                    {daiLy.ten} ({daiLy.ma})
                  </option>
                ))}
              </select>
              {validationErrors.dai_ly_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.dai_ly_id}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Nhân viên thu sẽ chỉ có thể làm việc với đại lý được chọn và các đơn vị thuộc đại lý này
              </p>
            </div>
          )}

          {/* Permission Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cấp độ quyền
            </label>
            <select
              value={formData.cap_do_quyen}
              onChange={(e) => handleInputChange('cap_do_quyen', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="user">User - Người dùng thường</option>
              <option value="admin">Admin - Quản trị viên</option>
              <option value="super_admin">Super Admin - Quản trị tối cao</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={formData.ngay_bat_dau || ''}
                onChange={(e) => handleInputChange('ngay_bat_dau', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={formData.ngay_ket_thuc || ''}
                onChange={(e) => handleInputChange('ngay_ket_thuc', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  Tạo phân quyền
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhanQuyenCreateModal;

