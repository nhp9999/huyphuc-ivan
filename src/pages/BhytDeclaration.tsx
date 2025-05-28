import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { bhytService } from '../services/bhytService';
import { BhytDeclarationRequest } from '../types/bhyt';
import Toast from '../components/Toast';
import {
  FileText,
  User,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Save,
  Send,
  Printer,
  Download,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2
} from 'lucide-react';

const BhytDeclaration: React.FC = () => {
  const { pageParams, setCurrentPage } = useNavigation();
  const [formData, setFormData] = useState({
    // Thông tin cơ bản
    hoTen: '',
    maSoBHXH: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    soCCCD: '',
    noiDangKyKCB: '',
    diaChi: '',
    soDienThoai: '',
    email: '',
    soTheBHYT: '',
    quocTich: 'VN',
    danToc: '',

    // Thông tin địa chỉ
    maTinhKS: '',
    maHuyenKS: '',
    maXaKS: '',
    maTinhNkq: '',
    maHuyenNkq: '',
    maXaNkq: '',

    // Thông tin BHYT
    loaiDoiTuong: 'GD',
    mucLuong: '',
    tyLeDong: '4.5',
    tuThang: '',
    denThang: '',
    soTienDong: '',
    ghiChu: '',
    tinhKCB: '',
    noiNhanHoSo: '',
    maBenhVien: '',
    maHoGiaDinh: '',
    phuongAn: '',
    trangThai: '',
    moTa: ''
  });



  const [participants, setParticipants] = useState([
    {
      id: 1,
      hoTen: '',
      maSoBHXH: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      noiDangKyKCB: '',
      mucLuong: '',
      tyLeDong: '4.5',
      tuThang: '',
      denThang: '',
      soTienDong: '',
      ghiChu: ''
    }
  ]);

  // State cho tính năng tìm kiếm
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchConfig] = useState({
    mangLuoiId: 76255,
    ma: 'BI0110G',
    maCoQuanBHXH: '08907'
  });

  // State cho toast notification
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning'
  });

  // Helper function để hiển thị toast
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    setParticipants(prev => prev.map((participant, i) =>
      i === index ? { ...participant, [field]: value } : participant
    ));
  };

  const addParticipant = () => {
    const newParticipant = {
      id: participants.length + 1,
      hoTen: '',
      maSoBHXH: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      noiDangKyKCB: '',
      mucLuong: '',
      tyLeDong: '4.5',
      tuThang: '',
      denThang: '',
      soTienDong: '',
      ghiChu: ''
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Hàm tìm kiếm cho participant cụ thể
  const handleSearchParticipant = async (index: number) => {
    const participant = participants[index];
    if (!participant.maSoBHXH.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    setSearchLoading(true);
    try {
      const request: BhytDeclarationRequest = {
        maSoBHXH: participant.maSoBHXH.trim(),
        mangLuoiId: searchConfig.mangLuoiId,
        ma: searchConfig.ma,
        maCoQuanBHXH: searchConfig.maCoQuanBHXH
      };

      // Sử dụng API thực để tìm kiếm
      const response = await bhytService.lookupBhytForDeclaration(request);

      if (response.success && response.data) {
        // Cập nhật participant cụ thể
        setParticipants(prev => prev.map((p, i) =>
          i === index ? {
            ...p,
            hoTen: response.data!.hoTen,
            maSoBHXH: response.data!.maSoBhxh,
            ngaySinh: response.data!.ngaySinh,
            gioiTinh: response.data!.gioiTinh,
            noiDangKyKCB: response.data!.noiDangKyKCB,
            mucLuong: response.data!.mucLuong || '',
            tyLeDong: response.data!.tyLeDong || '4.5',
            soTienDong: response.data!.soTienDong || ''
          } : p
        ));

        showToast('Đã tìm thấy và điền thông tin BHYT thành công!', 'success');
      } else {
        showToast(response.message || 'Không tìm thấy thông tin BHYT', 'error');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSave = () => {
    console.log('Saving BHYT declaration:', { formData, participants });
    // Implement save logic
  };

  const handleSubmit = () => {
    console.log('Submitting BHYT declaration:', { formData, participants });
    // Implement submit logic
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting BHYT declaration:', { formData, participants });
    // Implement export logic
  };

  const handleBack = () => {
    setCurrentPage('create-declaration');
  };

  // Hàm xử lý khi bấm Enter trong ô mã số BHXH
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchBhytDirect();
    }
  };

  // Hàm xử lý khi bấm Enter trong ô mã số BHXH của participant
  const handleParticipantKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchParticipant(index);
    }
  };

  // Hàm tìm kiếm thông tin BHYT trực tiếp từ mã số BHXH
  const handleSearchBhytDirect = async () => {
    if (!formData.maSoBHXH.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    setSearchLoading(true);
    try {
      const request: BhytDeclarationRequest = {
        maSoBHXH: formData.maSoBHXH.trim(),
        mangLuoiId: searchConfig.mangLuoiId,
        ma: searchConfig.ma,
        maCoQuanBHXH: searchConfig.maCoQuanBHXH
      };

      // Sử dụng API thực để tìm kiếm
      const response = await bhytService.lookupBhytForDeclaration(request);

      if (response.success && response.data) {
        // Debug log để kiểm tra dữ liệu từ API
        console.log('API Response Data:', response.data);

        // Auto-fill form với dữ liệu tìm được
        setFormData(prev => ({
          ...prev,
          hoTen: response.data!.hoTen,
          ngaySinh: response.data!.ngaySinh,
          gioiTinh: response.data!.gioiTinh,
          soCCCD: response.data!.cmnd,
          noiDangKyKCB: response.data!.noiDangKyKCB,
          diaChi: response.data!.diaChi,
          soDienThoai: response.data!.soDienThoai,
          soTheBHYT: response.data!.soTheBHYT,
          quocTich: response.data!.quocTich || 'VN',
          danToc: response.data!.danToc || '',

          // Thông tin địa chỉ - sử dụng đúng tên trường từ response
          maTinhKS: response.data!.maTinhKS || '',
          maHuyenKS: response.data!.maHuyenKS || '',
          maXaKS: response.data!.maXaKS || '',
          maTinhNkq: response.data!.maTinhNkq || '',
          maHuyenNkq: response.data!.maHuyenNkq || '',
          maXaNkq: response.data!.maXaNkq || '',

          // Thông tin BHYT
          loaiDoiTuong: response.data!.loaiDoiTuong || 'GD',
          mucLuong: response.data!.mucLuong || '',
          tyLeDong: response.data!.tyLeDong || '4.5',
          soTienDong: response.data!.soTienDong || '',
          tinhKCB: response.data!.maKV || '',
          noiNhanHoSo: response.data!.noiNhanHoSo || '',
          maBenhVien: response.data!.maBenhVien || '',
          maHoGiaDinh: response.data!.maHoGiaDinh || '',
          phuongAn: response.data!.phuongAn || '',
          trangThai: response.data!.trangThaiThe || '',
          moTa: response.data!.moTa || ''
        }));

        // Cập nhật participant đầu tiên
        setParticipants(prev => prev.map((participant, index) =>
          index === 0 ? {
            ...participant,
            hoTen: response.data!.hoTen,
            maSoBHXH: response.data!.maSoBhxh,
            ngaySinh: response.data!.ngaySinh,
            gioiTinh: response.data!.gioiTinh,
            noiDangKyKCB: response.data!.noiDangKyKCB,
            mucLuong: response.data!.mucLuong || '',
            tyLeDong: response.data!.tyLeDong || '4.5',
            soTienDong: response.data!.soTienDong || ''
          } : participant
        ));

        showToast('Đã tìm thấy và điền thông tin BHYT thành công!', 'success');
      } else {
        showToast(response.message || 'Không tìm thấy thông tin BHYT', 'error');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kê khai BHYT</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Đăng ký đóng BHYT đối với người chỉ tham gia BHYT
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Lưu</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>In</span>
          </button>
        </div>
      </div>

      {/* Thông tin người đăng ký */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin người đăng ký</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên (*)
              </label>
              <input
                type="text"
                value={formData.hoTen}
                onChange={(e) => handleInputChange('hoTen', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã số BHXH
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.maSoBHXH}
                  onChange={(e) => handleInputChange('maSoBHXH', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập mã số BHXH (Enter để tìm kiếm)"
                />
                <button
                  onClick={handleSearchBhytDirect}
                  disabled={searchLoading || !formData.maSoBHXH.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-purple-600 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  title="Tìm kiếm thông tin BHYT"
                >
                  {searchLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày sinh (*)
              </label>
              <input
                type="date"
                value={formData.ngaySinh}
                onChange={(e) => handleInputChange('ngaySinh', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số CCCD/CMND (*)
              </label>
              <input
                type="text"
                value={formData.soCCCD}
                onChange={(e) => handleInputChange('soCCCD', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập số CCCD/CMND"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nơi đăng ký KCB ban đầu
              </label>
              <input
                type="text"
                value={formData.noiDangKyKCB}
                onChange={(e) => handleInputChange('noiDangKyKCB', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập nơi đăng ký KCB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số thẻ BHYT
              </label>
              <input
                type="text"
                value={formData.soTheBHYT}
                onChange={(e) => handleInputChange('soTheBHYT', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập số thẻ BHYT"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quốc tịch
              </label>
              <input
                type="text"
                value={formData.quocTich}
                onChange={(e) => handleInputChange('quocTich', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="VN"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dân tộc
              </label>
              <input
                type="text"
                value={formData.danToc}
                onChange={(e) => handleInputChange('danToc', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã dân tộc"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Thông tin liên hệ</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa chỉ thường trú
              </label>
              <input
                type="text"
                value={formData.diaChi}
                onChange={(e) => handleInputChange('diaChi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập địa chỉ thường trú"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.soDienThoai}
                onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập email"
              />
            </div>
          </div>
        </div>

        {/* Thông tin địa chỉ và BHYT bổ sung */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Thông tin địa chỉ và BHYT bổ sung</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã tỉnh KS
              </label>
              <input
                type="text"
                value={formData.maTinhKS}
                onChange={(e) => handleInputChange('maTinhKS', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã tỉnh KS"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã huyện KS
              </label>
              <input
                type="text"
                value={formData.maHuyenKS}
                onChange={(e) => handleInputChange('maHuyenKS', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã huyện KS"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã xã KS
              </label>
              <input
                type="text"
                value={formData.maXaKS}
                onChange={(e) => handleInputChange('maXaKS', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã xã KS"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã bệnh viện
              </label>
              <input
                type="text"
                value={formData.maBenhVien}
                onChange={(e) => handleInputChange('maBenhVien', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã bệnh viện"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã hộ gia đình
              </label>
              <input
                type="text"
                value={formData.maHoGiaDinh}
                onChange={(e) => handleInputChange('maHoGiaDinh', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã hộ gia đình"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả
              </label>
              <input
                type="text"
                value={formData.moTa}
                onChange={(e) => handleInputChange('moTa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mô tả"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin BHYT */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin BHYT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại đối tượng
              </label>
              <select
                value={formData.loaiDoiTuong}
                onChange={(e) => handleInputChange('loaiDoiTuong', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="GD">GD - Hộ gia đình</option>
                <option value="HS">HS - Học sinh</option>
                <option value="SV">SV - Sinh viên</option>
                <option value="TE">TE - Trẻ em dưới 6 tuổi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mức lương/Thu nhập
              </label>
              <input
                type="text"
                value={formData.mucLuong}
                onChange={(e) => handleInputChange('mucLuong', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mức lương"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tỷ lệ đóng (%)
              </label>
              <input
                type="text"
                value={formData.tyLeDong}
                onChange={(e) => handleInputChange('tyLeDong', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="4.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số tiền đóng
              </label>
              <input
                type="text"
                value={formData.soTienDong}
                onChange={(e) => handleInputChange('soTienDong', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập số tiền đóng"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Thời gian tham gia</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Từ tháng/năm
              </label>
              <input
                type="month"
                value={formData.tuThang}
                onChange={(e) => handleInputChange('tuThang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đến tháng/năm
              </label>
              <input
                type="month"
                value={formData.denThang}
                onChange={(e) => handleInputChange('denThang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú
              </label>
              <input
                type="text"
                value={formData.ghiChu}
                onChange={(e) => handleInputChange('ghiChu', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập ghi chú"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách người tham gia */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Danh sách người tham gia BHYT</h3>
            <button
              onClick={addParticipant}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm người</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Họ và tên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã số BHXH</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Giới tính</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nơi ĐK KCB</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Từ tháng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Đến tháng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số tiền</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {participants.map((participant, index) => (
                <tr key={participant.id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={participant.hoTen}
                      onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Họ và tên"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={participant.maSoBHXH}
                        onChange={(e) => handleParticipantChange(index, 'maSoBHXH', e.target.value)}
                        onKeyPress={(e) => handleParticipantKeyPress(e, index)}
                        className="w-full px-2 py-1 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Mã BHXH (Enter để tìm)"
                      />
                      <button
                        onClick={() => handleSearchParticipant(index)}
                        disabled={searchLoading || !participant.maSoBHXH.trim()}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-0.5 text-purple-600 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Tìm kiếm thông tin BHYT"
                      >
                        {searchLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Search className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={participant.ngaySinh}
                      onChange={(e) => handleParticipantChange(index, 'ngaySinh', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={participant.gioiTinh}
                      onChange={(e) => handleParticipantChange(index, 'gioiTinh', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={participant.noiDangKyKCB}
                      onChange={(e) => handleParticipantChange(index, 'noiDangKyKCB', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Nơi ĐK KCB"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="month"
                      value={participant.tuThang}
                      onChange={(e) => handleParticipantChange(index, 'tuThang', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="month"
                      value={participant.denThang}
                      onChange={(e) => handleParticipantChange(index, 'denThang', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={participant.soTienDong}
                      onChange={(e) => handleParticipantChange(index, 'soTienDong', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Số tiền"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeParticipant(index)}
                        disabled={participants.length === 1}
                        className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Gửi kê khai</span>
        </button>
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default BhytDeclaration;
