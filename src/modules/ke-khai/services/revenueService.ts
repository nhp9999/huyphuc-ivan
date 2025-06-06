import { supabase } from '../../../shared/services/api/supabaseClient';

export interface RevenueData {
  totalRevenue: number;
  totalDeclarations: number;
  totalParticipants: number;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  dailyRevenue: number;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  declarations: number;
  participants: number;
}

export interface CommissionData {
  totalCommission: number;
  commissionRate: number;
  monthlyCommission: number;
  quarterlyCommission: number;
}

export interface RevenueFilters {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'monthly' | 'quarterly' | 'yearly';
}

class RevenueService {
  // Tỷ lệ hoa hồng mặc định (có thể cấu hình)
  private readonly DEFAULT_COMMISSION_RATE = 0.05; // 5%

  // Lấy dữ liệu doanh thu tổng quan cho nhân viên thu
  async getRevenueOverview(userId: string, filters?: RevenueFilters): Promise<RevenueData> {
    try {
      // Validate input
      if (!this.validateUserId(userId)) {
        throw new Error('Invalid user ID provided');
      }

      console.log('📊 Getting revenue overview for user:', userId, 'with filters:', filters);

      // Tính toán các khoảng thời gian chuẩn
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const endOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0, 23, 59, 59, 999);

      // Query chính để lấy tất cả dữ liệu (với hoặc không có filter)
      let mainQuery = supabase
        .from('danh_sach_ke_khai')
        .select(`
          id,
          created_at,
          trang_thai,
          danh_sach_nguoi_tham_gia (
            id,
            tien_dong_thuc_te,
            tien_dong
          )
        `)
        .eq('created_by', userId)
        .in('trang_thai', ['paid', 'completed', 'processing']); // Tính các kê khai đã thanh toán, hoàn thành, hoặc đang xử lý (có doanh thu thực tế)

      // Áp dụng bộ lọc thời gian cho query chính
      if (filters?.startDate) {
        mainQuery = mainQuery.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        // Đảm bảo endDate bao gồm cả ngày đó
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        mainQuery = mainQuery.lte('created_at', endDate.toISOString());
      }

      // Query riêng cho từng khoảng thời gian (không bị ảnh hưởng bởi filters)
      const [mainData, dailyData, monthlyData, quarterlyData] = await Promise.all([
        mainQuery,
        supabase
          .from('danh_sach_ke_khai')
          .select(`
            id,
            created_at,
            danh_sach_nguoi_tham_gia (
              id,
              tien_dong_thuc_te,
              tien_dong
            )
          `)
          .eq('created_by', userId)
          .in('trang_thai', ['paid', 'completed', 'processing'])
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString()),
        supabase
          .from('danh_sach_ke_khai')
          .select(`
            id,
            created_at,
            danh_sach_nguoi_tham_gia (
              id,
              tien_dong_thuc_te,
              tien_dong
            )
          `)
          .eq('created_by', userId)
          .in('trang_thai', ['paid', 'completed', 'processing'])
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString()),
        supabase
          .from('danh_sach_ke_khai')
          .select(`
            id,
            created_at,
            danh_sach_nguoi_tham_gia (
              id,
              tien_dong_thuc_te,
              tien_dong
            )
          `)
          .eq('created_by', userId)
          .in('trang_thai', ['paid', 'completed', 'processing'])
          .gte('created_at', startOfQuarter.toISOString())
          .lte('created_at', endOfQuarter.toISOString())
      ]);

      // Kiểm tra lỗi
      if (mainData.error) {
        console.error('Error fetching main revenue data:', mainData.error);
        throw mainData.error;
      }
      if (dailyData.error) {
        console.error('Error fetching daily revenue data:', dailyData.error);
        throw dailyData.error;
      }
      if (monthlyData.error) {
        console.error('Error fetching monthly revenue data:', monthlyData.error);
        throw monthlyData.error;
      }
      if (quarterlyData.error) {
        console.error('Error fetching quarterly revenue data:', quarterlyData.error);
        throw quarterlyData.error;
      }

      // Hàm helper để tính doanh thu từ data
      const calculateRevenue = (data: any[]) => {
        let revenue = 0;
        let participants = 0;

        data?.forEach(declaration => {
          if (declaration.danh_sach_nguoi_tham_gia && Array.isArray(declaration.danh_sach_nguoi_tham_gia)) {
            declaration.danh_sach_nguoi_tham_gia.forEach((participant: any) => {
              // Ưu tiên tien_dong_thuc_te, fallback về tien_dong, cuối cùng là 0
              const amount = this.safeParseNumber(participant.tien_dong_thuc_te) ||
                           this.safeParseNumber(participant.tien_dong) || 0;
              revenue += amount;
              participants++;
            });
          }
        });

        return { revenue, participants };
      };

      // Tính toán doanh thu cho từng khoảng thời gian
      const totalResult = calculateRevenue(mainData.data || []);
      const dailyResult = calculateRevenue(dailyData.data || []);
      const monthlyResult = calculateRevenue(monthlyData.data || []);
      const quarterlyResult = calculateRevenue(quarterlyData.data || []);

      console.log('📊 Revenue calculation results:', {
        total: totalResult,
        daily: dailyResult,
        monthly: monthlyResult,
        quarterly: quarterlyResult
      });

      return {
        totalRevenue: totalResult.revenue,
        totalDeclarations: mainData.data?.length || 0,
        totalParticipants: totalResult.participants,
        dailyRevenue: dailyResult.revenue,
        monthlyRevenue: monthlyResult.revenue,
        quarterlyRevenue: quarterlyResult.revenue
      };

    } catch (error) {
      console.error('Error in getRevenueOverview:', error);
      throw error;
    }
  }

  // Helper method để parse số an toàn
  private safeParseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Lấy doanh thu theo khoảng thời gian
  async getRevenueByPeriod(userId: string, startDate: string, endDate: string): Promise<RevenueByPeriod> {
    try {
      // Validate input
      if (!this.validateUserId(userId)) {
        throw new Error('Invalid user ID provided');
      }
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }
      // Đảm bảo endDate bao gồm cả ngày đó
      const adjustedEndDate = new Date(endDate);
      if (adjustedEndDate.getHours() === 0 && adjustedEndDate.getMinutes() === 0) {
        adjustedEndDate.setHours(23, 59, 59, 999);
      }

      const { data, error } = await supabase
        .from('danh_sach_ke_khai')
        .select(`
          id,
          created_at,
          danh_sach_nguoi_tham_gia (
            id,
            tien_dong_thuc_te,
            tien_dong
          )
        `)
        .eq('created_by', userId)
        .in('trang_thai', ['paid', 'completed', 'processing'])
        .gte('created_at', startDate)
        .lte('created_at', adjustedEndDate.toISOString());

      if (error) {
        console.error('Error fetching revenue by period:', error);
        throw error;
      }

      let revenue = 0;
      let declarations = data?.length || 0;
      let participants = 0;

      data?.forEach(declaration => {
        if (declaration.danh_sach_nguoi_tham_gia && Array.isArray(declaration.danh_sach_nguoi_tham_gia)) {
          declaration.danh_sach_nguoi_tham_gia.forEach((participant: any) => {
            // Sử dụng helper method để parse số an toàn
            const amount = this.safeParseNumber(participant.tien_dong_thuc_te) ||
                          this.safeParseNumber(participant.tien_dong) || 0;
            revenue += amount;
            participants++;
          });
        }
      });

      console.log(`📊 Revenue by period (${startDate} to ${endDate}):`, {
        revenue,
        declarations,
        participants,
        dataLength: data?.length
      });

      return {
        period: `${startDate} - ${endDate}`,
        revenue,
        declarations,
        participants
      };

    } catch (error) {
      console.error('Error in getRevenueByPeriod:', error);
      throw error;
    }
  }

  // Lấy dữ liệu doanh thu theo tháng (cho biểu đồ)
  async getMonthlyRevenueChart(userId: string, months: number = 6): Promise<RevenueByPeriod[]> {
    try {
      const results: RevenueByPeriod[] = [];
      const now = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

        const monthData = await this.getRevenueByPeriod(
          userId,
          monthStart.toISOString(),
          monthEnd.toISOString()
        );

        results.push({
          period: monthStart.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
          revenue: monthData.revenue,
          declarations: monthData.declarations,
          participants: monthData.participants
        });
      }

      return results;

    } catch (error) {
      console.error('Error in getMonthlyRevenueChart:', error);
      throw error;
    }
  }

  // Tính toán hoa hồng
  async getCommissionData(userId: string, filters?: RevenueFilters): Promise<CommissionData> {
    try {
      // Validate input
      if (!this.validateUserId(userId)) {
        throw new Error('Invalid user ID provided');
      }
      const revenueData = await this.getRevenueOverview(userId, filters);
      const commissionRate = this.DEFAULT_COMMISSION_RATE;

      return {
        totalCommission: revenueData.totalRevenue * commissionRate,
        commissionRate,
        monthlyCommission: revenueData.monthlyRevenue * commissionRate,
        quarterlyCommission: revenueData.quarterlyRevenue * commissionRate
      };

    } catch (error) {
      console.error('Error in getCommissionData:', error);
      throw error;
    }
  }

  // Lấy top kê khai có doanh thu cao nhất
  async getTopRevenueDeclarations(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('danh_sach_ke_khai')
        .select(`
          id,
          ma_ke_khai,
          ten_ke_khai,
          created_at,
          trang_thai,
          danh_sach_nguoi_tham_gia (
            id,
            tien_dong_thuc_te,
            tien_dong
          )
        `)
        .eq('created_by', userId)
        .in('trang_thai', ['paid', 'completed', 'processing'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching top revenue declarations:', error);
        throw error;
      }

      // Tính tổng doanh thu cho mỗi kê khai
      const declarationsWithRevenue = data?.map(declaration => {
        let totalRevenue = 0;
        let participantCount = 0;

        if (declaration.danh_sach_nguoi_tham_gia && Array.isArray(declaration.danh_sach_nguoi_tham_gia)) {
          declaration.danh_sach_nguoi_tham_gia.forEach((participant: any) => {
            // Sử dụng helper method để parse số an toàn
            const revenue = this.safeParseNumber(participant.tien_dong_thuc_te) ||
                           this.safeParseNumber(participant.tien_dong) || 0;
            totalRevenue += revenue;
            participantCount++;
          });
        }

        return {
          ...declaration,
          totalRevenue,
          participantCount
        };
      }) || [];

      // Lọc ra những kê khai có doanh thu > 0 và sắp xếp theo doanh thu giảm dần
      const filteredDeclarations = declarationsWithRevenue
        .filter(declaration => declaration.totalRevenue > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);

      console.log('📊 Top revenue declarations:', filteredDeclarations.map(d => ({
        ma_ke_khai: d.ma_ke_khai,
        totalRevenue: d.totalRevenue,
        participantCount: d.participantCount
      })));

      return filteredDeclarations;

    } catch (error) {
      console.error('Error in getTopRevenueDeclarations:', error);
      throw error;
    }
  }

  // Format số tiền VNĐ
  formatCurrency(amount: number): string {
    if (amount === 0) return '0 ₫';

    // Đảm bảo amount là số hợp lệ
    const validAmount = this.safeParseNumber(amount);

    try {
      // Sử dụng Intl.NumberFormat với locale vi-VN
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(validAmount);
    } catch (error) {
      // Fallback nếu Intl.NumberFormat không hoạt động
      return `${validAmount.toLocaleString('vi-VN')} ₫`;
    }
  }

  // Format số tiền ngắn gọn (triệu, tỷ)
  formatCurrencyShort(amount: number): string {
    const validAmount = this.safeParseNumber(amount);

    if (validAmount >= 1000000000) {
      return `${(validAmount / 1000000000).toFixed(1)} tỷ ₫`;
    } else if (validAmount >= 1000000) {
      return `${(validAmount / 1000000).toFixed(1)} triệu ₫`;
    } else if (validAmount >= 1000) {
      return `${(validAmount / 1000).toFixed(0)} nghìn ₫`;
    } else {
      return `${validAmount.toLocaleString('vi-VN')} ₫`;
    }
  }

  // Format phần trăm
  formatPercentage(rate: number): string {
    const validRate = this.safeParseNumber(rate);
    return `${(validRate * 100).toFixed(1)}%`;
  }

  // Validate user ID
  private validateUserId(userId: string): boolean {
    return userId && userId.trim().length > 0 && !isNaN(parseInt(userId));
  }

  // Debug method để kiểm tra dữ liệu thô
  async debugRevenueData(userId: string): Promise<any> {
    try {
      if (!this.validateUserId(userId)) {
        throw new Error('Invalid user ID provided');
      }

      console.log('🔍 Debug: Fetching raw revenue data for user:', userId);

      const { data, error } = await supabase
        .from('danh_sach_ke_khai')
        .select(`
          id,
          ma_ke_khai,
          ten_ke_khai,
          created_at,
          trang_thai,
          created_by,
          danh_sach_nguoi_tham_gia (
            id,
            ho_ten,
            tien_dong_thuc_te,
            tien_dong,
            muc_luong,
            ty_le_dong
          )
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('🔍 Debug: Error fetching data:', error);
        throw error;
      }

      console.log('🔍 Debug: Raw data:', data);

      // Phân tích dữ liệu
      const analysis = {
        totalDeclarations: data?.length || 0,
        declarationsByStatus: {},
        revenueByStatus: {},
        participantDetails: []
      };

      data?.forEach(declaration => {
        const status = declaration.trang_thai;

        // Đếm kê khai theo trạng thái
        if (!analysis.declarationsByStatus[status]) {
          analysis.declarationsByStatus[status] = 0;
        }
        analysis.declarationsByStatus[status]++;

        // Tính doanh thu theo trạng thái
        if (!analysis.revenueByStatus[status]) {
          analysis.revenueByStatus[status] = 0;
        }

        if (declaration.danh_sach_nguoi_tham_gia) {
          declaration.danh_sach_nguoi_tham_gia.forEach((participant: any) => {
            const tienDongThucTe = this.safeParseNumber(participant.tien_dong_thuc_te);
            const tienDong = this.safeParseNumber(participant.tien_dong);
            const finalAmount = tienDongThucTe || tienDong || 0;

            analysis.revenueByStatus[status] += finalAmount;

            analysis.participantDetails.push({
              declarationId: declaration.id,
              declarationCode: declaration.ma_ke_khai,
              declarationStatus: status,
              participantName: participant.ho_ten,
              tienDongThucTe,
              tienDong,
              finalAmount,
              mucLuong: participant.muc_luong,
              tyLeDong: participant.ty_le_dong
            });
          });
        }
      });

      console.log('🔍 Debug: Analysis:', analysis);
      return analysis;

    } catch (error) {
      console.error('🔍 Debug: Error in debugRevenueData:', error);
      throw error;
    }
  }
}

export default new RevenueService();
