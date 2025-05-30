import React from 'react';
import { BhytFormData } from '../../hooks/useBhytFormData';
import { Search, RotateCcw, Loader2 } from 'lucide-react';

interface BhytPersonalInfoFormProps {
  formData: BhytFormData;
  handleInputChange: (field: keyof BhytFormData, value: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  searchLoading: boolean;
  resetForm: () => void;
}

export const BhytPersonalInfoForm: React.FC<BhytPersonalInfoFormProps> = ({
  formData,
  handleInputChange,
  handleSearch,
  handleKeyPress,
  searchLoading,
  resetForm
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thông tin cá nhân và địa chỉ
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
          {/* Mã số BHXH với tìm kiếm */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã số BHXH <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.maSoBHXH}
                onChange={(e) => handleInputChange('maSoBHXH', e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mã số BHXH (Enter để tìm kiếm)"
              />
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
              >
                {searchLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Họ tên */}
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.hoTen}
              onChange={(e) => handleInputChange('hoTen', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Ngày sinh */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              value={formData.ngaySinh}
              onChange={(e) => handleInputChange('ngaySinh', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Giới tính */}
          <div className="md:col-span-1 lg:col-span-1 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giới tính
            </label>
            <select
              value={formData.gioiTinh}
              onChange={(e) => handleInputChange('gioiTinh', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          {/* Số CCCD */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số CCCD/CMND
            </label>
            <input
              type="text"
              value={formData.soCCCD}
              onChange={(e) => handleInputChange('soCCCD', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập số CCCD/CMND"
            />
          </div>

          {/* Nơi đăng ký KCB */}
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nơi đăng ký KCB
            </label>
            <input
              type="text"
              value={formData.noiDangKyKCB}
              onChange={(e) => handleInputChange('noiDangKyKCB', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập nơi đăng ký KCB"
            />
          </div>

          {/* Số điện thoại */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              value={formData.soDienThoai}
              onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Số thẻ BHYT */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số thẻ BHYT
            </label>
            <input
              type="text"
              value={formData.soTheBHYT}
              onChange={(e) => handleInputChange('soTheBHYT', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập số thẻ BHYT"
            />
          </div>

          {/* Quốc tịch */}
          <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quốc tịch
            </label>
            <input
              type="text"
              value={formData.quocTich}
              onChange={(e) => handleInputChange('quocTich', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="VN"
            />
          </div>

          {/* Dân tộc */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dân tộc
            </label>
            <input
              type="text"
              value={formData.danToc}
              onChange={(e) => handleInputChange('danToc', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập dân tộc"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={resetForm}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
