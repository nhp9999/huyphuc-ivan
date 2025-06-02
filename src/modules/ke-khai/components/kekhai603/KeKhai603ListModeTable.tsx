import React from 'react';
import { KeKhai603Participant } from '../../../hooks/useKeKhai603Participants';
import { Plus, Trash2, Loader2, Copy, Clipboard } from 'lucide-react';
import CSKCBSelector from '../CSKCBSelector';
import { DmCSKCB } from '../../../../shared/services/api/supabaseClient';
import { useExcelTable } from '../../hooks/useExcelTable';

interface KeKhai603ListModeTableProps {
  participants: KeKhai603Participant[];
  handleParticipantChange: (index: number, field: keyof KeKhai603Participant, value: string) => void;
  handleParticipantKeyPress: (e: React.KeyboardEvent, index: number) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (index: number) => void;
  searchLoading: boolean;
  savingData: boolean;
  tinhOptions?: Array<{ value: string; label: string }>; // Danh sách tỉnh
}

export const KeKhai603ListModeTable: React.FC<KeKhai603ListModeTableProps> = ({
  participants,
  handleParticipantChange,
  handleParticipantKeyPress,
  handleAddParticipant,
  handleRemoveParticipant,
  searchLoading,
  savingData,
  tinhOptions = []
}) => {
  // Define columns for Excel-like functionality
  const columns = [
    'maSoBHXH', 'hoTen', 'ngaySinh', 'gioiTinh', 'tinhKCB',
    'maBenhVien', 'sttHo', 'soThangDong', 'soTienDong'
  ];

  // Excel table functionality
  const {
    selectedCell,
    selectedRange,
    isCellSelected,
    isActiveCell,
    handleCellClick,
    handleMouseDown,
    handleMouseEnter,
    handleCopy,
    handlePaste,
    handleSelectAll
  } = useExcelTable({
    data: participants,
    onDataChange: handleParticipantChange,
    columns
  });
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Danh sách người tham gia BHYT
            </h2>

            {/* Excel-like toolbar */}
            <div className="flex items-center space-x-2 border-l border-gray-300 dark:border-gray-600 pl-4">
              <button
                onClick={handleCopy}
                disabled={!selectedCell && !selectedRange}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy (Ctrl+C)"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </button>

              <button
                onClick={handlePaste}
                disabled={!selectedCell}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Paste (Ctrl+V)"
              >
                <Clipboard className="w-3 h-3 mr-1" />
                Paste
              </button>

              <button
                onClick={handleSelectAll}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Select All (Ctrl+A)"
              >
                Select All
              </button>

              {/* Selection info */}
              {(selectedCell || selectedRange) && (
                <div className="text-xs text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-2">
                  {selectedRange ? (
                    `Selected: ${Math.abs(selectedRange.end.row - selectedRange.start.row) + 1} rows × ${Math.abs(selectedRange.end.col - selectedRange.start.col) + 1} cols`
                  ) : selectedCell ? (
                    `Cell: R${selectedCell.row + 1}C${selectedCell.col + 1}`
                  ) : null}
                </div>
              )}
            </div>
          </div>

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

      <div className="p-0">
        <div className="overflow-auto max-h-[600px] border border-gray-300 dark:border-gray-600">
          <table className="w-full min-w-max border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[50px]">STT</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[120px]">Mã BHXH</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[150px]">Họ tên</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[120px]">Ngày sinh</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[80px]">Giới tính</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[120px]">Tỉnh KCB</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[200px]">Nơi KCB</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[80px]">STT hộ</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[90px]">Số tháng</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[120px]">Số tiền</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 min-w-[80px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant.id || index} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 group">
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-1 text-center bg-gray-50 dark:bg-gray-700">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{index + 1}</span>
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 0) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 0, e)}
                    onMouseDown={(e) => handleMouseDown(index, 0, e)}
                    onMouseEnter={() => handleMouseEnter(index, 0)}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={participant.maSoBHXH}
                        onChange={(e) => handleParticipantChange(index, 'maSoBHXH', e.target.value)}
                        onKeyDown={(e) => handleParticipantKeyPress(e, index)}
                        className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white"
                        placeholder="Mã BHXH"
                      />
                      {searchLoading && (
                        <Loader2 className="absolute right-1 top-1/2 transform -translate-y-1/2 h-3 w-3 animate-spin text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 1) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 1, e)}
                    onMouseDown={(e) => handleMouseDown(index, 1, e)}
                    onMouseEnter={() => handleMouseEnter(index, 1)}
                  >
                    <input
                      type="text"
                      value={participant.hoTen}
                      onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
                      className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white"
                      placeholder="Họ tên"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 2) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 2, e)}
                    onMouseDown={(e) => handleMouseDown(index, 2, e)}
                    onMouseEnter={() => handleMouseEnter(index, 2)}
                  >
                    <input
                      type="date"
                      value={participant.ngaySinh}
                      onChange={(e) => handleParticipantChange(index, 'ngaySinh', e.target.value)}
                      className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 3) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 3, e)}
                    onMouseDown={(e) => handleMouseDown(index, 3, e)}
                    onMouseEnter={() => handleMouseEnter(index, 3)}
                  >
                    <select
                      value={participant.gioiTinh}
                      onChange={(e) => handleParticipantChange(index, 'gioiTinh', e.target.value)}
                      className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 4) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 4, e)}
                    onMouseDown={(e) => handleMouseDown(index, 4, e)}
                    onMouseEnter={() => handleMouseEnter(index, 4)}
                  >
                    <select
                      value={participant.tinhKCB}
                      onChange={(e) => {
                        handleParticipantChange(index, 'tinhKCB', e.target.value);
                        // Reset cơ sở KCB khi thay đổi tỉnh
                        handleParticipantChange(index, 'maBenhVien', '');
                        handleParticipantChange(index, 'tenBenhVien', '');
                        handleParticipantChange(index, 'noiDangKyKCB', '');
                      }}
                      className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white"
                    >
                      <option value="">Chọn tỉnh</option>
                      {tinhOptions.map((tinh) => (
                        <option key={tinh.value} value={tinh.value}>
                          {tinh.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 5) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 5, e)}
                    onMouseDown={(e) => handleMouseDown(index, 5, e)}
                    onMouseEnter={() => handleMouseEnter(index, 5)}
                  >
                    <div className="min-w-0">
                      <CSKCBSelector
                        value={participant.maBenhVien}
                        onChange={(value, cskcb) => {
                          handleParticipantChange(index, 'maBenhVien', value);
                          handleParticipantChange(index, 'tenBenhVien', cskcb?.ten || '');
                          handleParticipantChange(index, 'noiDangKyKCB', cskcb?.ten || '');
                          // Tự động cập nhật tỉnh KCB nếu chưa có
                          if (cskcb?.ma_tinh && !participant.tinhKCB) {
                            handleParticipantChange(index, 'tinhKCB', cskcb.ma_tinh);
                          }
                        }}
                        maTinh={participant.tinhKCB}
                        placeholder="Chọn cơ sở KCB"
                        className="w-full text-xs"
                      />
                    </div>
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 6) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 6, e)}
                    onMouseDown={(e) => handleMouseDown(index, 6, e)}
                    onMouseEnter={() => handleMouseEnter(index, 6)}
                  >
                    <select
                      value={participant.sttHo}
                      onChange={(e) => handleParticipantChange(index, 'sttHo', e.target.value)}
                      className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white"
                    >
                      <option value="">-</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 7) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 7, e)}
                    onMouseDown={(e) => handleMouseDown(index, 7, e)}
                    onMouseEnter={() => handleMouseEnter(index, 7)}
                  >
                    <select
                      value={participant.soThangDong}
                      onChange={(e) => handleParticipantChange(index, 'soThangDong', e.target.value)}
                      className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white"
                    >
                      <option value="">-</option>
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="12">12</option>
                    </select>
                  </td>
                  <td
                    className={`border border-gray-300 dark:border-gray-600 px-1 py-1 ${
                      isCellSelected(index, 8) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => handleCellClick(index, 8, e)}
                    onMouseDown={(e) => handleMouseDown(index, 8, e)}
                    onMouseEnter={() => handleMouseEnter(index, 8)}
                  >
                    <input
                      type="text"
                      value={participant.soTienDong}
                      readOnly
                      className="w-full px-2 py-1 text-xs border-0 bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-right"
                      placeholder="Tự động"
                    />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center">
                    <button
                      onClick={() => handleRemoveParticipant(index)}
                      disabled={savingData}
                      className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Xóa người tham gia"
                    >
                      <Trash2 className="h-3 w-3" />
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
