import React, { useState } from 'react';

// Interface for form data
export interface KeKhai603FormData {
  // Edit tracking
  editingParticipantId?: number | null; // ID of participant being edited, null for new participant

  // Thông tin cơ bản
  hoTen: string;
  maSoBHXH: string;
  ngaySinh: string;
  gioiTinh: string;
  soCCCD: string;
  noiDangKyKCB: string;
  soDienThoai: string;
  email: string;
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

// Default CSKCB - Trung tâm Y tế thị xã Tịnh Biên (Hospital code 006)
const DEFAULT_CSKCB = {
  value: '006',
  ten: 'Trung tâm Y tế thị xã Tịnh Biên',
  maTinh: '' // No default province
};

// Initial form data
const initialFormData: KeKhai603FormData = {
  // Edit tracking
  editingParticipantId: null,

  // Thông tin cơ bản
  hoTen: '',
  maSoBHXH: '',
  ngaySinh: '',
  gioiTinh: '',
  soCCCD: '',
  noiDangKyKCB: DEFAULT_CSKCB.ten, // Default hospital name
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
  mucLuong: '2,340,000', // Lương cơ sở hiện tại theo quy định
  tyLeDong: '100', // Mặc định 100% lương cơ sở
  soTienDong: '',
  tienDong: 0, // Khởi tạo giá trị từ database = 0
  tienDongThucTe: 0, // Khởi tạo giá trị số = 0
  tinhKCB: '', // No default province
  noiNhanHoSo: '',
  maBenhVien: DEFAULT_CSKCB.value, // Default hospital code
  tenBenhVien: DEFAULT_CSKCB.ten, // Default hospital name
  maHoGiaDinh: '',
  phuongAn: '',
  trangThai: '',
  
  // Thông tin thẻ cũ
  tuNgayTheCu: '',
  denNgayTheCu: '',
  
  // Thông tin đóng BHYT mới
  soThangDong: '12', // Mặc định 12 tháng
  sttHo: '',
  tuNgayTheMoi: '',
  denNgayTheMoi: '',
  ngayBienLai: new Date().toISOString().split('T')[0],
  ghiChuDongPhi: ''
};

// Calculation utilities
export const calculateKeKhai603Amount = (sttHo: string, soThangDong: string, mucLuongCoSo: number = 2340000): number => {
  if (!sttHo) return 0;

  // Normalize STT hộ: convert numbers >= 5 to "5+"
  const normalizedSttHo = (() => {
    const sttHoNum = parseInt(sttHo);
    if (!isNaN(sttHoNum) && sttHoNum >= 5) {
      return '5+';
    }
    return sttHo;
  })();

  // Tỷ lệ theo STT hộ (áp dụng trực tiếp lên lương cơ sở)
  let tyLe = 1; // Người thứ 1: 100%

  switch (normalizedSttHo) {
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
      // For any unexpected values, default to person 1 rate
      console.warn(`Unexpected STT hộ value: ${sttHo}, using default rate 100%`);
      tyLe = 1;
  }

  console.log(`💰 calculateKeKhai603Amount: sttHo=${sttHo} -> normalized=${normalizedSttHo}, tyLe=${tyLe}`);

  // Công thức: Lương cơ sở × Tỷ lệ (KHÔNG nhân với số tháng)
  const soTienDong = mucLuongCoSo * tyLe;

  return Math.round(soTienDong);
};

// Function tính toán tiền đóng thực tế (sử dụng công thức cũ với 4.5%)
export const calculateKeKhai603AmountThucTe = (sttHo: string, soThangDong: string, mucLuongCoSo: number = 2340000, doiTuongThamGia?: string): number => {
  if (!sttHo || !soThangDong) return 0;

  const soThang = parseInt(soThangDong);
  if (isNaN(soThang)) return 0;

  // Tỷ lệ cơ bản 4.5%
  const tyLeCoBan = 0.045;
  const mucDongCoBan = tyLeCoBan * mucLuongCoSo;

  // Kiểm tra nếu là đối tượng DS (Dân tộc thiểu số)
  if (doiTuongThamGia && doiTuongThamGia.includes('DS')) {
    // Công thức cho DS: Lương cơ sở × 4.5% × 30% × Số tháng
    // (Nhà nước hỗ trợ 70%, người dân đóng 30%)
    const tyLeNguoiDanDong = 0.3; // 30%
    const soTienDongThucTe = mucDongCoBan * tyLeNguoiDanDong * soThang;
    return Math.round(soTienDongThucTe);
  }

  // Tỷ lệ giảm theo STT hộ (cho các đối tượng khác)
  let tyLeGiam = 1; // Người thứ 1: 100%

  // Normalize STT hộ: convert numbers >= 5 to "5+"
  const normalizedSttHo = (() => {
    const sttHoNum = parseInt(sttHo);
    if (!isNaN(sttHoNum) && sttHoNum >= 5) {
      return '5+';
    }
    return sttHo;
  })();

  switch (normalizedSttHo) {
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
      // For any unexpected values, default to person 1 rate
      console.warn(`Unexpected STT hộ value: ${sttHo}, using default rate 100%`);
      tyLeGiam = 1;
  }

  console.log(`💰 calculateKeKhai603AmountThucTe: sttHo=${sttHo} -> normalized=${normalizedSttHo}, tyLeGiam=${tyLeGiam}, soThang=${soThang}`);

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
export const useKeKhai603FormData = (doiTuongThamGia?: string) => {
  const [formData, setFormData] = useState<KeKhai603FormData>(initialFormData);

  // Tính toán lại khi component mount hoặc doiTuongThamGia thay đổi
  React.useEffect(() => {
    if (formData.sttHo && formData.soThangDong) {
      console.log('🔄 Recalculating on mount/doiTuongThamGia change');

      const mucLuongNumber = formData.mucLuong ? parseFloat(formData.mucLuong.replace(/[.,]/g, '')) : 2340000;

      // Tính tiền đóng theo công thức mới
      const soTien = calculateKeKhai603Amount(formData.sttHo, formData.soThangDong, mucLuongNumber);

      // Tính tiền đóng thực tế theo công thức cũ
      const soTienThucTe = calculateKeKhai603AmountThucTe(formData.sttHo, formData.soThangDong, mucLuongNumber, doiTuongThamGia);

      setFormData(prev => ({
        ...prev,
        soTienDong: soTien.toLocaleString('vi-VN'),
        tienDong: soTien,
        tienDongThucTe: soTienThucTe
      }));

      console.log('✅ Recalculated on mount:', {
        soTien: soTien.toLocaleString('vi-VN'),
        soTienThucTe: soTienThucTe.toLocaleString('vi-VN')
      });
    }
  }, [doiTuongThamGia]); // Chỉ chạy khi doiTuongThamGia thay đổi

  const handleInputChange = (field: keyof KeKhai603FormData, value: string) => {
    console.log('🔄 handleInputChange called:', { field, value, editingParticipantId: formData.editingParticipantId });

    // Special debug for maSoBHXH changes
    if (field === 'maSoBHXH') {
      console.log('🔍 DEBUG: maSoBHXH change detected:', {
        oldValue: formData.maSoBHXH,
        newValue: value,
        editingParticipantId: formData.editingParticipantId
      });
    }

    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      console.log('🔄 Form data updated:', {
        field,
        oldValue: prev[field],
        newValue: value,
        editingParticipantId: newData.editingParticipantId
      });

      // Tự động tính toán số tiền đóng khi thay đổi STT hộ, số tháng, lương cơ sở, hoặc tỷ lệ đóng
      if (field === 'sttHo' || field === 'soThangDong' || field === 'mucLuong' || field === 'tyLeDong') {
        const sttHo = field === 'sttHo' ? value : prev.sttHo;
        const soThangDong = field === 'soThangDong' ? value : prev.soThangDong;
        const mucLuong = field === 'mucLuong' ? value : prev.mucLuong;

        console.log('🔄 Triggering calculation:', {
          field,
          value,
          sttHo,
          soThangDong,
          mucLuong,
          sttHoTrimmed: sttHo && sttHo.trim(),
          soThangDongTrimmed: soThangDong && soThangDong.trim()
        });

        // Cập nhật tỷ lệ đóng theo STT hộ (% của lương cơ sở)
        if (field === 'sttHo') {
          // Normalize STT hộ: convert numbers >= 5 to "5+"
          const normalizedValue = (() => {
            const sttHoNum = parseInt(value);
            if (!isNaN(sttHoNum) && sttHoNum >= 5) {
              return '5+';
            }
            return value;
          })();

          let tyLeDong = '100';
          switch (normalizedValue) {
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
            default:
              tyLeDong = '100'; // Default to 100%
              break;
          }
          newData.tyLeDong = tyLeDong;
          console.log('📊 Updated tyLeDong:', { originalValue: value, normalizedValue, tyLeDong });
        }

        if (sttHo && sttHo.trim() && soThangDong && soThangDong.trim()) {
          // Parse lương cơ sở từ string (loại bỏ dấu phẩy)
          const mucLuongNumber = mucLuong ? parseFloat(mucLuong.replace(/[.,]/g, '')) : 2340000;

          console.log('💰 Calculating with:', {
            sttHo: sttHo.trim(),
            soThangDong: soThangDong.trim(),
            mucLuongNumber,
            doiTuongThamGia
          });

          // Tính tiền đóng theo công thức mới (lưu vào tien_dong)
          const soTien = calculateKeKhai603Amount(sttHo.trim(), soThangDong.trim(), mucLuongNumber);
          newData.soTienDong = soTien.toLocaleString('vi-VN');
          newData.tienDong = soTien;

          // Tính tiền đóng thực tế theo công thức cũ (lưu vào tien_dong_thuc_te)
          const soTienThucTe = calculateKeKhai603AmountThucTe(sttHo.trim(), soThangDong.trim(), mucLuongNumber, doiTuongThamGia);
          newData.tienDongThucTe = soTienThucTe;

          console.log('✅ Calculated amounts:', {
            sttHo: sttHo.trim(),
            soThangDong: soThangDong.trim(),
            soTien: soTien.toLocaleString('vi-VN'),
            soTienThucTe: soTienThucTe.toLocaleString('vi-VN')
          });
        } else {
          console.log('⚠️ Missing required fields for calculation:', {
            sttHo,
            soThangDong,
            sttHoTrimmed: sttHo && sttHo.trim(),
            soThangDongTrimmed: soThangDong && soThangDong.trim()
          });
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
    console.log('🔄 Resetting form to initial state...');
    // Create a fresh copy of initial data to avoid reference issues
    const freshInitialData: KeKhai603FormData = {
      // Edit tracking
      editingParticipantId: null,

      // Thông tin cơ bản
      hoTen: '',
      maSoBHXH: '',
      ngaySinh: '',
      gioiTinh: '',
      soCCCD: '',
      noiDangKyKCB: DEFAULT_CSKCB.ten, // Default hospital name
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
      mucLuong: '2,340,000',
      tyLeDong: '100',
      soTienDong: '',
      tienDong: 0,
      tienDongThucTe: 0,
      tinhKCB: '', // No default province
      noiNhanHoSo: '',
      maBenhVien: DEFAULT_CSKCB.value, // Default hospital code
      tenBenhVien: DEFAULT_CSKCB.ten, // Default hospital name
      maHoGiaDinh: '',
      phuongAn: '',
      trangThai: '',

      // Thông tin thẻ cũ
      tuNgayTheCu: '',
      denNgayTheCu: '',

      // Thông tin đóng BHYT mới
      soThangDong: '12', // Mặc định 12 tháng
      sttHo: '',
      tuNgayTheMoi: '',
      denNgayTheMoi: '',
      ngayBienLai: new Date().toISOString().split('T')[0],
      ghiChuDongPhi: ''
    };

    setFormData(freshInitialData);
    console.log('✅ Form reset completed with fresh data');
  };

  const updateFormData = (data: Partial<KeKhai603FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Force recalculate amounts
  const forceRecalculate = () => {
    console.log('🔄 Force recalculating amounts...');
    if (formData.sttHo && formData.soThangDong) {
      const mucLuongNumber = formData.mucLuong ? parseFloat(formData.mucLuong.replace(/[.,]/g, '')) : 2340000;

      const soTien = calculateKeKhai603Amount(formData.sttHo, formData.soThangDong, mucLuongNumber);
      const soTienThucTe = calculateKeKhai603AmountThucTe(formData.sttHo, formData.soThangDong, mucLuongNumber, doiTuongThamGia);

      setFormData(prev => ({
        ...prev,
        soTienDong: soTien.toLocaleString('vi-VN'),
        tienDong: soTien,
        tienDongThucTe: soTienThucTe
      }));

      console.log('✅ Force recalculated:', {
        soTien: soTien.toLocaleString('vi-VN'),
        soTienThucTe: soTienThucTe.toLocaleString('vi-VN')
      });
    }
  };

  // Load participant data for editing
  const loadParticipantData = (participant: any) => {
    console.log('📝 Loading participant data for editing:', participant);
    console.log('🔍 Participant fields:', Object.keys(participant));
    console.log('🔍 Participant ID type:', typeof participant.id, 'Value:', participant.id);
    console.log('🔍 Participant hoTen:', participant.hoTen);

    const newFormData = {
      editingParticipantId: participant.id,
      hoTen: participant.hoTen || '',
      maSoBHXH: participant.maSoBHXH || '',
      ngaySinh: participant.ngaySinh || '',
      gioiTinh: participant.gioiTinh || '',
      soCCCD: participant.soCCCD || '',
      soDienThoai: participant.soDienThoai || '',
      email: participant.email || '',
      soTheBHYT: participant.soTheBHYT || '',
      danToc: participant.danToc || '',
      quocTich: participant.quocTich || 'VN',
      noiDangKyKCB: participant.noiDangKyKCB || '',
      noiNhanHoSo: participant.noiNhanHoSo || '', // Added missing field
      tinhKCB: participant.tinhKCB || '',
      maBenhVien: participant.maBenhVien || '',
      soThangDong: participant.soThangDong || '',
      sttHo: participant.sttHo || '',
      ngayBienLai: participant.ngayBienLai || new Date().toISOString().split('T')[0],
      maTinhNkq: participant.maTinhNkq || '',
      maHuyenNkq: participant.maHuyenNkq || '',
      maXaNkq: participant.maXaNkq || '',
      maTinhKS: participant.maTinhKS || '',
      maHuyenKS: participant.maHuyenKS || '',
      maXaKS: participant.maXaKS || '',
      tuNgayTheCu: participant.tuNgayTheCu || '',
      denNgayTheCu: participant.denNgayTheCu || '',
      tuNgayTheMoi: participant.tuNgayTheMoi || '',
      denNgayTheMoi: participant.denNgayTheMoi || '',
      maHoGiaDinh: participant.maHoGiaDinh || '',
      phuongAn: participant.phuongAn || '',
      mucLuong: '2,340,000',
      tyLeDong: '100',
      soTienDong: participant.tienDong ? participant.tienDong.toLocaleString('vi-VN') : '',
      tienDong: participant.tienDong || 0,
      tienDongThucTe: participant.tienDongThucTe || 0,
      ghiChuDongPhi: participant.ghiChuDongPhi || ''
    };

    console.log('🔄 Setting form data:', newFormData);
    setFormData(newFormData);

    console.log('✅ Form data loaded for editing with ID:', participant.id);
  };

  return {
    formData,
    handleInputChange,
    resetForm,
    updateFormData,
    forceRecalculate,
    loadParticipantData
  };
};
