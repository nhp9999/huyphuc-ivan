import React, { useState, useEffect } from 'react';
import { Search, CreditCard, User, Calendar, AlertCircle, CheckCircle, Loader, Hash, MapPin } from 'lucide-react';
import { bhxhService } from '../services/bhxhService';
import { tinhService, TinhOption } from '../../../shared/services/location/tinhService';
import { huyenService, HuyenOption } from '../../../shared/services/location/huyenService';
import { xaService, XaOption } from '../../../shared/services/location/xaService';
import { BhxhLookupResponse } from '../types/bhxh';

interface SearchCriteria {
  tinhKS: string;
  huyenKS: string;
  xaKS: string;
  hoTen: string;
  ngaySinh: string;
  soCCCD: string;
  coGiayTo: 'co' | 'khong';
}

const BhxhIdLookup: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    tinhKS: '',
    huyenKS: '',
    xaKS: '',
    hoTen: '',
    ngaySinh: '',
    soCCCD: '',
    coGiayTo: 'co'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BhxhLookupResponse | null>(null);
  const [error, setError] = useState('');
  const [tinhOptions, setTinhOptions] = useState<TinhOption[]>([]);
  const [loadingTinh, setLoadingTinh] = useState(true);
  const [huyenOptions, setHuyenOptions] = useState<HuyenOption[]>([]);
  const [loadingHuyen, setLoadingHuyen] = useState(false);
  const [xaOptions, setXaOptions] = useState<XaOption[]>([]);
  const [loadingXa, setLoadingXa] = useState(false);

  // Load province data on component mount
  useEffect(() => {
    const loadTinhData = async () => {
      try {
        setLoadingTinh(true);
        const options = await tinhService.getTinhOptions();
        setTinhOptions(options);
      } catch (error) {
        console.error('Error loading province data:', error);
        setError('Không thể tải dữ liệu tỉnh thành. Vui lòng thử lại.');
      } finally {
        setLoadingTinh(false);
      }
    };

    loadTinhData();
  }, []);

  // Load district data when province changes
  useEffect(() => {
    const loadHuyenData = async () => {
      if (!searchCriteria.tinhKS) {
        setHuyenOptions([]);
        return;
      }

      try {
        setLoadingHuyen(true);
        const options = await huyenService.getHuyenOptionsByTinh(searchCriteria.tinhKS);
        setHuyenOptions(options);
      } catch (error) {
        console.error('Error loading district data:', error);
        setHuyenOptions([]);
      } finally {
        setLoadingHuyen(false);
      }
    };

    loadHuyenData();
  }, [searchCriteria.tinhKS]);

  // Load ward data when district changes
  useEffect(() => {
    const loadXaData = async () => {
      if (!searchCriteria.huyenKS || !searchCriteria.tinhKS) {
        setXaOptions([]);
        return;
      }

      try {
        setLoadingXa(true);
        const options = await xaService.getXaOptionsByHuyen(searchCriteria.huyenKS, searchCriteria.tinhKS);
        setXaOptions(options);
      } catch (error) {
        console.error('Error loading ward data:', error);
        setXaOptions([]);
      } finally {
        setLoadingXa(false);
      }
    };

    loadXaData();
  }, [searchCriteria.huyenKS, searchCriteria.tinhKS]);

  // Helper function to get province name by value
  const getTinhName = (value: string): string => {
    const tinh = tinhOptions.find(t => t.value === value);
    return tinh?.label || value;
  };

  // Helper function to get district name by value
  const getHuyenName = (value: string): string => {
    const huyen = huyenOptions.find(h => h.value === value);
    return huyen?.label || value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Validate required fields
    if (!searchCriteria.hoTen.trim()) {
      setError('Vui lòng nhập họ và tên');
      return;
    }

    if (!searchCriteria.ngaySinh) {
      setError('Vui lòng nhập ngày sinh');
      return;
    }

    if (!searchCriteria.tinhKS) {
      setError('Vui lòng chọn tỉnh/thành phố');
      return;
    }

    setIsLoading(true);

    try {
      // For now, use mock data - in real implementation, this would call a specific API
      // that searches by multiple criteria instead of just BHXH ID
      const mockMaSoBHXH = '0123456789'; // This would be determined by the search criteria
      const lookupResponse = await bhxhService.mockLookupBhxhInfo(mockMaSoBHXH);
      setResult(lookupResponse);
    } catch (error) {
      setError('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.');
      console.error('Lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tra cứu mã số Bảo hiểm xã hội</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Nhập thông tin cá nhân để tra cứu mã số BHXH và thông tin liên quan
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="tinhKS" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tỉnh KS <span className="text-red-500">*</span>
              </label>
              <select
                id="tinhKS"
                value={searchCriteria.tinhKS}
                onChange={(e) => {
                  setSearchCriteria(prev => ({ ...prev, tinhKS: e.target.value, huyenKS: '', xaKS: '' }));
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading || loadingTinh}
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

            <div>
              <label htmlFor="huyenKS" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Huyện KS <span className="text-red-500">*</span>
              </label>
              <select
                id="huyenKS"
                value={searchCriteria.huyenKS}
                onChange={(e) => {
                  setSearchCriteria(prev => ({ ...prev, huyenKS: e.target.value, xaKS: '' }));
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading || !searchCriteria.tinhKS || loadingHuyen}
              >
                <option value="">
                  {loadingHuyen ? 'Đang tải...' : 'Chọn quận/huyện'}
                </option>
                {huyenOptions.map((huyen) => (
                  <option key={huyen.value} value={huyen.value}>
                    {huyen.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="xaKS" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Xã KS
              </label>
              <select
                id="xaKS"
                value={searchCriteria.xaKS}
                onChange={(e) => {
                  setSearchCriteria(prev => ({ ...prev, xaKS: e.target.value }));
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading || !searchCriteria.huyenKS || loadingXa}
              >
                <option value="">
                  {loadingXa ? 'Đang tải...' : 'Chọn phường/xã'}
                </option>
                {xaOptions.map((xa) => (
                  <option key={xa.value} value={xa.value}>
                    {xa.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hoTen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="hoTen"
                  value={searchCriteria.hoTen}
                  onChange={(e) => {
                    setSearchCriteria(prev => ({ ...prev, hoTen: e.target.value }));
                    setError('');
                  }}
                  placeholder="Nhập họ và tên đầy đủ"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="ngaySinh" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày sinh
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="ngaySinh"
                  value={searchCriteria.ngaySinh}
                  onChange={(e) => {
                    setSearchCriteria(prev => ({ ...prev, ngaySinh: e.target.value }));
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* ID Document Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Số CCCD
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="coGiayTo"
                    value="co"
                    checked={searchCriteria.coGiayTo === 'co'}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, coGiayTo: e.target.value as 'co' | 'khong' }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Có đầu</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="coGiayTo"
                    value="khong"
                    checked={searchCriteria.coGiayTo === 'khong'}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, coGiayTo: e.target.value as 'co' | 'khong' }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Không đầu</span>
                </label>
              </div>

              {searchCriteria.coGiayTo === 'co' && (
                <div className="relative">
                  <input
                    type="text"
                    value={searchCriteria.soCCCD}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                      setSearchCriteria(prev => ({ ...prev, soCCCD: value }));
                      setError('');
                    }}
                    placeholder="Nhập số CCCD (12 chữ số)"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  />
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !searchCriteria.hoTen.trim() || !searchCriteria.tinhKS}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Đang tra cứu...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Tra cứu</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div>
          {result.success && result.data ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Kết quả tra cứu
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 dark:bg-blue-900/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mã số BHXH</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Họ tên</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Giới tính</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ngày sinh</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Số CCCD</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mã KV</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Địa chỉ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">1</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        {result.data.maSoBHXH}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {result.data.hoTen}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {result.data.gioiTinh}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {result.data.ngaySinh}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {result.data.cmnd || 'Chưa cập nhật'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getTinhName(searchCriteria.tinhKS)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {result.data.diaChi || 'Chưa cập nhật'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          result.data.trangThaiThamGia === 'Đang tham gia'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {result.data.trangThaiThamGia}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action buttons */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setSearchCriteria({
                        tinhKS: '',
                        huyenKS: '',
                        xaKS: '',
                        hoTen: '',
                        ngaySinh: '',
                        soCCCD: '',
                        coGiayTo: 'co'
                      });
                      setResult(null);
                      setError('');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Tra cứu mới
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    In kết quả
                  </button>
                  <button
                    onClick={() => {
                      const csvContent = `STT,Mã số BHXH,Họ tên,Giới tính,Ngày sinh,Số CCCD,Mã KV,Địa chỉ,Trạng thái\n1,${result.data?.maSoBHXH},${result.data?.hoTen},${result.data?.gioiTinh},${result.data?.ngaySinh},${result.data?.cmnd || ''},${getTinhName(searchCriteria.tinhKS)},${result.data?.diaChi || ''},${result.data?.trangThaiThamGia}`;
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'ket-qua-tra-cuu-bhxh.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Xuất CSV
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Không có dữ liệu
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {result.message || 'Không tìm thấy thông tin BHXH với các tiêu chí đã nhập'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Hướng dẫn tra cứu mã số BHXH
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• <strong>Thông tin bắt buộc:</strong> Tỉnh KS và Họ tên là các trường bắt buộc</li>
          <li>• <strong>Địa chỉ hành chính:</strong> Chọn Tỉnh → Huyện → Xã theo thứ tự</li>
          <li>• <strong>Số CCCD:</strong> Chọn "Có đầu" nếu biết số CCCD, "Không đầu" nếu không biết</li>
          <li>• <strong>Kết quả:</strong> Hiển thị dạng bảng với đầy đủ thông tin BHXH</li>
          <li>• <strong>Xuất dữ liệu:</strong> Có thể in hoặc xuất file CSV kết quả tra cứu</li>
        </ul>
      </div>
    </div>
  );
};

export default BhxhIdLookup;
