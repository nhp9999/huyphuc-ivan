import React, { useState } from 'react';
import { Search, CreditCard, User, Calendar, MapPin, Building, Shield, Clock, AlertCircle, CheckCircle, Loader, Phone, DollarSign, Users } from 'lucide-react';
import { bhxhService } from '../services/bhxhService';
import { BhxhInfo, BhxhLookupResponse } from '../types/bhxh';

const BhxhLookup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [maSoBHXH, setMaSoBHXH] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BhxhLookupResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!maSoBHXH.trim()) {
      setError('Vui lòng nhập mã số BHXH');
      return;
    }

    if (maSoBHXH.length !== 10) {
      setError('Mã số BHXH phải có 10 chữ số');
      return;
    }

    setIsLoading(true);

    try {
      // Using mock function for testing - switch to real API when available
      const lookupResponse = await bhxhService.mockLookupBhxhInfo(maSoBHXH);
      // const lookupResponse = await bhxhService.lookupBhxhInfo(maSoBHXH);
      setResult(lookupResponse);
    } catch (error) {
      setError('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.');
      console.error('Lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  if (activeTab === 'bulk') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tra cứu hàng loạt BHXH</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tính năng tra cứu hàng loạt sẽ được phát triển trong phiên bản tiếp theo
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tính năng đang phát triển
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tính năng tra cứu hàng loạt BHXH sẽ sớm được cập nhật
            </p>
            <button
              onClick={() => setActiveTab('single')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Quay lại tra cứu đơn lẻ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderBhxhInfo = (info: BhxhInfo) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Thông tin BHXH
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tra cứu thành công
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mã số BHXH</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{info.maSoBHXH}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Họ và tên</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{info.hoTen}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày sinh</p>
                <p className="text-base text-gray-900 dark:text-white">{info.ngaySinh}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Giới tính</p>
                <p className="text-base text-gray-900 dark:text-white">{info.gioiTinh}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Địa chỉ</p>
                <p className="text-base text-gray-900 dark:text-white">{info.diaChi || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số điện thoại</p>
                <p className="text-base text-gray-900 dark:text-white">{info.soDienThoai || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CMND/CCCD</p>
                <p className="text-base text-gray-900 dark:text-white">{info.cmnd || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái tham gia</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  info.trangThaiThamGia === 'Đang tham gia'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {info.trangThaiThamGia}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tham gia</p>
                <p className="text-base text-gray-900 dark:text-white">{info.ngayThamGia}</p>
              </div>
            </div>

            {info.ngayNgungThamGia && (
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày ngừng tham gia</p>
                  <p className="text-base text-gray-900 dark:text-white">{info.ngayNgungThamGia}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mức lương</p>
                <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                  {parseInt(info.mucLuong).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ lệ đóng</p>
                <p className="text-base text-purple-600 dark:text-purple-400">{info.tyLeDong}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số tiền đóng/tháng</p>
                <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                  {parseInt(info.soTienDong).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đơn vị thu tiền</p>
                <p className="text-base text-gray-900 dark:text-white">{info.donViThuTien}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tình trạng đóng phí</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  info.tinhTrangDongPhi.includes('đủ')
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {info.tinhTrangDongPhi}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tra cứu thông tin BHXH</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Nhập mã số BHXH để tra cứu thông tin bảo hiểm xã hội
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'single'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Tra cứu đơn lẻ</span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'bulk'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Tra cứu hàng loạt</span>
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="maSoBHXH" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã số BHXH (10 chữ số)
            </label>
            <div className="relative">
              <input
                type="text"
                id="maSoBHXH"
                value={maSoBHXH}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMaSoBHXH(value);
                  setError('');
                }}
                placeholder="Nhập mã số BHXH (ví dụ: 0123456789)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
            disabled={isLoading || !maSoBHXH.trim()}
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
            renderBhxhInfo(result.data)
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Không tìm thấy thông tin
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result.message || 'Không tìm thấy thông tin BHXH tự nguyện với mã số này'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Hướng dẫn sử dụng
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• <strong>Tra cứu đơn lẻ:</strong> Nhập đúng 10 chữ số của mã số BHXH</li>
          <li>• <strong>Tra cứu hàng loạt:</strong> Tính năng sẽ được phát triển trong phiên bản tiếp theo</li>
          <li>• Mã số BHXH được cấp khi đăng ký tham gia BHXH</li>
          <li>• Thông tin tra cứu được cập nhật từ cơ sở dữ liệu chính thức</li>
          <li>• Dữ liệu mẫu để test: 0123456789, 9876543210</li>
        </ul>
      </div>
    </div>
  );
};

export default BhxhLookup;
