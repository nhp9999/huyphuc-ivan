import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { DmKhoiKcb, VDaiLyChiTiet } from '../../../shared/services/api/supabaseClient';
import { donViService } from '../services/donViService';
import { daiLyService } from '../services/daiLyService';

interface DonViCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  ma_co_quan_bhxh: string;
  ma_don_vi: string;
  ten_don_vi: string;
  is_bhxh_tn: number;
  is_bhyt: number;
  dm_khoi_kcb_id: number | null;
  ma_khoi_kcb: string;
  ten_khoi_kcb: string;
  type: number;
  dai_ly_id: number | null;
}

const DonViCreateModal: React.FC<DonViCreateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    ma_co_quan_bhxh: '',
    ma_don_vi: '',
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
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
      setError(null);
      setValidationErrors({});
    }
  }, [isOpen]);

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

  // Handle khối KCB selection
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

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.ten_don_vi.trim()) {
      errors.ten_don_vi = 'Tên đơn vị là bắt buộc';
    }

    if (!formData.ma_don_vi.trim()) {
      errors.ma_don_vi = 'Mã đơn vị là bắt buộc';
    }

    if (!formData.ma_co_quan_bhxh.trim()) {
      errors.ma_co_quan_bhxh = 'Mã cơ quan BHXH là bắt buộc';
    }

    // Validate service selection
    if (formData.is_bhxh_tn === 0 && formData.is_bhyt === 0) {
      errors.service = 'Phải chọn ít nhất một dịch vụ (BHXH TN hoặc BHYT)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      // Check if ma_don_vi already exists
      const exists = await donViService.checkMaDonViExists(formData.ma_don_vi);
      if (exists) {
        setValidationErrors({ ma_don_vi: 'Mã đơn vị đã tồn tại' });
        setSaving(false);
        return;
      }

      // Create the new unit
      const createData = {
        ma_co_quan_bhxh: formData.ma_co_quan_bhxh,
        ma_don_vi: formData.ma_don_vi,
        ten_don_vi: formData.ten_don_vi,
        is_bhxh_tn: formData.is_bhxh_tn,
        is_bhyt: formData.is_bhyt,
        dm_khoi_kcb_id: formData.dm_khoi_kcb_id,
        ma_khoi_kcb: formData.ma_khoi_kcb,
        ten_khoi_kcb: formData.ten_khoi_kcb,
        type: formData.type,
        dai_ly_id: formData.dai_ly_id,
        trang_thai: 'active'
      };

      await donViService.createDonVi(createData);
      onSave();
      onClose();
    } catch (err) {
      console.error('Error creating don vi:', err);
      setError('Có lỗi xảy ra khi tạo đơn vị. Vui lòng thử lại.');
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
            Tạo đơn vị mới
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
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Service Selection Error */}
          {validationErrors.service && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{validationErrors.service}</p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Thông tin cơ bản</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mã cơ quan BHXH */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mã cơ quan BHXH <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ma_co_quan_bhxh}
                  onChange={(e) => handleInputChange('ma_co_quan_bhxh', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    validationErrors.ma_co_quan_bhxh ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập mã cơ quan BHXH"
                />
                {validationErrors.ma_co_quan_bhxh && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.ma_co_quan_bhxh}</p>
                )}
              </div>

              {/* Mã đơn vị */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mã đơn vị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ma_don_vi}
                  onChange={(e) => handleInputChange('ma_don_vi', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    validationErrors.ma_don_vi ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập mã đơn vị"
                />
                {validationErrors.ma_don_vi && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.ma_don_vi}</p>
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
                  validationErrors.ten_don_vi ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập tên đơn vị"
              />
              {validationErrors.ten_don_vi && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.ten_don_vi}</p>
              )}
            </div>
          </div>

          {/* Service Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cấu hình dịch vụ</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BHXH Tự nguyện */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  BHXH Tự nguyện
                </label>
                <select
                  value={formData.is_bhxh_tn}
                  onChange={(e) => handleInputChange('is_bhxh_tn', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value={0}>Không hỗ trợ</option>
                  <option value={1}>Có hỗ trợ</option>
                </select>
              </div>

              {/* BHYT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  BHYT
                </label>
                <select
                  value={formData.is_bhyt}
                  onChange={(e) => handleInputChange('is_bhyt', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value={0}>Không hỗ trợ</option>
                  <option value={1}>Có hỗ trợ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Thông tin bổ sung</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Khối KCB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Khối KCB
                </label>
                <select
                  value={formData.dm_khoi_kcb_id || ''}
                  onChange={(e) => handleKhoiKcbChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Chọn khối KCB</option>
                  {khoiKcbList.map(khoi => (
                    <option key={khoi.id} value={khoi.id}>
                      {khoi.ten_khoi} ({khoi.ma_khoi})
                    </option>
                  ))}
                </select>
              </div>

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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Chọn đại lý để liên kết đơn vị này với đại lý quản lý
                </p>
              </div>
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
            <span>{saving ? 'Đang tạo...' : 'Tạo đơn vị'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonViCreateModal;

