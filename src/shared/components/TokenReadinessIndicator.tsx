import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Clock,
  Shield
} from 'lucide-react';
import { vnpostTokenService } from '../services/api/vnpostTokenService';

interface TokenReadinessIndicatorProps {
  className?: string;
  autoInitialize?: boolean;
  onReadinessChange?: (isReady: boolean) => void;
}

interface TokenStatus {
  initialized: boolean;
  cached: boolean;
  expired: boolean;
  valid: boolean;
}

export const TokenReadinessIndicator: React.FC<TokenReadinessIndicatorProps> = ({
  className = '',
  autoInitialize = true,
  onReadinessChange
}) => {
  const [status, setStatus] = useState<TokenStatus>({
    initialized: false,
    cached: false,
    expired: true,
    valid: false
  });
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [lastInitialized, setLastInitialized] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load token status
  const loadTokenStatus = () => {
    const currentStatus = vnpostTokenService.getTokenStatus();
    setStatus(currentStatus);
    
    const isReady = currentStatus.initialized && currentStatus.cached && !currentStatus.expired && currentStatus.valid;
    onReadinessChange?.(isReady);
  };

  // Initialize token service
  const initializeToken = async () => {
    if (isInitializing) return;

    setIsInitializing(true);
    setError(null);

    try {
      console.log('🔑 Initializing token service...');
      await vnpostTokenService.initializeToken();
      setLastInitialized(new Date());
      console.log('✅ Token service initialized successfully');
    } catch (error) {
      console.error('❌ Token initialization failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsInitializing(false);
      loadTokenStatus();
    }
  };

  // Auto-initialize on mount
  useEffect(() => {
    loadTokenStatus();

    if (autoInitialize && !status.initialized) {
      initializeToken();
    }

    // Set up event listeners
    const handleTokenRefreshed = () => {
      console.log('🔄 Token refreshed event received');
      loadTokenStatus();
    };

    const handleTokenServiceInitialized = () => {
      console.log('✅ Token service initialized event received');
      setLastInitialized(new Date());
      loadTokenStatus();
    };

    window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    window.addEventListener('tokenServiceInitialized', handleTokenServiceInitialized);

    // Refresh status periodically
    const interval = setInterval(loadTokenStatus, 5000);

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      window.removeEventListener('tokenServiceInitialized', handleTokenServiceInitialized);
      clearInterval(interval);
    };
  }, [autoInitialize]);

  const getStatusColor = () => {
    if (isInitializing) return 'text-blue-500';
    if (error) return 'text-red-500';
    if (!status.initialized) return 'text-gray-500';
    if (status.expired || !status.valid) return 'text-orange-500';
    if (status.initialized && status.cached && status.valid) return 'text-green-500';
    return 'text-gray-500';
  };

  const getStatusIcon = () => {
    if (isInitializing) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (error) return <AlertCircle className="h-4 w-4" />;
    if (!status.initialized) return <Shield className="h-4 w-4" />;
    if (status.expired) return <Clock className="h-4 w-4" />;
    if (status.initialized && status.cached && status.valid) return <CheckCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isInitializing) return 'Đang khởi tạo token...';
    if (error) return 'Lỗi khởi tạo';
    if (!status.initialized) return 'Chưa khởi tạo';
    if (status.expired) return 'Token hết hạn';
    if (!status.valid) return 'Token không hợp lệ';
    if (status.initialized && status.cached && status.valid) return 'Sẵn sàng';
    return 'Không xác định';
  };

  const getDetailedStatus = () => {
    const details = [];
    if (status.initialized) details.push('✓ Đã khởi tạo');
    if (status.cached) details.push('✓ Đã cache');
    if (!status.expired) details.push('✓ Còn hiệu lực');
    if (status.valid) details.push('✓ Hợp lệ');
    
    return details.length > 0 ? details.join(' • ') : 'Chưa sẵn sàng';
  };

  const isReady = status.initialized && status.cached && !status.expired && status.valid;

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
                Token Service
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getStatusText()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 text-xs rounded-full font-medium ${
              isReady
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {isReady ? 'Ready' : 'Not Ready'}
            </div>
            
            <button
              onClick={initializeToken}
              disabled={isInitializing}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              title="Khởi tạo lại token"
            >
              <RefreshCw className={`h-4 w-4 ${isInitializing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Details */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Detailed Status */}
          <div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trạng thái chi tiết
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {getDetailedStatus()}
            </div>
          </div>

          {/* Last Initialized */}
          {lastInitialized && (
            <div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lần khởi tạo cuối
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {lastInitialized.toLocaleString('vi-VN')}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
                    Lỗi khởi tạo token
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning for not ready */}
          {!isReady && !isInitializing && !error && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Token chưa sẵn sàng
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">
                    API calls có thể thất bại. Vui lòng đảm bảo token đã được tạo và lưu trong database.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {isReady && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <div className="text-xs text-green-700 dark:text-green-300">
                  Token service sẵn sàng cho API calls
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
