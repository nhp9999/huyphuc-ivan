import React from 'react';
import { CheckCircle, AlertTriangle, Clock, Database, Wifi, Shield } from 'lucide-react';

const SystemStatus: React.FC = () => {
  const systemServices = [
    {
      name: 'API BHYT VNPost',
      status: 'online',
      responseTime: '245ms',
      uptime: '99.9%',
      icon: Database
    },
    {
      name: 'Hệ thống kê khai',
      status: 'online',
      responseTime: '120ms',
      uptime: '99.8%',
      icon: Shield
    },
    {
      name: 'Cơ sở dữ liệu',
      status: 'online',
      responseTime: '85ms',
      uptime: '100%',
      icon: Database
    },
    {
      name: 'Dịch vụ thanh toán',
      status: 'maintenance',
      responseTime: 'N/A',
      uptime: '98.5%',
      icon: Wifi
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 dark:text-green-400';
      case 'maintenance':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'offline':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case 'maintenance':
        return <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />;
      case 'offline':
        return <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />;
      default:
        return <Clock size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Hoạt động';
      case 'maintenance':
        return 'Bảo trì';
      case 'offline':
        return 'Ngưng hoạt động';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Trạng thái hệ thống
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Cập nhật realtime
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {systemServices.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <service.icon size={20} className="text-gray-600 dark:text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {service.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(service.status)}
                  <span className={`text-xs font-medium ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {service.responseTime}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Uptime: {service.uptime}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Hệ thống hoạt động ổn định
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
              Tất cả dịch vụ chính đang hoạt động bình thường. Dịch vụ thanh toán đang trong quá trình bảo trì định kỳ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
