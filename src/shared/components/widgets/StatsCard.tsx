import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>

          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  change.type === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {change.type === 'increase' ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">so với tháng trước</span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-opacity-10 dark:bg-opacity-20`}
          style={{ backgroundColor: color }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;