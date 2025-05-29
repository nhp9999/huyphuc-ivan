import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iflhpowkcbptcplankaz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbGhwb3drY2JwdGNwbGFua2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NzAyMzIsImV4cCI6MjA2MzA0NjIzMn0.kBgZ8fESy0vx0ZgX1WRszlXCMcCHYF4Jh4TzcJh1OK4';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DanhMucThuTuc {
  id: number;
  stt: number;
  ky_hieu: string;
  ma: string;
  ten: string;
  linh_vuc: number;
  mo_ta?: string;
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface BhytKeKhai {
  id: string;
  so_the_bhyt?: number;
  luong_co_so: number;
  ty_le_nsnn: number;
  loai_doi_tuong: string;
  nguon_dong?: string;
  ten_doi_tuong?: string;
  hinh_thuc_tinh: number;
  ngay_tao: string;
  ngay_cap_nhat: string;
  trang_thai: string;
  ghi_chu?: string;
}

export interface BhytNguoiThamGia {
  id: string;
  kekhai_id: string;
  ma_id?: string;
  stt: number;
  ho_ten: string;
  ma_so_bhxh?: string;
  so_cccd?: string;
  ma_nhanvien_thu?: string;
  ngay_sinh?: string;
  gioi_tinh?: number;
  ma_tinh_benhvien?: string;
  ma_benhvien?: string;
  ghi_chu?: string;
  ngay_bien_lai?: string;
  so_bien_lai?: string;
  tien_dong?: number;
  so_thang?: number;
  ccns?: number;
  phuong_an?: string;
  tu_ngay?: string;
  ngay_chet?: string;
  co_giam_chet?: number;
  ma_vung_ss?: string;
  loai?: number;
  ma_phong_ban?: string;
  muc_huong?: number;
  ma_tinh_dangss?: string;
  ma_huyen_dangss?: string;
  ma_xa_dangss?: string;
  ty_le_nsdp?: number;
  ho_tro_khac?: string;
  dia_chi_dangss?: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface VBhytKeKhaiChiTiet {
  kekhai_id: string;
  so_the_bhyt?: number;
  luong_co_so: number;
  loai_doi_tuong: string;
  trang_thai_kekhai: string;
  ngay_tao_kekhai: string;
  nguoi_id: string;
  stt: number;
  ho_ten: string;
  ma_so_bhxh?: string;
  so_cccd?: string;
  ngay_sinh?: string;
  gioi_tinh_text: string;
  ngay_bien_lai?: string;
  so_bien_lai?: string;
  tien_dong?: number;
  so_thang?: number;
  phuong_an_text: string;
  tu_ngay?: string;
  dia_chi_dangss?: string;
  ten_tinh?: string;
  ten_huyen?: string;
  ten_xa?: string;
}

export interface DmDonVi {
  id: number;
  ma_co_quan_bhxh?: string;
  ma_so_bhxh?: string;
  ten_don_vi: string;
  is_bhxh_tn: number;
  is_bhyt: number;
  dm_khoi_kcb_id?: number;
  ma_khoi_kcb?: string;
  ten_khoi_kcb?: string;
  type: number;
  dai_ly_id?: number;
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface DmKhoiKcb {
  id: number;
  ma_khoi: string;
  ten_khoi: string;
  mo_ta?: string;
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface VDonViChiTiet {
  id: number;
  ma_co_quan_bhxh?: string;
  ma_so_bhxh?: string;
  ten_don_vi: string;
  is_bhxh_tn: number;
  is_bhyt: number;
  type: number;
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  dm_khoi_kcb_id?: number;
  ma_khoi_kcb?: string;
  ten_khoi_kcb?: string;
  dai_ly_id?: number;
  mo_ta_khoi?: string;
  loai_dich_vu: string;
  loai_don_vi: string;
  // Thông tin đại lý
  ma_dai_ly?: string;
  ten_dai_ly?: string;
  loai_dai_ly?: string;
  cap_dai_ly?: string;
  ma_tinh_dai_ly?: string;
}

export interface DmDaiLy {
  id: number;
  ma: string;
  ten: string;
  cap?: number;
  has_children: boolean;
  cha_id?: number;
  is_clickable: boolean;
  is_current: boolean;
  ma_tinh?: string;
  type?: number;
  is_dai_ly: boolean;
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface VDaiLyChiTiet {
  id: number;
  ma: string;
  ten: string;
  cap?: number;
  has_children: boolean;
  cha_id?: number;
  is_clickable: boolean;
  is_current: boolean;
  ma_tinh?: string;
  type?: number;
  is_dai_ly: boolean;
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  ten_cha?: string;
  ma_cha?: string;
  loai_dai_ly: string;
  ten_cap: string;
}

// Bảng trung gian many-to-many
export interface DaiLyDonVi {
  id: number;
  dai_ly_id: number;
  don_vi_id: number;
  ngay_lien_ket: string;
  trang_thai: string;
  ghi_chu?: string;
}

// View cho đơn vị với nhiều đại lý
export interface VDonViDaiLy {
  don_vi_id: number;
  ma_co_quan_bhxh?: string;
  ma_so_bhxh?: string;
  ten_don_vi: string;
  is_bhxh_tn: number;
  is_bhyt: number;
  type: number;
  don_vi_trang_thai: string;
  don_vi_ngay_tao: string;
  don_vi_ngay_cap_nhat: string;
  dm_khoi_kcb_id?: number;
  ma_khoi_kcb?: string;
  ten_khoi_kcb?: string;
  mo_ta_khoi?: string;
  loai_dich_vu: string;
  loai_don_vi: string;
  // Thông tin đại lý (có thể null nếu chưa liên kết)
  dai_ly_id?: number;
  ma_dai_ly?: string;
  ten_dai_ly?: string;
  loai_dai_ly?: string;
  cap_dai_ly?: string;
  ma_tinh_dai_ly?: string;
  ngay_lien_ket?: string;
  ghi_chu_lien_ket?: string;
}

// View cho đại lý với nhiều đơn vị
export interface VDaiLyDonVi {
  dai_ly_id: number;
  ma_dai_ly: string;
  ten_dai_ly: string;
  cap?: number;
  has_children: boolean;
  cha_id?: number;
  is_clickable: boolean;
  is_current: boolean;
  ma_tinh?: string;
  type?: number;
  is_dai_ly: boolean;
  dai_ly_trang_thai: string;
  loai_dai_ly: string;
  ten_cap: string;
  // Thông tin đơn vị (có thể null nếu chưa liên kết)
  don_vi_id?: number;
  ma_so_bhxh?: string;
  ten_don_vi?: string;
  loai_dich_vu?: string;
  loai_don_vi?: string;
  ngay_lien_ket?: string;
  ghi_chu_lien_ket?: string;
}
