import { supabase, DmDaiLy, VDaiLyChiTiet } from '../../../shared/services/api/supabaseClient';

export interface DaiLySearchParams {
  searchTerm?: string;
  maTinh?: string;
  cap?: number;
  type?: number;
  trangThai?: string;
  isDaiLy?: boolean;
}

class DaiLyService {
  // Lấy tất cả đại lý
  async getAllDaiLy(): Promise<VDaiLyChiTiet[]> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_chitiet')
        .select('*')
        .eq('trang_thai', 'active')
        .order('ten', { ascending: true });

      if (error) {
        console.error('Error fetching dai ly:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllDaiLy:', error);
      throw error;
    }
  }

  // Tìm kiếm đại lý
  async searchDaiLy(params: DaiLySearchParams): Promise<VDaiLyChiTiet[]> {
    try {
      let query = supabase
        .from('v_dai_ly_chitiet')
        .select('*')
        .eq('trang_thai', 'active');

      // Tìm kiếm theo từ khóa
      if (params.searchTerm && params.searchTerm.trim()) {
        const searchTerm = params.searchTerm.trim();
        query = query.or(`ten.ilike.%${searchTerm}%,ma.ilike.%${searchTerm}%`);
      }

      // Lọc theo mã tỉnh
      if (params.maTinh) {
        query = query.eq('ma_tinh', params.maTinh);
      }

      // Lọc theo cấp
      if (params.cap) {
        query = query.eq('cap', params.cap);
      }

      // Lọc theo loại
      if (params.type) {
        query = query.eq('type', params.type);
      }

      // Lọc theo trạng thái đại lý
      if (params.isDaiLy !== undefined) {
        query = query.eq('is_dai_ly', params.isDaiLy);
      }

      // Lọc theo trạng thái
      if (params.trangThai) {
        query = query.eq('trang_thai', params.trangThai);
      }

      query = query.order('ten', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error searching dai ly:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchDaiLy:', error);
      throw error;
    }
  }

  // Lấy đại lý theo ID
  async getDaiLyById(id: number): Promise<VDaiLyChiTiet | null> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_chitiet')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching dai ly by id:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getDaiLyById:', error);
      throw error;
    }
  }

  // Lấy danh sách đại lý con
  async getChildDaiLy(parentId: number): Promise<VDaiLyChiTiet[]> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_chitiet')
        .select('*')
        .eq('cha_id', parentId)
        .eq('trang_thai', 'active')
        .order('ten', { ascending: true });

      if (error) {
        console.error('Error fetching child dai ly:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getChildDaiLy:', error);
      throw error;
    }
  }

  // Lấy danh sách đơn vị theo đại lý
  async getDonViByDaiLy(daiLyId: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('v_don_vi_chitiet')
        .select('*')
        .eq('dai_ly_id', daiLyId)
        .eq('trang_thai', 'active')
        .order('ten_don_vi', { ascending: true });

      if (error) {
        console.error('Error fetching don vi by dai ly:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDonViByDaiLy:', error);
      throw error;
    }
  }

  // Lấy danh sách mã tỉnh
  async getMaTinhList(): Promise<{ value: string; label: string }[]> {
    try {
      const { data, error } = await supabase
        .from('dm_dai_ly')
        .select('ma_tinh')
        .eq('trang_thai', 'active')
        .not('ma_tinh', 'is', null);

      if (error) {
        console.error('Error fetching ma tinh list:', error);
        throw error;
      }

      // Tạo danh sách mã tỉnh duy nhất
      const uniqueMaTinh = [...new Set(data?.map(item => item.ma_tinh).filter(Boolean) || [])];

      return uniqueMaTinh.map(ma => ({
        value: ma,
        label: `Tỉnh ${ma}`
      })).sort((a, b) => a.value.localeCompare(b.value));
    } catch (error) {
      console.error('Error in getMaTinhList:', error);
      throw error;
    }
  }

  // Thống kê theo cấp
  async getThongKeTheoCap(): Promise<{ cap: number; so_luong: number; ten_cap: string }[]> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_chitiet')
        .select('cap, ten_cap')
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching thong ke theo cap:', error);
        throw error;
      }

      // Đếm số lượng theo từng cấp
      const capCount = data?.reduce((acc: any, item) => {
        const cap = item.cap || 0;
        const tenCap = item.ten_cap || 'Khác';
        if (!acc[cap]) {
          acc[cap] = { cap, so_luong: 0, ten_cap: tenCap };
        }
        acc[cap].so_luong++;
        return acc;
      }, {});

      return Object.values(capCount || {}) as { cap: number; so_luong: number; ten_cap: string }[];
    } catch (error) {
      console.error('Error in getThongKeTheoCap:', error);
      throw error;
    }
  }

  // Thống kê theo loại
  async getThongKeTheoLoai(): Promise<{ type: number; so_luong: number; loai_dai_ly: string }[]> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_chitiet')
        .select('type, loai_dai_ly')
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching thong ke theo loai:', error);
        throw error;
      }

      // Đếm số lượng theo từng loại
      const typeCount = data?.reduce((acc: any, item) => {
        const type = item.type || 0;
        const loaiDaiLy = item.loai_dai_ly || 'Khác';
        if (!acc[type]) {
          acc[type] = { type, so_luong: 0, loai_dai_ly: loaiDaiLy };
        }
        acc[type].so_luong++;
        return acc;
      }, {});

      return Object.values(typeCount || {}) as { type: number; so_luong: number; loai_dai_ly: string }[];
    } catch (error) {
      console.error('Error in getThongKeTheoLoai:', error);
      throw error;
    }
  }

  // CRUD Operations

  // Tạo mới đại lý
  async createDaiLy(daiLyData: Omit<DmDaiLy, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>): Promise<DmDaiLy> {
    try {
      const { data, error } = await supabase
        .from('dm_dai_ly')
        .insert([daiLyData])
        .select()
        .single();

      if (error) {
        console.error('Error creating dai ly:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createDaiLy:', error);
      throw error;
    }
  }

  // Cập nhật đại lý
  async updateDaiLy(id: number, daiLyData: Partial<Omit<DmDaiLy, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>>): Promise<DmDaiLy> {
    try {
      const { data, error } = await supabase
        .from('dm_dai_ly')
        .update(daiLyData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating dai ly:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateDaiLy:', error);
      throw error;
    }
  }

  // Xóa đại lý (soft delete)
  async deleteDaiLy(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_dai_ly')
        .update({ trang_thai: 'inactive' })
        .eq('id', id);

      if (error) {
        console.error('Error deleting dai ly:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteDaiLy:', error);
      throw error;
    }
  }

  // Kiểm tra mã đại lý có tồn tại không (kiểm tra tất cả bản ghi, không chỉ active)
  async checkMaDaiLyExists(ma: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from('dm_dai_ly')
        .select('id, trang_thai')
        .eq('ma', ma);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking ma dai ly:', error);
        throw error;
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkMaDaiLyExists:', error);
      throw error;
    }
  }

  // Sinh mã đại lý tự động
  async generateMaDaiLy(maTinh?: string, cap?: number): Promise<string> {
    try {
      // Lấy mã tỉnh (mặc định là 884 nếu không có)
      const provinceCode = maTinh || '884';

      // Tạo prefix dựa trên pattern hiện tại: 8840884000xxx
      // Cấp 1 (tỉnh): 8840884000001, 8840884000002, ...
      // Cấp 2 (huyện): 8840884000100, 8840884000200, ...
      // Cấp 3 (xã): 8840884000150, 8840884000160, ...

      const basePrefix = `${provinceCode}0${provinceCode}000`;

      let startRange = 1;
      let endRange = 99;

      switch (cap) {
        case 1: // Cấp tỉnh: 001-099
          startRange = 1;
          endRange = 99;
          break;
        case 2: // Cấp huyện: 100-199
          startRange = 100;
          endRange = 199;
          break;
        case 3: // Cấp xã: 200-999
          startRange = 200;
          endRange = 999;
          break;
        default: // Mặc định cấp huyện
          startRange = 100;
          endRange = 199;
          break;
      }

      // Tìm số sequence tiếp theo trong range
      const { data: existingCodes, error } = await supabase
        .from('dm_dai_ly')
        .select('ma')
        .like('ma', `${basePrefix}%`)
        .order('ma', { ascending: false });

      if (error) {
        console.error('Error fetching existing codes:', error);
        throw error;
      }

      // Tìm số tiếp theo trong range
      const usedNumbers = new Set();
      if (existingCodes) {
        existingCodes.forEach(item => {
          const numberPart = item.ma.replace(basePrefix, '');
          const num = parseInt(numberPart);
          if (!isNaN(num) && num >= startRange && num <= endRange) {
            usedNumbers.add(num);
          }
        });
      }

      // Tìm số đầu tiên chưa được sử dụng
      let nextNumber = startRange;
      while (nextNumber <= endRange && usedNumbers.has(nextNumber)) {
        nextNumber++;
      }

      if (nextNumber > endRange) {
        // Nếu hết số trong range, sử dụng timestamp
        const timestamp = Date.now().toString().slice(-6);
        return `DL${timestamp}`;
      }

      // Tạo mã mới với padding 3 chữ số
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      const newCode = `${basePrefix}${paddedNumber}`;

      // Kiểm tra xem mã có tồn tại không (để đảm bảo)
      const exists = await this.checkMaDaiLyExists(newCode);
      if (exists) {
        // Nếu tồn tại, thử với số tiếp theo
        nextNumber++;
        if (nextNumber <= endRange) {
          const retryPaddedNumber = nextNumber.toString().padStart(3, '0');
          return `${basePrefix}${retryPaddedNumber}`;
        } else {
          // Fallback
          const timestamp = Date.now().toString().slice(-6);
          return `DL${timestamp}`;
        }
      }

      return newCode;
    } catch (error) {
      console.error('Error in generateMaDaiLy:', error);
      // Fallback: tạo mã random
      const timestamp = Date.now().toString().slice(-6);
      return `DL${timestamp}`;
    }
  }
}

export const daiLyService = new DaiLyService();
