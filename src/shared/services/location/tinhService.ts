import { supabase, DmTinh } from '../api/supabaseClient';

export interface TinhOption {
  value: string;
  label: string;
  text: string;
}

class TinhService {
  // Lấy tất cả tỉnh thành
  async getAllTinh(): Promise<DmTinh[]> {
    try {
      const { data, error } = await supabase
        .from('dm_tinh')
        .select('*')
        .order('value', { ascending: true });

      if (error) {
        console.error('Error fetching tinh:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllTinh:', error);
      throw error;
    }
  }

  // Lấy danh sách tỉnh thành dạng options cho dropdown
  async getTinhOptions(): Promise<TinhOption[]> {
    try {
      const data = await this.getAllTinh();
      
      return data.map(tinh => ({
        value: tinh.value,
        label: tinh.ten,
        text: tinh.text
      }));
    } catch (error) {
      console.error('Error in getTinhOptions:', error);
      throw error;
    }
  }

  // Lấy thông tin tỉnh theo mã
  async getTinhByValue(value: string): Promise<DmTinh | null> {
    try {
      const { data, error } = await supabase
        .from('dm_tinh')
        .select('*')
        .eq('value', value)
        .single();

      if (error) {
        console.error('Error fetching tinh by value:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTinhByValue:', error);
      return null;
    }
  }

  // Tìm kiếm tỉnh theo tên
  async searchTinh(searchTerm: string): Promise<TinhOption[]> {
    try {
      const { data, error } = await supabase
        .from('dm_tinh')
        .select('*')
        .or(`ten.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`)
        .order('value', { ascending: true });

      if (error) {
        console.error('Error searching tinh:', error);
        throw error;
      }

      return (data || []).map(tinh => ({
        value: tinh.value,
        label: tinh.ten,
        text: tinh.text
      }));
    } catch (error) {
      console.error('Error in searchTinh:', error);
      throw error;
    }
  }

  // Lấy tên tỉnh theo mã
  async getTinhNameByValue(value: string): Promise<string> {
    try {
      const tinh = await this.getTinhByValue(value);
      return tinh?.ten || value;
    } catch (error) {
      console.error('Error in getTinhNameByValue:', error);
      return value;
    }
  }

  // Lấy text hiển thị đầy đủ theo mã
  async getTinhTextByValue(value: string): Promise<string> {
    try {
      const tinh = await this.getTinhByValue(value);
      return tinh?.text || value;
    } catch (error) {
      console.error('Error in getTinhTextByValue:', error);
      return value;
    }
  }
}

export const tinhService = new TinhService();
