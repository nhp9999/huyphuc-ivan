import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, Building2, Link, Unlink } from 'lucide-react';
import { VDaiLyChiTiet, VDonViChiTiet } from '../services/supabaseClient';
import { daiLyService } from '../services/daiLyService';
import { donViService } from '../services/donViService';

interface DaiLyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  daiLy: VDaiLyChiTiet | null;
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

const DaiLyEditModal: React.FC<DaiLyEditModalProps> = ({ isOpen, onClose, onSave, daiLy }) => {
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
  const [linkedDonVi, setLinkedDonVi] = useState<VDonViChiTiet[]>([]);
  const [unlinkedDonVi, setUnlinkedDonVi] = useState<VDonViChiTiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load data when modal opens or daiLy changes
  useEffect(() => {
    if (isOpen && daiLy) {
      setFormData({
        ma: daiLy.ma || '',
        ten: daiLy.ten || '',
        cap: daiLy.cap || null,
        has_children: daiLy.has_children || false,
        cha_id: daiLy.cha_id || null,
        is_clickable: daiLy.is_clickable || true,
        is_current: daiLy.is_current || false,
        ma_tinh: daiLy.ma_tinh || '',
        type: daiLy.type || null,
        is_dai_ly: daiLy.is_dai_ly || true,
      });
      loadData();
    }
  }, [isOpen, daiLy]);

  const loadData = async () => {
    if (!daiLy) return;

    try {
      const [daiLyData, linkedDonViData, allDonViData] = await Promise.all([
        daiLyService.getAllDaiLy(),
        daiLyService.getDonViByDaiLy(daiLy.id),
        donViService.getAllDonVi()
      ]);

      // Exclude current daiLy from parent list to prevent circular reference
      const filteredDaiLyData = daiLyData.filter(item => item.id !== daiLy.id);
      setParentDaiLyList(filteredDaiLyData);

      // Set linked don vi
      setLinkedDonVi(linkedDonViData);

      // Set unlinked don vi (excluding those already linked to this dai ly)
      const unlinked = allDonViData.filter(dv => !dv.dai_ly_id || dv.dai_ly_id === daiLy.id);
      const unlinkedOnly = unlinked.filter(dv => !linkedDonViData.find(linked => linked.id === dv.id));
      setUnlinkedDonVi(unlinkedOnly);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.ma.trim()) {
      errors.ma = 'Mã đại lý là bắt buộc';
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

  // Handle linking don vi to dai ly
  const handleLinkDonVi = async (donViId: number) => {
    if (!daiLy) return;

    setLoading(true);
    try {
      await donViService.updateDaiLyForDonVi(donViId, daiLy.id);
      await loadData(); // Refresh data
    } catch (err) {
      console.error('Error linking don vi:', err);
      setError('Có lỗi xảy ra khi liên kết đơn vị.');
    } finally {
      setLoading(false);
    }
  };

  // Handle unlinking don vi from dai ly
  const handleUnlinkDonVi = async (donViId: number) => {
    setLoading(true);
    try {
      await donViService.updateDaiLyForDonVi(donViId, null);
      await loadData(); // Refresh data
    } catch (err) {
      console.error('Error unlinking don vi:', err);
      setError('Có lỗi xảy ra khi hủy liên kết đơn vị.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!daiLy || !validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if ma already exists (excluding current record)
      const exists = await daiLyService.checkMaDaiLyExists(formData.ma, daiLy.id);
      if (exists) {
        setValidationErrors({ ma: 'Mã đại lý đã tồn tại' });
        setLoading(false);
        return;
      }

      await daiLyService.updateDaiLy(daiLy.id, {
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
      });

      onSave();
      onClose();
    } catch (err) {
      console.error('Error updating dai ly:', err);
      setError('Có lỗi xảy ra khi cập nhật đại lý. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setValidationErrors({});
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !daiLy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chỉnh sửa đại lý
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
              </label>
              <input
                type="text"
                value={formData.ma}
                onChange={(e) => handleInputChange('ma', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.ma ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Nhập mã đại lý"
              />
              {validationErrors.ma && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.ma}</p>
              )}
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
                {parentDaiLyList.map((parentDaiLy) => (
                  <option key={parentDaiLy.id} value={parentDaiLy.id}>
                    {parentDaiLy.ma} - {parentDaiLy.ten}
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

          {/* Quản lý đơn vị liên kết */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quản lý đơn vị liên kết
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Đơn vị đã liên kết */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Link className="w-4 h-4 mr-2 text-green-600" />
                  Đơn vị đã liên kết ({linkedDonVi.length})
                </h5>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {linkedDonVi.length > 0 ? (
                    <div className="space-y-2">
                      {linkedDonVi.map((donVi) => (
                        <div key={donVi.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {donVi.ma_so_bhxh}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {donVi.ten_don_vi}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnlinkDonVi(donVi.id)}
                            disabled={loading}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            title="Hủy liên kết"
                          >
                            <Unlink className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Chưa có đơn vị nào</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Đơn vị chưa liên kết */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-orange-600" />
                  Đơn vị có thể liên kết ({unlinkedDonVi.length})
                </h5>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {unlinkedDonVi.length > 0 ? (
                    <div className="space-y-2">
                      {unlinkedDonVi.map((donVi) => (
                        <div key={donVi.id} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {donVi.ma_so_bhxh}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {donVi.ten_don_vi}
                            </div>
                          </div>
                          <button
                            onClick={() => handleLinkDonVi(donVi.id)}
                            disabled={loading}
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                            title="Liên kết"
                          >
                            <Link className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <Link className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Không có đơn vị khả dụng</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Click vào icon để liên kết hoặc hủy liên kết đơn vị với đại lý này.
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
            <span>{loading ? 'Đang lưu...' : 'Cập nhật'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DaiLyEditModal;
