import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { bhytService } from '../services/bhytService';
import { keKhaiService } from '../services/keKhaiService';
import { BhytDeclarationRequest } from '../types/bhyt';
import { DanhSachKeKhai } from '../services/supabaseClient';
import Toast from '../components/Toast';
import {
  Save,
  Send,
  Plus,
  Trash2,
  Search,
  Loader2,
  RotateCcw
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
  const { pageParams } = useNavigation();

  // State cho thông tin kê khai
  const [keKhaiInfo, setKeKhaiInfo] = useState<DanhSachKeKhai | null>(null);
  const [saving, setSaving] = useState(false);

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
    ngayBienLai: new Date().toISOString().split('T')[0], // Ngày hiện tại
    ghiChuDongPhi: ''
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

  // State cho loading riêng biệt
  const [savingData, setSavingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  // Khởi tạo kê khai khi component mount
  useEffect(() => {
    initializeKeKhai();
  }, [pageParams]);

  // Load danh sách người tham gia khi có keKhaiInfo
  useEffect(() => {
    if (keKhaiInfo) {
      loadNguoiThamGia();
    }
  }, [keKhaiInfo]);

  const initializeKeKhai = async () => {
    // Nếu có keKhaiId trong pageParams, load kê khai đó
    if (pageParams?.keKhaiId) {
      try {
        setSaving(true);
        const existingKeKhai = await keKhaiService.getKeKhaiById(pageParams.keKhaiId);
        if (existingKeKhai) {
          setKeKhaiInfo(existingKeKhai);
          showToast(`Đã tải kê khai ${existingKeKhai.ma_ke_khai}`, 'success');
          return;
        }
      } catch (error) {
        console.error('Error loading existing ke khai:', error);
        showToast('Không thể tải kê khai. Sẽ tạo kê khai mới.', 'warning');
      } finally {
        setSaving(false);
      }
    }

    // Nếu không có pageParams, tạo kê khai mặc định để test
    if (!pageParams?.formData) {
      const defaultKeKhaiData = {
        ten_ke_khai: 'Kê khai BHYT test',
        loai_ke_khai: '603',
        doi_tuong_tham_gia: 'GD - Hộ gia đình',
        hinh_thuc_tinh: 'Hỗ trợ dựa trên mức đóng từng người',
        luong_co_so: 2340000,
        nguon_dong: 'Tự đóng',
        created_by: 'system'
      };

      try {
        setSaving(true);
        const newKeKhai = await keKhaiService.createKeKhai(defaultKeKhaiData);
        setKeKhaiInfo(newKeKhai);
        showToast(`Đã tạo kê khai ${newKeKhai.ma_ke_khai} thành công!`, 'success');
      } catch (error) {
        console.error('Error creating default ke khai:', error);
        showToast('Có lỗi xảy ra khi tạo kê khai. Vui lòng thử lại.', 'error');
      } finally {
        setSaving(false);
      }
      return;
    }

    try {
      setSaving(true);

      // Tạo kê khai mới trong database
      const keKhaiData = {
        ten_ke_khai: pageParams.declarationName || 'Kê khai BHYT',
        loai_ke_khai: pageParams.declarationCode || '603',
        dai_ly_id: pageParams.formData.chonDaiLy ? parseInt(pageParams.formData.chonDaiLy) : undefined,
        don_vi_id: pageParams.formData.chonDonVi ? parseInt(pageParams.formData.chonDonVi) : undefined,
        doi_tuong_tham_gia: pageParams.formData.doiTuongThamGia,
        hinh_thuc_tinh: pageParams.formData.hinhThucTinh,
        luong_co_so: pageParams.formData.luongCoSo ? parseFloat(pageParams.formData.luongCoSo.replace(/[.,]/g, '')) : undefined,
        nguon_dong: pageParams.formData.nguonDong,
        noi_dang_ky_kcb_ban_dau: pageParams.formData.noiDangKyKCBBanDau || undefined,
        bien_lai_ngay_tham_gia: pageParams.formData.bienLaiNgayThamGia || undefined,
        so_thang: pageParams.formData.soThang ? parseInt(pageParams.formData.soThang) : undefined,
        ngay_tao: pageParams.formData.ngay || undefined,
        ty_le_nsnn_ho_tro: pageParams.formData.tyLeNSNNHoTro ? parseFloat(pageParams.formData.tyLeNSNNHoTro) : undefined,
        ghi_chu: pageParams.formData.ghiChu || undefined,
        created_by: 'system' // TODO: Lấy từ user context
      };

      const newKeKhai = await keKhaiService.createKeKhai(keKhaiData);
      setKeKhaiInfo(newKeKhai);

      showToast(`Đã tạo kê khai ${newKeKhai.ma_ke_khai} thành công!`, 'success');
    } catch (error) {
      console.error('Error initializing ke khai:', error);
      showToast('Có lỗi xảy ra khi tạo kê khai. Vui lòng thử lại.', 'error');
    } finally {
      setSaving(false);
    }
  };

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

  // Load danh sách người tham gia từ database
  const loadNguoiThamGia = async () => {
    if (!keKhaiInfo) return;

    try {
      const nguoiThamGiaList = await keKhaiService.getNguoiThamGiaByKeKhai(keKhaiInfo.id);

      // Convert dữ liệu từ database sang format của UI
      const convertedParticipants = nguoiThamGiaList.map(item => ({
        id: item.id,
        hoTen: item.ho_ten || '',
        maSoBHXH: item.ma_so_bhxh || '',
        ngaySinh: item.ngay_sinh || '',
        gioiTinh: item.gioi_tinh || 'Nam',
        noiDangKyKCB: item.noi_dang_ky_kcb || '',
        mucLuong: item.muc_luong?.toString() || '',
        tyLeDong: item.ty_le_dong?.toString() || '4.5',
        soTienDong: item.so_tien_dong?.toString() || '',
        tuNgayTheCu: item.tu_ngay_the_cu || '',
        denNgayTheCu: item.den_ngay_the_cu || '',
        ngayBienLai: item.ngay_bien_lai || new Date().toISOString().split('T')[0],
        sttHo: item.stt_ho || '',
        soThangDong: item.so_thang_dong?.toString() || '',
        maTinhNkq: item.ma_tinh_nkq || '',
        maHuyenNkq: item.ma_huyen_nkq || '',
        maXaNkq: item.ma_xa_nkq || '',
        noiNhanHoSo: item.noi_nhan_ho_so || '',
        // Thêm các field khác
        soCCCD: item.so_cccd || '',
        soDienThoai: item.so_dien_thoai || '',
        soTheBHYT: item.so_the_bhyt || '',
        quocTich: item.quoc_tich || 'VN',
        danToc: item.dan_toc || '',
        maTinhKs: item.ma_tinh_ks || '',
        maHuyenKs: item.ma_huyen_ks || '',
        maXaKs: item.ma_xa_ks || '',
        tinhKCB: item.tinh_kcb || '',
        maBenhVien: item.ma_benh_vien || '',
        maHoGiaDinh: item.ma_ho_gia_dinh || '',
        phuongAn: item.phuong_an || '',
        trangThaiThe: item.trang_thai_the || '',
        tuNgayTheMoi: item.tu_ngay_the_moi || '',
        denNgayTheMoi: item.den_ngay_the_moi || ''
      }));

      setParticipants(convertedParticipants);

      if (convertedParticipants.length > 0) {
        showToast(`Đã tải ${convertedParticipants.length} người tham gia từ database`, 'success');
      }
    } catch (error) {
      console.error('Error loading nguoi tham gia:', error);
      showToast('Có lỗi xảy ra khi tải danh sách người tham gia', 'error');
    }
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

  const handleParticipantChange = async (index: number, field: string, value: string) => {
    const participant = participants[index];
    if (!participant || !participant.id) return;

    // Cập nhật state local trước
    setParticipants(prev => prev.map((p, i) => {
      if (i === index) {
        const updatedParticipant = { ...p, [field]: value };

        // Tự động tính toán số tiền đóng khi thay đổi STT hộ hoặc số tháng
        if (field === 'sttHo' || field === 'soThangDong') {
          const sttHo = field === 'sttHo' ? value : p.sttHo;
          const soThangDong = field === 'soThangDong' ? value : p.soThangDong;

          if (sttHo && soThangDong) {
            const soTien = calculateBhytAmount(sttHo, soThangDong);
            updatedParticipant.soTienDong = soTien.toLocaleString('vi-VN');
          }
        }

        return updatedParticipant;
      }
      return p;
    }));

    // Lưu vào database (debounced để tránh quá nhiều request)
    try {
      const updateData: any = {};

      // Map field names từ UI sang database
      const fieldMapping: { [key: string]: string } = {
        'hoTen': 'ho_ten',
        'maSoBHXH': 'ma_so_bhxh',
        'ngaySinh': 'ngay_sinh',
        'gioiTinh': 'gioi_tinh',
        'noiDangKyKCB': 'noi_dang_ky_kcb',
        'mucLuong': 'muc_luong',
        'tyLeDong': 'ty_le_dong',
        'soTienDong': 'so_tien_dong',
        'tuNgayTheCu': 'tu_ngay_the_cu',
        'denNgayTheCu': 'den_ngay_the_cu',
        'ngayBienLai': 'ngay_bien_lai',
        'sttHo': 'stt_ho',
        'soThangDong': 'so_thang_dong',
        'maTinhNkq': 'ma_tinh_nkq',
        'maHuyenNkq': 'ma_huyen_nkq',
        'maXaNkq': 'ma_xa_nkq',
        'noiNhanHoSo': 'noi_nhan_ho_so'
      };

      const dbField = fieldMapping[field];
      if (dbField) {
        // Convert value nếu cần
        if (dbField === 'muc_luong' || dbField === 'ty_le_dong' || dbField === 'so_tien_dong' || dbField === 'so_thang_dong') {
          const numValue = parseFloat(value.replace(/[.,]/g, ''));
          updateData[dbField] = isNaN(numValue) ? null : numValue;
        } else {
          updateData[dbField] = value || null;
        }

        // Cập nhật database
        await keKhaiService.updateNguoiThamGia(participant.id, updateData);
      }
    } catch (error) {
      console.error('Error updating participant:', error);
      // Không hiển thị toast để tránh spam, chỉ log lỗi
    }
  };

  const addParticipant = async () => {
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai. Vui lòng thử lại.', 'error');
      return;
    }

    try {
      setSavingData(true);

      const newParticipantData = {
        ke_khai_id: keKhaiInfo.id,
        stt: participants.length + 1,
        ho_ten: '',
        gioi_tinh: 'Nam',
        muc_luong: 0,
        ty_le_dong: 4.5,
        so_tien_dong: 0,
        ngay_bien_lai: new Date().toISOString().split('T')[0],
        so_thang_dong: 0
      };

      // Lưu vào database
      const savedParticipant = await keKhaiService.addNguoiThamGia(newParticipantData);

      // Cập nhật state local
      const newParticipant = {
        id: savedParticipant.id,
        hoTen: '',
        maSoBHXH: '',
        ngaySinh: '',
        gioiTinh: 'Nam',
        noiDangKyKCB: '',
        mucLuong: '',
        tyLeDong: '4.5',
        soTienDong: '',
        tuNgayTheCu: '',
        denNgayTheCu: '',
        ngayBienLai: new Date().toISOString().split('T')[0],
        sttHo: '',
        soThangDong: '',
        maTinhNkq: '',
        maHuyenNkq: '',
        maXaNkq: '',
        noiNhanHoSo: ''
      };

      setParticipants(prev => [...prev, newParticipant]);
      showToast('Đã thêm người tham gia mới thành công!', 'success');
    } catch (error) {
      console.error('Error adding participant:', error);
      showToast('Có lỗi xảy ra khi thêm người tham gia. Vui lòng thử lại.', 'error');
    } finally {
      setSavingData(false);
    }
  };

  const removeParticipant = async (index: number) => {
    const participant = participants[index];
    if (!participant) return;

    // Không cho phép xóa nếu chỉ còn 1 người
    if (participants.length <= 1) {
      showToast('Phải có ít nhất một người tham gia trong kê khai', 'warning');
      return;
    }

    try {
      setSavingData(true);

      // Xóa khỏi database nếu có ID (đã được lưu)
      if (participant.id) {
        await keKhaiService.deleteNguoiThamGia(participant.id);
      }

      // Cập nhật state local
      setParticipants(prev => prev.filter((_, i) => i !== index));

      showToast('Đã xóa người tham gia thành công!', 'success');
    } catch (error) {
      console.error('Error removing participant:', error);
      showToast('Có lỗi xảy ra khi xóa người tham gia. Vui lòng thử lại.', 'error');
    } finally {
      setSavingData(false);
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



  const handleSubmit = async () => {
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai. Vui lòng thử lại.', 'error');
      return;
    }

    if (participants.length === 0) {
      showToast('Vui lòng thêm ít nhất một người tham gia.', 'warning');
      return;
    }

    try {
      setSubmitting(true);

      // Cập nhật trạng thái kê khai thành submitted
      await keKhaiService.updateKeKhai(keKhaiInfo.id, {
        trang_thai: 'submitted',
        updated_by: 'system' // TODO: Lấy từ user context
      });

      showToast('Đã nộp kê khai thành công!', 'success');
    } catch (error) {
      console.error('Error submitting declaration:', error);
      showToast('Có lỗi xảy ra khi nộp kê khai. Vui lòng thử lại.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Lưu tất cả dữ liệu (kê khai + người tham gia)
  const handleSaveAllParticipants = async () => {
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai. Vui lòng thử lại.', 'error');
      return;
    }

    try {
      setSavingData(true);

      // 1. Cập nhật thông tin kê khai trước
      await keKhaiService.updateKeKhai(keKhaiInfo.id, {
        trang_thai: 'draft',
        updated_by: 'system' // TODO: Lấy từ user context
      });

      // 2. Lưu người tham gia (nếu có)
      let savedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      if (participants.length === 0) {
        showToast('Đã lưu thông tin kê khai thành công!', 'success');
        return;
      }

      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];

        try {
          // Chuẩn bị dữ liệu để lưu
          const participantData = {
            ke_khai_id: keKhaiInfo.id,
            stt: i + 1,
            ho_ten: participant.hoTen || '',
            ma_so_bhxh: participant.maSoBHXH || null,
            ngay_sinh: participant.ngaySinh || null,
            gioi_tinh: participant.gioiTinh || 'Nam',
            so_cccd: participant.soCCCD || null,
            noi_dang_ky_kcb: participant.noiDangKyKCB || null,
            so_dien_thoai: participant.soDienThoai || null,
            so_the_bhyt: participant.soTheBHYT || null,
            quoc_tich: participant.quocTich || 'VN',
            dan_toc: participant.danToc || null,
            ma_tinh_ks: participant.maTinhKs || null,
            ma_huyen_ks: participant.maHuyenKs || null,
            ma_xa_ks: participant.maXaKs || null,
            ma_tinh_nkq: participant.maTinhNkq || null,
            ma_huyen_nkq: participant.maHuyenNkq || null,
            ma_xa_nkq: participant.maXaNkq || null,
            noi_nhan_ho_so: participant.noiNhanHoSo || null,
            muc_luong: participant.mucLuong ? parseFloat(participant.mucLuong.replace(/[.,]/g, '')) : null,
            ty_le_dong: participant.tyLeDong ? parseFloat(participant.tyLeDong) : 4.5,
            so_tien_dong: participant.soTienDong ? parseFloat(participant.soTienDong.replace(/[.,]/g, '')) : null,
            tinh_kcb: participant.tinhKCB || null,
            ma_benh_vien: participant.maBenhVien || null,
            ma_ho_gia_dinh: participant.maHoGiaDinh || null,
            phuong_an: participant.phuongAn || null,
            trang_thai_the: participant.trangThaiThe || null,
            tu_ngay_the_cu: participant.tuNgayTheCu || null,
            den_ngay_the_cu: participant.denNgayTheCu || null,
            so_thang_dong: participant.soThangDong ? parseInt(participant.soThangDong) : null,
            stt_ho: participant.sttHo || null,
            tu_ngay_the_moi: participant.tuNgayTheMoi || null,
            den_ngay_the_moi: participant.denNgayTheMoi || null,
            ngay_bien_lai: participant.ngayBienLai || new Date().toISOString().split('T')[0]
          };

          if (participant.id) {
            // Cập nhật người tham gia đã có
            await keKhaiService.updateNguoiThamGia(participant.id, participantData);
            updatedCount++;
          } else {
            // Thêm người tham gia mới
            const savedParticipant = await keKhaiService.addNguoiThamGia(participantData);

            // Cập nhật ID trong state local
            setParticipants(prev => prev.map((p, index) =>
              index === i ? { ...p, id: savedParticipant.id } : p
            ));

            savedCount++;
          }
        } catch (error) {
          console.error(`Error saving participant ${i + 1}:`, error);
          errorCount++;
        }
      }

      // Hiển thị kết quả
      if (errorCount === 0) {
        if (savedCount + updatedCount > 0) {
          showToast(
            `Đã lưu thành công kê khai và ${savedCount} người mới, cập nhật ${updatedCount} người!`,
            'success'
          );
        } else {
          showToast('Đã lưu thông tin kê khai thành công!', 'success');
        }
      } else {
        showToast(
          `Đã lưu kê khai và ${savedCount + updatedCount} người thành công, ${errorCount} người lỗi.`,
          'warning'
        );
      }

    } catch (error) {
      console.error('Error saving all participants:', error);
      showToast('Có lỗi xảy ra khi ghi dữ liệu. Vui lòng thử lại.', 'error');
    } finally {
      setSavingData(false);
    }
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

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setFormData({
      maSoBHXH: '',
      hoTen: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      soCCCD: '',
      noiDangKyKCB: '',
      soDienThoai: '',
      soTheBHYT: '',
      quocTich: 'VN',
      danToc: '',
      maTinhKS: '',
      maHuyenKS: '',
      maXaKS: '',
      maTinhNkq: '',
      maHuyenNkq: '',
      maXaNkq: '',
      loaiDoiTuong: '',
      mucLuong: '',
      tyLeDong: '4.5',
      soTienDong: '',
      tinhKCB: '',
      noiNhanHoSo: '',
      maBenhVien: '',
      maHoGiaDinh: '',
      phuongAn: '',
      trangThai: '',
      tuNgayTheCu: '',
      denNgayTheCu: '',
      sttHo: '',
      tuNgayTheMoi: '',
      denNgayTheMoi: '',
      ngayBienLai: new Date().toISOString().split('T')[0],
      ghiChuDongPhi: ''
    });
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

        // Kiểm tra xem mã số BHXH đã tồn tại trong danh sách chưa
        const existingParticipantIndex = participants.findIndex(p => p.maSoBHXH === response.data!.maSoBhxh);

        if (existingParticipantIndex >= 0) {
          // Nếu đã tồn tại, cập nhật participant đó
          setParticipants(prev => prev.map((participant, index) =>
            index === existingParticipantIndex ? {
              ...participant,
              hoTen: response.data!.hoTen,
              maSoBHXH: response.data!.maSoBhxh,
              ngaySinh: response.data!.ngaySinh,
              gioiTinh: response.data!.gioiTinh,
              noiDangKyKCB: response.data!.noiDangKyKCB,
              mucLuong: response.data!.mucLuong || '',
              tyLeDong: response.data!.tyLeDong || '4.5',
              soTienDong: response.data!.soTienDong || '',
              maTinhNkq: response.data!.maTinhNkq || '',
              maHuyenNkq: response.data!.maHuyenNkq || '',
              maXaNkq: response.data!.maXaNkq || '',
              noiNhanHoSo: response.data!.noiNhanHoSo || ''
            } : participant
          ));
          showToast('Đã cập nhật thông tin người tham gia hiện có!', 'info');
        } else {
          // Nếu chưa tồn tại, thêm participant mới
          const newParticipant = {
            id: 0, // Sẽ được cập nhật khi lưu vào database
            hoTen: response.data!.hoTen,
            maSoBHXH: response.data!.maSoBhxh,
            ngaySinh: response.data!.ngaySinh,
            gioiTinh: response.data!.gioiTinh,
            noiDangKyKCB: response.data!.noiDangKyKCB,
            mucLuong: response.data!.mucLuong || '',
            tyLeDong: response.data!.tyLeDong || '4.5',
            soTienDong: response.data!.soTienDong || '',
            tuNgayTheCu: convertDisplayDateToInputDate(response.data!.ngayHieuLuc || ''),
            denNgayTheCu: convertDisplayDateToInputDate(response.data!.ngayHetHan || ''),
            ngayBienLai: new Date().toISOString().split('T')[0],
            sttHo: '',
            soThangDong: '',
            maTinhNkq: response.data!.maTinhNkq || '',
            maHuyenNkq: response.data!.maHuyenNkq || '',
            maXaNkq: response.data!.maXaNkq || '',
            noiNhanHoSo: response.data!.noiNhanHoSo || '',
            // Thêm các field khác
            soCCCD: response.data!.cmnd || '',
            soDienThoai: response.data!.soDienThoai || '',
            soTheBHYT: response.data!.soTheBHYT || '',
            quocTich: response.data!.quocTich || 'VN',
            danToc: response.data!.danToc || '',
            maTinhKs: response.data!.maTinhKS || '',
            maHuyenKs: response.data!.maHuyenKS || '',
            maXaKs: response.data!.maXaKS || '',
            tinhKCB: response.data!.maKV || '',
            maBenhVien: response.data!.maBenhVien || '',
            maHoGiaDinh: response.data!.maHoGiaDinh || '',
            phuongAn: response.data!.phuongAn || '',
            trangThaiThe: response.data!.trangThaiThe || '',
            tuNgayTheMoi: '',
            denNgayTheMoi: ''
          };

          setParticipants(prev => [...prev, newParticipant]);
          showToast('Đã thêm người tham gia mới từ kết quả tìm kiếm!', 'success');
        }

        // Cập nhật thông tin tóm tắt API
        setApiSummary({
          isLoaded: true,
          lastUpdated: new Date().toLocaleString('vi-VN'),
          source: 'API kê khai BHYT'
        });

        // Thông báo đã được hiển thị ở trên (trong if-else)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kê khai BHYT
            {keKhaiInfo && (
              <span className="ml-3 text-lg font-medium text-blue-600 dark:text-blue-400">
                {keKhaiInfo.ma_ke_khai}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {pageParams?.declarationName || 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT'}
            {keKhaiInfo && (
              <span className="ml-2 text-sm">
                • Trạng thái:
                <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                  keKhaiInfo.trang_thai === 'draft'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : keKhaiInfo.trang_thai === 'submitted'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {keKhaiInfo.trang_thai === 'draft' ? 'Nháp' :
                   keKhaiInfo.trang_thai === 'submitted' ? 'Đã nộp' : keKhaiInfo.trang_thai}
                </span>
              </span>
            )}
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
              onClick={resetForm}
              disabled={savingData || submitting}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Form</span>
            </button>
            <button
              onClick={handleSaveAllParticipants}
              disabled={savingData || submitting || !keKhaiInfo}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingData ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingData ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={savingData || submitting || !keKhaiInfo || participants.length === 0}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{submitting ? 'Đang gửi...' : 'Gửi kê khai'}</span>
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
                value={formData.ghiChuDongPhi || ''}
                onChange={(e) => handleInputChange('ghiChuDongPhi', e.target.value)}
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
              disabled={savingData || submitting || !keKhaiInfo}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingData ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{savingData ? 'Đang thêm...' : 'Thêm người'}</span>
            </button>
            <button
              onClick={handleSaveAllParticipants}
              disabled={savingData || submitting || !keKhaiInfo}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingData ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingData ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
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
                  disabled={savingData || submitting || !keKhaiInfo}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingData ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{savingData ? 'Đang thêm...' : 'Thêm người'}</span>
                </button>
                <button
                  onClick={handleSaveAllParticipants}
                  disabled={savingData || submitting || !keKhaiInfo}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingData ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingData ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
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
