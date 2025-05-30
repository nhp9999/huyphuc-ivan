import React from 'react';
import { DanhSachKeKhai } from '../../../services/supabaseClient';
import { ApiSummary } from '../../../hooks/useKeKhai603Api';
import { 
  FileText, 
  Users, 
  List,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';

interface KeKhai603HeaderProps {
  keKhaiInfo: DanhSachKeKhai | null;
  inputMode: 'form' | 'list';
  setInputMode: (mode: 'form' | 'list') => void;
  apiSummary: ApiSummary;
}

export const KeKhai603Header: React.FC<KeKhai603HeaderProps> = ({
  keKhaiInfo,
  inputMode,
  setInputMode,
  apiSummary
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mã kê khai: <span className="font-medium">{keKhaiInfo.ma_ke_khai}</span>
                  {keKhaiInfo.ten_ke_khai && (
                    <span className="ml-2">• {keKhaiInfo.ten_ke_khai}</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Input Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Chế độ nhập:</span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setInputMode('form')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  inputMode === 'form'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Form</span>
              </button>
              <button
                onClick={() => setInputMode('list')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  inputMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Danh sách</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Declaration Info */}
      {keKhaiInfo && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Loại kê khai
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {keKhaiInfo.loai_ke_khai || 'Chưa xác định'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Đối tượng tham gia
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {keKhaiInfo.doi_tuong_tham_gia || 'Chưa xác định'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  keKhaiInfo.trang_thai === 'submitted' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-yellow-100 dark:bg-yellow-900'
                }`}>
                  {keKhaiInfo.trang_thai === 'submitted' ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Trạng thái
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {keKhaiInfo.trang_thai === 'submitted' ? 'Đã nộp' : 'Bản nháp'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
