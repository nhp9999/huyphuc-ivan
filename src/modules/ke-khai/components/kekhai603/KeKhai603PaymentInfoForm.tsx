import React from 'react';
import { KeKhai603FormData } from '../../../hooks/useKeKhai603FormData';

interface KeKhai603PaymentInfoFormProps {
  formData: KeKhai603FormData;
  handleInputChange: (field: keyof KeKhai603FormData, value: string) => void;
}

export const KeKhai603PaymentInfoForm: React.FC<KeKhai603PaymentInfoFormProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thông tin đóng BHYT
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
          {/* Mức lương */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mức lương
            </label>
            <input
              type="text"
              value={formData.mucLuong}
              onChange={(e) => handleInputChange('mucLuong', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mức lương"
            />
          </div>

          {/* Tỷ lệ đóng */}
          <div className="md:col-span-1 lg:col-span-1 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tỷ lệ đóng (% lương cơ sở)
            </label>
            <input
              type="text"
              value={formData.tyLeDong}
              onChange={(e) => handleInputChange('tyLeDong', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="100"
              readOnly
            />
          </div>

          {/* Số tiền đóng */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số tiền đóng
            </label>
            <input
              type="text"
              value={formData.soTienDong}
              onChange={(e) => handleInputChange('soTienDong', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Số tiền đóng"
              readOnly
            />
          </div>

          {/* STT hộ */}
          <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              STT hộ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.sttHo}
              onChange={(e) => handleInputChange('sttHo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                !formData.sttHo
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            >
              <option value="">Chọn STT hộ</option>
              <option value="1">Người thứ 1 (100% lương cơ sở)</option>
              <option value="2">Người thứ 2 (70% lương cơ sở)</option>
              <option value="3">Người thứ 3 (60% lương cơ sở)</option>
              <option value="4">Người thứ 4 (50% lương cơ sở)</option>
              <option value="5+">Người thứ 5+ (40% lương cơ sở)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tiền đóng = Lương cơ sở × Tỷ lệ theo thứ tự
            </p>
          </div>

          {/* Số tháng đóng */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số tháng đóng <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.soThangDong}
              onChange={(e) => handleInputChange('soThangDong', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                !formData.soThangDong
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            >
              <option value="">Chọn số tháng</option>
              <option value="3">3 tháng</option>
              <option value="6">6 tháng</option>
              <option value="12">12 tháng</option>
            </select>
          </div>

          {/* Từ ngày thẻ mới */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Từ ngày thẻ mới
            </label>
            <input
              type="date"
              value={formData.tuNgayTheMoi}
              onChange={(e) => handleInputChange('tuNgayTheMoi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              readOnly
            />
          </div>

          {/* Đến ngày thẻ mới */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đến ngày thẻ mới
            </label>
            <input
              type="date"
              value={formData.denNgayTheMoi}
              onChange={(e) => handleInputChange('denNgayTheMoi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              readOnly
            />
          </div>

          {/* Ngày biên lai */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày biên lai
            </label>
            <input
              type="date"
              value={formData.ngayBienLai}
              onChange={(e) => handleInputChange('ngayBienLai', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Ghi chú đóng phí */}
          <div className="md:col-span-4 lg:col-span-4 xl:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú đóng phí
            </label>
            <textarea
              value={formData.ghiChuDongPhi}
              onChange={(e) => handleInputChange('ghiChuDongPhi', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Nhập ghi chú đóng phí"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
