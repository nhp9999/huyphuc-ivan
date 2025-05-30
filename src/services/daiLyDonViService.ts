import { supabase, DaiLyDonVi, VDonViDaiLy, VDaiLyDonVi } from './supabaseClient';

class DaiLyDonViService {
  // Lấy tất cả đơn vị (bao gồm cả chưa liên kết và đã liên kết)
  async getAllDonViWithDaiLy(): Promise<VDonViDaiLy[]> {
    try {
      const { data, error } = await supabase
        .from('v_don_vi_dai_ly')
        .select('*')
        .eq('don_vi_trang_thai', 'active')
        .order('ten_don_vi', { ascending: true });

      if (error) {
        console.error('Error fetching don vi with dai ly:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllDonViWithDaiLy:', error);
      throw error;
    }
  }

  // Lấy tất cả đại lý với đơn vị
  async getAllDaiLyWithDonVi(): Promise<VDaiLyDonVi[]> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_don_vi')
        .select('*')
        .eq('dai_ly_trang_thai', 'active')
        .order('ten_dai_ly', { ascending: true });

      if (error) {
        console.error('Error fetching dai ly with don vi:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllDaiLyWithDonVi:', error);
      throw error;
    }
  }

  // Lấy tất cả đơn vị có thể liên kết (cho mô hình many-to-many)
  // Trong mô hình many-to-many, tất cả đơn vị đều có thể liên kết với đại lý mới
  async getUnlinkedDonVi(): Promise<VDonViDaiLy[]> {
    try {
      // Lấy tất cả đơn vị active - trong mô hình many-to-many, tất cả đơn vị đều có thể liên kết
      const { data: allDonVi, error: allError } = await supabase
        .from('dm_don_vi')
        .select(`
          id,
          ma_co_quan_bhxh,
          ma_so_bhxh,
          ten_don_vi,
          is_bhxh_tn,
          is_bhyt,
          type,
          trang_thai,
          ngay_tao,
          ngay_cap_nhat,
          dm_khoi_kcb_id
        `)
        .eq('trang_thai', 'active')
        .order('ten_don_vi', { ascending: true });

      if (allError) {
        console.error('Error fetching all don vi:', allError);
        throw allError;
      }

      // Trong mô hình many-to-many, tất cả đơn vị đều có thể liên kết với đại lý mới
      // Không cần loại bỏ đơn vị đã liên kết với đại lý khác

      // Transform to VDonViDaiLy format
      const result: VDonViDaiLy[] = allDonVi?.map(donVi => ({
        don_vi_id: donVi.id,
        ma_co_quan_bhxh: donVi.ma_co_quan_bhxh,
        ma_so_bhxh: donVi.ma_so_bhxh,
        ten_don_vi: donVi.ten_don_vi,
        is_bhxh_tn: donVi.is_bhxh_tn,
        is_bhyt: donVi.is_bhyt,
        type: donVi.type,
        don_vi_trang_thai: donVi.trang_thai,
        don_vi_ngay_tao: donVi.ngay_tao,
        don_vi_ngay_cap_nhat: donVi.ngay_cap_nhat,
        dm_khoi_kcb_id: donVi.dm_khoi_kcb_id,
        ma_khoi_kcb: null,
        ten_khoi_kcb: null,
        mo_ta_khoi: null,
        loai_dich_vu: donVi.is_bhxh_tn && donVi.is_bhyt ? 'BHXH & BHYT' :
                      donVi.is_bhxh_tn ? 'BHXH' : 'BHYT',
        loai_don_vi: donVi.type === 1 ? 'Đơn vị thu cấp tỉnh' : 'Đơn vị thu cấp huyện',
        dai_ly_id: null,
        ma_dai_ly: null,
        ten_dai_ly: null,
        loai_dai_ly: null,
        cap_dai_ly: null,
        ma_tinh_dai_ly: null,
        ngay_lien_ket: null,
        ghi_chu_lien_ket: null
      })) || [];

      return result;
    } catch (error) {
      console.error('Error in getUnlinkedDonVi:', error);
      throw error;
    }
  }

  // Lấy đơn vị theo đại lý
  async getDonViByDaiLy(daiLyId: number): Promise<VDaiLyDonVi[]> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_don_vi')
        .select('*')
        .eq('dai_ly_id', daiLyId)
        .not('don_vi_id', 'is', null)
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

  // Lấy đại lý theo đơn vị
  async getDaiLyByDonVi(donViId: number): Promise<VDonViDaiLy[]> {
    try {
      const { data, error } = await supabase
        .from('v_don_vi_dai_ly')
        .select('*')
        .eq('don_vi_id', donViId)
        .not('dai_ly_id', 'is', null)
        .order('ten_dai_ly', { ascending: true });

      if (error) {
        console.error('Error fetching dai ly by don vi:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDaiLyByDonVi:', error);
      throw error;
    }
  }

  // Liên kết đại lý với đơn vị
  async linkDaiLyDonVi(daiLyId: number, donViId: number, ghiChu?: string): Promise<DaiLyDonVi> {
    try {
      const { data, error } = await supabase
        .from('dai_ly_don_vi')
        .insert([{
          dai_ly_id: daiLyId,
          don_vi_id: donViId,
          ghi_chu: ghiChu,
          trang_thai: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error linking dai ly don vi:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in linkDaiLyDonVi:', error);
      throw error;
    }
  }

  // Hủy liên kết đại lý với đơn vị
  async unlinkDaiLyDonVi(daiLyId: number, donViId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('dai_ly_don_vi')
        .update({ trang_thai: 'inactive' })
        .eq('dai_ly_id', daiLyId)
        .eq('don_vi_id', donViId);

      if (error) {
        console.error('Error unlinking dai ly don vi:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in unlinkDaiLyDonVi:', error);
      throw error;
    }
  }

  // Xóa hoàn toàn liên kết (hard delete)
  async deleteLinkDaiLyDonVi(daiLyId: number, donViId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('dai_ly_don_vi')
        .delete()
        .eq('dai_ly_id', daiLyId)
        .eq('don_vi_id', donViId);

      if (error) {
        console.error('Error deleting dai ly don vi link:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteLinkDaiLyDonVi:', error);
      throw error;
    }
  }

  // Liên kết nhiều đơn vị với một đại lý
  async linkMultipleDonViToDaiLy(daiLyId: number, donViIds: number[], ghiChu?: string): Promise<DaiLyDonVi[]> {
    try {
      const insertData = donViIds.map(donViId => ({
        dai_ly_id: daiLyId,
        don_vi_id: donViId,
        ghi_chu: ghiChu,
        trang_thai: 'active'
      }));

      const { data, error } = await supabase
        .from('dai_ly_don_vi')
        .insert(insertData)
        .select();

      if (error) {
        console.error('Error linking multiple don vi to dai ly:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in linkMultipleDonViToDaiLy:', error);
      throw error;
    }
  }

  // Kiểm tra xem đại lý và đơn vị đã liên kết chưa
  async checkLinkExists(daiLyId: number, donViId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('dai_ly_don_vi')
        .select('id')
        .eq('dai_ly_id', daiLyId)
        .eq('don_vi_id', donViId)
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error checking link exists:', error);
        throw error;
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkLinkExists:', error);
      throw error;
    }
  }

  // Lấy thống kê liên kết
  async getLinkStatistics(): Promise<{
    totalLinks: number;
    totalDaiLyWithDonVi: number;
    totalDonViWithDaiLy: number;
    totalUnlinkedDonVi: number;
  }> {
    try {
      const [linksData, daiLyData, donViData, unlinkedData] = await Promise.all([
        supabase.from('dai_ly_don_vi').select('id').eq('trang_thai', 'active'),
        supabase.from('v_dai_ly_don_vi').select('dai_ly_id').not('don_vi_id', 'is', null),
        supabase.from('v_don_vi_dai_ly').select('don_vi_id').not('dai_ly_id', 'is', null),
        supabase.from('v_don_vi_dai_ly').select('don_vi_id').is('dai_ly_id', null)
      ]);

      const totalLinks = linksData.data?.length || 0;
      const totalDaiLyWithDonVi = new Set(daiLyData.data?.map(item => item.dai_ly_id)).size;
      const totalDonViWithDaiLy = new Set(donViData.data?.map(item => item.don_vi_id)).size;
      const totalUnlinkedDonVi = unlinkedData.data?.length || 0;

      return {
        totalLinks,
        totalDaiLyWithDonVi,
        totalDonViWithDaiLy,
        totalUnlinkedDonVi
      };
    } catch (error) {
      console.error('Error in getLinkStatistics:', error);
      throw error;
    }
  }

  // Lấy đơn vị có thể liên kết với đại lý (chưa liên kết với đại lý này)
  async getAvailableDonViForDaiLy(daiLyId: number): Promise<VDonViDaiLy[]> {
    try {
      // Lấy tất cả đơn vị active
      const { data: allDonVi, error: allError } = await supabase
        .from('dm_don_vi')
        .select(`
          id,
          ma_co_quan_bhxh,
          ma_so_bhxh,
          ten_don_vi,
          is_bhxh_tn,
          is_bhyt,
          type,
          trang_thai,
          ngay_tao,
          ngay_cap_nhat,
          dm_khoi_kcb_id
        `)
        .eq('trang_thai', 'active')
        .order('ten_don_vi', { ascending: true });

      if (allError) {
        console.error('Error fetching all don vi:', allError);
        throw allError;
      }

      // Lấy đơn vị đã liên kết với đại lý này
      const { data: linkedDonVi, error: linkedError } = await supabase
        .from('dai_ly_don_vi')
        .select('don_vi_id')
        .eq('dai_ly_id', daiLyId)
        .eq('trang_thai', 'active');

      if (linkedError) {
        console.error('Error fetching linked don vi:', linkedError);
        throw linkedError;
      }

      const linkedDonViIds = new Set(linkedDonVi?.map(item => item.don_vi_id) || []);

      // Lọc ra đơn vị chưa liên kết với đại lý này (có thể đã liên kết với đại lý khác)
      const availableDonVi = allDonVi?.filter(donVi => !linkedDonViIds.has(donVi.id)) || [];

      // Transform to VDonViDaiLy format
      const result: VDonViDaiLy[] = availableDonVi.map(donVi => ({
        don_vi_id: donVi.id,
        ma_co_quan_bhxh: donVi.ma_co_quan_bhxh,
        ma_so_bhxh: donVi.ma_so_bhxh,
        ten_don_vi: donVi.ten_don_vi,
        is_bhxh_tn: donVi.is_bhxh_tn,
        is_bhyt: donVi.is_bhyt,
        type: donVi.type,
        don_vi_trang_thai: donVi.trang_thai,
        don_vi_ngay_tao: donVi.ngay_tao,
        don_vi_ngay_cap_nhat: donVi.ngay_cap_nhat,
        dm_khoi_kcb_id: donVi.dm_khoi_kcb_id,
        ma_khoi_kcb: null,
        ten_khoi_kcb: null,
        mo_ta_khoi: null,
        loai_dich_vu: donVi.is_bhxh_tn && donVi.is_bhyt ? 'BHXH & BHYT' :
                      donVi.is_bhxh_tn ? 'BHXH' : 'BHYT',
        loai_don_vi: donVi.type === 1 ? 'Đơn vị thu cấp tỉnh' : 'Đơn vị thu cấp huyện',
        dai_ly_id: null,
        ma_dai_ly: null,
        ten_dai_ly: null,
        loai_dai_ly: null,
        cap_dai_ly: null,
        ma_tinh_dai_ly: null,
        ngay_lien_ket: null,
        ghi_chu_lien_ket: null
      }));

      return result;
    } catch (error) {
      console.error('Error in getAvailableDonViForDaiLy:', error);
      throw error;
    }
  }
}

export const daiLyDonViService = new DaiLyDonViService();
