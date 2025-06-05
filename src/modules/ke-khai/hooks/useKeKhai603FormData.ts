import { useState } from 'react';

// Interface for form data
export interface KeKhai603FormData {
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
  tienDong?: number; // Giá trị từ cột tien_dong trong database (công thức mới)
  tienDongThucTe?: number; // Giá trị từ cột tien_dong_thuc_te trong database (công thức cũ)
  tinhKCB: string;
  noiNhanHoSo: string;
  maBenhVien: string; // Mã cơ sở KCB được chọn
  tenBenhVien: string; // Tên cơ sở KCB được chọn
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
const initialFormData: KeKhai603FormData = {
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
  tyLeDong: '100', // Mặc định 100% lương cơ sở
  soTienDong: '',
  tienDong: 0, // Khởi tạo giá trị từ database = 0
  tienDongThucTe: 0, // Khởi tạo giá trị số = 0
  tinhKCB: '',
  noiNhanHoSo: '',
  maBenhVien: '',
  tenBenhVien: '',
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
export const calculateKeKhai603Amount = (sttHo: string, soThangDong: string, mucLuongCoSo: number = 2340000): number => {
  if (!sttHo) return 0;

  // Tỷ lệ theo STT hộ (áp dụng trực tiếp lên lương cơ sở)
  let tyLe = 1; // Người thứ 1: 100%

  switch (sttHo) {
    case '1':
      tyLe = 1; // 100%
      break;
    case '2':
      tyLe = 0.7; // 70%
      break;
    case '3':
      tyLe = 0.6; // 60%
      break;
    case '4':
      tyLe = 0.5; // 50%
      break;
    case '5+':
      tyLe = 0.4; // 40%
      break;
    default:
      tyLe = 1;
  }

  // Công thức: Lương cơ sở × Tỷ lệ (KHÔNG nhân với số tháng)
  const soTienDong = mucLuongCoSo * tyLe;

  return Math.round(soTienDong);
};

// Function tính toán tiền đóng thực tế (sử dụng công thức cũ với 4.5%)
export const calculateKeKhai603AmountThucTe = (sttHo: string, soThangDong: string, mucLuongCoSo: number = 2340000): number => {
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

  // Công thức cũ: Lương cơ sở × 4.5% × Tỷ lệ giảm × Số tháng
  const soTienDongThucTe = mucDongCoBan * tyLeGiam * soThang;
  return Math.round(soTienDongThucTe);
};

export const calculateKeKhai603CardValidity = (soThangDong: string, denNgayTheCu: string, ngayBienLai: string) => {
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
export const useKeKhai603FormData = () => {
  const [formData, setFormData] = useState<KeKhai603FormData>(initialFormData);

  const handleInputChange = (field: keyof KeKhai603FormData, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Tự động tính toán số tiền đóng khi thay đổi STT hộ hoặc số tháng
      if (field === 'sttHo' || field === 'soThangDong') {
        const sttHo = field === 'sttHo' ? value : prev.sttHo;
        const soThangDong = field === 'soThangDong' ? value : prev.soThangDong;

        // Cập nhật tỷ lệ đóng theo STT hộ (% của lương cơ sở)
        if (field === 'sttHo') {
          let tyLeDong = '100';
          switch (value) {
            case '1':
              tyLeDong = '100'; // 100% lương cơ sở
              break;
            case '2':
              tyLeDong = '70'; // 70% lương cơ sở
              break;
            case '3':
              tyLeDong = '60'; // 60% lương cơ sở
              break;
            case '4':
              tyLeDong = '50'; // 50% lương cơ sở
              break;
            case '5+':
              tyLeDong = '40'; // 40% lương cơ sở
              break;
          }
          newData.tyLeDong = tyLeDong;
        }

        if (sttHo && soThangDong) {
          // Tính tiền đóng theo công thức mới (lưu vào tien_dong)
          const soTien = calculateKeKhai603Amount(sttHo, soThangDong);
          newData.soTienDong = soTien.toLocaleString('vi-VN');
          newData.tienDong = soTien;

          // Tính tiền đóng thực tế theo công thức cũ (lưu vào tien_dong_thuc_te)
          const soTienThucTe = calculateKeKhai603AmountThucTe(sttHo, soThangDong);
          newData.tienDongThucTe = soTienThucTe;
        }
      }

      // Tự động tính toán thời hạn thẻ mới khi thay đổi các trường liên quan
      if (field === 'soThangDong' || field === 'ngayBienLai' || field === 'denNgayTheCu') {
        const soThangDong = field === 'soThangDong' ? value : prev.soThangDong;
        const ngayBienLai = field === 'ngayBienLai' ? value : prev.ngayBienLai;
        const denNgayTheCu = field === 'denNgayTheCu' ? value : prev.denNgayTheCu;

        if (soThangDong && ngayBienLai) {
          const cardValidity = calculateKeKhai603CardValidity(soThangDong, denNgayTheCu, ngayBienLai);
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

  const updateFormData = (data: Partial<KeKhai603FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return {
    formData,
    handleInputChange,
    resetForm,
    updateFormData
  };
};
