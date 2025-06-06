import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Save, Trash2, Loader2 } from 'lucide-react';
import { KeKhai603Participant } from '../../../hooks/useKeKhai603Participants';
import styles from './KeKhai603ParticipantTable.module.css';

interface ParticipantMobileCardProps {
  participant: KeKhai603Participant;
  index: number;
  handleParticipantChange: (index: number, field: keyof KeKhai603Participant, value: string) => void;
  handleParticipantKeyPress: (e: React.KeyboardEvent, index: number) => void;
  handleSaveSingleParticipant: (index: number) => Promise<void>;
  handleRemoveParticipant: (index: number) => void;
  participantSearchLoading: { [key: number]: boolean };
  savingData: boolean;
  doiTuongThamGia?: string;
  tinhOptions: any[];
  huyenOptions: { [key: string]: any[] };
  xaOptions: { [key: string]: any[] };
  cskcbOptions: any[];
  loadingLocation: boolean;
  loadingCSKCB: boolean;
  handleTinhChange: (index: number, value: string) => void;
  handleHuyenChange: (index: number, value: string) => void;
  isDarkMode?: boolean;
  // Bulk selection props
  isSelected?: boolean;
  onSelectionChange?: (index: number) => void;
  showCheckbox?: boolean;
}

export const ParticipantMobileCard: React.FC<ParticipantMobileCardProps> = ({
  participant,
  index,
  handleParticipantChange,
  handleParticipantKeyPress,
  handleSaveSingleParticipant,
  handleRemoveParticipant,
  participantSearchLoading,
  savingData,
  doiTuongThamGia,
  tinhOptions,
  huyenOptions,
  xaOptions,
  cskcbOptions,
  loadingLocation,
  loadingCSKCB,
  handleTinhChange,
  handleHuyenChange,
  isDarkMode = false,
  isSelected = false,
  onSelectionChange,
  showCheckbox = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardClasses = `${styles.participantCard} ${isDarkMode ? styles.dark : ''} ${isSelected ? styles.selected : ''}`;
  const headerClasses = `${styles.cardHeader} ${isDarkMode ? styles.dark : ''}`;
  const titleClasses = `${styles.cardTitle} ${isDarkMode ? styles.dark : ''}`;
  const labelClasses = `${styles.cardFieldLabel} ${isDarkMode ? styles.dark : ''}`;
  const valueClasses = `${styles.cardFieldValue} ${isDarkMode ? styles.dark : ''}`;
  const actionsClasses = `${styles.cardActions} ${isDarkMode ? styles.dark : ''}`;
  const expandButtonClasses = `${styles.expandButton} ${isDarkMode ? styles.dark : ''}`;
  const expandedClasses = `${styles.expandedContent} ${isDarkMode ? styles.dark : ''}`;

  return (
    <div className={cardClasses}>
      {/* Card Header */}
      <div className={headerClasses}>
        <div className="flex items-center space-x-3">
          {/* Checkbox for bulk selection */}
          {showCheckbox && onSelectionChange && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectionChange(index)}
              disabled={savingData}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              title="Chọn người này"
            />
          )}
          <div className={titleClasses}>
            {participant.hoTen || `Người tham gia ${index + 1}`}
          </div>
        </div>
        <div className={styles.cardIndex}>#{index + 1}</div>
      </div>

      {/* Essential Fields */}
      <div className={styles.cardContent}>
        {/* Mã BHXH */}
        <div className={styles.cardField}>
          <label className={labelClasses}>Mã BHXH *</label>
          <div className={valueClasses}>
            <div className="relative">
              <input
                type="text"
                value={participant.maSoBHXH || ''}
                onChange={(e) => handleParticipantChange(index, 'maSoBHXH', e.target.value)}
                onKeyDown={(e) => handleParticipantKeyPress(e, index)}
                placeholder="Mã BHXH (Enter để tìm)"
              />
              {participantSearchLoading[index] && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Họ tên */}
        <div className={styles.cardField}>
          <label className={labelClasses}>Họ tên</label>
          <div className={valueClasses}>
            <input
              type="text"
              value={participant.hoTen || ''}
              onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
              placeholder="Họ tên"
            />
          </div>
        </div>

        {/* STT hộ */}
        <div className={styles.cardField}>
          <label className={labelClasses}>STT hộ *</label>
          <div className={valueClasses}>
            <select
              value={participant.sttHo || ''}
              onChange={(e) => handleParticipantChange(index, 'sttHo', e.target.value)}
              disabled={!!(doiTuongThamGia && doiTuongThamGia.includes('DS'))}
            >
              <option value="">Chọn</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
        </div>

        {/* Số tháng */}
        <div className={styles.cardField}>
          <label className={labelClasses}>Số tháng *</label>
          <div className={valueClasses}>
            <select
              value={participant.soThangDong || ''}
              onChange={(e) => handleParticipantChange(index, 'soThangDong', e.target.value)}
            >
              <option value="">Chọn</option>
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="12">12</option>
            </select>
          </div>
        </div>

        {/* Số tiền (readonly) */}
        <div className={styles.cardField}>
          <label className={labelClasses}>Số tiền</label>
          <div className={valueClasses}>
            <input
              type="text"
              value={participant.tienDongThucTe ? participant.tienDongThucTe.toLocaleString('vi-VN') : ''}
              readOnly
              placeholder="Tự động tính"
              style={{ backgroundColor: isDarkMode ? '#4b5563' : '#f9fafb', color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        className={expandButtonClasses}
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Ẩn chi tiết
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Xem chi tiết
          </>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={expandedClasses}>
          {/* Personal Information */}
          <div className={styles.cardField}>
            <label className={labelClasses}>Ngày sinh</label>
            <div className={valueClasses}>
              <input
                type={participant.ngaySinh && participant.ngaySinh.includes('-') && participant.ngaySinh.length === 10 ? "date" : "text"}
                value={participant.ngaySinh || ''}
                onChange={(e) => handleParticipantChange(index, 'ngaySinh', e.target.value)}
                placeholder="Ngày sinh (dd/mm/yyyy hoặc yyyy)"
              />
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Giới tính</label>
            <div className={valueClasses}>
              <select
                value={participant.gioiTinh || 'Nam'}
                onChange={(e) => handleParticipantChange(index, 'gioiTinh', e.target.value)}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Số điện thoại</label>
            <div className={valueClasses}>
              <input
                type="text"
                value={participant.soDienThoai || ''}
                onChange={(e) => handleParticipantChange(index, 'soDienThoai', e.target.value)}
                placeholder="Số điện thoại"
              />
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Số thẻ BHYT</label>
            <div className={valueClasses}>
              <input
                type="text"
                value={participant.soTheBHYT || ''}
                onChange={(e) => handleParticipantChange(index, 'soTheBHYT', e.target.value)}
                placeholder="Số thẻ BHYT"
              />
            </div>
          </div>

          {/* Medical Facility */}
          <div className={styles.cardField}>
            <label className={labelClasses}>Nơi đăng ký KCB *</label>
            <div className={valueClasses}>
              <select
                value={participant.maBenhVien || ''}
                onChange={(e) => {
                  const selectedCSKCB = cskcbOptions.find(cskcb => cskcb.value === e.target.value);
                  handleParticipantChange(index, 'maBenhVien', e.target.value);
                  handleParticipantChange(index, 'noiDangKyKCB', selectedCSKCB?.ten || '');
                  handleParticipantChange(index, 'tinhKCB', selectedCSKCB?.ma_tinh || '');
                }}
                disabled={loadingCSKCB}
              >
                <option value="">Chọn cơ sở KCB</option>
                {cskcbOptions.map((cskcb) => (
                  <option key={cskcb.value} value={cskcb.value}>
                    {cskcb.ten} ({cskcb.ma_tinh})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card Dates */}
          <div className={styles.cardField}>
            <label className={labelClasses}>Từ ngày thẻ cũ</label>
            <div className={valueClasses}>
              <input
                type="date"
                value={participant.tuNgayTheCu || ''}
                onChange={(e) => handleParticipantChange(index, 'tuNgayTheCu', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Đến ngày thẻ cũ</label>
            <div className={valueClasses}>
              <input
                type="date"
                value={participant.denNgayTheCu || ''}
                onChange={(e) => handleParticipantChange(index, 'denNgayTheCu', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Ngày biên lai</label>
            <div className={valueClasses}>
              <input
                type="date"
                value={participant.ngayBienLai || ''}
                onChange={(e) => handleParticipantChange(index, 'ngayBienLai', e.target.value)}
              />
            </div>
          </div>

          {/* Location Information */}
          <div className={styles.cardField}>
            <label className={labelClasses}>Tỉnh NKQ</label>
            <div className={valueClasses}>
              <select
                value={participant.maTinhNkq || ''}
                onChange={(e) => handleTinhChange(index, e.target.value)}
                disabled={loadingLocation}
              >
                <option value="">Chọn tỉnh</option>
                {tinhOptions.map((tinh) => (
                  <option key={tinh.value} value={tinh.value}>
                    {tinh.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Huyện NKQ</label>
            <div className={valueClasses}>
              <select
                value={participant.maHuyenNkq || ''}
                onChange={(e) => handleHuyenChange(index, e.target.value)}
                disabled={!participant.maTinhNkq || loadingLocation}
              >
                <option value="">Chọn huyện</option>
                {participant.maTinhNkq && huyenOptions[participant.maTinhNkq]?.map((huyen) => (
                  <option key={huyen.value} value={huyen.value}>
                    {huyen.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Xã NKQ</label>
            <div className={valueClasses}>
              <select
                value={participant.maXaNkq || ''}
                onChange={(e) => handleParticipantChange(index, 'maXaNkq', e.target.value)}
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
            </div>
          </div>

          <div className={styles.cardField}>
            <label className={labelClasses}>Nơi nhận hồ sơ</label>
            <div className={valueClasses}>
              <input
                type="text"
                value={participant.noiNhanHoSo || ''}
                onChange={(e) => handleParticipantChange(index, 'noiNhanHoSo', e.target.value)}
                placeholder="Nơi nhận hồ sơ"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={actionsClasses}>
        <button
          onClick={() => handleSaveSingleParticipant(index)}
          disabled={savingData}
          className={`${styles.cardActionButton} ${styles.save}`}
          type="button"
        >
          <Save className="h-4 w-4" />
          Lưu
        </button>
        <button
          onClick={() => handleRemoveParticipant(index)}
          disabled={savingData}
          className={`${styles.cardActionButton} ${styles.delete}`}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
          Xóa
        </button>
      </div>
    </div>
  );
};
