import React from 'react';
import { AlertTriangle, RefreshCw, ExternalLink, Clock } from 'lucide-react';

interface TokenNotReadyAlertProps {
  className?: string;
  onRetry?: () => void;
  onInitializeToken?: () => void;
  isRetrying?: boolean;
}

export const TokenNotReadyAlert: React.FC<TokenNotReadyAlertProps> = ({
  className = '',
  onRetry,
  onInitializeToken,
  isRetrying = false
}) => {
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Không thể tra cứu thông tin BHYT
          </h3>
          
          <div className="text-sm text-red-700 dark:text-red-300 mb-4">
            <p className="mb-2">
              <strong>Nguyên nhân:</strong> Bearer token và timestamp chưa được tạo hoàn tất.
            </p>
            
            <div className="space-y-1">
              <p><strong>Các bước khắc phục:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Đảm bảo token đã được tạo và lưu trong database</li>
                <li>Kiểm tra trạng thái Token Service ở panel bên trên</li>
                <li>Nếu token chưa sẵn sàng, nhấn nút "Khởi tạo lại token"</li>
                <li>Chờ token được khởi tạo hoàn tất (màu xanh)</li>
                <li>Thử lại tra cứu BHYT</li>
              </ol>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800/50 border border-red-300 dark:border-red-700 rounded-md hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Đang thử lại...' : 'Thử lại'}
              </button>
            )}

            {onInitializeToken && (
              <button
                onClick={onInitializeToken}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-800/50 border border-blue-300 dark:border-blue-700 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <Clock className="h-4 w-4 mr-2" />
                Khởi tạo Token
              </button>
            )}

            <a
              href="https://ssm.vnpost.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              VNPost SSM
            </a>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-700 dark:text-yellow-300">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="space-y-1">
                  <li>• Token phải được tạo từ VNPost SSM trước khi sử dụng</li>
                  <li>• Timestamp phải đồng bộ với thời gian tạo token</li>
                  <li>• Kiểm tra Token Service panel để xem trạng thái chi tiết</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
