import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Award
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';
import StatsCard from '../../../shared/components/widgets/StatsCard';
import BarChart from '../../../shared/components/charts/BarChart';
import LineChart from '../../../shared/components/charts/LineChart';
import RevenueAccessControl from '../components/RevenueAccessControl';
import revenueService, { RevenueData, CommissionData, RevenueByPeriod } from '../services/revenueService';

interface DateFilter {
  startDate: string;
  endDate: string;
  period: 'daily' | 'monthly' | 'quarterly' | 'yearly';
}

const RevenueCommission: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // State management
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [commissionData, setCommissionData] = useState<CommissionData | null>(null);
  const [monthlyChart, setMonthlyChart] = useState<RevenueByPeriod[]>([]);
  const [topDeclarations, setTopDeclarations] = useState<any[]>([]);
  
  // Filter state
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: '',
    endDate: '',
    period: 'monthly'
  });

  // Load data on component mount
  useEffect(() => {
    if (user?.id) {
      loadRevenueData();
    }
  }, [user?.id, dateFilter]);

  const loadRevenueData = async () => {
    if (!user?.id) {
      console.warn('No user ID available for revenue data loading');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Loading revenue data for user:', user.id);

      // Prepare filters
      const filters = {
        startDate: dateFilter.startDate || undefined,
        endDate: dateFilter.endDate || undefined,
        period: dateFilter.period
      };

      console.log('🔄 Using filters:', filters);

      // Load all data in parallel
      const [revenue, commission, monthly, topDecl] = await Promise.all([
        revenueService.getRevenueOverview(user.id, filters),
        revenueService.getCommissionData(user.id, filters),
        revenueService.getMonthlyRevenueChart(user.id, 6),
        revenueService.getTopRevenueDeclarations(user.id, 5)
      ]);

      console.log('✅ Revenue data loaded successfully:', {
        revenue,
        commission,
        monthlyChart: monthly,
        topDeclarations: topDecl
      });

      setRevenueData(revenue);
      setCommissionData(commission);
      setMonthlyChart(monthly);
      setTopDeclarations(topDecl);

    } catch (error) {
      console.error('❌ Error loading revenue data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải dữ liệu doanh thu';
      showToast(errorMessage, 'error');

      // Set empty data to prevent UI errors
      setRevenueData({
        totalRevenue: 0,
        totalDeclarations: 0,
        totalParticipants: 0,
        monthlyRevenue: 0,
        quarterlyRevenue: 0,
        dailyRevenue: 0
      });
      setCommissionData({
        totalCommission: 0,
        commissionRate: 0.05,
        monthlyCommission: 0,
        quarterlyCommission: 0
      });
      setMonthlyChart([]);
      setTopDeclarations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadRevenueData();
  };

  const handleDateFilterChange = (field: keyof DateFilter, value: string) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Prepare chart data
  const monthlyChartData = {
    labels: monthlyChart.map(item => item.period),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: monthlyChart.map(item => item.revenue / 1000000), // Convert to millions
        color: '#3B82F6'
      }
    ]
  };

  const declarationChartData = monthlyChart.map(item => ({
    label: item.period,
    value: item.declarations,
    color: '#10B981'
  }));

  // Stats card data
  const statsData = [
    {
      title: 'Tổng doanh thu',
      value: revenueData ? revenueService.formatCurrency(revenueData.totalRevenue) : '0 ₫',
      change: revenueData?.totalRevenue > 0 ? { value: 12.5, type: 'increase' as const } : undefined,
      icon: DollarSign,
      color: '#3B82F6'
    },
    {
      title: 'Doanh thu tháng này',
      value: revenueData ? revenueService.formatCurrency(revenueData.monthlyRevenue) : '0 ₫',
      change: revenueData?.monthlyRevenue > 0 ? { value: 8.3, type: 'increase' as const } : undefined,
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      title: 'Tổng hoa hồng',
      value: commissionData ? revenueService.formatCurrency(commissionData.totalCommission) : '0 ₫',
      change: commissionData?.totalCommission > 0 ? { value: 15.2, type: 'increase' as const } : undefined,
      icon: Award,
      color: '#F59E0B'
    },
    {
      title: 'Số kê khai',
      value: revenueData?.totalDeclarations.toString() || '0',
      change: revenueData && revenueData.totalDeclarations > 0 ? { value: 5.7, type: 'increase' as const } : undefined,
      icon: FileText,
      color: '#8B5CF6'
    }
  ];

  if (loading) {
    return (
      <RevenueAccessControl>
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
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </RevenueAccessControl>
    );
  }

  return (
    <RevenueAccessControl>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Doanh thu & Hoa hồng
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi doanh thu và hoa hồng từ hoạt động kê khai BHYT (bao gồm các kê khai đang xử lý, đã thanh toán và hoàn thành)
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bộ lọc:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Từ ngày:</label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Đến ngày:</label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={dateFilter.period}
              onChange={(e) => handleDateFilterChange('period', e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="daily">Theo ngày</option>
              <option value="monthly">Theo tháng</option>
              <option value="quarterly">Theo quý</option>
              <option value="yearly">Theo năm</option>
            </select>
          </div>
        </div>
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

      {/* Commission Info */}
      {commissionData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin hoa hồng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {revenueService.formatPercentage(commissionData.commissionRate)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ hoa hồng</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {revenueService.formatCurrency(commissionData.monthlyCommission)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Hoa hồng tháng này</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {revenueService.formatCurrency(commissionData.quarterlyCommission)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Hoa hồng quý này</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <LineChart
            data={monthlyChartData}
            title="Xu hướng doanh thu 6 tháng (triệu VNĐ)"
          />
        </div>

        {/* Declarations Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <BarChart
            data={declarationChartData}
            title="Số lượng kê khai theo tháng"
          />
        </div>
      </div>

      {/* Top Revenue Declarations */}
      {topDeclarations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top kê khai có doanh thu cao nhất
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Mã kê khai
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Tên kê khai
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Số người tham gia
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Doanh thu
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Hoa hồng
                  </th>
                </tr>
              </thead>
              <tbody>
                {topDeclarations.map((declaration, index) => (
                  <tr key={declaration.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {declaration.ma_ke_khai}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {declaration.ten_ke_khai}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {declaration.participantCount} người
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      {revenueService.formatCurrency(declaration.totalRevenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-600 dark:text-amber-400">
                      {revenueService.formatCurrency(declaration.totalRevenue * (commissionData?.commissionRate || 0.05))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {revenueData && revenueData.totalRevenue === 0 && revenueData.totalDeclarations === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có dữ liệu doanh thu
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Bạn chưa có kê khai nào được thanh toán hoặc hoàn thành. Doanh thu sẽ được hiển thị khi có kê khai được duyệt và thanh toán.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/declaration-categories'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo kê khai mới
            </button>
            <button
              onClick={() => window.location.href = '/declaration-history'}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Xem lịch sử kê khai
            </button>
          </div>
        </div>
      )}

      {/* Summary Section - Only show if there's revenue data */}
      {revenueData && (revenueData.totalRevenue > 0 || revenueData.totalDeclarations > 0) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tổng kết hiệu suất
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Dựa trên dữ liệu từ {revenueData?.totalDeclarations || 0} kê khai với {revenueData?.totalParticipants || 0} người tham gia
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {revenueData ? revenueService.formatCurrency(revenueData.totalRevenue) : '0 ₫'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tổng doanh thu tích lũy
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </RevenueAccessControl>
  );
};

export default RevenueCommission;
