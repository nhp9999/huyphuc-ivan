import React, { useState } from 'react';
import { Bug, ChevronDown, ChevronUp, Code } from 'lucide-react';

interface DebugInfoProps {
  title: string;
  data: any;
  className?: string;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ title, data, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return String(obj);
    }
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Bug className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="border-t border-gray-300 dark:border-gray-600 p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Code className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Raw Response Data
            </span>
          </div>
          <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
            {formatJson(data)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;
