import React from 'react';
import { Building2, MapPin, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { useUserDaiLyDonVi } from '../hooks/useUserDaiLyDonVi';

interface DaiLyDonViSelectorProps {
  onDaiLyChange?: (daiLyId: number | null) => void;
  onDonViChange?: (donViId: number | null) => void;
  selectedDonViId?: number | null;
}

const DaiLyDonViSelector: React.FC<DaiLyDonViSelectorProps> = ({
  onDaiLyChange,
  onDonViChange,
  selectedDonViId
}) => {
  const {
    userDaiLy,
    selectedDaiLy,
    donViList,
    loading,
    error,
    selectDaiLy,
    loadUserDaiLy
  } = useUserDaiLyDonVi();

  const handleDaiLySelect = async (daiLyId: string) => {
    const daiLy = userDaiLy.find(d => d.id.toString() === daiLyId);
    if (daiLy) {
      await selectDaiLy(daiLy);
      onDaiLyChange?.(daiLy.id);
      // Reset đơn vị khi thay đổi đại lý
      onDonViChange?.(null);
    }
  };

  const handleDonViSelect = (donViId: string) => {
    const donViIdNum = donViId ? parseInt(donViId) : null;
    onDonViChange?.(donViIdNum);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải thông tin đại lý...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
        <button
          onClick={loadUserDaiLy}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Container cho đại lý và đơn vị trên cùng một dòng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Thông tin đại lý */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Building2 className="inline h-4 w-4 mr-1" />
            Chọn đại lý
          </label>

          {userDaiLy.length === 0 ? (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Không tìm thấy đại lý nào cho tài khoản này</span>
              </div>
            </div>
          ) : (
            // Dropdown cho đại lý (bao gồm cả trường hợp chỉ có 1 đại lý)
            <select
              value={selectedDaiLy?.id || ''}
              onChange={(e) => handleDaiLySelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Chọn đại lý --</option>
              {userDaiLy.map((daiLy) => (
                <option key={daiLy.id} value={daiLy.id}>
                  {daiLy.ten} ({daiLy.ma})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Thông tin đơn vị */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="inline h-4 w-4 mr-1" />
            Chọn đơn vị
          </label>

          {!selectedDaiLy ? (
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Vui lòng chọn đại lý trước</span>
              </div>
            </div>
          ) : donViList.length === 0 ? (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Đại lý này chưa có đơn vị nào được liên kết</span>
              </div>
            </div>
          ) : (
            <select
              value={selectedDonViId || ''}
              onChange={(e) => handleDonViSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Chọn đơn vị --</option>
              {donViList.map((donVi) => (
                <option key={donVi.don_vi_id} value={donVi.don_vi_id}>
                  {donVi.ten_don_vi} ({donVi.ma_don_vi})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Thông tin bổ sung về số lượng đơn vị */}
      {selectedDaiLy && donViList.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
          <Users className="h-3 w-3" />
          <span>{donViList.length} đơn vị có sẵn</span>
        </div>
      )}
    </div>
  );
};

export default DaiLyDonViSelector;
