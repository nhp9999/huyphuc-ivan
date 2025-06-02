import { supabase, DmXa } from '../api/supabaseClient';

export interface XaOption {
  value: string;
  label: string;
  text: string;
  ma_huyen: string;
  ma_tinh: string;
}

class XaService {
  // Lấy tất cả xã/phường
  async getAllXa(): Promise<DmXa[]> {
    try {
      const { data, error } = await supabase
        .from('dm_xa')
        .select('*')
        .order('value', { ascending: true });

      if (error) {
        console.error('Error fetching xa:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllXa:', error);
      throw error;
    }
  }

  // Lấy xã/phường theo mã huyện
  async getXaByHuyen(maHuyen: string, maTinh: string): Promise<DmXa[]> {
    try {
      const { data, error } = await supabase
        .from('dm_xa')
        .select('*')
        .eq('ma_huyen', maHuyen)
        .eq('ma_tinh', maTinh)
        .order('value', { ascending: true });

      if (error) {
        console.error('Error fetching xa by huyen:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getXaByHuyen:', error);
      throw error;
    }
  }

  // Lấy xã/phường theo mã tỉnh
  async getXaByTinh(maTinh: string): Promise<DmXa[]> {
    try {
      const { data, error } = await supabase
        .from('dm_xa')
        .select('*')
        .eq('ma_tinh', maTinh)
        .order('value', { ascending: true });

      if (error) {
        console.error('Error fetching xa by tinh:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getXaByTinh:', error);
      throw error;
    }
  }

  // Lấy danh sách xã/phường dạng options cho dropdown theo huyện
  async getXaOptionsByHuyen(maHuyen: string, maTinh: string): Promise<XaOption[]> {
    try {
      const data = await this.getXaByHuyen(maHuyen, maTinh);
      
      return data.map(xa => ({
        value: xa.value,
        label: xa.ten,
        text: xa.text,
        ma_huyen: xa.ma_huyen,
        ma_tinh: xa.ma_tinh
      }));
    } catch (error) {
      console.error('Error in getXaOptionsByHuyen:', error);
      throw error;
    }
  }

  // Lấy thông tin xã/phường theo mã
  async getXaByValue(value: string, maHuyen?: string, maTinh?: string): Promise<DmXa | null> {
    try {
      let query = supabase
        .from('dm_xa')
        .select('*')
        .eq('value', value);

      if (maHuyen) {
        query = query.eq('ma_huyen', maHuyen);
      }

      if (maTinh) {
        query = query.eq('ma_tinh', maTinh);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching xa by value:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getXaByValue:', error);
      return null;
    }
  }

  // Tìm kiếm xã/phường theo tên trong huyện
  async searchXaInHuyen(searchTerm: string, maHuyen: string, maTinh: string): Promise<XaOption[]> {
    try {
      const { data, error } = await supabase
        .from('dm_xa')
        .select('*')
        .eq('ma_huyen', maHuyen)
        .eq('ma_tinh', maTinh)
        .or(`ten.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`)
        .order('value', { ascending: true });

      if (error) {
        console.error('Error searching xa:', error);
        throw error;
      }

      return (data || []).map(xa => ({
        value: xa.value,
        label: xa.ten,
        text: xa.text,
        ma_huyen: xa.ma_huyen,
        ma_tinh: xa.ma_tinh
      }));
    } catch (error) {
      console.error('Error in searchXaInHuyen:', error);
      throw error;
    }
  }

  // Lấy tên xã/phường theo mã
  async getXaNameByValue(value: string, maHuyen?: string, maTinh?: string): Promise<string> {
    try {
      const xa = await this.getXaByValue(value, maHuyen, maTinh);
      return xa?.ten || value;
    } catch (error) {
      console.error('Error in getXaNameByValue:', error);
      return value;
    }
  }

  // Lấy text hiển thị đầy đủ theo mã
  async getXaTextByValue(value: string, maHuyen?: string, maTinh?: string): Promise<string> {
    try {
      const xa = await this.getXaByValue(value, maHuyen, maTinh);
      return xa?.text || value;
    } catch (error) {
      console.error('Error in getXaTextByValue:', error);
      return value;
    }
  }

  // Kiểm tra xem huyện có xã/phường nào không
  async hasHuyenGotXa(maHuyen: string, maTinh: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('dm_xa')
        .select('*', { count: 'exact', head: true })
        .eq('ma_huyen', maHuyen)
        .eq('ma_tinh', maTinh);

      if (error) {
        console.error('Error checking xa existence:', error);
        return false;
      }

      return (count || 0) > 0;
    } catch (error) {
      console.error('Error in hasHuyenGotXa:', error);
      return false;
    }
  }

  // Lấy số lượng xã/phường theo huyện
  async getXaCountByHuyen(maHuyen: string, maTinh: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('dm_xa')
        .select('*', { count: 'exact', head: true })
        .eq('ma_huyen', maHuyen)
        .eq('ma_tinh', maTinh);

      if (error) {
        console.error('Error counting xa:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getXaCountByHuyen:', error);
      return 0;
    }
  }

  // Lấy số lượng xã/phường theo tỉnh
  async getXaCountByTinh(maTinh: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('dm_xa')
        .select('*', { count: 'exact', head: true })
        .eq('ma_tinh', maTinh);

      if (error) {
        console.error('Error counting xa by tinh:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getXaCountByTinh:', error);
      return 0;
    }
  }

  // Lấy thống kê xã/phường theo tỉnh và huyện
  async getXaStatsByTinh(maTinh: string): Promise<{ma_huyen: string, count: number}[]> {
    try {
      const { data, error } = await supabase
        .from('dm_xa')
        .select('ma_huyen')
        .eq('ma_tinh', maTinh);

      if (error) {
        console.error('Error getting xa stats:', error);
        throw error;
      }

      // Group by ma_huyen and count
      const stats = (data || []).reduce((acc: {[key: string]: number}, item) => {
        acc[item.ma_huyen] = (acc[item.ma_huyen] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(stats).map(([ma_huyen, count]) => ({
        ma_huyen,
        count: count as number
      }));
    } catch (error) {
      console.error('Error in getXaStatsByTinh:', error);
      throw error;
    }
  }
}

export const xaService = new XaService();
