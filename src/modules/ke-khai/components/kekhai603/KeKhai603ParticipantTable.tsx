import React, { useState } from 'react';
import { KeKhai603Participant } from '../../hooks/useKeKhai603Participants';
import { formatCurrency, formatDate } from '../../../../shared/utils/formatters';

interface KeKhai603ParticipantTableProps {
  participants: KeKhai603Participant[];
  onParticipantChange: (index: number, field: keyof KeKhai603Participant, value: string) => void;
  onParticipantSearch: (index: number) => void;
  onSaveSingleParticipant: (index: number) => void;
  onRemoveParticipant: (index: number) => void;
  onAddParticipant: () => void;
  onBulkRemoveParticipants?: (indices: number[]) => void;
  participantSearchLoading: { [key: number]: boolean };
  savingData: boolean;
  doiTuongThamGia?: string;
}

export const KeKhai603ParticipantTable: React.FC<KeKhai603ParticipantTableProps> = ({
  participants,
  onParticipantChange,
  onParticipantSearch,
  onSaveSingleParticipant,
  onRemoveParticipant,
  onAddParticipant,
  onBulkRemoveParticipants,
  participantSearchLoading,
  savingData,
  doiTuongThamGia
}) => {
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Handle individual participant selection
  const handleParticipantSelection = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedParticipants);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedParticipants(newSelected);
    setSelectAll(newSelected.size === participants.length && participants.length > 0);
  };

  // Handle select all participants
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndices = participants.map((_, index) => index);
      setSelectedParticipants(new Set(allIndices));
    } else {
      setSelectedParticipants(new Set());
    }
    setSelectAll(checked);
  };

  // Handle key press for search
  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      onParticipantSearch(index);
    }
  };

  if (participants.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Danh sách người tham gia
            </h3>
            <button
              onClick={onAddParticipant}
              disabled={savingData}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm người tham gia</span>
            </button>
          </div>
        </div>
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-base">Chưa có người tham gia nào</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Nhấn "Thêm người tham gia" để bắt đầu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Danh sách người tham gia ({participants.length})
          </h3>
          <div className="flex items-center space-x-3">
            {selectedParticipants.size > 0 && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Đã chọn {selectedParticipants.size} người
                </span>
                {onBulkRemoveParticipants && (
                  <button
                    onClick={() => {
                      const indices = Array.from(selectedParticipants);
                      onBulkRemoveParticipants(indices);
                      setSelectedParticipants(new Set());
                      setSelectAll(false);
                    }}
                    disabled={savingData}
                    className="flex items-center justify-center space-x-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Xóa đã chọn</span>
                  </button>
                )}
              </>
            )}
            <button
              onClick={onAddParticipant}
              disabled={savingData}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm người tham gia</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse" style={{minWidth: '1800px'}}>
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '40px', minWidth: '40px'}}>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '50px', minWidth: '50px'}}>
                STT
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '150px', minWidth: '150px'}}>
                Họ tên
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                Mã số BHXH
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                CCCD
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                Ngày sinh
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                Giới tính
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                Số điện thoại
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                Số thẻ BHYT
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '200px', minWidth: '200px'}}>
                Nơi đăng ký KCB
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                Mức lương
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                Tiền đóng
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                Số tháng
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                STT hộ
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                Ngày biên lai
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {participants.map((participant, index) => (
              <tr key={participant.id || index} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '40px', minWidth: '40px'}}>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedParticipants.has(index)}
                    onChange={(e) => handleParticipantSelection(index, e.target.checked)}
                  />
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '50px', minWidth: '50px'}}>
                  {index + 1}
                </td>
                <td className="px-2 py-2 text-left text-xs border border-gray-300" style={{width: '150px', minWidth: '150px'}}>
                  <input
                    type="text"
                    value={participant.hoTen}
                    onChange={(e) => onParticipantChange(index, 'hoTen', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                    placeholder="Họ và tên"
                  />
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 font-mono whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                  <div className="relative">
                    <input
                      type="text"
                      value={participant.maSoBHXH}
                      onChange={(e) => onParticipantChange(index, 'maSoBHXH', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, index)}
                      className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded font-mono"
                      placeholder="01234567890"
                    />
                    <button
                      onClick={() => onParticipantSearch(index)}
                      disabled={participantSearchLoading[index]}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                      title="Tìm kiếm thông tin BHYT"
                    >
                      {participantSearchLoading[index] ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      ) : (
                        <span className="text-xs">🔍</span>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 font-mono whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                  <input
                    type="text"
                    value={participant.soCCCD}
                    onChange={(e) => onParticipantChange(index, 'soCCCD', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded font-mono"
                    placeholder="CCCD"
                  />
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                  <input
                    type="date"
                    value={participant.ngaySinh}
                    onChange={(e) => onParticipantChange(index, 'ngaySinh', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                  />
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                  <select
                    value={participant.gioiTinh}
                    onChange={(e) => onParticipantChange(index, 'gioiTinh', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                  <input
                    type="text"
                    value={participant.soDienThoai}
                    onChange={(e) => onParticipantChange(index, 'soDienThoai', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                    placeholder="Số điện thoại"
                  />
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 font-mono whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                  <input
                    type="text"
                    value={participant.soTheBHYT}
                    onChange={(e) => onParticipantChange(index, 'soTheBHYT', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded font-mono"
                    placeholder="Số thẻ BHYT"
                  />
                </td>
                <td className="px-2 py-2 text-left text-xs border border-gray-300" style={{width: '200px', minWidth: '200px'}}>
                  <div className="truncate" title={participant.noiDangKyKCB}>
                    {participant.noiDangKyKCB || ''}
                  </div>
                </td>
                <td className="px-2 py-2 text-right text-xs border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                  <input
                    type="text"
                    value={participant.mucLuong}
                    onChange={(e) => onParticipantChange(index, 'mucLuong', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded text-right"
                    placeholder="2,340,000"
                  />
                </td>
                <td className="px-2 py-2 text-right text-xs border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                  {participant.tienDong ? formatCurrency(participant.tienDong) : ''}
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                  <input
                    type="number"
                    value={participant.soThangDong}
                    onChange={(e) => onParticipantChange(index, 'soThangDong', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded text-center"
                    min="1"
                    max="12"
                  />
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                  <select
                    value={participant.sttHo || ''}
                    onChange={(e) => onParticipantChange(index, 'sttHo', e.target.value)}
                    disabled={!!(doiTuongThamGia && doiTuongThamGia.includes('DS'))}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded disabled:opacity-50"
                  >
                    <option value="">Chọn</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                  <input
                    type="date"
                    value={participant.ngayBienLai}
                    onChange={(e) => onParticipantChange(index, 'ngayBienLai', e.target.value)}
                    className="w-full px-1 py-1 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                  />
                </td>
                <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => onSaveSingleParticipant(index)}
                      disabled={savingData}
                      className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      title="Lưu"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemoveParticipant(index)}
                      disabled={savingData}
                      className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Xóa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
