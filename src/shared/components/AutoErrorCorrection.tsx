import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Loader2, 
  RefreshCw,
  Zap,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import { vnpostTokenService } from '../services/api/vnpostTokenService';

interface AutoErrorCorrectionProps {
  className?: string;
  showDetails?: boolean;
  onStatusChange?: (status: AutoFixStatus) => void;
}

interface AutoFixStatus {
  enabled: boolean;
  inProgress: boolean;
  attempts: number;
  maxAttempts: number;
  lastAttemptTime: number;
  errorPatterns: Record<string, number>;
}

interface AutoFixEvent {
  type: 'started' | 'completed';
  success?: boolean;
  strategy?: string;
  error?: string;
  timestamp: number;
}

export const AutoErrorCorrection: React.FC<AutoErrorCorrectionProps> = ({
  className = '',
  showDetails = false,
  onStatusChange
}) => {
  const [status, setStatus] = useState<AutoFixStatus>({
    enabled: true,
    inProgress: false,
    attempts: 0,
    maxAttempts: 3,
    lastAttemptTime: 0,
    errorPatterns: {}
  });
  
  const [recentEvents, setRecentEvents] = useState<AutoFixEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load initial status
  useEffect(() => {
    const loadStatus = () => {
      const currentStatus = vnpostTokenService.getAutoFixStatus();
      setStatus(currentStatus);
      onStatusChange?.(currentStatus);
    };

    loadStatus();
    
    // Set up event listeners for auto-fix events
    const handleAutoFixStarted = (event: CustomEvent) => {
      const newEvent: AutoFixEvent = {
        type: 'started',
        timestamp: event.detail.timestamp
      };
      
      setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      loadStatus();
    };

    const handleAutoFixCompleted = (event: CustomEvent) => {
      const newEvent: AutoFixEvent = {
        type: 'completed',
        success: event.detail.success,
        strategy: event.detail.strategy,
        error: event.detail.error,
        timestamp: event.detail.timestamp
      };
      
      setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      loadStatus();
    };

    window.addEventListener('autoFixStarted', handleAutoFixStarted as EventListener);
    window.addEventListener('autoFixCompleted', handleAutoFixCompleted as EventListener);

    // Refresh status periodically
    const interval = setInterval(loadStatus, 5000);

    return () => {
      window.removeEventListener('autoFixStarted', handleAutoFixStarted as EventListener);
      window.removeEventListener('autoFixCompleted', handleAutoFixCompleted as EventListener);
      clearInterval(interval);
    };
  }, [onStatusChange]);

  const toggleAutoFix = () => {
    const newEnabled = !status.enabled;
    vnpostTokenService.setAutoFixEnabled(newEnabled);
    setStatus(prev => ({ ...prev, enabled: newEnabled }));
  };

  const resetAutoFix = () => {
    vnpostTokenService.resetAutoFixState();
    setStatus(prev => ({ 
      ...prev, 
      attempts: 0, 
      lastAttemptTime: 0, 
      errorPatterns: {} 
    }));
    setRecentEvents([]);
  };

  const getStatusColor = () => {
    if (!status.enabled) return 'text-gray-500';
    if (status.inProgress) return 'text-blue-500';
    if (status.attempts > 0) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!status.enabled) return <Shield className="h-4 w-4" />;
    if (status.inProgress) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (status.attempts > 0) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!status.enabled) return 'Tắt';
    if (status.inProgress) return 'Đang sửa lỗi...';
    if (status.attempts > 0) return `${status.attempts}/${status.maxAttempts} lần thử`;
    return 'Sẵn sàng';
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Chưa có';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN');
  };

  const getTotalErrors = () => {
    return Object.values(status.errorPatterns).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Tự động sửa lỗi
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getStatusText()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Xem chi tiết"
              >
                <TrendingUp className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={toggleAutoFix}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                status.enabled
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {status.enabled ? 'Bật' : 'Tắt'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {getTotalErrors()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Lỗi phát hiện
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {status.attempts}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Lần sửa
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTimestamp(status.lastAttemptTime)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Lần cuối
            </div>
          </div>
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Error Patterns */}
          {Object.keys(status.errorPatterns).length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Mẫu lỗi phát hiện
              </h4>
              <div className="space-y-2">
                {Object.entries(status.errorPatterns).map(([pattern, count]) => (
                  <div key={pattern} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {pattern.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events */}
          {recentEvents.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Hoạt động gần đây
              </h4>
              <div className="space-y-2">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'started' 
                        ? 'bg-blue-500' 
                        : event.success 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                    }`} />
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatTimestamp(event.timestamp)}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {event.type === 'started' 
                        ? 'Bắt đầu sửa lỗi' 
                        : event.success 
                          ? `Hoàn thành (${event.strategy})` 
                          : `Thất bại: ${event.error}`
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetAutoFix}
              className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Đặt lại trạng thái</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
