import { supabase } from '../../../shared/services/api/supabaseClient';
import { DanhSachKeKhai, DanhSachNguoiThamGia, ThanhToan } from '../../../shared/services/api/supabaseClient';
import phanQuyenService from '../../quan-ly/services/phanQuyenService';
import { emitPaymentConfirmed, emitKeKhaiStatusChanged } from '../../../shared/utils/eventEmitter';
import paymentService from './paymentService';

export interface CreateKeKhaiRequest {
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
  created_by?: string;
  // Organization fields - required by check_ke_khai_organization constraint
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
}

export interface CreateNguoiThamGiaRequest {
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
  tien_dong?: number; // Cột để lưu số tiền đóng được tính toán
  tien_dong_thuc_te?: number; // Cột để lưu số tiền đóng thực tế được tính toán
  tinh_kcb?: string;
  ma_benh_vien?: string;
  ma_ho_gia_dinh?: string;
  phuong_an?: string;
  trang_thai_the?: string;
  tu_ngay_the_cu?: string;
  den_ngay_the_cu?: string;
  so_thang_dong?: number; // Số tháng đóng
  stt_ho?: string; // STT hộ gia đình
  tu_ngay_the_moi?: string;
  den_ngay_the_moi?: string;
  ngay_bien_lai?: string;
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc?: string; // Loại tổ chức
  den_ngay_the_cu?: string;
  so_thang_dong?: number;
  stt_ho?: string;
  tu_ngay_the_moi?: string;
  den_ngay_the_moi?: string;
  ngay_bien_lai?: string;
  // Organization fields - required by database schema
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc?: string;
}

export interface KeKhaiSearchParams {
  ma_ke_khai?: string;
  loai_ke_khai?: string;
  dai_ly_id?: number;
  don_vi_id?: number;
  trang_thai?: string;
  tu_ngay?: string;
  den_ngay?: string;
  created_by?: string;
}

export interface ApproveKeKhaiRequest {
  approved_by: string;
  processing_notes?: string;
}

export interface RejectKeKhaiRequest {
  rejected_by: string;
  rejection_reason: string;
  processing_notes?: string;
}

class KeKhaiService {
  // Tạo mã kê khai tự động
  async generateMaKeKhai(): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('generate_ma_ke_khai');

      if (error) {
        console.error('Error generating ma ke khai:', error);
        throw new Error('Không thể tạo mã kê khai');
      }

      return data;
    } catch (error) {
      console.error('Error in generateMaKeKhai:', error);
      throw error;
    }
  }



  // Tạo kê khai mới với retry logic
  async createKeKhai(data: CreateKeKhaiRequest): Promise<DanhSachKeKhai> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Tự động sinh mã kê khai mới cho mỗi lần thử
        const ma_ke_khai = await this.generateMaKeKhai();

        // Lọc bỏ các trường undefined và chuỗi rỗng cho date fields
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            // Loại bỏ undefined và null
            if (value === undefined || value === null) return false;
            // Loại bỏ chuỗi rỗng cho date fields
            if ((key.includes('ngay') || key.includes('date')) && value === '') return false;
            return true;
          })
        );

        // Validate và rút ngắn doi_tuong_tham_gia nếu cần
        if (cleanData.doi_tuong_tham_gia && typeof cleanData.doi_tuong_tham_gia === 'string') {
          if (cleanData.doi_tuong_tham_gia.length > 100) {
            cleanData.doi_tuong_tham_gia = cleanData.doi_tuong_tham_gia.substring(0, 97) + '...';
            console.warn('doi_tuong_tham_gia was truncated to fit database constraint (100 chars)');
          }
        }

        const { data: result, error } = await supabase
          .from('danh_sach_ke_khai')
          .insert({
            ...cleanData,
            ma_ke_khai,
            trang_thai: 'draft'
          })
          .select()
          .single();

        if (error) {
          lastError = error;

          // Nếu là lỗi duplicate key và chưa hết retry, thử lại
          if (error.code === '23505' && attempt < maxRetries) {
            console.warn(`Attempt ${attempt}: Duplicate key, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Delay tăng dần
            continue;
          }

          console.error('Error creating ke khai:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          console.error('Data sent:', JSON.stringify(cleanData, null, 2));
          throw new Error(`Không thể tạo kê khai: ${error.message || 'Unknown error'}`);
        }

        return result;
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          console.error('Error in createKeKhai after all retries:', error);
          throw error;
        }
      }
    }

    throw lastError;
  }

  // Cập nhật kê khai
  async updateKeKhai(id: number, data: Partial<CreateKeKhaiRequest>): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating ke khai:', error);
        throw new Error('Không thể cập nhật kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in updateKeKhai:', error);
      throw error;
    }
  }

  // Lấy danh sách kê khai
  async getKeKhaiList(params?: KeKhaiSearchParams): Promise<DanhSachKeKhai[]> {
    try {
      console.log('📋 getKeKhaiList called with params:', params);

      let query = supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .order('created_at', { ascending: false });

      if (params?.ma_ke_khai) {
        query = query.ilike('ma_ke_khai', `%${params.ma_ke_khai}%`);
      }

      if (params?.loai_ke_khai) {
        query = query.eq('loai_ke_khai', params.loai_ke_khai);
      }

      if (params?.dai_ly_id) {
        query = query.eq('dai_ly_id', params.dai_ly_id);
      }

      if (params?.don_vi_id) {
        query = query.eq('don_vi_id', params.don_vi_id);
      }

      if (params?.trang_thai) {
        query = query.eq('trang_thai', params.trang_thai);
      }

      if (params?.tu_ngay) {
        query = query.gte('created_at', params.tu_ngay);
      }

      if (params?.den_ngay) {
        query = query.lte('created_at', params.den_ngay);
      }

      // QUAN TRỌNG: Filter theo created_by để đảm bảo bảo mật
      if (params?.created_by) {
        console.log('🔒 Filtering by created_by:', params.created_by);
        query = query.eq('created_by', params.created_by);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ke khai list:', error);
        throw new Error('Không thể tải danh sách kê khai');
      }

      console.log('📋 getKeKhaiList result count:', data?.length || 0);
      console.log('📋 getKeKhaiList first few items:', data?.slice(0, 3).map(item => ({
        id: item.id,
        ma_ke_khai: item.ma_ke_khai,
        created_by: item.created_by
      })));

      return data || [];
    } catch (error) {
      console.error('Error in getKeKhaiList:', error);
      throw error;
    }
  }

  // Lấy danh sách kê khai cần duyệt (cho nhân viên tổng hợp)
  async getKeKhaiForApproval(params?: KeKhaiSearchParams): Promise<DanhSachKeKhai[]> {
    try {
      let query = supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .in('trang_thai', ['submitted', 'processing', 'pending_payment'])
        .order('created_at', { ascending: false });

      if (params?.ma_ke_khai) {
        query = query.ilike('ma_ke_khai', `%${params.ma_ke_khai}%`);
      }

      if (params?.loai_ke_khai) {
        query = query.eq('loai_ke_khai', params.loai_ke_khai);
      }

      if (params?.dai_ly_id) {
        query = query.eq('dai_ly_id', params.dai_ly_id);
      }

      if (params?.don_vi_id) {
        query = query.eq('don_vi_id', params.don_vi_id);
      }

      if (params?.trang_thai) {
        query = query.eq('trang_thai', params.trang_thai);
      }

      if (params?.tu_ngay) {
        query = query.gte('created_at', params.tu_ngay);
      }

      if (params?.den_ngay) {
        query = query.lte('created_at', params.den_ngay);
      }

      if (params?.created_by) {
        query = query.eq('created_by', params.created_by);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ke khai for approval:', error);
        throw new Error('Không thể lấy danh sách kê khai cần duyệt');
      }

      console.log('🔍 getKeKhaiForApproval result count:', data?.length || 0);
      console.log('🔍 getKeKhaiForApproval sample data:', data?.slice(0, 3).map(item => ({
        id: item.id,
        ma_ke_khai: item.ma_ke_khai,
        trang_thai: item.trang_thai,
        created_by: item.created_by
      })));

      return data || [];
    } catch (error) {
      console.error('Error in getKeKhaiForApproval:', error);
      throw error;
    }
  }

  // Lấy chi tiết kê khai
  async getKeKhaiById(id: number): Promise<DanhSachKeKhai | null> {
    try {
      const { data, error } = await supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching ke khai:', error);
        throw new Error('Không thể tải thông tin kê khai');
      }

      return data;
    } catch (error) {
      console.error('Error in getKeKhaiById:', error);
      throw error;
    }
  }

  // Xóa kê khai
  async deleteKeKhai(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('danh_sach_ke_khai')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ke khai:', error);
        throw new Error('Không thể xóa kê khai');
      }
    } catch (error) {
      console.error('Error in deleteKeKhai:', error);
      throw error;
    }
  }

  // Cập nhật mã hồ sơ
  async updateMaHoSo(keKhaiId: number, maHoSo: string | null): Promise<void> {
    try {
      console.log('Updating ma_ho_so:', { keKhaiId, maHoSo });

      const { data, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({ ma_ho_so: maHoSo })
        .eq('id', keKhaiId)
        .select();

      if (error) {
        console.error('Error updating ma ho so:', error);
        throw new Error(`Không thể cập nhật mã hồ sơ: ${error.message}`);
      }

      console.log('Successfully updated ma_ho_so:', data);
    } catch (error) {
      console.error('Error in updateMaHoSo:', error);
      throw error;
    }
  }

  // Duyệt kê khai và tạo yêu cầu thanh toán
  async approveKeKhaiWithPayment(id: number, data: ApproveKeKhaiRequest): Promise<{ keKhai: DanhSachKeKhai; payment: ThanhToan }> {
    try {
      // Tính tổng số tiền cần thanh toán
      const totalAmount = await paymentService.calculateTotalAmount(id);

      // Cập nhật trạng thái kê khai thành pending_payment
      const { data: keKhaiResult, error: keKhaiError } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'pending_payment',
          approved_by: data.approved_by,
          approved_at: new Date().toISOString(),
          processing_notes: data.processing_notes,
          payment_status: 'pending',
          total_amount: totalAmount,
          payment_required_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: data.approved_by
        })
        .eq('id', id)
        .select()
        .single();

      if (keKhaiError) {
        console.error('Error approving ke khai:', keKhaiError);
        throw new Error('Không thể duyệt kê khai');
      }

      // Tạo yêu cầu thanh toán
      const payment = await paymentService.createPayment({
        ke_khai_id: id,
        so_tien: totalAmount,
        phuong_thuc_thanh_toan: 'qr_code',
        payment_description: `Thanh toán kê khai ${keKhaiResult.ma_ke_khai}`,
        created_by: data.approved_by
      });

      // Cập nhật payment_id vào kê khai
      await supabase
        .from('danh_sach_ke_khai')
        .update({ payment_id: payment.id })
        .eq('id', id);

      return { keKhai: keKhaiResult, payment };
    } catch (error) {
      console.error('Error in approveKeKhaiWithPayment:', error);
      throw error;
    }
  }

  // Duyệt kê khai (phương thức cũ - không yêu cầu thanh toán)
  async approveKeKhai(id: number, data: ApproveKeKhaiRequest): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'approved',
          approved_by: data.approved_by,
          approved_at: new Date().toISOString(),
          processing_notes: data.processing_notes,
          updated_at: new Date().toISOString(),
          updated_by: data.approved_by
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error approving ke khai:', error);
        throw new Error('Không thể duyệt kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in approveKeKhai:', error);
      throw error;
    }
  }

  // Từ chối kê khai
  async rejectKeKhai(id: number, data: RejectKeKhaiRequest): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'rejected',
          rejected_by: data.rejected_by,
          rejected_at: new Date().toISOString(),
          rejection_reason: data.rejection_reason,
          processing_notes: data.processing_notes,
          updated_at: new Date().toISOString(),
          updated_by: data.rejected_by
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting ke khai:', error);
        throw new Error('Không thể từ chối kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in rejectKeKhai:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái thanh toán cho participants
  async updateParticipantPaymentStatus(
    paymentId: number,
    paymentStatus: 'unpaid' | 'pending' | 'completed' | 'failed' | 'cancelled'
  ): Promise<{ success: boolean; message: string; count: number }> {
    try {
      const updateData: any = {
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      };

      if (paymentStatus === 'completed') {
        updateData.paid_at = new Date().toISOString();
      }

      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .update(updateData)
        .eq('payment_id', paymentId)
        .select();

      if (error) {
        console.error('Error updating participant payment status:', error);
        throw new Error('Không thể cập nhật trạng thái thanh toán của người tham gia');
      }

      const count = result?.length || 0;
      console.log(`✅ Updated payment status to ${paymentStatus} for ${count} participants`);

      return {
        success: true,
        message: `Đã cập nhật trạng thái thanh toán cho ${count} người tham gia`,
        count
      };
    } catch (error) {
      console.error('Error in updateParticipantPaymentStatus:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán',
        count: 0
      };
    }
  }

  // Xác nhận thanh toán và chuyển kê khai sang trạng thái đang xử lý
  async confirmPayment(
    keKhaiId: number,
    paymentId: number,
    transactionId?: string,
    confirmedBy?: string,
    proofImageUrl?: string,
    confirmationNote?: string
  ): Promise<DanhSachKeKhai> {
    try {
      // Cập nhật trạng thái thanh toán
      await paymentService.updatePaymentStatus(
        paymentId,
        'completed',
        transactionId,
        confirmedBy,
        proofImageUrl,
        confirmationNote
      );

      // Cập nhật trạng thái thanh toán cho participants
      const participantUpdateResult = await this.updateParticipantPaymentStatus(paymentId, 'completed');
      console.log('💳 Participant payment status update result:', participantUpdateResult);

      // Cập nhật trạng thái kê khai thành processing (đang xử lý) sau khi thanh toán
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'processing',
          payment_status: 'completed',
          payment_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: confirmedBy,
          processing_notes: 'Đã thanh toán thành công, chuyển sang xử lý'
        })
        .eq('id', keKhaiId)
        .select()
        .single();

      if (error) {
        console.error('Error confirming payment:', error);
        throw new Error('Không thể xác nhận thanh toán');
      }

      // Emit events để thông báo cho các component khác
      emitKeKhaiStatusChanged(keKhaiId, 'pending_payment', 'processing', result);
      emitPaymentConfirmed(keKhaiId, paymentId, result);

      return result;
    } catch (error) {
      console.error('Error in confirmPayment:', error);
      throw error;
    }
  }

  // Lấy thông tin thanh toán của kê khai
  async getPaymentInfo(keKhaiId: number): Promise<ThanhToan | null> {
    try {
      return await paymentService.getPaymentByKeKhaiId(keKhaiId);
    } catch (error) {
      console.error('Error in getPaymentInfo:', error);
      throw error;
    }
  }

  // Chuyển kê khai sang trạng thái đang xử lý
  async setKeKhaiProcessing(id: number, userId: string, notes?: string): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'processing',
          processing_notes: notes,
          updated_at: new Date().toISOString(),
          updated_by: userId
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error setting ke khai to processing:', error);
        throw new Error('Không thể cập nhật trạng thái kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in setKeKhaiProcessing:', error);
      throw error;
    }
  }

  // Submit individual participant
  async submitIndividualParticipant(
    participantId: number,
    userId: string,
    notes?: string
  ): Promise<DanhSachNguoiThamGia> {
    try {
      console.log('submitIndividualParticipant called with:', { participantId, userId, notes });

      // First, validate that participant has required data
      const { data: participant, error: fetchError } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('*')
        .eq('id', participantId)
        .single();

      if (fetchError || !participant) {
        throw new Error('Không tìm thấy thông tin người tham gia');
      }

      // Validate required fields for submission
      const requiredFields = ['ho_ten', 'ma_so_bhxh', 'noi_dang_ky_kcb'];
      const missingFields = requiredFields.filter(field => !participant[field]);

      if (missingFields.length > 0) {
        throw new Error(`Thiếu thông tin bắt buộc: ${missingFields.join(', ')}`);
      }

      // Update participant status to submitted
      const updateData = {
        participant_status: 'submitted',
        submitted_at: new Date().toISOString(),
        submitted_by: userId,
        individual_submission_notes: notes || null,
        updated_at: new Date().toISOString(),
        updated_by: userId
      };

      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .update(updateData)
        .eq('id', participantId)
        .select()
        .single();

      if (error) {
        console.error('Error submitting individual participant:', error);
        throw new Error('Không thể nộp người tham gia');
      }

      console.log('Successfully submitted individual participant:', result);
      return result;
    } catch (error) {
      console.error('Error in submitIndividualParticipant:', error);
      throw error;
    }
  }

  // Test method to check if we can update a participant
  async testUpdateParticipant(participantId: number): Promise<any> {
    try {
      console.log('Testing update for participant:', participantId);

      // Try a simple update first
      const { data, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', participantId)
        .select()
        .single();

      if (error) {
        console.error('Test update failed:', error);
        return { success: false, error };
      }

      console.log('Test update successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Test update exception:', error);
      return { success: false, error };
    }
  }

  // Update participant status
  async updateParticipantStatus(
    participantId: number,
    status: string,
    userId: string,
    notes?: string
  ): Promise<DanhSachNguoiThamGia> {
    try {
      console.log('updateParticipantStatus called with:', { participantId, status, userId, notes });

      // Update data with all required fields
      const updateData: any = {
        participant_status: status,
        updated_at: new Date().toISOString(),
        updated_by: userId
      };

      // Add timestamp for specific statuses
      if (status === 'submitted') {
        updateData.submitted_at = new Date().toISOString();
        updateData.submitted_by = userId;
      }

      if (notes) {
        updateData.individual_submission_notes = notes;
      }

      console.log('Update data being sent:', updateData);

      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .update(updateData)
        .eq('id', participantId)
        .select()
        .single();

      if (error) {
        console.error('Error updating participant status:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Không thể cập nhật trạng thái người tham gia: ${error.message}`);
      }

      console.log('Successfully updated participant status:', result);
      return result;
    } catch (error) {
      console.error('Error in updateParticipantStatus:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái kê khai (generic function)
  async updateKeKhaiStatus(
    id: number,
    status: string,
    userId?: string,
    notes?: string
  ): Promise<DanhSachKeKhai> {
    try {
      console.log('updateKeKhaiStatus called with:', { id, status, userId, notes });

      const updateData: any = {
        trang_thai: status,
        updated_at: new Date().toISOString()
      };

      if (userId) {
        updateData.updated_by = userId;
      }

      if (notes) {
        updateData.processing_notes = notes;
      }

      // Thêm timestamp cho các trạng thái đặc biệt (chỉ cho các trường tồn tại trong DB)
      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
      }
      // Note: completed_at không tồn tại trong schema, chỉ dùng trang_thai = 'completed'

      console.log('Update data to be sent:', updateData);

      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating ke khai status:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Lỗi cập nhật database: ${error.message}`);
      }

      if (!result) {
        throw new Error('Không tìm thấy kê khai để cập nhật');
      }

      console.log('Successfully updated ke khai:', result);
      return result;
    } catch (error: any) {
      console.error('Error in updateKeKhaiStatus:', error);

      // Re-throw với thông tin chi tiết hơn
      if (error.message?.includes('Lỗi cập nhật database')) {
        throw error; // Đã có thông tin chi tiết
      } else {
        throw new Error(`Không thể cập nhật trạng thái kê khai: ${error.message || 'Lỗi không xác định'}`);
      }
    }
  }

  // Thêm người tham gia vào kê khai
  async addNguoiThamGia(data: CreateNguoiThamGiaRequest): Promise<DanhSachNguoiThamGia> {
    try {
      // Lọc bỏ các trường undefined và chuỗi rỗng cho date fields
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          // Loại bỏ undefined và null
          if (value === undefined || value === null) return false;
          // Loại bỏ chuỗi rỗng cho date fields
          if ((key.includes('ngay') || key.includes('date')) && value === '') return false;
          return true;
        })
      );

      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .insert(cleanData)
        .select()
        .single();

      if (error) {
        console.error('Error adding nguoi tham gia:', error);
        throw new Error('Không thể thêm người tham gia');
      }

      return result;
    } catch (error) {
      console.error('Error in addNguoiThamGia:', error);
      throw error;
    }
  }

  // Thêm nhiều người tham gia cùng lúc
  async addMultipleNguoiThamGia(dataList: CreateNguoiThamGiaRequest[]): Promise<DanhSachNguoiThamGia[]> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .insert(dataList)
        .select();

      if (error) {
        console.error('Error adding multiple nguoi tham gia:', error);
        throw new Error('Không thể thêm danh sách người tham gia');
      }

      return result || [];
    } catch (error) {
      console.error('Error in addMultipleNguoiThamGia:', error);
      throw error;
    }
  }

  // Cập nhật người tham gia
  async updateNguoiThamGia(id: number, data: Partial<CreateNguoiThamGiaRequest>): Promise<DanhSachNguoiThamGia> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating nguoi tham gia:', error);
        throw new Error('Không thể cập nhật người tham gia');
      }

      return result;
    } catch (error) {
      console.error('Error in updateNguoiThamGia:', error);
      throw error;
    }
  }

  // Lấy danh sách người tham gia theo kê khai
  async getNguoiThamGiaByKeKhai(keKhaiId: number): Promise<DanhSachNguoiThamGia[]> {
    try {
      const { data, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('*')
        .eq('ke_khai_id', keKhaiId)
        .order('stt', { ascending: true });

      if (error) {
        console.error('Error fetching nguoi tham gia:', error);
        throw new Error('Không thể tải danh sách người tham gia');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNguoiThamGiaByKeKhai:', error);
      throw error;
    }
  }

  // Lấy thông tin người tham gia theo ID
  async getNguoiThamGiaById(participantId: number): Promise<DanhSachNguoiThamGia | null> {
    try {
      const { data, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('*')
        .eq('id', participantId)
        .single();

      if (error) {
        console.error('Error fetching participant by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getNguoiThamGiaById:', error);
      return null;
    }
  }

  // Validate if declaration has participants (for participant requirement enforcement)
  async validateKeKhaiHasParticipants(keKhaiId: number): Promise<{ isValid: boolean; message: string; participantCount: number }> {
    try {
      const participants = await this.getNguoiThamGiaByKeKhai(keKhaiId);
      const participantCount = participants.length;

      if (participantCount === 0) {
        return {
          isValid: false,
          message: 'Kê khai này chưa có người tham gia nào. Vui lòng thêm ít nhất một người tham gia trước khi thực hiện thao tác này.',
          participantCount: 0
        };
      }

      return {
        isValid: true,
        message: `Kê khai có ${participantCount} người tham gia.`,
        participantCount
      };
    } catch (error) {
      console.error('Error validating participants:', error);
      return {
        isValid: false,
        message: 'Không thể kiểm tra danh sách người tham gia. Vui lòng thử lại.',
        participantCount: 0
      };
    }
  }

  // Create new declaration with selected participants
  async createNewDeclarationWithParticipants(
    originalKeKhaiId: number,
    participantIds: number[],
    userId: string,
    notes?: string
  ): Promise<{ newKeKhai: DanhSachKeKhai; movedParticipants: DanhSachNguoiThamGia[] }> {
    try {
      console.log('🚀 Creating new declaration with participants:', {
        originalKeKhaiId,
        participantIds,
        userId,
        notes
      });

      // Step 1: Get original declaration info
      const originalKeKhai = await this.getKeKhaiById(originalKeKhaiId);
      if (!originalKeKhai) {
        throw new Error('Không tìm thấy kê khai gốc');
      }

      // Step 2: Get participants to move
      const participantsToMoveRaw = await Promise.all(
        participantIds.map(id => this.getNguoiThamGiaById(id))
      );

      // Filter out null values and validate
      const participantsToMove: DanhSachNguoiThamGia[] = [];
      for (let i = 0; i < participantsToMoveRaw.length; i++) {
        const participant = participantsToMoveRaw[i];
        if (!participant) {
          throw new Error(`Không tìm thấy thông tin người tham gia ID ${participantIds[i]}`);
        }
        if (participant.ke_khai_id !== originalKeKhaiId) {
          throw new Error('Người tham gia không thuộc kê khai này');
        }
        participantsToMove.push(participant);
      }

      // Step 3: Create new declaration with same info as original
      const newKeKhaiData: CreateKeKhaiRequest = {
        ten_ke_khai: `${originalKeKhai.ten_ke_khai} - Tách ${participantIds.length} người`,
        loai_ke_khai: originalKeKhai.loai_ke_khai,
        dai_ly_id: originalKeKhai.dai_ly_id,
        don_vi_id: originalKeKhai.don_vi_id,
        doi_tuong_tham_gia: originalKeKhai.doi_tuong_tham_gia,
        hinh_thuc_tinh: originalKeKhai.hinh_thuc_tinh,
        luong_co_so: originalKeKhai.luong_co_so,
        nguon_dong: originalKeKhai.nguon_dong,
        noi_dang_ky_kcb_ban_dau: originalKeKhai.noi_dang_ky_kcb_ban_dau,
        bien_lai_ngay_tham_gia: originalKeKhai.bien_lai_ngay_tham_gia,
        so_thang: originalKeKhai.so_thang,
        ty_le_nsnn_ho_tro: originalKeKhai.ty_le_nsnn_ho_tro,
        ghi_chu: notes || `Tách từ kê khai ${originalKeKhai.ma_ke_khai}`,
        created_by: userId,
        cong_ty_id: originalKeKhai.cong_ty_id,
        co_quan_bhxh_id: originalKeKhai.co_quan_bhxh_id
      };

      const newKeKhai = await this.createKeKhai(newKeKhaiData);
      console.log('✅ New declaration created:', newKeKhai);

      return { newKeKhai, movedParticipants: participantsToMove };
    } catch (error) {
      console.error('Error creating new declaration with participants:', error);
      throw error;
    }
  }

  // Move participants to new declaration
  async moveParticipantsToNewDeclaration(
    participantIds: number[],
    newKeKhaiId: number,
    userId: string
  ): Promise<DanhSachNguoiThamGia[]> {
    try {
      console.log('🔄 Moving participants to new declaration:', {
        participantIds,
        newKeKhaiId,
        userId
      });

      const movedParticipants: DanhSachNguoiThamGia[] = [];

      for (const participantId of participantIds) {
        // Update participant's ke_khai_id to new declaration
        const { data: updatedParticipant, error } = await supabase
          .from('danh_sach_nguoi_tham_gia')
          .update({
            ke_khai_id: newKeKhaiId,
            updated_at: new Date().toISOString(),
            updated_by: userId,
            // Reset submission status since this is a new declaration
            participant_status: 'draft',
            submitted_at: null,
            submitted_by: null,
            individual_submission_notes: null,
            payment_status: 'unpaid',
            payment_id: null,
            paid_at: null
          })
          .eq('id', participantId)
          .select()
          .single();

        if (error) {
          console.error('Error moving participant:', error);
          throw new Error(`Không thể di chuyển người tham gia ID ${participantId}`);
        }

        movedParticipants.push(updatedParticipant);
        console.log(`✅ Moved participant ${participantId} to declaration ${newKeKhaiId}`);
      }

      return movedParticipants;
    } catch (error) {
      console.error('Error moving participants:', error);
      throw error;
    }
  }

  // Complete workflow: Create new declaration and move selected participants
  async createDeclarationAndMoveParticipants(
    originalKeKhaiId: number,
    participantIds: number[],
    userId: string,
    notes?: string
  ): Promise<{
    newKeKhai: DanhSachKeKhai;
    movedParticipants: DanhSachNguoiThamGia[];
    originalKeKhai: DanhSachKeKhai;
  }> {
    try {
      console.log('🚀 Starting complete workflow: create declaration and move participants');

      // Step 1: Create new declaration with participant info
      const { newKeKhai, movedParticipants } = await this.createNewDeclarationWithParticipants(
        originalKeKhaiId,
        participantIds,
        userId,
        notes
      );

      // Step 2: Move participants to new declaration
      const actuallyMovedParticipants = await this.moveParticipantsToNewDeclaration(
        participantIds,
        newKeKhai.id,
        userId
      );

      // Step 3: Get updated original declaration info
      const originalKeKhai = await this.getKeKhaiById(originalKeKhaiId);

      console.log('✅ Complete workflow finished successfully:', {
        newDeclarationId: newKeKhai.id,
        movedParticipantsCount: actuallyMovedParticipants.length
      });

      return {
        newKeKhai,
        movedParticipants: actuallyMovedParticipants,
        originalKeKhai: originalKeKhai!
      };
    } catch (error) {
      console.error('Error in complete workflow:', error);
      throw error;
    }
  }



  // Debug method để kiểm tra dữ liệu
  async debugUserData(userId: string): Promise<any> {
    try {
      console.log('🔍 Debug: Checking data for user:', userId);

      // Check ke khai
      const { data: keKhaiData } = await supabase
        .from('danh_sach_ke_khai')
        .select('id, ma_ke_khai, trang_thai, created_at')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      console.log('📋 All ke khai for user:', keKhaiData);

      // Group by status
      const statusGroups = keKhaiData?.reduce((acc, item) => {
        acc[item.trang_thai] = (acc[item.trang_thai] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      console.log('📊 Ke khai by status:', statusGroups);

      // Check participants
      if (keKhaiData && keKhaiData.length > 0) {
        const keKhaiIds = keKhaiData.map(k => k.id);
        const { data: participantsData } = await supabase
          .from('danh_sach_nguoi_tham_gia')
          .select('id, ho_ten, ke_khai_id, participant_status')
          .in('ke_khai_id', keKhaiIds);

        console.log('👥 All participants for user:', participantsData?.length || 0);

        // Group participants by ke khai status
        const participantsByKeKhaiStatus = keKhaiData.map(kk => ({
          keKhai: kk,
          participants: participantsData?.filter(p => p.ke_khai_id === kk.id) || []
        }));

        console.log('🔗 Participants by ke khai status:', participantsByKeKhaiStatus);
      }

      return { keKhaiData, statusGroups };
    } catch (error) {
      console.error('Debug error:', error);
      return null;
    }
  }

  // Lấy người tham gia chưa xử lý với phân trang (cho hồ sơ chưa xử lý)
  async getUnprocessedNguoiThamGiaWithPagination(params: {
    userId: string;
    page: number;
    pageSize: number;
    loaiKeKhai?: string;
    fromDate?: string;
    toDate?: string;
    participantStatus?: string;
    searchTerm?: string;
    // Advanced filters
    maDonVi?: string;
    maTinh?: string;
    maHuyen?: string;
    maBhxh?: string;
    ketQua?: string;
    daiLyId?: string;
    coQuanBhxhId?: string;
    hinhThuc?: string;
    soHoSo?: string;
  }): Promise<{ data: any[]; total: number }> {
    try {
      console.log('🔍 getUnprocessedNguoiThamGiaWithPagination called with:', params);

      // Trước tiên lấy danh sách kê khai của user với trạng thái chưa xử lý
      let keKhaiQuery = supabase
        .from('danh_sach_ke_khai')
        .select('id')
        .eq('created_by', params.userId)
        .in('trang_thai', ['draft', 'submitted', 'pending_payment']); // Loại bỏ 'processing' vì đã được xử lý

      if (params.loaiKeKhai) {
        keKhaiQuery = keKhaiQuery.eq('loai_ke_khai', params.loaiKeKhai);
      }

      // Apply date filters
      if (params.fromDate) {
        keKhaiQuery = keKhaiQuery.gte('created_at', params.fromDate);
      }
      if (params.toDate) {
        keKhaiQuery = keKhaiQuery.lte('created_at', params.toDate);
      }

      // Apply advanced filters for ke khai
      if (params.maDonVi) {
        keKhaiQuery = keKhaiQuery.eq('don_vi_id', params.maDonVi);
      }

      if (params.daiLyId) {
        keKhaiQuery = keKhaiQuery.eq('dai_ly_id', parseInt(params.daiLyId));
      }

      if (params.coQuanBhxhId) {
        keKhaiQuery = keKhaiQuery.eq('co_quan_bhxh_id', parseInt(params.coQuanBhxhId));
      }

      if (params.soHoSo) {
        keKhaiQuery = keKhaiQuery.ilike('ma_ho_so', `%${params.soHoSo}%`);
      }

      const { data: keKhaiData, error: keKhaiError } = await keKhaiQuery;

      if (keKhaiError) {
        console.error('Error fetching ke khai for unprocessed participants:', keKhaiError);
        throw new Error('Không thể tải danh sách kê khai');
      }

      console.log('🔍 Found unprocessed ke khai for participants:', keKhaiData?.length || 0);
      console.log('📋 Unprocessed ke khai data:', keKhaiData);

      const keKhaiIds = keKhaiData?.map(item => item.id) || [];

      if (keKhaiIds.length === 0) {
        console.log('❌ No unprocessed ke khai found for user. Checking all ke khai...');

        // Debug: Check all ke khai for this user
        const { data: allKeKhai } = await supabase
          .from('danh_sach_ke_khai')
          .select('id, ma_ke_khai, trang_thai')
          .eq('created_by', params.userId);

        console.log('📊 All ke khai for user:', allKeKhai);

        return { data: [], total: 0 };
      }

      // Count total participants với filter
      let countQuery = supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('id', { count: 'exact', head: true })
        .in('ke_khai_id', keKhaiIds);

      // Filter by participant status if specified
      if (params.participantStatus && params.participantStatus !== 'all') {
        countQuery = countQuery.eq('participant_status', params.participantStatus);
      }

      // Search filter
      if (params.searchTerm) {
        countQuery = countQuery.or(`ho_ten.ilike.%${params.searchTerm}%,ma_so_bhxh.ilike.%${params.searchTerm}%`);
      }

      // Advanced filters for participants
      if (params.maBhxh) {
        countQuery = countQuery.ilike('ma_so_bhxh', `%${params.maBhxh}%`);
      }

      if (params.maTinh) {
        countQuery = countQuery.eq('ma_tinh_nkq', params.maTinh);
      }

      if (params.maHuyen) {
        countQuery = countQuery.eq('ma_huyen_nkq', params.maHuyen);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Error counting unprocessed participants:', countError);
        throw new Error('Không thể đếm số lượng người tham gia');
      }

      // Get paginated data với join
      const offset = (params.page - 1) * params.pageSize;
      let dataQuery = supabase
        .from('danh_sach_nguoi_tham_gia')
        .select(`
          *,
          ke_khai:danh_sach_ke_khai(
            id,
            ma_ke_khai,
            ten_ke_khai,
            loai_ke_khai,
            trang_thai,
            created_at,
            updated_at,
            doi_tuong_tham_gia,
            nguon_dong,
            total_amount
          )
        `)
        .in('ke_khai_id', keKhaiIds);

      // Apply same filters as count query
      if (params.participantStatus && params.participantStatus !== 'all') {
        dataQuery = dataQuery.eq('participant_status', params.participantStatus);
      }

      if (params.searchTerm) {
        dataQuery = dataQuery.or(`ho_ten.ilike.%${params.searchTerm}%,ma_so_bhxh.ilike.%${params.searchTerm}%`);
      }

      // Apply same advanced filters as count query
      if (params.maBhxh) {
        dataQuery = dataQuery.ilike('ma_so_bhxh', `%${params.maBhxh}%`);
      }

      if (params.maTinh) {
        dataQuery = dataQuery.eq('ma_tinh_nkq', params.maTinh);
      }

      if (params.maHuyen) {
        dataQuery = dataQuery.eq('ma_huyen_nkq', params.maHuyen);
      }

      dataQuery = dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + params.pageSize - 1);

      const { data, error } = await dataQuery;

      if (error) {
        console.error('Error fetching unprocessed participants:', error);
        throw new Error('Không thể tải danh sách người tham gia chưa xử lý');
      }

      console.log('👥 Loaded unprocessed participants:', data?.length, 'of', count);

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in getUnprocessedNguoiThamGiaWithPagination:', error);
      throw error;
    }
  }

  // Lấy người tham gia đang/đã xử lý với phân trang (cho hồ sơ đã xử lý)
  async getProcessedNguoiThamGiaWithPagination(params: {
    userId: string;
    page: number;
    pageSize: number;
    loaiKeKhai?: string;
    fromDate?: string;
    toDate?: string;
    participantStatus?: string;
    paymentStatus?: string;
    searchTerm?: string;
  }): Promise<{ data: any[]; total: number }> {
    try {
      console.log('🔍 getProcessedNguoiThamGiaWithPagination called with:', params);

      // Trước tiên lấy danh sách kê khai của user với trạng thái đã xử lý và đang xử lý
      let keKhaiQuery = supabase
        .from('danh_sach_ke_khai')
        .select('id')
        .eq('created_by', params.userId)
        .in('trang_thai', ['processing', 'approved', 'paid', 'rejected', 'completed']); // Bao gồm cả đang xử lý

      if (params.loaiKeKhai) {
        keKhaiQuery = keKhaiQuery.eq('loai_ke_khai', params.loaiKeKhai);
      }

      // Apply date filters
      if (params.fromDate) {
        keKhaiQuery = keKhaiQuery.gte('created_at', params.fromDate);
      }
      if (params.toDate) {
        keKhaiQuery = keKhaiQuery.lte('created_at', params.toDate);
      }

      const { data: keKhaiData, error: keKhaiError } = await keKhaiQuery;

      if (keKhaiError) {
        console.error('Error fetching ke khai for processed participants:', keKhaiError);
        throw new Error('Không thể tải danh sách kê khai');
      }

      const keKhaiIds = keKhaiData?.map(item => item.id) || [];

      if (keKhaiIds.length === 0) {
        console.log('No processing/processed ke khai found for user');
        return { data: [], total: 0 };
      }

      // Count total participants với filter
      let countQuery = supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('id', { count: 'exact', head: true })
        .in('ke_khai_id', keKhaiIds);

      // Filter by participant status if specified
      if (params.participantStatus && params.participantStatus !== 'all') {
        countQuery = countQuery.eq('participant_status', params.participantStatus);
      }

      // Filter by payment status if specified
      if (params.paymentStatus && params.paymentStatus !== 'all') {
        countQuery = countQuery.eq('payment_status', params.paymentStatus);
      }

      // Search filter
      if (params.searchTerm) {
        countQuery = countQuery.or(`ho_ten.ilike.%${params.searchTerm}%,ma_so_bhxh.ilike.%${params.searchTerm}%`);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Error counting processed participants:', countError);
        throw new Error('Không thể đếm số lượng người tham gia');
      }

      // Get paginated data với join
      const offset = (params.page - 1) * params.pageSize;
      let dataQuery = supabase
        .from('danh_sach_nguoi_tham_gia')
        .select(`
          *,
          ke_khai:danh_sach_ke_khai(
            id,
            ma_ke_khai,
            ten_ke_khai,
            loai_ke_khai,
            trang_thai,
            created_at,
            approved_at,
            rejected_at,
            payment_completed_at,
            updated_at,
            doi_tuong_tham_gia,
            nguon_dong,
            total_amount
          )
        `)
        .in('ke_khai_id', keKhaiIds);

      // Apply same filters as count query
      if (params.participantStatus && params.participantStatus !== 'all') {
        dataQuery = dataQuery.eq('participant_status', params.participantStatus);
      }

      // Filter by payment status if specified
      if (params.paymentStatus && params.paymentStatus !== 'all') {
        dataQuery = dataQuery.eq('payment_status', params.paymentStatus);
      }

      if (params.searchTerm) {
        dataQuery = dataQuery.or(`ho_ten.ilike.%${params.searchTerm}%,ma_so_bhxh.ilike.%${params.searchTerm}%`);
      }

      dataQuery = dataQuery
        .order('updated_at', { ascending: false })
        .range(offset, offset + params.pageSize - 1);

      const { data, error } = await dataQuery;

      if (error) {
        console.error('Error fetching processed participants:', error);
        throw new Error('Không thể tải danh sách người tham gia đã xử lý');
      }

      console.log('👥 Loaded processed participants:', data?.length, 'of', count);

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in getProcessedNguoiThamGiaWithPagination:', error);
      throw error;
    }
  }

  // Lấy tất cả người tham gia với phân trang
  async getAllNguoiThamGiaWithPagination(params: {
    userId: string;
    page: number;
    pageSize: number;
    loaiKeKhai?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<{ data: any[]; total: number }> {
    try {
      console.log('🔍 getAllNguoiThamGiaWithPagination called with:', params);

      // Trước tiên lấy danh sách kê khai của user
      let keKhaiQuery = supabase
        .from('danh_sach_ke_khai')
        .select('id')
        .eq('created_by', params.userId);

      if (params.loaiKeKhai) {
        keKhaiQuery = keKhaiQuery.eq('loai_ke_khai', params.loaiKeKhai);
      }

      // Apply date filters
      if (params.fromDate) {
        keKhaiQuery = keKhaiQuery.gte('created_at', params.fromDate);
      }
      if (params.toDate) {
        // Add 1 day to include the entire end date
        const endDate = new Date(params.toDate);
        endDate.setDate(endDate.getDate() + 1);
        keKhaiQuery = keKhaiQuery.lt('created_at', endDate.toISOString().split('T')[0]);
      }

      const { data: keKhaiList, error: keKhaiError } = await keKhaiQuery;

      if (keKhaiError) {
        console.error('Error fetching ke khai list:', keKhaiError);
        throw new Error('Không thể tải danh sách kê khai');
      }

      if (!keKhaiList || keKhaiList.length === 0) {
        console.log('👥 No ke khai found for user');
        return { data: [], total: 0 };
      }

      const keKhaiIds = keKhaiList.map(kk => kk.id);
      console.log('📋 Found ke khai IDs:', keKhaiIds);

      // Get total count
      const { count, error: countError } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('*', { count: 'exact', head: true })
        .in('ke_khai_id', keKhaiIds);

      if (countError) {
        console.error('Error counting participants:', countError);
        throw new Error('Không thể đếm số lượng người tham gia');
      }

      // Get paginated data với join
      const offset = (params.page - 1) * params.pageSize;
      const { data, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select(`
          *,
          ke_khai:danh_sach_ke_khai(
            id,
            ma_ke_khai,
            ten_ke_khai,
            loai_ke_khai,
            trang_thai,
            created_at,
            doi_tuong_tham_gia,
            nguon_dong
          )
        `)
        .in('ke_khai_id', keKhaiIds)
        .order('created_at', { ascending: false })
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        console.error('Error fetching paginated participants:', error);
        throw new Error('Không thể tải danh sách người tham gia');
      }

      console.log('👥 Loaded participants:', data?.length, 'of', count);

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in getAllNguoiThamGiaWithPagination:', error);
      throw error;
    }
  }

  // Xóa người tham gia
  async deleteNguoiThamGia(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting nguoi tham gia:', error);
        throw new Error('Không thể xóa người tham gia');
      }
    } catch (error) {
      console.error('Error in deleteNguoiThamGia:', error);
      throw error;
    }
  }

  // Xóa nhiều người tham gia cùng lúc
  async deleteMultipleNguoiThamGia(ids: number[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Error deleting multiple nguoi tham gia:', error);
        throw new Error('Không thể xóa danh sách người tham gia');
      }
    } catch (error) {
      console.error('Error in deleteMultipleNguoiThamGia:', error);
      throw error;
    }
  }

  // Kiểm tra quyền admin của user
  async isUserAdmin(userId: string): Promise<boolean> {
    try {
      console.log('🔍 Checking admin status for user ID:', userId);
      const permissions = await phanQuyenService.getPhanQuyenByUserId(parseInt(userId));
      console.log('📋 User permissions:', permissions);

      const isAdmin = permissions.some(p => p.cap_do_quyen === 'admin' || p.cap_do_quyen === 'super_admin');
      console.log('👤 Is admin result:', isAdmin);

      return isAdmin;
    } catch (error) {
      console.error('Error checking user admin status:', error);
      return false; // Mặc định không có quyền admin
    }
  }

  // Kiểm tra quyền admin thực sự (strict check)
  async isUserRealAdmin(userId: string): Promise<boolean> {
    try {
      console.log('🔍 STRICT admin check for user ID:', userId);

      // Kiểm tra trực tiếp trong database
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select('cap_do_quyen, trang_thai')
        .eq('nguoi_dung_id', parseInt(userId))
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error in strict admin check:', error);
        return false;
      }

      console.log('📋 Direct DB permissions:', data);

      const isRealAdmin = data?.some(p =>
        (p.cap_do_quyen === 'admin' || p.cap_do_quyen === 'super_admin') &&
        p.trang_thai === 'active'
      ) || false;

      console.log('👤 STRICT admin result:', isRealAdmin);
      return isRealAdmin;
    } catch (error) {
      console.error('Error in strict admin check:', error);
      return false;
    }
  }

  // Lấy danh sách kê khai cho admin (không filter theo created_by)
  async getKeKhaiListForAdmin(params?: KeKhaiSearchParams): Promise<DanhSachKeKhai[]> {
    try {
      let query = supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .order('created_at', { ascending: false });

      if (params?.ma_ke_khai) {
        query = query.ilike('ma_ke_khai', `%${params.ma_ke_khai}%`);
      }

      if (params?.loai_ke_khai) {
        query = query.eq('loai_ke_khai', params.loai_ke_khai);
      }

      if (params?.dai_ly_id) {
        query = query.eq('dai_ly_id', params.dai_ly_id);
      }

      if (params?.don_vi_id) {
        query = query.eq('don_vi_id', params.don_vi_id);
      }

      if (params?.trang_thai) {
        query = query.eq('trang_thai', params.trang_thai);
      }

      if (params?.tu_ngay) {
        query = query.gte('created_at', params.tu_ngay);
      }

      if (params?.den_ngay) {
        query = query.lte('created_at', params.den_ngay);
      }

      // KHÔNG filter theo created_by - admin có thể xem tất cả

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ke khai list for admin:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getKeKhaiListForAdmin:', error);
      throw error;
    }
  }

  // Lấy danh sách kê khai cần duyệt cho admin (không filter theo created_by)
  async getKeKhaiForApprovalForAdmin(params?: KeKhaiSearchParams): Promise<DanhSachKeKhai[]> {
    try {
      let query = supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .in('trang_thai', ['submitted', 'processing', 'pending_payment'])
        .order('created_at', { ascending: false });

      if (params?.ma_ke_khai) {
        query = query.ilike('ma_ke_khai', `%${params.ma_ke_khai}%`);
      }

      if (params?.loai_ke_khai) {
        query = query.eq('loai_ke_khai', params.loai_ke_khai);
      }

      if (params?.dai_ly_id) {
        query = query.eq('dai_ly_id', params.dai_ly_id);
      }

      if (params?.don_vi_id) {
        query = query.eq('don_vi_id', params.don_vi_id);
      }

      if (params?.trang_thai) {
        query = query.eq('trang_thai', params.trang_thai);
      }

      if (params?.tu_ngay) {
        query = query.gte('created_at', params.tu_ngay);
      }

      if (params?.den_ngay) {
        query = query.lte('created_at', params.den_ngay);
      }

      // KHÔNG filter theo created_by - admin có thể xem tất cả

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ke khai for approval for admin:', error);
        throw error;
      }

      console.log('🔍 getKeKhaiForApprovalForAdmin result count:', data?.length || 0);
      console.log('🔍 getKeKhaiForApprovalForAdmin sample data:', data?.slice(0, 3).map(item => ({
        id: item.id,
        ma_ke_khai: item.ma_ke_khai,
        trang_thai: item.trang_thai,
        created_by: item.created_by
      })));

      return data || [];
    } catch (error) {
      console.error('Error in getKeKhaiForApprovalForAdmin:', error);
      throw error;
    }
  }
}

export const keKhaiService = new KeKhaiService();
export default keKhaiService;
