import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuickStatsProps {
  title: string;
  stats: {
    label: string;
    value: string;
    change?: {
      value: number;
      type: 'increase' | 'decrease' | 'neutral';
    };
    color: string;
  }[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ title, stats }) => {
  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <TrendingUp size={12} className="text-green-500" />;
      case 'decrease':
        return <TrendingDown size={12} className="text-red-500" />;
      case 'neutral':
        return <Minus size={12} className="text-gray-500" />;
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: stat.color }}
              ></div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {stat.label}
            </div>
            
            {stat.change && (
              <div className={`flex items-center justify-center space-x-1 text-xs ${getChangeColor(stat.change.type)}`}>
                {getChangeIcon(stat.change.type)}
                <span>{stat.change.value}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
