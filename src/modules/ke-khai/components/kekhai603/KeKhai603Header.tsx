import React from 'react';
import { DanhSachKeKhai } from '../../../../shared/services/api/supabaseClient';
import { ApiSummary } from '../../../hooks/useKeKhai603Api';
import {
  FileText,
  Users,
  List,
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
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}></div>
                    <span className="font-medium">
                      {keKhaiInfo.trang_thai === 'submitted' ? 'Đã nộp' : 'Bản nháp'}
                    </span>
                  </span>
                </div>
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
