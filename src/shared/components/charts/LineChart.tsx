import React from 'react';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color: string;
    }[];
  };
  title?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  // Validate and filter data
  const validDatasets = data.datasets.filter(dataset =>
    dataset.data && dataset.data.length > 0 && dataset.data.every(val => typeof val === 'number' && !isNaN(val))
  );

  if (validDatasets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu hợp lệ để hiển thị</p>
      </div>
    );
  }

  const allValues = validDatasets.flatMap(dataset => dataset.data);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue;

  // We need to normalize the values for display
  const normalizeValue = (value: number) => {
    if (range === 0 || isNaN(value)) return 50; // If all values are the same, place in middle
    const normalized = 100 - ((value - minValue) / range * 80 + 10); // 10-90% of the height
    return isNaN(normalized) ? 50 : Math.max(10, Math.min(90, normalized));
  };

  return (
    <div className="h-full">
      {title && <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <div className="relative h-64">
        {/* Chart grid */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full border-t border-gray-200 dark:border-gray-700"
              style={{ height: '25%' }}
            />
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
          {data.labels.map((label, index) => (
            <div key={index} style={{ width: `${100 / data.labels.length}%` }}>
              {label}
            </div>
          ))}
        </div>

        {/* Lines and points */}
        {validDatasets.map((dataset, datasetIndex) => {
          const points = dataset.data.map((value, index) => {
            const xPercent = (index / (data.labels.length - 1)) * 100;
            const yPercent = normalizeValue(value);
            return {
              x: xPercent,
              y: yPercent,
              xString: `${xPercent}%`,
              yString: `${yPercent}%`,
              value
            };
          });

          return (
            <div key={datasetIndex} className="absolute inset-0">
              {/* Create line connections */}
              <svg className="absolute inset-0 w-full h-full" style={{ top: 0, left: 0 }}>
                <path
                  d={points.map((point, i) =>
                      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                    ).join(' ')}
                  fill="none"
                  stroke={dataset.color}
                  strokeWidth="2"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Points */}
              {points.map((point, pointIndex) => (
                <div
                  key={pointIndex}
                  className={`absolute w-3 h-3 rounded-full bg-white border-2 transform -translate-x-1.5 -translate-y-1.5 transition-all duration-700 ease-out`}
                  style={{
                    left: point.xString,
                    top: point.yString,
                    borderColor: dataset.color,
                  }}
                  title={`${dataset.label}: ${point.value}`}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-start mt-6 gap-4">
        {validDatasets.map((dataset, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: dataset.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineChart;