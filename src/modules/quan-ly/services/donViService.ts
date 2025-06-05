import { supabase, DmDonVi, DmKhoiKcb, VDonViChiTiet } from '../../../shared/services/api/supabaseClient';

export interface DonViSearchParams {
  searchTerm?: string;
  maCoQuanBHXH?: string;
  loaiDichVu?: 'BHXH' | 'BHYT' | 'ALL';
  type?: number;
  trangThai?: string;
}

class DonViService {
  // Lấy tất cả đơn vị
  async getAllDonVi(): Promise<VDonViChiTiet[]> {
    try {
      const { data, error } = await supabase
        .from('v_don_vi_chitiet')
        .select('*')
        .eq('trang_thai', 'active')
        .order('ten_don_vi', { ascending: true });

      if (error) {
        console.error('Error fetching don vi:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllDonVi:', error);
      throw error;
    }
  }

  // Tìm kiếm đơn vị
  async searchDonVi(params: DonViSearchParams): Promise<VDonViChiTiet[]> {
    try {
      let query = supabase
        .from('v_don_vi_chitiet')
        .select('*')
        .eq('trang_thai', 'active');

      // Tìm kiếm theo từ khóa
      if (params.searchTerm && params.searchTerm.trim()) {
        const searchTerm = params.searchTerm.trim();
        query = query.or(`ten_don_vi.ilike.%${searchTerm}%,ma_don_vi.ilike.%${searchTerm}%,ma_co_quan_bhxh.ilike.%${searchTerm}%`);
      }

      // Lọc theo mã cơ quan BHXH
      if (params.maCoQuanBHXH) {
        query = query.eq('ma_co_quan_bhxh', params.maCoQuanBHXH);
      }

      // Lọc theo loại dịch vụ
      if (params.loaiDichVu && params.loaiDichVu !== 'ALL') {
        if (params.loaiDichVu === 'BHXH') {
          query = query.eq('is_bhxh_tn', 1);
        } else if (params.loaiDichVu === 'BHYT') {
          query = query.eq('is_bhyt', 1);
        }
      }

      // Lọc theo type
      if (params.type) {
        query = query.eq('type', params.type);
      }

      // Lọc theo trạng thái
      if (params.trangThai) {
        query = query.eq('trang_thai', params.trangThai);
      }

      const { data, error } = await query.order('ten_don_vi', { ascending: true });

      if (error) {
        console.error('Error searching don vi:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchDonVi:', error);
      throw error;
    }
  }

  // Lấy đơn vị theo ID
  async getDonViById(id: number): Promise<VDonViChiTiet | null> {
    try {
      const { data, error } = await supabase
        .from('v_don_vi_chitiet')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching don vi by id:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getDonViById:', error);
      throw error;
    }
  }

  // Lấy đơn vị theo mã đơn vị
  async getDonViByMaDonVi(maDonVi: string): Promise<VDonViChiTiet | null> {
    try {
      const { data, error } = await supabase
        .from('v_don_vi_chitiet')
        .select('*')
        .eq('ma_don_vi', maDonVi)
        .eq('trang_thai', 'active')
        .single();

      if (error) {
        console.error('Error fetching don vi by ma don vi:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getDonViByMaDonVi:', error);
      throw error;
    }
  }

  // Lấy danh sách mã cơ quan BHXH
  async getMaCoQuanBHXHList(): Promise<{ value: string; label: string }[]> {
    try {
      const { data, error } = await supabase
        .from('dm_don_vi')
        .select('ma_co_quan_bhxh')
        .eq('trang_thai', 'active')
        .not('ma_co_quan_bhxh', 'is', null);

      if (error) {
        console.error('Error fetching ma co quan bhxh list:', error);
        throw error;
      }

      // Tạo danh sách mã cơ quan duy nhất
      const uniqueMaCoQuan = [...new Set(data?.map(item => item.ma_co_quan_bhxh).filter(Boolean) || [])];

      return uniqueMaCoQuan.map(ma => ({
        value: ma,
        label: ma
      })).sort((a, b) => a.value.localeCompare(b.value));
    } catch (error) {
      console.error('Error in getMaCoQuanBHXHList:', error);
      throw error;
    }
  }

  // Lấy danh sách khối KCB
  async getKhoiKCBList(): Promise<DmKhoiKcb[]> {
    try {
      const { data, error } = await supabase
        .from('dm_khoi_kcb')
        .select('*')
        .eq('trang_thai', 'active')
        .order('ten_khoi', { ascending: true });

      if (error) {
        console.error('Error fetching khoi kcb list:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getKhoiKCBList:', error);
      throw error;
    }
  }

  // Chuyển đổi loại đơn vị thành tên
  getLoaiDonViLabel(type: number): string {
    const typeMap: { [key: number]: string } = {
      1: 'Cơ quan nhà nước',
      2: 'Dịch vụ thu',
      3: 'Doanh nghiệp',
      4: 'Tổ chức khác'
    };
    return typeMap[type] || `Loại ${type}`;
  }

  // Thống kê số lượng đơn vị theo loại
  async getThongKeTheoLoai(): Promise<{ type: number; so_luong: number; ten_loai: string }[]> {
    try {
      const { data, error } = await supabase
        .from('dm_don_vi')
        .select('type')
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching statistics:', error);
        throw error;
      }

      // Đếm số lượng theo loại
      const counts: { [key: number]: number } = {};
      data?.forEach(item => {
        counts[item.type] = (counts[item.type] || 0) + 1;
      });

      return Object.entries(counts).map(([type, soLuong]) => ({
        type: parseInt(type),
        so_luong: soLuong,
        ten_loai: this.getLoaiDonViLabel(parseInt(type))
      })).sort((a, b) => a.type - b.type);
    } catch (error) {
      console.error('Error in getThongKeTheoLoai:', error);
      throw error;
    }
  }

  // Thống kê theo dịch vụ
  async getThongKeTheoDichVu(): Promise<{ loai: string; so_luong: number }[]> {
    try {
      const { data, error } = await supabase
        .from('dm_don_vi')
        .select('is_bhxh_tn, is_bhyt')
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching service statistics:', error);
        throw error;
      }

      let bhxhCount = 0;
      let bhytCount = 0;
      let bothCount = 0;

      data?.forEach(item => {
        if (item.is_bhxh_tn === 1 && item.is_bhyt === 1) {
          bothCount++;
        } else if (item.is_bhxh_tn === 1) {
          bhxhCount++;
        } else if (item.is_bhyt === 1) {
          bhytCount++;
        }
      });

      return [
        { loai: 'BHXH Tự nguyện', so_luong: bhxhCount },
        { loai: 'BHYT', so_luong: bhytCount },
        { loai: 'BHXH + BHYT', so_luong: bothCount }
      ];
    } catch (error) {
      console.error('Error in getThongKeTheoDichVu:', error);
      throw error;
    }
  }

  // CRUD Operations

  // Tạo mới đơn vị
  async createDonVi(donViData: Omit<DmDonVi, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>): Promise<DmDonVi> {
    try {
      console.log('Service received data:', donViData);
      const { data, error } = await supabase
        .from('dm_don_vi')
        .insert([donViData])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating don vi:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createDonVi:', error);
      throw error;
    }
  }

  // Cập nhật đơn vị
  async updateDonVi(id: number, donViData: Partial<Omit<DmDonVi, 'id' | 'ngay_tao'>>): Promise<DmDonVi> {
    try {
      const updateData = {
        ...donViData,
        ngay_cap_nhat: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('dm_don_vi')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating don vi:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateDonVi:', error);
      throw error;
    }
  }

  // Xóa đơn vị (soft delete)
  async deleteDonVi(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_don_vi')
        .update({
          trang_thai: 'inactive',
          ngay_cap_nhat: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting don vi:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteDonVi:', error);
      throw error;
    }
  }

  // Cập nhật đại lý cho đơn vị
  async updateDaiLyForDonVi(donViId: number, daiLyId: number | null): Promise<DmDonVi> {
    try {
      const { data, error } = await supabase
        .from('dm_don_vi')
        .update({ dai_ly_id: daiLyId })
        .eq('id', donViId)
        .select()
        .single();

      if (error) {
        console.error('Error updating dai ly for don vi:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateDaiLyForDonVi:', error);
      throw error;
    }
  }

  // Kiểm tra mã đơn vị có tồn tại không
  async checkMaDonViExists(maDonVi: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from('dm_don_vi')
        .select('id')
        .eq('ma_don_vi', maDonVi)
        .eq('trang_thai', 'active');

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking ma don vi:', error);
        throw error;
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkMaDonViExists:', error);
      throw error;
    }
  }
}

export const donViService = new DonViService();
