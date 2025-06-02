import React from 'react';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import { Search, FileText, CreditCard, ArrowRight, Hash } from 'lucide-react';

const QuickActions: React.FC = () => {
  const { setCurrentPage } = useNavigation();

  const quickActions = [
    {
      title: 'Tra cứu thông tin BHYT',
      description: 'Tra cứu thông tin thẻ BHYT nhanh chóng',
      icon: Search,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      page: 'bhyt-lookup' as const,
      count: '2,856'
    },
    {
      title: 'Tạo kê khai',
      description: 'Tạo kê khai BHYT và BHXH mới',
      icon: FileText,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      page: 'declaration-categories' as const,
      count: '1,247'
    },
    {
      title: 'Tra cứu mã số BHXH',
      description: 'Tra cứu thông tin mã số BHXH nhanh chóng',
      icon: Hash,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      page: 'bhxh-id-lookup' as const,
      count: '1,523'
    },
    {
      title: 'Lịch sử kê khai',
      description: 'Xem lịch sử các kê khai đã thực hiện',
      icon: CreditCard,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      page: 'declaration-history' as const,
      count: '892'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thao tác nhanh
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Truy cập nhanh các chức năng chính
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(action.page)}
            className={`group relative p-4 rounded-lg ${action.color} ${action.hoverColor} text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-left`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <action.icon size={20} className="text-white" />
                  <h4 className="font-medium text-white">{action.title}</h4>
                </div>
                <p className="text-sm text-white/80 mb-3">
                  {action.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">
                    {action.count}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Mẹo sử dụng
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Sử dụng phím tắt Ctrl+K để mở tìm kiếm nhanh hoặc nhấn vào các thẻ trên để truy cập trực tiếp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
