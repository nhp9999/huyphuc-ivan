import React from 'react';
import { BhytParticipant } from '../../hooks/useBhytParticipants';
import { Plus, Trash2, Loader2 } from 'lucide-react';

interface BhytListModeTableProps {
  participants: BhytParticipant[];
  handleParticipantChange: (index: number, field: keyof BhytParticipant, value: string) => void;
  handleParticipantKeyPress: (e: React.KeyboardEvent, index: number) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (index: number) => void;
  searchLoading: boolean;
  savingData: boolean;
}

export const BhytListModeTable: React.FC<BhytListModeTableProps> = ({
  participants,
  handleParticipantChange,
  handleParticipantKeyPress,
  handleAddParticipant,
  handleRemoveParticipant,
  searchLoading,
  savingData
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách người tham gia BHYT
          </h2>
          <button
            onClick={handleAddParticipant}
            disabled={savingData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm người</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">STT</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Mã BHXH</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Họ tên</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Ngày sinh</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Giới tính</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nơi KCB</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">STT hộ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Số tháng</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant.id || index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-900 dark:text-white">{index + 1}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={participant.maSoBHXH}
                        onChange={(e) => handleParticipantChange(index, 'maSoBHXH', e.target.value)}
                        onKeyDown={(e) => handleParticipantKeyPress(e, index)}
                        className="w-32 px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Mã BHXH"
                      />
                      {searchLoading && (
                        <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.hoTen}
                      onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
                      className="w-40 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Họ tên"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="date"
                      value={participant.ngaySinh}
                      onChange={(e) => handleParticipantChange(index, 'ngaySinh', e.target.value)}
                      className="w-36 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.gioiTinh}
                      onChange={(e) => handleParticipantChange(index, 'gioiTinh', e.target.value)}
                      className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.noiDangKyKCB}
                      onChange={(e) => handleParticipantChange(index, 'noiDangKyKCB', e.target.value)}
                      className="w-40 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Nơi KCB"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.sttHo}
                      onChange={(e) => handleParticipantChange(index, 'sttHo', e.target.value)}
                      className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">-</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.soThangDong}
                      onChange={(e) => handleParticipantChange(index, 'soThangDong', e.target.value)}
                      className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">-</option>
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="12">12</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.soTienDong}
                      readOnly
                      className="w-32 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      placeholder="Tự động"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleRemoveParticipant(index)}
                      disabled={participants.length <= 1 || savingData}
                      className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Xóa người tham gia"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {participants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có người tham gia nào. Nhấn "Thêm người" để bắt đầu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
