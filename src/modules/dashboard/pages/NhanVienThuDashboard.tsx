import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../auth/contexts/AuthContext';
import StatsCard from '../../../shared/components/widgets/StatsCard';
import RecentActivity from '../../../shared/components/widgets/RecentActivity';
import TaskList from '../../../shared/components/widgets/TaskList';
// PaymentNotification is now handled globally in Layout.tsx
import { useNavigation } from '../../../core/contexts/NavigationContext';

// Mock data cho nhân viên thu
const nhanVienThuStatsData = [
  {
    title: 'Kê khai của tôi',
    value: '23',
    change: { value: 3, type: 'increase' },
    icon: FileText,
    color: '#3B82F6' // Blue
  },
  {
    title: 'Chờ thanh toán',
    value: '5',
    change: { value: 1, type: 'increase' },
    icon: Clock,
    color: '#F59E0B' // Amber
  },
  {
    title: 'Đã hoàn thành',
    value: '18',
    change: { value: 2, type: 'increase' },
    icon: CheckCircle,
    color: '#10B981' // Green
  },
  {
    title: 'Tổng thanh toán',
    value: '12.5M',
    change: { value: 8.5, type: 'increase' },
    icon: DollarSign,
    color: '#8B5CF6' // Purple
  }
];

const nhanVienThuActivities = [
  {
    id: 1,
    title: 'Kê khai BHYT mới',
    description: 'Bạn đã tạo kê khai đăng ký BHYT cho 15 người',
    time: '30 phút trước',
    icon: 'file-text'
  },
  {
    id: 2,
    title: 'Thanh toán hoàn tất',
    description: 'Thanh toán kê khai #KK2024015 - 2,500,000 VNĐ',
    time: '2 giờ trước',
    icon: 'credit-card'
  },
  {
    id: 3,
    title: 'Kê khai được duyệt',
    description: 'Kê khai #KK2024014 đã được phê duyệt',
    time: '4 giờ trước',
    icon: 'check-circle'
  },
  {
    id: 4,
    title: 'Cập nhật thông tin',
    description: 'Cập nhật thông tin BHYT cho 3 người tham gia',
    time: '1 ngày trước',
    icon: 'edit'
  }
];

const nhanVienThuTasks = [
  {
    id: 1,
    title: 'Hoàn thành thanh toán kê khai #KK2024016',
    priority: 'high' as const,
    dueDate: 'Hôm nay',
    completed: false
  },
  {
    id: 2,
    title: 'Cập nhật thông tin BHYT cho nhóm ABC',
    priority: 'medium' as const,
    dueDate: 'Ngày mai',
    completed: false
  },
  {
    id: 3,
    title: 'Kiểm tra trạng thái kê khai #KK2024013',
    priority: 'low' as const,
    dueDate: '2 ngày nữa',
    completed: false
  },
  {
    id: 4,
    title: 'Chuẩn bị hồ sơ kê khai tháng tới',
    priority: 'medium' as const,
    dueDate: '1 tuần nữa',
    completed: false
  }
];

const NhanVienThuDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentPage } = useNavigation();

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
        {nhanVienThuStatsData.map((stat, index) => (
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
        <RecentActivity activities={nhanVienThuActivities} />
        
        {/* Task List */}
        <TaskList tasks={nhanVienThuTasks} />
      </div>

      {/* Status Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Tình trạng công việc
          </h3>
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Chờ xử lý</p>
                <p className="text-2xl font-bold text-amber-600">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Đang xử lý</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">18</p>
              </div>
            </div>
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
