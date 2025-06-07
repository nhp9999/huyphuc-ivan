import React from 'react';
import { DanhSachKeKhai } from '../../../../shared/services/api/supabaseClient';
import { ApiSummary } from '../../../hooks/useKeKhai603Api';
import {
  FileText,
  Info,
  RefreshCw,
  Settings,
  Loader2
} from 'lucide-react';

interface KeKhai603HeaderProps {
  keKhaiInfo: DanhSachKeKhai | null;
  apiSummary: ApiSummary;
  onRefreshToken?: () => void;
  onFixError?: () => void;
  fixErrorProcessing?: boolean;
  fixErrorPhase?: 'idle' | 'testing' | 'waiting' | 'refreshing';
  waitingCountdown?: number;
}

export const KeKhai603Header: React.FC<KeKhai603HeaderProps> = ({
  keKhaiInfo,
  apiSummary,
  onRefreshToken,
  onFixError,
  fixErrorProcessing = false,
  fixErrorPhase = 'idle',
  waitingCountdown = 0
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Kê khai 603 - BHYT Hộ gia đình
              </h1>
              {keKhaiInfo && (
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Mã kê khai: <span className="font-medium">{keKhaiInfo.ma_ke_khai}</span>
                  </span>
                  {keKhaiInfo.ten_ke_khai && (
                    <span>• {keKhaiInfo.ten_ke_khai}</span>
                  )}
                  <span className="flex items-center space-x-1">
                    <span>•</span>
                    <div className={`w-2 h-2 rounded-full ${
                      keKhaiInfo.trang_thai === 'submitted'
                        ? 'bg-blue-500'
                        : keKhaiInfo.trang_thai === 'pending_payment'
                        ? 'bg-orange-500'
                        : keKhaiInfo.trang_thai === 'processing'
                        ? 'bg-purple-500'
                        : keKhaiInfo.trang_thai === 'completed'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}></div>
                    <span className="font-medium">
                      {keKhaiInfo.trang_thai === 'submitted' ? 'Chờ duyệt' :
                       keKhaiInfo.trang_thai === 'pending_payment' ? 'Chờ thanh toán' :
                       keKhaiInfo.trang_thai === 'processing' ? 'Đang xử lý' :
                       keKhaiInfo.trang_thai === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Fix Error Button */}
            {onFixError && (
              <button
                onClick={onFixError}
                disabled={fixErrorProcessing}
                className="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                title="Sửa lỗi xác thực: Test token → Chờ 5 giây → Refresh token"
              >
                {fixErrorProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {fixErrorPhase === 'testing' && 'Đang test token...'}
                      {fixErrorPhase === 'waiting' && `Chờ ${waitingCountdown}s`}
                      {fixErrorPhase === 'refreshing' && 'Đang refresh token...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4" />
                    <span>Sửa lỗi</span>
                  </>
                )}
              </button>
            )}

            {/* Refresh Token Button */}
            {onRefreshToken && (
              <button
                onClick={onRefreshToken}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Làm mới token xác thực"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Làm mới token</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* API Summary */}
      {apiSummary.isLoaded && (
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Đã tải dữ liệu từ {apiSummary.source}
              {apiSummary.lastUpdated && (
                <span className="ml-2">• Cập nhật lúc {apiSummary.lastUpdated}</span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
