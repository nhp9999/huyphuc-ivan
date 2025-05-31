import React, { useState, useEffect } from 'react';
import { Search, Users, MapPin, User, AlertCircle, CheckCircle, Loader, Phone, Calendar, Hash } from 'lucide-react';
import { tinhService, TinhOption } from '../services/tinhService';
import { huyenService, HuyenOption } from '../services/huyenService';

interface FamilySearchCriteria {
  tinhKS: string;
  huyenKS: string;
  xaKS: string;
  tenChuHo: string;
  soHoKhau: string;
}

interface FamilyMember {
  stt: number;
  maThanhVien: string;
  maQuanHuyen: string;
  maXaPhuong: string;
  maHo: string;
  tenChuHo: string;
  loaiGiayTo: string;
  soHoKhau: string;
  dienThoai: string;
  diaChi: string;
  ngayKetKhai: string;
  trangThai: string;
}

interface FamilyLookupResponse {
  success: boolean;
  data?: FamilyMember[];
  message?: string;
  error?: string;
}

const FamilyLookup: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<FamilySearchCriteria>({
    tinhKS: '',
    huyenKS: '',
    xaKS: '',
    tenChuHo: '',
    soHoKhau: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FamilyLookupResponse | null>(null);
  const [error, setError] = useState('');
  const [tinhOptions, setTinhOptions] = useState<TinhOption[]>([]);
  const [loadingTinh, setLoadingTinh] = useState(true);
  const [huyenOptions, setHuyenOptions] = useState<HuyenOption[]>([]);
  const [loadingHuyen, setLoadingHuyen] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Validate required fields
    if (!searchCriteria.tinhKS) {
      setError('Vui lòng chọn tỉnh/thành phố');
      return;
    }

    if (!searchCriteria.huyenKS) {
      setError('Vui lòng chọn quận/huyện');
      return;
    }

    if (!searchCriteria.tenChuHo.trim()) {
      setError('Vui lòng nhập tên chủ hộ');
      return;
    }

    setIsLoading(true);

    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: FamilyMember[] = [
        {
          stt: 1,
          maThanhVien: 'TV001',
          maQuanHuyen: searchCriteria.huyenKS,
          maXaPhuong: searchCriteria.xaKS || 'XP001',
          maHo: 'HO001',
          tenChuHo: searchCriteria.tenChuHo,
          loaiGiayTo: 'Hộ khẩu',
          soHoKhau: searchCriteria.soHoKhau || 'HK123456789',
          dienThoai: '0123456789',
          diaChi: 'Số 123, Đường ABC, Phường XYZ',
          ngayKetKhai: '15/01/2024',
          trangThai: 'Đã kê khai'
        },
        {
          stt: 2,
          maThanhVien: 'TV002',
          maQuanHuyen: searchCriteria.huyenKS,
          maXaPhuong: searchCriteria.xaKS || 'XP001',
          maHo: 'HO001',
          tenChuHo: 'Nguyễn Thị B',
          loaiGiayTo: 'CCCD',
          soHoKhau: searchCriteria.soHoKhau || 'HK123456789',
          dienThoai: '0987654321',
          diaChi: 'Số 123, Đường ABC, Phường XYZ',
          ngayKetKhai: '15/01/2024',
          trangThai: 'Đã kê khai'
        }
      ];

      setResult({
        success: true,
        data: mockData,
        message: 'Tra cứu thành công'
      });
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tra cứu hộ gia đình</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Nhập thông tin để tra cứu thông tin hộ gia đình
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
                disabled={isLoading || !searchCriteria.huyenKS}
              >
                <option value="">Chọn phường/xã</option>
                {searchCriteria.huyenKS && (
                  <>
                    <option value="00001">Phúc Xá</option>
                    <option value="00002">Trúc Bạch</option>
                    <option value="00003">Vĩnh Phúc</option>
                    <option value="00004">Cống Vị</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tenChuHo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên chủ hộ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="tenChuHo"
                  value={searchCriteria.tenChuHo}
                  onChange={(e) => {
                    setSearchCriteria(prev => ({ ...prev, tenChuHo: e.target.value }));
                    setError('');
                  }}
                  placeholder="Nhập tên chủ hộ"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="soHoKhau" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số hộ khẩu
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="soHoKhau"
                  value={searchCriteria.soHoKhau}
                  onChange={(e) => {
                    setSearchCriteria(prev => ({ ...prev, soHoKhau: e.target.value }));
                    setError('');
                  }}
                  placeholder="Nhập số hộ khẩu (nếu có)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <Hash className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
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
            disabled={isLoading || !searchCriteria.tenChuHo.trim() || !searchCriteria.tinhKS || !searchCriteria.huyenKS}
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
                <span>Tra Cứu</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div>
          {result.success && result.data && result.data.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Kết quả tra cứu hộ gia đình
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tìm thấy {result.data.length} thành viên trong hộ gia đình
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 dark:bg-blue-900/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mã thành viên</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mã quận/huyện</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mã xã/phường</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mã hộ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tên chủ hộ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Loại giấy tờ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Số hộ khẩu</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Điện thoại</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Địa chỉ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ngày kê khai</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {result.data.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.stt}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                          {member.maThanhVien}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.maQuanHuyen}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.maXaPhuong}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.maHo}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.tenChuHo}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.loaiGiayTo}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.soHoKhau}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.dienThoai}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {member.diaChi}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.ngayKetKhai}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {member.trangThai}
                          </span>
                        </td>
                      </tr>
                    ))}
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
                        tenChuHo: '',
                        soHoKhau: ''
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
                      if (result?.data) {
                        const csvHeader = 'STT,Mã thành viên,Mã quận/huyện,Mã xã/phường,Mã hộ,Tên chủ hộ,Loại giấy tờ,Số hộ khẩu,Điện thoại,Địa chỉ,Ngày kê khai,Trạng thái\n';
                        const csvContent = csvHeader + result.data.map(member =>
                          `${member.stt},${member.maThanhVien},${member.maQuanHuyen},${member.maXaPhuong},${member.maHo},"${member.tenChuHo}",${member.loaiGiayTo},${member.soHoKhau},${member.dienThoai},"${member.diaChi}",${member.ngayKetKhai},${member.trangThai}`
                        ).join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'ket-qua-tra-cuu-ho-gia-dinh.csv';
                        a.click();
                        window.URL.revokeObjectURL(url);
                      }
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
                  {result.message || 'Không tìm thấy thông tin hộ gia đình với các tiêu chí đã nhập'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Hướng dẫn tra cứu hộ gia đình
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• <strong>Thông tin bắt buộc:</strong> Tỉnh KS, Huyện KS và Tên chủ hộ</li>
          <li>• <strong>Địa chỉ hành chính:</strong> Chọn Tỉnh → Huyện → Xã theo thứ tự</li>
          <li>• <strong>Số hộ khẩu:</strong> Có thể bỏ trống nếu không biết chính xác</li>
          <li>• <strong>Kết quả:</strong> Hiển thị tất cả thành viên trong hộ gia đình</li>
          <li>• <strong>Thông tin chi tiết:</strong> Bao gồm mã số, giấy tờ, địa chỉ và trạng thái kê khai</li>
        </ul>
      </div>
    </div>
  );
};

export default FamilyLookup;
