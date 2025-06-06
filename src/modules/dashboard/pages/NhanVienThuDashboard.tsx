import React, { useState, useEffect } from 'react';
import {
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '../../auth/contexts/AuthContext';
import { useToast } from '../../../shared/hooks/useToast';
import StatsCard from '../../../shared/components/widgets/StatsCard';
import RecentActivity from '../../../shared/components/widgets/RecentActivity';
import TaskList from '../../../shared/components/widgets/TaskList';
import dashboardService, { UserDashboardData } from '../services/dashboardService';
// PaymentNotification is now handled globally in Layout.tsx
import { useNavigation } from '../../../core/contexts/NavigationContext';





const NhanVienThuDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentPage } = useNavigation();
  const { showToast } = useToast();

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading dashboard data for user:', user.id);

      const data = await dashboardService.getUserDashboardData(user.id);
      setDashboardData(data);
      console.log('✅ Dashboard data loaded:', data);

    } catch (err) {
      console.error('❌ Error loading dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu dashboard';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate stats data from real user data
  const statsData = dashboardData ? [
    {
      title: 'Kê khai của tôi',
      value: dashboardData.totalDeclarations.toString(),
      change: dashboardData.totalDeclarations > 0 ? { value: 12, type: 'increase' as const } : undefined,
      icon: FileText,
      color: '#3B82F6' // Blue
    },
    {
      title: 'Chờ thanh toán',
      value: dashboardData.pendingPaymentDeclarations.toString(),
      change: dashboardData.pendingPaymentDeclarations > 0 ? { value: 5, type: 'increase' as const } : undefined,
      icon: Clock,
      color: '#F59E0B' // Amber
    },
    {
      title: 'Đã hoàn thành',
      value: dashboardData.completedDeclarations.toString(),
      change: dashboardData.completedDeclarations > 0 ? { value: 8, type: 'increase' as const } : undefined,
      icon: CheckCircle,
      color: '#10B981' // Green
    },
    {
      title: 'Tổng doanh thu',
      value: dashboardService.formatCurrency(dashboardData.totalRevenue),
      change: dashboardData.totalRevenue > 0 ? { value: 15, type: 'increase' as const } : undefined,
      icon: DollarSign,
      color: '#8B5CF6' // Purple
    }
  ] : [];

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chào mừng, {user?.ho_ten || 'Nhân viên thu'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Đây là tổng quan về hoạt động kê khai và thanh toán của bạn.
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Không thể tải dữ liệu dashboard
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Notification is now handled globally in Layout.tsx */}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chào mừng, {user?.ho_ten || 'Nhân viên thu'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Đây là tổng quan về hoạt động kê khai và thanh toán của bạn.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentPage('declaration-categories')}
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-900 dark:text-blue-100">Tạo kê khai mới</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('declaration-history')}
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-900 dark:text-green-100">Lịch sử kê khai</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('my-payments')}
            className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-900 dark:text-amber-100">Thanh toán</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('bhyt-lookup')}
            className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-purple-900 dark:text-purple-100">Tra cứu BHYT</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <RecentActivity activities={dashboardData?.recentActivities || []} />

        {/* Personalized Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Công việc của tôi</h3>

          <div className="space-y-3">
            {dashboardData?.personalizedTasks && dashboardData.personalizedTasks.length > 0 ? (
              dashboardData.personalizedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Không có công việc nào cần làm</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hiệu suất cá nhân</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Tổng người tham gia
              </span>
            </div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {dashboardData?.totalParticipants || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                Doanh thu tháng này
              </span>
            </div>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {dashboardService.formatCurrency(dashboardData?.monthlyRevenue || 0)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Hoa hồng tích lũy
              </span>
            </div>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {dashboardService.formatCurrency(dashboardData?.commission || 0)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentPage('revenue-commission')}
            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Xem chi tiết doanh thu & hoa hồng →
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tình trạng kê khai của tôi
          </h3>
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-amber-600">
                  {dashboardData?.declarationsByStatus.pending_payment || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Đang xử lý</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.declarationsByStatus.processing || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {(dashboardData?.declarationsByStatus.completed || 0) + (dashboardData?.declarationsByStatus.paid || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Nháp</p>
                <p className="text-2xl font-bold text-gray-600">
                  {dashboardData?.declarationsByStatus.draft || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage('declaration-history')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Xem lịch sử kê khai
            </button>
            <button
              onClick={() => setCurrentPage('declaration-categories')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Tạo kê khai mới
            </button>
          </div>
        </div>
      </div>

      {/* Tips and Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lưu ý quan trọng
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Hạn chót thanh toán kê khai tháng này: 25/12/2024
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Vui lòng hoàn thành thanh toán trước hạn để tránh phát sinh phí
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Cập nhật API BHYT VNPost thành công
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Hệ thống đã được cập nhật với API mới nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NhanVienThuDashboard;
