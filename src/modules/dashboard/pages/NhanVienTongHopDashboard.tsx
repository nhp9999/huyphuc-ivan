import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Clock, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react';
import { useAuth } from '../../auth/contexts/AuthContext';
import StatsCard from '../../../shared/components/widgets/StatsCard';
import RecentActivity from '../../../shared/components/widgets/RecentActivity';
import TaskList from '../../../shared/components/widgets/TaskList';
import BarChart from '../../../shared/components/charts/BarChart';
import { useNavigation } from '../../../core/contexts/NavigationContext';

// Mock data cho nhân viên tổng hợp
const nhanVienTongHopStatsData = [
  {
    title: 'Chờ duyệt',
    value: '47',
    change: { value: 12, type: 'increase' },
    icon: Clock,
    color: '#F59E0B' // Amber
  },
  {
    title: 'Đã duyệt hôm nay',
    value: '23',
    change: { value: 8, type: 'increase' },
    icon: CheckCircle,
    color: '#10B981' // Green
  },
  {
    title: 'Từ chối',
    value: '3',
    change: { value: 1, type: 'decrease' },
    icon: XCircle,
    color: '#EF4444' // Red
  },
  {
    title: 'Tổng xử lý',
    value: '156',
    change: { value: 15.3, type: 'increase' },
    icon: FileCheck,
    color: '#3B82F6' // Blue
  }
];

const approvalChartData = [
  { label: 'Đã duyệt', value: 156, color: '#10B981' },
  { label: 'Chờ duyệt', value: 47, color: '#F59E0B' },
  { label: 'Từ chối', value: 8, color: '#EF4444' },
  { label: 'Cần bổ sung', value: 12, color: '#8B5CF6' }
];

const nhanVienTongHopActivities = [
  {
    id: 1,
    title: 'Duyệt kê khai BHYT',
    description: 'Đã duyệt 15 kê khai BHYT từ nhân viên thu Nguyễn Văn An',
    time: '15 phút trước',
    icon: 'check-circle'
  },
  {
    id: 2,
    title: 'Từ chối kê khai',
    description: 'Từ chối kê khai #KK2024018 - thiếu giấy tờ chứng minh',
    time: '45 phút trước',
    icon: 'x-circle'
  },
  {
    id: 3,
    title: 'Yêu cầu bổ sung',
    description: 'Yêu cầu bổ sung thông tin cho kê khai #KK2024017',
    time: '1 giờ trước',
    icon: 'alert-triangle'
  },
  {
    id: 4,
    title: 'Hoàn thành duyệt batch',
    description: 'Đã xử lý xong 25 kê khai trong batch #B2024005',
    time: '2 giờ trước',
    icon: 'file-check'
  }
];

const nhanVienTongHopTasks = [
  {
    id: 1,
    title: 'Duyệt 12 kê khai BHYT mới từ sáng nay',
    priority: 'high' as const,
    dueDate: 'Hôm nay',
    completed: false
  },
  {
    id: 2,
    title: 'Kiểm tra và phê duyệt batch #B2024006',
    priority: 'high' as const,
    dueDate: 'Hôm nay',
    completed: false
  },
  {
    id: 3,
    title: 'Tổng hợp báo cáo tuần cho ban lãnh đạo',
    priority: 'medium' as const,
    dueDate: 'Ngày mai',
    completed: false
  },
  {
    id: 4,
    title: 'Rà soát các kê khai bị từ chối trong tuần',
    priority: 'low' as const,
    dueDate: '2 ngày nữa',
    completed: false
  }
];

const NhanVienTongHopDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentPage } = useNavigation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chào mừng, {user?.ho_ten || 'Nhân viên tổng hợp'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Tổng quan về công việc duyệt kê khai và quản lý hồ sơ.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {nhanVienTongHopStatsData.map((stat, index) => (
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
            onClick={() => setCurrentPage('ke-khai-management')}
            className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-900 dark:text-amber-100">Duyệt kê khai</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('payment-management')}
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-900 dark:text-green-100">Quản lý thanh toán</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('declaration-history')}
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-900 dark:text-blue-100">Xem lịch sử</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('bhyt-lookup')}
            className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-purple-900 dark:text-purple-100">Báo cáo</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approval Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <BarChart
            data={approvalChartData}
            title="Thống kê duyệt kê khai"
          />
        </div>
        
        {/* Recent Activities and Tasks */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity activities={nhanVienTongHopActivities} />
          <TaskList tasks={nhanVienTongHopTasks} />
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Kê khai cần duyệt gấp
          </h3>
          <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
            47 chờ duyệt
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">Kê khai #KK2024019</p>
                <p className="text-sm text-red-700 dark:text-red-300">Quá hạn 2 ngày - Nguyễn Thị Bình</p>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
              Duyệt ngay
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">Kê khai #KK2024020</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Hạn hôm nay - Trần Văn Cường</p>
              </div>
            </div>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
            Hiệu suất làm việc tuần này
          </h3>
          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tốc độ duyệt</p>
                <p className="text-2xl font-bold text-green-600">23/ngày</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tỷ lệ duyệt</p>
                <p className="text-2xl font-bold text-blue-600">94.2%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tỷ lệ từ chối</p>
                <p className="text-2xl font-bold text-red-600">3.6%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Nhân viên thu</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NhanVienTongHopDashboard;
