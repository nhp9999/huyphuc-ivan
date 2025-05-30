import { useState } from 'react';

// Interface for form data
export interface BhytFormData {
  // Thông tin cơ bản
  hoTen: string;
  maSoBHXH: string;
  ngaySinh: string;
  gioiTinh: string;
  soCCCD: string;
  noiDangKyKCB: string;
  soDienThoai: string;
  soTheBHYT: string;
  quocTich: string;
  danToc: string;

  // Thông tin địa chỉ
  maTinhKS: string;
  maHuyenKS: string;
  maXaKS: string;
  maTinhNkq: string;
  maHuyenNkq: string;
  maXaNkq: string;

  // Thông tin BHYT
  mucLuong: string;
  tyLeDong: string;
  soTienDong: string;
  tinhKCB: string;
  noiNhanHoSo: string;
  maBenhVien: string;
  maHoGiaDinh: string;
  phuongAn: string;
  trangThai: string;
  
  // Thông tin thẻ cũ
  tuNgayTheCu: string;
  denNgayTheCu: string;
  
  // Thông tin đóng BHYT mới
  soThangDong: string;
  sttHo: string;
  tuNgayTheMoi: string;
  denNgayTheMoi: string;
  ngayBienLai: string;
  ghiChuDongPhi: string;
}

// Initial form data
const initialFormData: BhytFormData = {
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
  
  // Thông tin thẻ cũ
  tuNgayTheCu: '',
  denNgayTheCu: '',
  
  // Thông tin đóng BHYT mới
  soThangDong: '',
  sttHo: '',
  tuNgayTheMoi: '',
  denNgayTheMoi: '',
  ngayBienLai: new Date().toISOString().split('T')[0],
  ghiChuDongPhi: ''
};

// Calculation utilities
export const calculateBhytAmount = (sttHo: string, soThangDong: string, mucLuongCoSo: number = 2340000): number => {
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

export const calculateCardValidity = (soThangDong: string, denNgayTheCu: string, ngayBienLai: string) => {
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

// Custom hook for form data management
export const useBhytFormData = () => {
  const [formData, setFormData] = useState<BhytFormData>(initialFormData);

  const handleInputChange = (field: keyof BhytFormData, value: string) => {
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

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const updateFormData = (data: Partial<BhytFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return {
    formData,
    handleInputChange,
    resetForm,
    updateFormData
  };
};
