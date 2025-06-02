import React from 'react';

interface DonutChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  // Validate data
  const validData = data.filter(item =>
    typeof item.value === 'number' && !isNaN(item.value) && item.value > 0
  );

  if (validData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu hợp lệ để hiển thị</p>
      </div>
    );
  }

  const total = validData.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercentage = 0;
  const segments = validData.map(item => {
    const percentage = (item.value / total) * 100;
    const startPercentage = cumulativePercentage;
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage,
      startPercentage,
      endPercentage: cumulativePercentage,
    };
  });

  return (
    <div className="h-full">
      {title && <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <div className="relative flex items-center justify-center h-64">
        <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
          {segments.map((segment, index) => {
            const startAngle = (segment.startPercentage / 100) * 360;
            const endAngle = (segment.endPercentage / 100) * 360;

            // Calculate the SVG arc path
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `L 50 50`
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={segment.color}
                className="transition-all duration-700 ease-out"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-800" />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{total.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: segment.color }}
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900 dark:text-white">{segment.label}</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                ({segment.percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;