import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp,
  Server,
  Shield,
  Database,
  Activity,
  BarChart3,
  Settings,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../auth/contexts/AuthContext';
import StatsCard from '../../../shared/components/widgets/StatsCard';
import BarChart from '../../../shared/components/charts/BarChart';
import LineChart from '../../../shared/components/charts/LineChart';
import DonutChart from '../../../shared/components/charts/DonutChart';
import RecentActivity from '../../../shared/components/widgets/RecentActivity';
import SystemStatus from '../../../shared/components/widgets/SystemStatus';
import { useNavigation } from '../../../core/contexts/NavigationContext';

// Mock data cho admin
const adminStatsData = [
  {
    title: 'Tổng người dùng',
    value: '1,247',
    change: { value: 15.3, type: 'increase' },
    icon: Users,
    color: '#3B82F6' // Blue
  },
  {
    title: 'Công ty/Đại lý',
    value: '156',
    change: { value: 8.2, type: 'increase' },
    icon: Building2,
    color: '#10B981' // Green
  },
  {
    title: 'Doanh thu tháng',
    value: '125.8M',
    change: { value: 12.5, type: 'increase' },
    icon: DollarSign,
    color: '#F59E0B' // Amber
  },
  {
    title: 'Hiệu suất hệ thống',
    value: '99.2%',
    change: { value: 0.8, type: 'increase' },
    icon: Activity,
    color: '#8B5CF6' // Purple
  }
];

const revenueChartData = [
  { label: 'Tháng 1', value: 85.2, color: '#3B82F6' },
  { label: 'Tháng 2', value: 92.1, color: '#10B981' },
  { label: 'Tháng 3', value: 78.5, color: '#F59E0B' },
  { label: 'Tháng 4', value: 105.3, color: '#8B5CF6' },
  { label: 'Tháng 5', value: 118.7, color: '#EF4444' },
  { label: 'Tháng 6', value: 125.8, color: '#06B6D4' }
];

const userTypeChartData = [
  { label: 'Nhân viên thu', value: 45, color: '#3B82F6' },
  { label: 'Nhân viên tổng hợp', value: 25, color: '#10B981' },
  { label: 'Admin', value: 15, color: '#F59E0B' },
  { label: 'Super Admin', value: 15, color: '#8B5CF6' }
];

const systemActivityData = {
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  datasets: [
    {
      label: 'Kê khai',
      data: [120, 135, 145, 128, 156, 142, 98],
      color: '#3B82F6'
    },
    {
      label: 'Tra cứu',
      data: [85, 92, 88, 95, 102, 89, 76],
      color: '#10B981'
    }
  ]
};

const adminActivities = [
  {
    id: 1,
    title: 'Người dùng mới đăng ký',
    description: '5 nhân viên thu mới được thêm vào hệ thống',
    time: '30 phút trước',
    icon: 'user-plus'
  },
  {
    id: 2,
    title: 'Cập nhật hệ thống',
    description: 'Triển khai phiên bản v2.1.5 thành công',
    time: '2 giờ trước',
    icon: 'server'
  },
  {
    id: 3,
    title: 'Báo cáo doanh thu',
    description: 'Doanh thu tháng 12 đạt 125.8M VNĐ (+12.5%)',
    time: '4 giờ trước',
    icon: 'trending-up'
  },
  {
    id: 4,
    title: 'Sao lưu dữ liệu',
    description: 'Hoàn thành sao lưu tự động lúc 02:00',
    time: '6 giờ trước',
    icon: 'database'
  }
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentPage } = useNavigation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chào mừng, {user?.ho_ten || 'Administrator'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Tổng quan quản trị hệ thống và theo dõi hoạt động tổng thể.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {adminStatsData.map((stat, index) => (
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
          Quản trị nhanh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentPage('nguoi-dung-management')}
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-900 dark:text-blue-100">Quản lý người dùng</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('cong-ty-management')}
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-900 dark:text-green-100">Quản lý công ty</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('phan-quyen-management')}
            className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-900 dark:text-amber-100">Phân quyền</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('settings')}
            className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-purple-900 dark:text-purple-100">Cài đặt hệ thống</span>
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <LineChart
            data={systemActivityData}
            title="Hoạt động hệ thống theo tuần"
          />
        </div>
        
        {/* User Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <DonutChart
            data={userTypeChartData}
            title="Phân bổ người dùng"
          />
        </div>
      </div>

      {/* Revenue and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <BarChart
            data={revenueChartData}
            title="Doanh thu 6 tháng (triệu VNĐ)"
          />
        </div>
        
        {/* Recent Activities and System Status */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity activities={adminActivities} />
          <SystemStatus />
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cảnh báo hệ thống
          </h3>
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">Dung lượng database</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Đã sử dụng 78% dung lượng</p>
              </div>
            </div>
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-2 py-1 rounded text-xs">
              Cảnh báo
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Server className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Trạng thái server</p>
                <p className="text-sm text-green-700 dark:text-green-300">Tất cả dịch vụ hoạt động bình thường</p>
              </div>
            </div>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
              Tốt
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            Chỉ số hiệu suất hệ thống
          </h3>
          <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Uptime</p>
                <p className="text-2xl font-bold text-blue-600">99.9%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tốc độ phản hồi</p>
                <p className="text-2xl font-bold text-green-600">245ms</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <UserCheck className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Người dùng online</p>
                <p className="text-2xl font-bold text-purple-600">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Truy vấn/giây</p>
                <p className="text-2xl font-bold text-amber-600">1,247</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
