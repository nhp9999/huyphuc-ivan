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
  trang_thai: string; // 'active' = đã phát triển, 'inactive' = chưa phát triển, 'draft' = đang phát triển
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

export interface DmLuongCoSo {
  id: number;
  mucluong: number;
  thang: string;
  thanghienthi: string;
  ghichu?: string;
  rownum: number;
  created_at: string;
  updated_at: string;
}

export interface DmDonVi {
  id: number;
  ma_co_quan_bhxh?: string;
  ma_don_vi?: string;
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
  ma_don_vi?: string;
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
  ma_don_vi?: string;
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
  ma_don_vi?: string;
  ten_don_vi?: string;
  loai_dich_vu?: string;
  loai_don_vi?: string;
  ngay_lien_ket?: string;
  ghi_chu_lien_ket?: string;
}

// Interface cho bảng danh_sach_ke_khai
export interface DanhSachKeKhai {
  id: number;
  ma_ke_khai: string;
  ten_ke_khai: string;
  loai_ke_khai: string;
  dai_ly_id?: number;
  don_vi_id?: number;
  doi_tuong_tham_gia?: string;
  hinh_thuc_tinh?: string;
  luong_co_so?: number;
  nguon_dong?: string;
  noi_dang_ky_kcb_ban_dau?: string;
  bien_lai_ngay_tham_gia?: string;
  so_thang?: number;
  ngay_tao?: string;
  ty_le_nsnn_ho_tro?: number;
  ghi_chu?: string;
  trang_thai: string; // 'draft', 'submitted', 'processing', 'approved', 'rejected', 'pending_payment', 'paid'
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  // Thêm các trường cho workflow duyệt kê khai
  approved_by?: string;
  approved_at?: string;
  // Thêm các trường cho thanh toán
  payment_status?: string; // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  payment_id?: number;
  total_amount?: number;
  payment_required_at?: string;
  payment_completed_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  processing_notes?: string;
}

// Interface cho bảng thanh_toan
export interface ThanhToan {
  id: number;
  ke_khai_id: number;
  ma_thanh_toan: string;
  so_tien: number;
  phuong_thuc_thanh_toan: string; // 'qr_code', 'bank_transfer', 'cash'
  trang_thai: string; // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  qr_code_data?: string;
  qr_code_url?: string;
  bank_info?: string; // JSON string chứa thông tin ngân hàng
  transaction_id?: string;
  payment_gateway?: string; // 'vietqr', 'vnpay', 'momo', etc.
  payment_reference?: string;
  payment_description?: string;
  proof_image_url?: string;
  confirmation_note?: string;
  expired_at?: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  ghi_chu?: string;
}

// Interface cho bảng danh_sach_nguoi_tham_gia
export interface DanhSachNguoiThamGia {
  id: number;
  ke_khai_id: number;
  stt: number;
  ho_ten: string;
  ma_so_bhxh?: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  so_cccd?: string;
  noi_dang_ky_kcb?: string;
  so_dien_thoai?: string;
  so_the_bhyt?: string;
  quoc_tich?: string;
  dan_toc?: string;
  ma_tinh_ks?: string;
  ma_huyen_ks?: string;
  ma_xa_ks?: string;
  ma_tinh_nkq?: string;
  ma_huyen_nkq?: string;
  ma_xa_nkq?: string;
  noi_nhan_ho_so?: string;
  muc_luong?: number;
  ty_le_dong?: number;
  so_tien_dong?: number;
  tinh_kcb?: string;
  ma_benh_vien?: string;
  ma_ho_gia_dinh?: string;
  phuong_an?: string;
  trang_thai_the?: string;
  tu_ngay_the_cu?: string;
  den_ngay_the_cu?: string;
  so_thang_dong?: number;
  stt_ho?: string;
  tu_ngay_the_moi?: string;
  den_ngay_the_moi?: string;
  ngay_bien_lai?: string;
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface cho bảng dm_tinh
export interface DmTinh {
  id: number;
  ma?: string;
  ten: string;
  text: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// Interface cho bảng dm_cskcb (Cơ sở Khám chữa bệnh)
export interface DmCSKCB {
  id: number;
  ma: string;
  ten: string;
  text: string;
  value: string;
  ma_tinh: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  website?: string;
  loai_cskcb?: string; // 'benh_vien', 'phong_kham', 'trung_tam_y_te', etc
  cap_cskcb?: string; // 'trung_uong', 'tinh', 'huyen', 'xa'
  trang_thai?: string; // 'active', 'inactive'
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Interface cho bảng dm_huyen
export interface DmHuyen {
  id: number;
  ma?: string;
  ten: string;
  text: string;
  value: string;
  ma_tinh: string;
  created_at: string;
  updated_at: string;
}

// Interface cho bảng dm_xa
export interface DmXa {
  id: number;
  ma?: string;
  ten: string;
  text: string;
  value: string;
  ma_huyen: string;
  ma_tinh: string;
  created_at: string;
  updated_at: string;
}

// Interface cho bảng dm_cong_ty
export interface DmCongTy {
  id: number;
  ma_cong_ty: string;
  ten_cong_ty: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  ma_so_thue?: string;
  nguoi_dai_dien?: string;
  ghi_chu?: string;
  trang_thai: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Interface cho bảng dm_co_quan_bhxh
export interface DmCoQuanBhxh {
  id: number;
  ma_co_quan: string;
  ten_co_quan: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  ma_tinh?: string;
  ma_huyen?: string;
  cap_co_quan: string; // 'tinh', 'huyen', 'trung_uong'
  co_quan_cha_id?: number;
  ghi_chu?: string;
  trang_thai: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Interface cho bảng dm_vai_tro
export interface DmVaiTro {
  id: number;
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
  quyen_han?: string; // JSON string chứa danh sách quyền
  cap_do: string; // 'user', 'admin', 'super_admin'
  trang_thai: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Interface cho bảng dm_nguoi_dung
export interface DmNguoiDung {
  id: number;
  email: string;
  mat_khau: string;
  ho_ten: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  avatar_url?: string;
  last_login?: string;
  trang_thai: string;
  ma_nhan_vien?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Interface cho bảng phan_quyen_nguoi_dung
export interface PhanQuyenNguoiDung {
  id: number;
  nguoi_dung_id: number;
  vai_tro_id: number;
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc: string; // 'cong_ty', 'co_quan_bhxh', 'he_thong'
  cap_do_quyen: string; // 'user', 'admin', 'super_admin'
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  trang_thai: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Interface cho bảng cong_tac_vien
export interface CongTacVien {
  id: number;
  ma_ctv: string;
  ho_ten: string;
  so_dien_thoai?: string;
  email?: string;
  dia_chi?: string;
  nhan_vien_thu_id: number; // FK to dm_nguoi_dung
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc: string;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  ghi_chu?: string;
  trang_thai: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Interface cho bảng vnpost_tokens
export interface VnPostToken {
  id: string;
  token_value: string;
  token_type: string;
  token_format: string;
  header_name?: string;
  source_type: string;
  source_detail?: string;
  url: string;
  http_method?: string;
  status_code?: number;
  request_timestamp?: string;
  request_timestamp_ms?: number;
  timestamp_source?: string;
  captured_at?: string;
  captured_at_ms?: number;
  is_jwt?: boolean;
  jwt_issued_at?: string;
  jwt_issued_at_ms?: number;
  jwt_expires_at?: string;
  jwt_expires_at_ms?: number;
  jwt_decoded?: any;
  user_agent?: string;
  request_id?: string;
  session_info?: any;
  created_at?: string;
  updated_at?: string;
}

// Interface cho view v_nguoi_dung_phan_quyen
export interface VNguoiDungPhanQuyen {
  id: number;
  email: string;
  ho_ten: string;
  so_dien_thoai?: string;
  trang_thai_nguoi_dung: string;
  ma_vai_tro: string;
  ten_vai_tro: string;
  cap_do: string;
  loai_to_chuc: string;
  cap_do_quyen: string;
  ma_cong_ty?: string;
  ten_cong_ty?: string;
  ma_co_quan?: string;
  ten_co_quan?: string;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  trang_thai_phan_quyen: string;
}

// Interface cho view v_cong_tac_vien_chi_tiet
export interface VCongTacVienChiTiet {
  id: number;
  ma_ctv: string;
  ho_ten: string;
  so_dien_thoai?: string;
  email?: string;
  loai_to_chuc: string;
  ma_cong_ty?: string;
  ten_cong_ty?: string;
  ma_co_quan?: string;
  ten_co_quan?: string;
  ten_nhan_vien_thu: string;
  email_nhan_vien_thu: string;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  trang_thai: string;
}

// Interface cho view v_co_quan_bhxh_chi_tiet
export interface VCoQuanBhxhChiTiet {
  id: number;
  ma_co_quan: string;
  ten_co_quan: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  cap_co_quan: string;
  trang_thai: string;
  ma_co_quan_cha?: string;
  ten_co_quan_cha?: string;
  ten_tinh?: string;
  ten_huyen?: string;
}