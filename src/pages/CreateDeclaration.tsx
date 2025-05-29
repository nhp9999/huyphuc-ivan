import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { donViService } from '../services/donViService';
import { daiLyService } from '../services/daiLyService';
import { VDonViChiTiet, VDaiLyChiTiet } from '../services/supabaseClient';
import {
  FileText,
  User,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Save,
  Send,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const CreateDeclaration: React.FC = () => {
  const { pageParams, setCurrentPage } = useNavigation();

  // State cho dữ liệu đơn vị
  const [donViList, setDonViList] = useState<VDonViChiTiet[]>([]);
  const [filteredDonViList, setFilteredDonViList] = useState<VDonViChiTiet[]>([]);
  const [loadingDonVi, setLoadingDonVi] = useState(false);
  const [errorDonVi, setErrorDonVi] = useState<string | null>(null);
  const [selectedDonVi, setSelectedDonVi] = useState<VDonViChiTiet | null>(null);

  // State cho dữ liệu đại lý
  const [daiLyList, setDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [filteredDaiLyList, setFilteredDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [loadingDaiLy, setLoadingDaiLy] = useState(false);
  const [errorDaiLy, setErrorDaiLy] = useState<string | null>(null);
  const [selectedDaiLy, setSelectedDaiLy] = useState<VDaiLyChiTiet | null>(null);

  const [formData, setFormData] = useState({
    // Thông tin đại lý
    bienLaiDienTu: true,
    chonDonVi: '',
    chonDaiLy: '',

    // Nghiệp vụ
    doiTuongThamGia: 'GD - Hộ gia đình',
    hinhThucTinh: 'Ngân sách nhà nước hỗ trợ mức đóng',
    luongCoSo: '2,340,000',
    nguonDong: '',
    tuDong: '',

    // Form fields
    noiDangKyKCBBanDau: '',
    bienLaiNgayThamGia: '',
    soThang: '',
    ngay: '',
    tyLeNSNNHoTro: '',
    ghiChu: '',
    tongTien: '0'
  });

  const declarationCode = pageParams?.code || '603';
  const declarationName = pageParams?.name || 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT';

  // Load dữ liệu đơn vị từ Supabase
  const loadDonViData = async () => {
    setLoadingDonVi(true);
    setErrorDonVi(null);
    try {
      // Lọc đơn vị có dịch vụ BHYT dựa trên mã thủ tục
      const searchParams = {
        loaiDichVu: 'BHYT' as const, // Chỉ lấy đơn vị có dịch vụ BHYT
        trangThai: 'active'
      };

      const donViData = await donViService.searchDonVi(searchParams);
      setDonViList(donViData);
      setFilteredDonViList(donViData);
    } catch (err) {
      console.error('Error loading don vi data:', err);
      setErrorDonVi('Không thể tải danh sách đơn vị. Vui lòng thử lại.');
    } finally {
      setLoadingDonVi(false);
    }
  };

  // Load dữ liệu đại lý từ Supabase
  const loadDaiLyData = async () => {
    setLoadingDaiLy(true);
    setErrorDaiLy(null);
    try {
      const daiLyData = await daiLyService.getAllDaiLy();
      setDaiLyList(daiLyData);
      setFilteredDaiLyList(daiLyData);
    } catch (err) {
      console.error('Error loading dai ly data:', err);
      setErrorDaiLy('Không thể tải danh sách đại lý. Vui lòng thử lại.');
    } finally {
      setLoadingDaiLy(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadDonViData();
    loadDaiLyData();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Xử lý khi chọn đơn vị
  const handleDonViChange = (donViId: string) => {
    const selectedDonViData = donViList.find(dv => dv.id.toString() === donViId);
    setSelectedDonVi(selectedDonViData || null);

    // Cập nhật form data
    handleInputChange('chonDonVi', donViId);

    // Tự động điền đối tượng tham gia dựa trên khối KCB
    if (selectedDonViData && selectedDonViData.ma_khoi_kcb) {
      const doiTuongText = `${selectedDonViData.ma_khoi_kcb} - ${selectedDonViData.ten_khoi_kcb}`;
      handleInputChange('doiTuongThamGia', doiTuongText);
    } else if (!selectedDonViData) {
      // Reset về mặc định khi không chọn đơn vị
      handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');
    }
  };

  // Xử lý khi chọn đại lý
  const handleDaiLyChange = async (daiLyId: string) => {
    const selectedDaiLyData = daiLyList.find(dl => dl.id.toString() === daiLyId);
    setSelectedDaiLy(selectedDaiLyData || null);

    // Cập nhật form data
    handleInputChange('chonDaiLy', daiLyId);

    // Tự động lọc đơn vị theo đại lý được chọn
    if (selectedDaiLyData) {
      try {
        setLoadingDonVi(true);
        const donViByDaiLy = await daiLyService.getDonViByDaiLy(selectedDaiLyData.id);
        setFilteredDonViList(donViByDaiLy);

        // Reset đơn vị đã chọn vì danh sách đã thay đổi
        setSelectedDonVi(null);
        handleInputChange('chonDonVi', '');
        handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');

        console.log('Filtered don vi by dai ly:', donViByDaiLy);
      } catch (err) {
        console.error('Error loading don vi by dai ly:', err);
        setErrorDonVi('Không thể tải danh sách đơn vị cho đại lý này.');
      } finally {
        setLoadingDonVi(false);
      }
    } else {
      // Reset về tất cả đơn vị khi không chọn đại lý
      setFilteredDonViList(donViList);
      setSelectedDonVi(null);
      handleInputChange('chonDonVi', '');
      handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');
    }
  };

  const handleSave = () => {
    console.log('Saving declaration:', formData);
    // Implement save logic
  };

  const handleSubmit = () => {
    console.log('Submitting declaration:', formData);
    // Chuyển hướng đến trang kê khai BHYT
    setCurrentPage('bhyt-declaration', {
      declarationCode,
      declarationName,
      formData
    });
  };

  const handleExport = () => {
    console.log('Exporting declaration:', formData);
    // Implement export logic
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Tạo kê khai</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 break-words">
            {declarationCode} - {declarationName}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={() => {
              loadDonViData();
              loadDaiLyData();
            }}
            disabled={loadingDonVi || loadingDaiLy}
            className="flex items-center justify-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-3 sm:py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors min-h-[44px] text-sm sm:text-base disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${(loadingDonVi || loadingDaiLy) ? 'animate-spin' : ''}`} />
            <span>{(loadingDonVi || loadingDaiLy) ? 'Đang tải...' : 'Tải dữ liệu'}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[44px] text-sm sm:text-base"
          >
            <Save className="w-4 h-4" />
            <span>Lưu C4S</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-3 sm:py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors min-h-[44px] text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span>Import tờ khai</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.chonDonVi}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
          >
            <Send className="w-4 h-4" />
            <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      {/* Error Alerts */}
      {errorDonVi && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{errorDonVi}</span>
            <button
              onClick={loadDonViData}
              className="ml-auto flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {errorDaiLy && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{errorDaiLy}</span>
            <button
              onClick={loadDaiLyData}
              className="ml-auto flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Thông tin đại lý Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Thông tin đại lý</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
              {loadingDonVi ? (
                <span className="flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Đang tải...</span>
                </span>
              ) : (
                <span>
                  Có <strong className="text-blue-600 dark:text-blue-400">{filteredDonViList.length}</strong> đơn vị BHYT khả dụng
                  {selectedDonVi && (
                    <span className="ml-2 text-green-600 dark:text-green-400">
                      • Đã chọn: {selectedDonVi.ma_so_bhxh}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bienLaiDienTu"
                checked={formData.bienLaiDienTu}
                onChange={(e) => handleInputChange('bienLaiDienTu', e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="bienLaiDienTu" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                Biên lai điện tử
              </label>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn đại lý (*)
                </label>
                <div className="relative">
                  <select
                    value={formData.chonDaiLy}
                    onChange={(e) => handleDaiLyChange(e.target.value)}
                    disabled={loadingDaiLy}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingDaiLy
                        ? 'Đang tải đại lý...'
                        : filteredDaiLyList.length === 0
                        ? 'Không có đại lý nào'
                        : 'Chọn đại lý'}
                    </option>
                    {filteredDaiLyList.map((daiLy) => (
                      <option key={daiLy.id} value={daiLy.id.toString()}>
                        {daiLy.ma} - {daiLy.ten}
                      </option>
                    ))}
                  </select>
                  {loadingDaiLy && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                {selectedDaiLy && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xs text-green-800 dark:text-green-200">
                      <div><strong>Mã đại lý:</strong> {selectedDaiLy.ma}</div>
                      <div><strong>Tên đại lý:</strong> {selectedDaiLy.ten}</div>
                      {selectedDaiLy.loai_dai_ly && (
                        <div><strong>Loại:</strong> {selectedDaiLy.loai_dai_ly}</div>
                      )}
                      {selectedDaiLy.ten_cap && (
                        <div><strong>Cấp:</strong> {selectedDaiLy.ten_cap}</div>
                      )}
                      {selectedDaiLy.ma_tinh && (
                        <div><strong>Mã tỉnh:</strong> {selectedDaiLy.ma_tinh}</div>
                      )}
                      {selectedDaiLy.ten_cha && (
                        <div><strong>Đại lý cha:</strong> {selectedDaiLy.ma_cha} - {selectedDaiLy.ten_cha}</div>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {loadingDaiLy ? (
                    <span className="flex items-center space-x-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Đang tải đại lý...</span>
                    </span>
                  ) : (
                    <span>
                      Có <strong className="text-green-600 dark:text-green-400">{filteredDaiLyList.length}</strong> đại lý khả dụng
                      {selectedDaiLy && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          • Đã chọn: {selectedDaiLy.ma}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn đơn vị (*)
                </label>
                <div className="relative">
                  <select
                    value={formData.chonDonVi}
                    onChange={(e) => handleDonViChange(e.target.value)}
                    disabled={loadingDonVi}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingDonVi
                        ? 'Đang tải đơn vị...'
                        : filteredDonViList.length === 0
                        ? 'Không có đơn vị BHYT nào'
                        : 'Chọn đơn vị'}
                    </option>
                    {filteredDonViList.map((donVi) => (
                      <option key={donVi.id} value={donVi.id.toString()}>
                        {donVi.ma_so_bhxh} - {donVi.ten_don_vi}
                      </option>
                    ))}
                  </select>
                  {loadingDonVi && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                {selectedDonVi && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-blue-800 dark:text-blue-200">
                      <div><strong>Loại dịch vụ:</strong> {selectedDonVi.loai_dich_vu}</div>
                      <div><strong>Loại đơn vị:</strong> {selectedDonVi.loai_don_vi}</div>
                      {selectedDonVi.ma_co_quan_bhxh && (
                        <div><strong>Mã cơ quan BHXH:</strong> {selectedDonVi.ma_co_quan_bhxh}</div>
                      )}
                      {selectedDonVi.ten_khoi_kcb && (
                        <div><strong>Khối KCB:</strong> {selectedDonVi.ten_khoi_kcb}</div>
                      )}
                      {selectedDonVi.ten_dai_ly && (
                        <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                          <div><strong>Đại lý quản lý:</strong> {selectedDonVi.ma_dai_ly} - {selectedDonVi.ten_dai_ly}</div>
                          {selectedDonVi.loai_dai_ly && (
                            <div><strong>Loại đại lý:</strong> {selectedDonVi.loai_dai_ly}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nghiệp vụ Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Nghiệp vụ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đối tượng tham gia
              </label>
              <input
                type="text"
                value={formData.doiTuongThamGia}
                onChange={(e) => handleInputChange('doiTuongThamGia', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="Nhập đối tượng tham gia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hình thức tính
              </label>
              <select
                value={formData.hinhThucTinh}
                onChange={(e) => handleInputChange('hinhThucTinh', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              >
                <option value="Ngân sách nhà nước hỗ trợ mức đóng">Ngân sách nhà nước hỗ trợ mức đóng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lương cơ sở
              </label>
              <input
                type="text"
                value={formData.luongCoSo}
                onChange={(e) => handleInputChange('luongCoSo', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="Nhập lương cơ sở"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nguồn đóng (*)
              </label>
              <input
                type="text"
                value={formData.nguonDong}
                onChange={(e) => handleInputChange('nguonDong', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="Nhập nguồn đóng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tự động
              </label>
              <input
                type="text"
                value={formData.tuDong}
                onChange={(e) => handleInputChange('tuDong', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="Tự động"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tổng tiền
              </label>
              <input
                type="text"
                value={formData.tongTien}
                onChange={(e) => handleInputChange('tongTien', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="Tổng tiền"
                readOnly
              />
            </div>
          </div>
        </div>


      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
            Danh sách người tham gia
          </h3>
        </div>

        {/* Mobile-friendly table */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table header - hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                <div className="col-span-1">STT</div>
                <div className="col-span-1">Phương án</div>
                <div className="col-span-2">Họ và tên</div>
                <div className="col-span-1">Mã số BHXH</div>
                <div className="col-span-1">Ngày sinh</div>
                <div className="col-span-1">Giới tính</div>
                <div className="col-span-2">Nơi ĐK KCB ban đầu</div>
                <div className="col-span-1">Biên lai</div>
                <div className="col-span-1">Tỷ lệ NSNN</div>
                <div className="col-span-1">Ghi chú</div>
              </div>
            </div>

            {/* Empty state */}
            <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">Không có dữ liệu</p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                Nhấn "Thêm Mới" để bắt đầu thêm người tham gia
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CreateDeclaration;
