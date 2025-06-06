import { supabase } from '../../../shared/services/api/supabaseClient';
import revenueService from '../../ke-khai/services/revenueService';

export interface UserDashboardData {
  totalDeclarations: number;
  pendingPaymentDeclarations: number;
  completedDeclarations: number;
  processingDeclarations: number;
  totalParticipants: number;
  totalRevenue: number;
  monthlyRevenue: number;
  commission: number;
  recentActivities: ActivityItem[];
  personalizedTasks: TaskItem[];
  declarationsByStatus: {
    draft: number;
    submitted: number;
    processing: number;
    pending_payment: number;
    paid: number;
    completed: number;
    rejected: number;
  };
}

export interface TaskItem {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
}

export interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: 'calendar' | 'users' | 'file' | 'tag' | 'file-text' | 'search' | 'check-circle' | 'database' | 'credit-card' | 'edit' | 'file-check' | 'x-circle' | 'alert-triangle' | 'user-plus' | 'server' | 'trending-up';
}

class DashboardService {
  // Lấy dữ liệu dashboard cho nhân viên thu
  async getUserDashboardData(userId: string): Promise<UserDashboardData> {
    try {
      console.log('📊 Getting dashboard data for user:', userId);

      // Validate user ID
      if (!userId || userId.trim().length === 0) {
        throw new Error('Invalid user ID provided');
      }

      // Fetch declarations data
      const { data: declarations, error: declarationsError } = await supabase
        .from('danh_sach_ke_khai')
        .select(`
          id,
          ma_ke_khai,
          ten_ke_khai,
          trang_thai,
          created_at,
          updated_at,
          danh_sach_nguoi_tham_gia (
            id,
            ho_ten,
            tien_dong_thuc_te,
            tien_dong
          )
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (declarationsError) {
        console.error('Error fetching declarations:', declarationsError);
        throw declarationsError;
      }

      // Calculate statistics
      const stats = this.calculateUserStats(declarations || []);

      // Get revenue data
      const revenueData = await revenueService.getRevenueOverview(userId);
      const commissionData = await revenueService.getCommissionData(userId);

      // Generate recent activities and personalized tasks
      const recentActivities = this.generateRecentActivities(declarations || []);
      const personalizedTasks = this.generatePersonalizedTasks(declarations || [], stats);

      return {
        totalDeclarations: stats.totalDeclarations,
        pendingPaymentDeclarations: stats.declarationsByStatus.pending_payment,
        completedDeclarations: stats.declarationsByStatus.completed + stats.declarationsByStatus.paid,
        processingDeclarations: stats.declarationsByStatus.processing,
        totalParticipants: stats.totalParticipants,
        totalRevenue: revenueData.totalRevenue,
        monthlyRevenue: revenueData.monthlyRevenue,
        commission: commissionData.totalCommission,
        recentActivities,
        personalizedTasks,
        declarationsByStatus: stats.declarationsByStatus
      };

    } catch (error) {
      console.error('Error in getUserDashboardData:', error);
      throw error;
    }
  }

  // Tính toán thống kê từ dữ liệu kê khai
  private calculateUserStats(declarations: any[]) {
    const stats = {
      totalDeclarations: declarations.length,
      totalParticipants: 0,
      declarationsByStatus: {
        draft: 0,
        submitted: 0,
        processing: 0,
        pending_payment: 0,
        paid: 0,
        completed: 0,
        rejected: 0
      }
    };

    declarations.forEach(declaration => {
      // Count by status
      const status = declaration.trang_thai;
      if (stats.declarationsByStatus.hasOwnProperty(status)) {
        stats.declarationsByStatus[status]++;
      }

      // Count participants
      if (declaration.danh_sach_nguoi_tham_gia && Array.isArray(declaration.danh_sach_nguoi_tham_gia)) {
        stats.totalParticipants += declaration.danh_sach_nguoi_tham_gia.length;
      }
    });

    return stats;
  }

  // Tạo danh sách hoạt động gần đây từ dữ liệu kê khai
  private generateRecentActivities(declarations: any[]): ActivityItem[] {
    const activities: ActivityItem[] = [];
    
    // Sort declarations by updated_at or created_at
    const sortedDeclarations = declarations
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5); // Take only the 5 most recent

    sortedDeclarations.forEach((declaration, index) => {
      const participantCount = declaration.danh_sach_nguoi_tham_gia?.length || 0;
      const timeAgo = this.getTimeAgo(declaration.updated_at || declaration.created_at);
      
      let title = '';
      let description = '';
      let icon: ActivityItem['icon'] = 'file-text';

      switch (declaration.trang_thai) {
        case 'draft':
          title = 'Tạo kê khai mới';
          description = `Kê khai ${declaration.ma_ke_khai} với ${participantCount} người tham gia`;
          icon = 'edit';
          break;
        case 'submitted':
          title = 'Nộp kê khai';
          description = `Đã nộp kê khai ${declaration.ma_ke_khai} chờ duyệt`;
          icon = 'file-check';
          break;
        case 'processing':
          title = 'Kê khai đang xử lý';
          description = `Kê khai ${declaration.ma_ke_khai} đang được xử lý`;
          icon = 'database';
          break;
        case 'pending_payment':
          title = 'Chờ thanh toán';
          description = `Kê khai ${declaration.ma_ke_khai} đã được duyệt, chờ thanh toán`;
          icon = 'credit-card';
          break;
        case 'paid':
          title = 'Đã thanh toán';
          description = `Hoàn thành thanh toán cho kê khai ${declaration.ma_ke_khai}`;
          icon = 'check-circle';
          break;
        case 'completed':
          title = 'Hoàn thành kê khai';
          description = `Kê khai ${declaration.ma_ke_khai} đã hoàn thành thành công`;
          icon = 'check-circle';
          break;
        case 'rejected':
          title = 'Kê khai bị từ chối';
          description = `Kê khai ${declaration.ma_ke_khai} cần chỉnh sửa`;
          icon = 'x-circle';
          break;
        default:
          title = 'Cập nhật kê khai';
          description = `Kê khai ${declaration.ma_ke_khai}`;
          icon = 'file-text';
      }

      activities.push({
        id: declaration.id,
        title,
        description,
        time: timeAgo,
        icon
      });
    });

    return activities;
  }

  // Tạo danh sách công việc cá nhân hóa dựa trên dữ liệu thực tế
  private generatePersonalizedTasks(declarations: any[], stats: any): TaskItem[] {
    const tasks: TaskItem[] = [];
    let taskId = 1;

    // Task cho kê khai chờ thanh toán
    if (stats.declarationsByStatus.pending_payment > 0) {
      tasks.push({
        id: taskId++,
        title: `Hoàn thành thanh toán cho ${stats.declarationsByStatus.pending_payment} kê khai`,
        priority: 'high',
        dueDate: 'Hôm nay',
        completed: false
      });
    }

    // Task cho kê khai đang xử lý
    if (stats.declarationsByStatus.processing > 0) {
      tasks.push({
        id: taskId++,
        title: `Theo dõi ${stats.declarationsByStatus.processing} kê khai đang xử lý`,
        priority: 'medium',
        dueDate: 'Trong tuần',
        completed: false
      });
    }

    // Task cho kê khai nháp
    if (stats.declarationsByStatus.draft > 0) {
      tasks.push({
        id: taskId++,
        title: `Hoàn thiện ${stats.declarationsByStatus.draft} kê khai nháp`,
        priority: 'medium',
        dueDate: 'Tuần tới',
        completed: false
      });
    }

    // Task cho kê khai bị từ chối
    if (stats.declarationsByStatus.rejected > 0) {
      tasks.push({
        id: taskId++,
        title: `Chỉnh sửa ${stats.declarationsByStatus.rejected} kê khai bị từ chối`,
        priority: 'high',
        dueDate: 'Ngày mai',
        completed: false
      });
    }

    // Task chung cho việc chuẩn bị kê khai tháng tới
    const now = new Date();
    const isEndOfMonth = now.getDate() > 20; // Sau ngày 20 của tháng
    if (isEndOfMonth) {
      tasks.push({
        id: taskId++,
        title: 'Chuẩn bị kê khai BHYT tháng tới',
        priority: 'low',
        dueDate: 'Cuối tháng',
        completed: false
      });
    }

    // Task kiểm tra doanh thu nếu có doanh thu
    if (stats.totalDeclarations > 0) {
      tasks.push({
        id: taskId++,
        title: 'Xem báo cáo doanh thu và hoa hồng',
        priority: 'low',
        dueDate: 'Tuần này',
        completed: false
      });
    }

    // Giới hạn số lượng task hiển thị
    return tasks.slice(0, 4);
  }

  // Helper để tính thời gian trước đây
  private getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    } else {
      return amount.toString();
    }
  }

  // Validate user ID
  private validateUserId(userId: string): boolean {
    return userId && userId.trim().length > 0 && !isNaN(parseInt(userId));
  }
}

export default new DashboardService();
