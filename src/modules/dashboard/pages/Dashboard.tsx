import React from 'react';
import { FileText, CreditCard, TrendingUp, CheckCircle, Search, Users, DollarSign } from 'lucide-react';
import StatsCard from '../../../shared/components/widgets/StatsCard';
import BarChart from '../../../shared/components/charts/BarChart';
import LineChart from '../../../shared/components/charts/LineChart';
import DonutChart from '../../../shared/components/charts/DonutChart';
import RecentActivity from '../../../shared/components/widgets/RecentActivity';
import TaskList from '../../../shared/components/widgets/TaskList';
import QuickActions from '../../../shared/components/widgets/QuickActions';
import SystemStatus from '../../../shared/components/widgets/SystemStatus';
import QuickStats from '../../../shared/components/widgets/QuickStats';

// Mock data for BHYT/BHXH dashboard
const statsData = [
  {
    title: 'Tổng số kê khai',
    value: '1,247',
    change: { value: 15.3, type: 'increase' },
    icon: FileText,
    color: '#3B82F6' // Blue
  },
  {
    title: 'Tra cứu BHYT',
    value: '2,856',
    change: { value: 22.1, type: 'increase' },
    icon: CreditCard,
    color: '#10B981' // Green
  },
  {
    title: 'Tỷ lệ thành công',
    value: '94.2%',
    change: { value: 2.8, type: 'increase' },
    icon: CheckCircle,
    color: '#F59E0B' // Amber
  },
  {
    title: 'Doanh thu tháng',
    value: '125.8M',
    change: { value: 8.7, type: 'increase' },
    icon: DollarSign,
    color: '#8B5CF6' // Purple
  }
];

const barChartData = [
  { label: 'T1', value: 85, color: '#3B82F6' },
  { label: 'T2', value: 92, color: '#3B82F6' },
  { label: 'T3', value: 78, color: '#3B82F6' },
  { label: 'T4', value: 105, color: '#3B82F6' },
  { label: 'T5', value: 125, color: '#3B82F6' },
  { label: 'T6', value: 118, color: '#3B82F6' },
];

const lineChartData = {
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  datasets: [
    {
      label: 'Tuần này',
      data: [45, 52, 38, 67, 43, 58, 35],
      color: '#3B82F6'
    },
    {
      label: 'Tuần trước',
      data: [38, 45, 42, 55, 48, 52, 40],
      color: '#94A3B8'
    }
  ]
};

const donutChartData = [
  { label: 'Đăng ký mới', value: 45, color: '#3B82F6' },
  { label: 'Gia hạn thẻ', value: 30, color: '#10B981' },
  { label: 'Cấp lại thẻ', value: 15, color: '#F59E0B' },
  { label: 'Khác', value: 10, color: '#8B5CF6' }
];

const recentActivities = [
  {
    id: 1,
    title: 'Kê khai BHYT mới',
    description: 'Nguyễn Văn An đã tạo kê khai đăng ký BHYT',
    time: '15 phút trước',
    icon: 'file-text'
  },
  {
    id: 2,
    title: 'Tra cứu BHYT thành công',
    description: 'Tra cứu thông tin BHYT cho mã số 1234567890',
    time: '30 phút trước',
    icon: 'search'
  },
  {
    id: 3,
    title: 'Hồ sơ được duyệt',
    description: 'Hồ sơ kê khai #KK2024001 đã được phê duyệt',
    time: '1 giờ trước',
    icon: 'check-circle'
  },
  {
    id: 4,
    title: 'Cập nhật danh mục',
    description: 'Danh mục thủ tục kê khai đã được cập nhật',
    time: '2 giờ trước',
    icon: 'database'
  },
  {
    id: 5,
    title: 'Thanh toán hoàn tất',
    description: 'Thanh toán phí dịch vụ kê khai BHYT - 500,000 VNĐ',
    time: '3 giờ trước',
    icon: 'credit-card'
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Xử lý hồ sơ kê khai BHYT',
    dueDate: 'Hôm nay',
    status: 'in-progress',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Kiểm tra hồ sơ #KK2024002',
    dueDate: 'Ngày mai',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 3,
    title: 'Cập nhật danh mục thủ tục',
    dueDate: '15/12/2024',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'Nhắc nhở gia hạn thẻ BHYT',
    dueDate: '10/12/2024',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 5,
    title: 'Báo cáo doanh thu tháng',
    dueDate: '20/12/2024',
    status: 'pending',
    priority: 'low'
  }
];

// Quick stats data
const quickStatsData = {
  title: 'Thống kê nhanh',
  stats: [
    {
      label: 'Hôm nay',
      value: '47',
      change: { value: 12, type: 'increase' as const },
      color: '#3B82F6'
    },
    {
      label: 'Tuần này',
      value: '312',
      change: { value: 8, type: 'increase' as const },
      color: '#10B981'
    },
    {
      label: 'Tháng này',
      value: '1,247',
      change: { value: 15, type: 'increase' as const },
      color: '#F59E0B'
    },
    {
      label: 'Năm nay',
      value: '12,456',
      change: { value: 23, type: 'increase' as const },
      color: '#8B5CF6'
    }
  ]
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan hệ thống</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Chào mừng trở lại! Đây là tổng quan về dịch vụ kê khai BHYT và BHXH.
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <LineChart
            data={lineChartData}
            title="Thống kê tra cứu BHYT theo tuần"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <DonutChart
            data={donutChartData}
            title="Phân loại kê khai"
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <BarChart
            data={barChartData}
            title="Doanh thu theo tháng (triệu VNĐ)"
          />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity activities={recentActivities} />
          <TaskList tasks={upcomingTasks} />
        </div>
      </div>

      {/* Third Row - Quick Actions and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <SystemStatus />
      </div>

      {/* Fourth Row - Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickStats {...quickStatsData} />
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Thông báo hệ thống
            </h3>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Cập nhật mới nhất
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Cập nhật API BHYT VNPost
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  API tra cứu BHYT đã được cập nhật với tốc độ xử lý nhanh hơn 30%. Thời gian phản hồi trung bình giảm xuống còn 245ms.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Tính năng mới: Kê khai hàng loạt
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  Bây giờ bạn có thể tạo kê khai cho nhiều người cùng lúc, tiết kiệm thời gian xử lý lên đến 70%.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Bảo trì định kỳ
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  Hệ thống sẽ được bảo trì vào 2:00 AM - 4:00 AM ngày 15/12/2024 để nâng cấp hiệu suất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;