import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { VDonViChiTiet, DmKhoiKcb, VDaiLyChiTiet } from '../../../shared/services/api/supabaseClient';
import { donViService } from '../services/donViService';
import { daiLyService } from '../services/daiLyService';

interface DonViEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  donVi: VDonViChiTiet | null;
  onSave: () => void;
}

interface FormData {
  ma_co_quan_bhxh: string;
  ma_so_bhxh: string;
  ten_don_vi: string;
  is_bhxh_tn: number;
  is_bhyt: number;
  dm_khoi_kcb_id: number | null;
  ma_khoi_kcb: string;
  ten_khoi_kcb: string;
  type: number;
  dai_ly_id: number | null;
}

const DonViEditModal: React.FC<DonViEditModalProps> = ({ isOpen, onClose, donVi, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    ma_co_quan_bhxh: '',
    ma_so_bhxh: '',
    ten_don_vi: '',
    is_bhxh_tn: 0,
    is_bhyt: 0,
    dm_khoi_kcb_id: null,
    ma_khoi_kcb: '',
    ten_khoi_kcb: '',
    type: 2,
    dai_ly_id: null
  });

  const [khoiKcbList, setKhoiKcbList] = useState<DmKhoiKcb[]>([]);
  const [daiLyList, setDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Load khối KCB list và đại lý list
  useEffect(() => {
    const loadData = async () => {
      try {
        const [khoiKcbData, daiLyData] = await Promise.all([
          donViService.getKhoiKCBList(),
          daiLyService.getAllDaiLy()
        ]);
        setKhoiKcbList(khoiKcbData);
        setDaiLyList(daiLyData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Populate form when donVi changes
  useEffect(() => {
    if (donVi) {
      setFormData({
        ma_co_quan_bhxh: donVi.ma_co_quan_bhxh || '',
        ma_so_bhxh: donVi.ma_so_bhxh || '',
        ten_don_vi: donVi.ten_don_vi || '',
        is_bhxh_tn: donVi.is_bhxh_tn || 0,
        is_bhyt: donVi.is_bhyt || 0,
        dm_khoi_kcb_id: donVi.dm_khoi_kcb_id || null,
        ma_khoi_kcb: donVi.ma_khoi_kcb || '',
        ten_khoi_kcb: donVi.ten_khoi_kcb || '',
        type: donVi.type || 2,
        dai_ly_id: donVi.dai_ly_id || null
      });
    }
  }, [donVi]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleKhoiKcbChange = (khoiId: string) => {
    const selectedKhoi = khoiKcbList.find(k => k.id.toString() === khoiId);
    if (selectedKhoi) {
      setFormData(prev => ({
        ...prev,
        dm_khoi_kcb_id: selectedKhoi.id,
        ma_khoi_kcb: selectedKhoi.ma_khoi,
        ten_khoi_kcb: selectedKhoi.ten_khoi
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dm_khoi_kcb_id: null,
        ma_khoi_kcb: '',
        ten_khoi_kcb: ''
      }));
    }
  };

  // Helper function to truncate long text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.ma_so_bhxh.trim()) {
      errors.ma_so_bhxh = 'Mã số BHXH là bắt buộc';
    }

    if (!formData.ten_don_vi.trim()) {
      errors.ten_don_vi = 'Tên đơn vị là bắt buộc';
    }

    if (formData.is_bhxh_tn === 0 && formData.is_bhyt === 0) {
      errors.services = 'Phải chọn ít nhất một dịch vụ (BHXH hoặc BHYT)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !donVi) return;

    setSaving(true);
    setError(null);

    try {
      // Check if ma_so_bhxh already exists (excluding current record)
      const exists = await donViService.checkMaSoBHXHExists(formData.ma_so_bhxh, donVi.id);
      if (exists) {
        setValidationErrors({ ma_so_bhxh: 'Mã số BHXH đã tồn tại' });
        setSaving(false);
        return;
      }

      await donViService.updateDonVi(donVi.id, formData);
      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving don vi:', err);
      setError('Có lỗi xảy ra khi lưu đơn vị. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setValidationErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa đơn vị
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          {/* Services Error */}
          {validationErrors.services && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">{validationErrors.services}</span>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mã cơ quan BHXH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã cơ quan BHXH
              </label>
              <input
                type="text"
                value={formData.ma_co_quan_bhxh}
                onChange={(e) => handleInputChange('ma_co_quan_bhxh', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mã cơ quan BHXH"
              />
            </div>

            {/* Mã số BHXH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã số BHXH <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ma_so_bhxh}
                onChange={(e) => handleInputChange('ma_so_bhxh', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.ma_so_bhxh
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập mã số BHXH"
              />
              {validationErrors.ma_so_bhxh && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.ma_so_bhxh}</p>
              )}
            </div>
          </div>

          {/* Tên đơn vị */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên đơn vị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ten_don_vi}
              onChange={(e) => handleInputChange('ten_don_vi', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                validationErrors.ten_don_vi
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Nhập tên đơn vị"
            />
            {validationErrors.ten_don_vi && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.ten_don_vi}</p>
            )}
          </div>

          {/* Dịch vụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dịch vụ <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_bhxh_tn === 1}
                  onChange={(e) => handleInputChange('is_bhxh_tn', e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">BHXH Tự nguyện</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_bhyt === 1}
                  onChange={(e) => handleInputChange('is_bhyt', e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">BHYT</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loại đơn vị */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại đơn vị
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value={1}>Cơ quan nhà nước</option>
                <option value={2}>Dịch vụ thu</option>
                <option value={3}>Doanh nghiệp</option>
              </select>
            </div>

            {/* Khối KCB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Khối KCB
              </label>
              <div className="relative">
                <select
                  value={formData.dm_khoi_kcb_id || ''}
                  onChange={(e) => handleKhoiKcbChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  title={formData.dm_khoi_kcb_id ? khoiKcbList.find(k => k.id === formData.dm_khoi_kcb_id)?.ten_khoi : ''}
                >
                  <option value="">Chọn khối KCB</option>
                  {khoiKcbList.map((khoi) => (
                    <option
                      key={khoi.id}
                      value={khoi.id}
                      title={`${khoi.ma_khoi} - ${khoi.ten_khoi}`}
                    >
                      {khoi.ma_khoi} - {truncateText(khoi.ten_khoi, 40)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Hiển thị tên đầy đủ của khối được chọn */}
              {formData.dm_khoi_kcb_id && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Khối được chọn:</strong> {formData.ma_khoi_kcb} - {formData.ten_khoi_kcb}
                  </p>
                </div>
              )}
            </div>

            {/* Đại lý quản lý */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đại lý quản lý
              </label>
              <select
                value={formData.dai_ly_id || ''}
                onChange={(e) => handleInputChange('dai_ly_id', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Chọn đại lý (tùy chọn)</option>
                {daiLyList.map(daiLy => (
                  <option key={daiLy.id} value={daiLy.id}>
                    {daiLy.ma} - {daiLy.ten}
                  </option>
                ))}
              </select>
              {/* Hiển thị thông tin đại lý được chọn */}
              {formData.dai_ly_id && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    <strong>Đại lý được chọn:</strong> {daiLyList.find(dl => dl.id === formData.dai_ly_id)?.ma} - {daiLyList.find(dl => dl.id === formData.dai_ly_id)?.ten}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Đang lưu...' : 'Lưu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonViEditModal;

