import React, { useState, useEffect } from 'react';
import { KeKhai603FormData } from '../../../hooks/useKeKhai603FormData';
import { Search, Loader2 } from 'lucide-react';
import { tinhService, TinhOption } from '../../../../shared/services/location/tinhService';
import { huyenService, HuyenOption } from '../../../../shared/services/location/huyenService';
import { xaService, XaOption } from '../../../../shared/services/location/xaService';
import { useCSKCBContext } from '../../contexts/CSKCBContext';
import { DmCSKCB } from '../../../../shared/services/api/supabaseClient';

interface KeKhai603PersonalInfoFormProps {
  formData: KeKhai603FormData;
  handleInputChange: (field: keyof KeKhai603FormData, value: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  searchLoading: boolean;
}

export const KeKhai603PersonalInfoForm: React.FC<KeKhai603PersonalInfoFormProps> = ({
  formData,
  handleInputChange,
  handleSearch,
  handleKeyPress,
  searchLoading
}) => {
  const [tinhOptions, setTinhOptions] = useState<TinhOption[]>([]);
  const [loadingTinh, setLoadingTinh] = useState(true);
  const [huyenKSOptions, setHuyenKSOptions] = useState<HuyenOption[]>([]);
  const [huyenNKQOptions, setHuyenNKQOptions] = useState<HuyenOption[]>([]);
  const [loadingHuyenKS, setLoadingHuyenKS] = useState(false);
  const [loadingHuyenNKQ, setLoadingHuyenNKQ] = useState(false);
  const [xaKSOptions, setXaKSOptions] = useState<XaOption[]>([]);
  const [xaNKQOptions, setXaNKQOptions] = useState<XaOption[]>([]);
  const [loadingXaKS, setLoadingXaKS] = useState(false);
  const [loadingXaNKQ, setLoadingXaNKQ] = useState(false);

  // CSKCB (Medical Facility) state
  const [cskcbOptions, setCSKCBOptions] = useState<DmCSKCB[]>([]);
  const [loadingCSKCB, setLoadingCSKCB] = useState(false);

  // Get CSKCB context
  const { getCSKCBData, isLoading: isCSKCBLoading } = useCSKCBContext();

  // Load province data on component mount
  useEffect(() => {
    const loadTinhData = async () => {
      try {
        setLoadingTinh(true);
        console.log('🌍 Loading province data...');
        const options = await tinhService.getTinhOptions();
        console.log('🌍 Province data loaded:', options.length, 'provinces');
        console.log('🌍 Sample province data:', options.slice(0, 3));
        setTinhOptions(options);
      } catch (error) {
        console.error('❌ Error loading province data:', error);
      } finally {
        setLoadingTinh(false);
      }
    };

    loadTinhData();
  }, []);

  // Load KS districts when KS province changes
  useEffect(() => {
    const loadHuyenKSData = async () => {
      if (!formData.maTinhKS) {
        setHuyenKSOptions([]);
        return;
      }

      try {
        setLoadingHuyenKS(true);
        const options = await huyenService.getHuyenOptionsByTinh(formData.maTinhKS);
        setHuyenKSOptions(options);
      } catch (error) {
        console.error('Error loading KS district data:', error);
        setHuyenKSOptions([]);
      } finally {
        setLoadingHuyenKS(false);
      }
    };

    loadHuyenKSData();
  }, [formData.maTinhKS]);

  // Load NKQ districts when NKQ province changes
  useEffect(() => {
    const loadHuyenNKQData = async () => {
      if (!formData.maTinhNkq) {
        setHuyenNKQOptions([]);
        return;
      }

      try {
        setLoadingHuyenNKQ(true);
        const options = await huyenService.getHuyenOptionsByTinh(formData.maTinhNkq);
        setHuyenNKQOptions(options);
      } catch (error) {
        console.error('Error loading NKQ district data:', error);
        setHuyenNKQOptions([]);
      } finally {
        setLoadingHuyenNKQ(false);
      }
    };

    loadHuyenNKQData();
  }, [formData.maTinhNkq]);

  // Load KS wards when KS district changes
  useEffect(() => {
    const loadXaKSData = async () => {
      if (!formData.maHuyenKS || !formData.maTinhKS) {
        setXaKSOptions([]);
        return;
      }

      try {
        setLoadingXaKS(true);
        const options = await xaService.getXaOptionsByHuyen(formData.maHuyenKS, formData.maTinhKS);
        setXaKSOptions(options);
      } catch (error) {
        console.error('Error loading KS ward data:', error);
        setXaKSOptions([]);
      } finally {
        setLoadingXaKS(false);
      }
    };

    loadXaKSData();
  }, [formData.maHuyenKS, formData.maTinhKS]);

  // Load NKQ wards when NKQ district changes
  useEffect(() => {
    const loadXaNKQData = async () => {
      if (!formData.maHuyenNkq || !formData.maTinhNkq) {
        setXaNKQOptions([]);
        return;
      }

      try {
        setLoadingXaNKQ(true);
        const options = await xaService.getXaOptionsByHuyen(formData.maHuyenNkq, formData.maTinhNkq);
        setXaNKQOptions(options);
      } catch (error) {
        console.error('Error loading NKQ ward data:', error);
        setXaNKQOptions([]);
      } finally {
        setLoadingXaNKQ(false);
      }
    };

    loadXaNKQData();
  }, [formData.maHuyenNkq, formData.maTinhNkq]);

  // Load all CSKCB data on component mount (no province filtering)
  useEffect(() => {
    const loadAllCSKCBData = async () => {
      try {
        setLoadingCSKCB(true);
        console.log('🏥 Loading all CSKCB data...');
        // Load all medical facilities without province filtering
        const data = await getCSKCBData(); // No province parameter = load all
        console.log('🏥 CSKCB data loaded:', data.length, 'facilities');
        console.log('🏥 Sample CSKCB data:', data.slice(0, 3));
        setCSKCBOptions(data);
      } catch (error) {
        console.error('❌ Error loading CSKCB data:', error);
        setCSKCBOptions([]);
      } finally {
        setLoadingCSKCB(false);
      }
    };

    loadAllCSKCBData();
  }, [getCSKCBData]); // Remove formData.tinhKCB dependency

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

          {/* Tỉnh KCB - Hidden but functional */}
          <div className="hidden">
            <select
              value={formData.tinhKCB}
              onChange={(e) => {
                handleInputChange('tinhKCB', e.target.value);
                // Reset cơ sở KCB khi thay đổi tỉnh
                handleInputChange('noiDangKyKCB', '');
              }}
              disabled={loadingTinh}
            >
              <option value="">
                {loadingTinh ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
              </option>
              {tinhOptions.map((tinh) => (
                <option key={tinh.value} value={tinh.value}>
                  {tinh.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nơi đăng ký KCB */}
          <div className="md:col-span-5 lg:col-span-5 xl:col-span-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nơi đăng ký KCB <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.noiDangKyKCB}
              onChange={(e) => {
                const selectedCSKCB = cskcbOptions.find(cskcb => cskcb.ten === e.target.value);
                handleInputChange('noiDangKyKCB', e.target.value);
                // Also update related fields if CSKCB is found
                if (selectedCSKCB) {
                  handleInputChange('tinhKCB', selectedCSKCB.ma_tinh);
                }
              }}
              disabled={loadingCSKCB}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">
                {loadingCSKCB
                  ? 'Đang tải cơ sở KCB...'
                  : 'Chọn cơ sở khám chữa bệnh'
                }
              </option>
              {cskcbOptions.map((cskcb, index) => {
                // Find province name from tinhOptions
                const provinceName = tinhOptions.find(tinh => tinh.value === cskcb.ma_tinh)?.label || cskcb.ma_tinh;

                // Debug logging for first few options
                if (index < 3) {
                  console.log(`🏥 Dropdown option ${index + 1}:`, {
                    facilityName: cskcb.ten,
                    provinceCode: cskcb.ma_tinh,
                    provinceName: provinceName,
                    displayText: `${cskcb.ten} - ${provinceName}`
                  });
                }

                return (
                  <option key={cskcb.value} value={cskcb.ten}>
                    {cskcb.ten} - {provinceName}
                  </option>
                );
              })}
            </select>
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

          {/* Địa chỉ khai sinh (KS) */}
          <div className="md:col-span-8 lg:col-span-10 xl:col-span-12">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
              Địa chỉ khai sinh (KS)
            </h3>
          </div>

          {/* Tỉnh KS */}
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tỉnh KS
            </label>
            <select
              value={formData.maTinhKS}
              onChange={(e) => handleInputChange('maTinhKS', e.target.value)}
              disabled={loadingTinh}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {loadingTinh ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
              </option>
              {tinhOptions.map((tinh) => (
                <option key={tinh.value} value={tinh.value}>
                  {tinh.label}
                </option>
              ))}
            </select>
          </div>

          {/* Huyện KS */}
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Huyện KS
            </label>
            <select
              value={formData.maHuyenKS}
              onChange={(e) => handleInputChange('maHuyenKS', e.target.value)}
              disabled={!formData.maTinhKS || loadingHuyenKS}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {loadingHuyenKS ? 'Đang tải...' : 'Chọn quận/huyện'}
              </option>
              {huyenKSOptions.map((huyen) => (
                <option key={huyen.value} value={huyen.value}>
                  {huyen.label}
                </option>
              ))}
            </select>
          </div>

          {/* Xã KS */}
          <div className="md:col-span-3 lg:col-span-4 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xã KS
            </label>
            <select
              value={formData.maXaKS}
              onChange={(e) => handleInputChange('maXaKS', e.target.value)}
              disabled={!formData.maHuyenKS || loadingXaKS}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {loadingXaKS ? 'Đang tải...' : 'Chọn phường/xã'}
              </option>
              {xaKSOptions.map((xa) => (
                <option key={xa.value} value={xa.value}>
                  {xa.label}
                </option>
              ))}
            </select>
          </div>

          {/* Địa chỉ nhận kết quả (NKQ) */}
          <div className="md:col-span-8 lg:col-span-10 xl:col-span-12">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
              Địa chỉ nhận kết quả (NKQ)
            </h3>
          </div>

          {/* Tỉnh NKQ */}
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tỉnh NKQ
            </label>
            <select
              value={formData.maTinhNkq}
              onChange={(e) => handleInputChange('maTinhNkq', e.target.value)}
              disabled={loadingTinh}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {loadingTinh ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
              </option>
              {tinhOptions.map((tinh) => (
                <option key={tinh.value} value={tinh.value}>
                  {tinh.label}
                </option>
              ))}
            </select>
          </div>

          {/* Huyện NKQ */}
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Huyện NKQ
            </label>
            <select
              value={formData.maHuyenNkq}
              onChange={(e) => handleInputChange('maHuyenNkq', e.target.value)}
              disabled={!formData.maTinhNkq || loadingHuyenNKQ}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {loadingHuyenNKQ ? 'Đang tải...' : 'Chọn quận/huyện'}
              </option>
              {huyenNKQOptions.map((huyen) => (
                <option key={huyen.value} value={huyen.value}>
                  {huyen.label}
                </option>
              ))}
            </select>
          </div>

          {/* Xã NKQ */}
          <div className="md:col-span-3 lg:col-span-4 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xã NKQ
            </label>
            <select
              value={formData.maXaNkq}
              onChange={(e) => handleInputChange('maXaNkq', e.target.value)}
              disabled={!formData.maHuyenNkq || loadingXaNKQ}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {loadingXaNKQ ? 'Đang tải...' : 'Chọn phường/xã'}
              </option>
              {xaNKQOptions.map((xa) => (
                <option key={xa.value} value={xa.value}>
                  {xa.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
