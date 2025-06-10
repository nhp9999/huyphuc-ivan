import React, { useState } from 'react';
import { KeKhai603Participant } from '../../hooks/useKeKhai603Participants';
import { ContextMenu, ContextMenuItem } from '../../../../shared/components/ui/ContextMenu';
import { formatCurrency } from '../../../../shared/utils/formatters';
import { calculateKeKhai603AmountThucTe } from '../../hooks/useKeKhai603FormData';

interface KeKhai603ParticipantTableProps {
  participants: KeKhai603Participant[];
  onParticipantSearch: (index: number) => void;
  onSaveSingleParticipant: (index: number) => void;
  onRemoveParticipant: (index: number) => void;
  onAddParticipant: () => void;
  onBulkRemoveParticipants?: (indices: number[]) => void;
  onEditParticipant?: (index: number) => void; // New prop for editing
  participantSearchLoading: { [key: number]: boolean };
  savingData: boolean;
  doiTuongThamGia?: string;
}

export const KeKhai603ParticipantTable: React.FC<KeKhai603ParticipantTableProps> = ({
  participants,
  onParticipantSearch,
  onSaveSingleParticipant,
  onRemoveParticipant,
  onAddParticipant,
  onBulkRemoveParticipants,
  onEditParticipant,
  participantSearchLoading,
  savingData,
  doiTuongThamGia
}) => {
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    participantIndex: number | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    participantIndex: null
  });

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      participantIndex: index
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      participantIndex: null
    });
  };

  // Context menu items
  const getContextMenuItems = (index: number): ContextMenuItem[] => {
    const participant = participants[index];
    if (!participant) return [];

    return [
      {
        id: 'edit',
        label: 'Chỉnh sửa',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        onClick: () => onEditParticipant?.(index),
        disabled: savingData || !onEditParticipant
      },
      {
        id: 'save',
        label: 'Lưu',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        ),
        onClick: () => onSaveSingleParticipant(index),
        disabled: savingData
      },
      {
        id: 'search',
        label: 'Tra cứu BHXH',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        onClick: () => onParticipantSearch(index),
        disabled: savingData || participantSearchLoading[index]
      },
      {
        id: 'delete',
        label: 'Xóa',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
        onClick: () => onRemoveParticipant(index),
        disabled: savingData,
        divider: true
      }
    ];
  };

  // Helper function to calculate and display payment amount
  const getDisplayedPaymentAmount = (participant: KeKhai603Participant): string => {
    // Debug logging for troubleshooting
    const debugInfo = {
      id: participant.id,
      hoTen: participant.hoTen,
      tienDongThucTe: participant.tienDongThucTe,
      tienDong: participant.tienDong,
      sttHo: participant.sttHo,
      soThangDong: participant.soThangDong,
      mucLuong: participant.mucLuong
    };

    // First, try to use pre-calculated values from database
    if (participant.tienDongThucTe && participant.tienDongThucTe > 0) {
      console.log(`💰 Using tienDongThucTe for ${participant.hoTen}:`, participant.tienDongThucTe);
      return formatCurrency(participant.tienDongThucTe);
    }
    if (participant.tienDong && participant.tienDong > 0) {
      console.log(`💰 Using tienDong for ${participant.hoTen}:`, participant.tienDong);
      return formatCurrency(participant.tienDong);
    }

    // If no pre-calculated values, calculate on-the-fly if we have required data
    if (participant.sttHo && participant.soThangDong) {
      const mucLuongNumber = participant.mucLuong ?
        parseFloat(participant.mucLuong.replace(/[.,]/g, '')) : 2340000;

      console.log(`🔄 Calculating on-the-fly for ${participant.hoTen}:`, {
        sttHo: participant.sttHo,
        soThangDong: participant.soThangDong,
        mucLuongNumber,
        doiTuongThamGia
      });

      // Calculate using the actual formula (prioritize tienDongThucTe for display)
      const calculatedAmount = calculateKeKhai603AmountThucTe(
        participant.sttHo,
        participant.soThangDong,
        mucLuongNumber,
        doiTuongThamGia
      );

      console.log(`✅ Calculated amount for ${participant.hoTen}:`, calculatedAmount);

      if (calculatedAmount > 0) {
        return formatCurrency(calculatedAmount);
      }
    }

    // Log when no calculation is possible
    console.log(`⚠️ No payment amount available for ${participant.hoTen}:`, debugInfo);
    return '';
  };

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



  if (participants.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Danh sách người tham gia
            </h3>
            <button
              onClick={onAddParticipant}
              disabled={savingData}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm người tham gia</span>
            </button>
          </div>
        </div>
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chưa có người tham gia nào</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Bắt đầu bằng cách thêm người tham gia đầu tiên vào danh sách kê khai
          </p>
          <button
            onClick={onAddParticipant}
            disabled={savingData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm người tham gia đầu tiên
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Danh sách người tham gia
            </h3>
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
              {participants.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {selectedParticipants.size > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
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
                      className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Xóa đã chọn</span>
                    </button>
                  )}
                </div>
              </>
            )}
            <button
              onClick={onAddParticipant}
              disabled={savingData}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
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
      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-900/50">
        <table className="min-w-full border-collapse" style={{minWidth: '1800px'}}>
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap shadow-sm" style={{width: '50px', minWidth: '50px'}}>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '60px', minWidth: '60px'}}>
                STT
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '160px', minWidth: '160px'}}>
                Họ và tên
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '130px', minWidth: '130px'}}>
                Mã số BHXH
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '130px', minWidth: '130px'}}>
                Số CCCD
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                Ngày sinh
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                Giới tính
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '110px', minWidth: '110px'}}>
                Số điện thoại
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '130px', minWidth: '130px'}}>
                Số thẻ BHYT
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '220px', minWidth: '220px'}}>
                Nơi đăng ký KCB
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '110px', minWidth: '110px'}}>
                Mức lương
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '110px', minWidth: '110px'}}>
                Tiền đóng
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                Số tháng
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                STT hộ
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                Ngày biên lai
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold border border-blue-500/30 whitespace-nowrap" style={{width: '150px', minWidth: '150px'}}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {participants.map((participant, index) => (
              <tr
                key={participant.id || index}
                className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer group"
                onContextMenu={(e) => handleContextMenu(e, index)}
              >
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '50px', minWidth: '50px'}}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    checked={selectedParticipants.has(index)}
                    onChange={(e) => handleParticipantSelection(index, e.target.checked)}
                  />
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100" style={{width: '60px', minWidth: '60px'}}>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold">
                    {index + 1}
                  </span>
                </td>
                <td className="px-3 py-3 text-left text-xs border border-gray-200 dark:border-gray-600" style={{width: '160px', minWidth: '160px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.hoTen || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 font-mono whitespace-nowrap" style={{width: '130px', minWidth: '130px'}}>
                  <div className="flex items-center justify-center">
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {participant.maSoBHXH || <span className="text-gray-400 italic">Chưa có</span>}
                    </span>
                    {participant.maSoBHXH && (
                      <button
                        onClick={() => onParticipantSearch(index)}
                        disabled={participantSearchLoading[index]}
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-colors duration-150"
                        title="Tìm kiếm thông tin BHYT"
                      >
                        {participantSearchLoading[index] ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 font-mono whitespace-nowrap" style={{width: '130px', minWidth: '130px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.soCCCD || <span className="text-gray-400 italic">Chưa có</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.ngaySinh ? new Date(participant.ngaySinh).toLocaleDateString('vi-VN') : <span className="text-gray-400 italic">Chưa có</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.gioiTinh || <span className="text-gray-400 italic">Chưa có</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '110px', minWidth: '110px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.soDienThoai || <span className="text-gray-400 italic">Chưa có</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 font-mono whitespace-nowrap" style={{width: '130px', minWidth: '130px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.soTheBHYT || <span className="text-gray-400 italic">Chưa có</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-left text-xs border border-gray-200 dark:border-gray-600" style={{width: '220px', minWidth: '220px'}}>
                  <div className="truncate text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-2 py-1.5 rounded-md" title={participant.noiDangKyKCB}>
                    {participant.noiDangKyKCB || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-right text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '110px', minWidth: '110px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium text-right">
                    {participant.mucLuong || <span className="text-gray-400 italic">Chưa có</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-right text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '110px', minWidth: '110px'}}>
                  <div className="font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1.5 rounded-md">
                    {getDisplayedPaymentAmount(participant) || <span className="text-gray-400">--</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.soThangDong || <span className="text-gray-400 italic">--</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.sttHo || <span className="text-gray-400 italic">--</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {participant.ngayBienLai ? new Date(participant.ngayBienLai).toLocaleDateString('vi-VN') : <span className="text-gray-400 italic">Chưa có</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs border border-gray-200 dark:border-gray-600 whitespace-nowrap" style={{width: '150px', minWidth: '150px'}}>
                  <div className="flex items-center justify-center space-x-1">
                    {/* Edit Button - Load data to form */}
                    {onEditParticipant && (
                      <button
                        onClick={() => onEditParticipant(index)}
                        disabled={savingData}
                        className="p-2 text-green-600 hover:text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all duration-200 group"
                        title="Sửa (tải lên form)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={() => onSaveSingleParticipant(index)}
                      disabled={savingData}
                      className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all duration-200 group"
                      title="Lưu"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onRemoveParticipant(index)}
                      disabled={savingData}
                      className="p-2 text-red-600 hover:text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all duration-200 group"
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

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={contextMenu.participantIndex !== null ? getContextMenuItems(contextMenu.participantIndex) : []}
        onClose={closeContextMenu}
      />
    </div>
  );
};
