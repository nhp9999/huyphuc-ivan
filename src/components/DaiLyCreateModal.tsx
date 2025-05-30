import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, Building2 } from 'lucide-react';
import { VDaiLyChiTiet, VDonViDaiLy } from '../services/supabaseClient';
import { daiLyService } from '../services/daiLyService';
import { daiLyDonViService } from '../services/daiLyDonViService';

interface DaiLyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  ma: string;
  ten: string;
  cap: number | null;
  has_children: boolean;
  cha_id: number | null;
  is_clickable: boolean;
  is_current: boolean;
  ma_tinh: string;
  type: number | null;
  is_dai_ly: boolean;
}

const DaiLyCreateModal: React.FC<DaiLyCreateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    ma: '',
    ten: '',
    cap: null,
    has_children: false,
    cha_id: null,
    is_clickable: true,
    is_current: false,
    ma_tinh: '',
    type: null,
    is_dai_ly: true,
  });

  const [parentDaiLyList, setParentDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [donViList, setDonViList] = useState<VDonViDaiLy[]>([]);
  const [selectedDonViIds, setSelectedDonViIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData();
      generateMaDaiLy(); // Tự động sinh mã khi mở modal
    }
  }, [isOpen]);

  // Tự động sinh mã khi thay đổi mã tỉnh hoặc cấp
  useEffect(() => {
    if (isOpen && (formData.ma_tinh || formData.cap)) {
      generateMaDaiLy();
    }
  }, [formData.ma_tinh, formData.cap, isOpen]);

  const loadData = async () => {
    try {
      const [daiLyData, unlinkedDonViData] = await Promise.all([
        daiLyService.getAllDaiLy(),
        daiLyDonViService.getUnlinkedDonVi()
      ]);
      setParentDaiLyList(daiLyData);
      setDonViList(unlinkedDonViData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const generateMaDaiLy = async () => {
    if (generatingCode) return; // Tránh gọi nhiều lần

    setGeneratingCode(true);
    try {
      const newMa = await daiLyService.generateMaDaiLy(formData.ma_tinh, formData.cap);
      setFormData(prev => ({ ...prev, ma: newMa }));
      // Clear validation error for ma field
      if (validationErrors.ma) {
        setValidationErrors(prev => ({ ...prev, ma: '' }));
      }
    } catch (err) {
      console.error('Error generating ma dai ly:', err);
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    // Nếu chưa có mã, tự động sinh
    if (!formData.ma.trim()) {
      try {
        await generateMaDaiLy();
      } catch (err) {
        errors.ma = 'Không thể tự động sinh mã đại lý';
      }
    }

    if (!formData.ten.trim()) {
      errors.ten = 'Tên đại lý là bắt buộc';
    }

    if (!formData.ma_tinh.trim()) {
      errors.ma_tinh = 'Mã tỉnh là bắt buộc';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle don vi selection
  const handleDonViToggle = (donViId: number) => {
    setSelectedDonViIds(prev => {
      if (prev.includes(donViId)) {
        return prev.filter(id => id !== donViId);
      } else {
        return [...prev, donViId];
      }
    });
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if ma already exists
      const exists = await daiLyService.checkMaDaiLyExists(formData.ma);
      if (exists) {
        setValidationErrors({ ma: 'Mã đại lý đã tồn tại trong hệ thống' });
        setLoading(false);
        return;
      }

      // Create dai ly first
      const newDaiLy = await daiLyService.createDaiLy({
        ma: formData.ma.trim(),
        ten: formData.ten.trim(),
        cap: formData.cap,
        has_children: formData.has_children,
        cha_id: formData.cha_id,
        is_clickable: formData.is_clickable,
        is_current: formData.is_current,
        ma_tinh: formData.ma_tinh.trim(),
        type: formData.type,
        is_dai_ly: formData.is_dai_ly,
        trang_thai: 'active'
      });

      // Link selected don vi to the new dai ly
      if (selectedDonViIds.length > 0) {
        await daiLyDonViService.linkMultipleDonViToDaiLy(
          newDaiLy.id,
          selectedDonViIds,
          'Liên kết khi tạo đại lý'
        );
      }

      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('Error creating dai ly:', err);

      // Handle specific database errors
      if (err?.code === '23505') {
        if (err?.details?.includes('ma')) {
          setValidationErrors({ ma: 'Mã đại lý đã tồn tại trong hệ thống' });
        } else {
          setError('Dữ liệu đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.');
        }
      } else {
        setError('Có lỗi xảy ra khi tạo đại lý. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ma: '',
      ten: '',
      cap: null,
      has_children: false,
      cha_id: null,
      is_clickable: true,
      is_current: false,
      ma_tinh: '',
      type: null,
      is_dai_ly: true,
    });
    setSelectedDonViIds([]);
    setValidationErrors({});
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tạo đại lý mới
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mã đại lý */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã đại lý (*)
                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                  (Tự động sinh)
                </span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.ma}
                  onChange={(e) => handleInputChange('ma', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    validationErrors.ma ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Mã sẽ được tự động sinh"
                  readOnly={generatingCode}
                />
                <button
                  type="button"
                  onClick={generateMaDaiLy}
                  disabled={generatingCode}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center"
                  title="Tạo mã mới"
                >
                  {generatingCode ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>
              </div>
              {validationErrors.ma && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.ma}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mã sẽ tự động sinh dựa trên mã tỉnh và cấp đại lý
              </p>
            </div>

            {/* Tên đại lý */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên đại lý (*)
              </label>
              <input
                type="text"
                value={formData.ten}
                onChange={(e) => handleInputChange('ten', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.ten ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập tên đại lý"
              />
              {validationErrors.ten && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.ten}</p>
              )}
            </div>

            {/* Cấp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cấp
              </label>
              <select
                value={formData.cap || ''}
                onChange={(e) => handleInputChange('cap', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Chọn cấp</option>
                <option value="1">Cấp tỉnh</option>
                <option value="2">Cấp huyện</option>
                <option value="3">Cấp xã</option>
              </select>
            </div>

            {/* Loại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại
              </label>
              <select
                value={formData.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Chọn loại</option>
                <option value="1">Điểm thu cấp tỉnh</option>
                <option value="2">Điểm thu cấp huyện</option>
                <option value="3">Điểm thu cấp xã</option>
                <option value="4">Đại lý cá nhân</option>
              </select>
            </div>

            {/* Mã tỉnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã tỉnh (*)
              </label>
              <input
                type="text"
                value={formData.ma_tinh}
                onChange={(e) => handleInputChange('ma_tinh', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.ma_tinh ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập mã tỉnh"
              />
              {validationErrors.ma_tinh && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.ma_tinh}</p>
              )}
            </div>

            {/* Đại lý cha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đại lý cha
              </label>
              <select
                value={formData.cha_id || ''}
                onChange={(e) => handleInputChange('cha_id', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Không có đại lý cha</option>
                {parentDaiLyList.map((daiLy) => (
                  <option key={daiLy.id} value={daiLy.id}>
                    {daiLy.ma} - {daiLy.ten}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_children}
                  onChange={(e) => handleInputChange('has_children', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Có đại lý con</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_clickable}
                  onChange={(e) => handleInputChange('is_clickable', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Có thể click</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => handleInputChange('is_current', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Hiện tại</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_dai_ly}
                  onChange={(e) => handleInputChange('is_dai_ly', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Là đại lý</span>
              </label>
            </div>
          </div>

          {/* Chọn đơn vị để liên kết */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Liên kết với đơn vị ({selectedDonViIds.length} đã chọn)
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Chọn các đơn vị muốn liên kết với đại lý này. Một đơn vị có thể liên kết với nhiều đại lý.
            </p>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 max-h-60 overflow-y-auto">
              {donViList.length > 0 ? (
                <div className="space-y-2">
                  {donViList.map((donVi) => (
                    <label key={donVi.don_vi_id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDonViIds.includes(donVi.don_vi_id)}
                        onChange={() => handleDonViToggle(donVi.don_vi_id)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {donVi.ma_so_bhxh} - {donVi.ten_don_vi}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {donVi.loai_dich_vu} • {donVi.loai_don_vi}
                        </div>
                        {donVi.ma_co_quan_bhxh && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Mã cơ quan: {donVi.ma_co_quan_bhxh}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Không có đơn vị nào để liên kết</p>
                  <p className="text-xs mt-1">Chưa có đơn vị nào trong hệ thống</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Chọn các đơn vị mà đại lý này sẽ quản lý. Đơn vị có thể liên kết với nhiều đại lý. Bạn có thể bỏ qua bước này và liên kết sau.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DaiLyCreateModal;
