import React from 'react';
import { KeKhai603Participant } from '../../../hooks/useKeKhai603Participants';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import CSKCBSelector from '../CSKCBSelector';

interface KeKhai603ListModeTableProps {
  participants: KeKhai603Participant[];
  handleParticipantChange: (index: number, field: keyof KeKhai603Participant, value: string) => void;
  handleParticipantKeyPress: (e: React.KeyboardEvent, index: number) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (index: number) => void;
  searchLoading: boolean;
  savingData: boolean;
}

export const KeKhai603ListModeTable: React.FC<KeKhai603ListModeTableProps> = ({
  participants,
  handleParticipantChange,
  handleParticipantKeyPress,
  handleAddParticipant,
  handleRemoveParticipant,
  searchLoading,
  savingData
}) => {
  // Helper function để parse số tiền từ format Việt Nam
  const parseVietnameseNumber = (value: string): number => {
    if (!value) return 0;
    // Xử lý format số Việt Nam: "316.000" -> 316000
    const cleanAmount = value.replace(/[.,]/g, '');
    return parseFloat(cleanAmount) || 0;
  };

  // Tính tổng tiền
  const totalAmount = participants.reduce((sum, participant) => {
    const amount = parseVietnameseNumber(participant.soTienDong);
    return sum + amount;
  }, 0);

  // Format số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
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
          <table className="w-full min-w-max">
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
                    <div className="w-48 min-w-0">
                      <CSKCBSelector
                        value={participant.maBenhVien}
                        onChange={(value, cskcb) => {
                          handleParticipantChange(index, 'maBenhVien', value);
                          handleParticipantChange(index, 'tenBenhVien', cskcb?.ten || '');
                          handleParticipantChange(index, 'noiDangKyKCB', cskcb?.ten || '');
                          // Tự động cập nhật tỉnh KCB từ cơ sở KCB được chọn
                          if (cskcb?.ma_tinh) {
                            handleParticipantChange(index, 'tinhKCB', cskcb.ma_tinh);
                          }
                        }}
                        maTinh={participant.tinhKCB}
                        placeholder="Chọn cơ sở KCB"
                        className="w-full"
                      />
                    </div>
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
                    <div className="w-32 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-right font-medium">
                      {participant.soTienDong ?
                        formatCurrency(parseVietnameseNumber(participant.soTienDong)) :
                        'Tự động'
                      }
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleRemoveParticipant(index)}
                      disabled={savingData}
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

        {/* Hiển thị tổng tiền */}
        {participants.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Tổng số người tham gia: <span className="font-bold">{participants.length}</span>
                </span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Tổng số tiền: <span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>
                </span>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Tính toán tự động
              </div>
            </div>
          </div>
        )}

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
