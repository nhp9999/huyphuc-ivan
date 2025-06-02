import { supabase, DmLuongCoSo } from './api/supabaseClient';

export interface LuongCoSoSearchParams {
  searchTerm?: string;
  thang?: string;
  trangThai?: string;
}

class LuongCoSoService {
  // Lấy tất cả mức lương cơ sở
  async getAllLuongCoSo(): Promise<DmLuongCoSo[]> {
    try {
      const { data, error } = await supabase
        .from('dm_luong_co_so')
        .select('*')
        .order('thang', { ascending: false });

      if (error) {
        console.error('Error fetching luong co so:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllLuongCoSo:', error);
      throw error;
    }
  }

  // Lấy mức lương cơ sở hiện tại (mới nhất)
  async getCurrentLuongCoSo(): Promise<DmLuongCoSo | null> {
    try {
      const { data, error } = await supabase
        .from('dm_luong_co_so')
        .select('*')
        .order('thang', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching current luong co so:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentLuongCoSo:', error);
      throw error;
    }
  }

  // Lấy mức lương cơ sở theo tháng
  async getLuongCoSoByThang(thang: string): Promise<DmLuongCoSo | null> {
    try {
      const { data, error } = await supabase
        .from('dm_luong_co_so')
        .select('*')
        .eq('thang', thang)
        .single();

      if (error) {
        console.error('Error fetching luong co so by thang:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getLuongCoSoByThang:', error);
      throw error;
    }
  }

  // Tìm kiếm mức lương cơ sở
  async searchLuongCoSo(params: LuongCoSoSearchParams): Promise<DmLuongCoSo[]> {
    try {
      let query = supabase
        .from('dm_luong_co_so')
        .select('*');

      // Tìm kiếm theo từ khóa
      if (params.searchTerm && params.searchTerm.trim()) {
        const searchTerm = params.searchTerm.trim();
        query = query.or(`thanghienthi.ilike.%${searchTerm}%,ghichu.ilike.%${searchTerm}%`);
      }

      // Lọc theo tháng
      if (params.thang) {
        query = query.eq('thang', params.thang);
      }

      query = query.order('thang', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error searching luong co so:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchLuongCoSo:', error);
      throw error;
    }
  }

  // Lấy mức lương cơ sở theo ID
  async getLuongCoSoById(id: number): Promise<DmLuongCoSo | null> {
    try {
      const { data, error } = await supabase
        .from('dm_luong_co_so')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching luong co so by id:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getLuongCoSoById:', error);
      throw error;
    }
  }

  // Tạo mới mức lương cơ sở
  async createLuongCoSo(luongCoSoData: Omit<DmLuongCoSo, 'id' | 'created_at' | 'updated_at'>): Promise<DmLuongCoSo> {
    try {
      const { data, error } = await supabase
        .from('dm_luong_co_so')
        .insert([luongCoSoData])
        .select()
        .single();

      if (error) {
        console.error('Error creating luong co so:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createLuongCoSo:', error);
      throw error;
    }
  }

  // Cập nhật mức lương cơ sở
  async updateLuongCoSo(id: number, luongCoSoData: Partial<Omit<DmLuongCoSo, 'id' | 'created_at' | 'updated_at'>>): Promise<DmLuongCoSo> {
    try {
      const { data, error } = await supabase
        .from('dm_luong_co_so')
        .update({
          ...luongCoSoData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating luong co so:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateLuongCoSo:', error);
      throw error;
    }
  }

  // Xóa mức lương cơ sở
  async deleteLuongCoSo(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_luong_co_so')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting luong co so:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteLuongCoSo:', error);
      throw error;
    }
  }

  // Kiểm tra tháng có tồn tại không
  async checkThangExists(thang: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from('dm_luong_co_so')
        .select('id')
        .eq('thang', thang);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking thang exists:', error);
        throw error;
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkThangExists:', error);
      throw error;
    }
  }

  // Format số tiền
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  // Format số tiền không có ký hiệu
  formatNumber(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
}

export const luongCoSoService = new LuongCoSoService();
