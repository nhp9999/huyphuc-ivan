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
