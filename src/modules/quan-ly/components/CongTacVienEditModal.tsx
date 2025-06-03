import React, { useState, useEffect } from 'react';
import { X, User, Save, AlertCircle, Building, Shield, Users } from 'lucide-react';
import { VCongTacVienChiTiet, DmNguoiDung, DmCongTy, DmCoQuanBhxh } from '../../../shared/services/api/supabaseClient';
import congTacVienService, { UpdateCongTacVienRequest } from '../services/congTacVienService';
import nguoiDungService from '../services/nguoiDungService';
import congTyService from '../services/congTyService';
import coQuanBhxhService from '../services/coQuanBhxhService';

interface CongTacVienEditModalProps {
  congTacVien: VCongTacVienChiTiet;
  onClose: () => void;
  onSuccess: () => void;
}

const CongTacVienEditModal: React.FC<CongTacVienEditModalProps> = ({ congTacVien, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateCongTacVienRequest>({
    id: congTacVien.id,
    ma_ctv: congTacVien.ma_ctv,
    ho_ten: congTacVien.ho_ten,
    so_dien_thoai: congTacVien.so_dien_thoai || '',
    email: congTacVien.email || '',
    dia_chi: '',
    nhan_vien_thu_id: 0,
    loai_to_chuc: congTacVien.loai_to_chuc as 'cong_ty' | 'co_quan_bhxh' | 'he_thong',
    ngay_bat_dau: congTacVien.ngay_bat_dau || '',
    ngay_ket_thuc: congTacVien.ngay_ket_thuc || '',
    ghi_chu: '',
    updated_by: 'current_user'
  });

  const [nhanVienThuList, setNhanVienThuList] = useState<DmNguoiDung[]>([]);
  const [congTyList, setCongTyList] = useState<DmCongTy[]>([]);
  const [coQuanBhxhList, setCoQuanBhxhList] = useState<DmCoQuanBhxh[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadInitialData();
    loadCongTacVienDetails();
  }, []);

  const loadInitialData = async () => {
    try {
      const [nhanVienThuData, congTyData, coQuanData] = await Promise.all([
        nguoiDungService.getActiveNguoiDung(),
        congTyService.getAllCongTy(),
        coQuanBhxhService.getAllCoQuanBhxh()
      ]);

      // Lọc chỉ lấy nhân viên thu
      const nhanVienThuFiltered = nhanVienThuData.filter(user => 
        user.ma_nhan_vien || user.id
      );

      setNhanVienThuList(nhanVienThuFiltered);
      setCongTyList(congTyData);
      setCoQuanBhxhList(coQuanData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Không thể tải dữ liệu ban đầu');
    }
  };

  const loadCongTacVienDetails = async () => {
    try {
      const details = await congTacVienService.getCongTacVienById(congTacVien.id);
      if (details) {
        setFormData(prev => ({
          ...prev,
          dia_chi: details.dia_chi || '',
          nhan_vien_thu_id: details.nhan_vien_thu_id,
          cong_ty_id: details.cong_ty_id,
          co_quan_bhxh_id: details.co_quan_bhxh_id,
          ghi_chu: details.ghi_chu || ''
        }));
      }
    } catch (err) {
      console.error('Error loading cong tac vien details:', err);
    }
  };

  const handleInputChange = (field: keyof UpdateCongTacVienRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.ho_ten?.trim()) {
      errors.ho_ten = 'Họ tên là bắt buộc';
    }

    if (!formData.ma_ctv?.trim()) {
      errors.ma_ctv = 'Mã cộng tác viên là bắt buộc';
    }

    if (!formData.nhan_vien_thu_id) {
      errors.nhan_vien_thu_id = 'Nhân viên thu quản lý là bắt buộc';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (formData.so_dien_thoai && !/^[0-9+\-\s()]+$/.test(formData.so_dien_thoai)) {
      errors.so_dien_thoai = 'Số điện thoại không hợp lệ';
    }

    if (formData.loai_to_chuc === 'cong_ty' && !formData.cong_ty_id) {
      errors.cong_ty_id = 'Vui lòng chọn công ty';
    }

    if (formData.loai_to_chuc === 'co_quan_bhxh' && !formData.co_quan_bhxh_id) {
      errors.co_quan_bhxh_id = 'Vui lòng chọn cơ quan BHXH';
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
      // Kiểm tra mã cộng tác viên đã tồn tại (nếu thay đổi)
      if (formData.ma_ctv !== congTacVien.ma_ctv) {
        const exists = await congTacVienService.checkMaCongTacVienExists(formData.ma_ctv!);
        if (exists) {
          setValidationErrors({ ma_ctv: 'Mã cộng tác viên đã tồn tại' });
          setLoading(false);
          return;
        }
      }

      await congTacVienService.updateCongTacVien(formData);
      onSuccess();
    } catch (err) {
      console.error('Error updating cong tac vien:', err);
      setError('Không thể cập nhật cộng tác viên. Vui lòng thử lại.');
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Chỉnh sửa cộng tác viên
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nhân viên thu quản lý */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhân viên thu quản lý <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.nhan_vien_thu_id}
              onChange={(e) => handleInputChange('nhan_vien_thu_id', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                validationErrors.nhan_vien_thu_id 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Chọn nhân viên thu</option>
              {nhanVienThuList.map(nhanVien => (
                <option key={nhanVien.id} value={nhanVien.id}>
                  {nhanVien.ho_ten} ({nhanVien.ma_nhan_vien || `NV${nhanVien.id.toString().padStart(3, '0')}`})
                </option>
              ))}
            </select>
            {validationErrors.nhan_vien_thu_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.nhan_vien_thu_id}</p>
            )}
          </div>

          {/* Mã cộng tác viên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã cộng tác viên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ma_ctv}
              onChange={(e) => handleInputChange('ma_ctv', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                validationErrors.ma_ctv 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Nhập mã cộng tác viên"
            />
            {validationErrors.ma_ctv && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.ma_ctv}</p>
            )}
          </div>

          {/* Họ tên */}
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
              placeholder="Nhập họ và tên"
            />
            {validationErrors.ho_ten && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.ho_ten}</p>
            )}
          </div>

          {/* Email và Số điện thoại */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.email 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="email@example.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.so_dien_thoai}
                onChange={(e) => handleInputChange('so_dien_thoai', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.so_dien_thoai 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0123456789"
              />
              {validationErrors.so_dien_thoai && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.so_dien_thoai}</p>
              )}
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Địa chỉ
            </label>
            <textarea
              value={formData.dia_chi}
              onChange={(e) => handleInputChange('dia_chi', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập địa chỉ"
            />
          </div>

          {/* Loại tổ chức */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại tổ chức <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'cong_ty', label: 'Công ty', icon: 'building' },
                { value: 'co_quan_bhxh', label: 'Cơ quan BHXH', icon: 'shield' },
                { value: 'he_thong', label: 'Hệ thống', icon: 'users' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="loai_to_chuc"
                    value={option.value}
                    checked={formData.loai_to_chuc === option.value}
                    onChange={(e) => handleInputChange('loai_to_chuc', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-1">
                    {getOrganizationIcon(option.value)}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
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
                    {congTy.ten_cong_ty}
                  </option>
                ))}
              </select>
              {validationErrors.cong_ty_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.cong_ty_id}</p>
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
                {coQuanBhxhList.map(coQuan => (
                  <option key={coQuan.id} value={coQuan.id}>
                    {coQuan.ten_co_quan}
                  </option>
                ))}
              </select>
              {validationErrors.co_quan_bhxh_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.co_quan_bhxh_id}</p>
              )}
            </div>
          )}

          {/* Ngày bắt đầu và kết thúc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={formData.ngay_bat_dau}
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
                value={formData.ngay_ket_thuc}
                onChange={(e) => handleInputChange('ngay_ket_thuc', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.ghi_chu}
              onChange={(e) => handleInputChange('ghi_chu', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập ghi chú (tùy chọn)"
            />
          </div>

          {/* Buttons */}
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
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CongTacVienEditModal;
