import React, { useState, useEffect } from 'react';
import { X, Edit3, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { DropdownOption } from '../SearchableDropdown';

export interface BulkUpdateData {
  updateFields: {
    maBenhVien?: boolean;
    soThangDong?: boolean;
    maTinhNkq?: boolean;
    maHuyenNkq?: boolean;
    maXaNkq?: boolean;
    gioiTinh?: boolean;
    quocTich?: boolean;
  };
  values: {
    maBenhVien?: string;
    tenBenhVien?: string;
    maTinh?: string;
    soThangDong?: string;
    maTinhNkq?: string;
    maHuyenNkq?: string;
    maXaNkq?: string;
    gioiTinh?: string;
    quocTich?: string;
  };
}

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkUpdateData, selectedIndices: number[]) => void;
  selectedParticipants: number[];
  participantCount: number;
  cskcbOptions?: DropdownOption[];
  tinhOptions?: DropdownOption[];
  huyenOptions?: DropdownOption[];
  xaOptions?: DropdownOption[];
  onTinhChange?: (value: string) => void;
  onHuyenChange?: (value: string) => void;
  processing?: boolean;
}

export const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedParticipants,
  participantCount,
  cskcbOptions = [],
  tinhOptions = [],
  huyenOptions = [],
  xaOptions = [],
  onTinhChange,
  onHuyenChange,
  processing = false
}) => {
  const [updateFields, setUpdateFields] = useState({
    maBenhVien: false,
    soThangDong: false,
    maTinhNkq: false,
    maHuyenNkq: false,
    maXaNkq: false,
    gioiTinh: false,
    quocTich: false
  });

  const [values, setValues] = useState({
    maBenhVien: '',
    tenBenhVien: '',
    maTinh: '',
    soThangDong: '12',
    maTinhNkq: '',
    maHuyenNkq: '',
    maXaNkq: '',
    gioiTinh: 'Nam',
    quocTich: 'VN'
  });

  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUpdateFields({
        maBenhVien: false,
        soThangDong: false,
        maTinhNkq: false,
        maHuyenNkq: false,
        maXaNkq: false,
        gioiTinh: false,
        quocTich: false
      });
      setValues({
        maBenhVien: '',
        tenBenhVien: '',
        maTinh: '',
        soThangDong: '12',
        maTinhNkq: '',
        maHuyenNkq: '',
        maXaNkq: '',
        gioiTinh: 'Nam',
        quocTich: 'VN'
      });
      setError('');
      setShowPreview(false);
    }
  }, [isOpen]);

  const handleFieldToggle = (field: keyof typeof updateFields) => {
    setUpdateFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setError('');
  };

  const handleValueChange = (field: keyof typeof values, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));

    // Handle medical facility selection
    if (field === 'maBenhVien') {
      const selectedFacility = cskcbOptions.find(option => option.value === value);
      if (selectedFacility) {
        setValues(prev => ({
          ...prev,
          tenBenhVien: selectedFacility.label.split(' - ')[1] || selectedFacility.label,
          maTinh: '' // Reset province when facility changes
        }));
      }
    }

    // Handle cascading location changes
    if (field === 'maTinhNkq') {
      setValues(prev => ({
        ...prev,
        maHuyenNkq: '',
        maXaNkq: ''
      }));
      onTinhChange?.(value);
    }

    if (field === 'maHuyenNkq') {
      setValues(prev => ({
        ...prev,
        maXaNkq: ''
      }));
      onHuyenChange?.(value);
    }

    setError('');
  };

  const handlePreview = () => {
    // Validate that at least one field is selected
    const hasSelectedFields = Object.values(updateFields).some(Boolean);
    if (!hasSelectedFields) {
      setError('Vui lòng chọn ít nhất một trường để cập nhật');
      return;
    }

    // Validate selected participants
    if (selectedParticipants.length === 0) {
      setError('Vui lòng chọn ít nhất một người tham gia để cập nhật');
      return;
    }

    setShowPreview(true);
  };

  const handleSubmit = () => {
    const data: BulkUpdateData = {
      updateFields,
      values
    };

    onSubmit(data, selectedParticipants);
  };

  const handleClose = () => {
    if (processing) return;
    onClose();
  };

  const getSelectedFieldsCount = () => {
    return Object.values(updateFields).filter(Boolean).length;
  };

  const getFieldLabel = (field: keyof typeof updateFields) => {
    const labels = {
      maBenhVien: 'Bệnh viện/Nơi KCB',
      soThangDong: 'Số tháng đóng',
      maTinhNkq: 'Tỉnh nơi cư trú',
      maHuyenNkq: 'Huyện nơi cư trú',
      maXaNkq: 'Xã nơi cư trú',
      gioiTinh: 'Giới tính',
      quocTich: 'Quốc tịch'
    };
    return labels[field];
  };

  const getFieldValue = (field: keyof typeof updateFields) => {
    const value = values[field as keyof typeof values];
    
    if (field === 'maBenhVien') {
      const facility = cskcbOptions.find(opt => opt.value === value);
      return facility ? facility.label : value;
    }
    
    if (field === 'maTinhNkq') {
      const tinh = tinhOptions.find(opt => opt.value === value);
      return tinh ? tinh.label : value;
    }
    
    if (field === 'maHuyenNkq') {
      const huyen = huyenOptions.find(opt => opt.value === value);
      return huyen ? huyen.label : value;
    }
    
    if (field === 'maXaNkq') {
      const xa = xaOptions.find(opt => opt.value === value);
      return xa ? xa.label : value;
    }
    
    if (field === 'soThangDong') {
      return `${value} tháng`;
    }
    
    return value;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Edit3 className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cập nhật hàng loạt
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
              {selectedParticipants.length} người được chọn
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={processing}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showPreview ? (
            /* Update Form */
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-2">Cập nhật hàng loạt - Hướng dẫn:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li><strong>Chọn trường:</strong> Tích chọn các trường muốn cập nhật</li>
                      <li><strong>Nhập giá trị:</strong> Chỉ cần nhập giá trị cho các trường đã chọn</li>
                      <li><strong>Áp dụng:</strong> Giá trị sẽ được áp dụng cho tất cả {selectedParticipants.length} người đã chọn</li>
                      <li><strong>Lưu ý:</strong> Thao tác này sẽ ghi đè lên dữ liệu hiện tại</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Update Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Chọn trường cần cập nhật
                </h3>

                {/* Medical Facility */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="maBenhVien"
                      checked={updateFields.maBenhVien}
                      onChange={() => handleFieldToggle('maBenhVien')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maBenhVien" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bệnh viện/Nơi KCB
                    </label>
                  </div>
                  {updateFields.maBenhVien && (
                    <select
                      value={values.maBenhVien}
                      onChange={(e) => handleValueChange('maBenhVien', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Chọn bệnh viện</option>
                      {cskcbOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Months */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="soThangDong"
                      checked={updateFields.soThangDong}
                      onChange={() => handleFieldToggle('soThangDong')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="soThangDong" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Số tháng đóng
                    </label>
                  </div>
                  {updateFields.soThangDong && (
                    <select
                      value={values.soThangDong}
                      onChange={(e) => handleValueChange('soThangDong', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="3">3 tháng</option>
                      <option value="6">6 tháng</option>
                      <option value="12">12 tháng</option>
                    </select>
                  )}
                </div>

                {/* Province */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="maTinhNkq"
                      checked={updateFields.maTinhNkq}
                      onChange={() => handleFieldToggle('maTinhNkq')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maTinhNkq" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tỉnh nơi cư trú
                    </label>
                  </div>
                  {updateFields.maTinhNkq && (
                    <select
                      value={values.maTinhNkq}
                      onChange={(e) => handleValueChange('maTinhNkq', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Chọn tỉnh</option>
                      {tinhOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* District */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="maHuyenNkq"
                      checked={updateFields.maHuyenNkq}
                      onChange={() => handleFieldToggle('maHuyenNkq')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maHuyenNkq" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Huyện nơi cư trú
                    </label>
                  </div>
                  {updateFields.maHuyenNkq && (
                    <select
                      value={values.maHuyenNkq}
                      onChange={(e) => handleValueChange('maHuyenNkq', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={!values.maTinhNkq}
                    >
                      <option value="">Chọn huyện</option>
                      {huyenOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Ward */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="maXaNkq"
                      checked={updateFields.maXaNkq}
                      onChange={() => handleFieldToggle('maXaNkq')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maXaNkq" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Xã nơi cư trú
                    </label>
                  </div>
                  {updateFields.maXaNkq && (
                    <select
                      value={values.maXaNkq}
                      onChange={(e) => handleValueChange('maXaNkq', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={!values.maHuyenNkq}
                    >
                      <option value="">Chọn xã</option>
                      {xaOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Gender */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="gioiTinh"
                      checked={updateFields.gioiTinh}
                      onChange={() => handleFieldToggle('gioiTinh')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="gioiTinh" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Giới tính
                    </label>
                  </div>
                  {updateFields.gioiTinh && (
                    <select
                      value={values.gioiTinh}
                      onChange={(e) => handleValueChange('gioiTinh', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  )}
                </div>

                {/* Nationality */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="quocTich"
                      checked={updateFields.quocTich}
                      onChange={() => handleFieldToggle('quocTich')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="quocTich" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quốc tịch
                    </label>
                  </div>
                  {updateFields.quocTich && (
                    <input
                      type="text"
                      value={values.quocTich}
                      onChange={(e) => handleValueChange('quocTich', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="VN"
                    />
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePreview}
                  disabled={getSelectedFieldsCount() === 0 || selectedParticipants.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xem trước ({getSelectedFieldsCount()} trường)
                </button>
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <p className="font-medium">
                      Sẵn sàng cập nhật {getSelectedFieldsCount()} trường cho {selectedParticipants.length} người tham gia
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Trường</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Giá trị mới</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {Object.entries(updateFields)
                        .filter(([_, selected]) => selected)
                        .map(([field, _]) => (
                          <tr key={field} className="bg-white dark:bg-gray-800">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                              {getFieldLabel(field as keyof typeof updateFields)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                              {getFieldValue(field as keyof typeof updateFields)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Quay lại chỉnh sửa
                </button>
                <div className="space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    disabled={processing}
                  >
                    {processing ? 'Đang cập nhật...' : `Cập nhật ${selectedParticipants.length} người`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateModal;
