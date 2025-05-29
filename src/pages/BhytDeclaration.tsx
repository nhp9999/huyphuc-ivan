import React, { useState } from 'react';
import { bhytService } from '../services/bhytService';
import { BhytDeclarationRequest } from '../types/bhyt';
import Toast from '../components/Toast';
import {
  Save,
  Send,
  Plus,
  Trash2,
  Search,
  Loader2
} from 'lucide-react';

// Helper function để convert từ DD/MM/YYYY sang YYYY-MM-DD cho date input
const convertDisplayDateToInputDate = (displayDate: string): string => {
  if (!displayDate) return '';

  // Kiểm tra format DD/MM/YYYY
  const parts = displayDate.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  return displayDate; // Trả về nguyên bản nếu không đúng format
};

const BhytDeclaration: React.FC = () => {
  const [formData, setFormData] = useState({
    // Thông tin cơ bản
    hoTen: '',
    maSoBHXH: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    soCCCD: '',
    noiDangKyKCB: '',
    soDienThoai: '',
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
    mucLuong: '',
    tyLeDong: '4.5',
    soTienDong: '',
    tinhKCB: '',
    noiNhanHoSo: '',
    maBenhVien: '',
    maHoGiaDinh: '',
    phuongAn: '',
    trangThai: '',
    // Thêm thông tin thẻ cũ
    tuNgayTheCu: '',
    denNgayTheCu: '',
    // Thêm thông tin đóng BHYT mới
    soThangDong: '',
    sttHo: '',
    tuNgayTheMoi: '',
    denNgayTheMoi: '',
    ngayBienLai: new Date().toISOString().split('T')[0] // Ngày hiện tại
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
      soTienDong: '',
      // Thêm thông tin thẻ cũ
      tuNgayTheCu: '',
      denNgayTheCu: '',
      ngayBienLai: new Date().toISOString().split('T')[0],
      // Thêm thông tin đóng BHYT cho participant
      sttHo: '',
      soThangDong: '',
      // Thêm thông tin địa chỉ nhận kết quả
      maTinhNkq: '',
      maHuyenNkq: '',
      maXaNkq: '',
      noiNhanHoSo: ''
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

  // State cho chế độ nhập liệu
  const [inputMode, setInputMode] = useState<'form' | 'list'>('form');

  // State cho thông tin tóm tắt từ API
  const [apiSummary, setApiSummary] = useState<{
    isLoaded: boolean;
    lastUpdated?: string;
    source?: string;
  }>({
    isLoaded: false
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

  // Hàm tính toán số tiền đóng BHYT
  const calculateBhytAmount = (sttHo: string, soThangDong: string, mucLuongCoSo: number = 2340000) => {
    if (!sttHo || !soThangDong) return 0;

    const soThang = parseInt(soThangDong);
    if (isNaN(soThang)) return 0;

    // Tỷ lệ cơ bản 4.5%
    const tyLeCoBan = 0.045;
    const mucDongCoBan = tyLeCoBan * mucLuongCoSo;

    // Tỷ lệ giảm theo STT hộ
    let tyLeGiam = 1; // Người thứ 1: 100%

    switch (sttHo) {
      case '1':
        tyLeGiam = 1; // 100%
        break;
      case '2':
        tyLeGiam = 0.7; // 70%
        break;
      case '3':
        tyLeGiam = 0.6; // 60%
        break;
      case '4':
        tyLeGiam = 0.5; // 50%
        break;
      case '5+':
        tyLeGiam = 0.4; // 40%
        break;
      default:
        tyLeGiam = 1;
    }

    const soTienDong = mucDongCoBan * tyLeGiam * soThang;
    return Math.round(soTienDong);
  };

  // Hàm tính toán thời hạn thẻ BHYT mới
  const calculateCardValidity = (soThangDong: string, denNgayTheCu: string, ngayBienLai: string) => {
    if (!soThangDong || !ngayBienLai) return { tuNgay: '', denNgay: '' };

    const soThang = parseInt(soThangDong);
    if (isNaN(soThang)) return { tuNgay: '', denNgay: '' };

    let tuNgayTheMoi: Date;
    const ngayBienLaiDate = new Date(ngayBienLai);

    // Xác định có phải gia hạn hay không dựa trên "Đến ngày thẻ cũ"
    const isGiaHan = denNgayTheCu && denNgayTheCu.trim() !== '';

    if (!isGiaHan) {
      // Trường hợp tham gia lần đầu (không có thẻ cũ)
      // Thẻ có hiệu lực sau 30 ngày kể từ ngày biên lai
      tuNgayTheMoi = new Date(ngayBienLaiDate);
      tuNgayTheMoi.setDate(tuNgayTheMoi.getDate() + 30);
    } else {
      // Trường hợp gia hạn (có thẻ cũ)
      const denNgayTheCuDate = new Date(denNgayTheCu);

      // Kiểm tra khoảng cách giữa ngày biên lai và ngày hết hạn thẻ cũ
      const timeDiff = ngayBienLaiDate.getTime() - denNgayTheCuDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff > 90) {
        // Gián đoạn trên 3 tháng (90 ngày) - áp dụng quy tắc 30 ngày chờ
        tuNgayTheMoi = new Date(ngayBienLaiDate);
        tuNgayTheMoi.setDate(tuNgayTheMoi.getDate() + 30);
      } else {
        // Gia hạn liên tục hoặc gián đoạn dưới 3 tháng - thẻ có hiệu lực ngay sau thẻ cũ
        tuNgayTheMoi = new Date(denNgayTheCuDate);
        tuNgayTheMoi.setDate(tuNgayTheMoi.getDate() + 1);
      }
    }

    // Tính ngày hết hạn thẻ mới (cộng thêm số tháng đóng)
    const denNgayTheMoi = new Date(tuNgayTheMoi);
    denNgayTheMoi.setMonth(denNgayTheMoi.getMonth() + soThang);
    denNgayTheMoi.setDate(denNgayTheMoi.getDate() - 1); // Trừ 1 ngày để có ngày cuối tháng

    return {
      tuNgay: tuNgayTheMoi.toISOString().split('T')[0],
      denNgay: denNgayTheMoi.toISOString().split('T')[0]
    };
  };



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Tự động tính toán số tiền đóng khi thay đổi STT hộ hoặc số tháng
      if (field === 'sttHo' || field === 'soThangDong') {
        const sttHo = field === 'sttHo' ? value : prev.sttHo;
        const soThangDong = field === 'soThangDong' ? value : prev.soThangDong;

        // Cập nhật tỷ lệ đóng theo STT hộ
        if (field === 'sttHo') {
          let tyLeDong = '4.5';
          switch (value) {
            case '1':
              tyLeDong = '4.5'; // 100% của 4.5%
              break;
            case '2':
              tyLeDong = '3.15'; // 70% của 4.5%
              break;
            case '3':
              tyLeDong = '2.7'; // 60% của 4.5%
              break;
            case '4':
              tyLeDong = '2.25'; // 50% của 4.5%
              break;
            case '5+':
              tyLeDong = '1.8'; // 40% của 4.5%
              break;
          }
          newData.tyLeDong = tyLeDong;
        }

        if (sttHo && soThangDong) {
          const soTien = calculateBhytAmount(sttHo, soThangDong);
          newData.soTienDong = soTien.toLocaleString('vi-VN');
        }

      }

      // Tự động tính toán thời hạn thẻ mới khi thay đổi các trường liên quan
      if (field === 'soThangDong' || field === 'ngayBienLai' || field === 'denNgayTheCu') {
        const soThangDong = field === 'soThangDong' ? value : prev.soThangDong;
        const ngayBienLai = field === 'ngayBienLai' ? value : prev.ngayBienLai;
        const denNgayTheCu = field === 'denNgayTheCu' ? value : prev.denNgayTheCu;

        if (soThangDong && ngayBienLai) {
          const cardValidity = calculateCardValidity(soThangDong, denNgayTheCu, ngayBienLai);
          newData.tuNgayTheMoi = cardValidity.tuNgay;
          newData.denNgayTheMoi = cardValidity.denNgay;
        }
      }

      return newData;
    });
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    setParticipants(prev => prev.map((participant, i) => {
      if (i === index) {
        const updatedParticipant = { ...participant, [field]: value };

        // Tự động tính toán số tiền đóng khi thay đổi STT hộ hoặc số tháng
        if (field === 'sttHo' || field === 'soThangDong') {
          const sttHo = field === 'sttHo' ? value : participant.sttHo;
          const soThangDong = field === 'soThangDong' ? value : participant.soThangDong;

          if (sttHo && soThangDong) {
            const soTien = calculateBhytAmount(sttHo, soThangDong);
            updatedParticipant.soTienDong = soTien.toLocaleString('vi-VN');
          }
        }

        return updatedParticipant;
      }
      return participant;
    }));
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
      soTienDong: '',
      // Thêm thông tin thẻ cũ
      tuNgayTheCu: '',
      denNgayTheCu: '',
      ngayBienLai: new Date().toISOString().split('T')[0],
      // Thêm thông tin đóng BHYT cho participant
      sttHo: '',
      soThangDong: '',
      // Thêm thông tin địa chỉ nhận kết quả
      maTinhNkq: '',
      maHuyenNkq: '',
      maXaNkq: '',
      noiNhanHoSo: ''
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
            soTienDong: response.data!.soTienDong || '',
            // Thêm thông tin thẻ cũ - convert từ DD/MM/YYYY sang YYYY-MM-DD cho date input
            tuNgayTheCu: convertDisplayDateToInputDate(response.data!.ngayHieuLuc || ''),
            denNgayTheCu: convertDisplayDateToInputDate(response.data!.ngayHetHan || ''),
            // Thêm thông tin địa chỉ nhận kết quả
            maTinhNkq: response.data!.maTinhNkq || '',
            maHuyenNkq: response.data!.maHuyenNkq || '',
            maXaNkq: response.data!.maXaNkq || '',
            noiNhanHoSo: response.data!.noiNhanHoSo || ''
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
          // Thêm thông tin thẻ cũ - convert từ DD/MM/YYYY sang YYYY-MM-DD cho date input
          tuNgayTheCu: convertDisplayDateToInputDate(response.data!.ngayHieuLuc || ''),
          denNgayTheCu: convertDisplayDateToInputDate(response.data!.ngayHetHan || '')
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
            soTienDong: response.data!.soTienDong || '',
            // Thêm thông tin địa chỉ nhận kết quả
            maTinhNkq: response.data!.maTinhNkq || '',
            maHuyenNkq: response.data!.maHuyenNkq || '',
            maXaNkq: response.data!.maXaNkq || '',
            noiNhanHoSo: response.data!.noiNhanHoSo || ''
          } : participant
        ));

        // Cập nhật thông tin tóm tắt API
        setApiSummary({
          isLoaded: true,
          lastUpdated: new Date().toLocaleString('vi-VN'),
          source: 'API kê khai BHYT'
        });

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

        {/* Input Mode Toggle & Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Toggle chế độ nhập liệu */}
          <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setInputMode('form')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                inputMode === 'form'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>📝</span>
              <span>Nhập Form</span>
            </button>
            <button
              onClick={() => setInputMode('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                inputMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>📋</span>
              <span>Nhập Danh sách</span>
            </button>
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
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Gửi kê khai</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thông tin tóm tắt API */}
      {apiSummary.isLoaded && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Dữ liệu đã được tải từ {apiSummary.source}
            </span>
            {apiSummary.lastUpdated && (
              <span className="text-xs text-green-600 dark:text-green-400">
                • Cập nhật lúc: {apiSummary.lastUpdated}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Chế độ nhập Form */}
      {inputMode === 'form' && (
        <>
          {/* Thông tin cá nhân cơ bản */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
            Thông tin cá nhân cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã số BHXH (*)
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
                placeholder="Mã dân tộc (01=Kinh)"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã tỉnh khai sinh
              </label>
              <input
                type="text"
                value={formData.maTinhKS}
                onChange={(e) => handleInputChange('maTinhKS', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã tỉnh khai sinh"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã huyện khai sinh
              </label>
              <input
                type="text"
                value={formData.maHuyenKS}
                onChange={(e) => handleInputChange('maHuyenKS', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã huyện khai sinh"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã xã khai sinh
              </label>
              <input
                type="text"
                value={formData.maXaKS}
                onChange={(e) => handleInputChange('maXaKS', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã xã khai sinh"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã tỉnh nhận kết quả
              </label>
              <input
                type="text"
                value={formData.maTinhNkq}
                onChange={(e) => handleInputChange('maTinhNkq', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã tỉnh nhận kết quả"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã huyện nhận kết quả
              </label>
              <input
                type="text"
                value={formData.maHuyenNkq}
                onChange={(e) => handleInputChange('maHuyenNkq', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã huyện nhận kết quả"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã xã nhận kết quả
              </label>
              <input
                type="text"
                value={formData.maXaNkq}
                onChange={(e) => handleInputChange('maXaNkq', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã xã nhận kết quả"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Thông tin thẻ BHYT hiện tại */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-4 bg-green-500 rounded-full mr-2"></span>
            Thông tin thẻ BHYT hiện tại
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số thẻ BHYT
              </label>
              <input
                type="text"
                value={formData.soTheBHYT}
                onChange={(e) => handleInputChange('soTheBHYT', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Số thẻ BHYT"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phương án tham gia
              </label>
              <input
                type="text"
                value={formData.phuongAn}
                onChange={(e) => handleInputChange('phuongAn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="ON/OFF"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Từ ngày thẻ cũ
              </label>
              <input
                type="date"
                value={formData.tuNgayTheCu}
                onChange={(e) => handleInputChange('tuNgayTheCu', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đến ngày thẻ cũ
              </label>
              <input
                type="date"
                value={formData.denNgayTheCu}
                onChange={(e) => handleInputChange('denNgayTheCu', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trạng thái thẻ
              </label>
              <input
                type="text"
                value={formData.trangThai}
                onChange={(e) => handleInputChange('trangThai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Trạng thái thẻ"
                readOnly
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
                placeholder="Nơi đăng ký KCB"
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
                Tỉnh KCB ban đầu
              </label>
              <input
                type="text"
                value={formData.tinhKCB}
                onChange={(e) => handleInputChange('tinhKCB', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã tỉnh KCB"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nơi nhận hồ sơ
              </label>
              <input
                type="text"
                value={formData.noiNhanHoSo}
                onChange={(e) => handleInputChange('noiNhanHoSo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Mã nơi nhận hồ sơ"
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
                Trạng thái tham gia
              </label>
              <input
                type="text"
                value={formData.trangThai}
                onChange={(e) => handleInputChange('trangThai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Trạng thái"
                readOnly
              />
            </div>
          </div>
        </div>

      </div>

      {/* Thông tin đóng BHYT */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
            Thông tin đóng BHYT
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày biên lai
              </label>
              <input
                type="date"
                value={formData.ngayBienLai}
                onChange={(e) => handleInputChange('ngayBienLai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ngày lập biên lai đóng phí
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số tháng đóng
              </label>
                <select
                  value={formData.soThangDong}
                  onChange={(e) => handleInputChange('soThangDong', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Chọn số tháng</option>
                  <option value="3">3 tháng</option>
                  <option value="6">6 tháng</option>
                  <option value="12">12 tháng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                STT hộ
              </label>
              <select
                value={formData.sttHo}
                onChange={(e) => handleInputChange('sttHo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Chọn STT hộ</option>
                <option value="1">Người thứ 1</option>
                <option value="2">Người thứ 2</option>
                <option value="3">Người thứ 3</option>
                <option value="4">Người thứ 4</option>
                <option value="5+">Người thứ 5 trở đi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mức lương cơ sở
              </label>
              <input
                type="text"
                value="2.340.000 đ"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600"
                placeholder="Mức lương cơ sở hiện tại"
                readOnly
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
                placeholder="4.5%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số tiền đóng (VNĐ)
              </label>
              <input
                type="text"
                value={formData.soTienDong}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold text-green-700 dark:text-green-300"
                placeholder="Tự động tính toán"
                readOnly
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tự động tính: Tỷ lệ × Lương cơ sở × Số tháng
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú đóng phí
              </label>
              <input
                type="text"
                value=""
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ghi chú về đóng phí"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Từ ngày thẻ mới
              </label>
              <input
                type="date"
                value={formData.tuNgayTheMoi}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-green-50 dark:bg-green-900/20"
                readOnly
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tự động tính dựa trên ngày biên lai và thẻ cũ
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đến ngày thẻ mới
              </label>
              <input
                type="date"
                value={formData.denNgayTheMoi}
                onChange={(e) => handleInputChange('denNgayTheMoi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-green-50 dark:bg-green-900/20"
                readOnly
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tự động tính dựa trên số tháng đóng
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Danh sách người tham gia */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="w-2 h-6 bg-pink-500 rounded-full mr-3"></span>
              Danh sách người tham gia BHYT
            </h3>
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STT</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Họ và tên</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã số BHXH</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Giới tính</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STT hộ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số tháng</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số tiền</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày biên lai</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã tỉnh NKQ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã huyện NKQ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã xã NKQ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nơi nhận hồ sơ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {participants.map((participant, index) => (
                <tr key={participant.id}>
                  <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={participant.hoTen}
                      onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Họ và tên"
                    />
                  </td>
                  <td className="px-3 py-3">
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
                  <td className="px-3 py-3">
                    <input
                      type="date"
                      value={participant.ngaySinh}
                      onChange={(e) => handleParticipantChange(index, 'ngaySinh', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={participant.gioiTinh}
                      onChange={(e) => handleParticipantChange(index, 'gioiTinh', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={participant.sttHo || ''}
                      onChange={(e) => handleParticipantChange(index, 'sttHo', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Chọn STT</option>
                      <option value="1">Người 1</option>
                      <option value="2">Người 2</option>
                      <option value="3">Người 3</option>
                      <option value="4">Người 4</option>
                      <option value="5+">Người 5+</option>
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={participant.soThangDong || ''}
                      onChange={(e) => handleParticipantChange(index, 'soThangDong', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Chọn tháng</option>
                      <option value="3">3 tháng</option>
                      <option value="6">6 tháng</option>
                      <option value="12">12 tháng</option>
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={participant.soTienDong}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold text-green-700 dark:text-green-300"
                      placeholder="Tự động tính"
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="date"
                      value={participant.ngayBienLai}
                      onChange={(e) => handleParticipantChange(index, 'ngayBienLai', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={participant.maTinhNkq || ''}
                      onChange={(e) => handleParticipantChange(index, 'maTinhNkq', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Mã tỉnh"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={participant.maHuyenNkq || ''}
                      onChange={(e) => handleParticipantChange(index, 'maHuyenNkq', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Mã huyện"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={participant.maXaNkq || ''}
                      onChange={(e) => handleParticipantChange(index, 'maXaNkq', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Mã xã"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={participant.noiNhanHoSo || ''}
                      onChange={(e) => handleParticipantChange(index, 'noiNhanHoSo', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Nơi nhận hồ sơ"
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
        </>
      )}

      {/* Chế độ nhập Danh sách */}
      {inputMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
                Nhập danh sách người tham gia BHYT
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={addParticipant}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm người</span>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Nhập thông tin trực tiếp vào bảng danh sách. Hệ thống sẽ tự động tính toán số tiền đóng dựa trên STT hộ và số tháng đóng.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STT</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Họ và tên</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã số BHXH</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày sinh</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Giới tính</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STT hộ</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số tháng</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số tiền</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày biên lai</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã tỉnh NKQ</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã huyện NKQ</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã xã NKQ</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nơi nhận hồ sơ</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {participants.map((participant, index) => (
                  <tr key={participant.id}>
                    <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={participant.hoTen}
                        onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Họ và tên"
                      />
                    </td>
                    <td className="px-3 py-3">
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
                    <td className="px-3 py-3">
                      <input
                        type="date"
                        value={participant.ngaySinh}
                        onChange={(e) => handleParticipantChange(index, 'ngaySinh', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={participant.gioiTinh}
                        onChange={(e) => handleParticipantChange(index, 'gioiTinh', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={participant.sttHo || ''}
                        onChange={(e) => handleParticipantChange(index, 'sttHo', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Chọn STT</option>
                        <option value="1">Người 1</option>
                        <option value="2">Người 2</option>
                        <option value="3">Người 3</option>
                        <option value="4">Người 4</option>
                        <option value="5+">Người 5+</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={participant.soThangDong || ''}
                        onChange={(e) => handleParticipantChange(index, 'soThangDong', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Chọn tháng</option>
                        <option value="3">3 tháng</option>
                        <option value="6">6 tháng</option>
                        <option value="12">12 tháng</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={participant.soTienDong}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold text-green-700 dark:text-green-300"
                        placeholder="Tự động tính"
                        readOnly
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="date"
                        value={participant.ngayBienLai}
                        onChange={(e) => handleParticipantChange(index, 'ngayBienLai', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={participant.maTinhNkq || ''}
                        onChange={(e) => handleParticipantChange(index, 'maTinhNkq', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Mã tỉnh"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={participant.maHuyenNkq || ''}
                        onChange={(e) => handleParticipantChange(index, 'maHuyenNkq', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Mã huyện"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={participant.maXaNkq || ''}
                        onChange={(e) => handleParticipantChange(index, 'maXaNkq', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Mã xã"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={participant.noiNhanHoSo || ''}
                        onChange={(e) => handleParticipantChange(index, 'noiNhanHoSo', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Nơi nhận hồ sơ"
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
      )}

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
