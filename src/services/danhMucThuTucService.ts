import { supabase, DanhMucThuTuc } from './supabaseClient';

export interface ThuTucSearchParams {
  searchTerm?: string;
  linhVuc?: number;
  trangThai?: string;
  showOnlyDeveloped?: boolean; // true = chỉ hiện 'active', false = hiện tất cả
}

class DanhMucThuTucService {
  // Lấy tất cả thủ tục
  async getAllThuTuc(): Promise<DanhMucThuTuc[]> {
    try {
      const { data, error } = await supabase
        .from('danh_muc_thu_tuc')
        .select('*')
        .in('trang_thai', ['active', 'inactive', 'draft']) // Lấy tất cả trạng thái
        .order('stt', { ascending: true });

      if (error) {
        console.error('Error fetching thu tuc:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllThuTuc:', error);
      throw error;
    }
  }

  // Tìm kiếm thủ tục
  async searchThuTuc(params: ThuTucSearchParams): Promise<DanhMucThuTuc[]> {
    try {
      let query = supabase
        .from('danh_muc_thu_tuc')
        .select('*');

      // Lọc theo trạng thái phát triển
      if (params.showOnlyDeveloped) {
        query = query.eq('trang_thai', 'active'); // Chỉ lấy thủ tục đã phát triển
      } else {
        query = query.in('trang_thai', ['active', 'inactive', 'draft']); // Lấy tất cả
      }

      // Tìm kiếm theo từ khóa
      if (params.searchTerm && params.searchTerm.trim()) {
        const searchTerm = params.searchTerm.trim();
        query = query.or(`ten.ilike.%${searchTerm}%,ma.ilike.%${searchTerm}%,ky_hieu.ilike.%${searchTerm}%`);
      }

      // Lọc theo lĩnh vực
      if (params.linhVuc) {
        query = query.eq('linh_vuc', params.linhVuc);
      }

      // Lọc theo trạng thái cụ thể (nếu có)
      if (params.trangThai) {
        query = query.eq('trang_thai', params.trangThai);
      }

      const { data, error } = await query.order('stt', { ascending: true });

      if (error) {
        console.error('Error searching thu tuc:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchThuTuc:', error);
      throw error;
    }
  }

  // Lấy thủ tục theo ID
  async getThuTucById(id: number): Promise<DanhMucThuTuc | null> {
    try {
      const { data, error } = await supabase
        .from('danh_muc_thu_tuc')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching thu tuc by id:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getThuTucById:', error);
      throw error;
    }
  }

  // Lấy thủ tục theo mã
  async getThuTucByMa(ma: string): Promise<DanhMucThuTuc | null> {
    try {
      const { data, error } = await supabase
        .from('danh_muc_thu_tuc')
        .select('*')
        .eq('ma', ma)
        .eq('trang_thai', 'active')
        .single();

      if (error) {
        console.error('Error fetching thu tuc by ma:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getThuTucByMa:', error);
      throw error;
    }
  }

  // Lấy thủ tục theo ký hiệu
  async getThuTucByKyHieu(kyHieu: string): Promise<DanhMucThuTuc | null> {
    try {
      const { data, error } = await supabase
        .from('danh_muc_thu_tuc')
        .select('*')
        .eq('ky_hieu', kyHieu)
        .eq('trang_thai', 'active')
        .single();

      if (error) {
        console.error('Error fetching thu tuc by ky hieu:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getThuTucByKyHieu:', error);
      throw error;
    }
  }

  // Lấy danh sách lĩnh vực
  async getLinhVucList(): Promise<{ value: number; label: string }[]> {
    try {
      const { data, error } = await supabase
        .from('danh_muc_thu_tuc')
        .select('linh_vuc')
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching linh vuc list:', error);
        throw error;
      }

      // Tạo danh sách lĩnh vực duy nhất
      const uniqueLinhVuc = [...new Set(data?.map(item => item.linh_vuc) || [])];
      
      return uniqueLinhVuc.map(lv => ({
        value: lv,
        label: this.getLinhVucLabel(lv)
      })).sort((a, b) => a.value - b.value);
    } catch (error) {
      console.error('Error in getLinhVucList:', error);
      throw error;
    }
  }

  // Chuyển đổi mã lĩnh vực thành tên
  getLinhVucLabel(linhVuc: number): string {
    const linhVucMap: { [key: number]: string } = {
      1: 'Đăng ký',
      2: 'Cấp lại/Đổi thẻ',
      3: 'Giải quyết chế độ',
      4: 'Hưu trí',
      5: 'Khác'
    };
    return linhVucMap[linhVuc] || `Lĩnh vực ${linhVuc}`;
  }

  // Thống kê số lượng thủ tục theo lĩnh vực
  async getThongKeTheoLinhVuc(): Promise<{ linh_vuc: number; so_luong: number; ten_linh_vuc: string }[]> {
    try {
      const { data, error } = await supabase
        .from('danh_muc_thu_tuc')
        .select('linh_vuc')
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching statistics:', error);
        throw error;
      }

      // Đếm số lượng theo lĩnh vực
      const counts: { [key: number]: number } = {};
      data?.forEach(item => {
        counts[item.linh_vuc] = (counts[item.linh_vuc] || 0) + 1;
      });

      return Object.entries(counts).map(([linhVuc, soLuong]) => ({
        linh_vuc: parseInt(linhVuc),
        so_luong: soLuong,
        ten_linh_vuc: this.getLinhVucLabel(parseInt(linhVuc))
      })).sort((a, b) => a.linh_vuc - b.linh_vuc);
    } catch (error) {
      console.error('Error in getThongKeTheoLinhVuc:', error);
      throw error;
    }
  }
}

export const danhMucThuTucService = new DanhMucThuTucService();
