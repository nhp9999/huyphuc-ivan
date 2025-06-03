import { supabase, CongTacVien, VCongTacVienChiTiet } from '../../../shared/services/api/supabaseClient';

export interface CreateCongTacVienRequest {
  ma_ctv: string;
  ho_ten: string;
  so_dien_thoai?: string;
  email?: string;
  dia_chi?: string;
  nhan_vien_thu_id: number;
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc: 'cong_ty' | 'co_quan_bhxh' | 'he_thong';
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  ghi_chu?: string;
  created_by?: string;
}

export interface UpdateCongTacVienRequest extends Partial<CreateCongTacVienRequest> {
  id: number;
  updated_by?: string;
}

export interface CongTacVienSearchParams {
  searchTerm?: string;
  nhanVienThuId?: number;
  loaiToChuc?: string;
  congTyId?: number;
  coQuanBhxhId?: number;
  trangThai?: string;
}

class CongTacVienService {
  // Lấy tất cả cộng tác viên
  async getAllCongTacVien(): Promise<VCongTacVienChiTiet[]> {
    try {
      const { data, error } = await supabase
        .from('v_cong_tac_vien_chi_tiet')
        .select('*')
        .eq('trang_thai', 'active')
        .order('ho_ten', { ascending: true });

      if (error) {
        console.error('Error fetching cong tac vien:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllCongTacVien:', error);
      throw error;
    }
  }

  // Lấy cộng tác viên theo ID
  async getCongTacVienById(id: number): Promise<CongTacVien | null> {
    try {
      const { data, error } = await supabase
        .from('cong_tac_vien')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching cong tac vien by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCongTacVienById:', error);
      throw error;
    }
  }

  // Lấy cộng tác viên theo nhân viên thu
  async getCongTacVienByNhanVienThu(nhanVienThuId: number): Promise<VCongTacVienChiTiet[]> {
    try {
      const { data, error } = await supabase
        .from('v_cong_tac_vien_chi_tiet')
        .select('*')
        .eq('nhan_vien_thu_id', nhanVienThuId)
        .eq('trang_thai', 'active')
        .order('ho_ten', { ascending: true });

      if (error) {
        console.error('Error fetching cong tac vien by nhan vien thu:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCongTacVienByNhanVienThu:', error);
      throw error;
    }
  }

  // Tạo cộng tác viên mới
  async createCongTacVien(congTacVien: CreateCongTacVienRequest): Promise<CongTacVien> {
    try {
      const { data, error } = await supabase
        .from('cong_tac_vien')
        .insert([{
          ...congTacVien,
          trang_thai: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating cong tac vien:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createCongTacVien:', error);
      throw error;
    }
  }

  // Cập nhật cộng tác viên
  async updateCongTacVien(congTacVien: UpdateCongTacVienRequest): Promise<CongTacVien> {
    try {
      const { id, ...updateData } = congTacVien;
      
      const { data, error } = await supabase
        .from('cong_tac_vien')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating cong tac vien:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCongTacVien:', error);
      throw error;
    }
  }

  // Xóa cộng tác viên (soft delete)
  async deleteCongTacVien(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('cong_tac_vien')
        .update({
          trang_thai: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting cong tac vien:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteCongTacVien:', error);
      throw error;
    }
  }

  // Tìm kiếm cộng tác viên
  async searchCongTacVien(params: CongTacVienSearchParams): Promise<VCongTacVienChiTiet[]> {
    try {
      let query = supabase
        .from('v_cong_tac_vien_chi_tiet')
        .select('*')
        .eq('trang_thai', 'active');

      if (params.searchTerm) {
        query = query.or(`ho_ten.ilike.%${params.searchTerm}%,ma_ctv.ilike.%${params.searchTerm}%,email.ilike.%${params.searchTerm}%`);
      }

      if (params.nhanVienThuId) {
        query = query.eq('nhan_vien_thu_id', params.nhanVienThuId);
      }

      if (params.loaiToChuc) {
        query = query.eq('loai_to_chuc', params.loaiToChuc);
      }

      if (params.congTyId) {
        query = query.eq('cong_ty_id', params.congTyId);
      }

      if (params.coQuanBhxhId) {
        query = query.eq('co_quan_bhxh_id', params.coQuanBhxhId);
      }

      const { data, error } = await query.order('ho_ten', { ascending: true });

      if (error) {
        console.error('Error searching cong tac vien:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchCongTacVien:', error);
      throw error;
    }
  }

  // Sinh mã cộng tác viên tự động
  async generateMaCongTacVien(nhanVienThuId: number): Promise<string> {
    try {
      // Lấy thông tin nhân viên thu
      const { data: nhanVienThu, error: nhanVienError } = await supabase
        .from('dm_nguoi_dung')
        .select('ma_nhan_vien, id')
        .eq('id', nhanVienThuId)
        .single();

      if (nhanVienError) {
        console.error('Error fetching nhan vien thu:', nhanVienError);
        throw nhanVienError;
      }

      // Tạo prefix từ mã nhân viên thu
      const maNhanVien = nhanVienThu.ma_nhan_vien || `NV${nhanVienThu.id.toString().padStart(3, '0')}`;
      const prefix = `CTV_${maNhanVien}`;

      // Đếm số cộng tác viên hiện có của nhân viên thu này
      const { count, error: countError } = await supabase
        .from('cong_tac_vien')
        .select('*', { count: 'exact', head: true })
        .eq('nhan_vien_thu_id', nhanVienThuId)
        .eq('trang_thai', 'active');

      if (countError) {
        console.error('Error counting cong tac vien:', countError);
        throw countError;
      }

      const nextNumber = (count || 0) + 1;
      const paddedNumber = nextNumber.toString().padStart(2, '0');
      
      return `${prefix}_${paddedNumber}`;
    } catch (error) {
      console.error('Error in generateMaCongTacVien:', error);
      // Fallback: tạo mã random
      const timestamp = Date.now().toString().slice(-6);
      return `CTV${timestamp}`;
    }
  }

  // Kiểm tra mã cộng tác viên đã tồn tại
  async checkMaCongTacVienExists(maCTV: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('cong_tac_vien')
        .select('id')
        .eq('ma_ctv', maCTV)
        .eq('trang_thai', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking ma cong tac vien exists:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkMaCongTacVienExists:', error);
      return false;
    }
  }

  // Lấy thống kê cộng tác viên theo nhân viên thu
  async getThongKeByNhanVienThu(): Promise<{ nhan_vien_thu_id: number; ten_nhan_vien_thu: string; so_luong_ctv: number }[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_thong_ke_cong_tac_vien_by_nhan_vien_thu');

      if (error) {
        console.error('Error getting thong ke cong tac vien by nhan vien thu:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getThongKeByNhanVienThu:', error);
      throw error;
    }
  }
}

export const congTacVienService = new CongTacVienService();
export default congTacVienService;
