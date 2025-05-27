import React from 'react';

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="h-full">
      {title && <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`, 
                  backgroundColor: item.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;