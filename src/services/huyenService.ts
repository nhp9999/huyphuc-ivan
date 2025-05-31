import { supabase, DmHuyen } from './supabaseClient';

export interface HuyenOption {
  value: string;
  label: string;
  text: string;
  ma_tinh: string;
}

class HuyenService {
  // Lấy tất cả huyện
  async getAllHuyen(): Promise<DmHuyen[]> {
    try {
      const { data, error } = await supabase
        .from('dm_huyen')
        .select('*')
        .order('value', { ascending: true });

      if (error) {
        console.error('Error fetching huyen:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllHuyen:', error);
      throw error;
    }
  }

  // Lấy huyện theo mã tỉnh
  async getHuyenByTinh(maTinh: string): Promise<DmHuyen[]> {
    try {
      const { data, error } = await supabase
        .from('dm_huyen')
        .select('*')
        .eq('ma_tinh', maTinh)
        .order('value', { ascending: true });

      if (error) {
        console.error('Error fetching huyen by tinh:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getHuyenByTinh:', error);
      throw error;
    }
  }

  // Lấy danh sách huyện dạng options cho dropdown theo tỉnh
  async getHuyenOptionsByTinh(maTinh: string): Promise<HuyenOption[]> {
    try {
      const data = await this.getHuyenByTinh(maTinh);
      
      return data.map(huyen => ({
        value: huyen.value,
        label: huyen.ten,
        text: huyen.text,
        ma_tinh: huyen.ma_tinh
      }));
    } catch (error) {
      console.error('Error in getHuyenOptionsByTinh:', error);
      throw error;
    }
  }

  // Lấy thông tin huyện theo mã
  async getHuyenByValue(value: string, maTinh?: string): Promise<DmHuyen | null> {
    try {
      let query = supabase
        .from('dm_huyen')
        .select('*')
        .eq('value', value);

      if (maTinh) {
        query = query.eq('ma_tinh', maTinh);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching huyen by value:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getHuyenByValue:', error);
      return null;
    }
  }

  // Tìm kiếm huyện theo tên trong tỉnh
  async searchHuyenInTinh(searchTerm: string, maTinh: string): Promise<HuyenOption[]> {
    try {
      const { data, error } = await supabase
        .from('dm_huyen')
        .select('*')
        .eq('ma_tinh', maTinh)
        .or(`ten.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`)
        .order('value', { ascending: true });

      if (error) {
        console.error('Error searching huyen:', error);
        throw error;
      }

      return (data || []).map(huyen => ({
        value: huyen.value,
        label: huyen.ten,
        text: huyen.text,
        ma_tinh: huyen.ma_tinh
      }));
    } catch (error) {
      console.error('Error in searchHuyenInTinh:', error);
      throw error;
    }
  }

  // Lấy tên huyện theo mã
  async getHuyenNameByValue(value: string, maTinh?: string): Promise<string> {
    try {
      const huyen = await this.getHuyenByValue(value, maTinh);
      return huyen?.ten || value;
    } catch (error) {
      console.error('Error in getHuyenNameByValue:', error);
      return value;
    }
  }

  // Lấy text hiển thị đầy đủ theo mã
  async getHuyenTextByValue(value: string, maTinh?: string): Promise<string> {
    try {
      const huyen = await this.getHuyenByValue(value, maTinh);
      return huyen?.text || value;
    } catch (error) {
      console.error('Error in getHuyenTextByValue:', error);
      return value;
    }
  }

  // Kiểm tra xem tỉnh có huyện nào không
  async hasTinhGotHuyen(maTinh: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('dm_huyen')
        .select('*', { count: 'exact', head: true })
        .eq('ma_tinh', maTinh);

      if (error) {
        console.error('Error checking huyen existence:', error);
        return false;
      }

      return (count || 0) > 0;
    } catch (error) {
      console.error('Error in hasTinhGotHuyen:', error);
      return false;
    }
  }

  // Lấy số lượng huyện theo tỉnh
  async getHuyenCountByTinh(maTinh: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('dm_huyen')
        .select('*', { count: 'exact', head: true })
        .eq('ma_tinh', maTinh);

      if (error) {
        console.error('Error counting huyen:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getHuyenCountByTinh:', error);
      return 0;
    }
  }
}

export const huyenService = new HuyenService();
