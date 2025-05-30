import React from 'react';
import { BhytFormData } from '../../hooks/useBhytFormData';

interface BhytCardInfoFormProps {
  formData: BhytFormData;
  handleInputChange: (field: keyof BhytFormData, value: string) => void;
}

export const BhytCardInfoForm: React.FC<BhytCardInfoFormProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thông tin thẻ BHYT hiện tại
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
          {/* Phương án tham gia */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phương án tham gia
            </label>
            <input
              type="text"
              value={formData.phuongAn}
              onChange={(e) => handleInputChange('phuongAn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập phương án tham gia"
            />
          </div>

          {/* Trạng thái thẻ */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái thẻ
            </label>
            <input
              type="text"
              value={formData.trangThai}
              onChange={(e) => handleInputChange('trangThai', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập trạng thái thẻ"
            />
          </div>

          {/* Từ ngày thẻ cũ */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Từ ngày thẻ cũ
            </label>
            <input
              type="date"
              value={formData.tuNgayTheCu}
              onChange={(e) => handleInputChange('tuNgayTheCu', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Đến ngày thẻ cũ */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đến ngày thẻ cũ
            </label>
            <input
              type="date"
              value={formData.denNgayTheCu}
              onChange={(e) => handleInputChange('denNgayTheCu', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Mã bệnh viện */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã bệnh viện
            </label>
            <input
              type="text"
              value={formData.maBenhVien}
              onChange={(e) => handleInputChange('maBenhVien', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mã bệnh viện"
            />
          </div>

          {/* Mã hộ gia đình */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã hộ gia đình
            </label>
            <input
              type="text"
              value={formData.maHoGiaDinh}
              onChange={(e) => handleInputChange('maHoGiaDinh', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mã hộ gia đình"
            />
          </div>

          {/* Tỉnh KCB */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tỉnh KCB
            </label>
            <input
              type="text"
              value={formData.tinhKCB}
              onChange={(e) => handleInputChange('tinhKCB', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tỉnh KCB"
            />
          </div>

          {/* Nơi nhận hồ sơ */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nơi nhận hồ sơ
            </label>
            <input
              type="text"
              value={formData.noiNhanHoSo}
              onChange={(e) => handleInputChange('noiNhanHoSo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập nơi nhận hồ sơ"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
