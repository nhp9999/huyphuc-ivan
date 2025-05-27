import React from 'react';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import StatsCard from '../components/widgets/StatsCard';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import DonutChart from '../components/charts/DonutChart';
import RecentActivity from '../components/widgets/RecentActivity';
import TaskList from '../components/widgets/TaskList';

// Mock data for the dashboard
const statsData = [
  { 
    title: 'Total Customers', 
    value: '3,721', 
    change: { value: 12.5, type: 'increase' }, 
    icon: Users,
    color: '#8B5CF6' // Purple
  },
  { 
    title: 'Total Revenue', 
    value: '$48,352', 
    change: { value: 8.2, type: 'increase' }, 
    icon: DollarSign,
    color: '#3B82F6' // Blue
  },
  { 
    title: 'Total Orders', 
    value: '1,245', 
    change: { value: 3.1, type: 'decrease' }, 
    icon: ShoppingCart,
    color: '#F59E0B' // Amber
  },
  { 
    title: 'Conversion Rate', 
    value: '28.6%', 
    change: { value: 4.3, type: 'increase' }, 
    icon: Activity,
    color: '#10B981' // Green
  }
];

const barChartData = [
  { label: 'Jan', value: 420, color: '#3B82F6' },
  { label: 'Feb', value: 350, color: '#3B82F6' },
  { label: 'Mar', value: 580, color: '#3B82F6' },
  { label: 'Apr', value: 250, color: '#3B82F6' },
  { label: 'May', value: 800, color: '#3B82F6' },
  { label: 'Jun', value: 600, color: '#3B82F6' },
];

const lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'This Week',
      data: [28, 45, 35, 50, 32, 55, 70],
      color: '#3B82F6'
    },
    {
      label: 'Last Week',
      data: [20, 36, 40, 25, 45, 30, 60],
      color: '#94A3B8'
    }
  ]
};

const donutChartData = [
  { label: 'Electronics', value: 45, color: '#3B82F6' },
  { label: 'Clothing', value: 30, color: '#8B5CF6' },
  { label: 'Books', value: 15, color: '#F59E0B' },
  { label: 'Other', value: 10, color: '#10B981' }
];

const recentActivities = [
  {
    id: 1,
    title: 'New User Registration',
    description: 'Jane Smith created a new account',
    time: '10 minutes ago',
    icon: 'users'
  },
  {
    id: 2,
    title: 'Order Placed',
    description: 'Order #38492 was placed',
    time: '1 hour ago',
    icon: 'tag'
  },
  {
    id: 3,
    title: 'Document Updated',
    description: 'Sales report for Q2 2023 updated',
    time: '3 hours ago',
    icon: 'file'
  },
  {
    id: 4,
    title: 'Meeting Scheduled',
    description: 'Team meeting scheduled for tomorrow',
    time: '5 hours ago',
    icon: 'calendar'
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Prepare quarterly report',
    dueDate: 'Today',
    status: 'in-progress',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Client meeting with ABC Corp',
    dueDate: 'Tomorrow',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Review marketing strategy',
    dueDate: 'Jun 15, 2023',
    status: 'completed',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'Update user documentation',
    dueDate: 'Jun 10, 2023',
    status: 'overdue',
    priority: 'low'
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your business.
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
            title="Sales Overview" 
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <DonutChart 
            data={donutChartData}
            title="Sales by Category"
          />
        </div>
      </div>
      
      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <BarChart
            data={barChartData}
            title="Monthly Revenue"
          />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity activities={recentActivities} />
          <TaskList tasks={upcomingTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;