import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KeKhai603Participant } from '../../../hooks/useKeKhai603Participants';
import { Plus, Trash2, Search, Loader2, Save } from 'lucide-react';
import { tinhService, TinhOption } from '../../../../shared/services/location/tinhService';
import { huyenService, HuyenOption } from '../../../../shared/services/location/huyenService';
import { xaService, XaOption } from '../../../../shared/services/location/xaService';
import { cskcbService, DmCSKCB } from '../../../../shared/services/cskcbService';
import styles from './KeKhai603ParticipantTable.module.css';

interface KeKhai603ParticipantTableProps {
  participants: KeKhai603Participant[];
  handleParticipantChange: (index: number, field: keyof KeKhai603Participant, value: string) => void;
  handleParticipantKeyPress: (e: React.KeyboardEvent, index: number) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (index: number) => void;
  handleSaveSingleParticipant: (index: number) => Promise<void>;
  participantSearchLoading: { [key: number]: boolean };
  savingData: boolean;
}

export const KeKhai603ParticipantTable: React.FC<KeKhai603ParticipantTableProps> = ({
  participants,
  handleParticipantChange,
  handleParticipantKeyPress,
  handleAddParticipant,
  handleRemoveParticipant,
  handleSaveSingleParticipant,
  participantSearchLoading,
  savingData
}) => {
  // State for location data
  const [tinhOptions, setTinhOptions] = useState<TinhOption[]>([]);
  const [huyenOptions, setHuyenOptions] = useState<{ [key: string]: HuyenOption[] }>({});
  const [xaOptions, setXaOptions] = useState<{ [key: string]: XaOption[] }>({});
  const [cskcbOptions, setCSKCBOptions] = useState<DmCSKCB[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingCSKCB, setLoadingCSKCB] = useState(false);

  // Track loading states to prevent duplicate API calls
  const [loadingHuyen, setLoadingHuyen] = useState<{ [key: string]: boolean }>({});
  const [loadingXa, setLoadingXa] = useState<{ [key: string]: boolean }>({});

  // Refs for debouncing
  const huyenTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const xaTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Load province data and CSKCB data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingLocation(true);
        setLoadingCSKCB(true);

        // Load provinces and CSKCB in parallel
        const [tinhOptions, cskcbList] = await Promise.all([
          tinhService.getTinhOptions(),
          cskcbService.getCSKCBList({ trang_thai: 'active', limit: 500 })
        ]);

        setTinhOptions(tinhOptions);
        setCSKCBOptions(cskcbList);
        console.log(`Loaded ${cskcbList.length} CSKCB options`);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoadingLocation(false);
        setLoadingCSKCB(false);
      }
    };

    loadInitialData();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear all huyen timeouts
      Object.values(huyenTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });

      // Clear all xa timeouts
      Object.values(xaTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Load district data when province changes for any participant (with debounce)
  const loadHuyenData = useCallback((maTinh: string) => {
    if (!maTinh || huyenOptions[maTinh] || loadingHuyen[maTinh]) return; // Already loaded or loading

    // Clear existing timeout
    if (huyenTimeoutRef.current[maTinh]) {
      clearTimeout(huyenTimeoutRef.current[maTinh]);
    }

    // Set new timeout
    huyenTimeoutRef.current[maTinh] = setTimeout(async () => {
      try {
        setLoadingHuyen(prev => ({ ...prev, [maTinh]: true }));
        const options = await huyenService.getHuyenOptionsByTinh(maTinh);
        setHuyenOptions(prev => ({ ...prev, [maTinh]: options }));
      } catch (error) {
        console.error('Error loading district data:', error);
      } finally {
        setLoadingHuyen(prev => ({ ...prev, [maTinh]: false }));
        delete huyenTimeoutRef.current[maTinh];
      }
    }, 100); // 100ms debounce
  }, [huyenOptions, loadingHuyen]);

  // Load ward data when district changes for any participant (with debounce)
  const loadXaData = useCallback((maHuyen: string, maTinh: string) => {
    const key = `${maTinh}-${maHuyen}`;
    if (!maHuyen || !maTinh || xaOptions[key] || loadingXa[key]) return; // Already loaded or loading

    // Clear existing timeout
    if (xaTimeoutRef.current[key]) {
      clearTimeout(xaTimeoutRef.current[key]);
    }

    // Set new timeout
    xaTimeoutRef.current[key] = setTimeout(async () => {
      try {
        setLoadingXa(prev => ({ ...prev, [key]: true }));
        const options = await xaService.getXaOptionsByHuyen(maHuyen, maTinh);
        setXaOptions(prev => ({ ...prev, [key]: options }));
      } catch (error) {
        console.error('Error loading ward data:', error);
      } finally {
        setLoadingXa(prev => ({ ...prev, [key]: false }));
        delete xaTimeoutRef.current[key];
      }
    }, 100); // 100ms debounce
  }, [xaOptions, loadingXa]);

  // Handle province change
  const handleTinhChange = (index: number, maTinh: string) => {
    handleParticipantChange(index, 'maTinhNkq', maTinh);
    // Reset district and ward when province changes
    handleParticipantChange(index, 'maHuyenNkq', '');
    handleParticipantChange(index, 'maXaNkq', '');
    // Load districts for this province
    if (maTinh) {
      loadHuyenData(maTinh);
    }
  };

  // Handle district change
  const handleHuyenChange = (index: number, maHuyen: string) => {
    const participant = participants[index];
    handleParticipantChange(index, 'maHuyenNkq', maHuyen);
    // Reset ward when district changes
    handleParticipantChange(index, 'maXaNkq', '');
    // Load wards for this district
    if (maHuyen && participant.maTinhNkq) {
      loadXaData(maHuyen, participant.maTinhNkq);
    }
  };



  // Auto-load districts and wards for existing participants
  useEffect(() => {
    participants.forEach((participant, index) => {
      // Load districts if province is selected but districts not loaded
      if (participant.maTinhNkq && !huyenOptions[participant.maTinhNkq]) {
        loadHuyenData(participant.maTinhNkq);
      }

      // Load wards if both province and district are selected but wards not loaded
      if (participant.maTinhNkq && participant.maHuyenNkq) {
        const key = `${participant.maTinhNkq}-${participant.maHuyenNkq}`;
        if (!xaOptions[key]) {
          loadXaData(participant.maHuyenNkq, participant.maTinhNkq);
        }
      }
    });
  }, [participants]); // Remove huyenOptions and xaOptions from dependencies to prevent infinite loop
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nhập danh sách người tham gia BHYT
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
          <table className={`w-full min-w-max ${styles.participantTable}`}>
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[40px] min-w-[40px] max-w-[40px]">STT</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[100px] min-w-[100px] max-w-[100px]">Mã BHXH</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[180px] min-w-[180px] max-w-[180px]">Họ tên</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[90px] min-w-[90px] max-w-[90px]">Ngày sinh</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[65px] min-w-[65px] max-w-[65px]">Giới tính</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[110px] min-w-[110px] max-w-[110px]">Số ĐT</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[130px] min-w-[130px] max-w-[130px]">Số thẻ BHYT</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[70px] min-w-[70px] max-w-[70px]">Dân tộc</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[280px] min-w-[280px] max-w-[280px]">Nơi đăng ký KCB</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[100px] min-w-[100px] max-w-[100px]">Mức lương</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[80px] min-w-[80px] max-w-[80px]">Tỷ lệ đóng</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[70px] min-w-[70px] max-w-[70px]">STT hộ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[80px] min-w-[80px] max-w-[80px]">Số tháng</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[120px] min-w-[120px] max-w-[120px]">Số tiền</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[130px] min-w-[130px] max-w-[130px]">Từ ngày thẻ cũ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[130px] min-w-[130px] max-w-[130px]">Đến ngày thẻ cũ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[130px] min-w-[130px] max-w-[130px]">Ngày biên lai</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[120px] min-w-[120px] max-w-[120px]">Tỉnh NKQ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[120px] min-w-[120px] max-w-[120px]">Huyện NKQ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[120px] min-w-[120px] max-w-[120px]">Xã NKQ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[200px] min-w-[200px] max-w-[200px]">Nơi nhận hồ sơ</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-[90px] min-w-[90px] max-w-[90px]">Thao tác</th>
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
                        value={participant.maSoBHXH || ''}
                        onChange={(e) => handleParticipantChange(index, 'maSoBHXH', e.target.value)}
                        onKeyDown={(e) => handleParticipantKeyPress(e, index)}
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Mã BHXH (Enter để tìm)"
                      />
                      {participantSearchLoading[index] && (
                        <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.hoTen || ''}
                      onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Họ tên"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type={participant.ngaySinh && participant.ngaySinh.includes('-') && participant.ngaySinh.length === 10 ? "date" : "text"}
                      value={participant.ngaySinh || ''}
                      onChange={(e) => handleParticipantChange(index, 'ngaySinh', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ngày sinh (dd/mm/yyyy hoặc yyyy)"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.gioiTinh || 'Nam'}
                      onChange={(e) => handleParticipantChange(index, 'gioiTinh', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.soDienThoai || ''}
                      onChange={(e) => handleParticipantChange(index, 'soDienThoai', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Số điện thoại"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.soTheBHYT || ''}
                      onChange={(e) => handleParticipantChange(index, 'soTheBHYT', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Số thẻ BHYT"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.danToc || ''}
                      onChange={(e) => handleParticipantChange(index, 'danToc', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Dân tộc"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.maBenhVien || ''}
                      onChange={(e) => {
                        const selectedCSKCB = cskcbOptions.find(cskcb => cskcb.value === e.target.value);
                        handleParticipantChange(index, 'maBenhVien', e.target.value);
                        handleParticipantChange(index, 'noiDangKyKCB', selectedCSKCB?.ten || '');
                        handleParticipantChange(index, 'tinhKCB', selectedCSKCB?.ma_tinh || '');
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={loadingCSKCB}
                    >
                      <option value="">Chọn cơ sở KCB</option>
                      {cskcbOptions.map((cskcb) => (
                        <option key={cskcb.value} value={cskcb.value}>
                          {cskcb.ten} ({cskcb.ma_tinh})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.mucLuong || ''}
                      onChange={(e) => handleParticipantChange(index, 'mucLuong', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Mức lương"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.tyLeDong || ''}
                      onChange={(e) => handleParticipantChange(index, 'tyLeDong', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Tỷ lệ đóng"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.sttHo || ''}
                      onChange={(e) => handleParticipantChange(index, 'sttHo', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Chọn</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.soThangDong || ''}
                      onChange={(e) => handleParticipantChange(index, 'soThangDong', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Chọn</option>
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="12">12</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.tienDongThucTe ? participant.tienDongThucTe.toLocaleString('vi-VN') : ''}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      placeholder="Tự động tính"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="date"
                      value={participant.tuNgayTheCu || ''}
                      onChange={(e) => handleParticipantChange(index, 'tuNgayTheCu', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="date"
                      value={participant.denNgayTheCu || ''}
                      onChange={(e) => handleParticipantChange(index, 'denNgayTheCu', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="date"
                      value={participant.ngayBienLai || ''}
                      onChange={(e) => handleParticipantChange(index, 'ngayBienLai', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.maTinhNkq || ''}
                      onChange={(e) => handleTinhChange(index, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={loadingLocation}
                    >
                      <option value="">Chọn tỉnh</option>
                      {tinhOptions.map((tinh) => (
                        <option key={tinh.value} value={tinh.value}>
                          {tinh.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.maHuyenNkq || ''}
                      onChange={(e) => handleHuyenChange(index, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={!participant.maTinhNkq || loadingLocation}
                    >
                      <option value="">Chọn huyện</option>
                      {participant.maTinhNkq && huyenOptions[participant.maTinhNkq]?.map((huyen) => (
                        <option key={huyen.value} value={huyen.value}>
                          {huyen.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={participant.maXaNkq || ''}
                      onChange={(e) => handleParticipantChange(index, 'maXaNkq', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={!participant.maHuyenNkq || !participant.maTinhNkq || loadingLocation}
                    >
                      <option value="">Chọn xã</option>
                      {participant.maTinhNkq && participant.maHuyenNkq &&
                        xaOptions[`${participant.maTinhNkq}-${participant.maHuyenNkq}`]?.map((xa) => (
                        <option key={xa.value} value={xa.value}>
                          {xa.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={participant.noiNhanHoSo || ''}
                      onChange={(e) => handleParticipantChange(index, 'noiNhanHoSo', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Nơi nhận hồ sơ"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveSingleParticipant(index)}
                        disabled={savingData}
                        className="p-2 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Lưu người tham gia này"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveParticipant(index)}
                        disabled={savingData}
                        className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa người tham gia"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
