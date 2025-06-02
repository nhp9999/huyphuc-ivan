import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Building2, MapPin, Heart, Stethoscope } from 'lucide-react';
import { DmCSKCB } from '../../../shared/services/api/supabaseClient';
import cskcbService from '../../../shared/services/cskcbService';

interface CSKCBSelectorProps {
  value: string;
  onChange: (value: string, cskcb?: DmCSKCB) => void;
  maTinh?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const CSKCBSelector: React.FC<CSKCBSelectorProps> = ({
  value,
  onChange,
  maTinh,
  placeholder = "Chọn cơ sở khám chữa bệnh",
  disabled = false,
  required = false,
  className = ""
}) => {
  const [cskcbList, setCSKCBList] = useState<DmCSKCB[]>([]);
  const [filteredList, setFilteredList] = useState<DmCSKCB[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCSKCB, setSelectedCSKCB] = useState<DmCSKCB | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load CSKCB data when maTinh changes or component mounts
  useEffect(() => {
    loadCSKCBData();
  }, [maTinh]);

  // Filter list when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = cskcbList.filter(cskcb =>
        cskcb.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cskcb.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cskcb.value.includes(searchTerm)
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(cskcbList);
    }
  }, [searchTerm, cskcbList]);

  // Find selected CSKCB when value changes
  useEffect(() => {
    if (value && cskcbList.length > 0) {
      const found = cskcbList.find(cskcb => cskcb.value === value);
      setSelectedCSKCB(found || null);
    } else {
      setSelectedCSKCB(null);
    }
  }, [value, cskcbList]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideContainer = containerRef.current && containerRef.current.contains(target);
      const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target);

      if (!isClickInsideContainer && !isClickInsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const loadCSKCBData = async () => {
    setLoading(true);
    try {
      let data;
      if (maTinh) {
        // Load cơ sở KCB theo tỉnh cụ thể
        data = await cskcbService.getCSKCBByTinh(maTinh);
      } else {
        // Load tất cả cơ sở KCB (giới hạn 500 để tránh tải quá nhiều)
        data = await cskcbService.getCSKCBList({
          trang_thai: 'active',
          limit: 500
        });
      }
      setCSKCBList(data);
      setFilteredList(data);
    } catch (error) {
      console.error('Error loading CSKCB data:', error);
      setCSKCBList([]);
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (cskcb: DmCSKCB) => {
    console.log('CSKCBSelector: handleSelect called with:', cskcb);
    setSelectedCSKCB(cskcb);
    onChange(cskcb.value, cskcb);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    setSelectedCSKCB(null);
    onChange('');
    setSearchTerm('');
  };

  const calculateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: Math.max(320, rect.width)
      });
    }
  };

  const handleToggleOpen = () => {
    if (!disabled) {
      if (!isOpen) {
        calculateDropdownPosition();
      }
      setIsOpen(!isOpen);
    }
  };

  const getTypeIcon = (loaiCSKCB?: string) => {
    switch (loaiCSKCB) {
      case 'benh_vien':
        return <Building2 className="w-4 h-4 text-red-500" />;
      case 'trung_tam_y_te':
        return <Heart className="w-4 h-4 text-blue-500" />;
      case 'tram_y_te':
        return <Stethoscope className="w-4 h-4 text-green-500" />;
      case 'phong_kham':
        return <Heart className="w-4 h-4 text-purple-500" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (loaiCSKCB?: string) => {
    switch (loaiCSKCB) {
      case 'benh_vien':
        return 'Bệnh viện';
      case 'trung_tam_y_te':
        return 'Trung tâm Y tế';
      case 'tram_y_te':
        return 'Trạm Y tế';
      case 'phong_kham':
        return 'Phòng khám';
      default:
        return 'Cơ sở KCB';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected value display */}
      <div
        ref={containerRef}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
          disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : 'bg-white hover:border-gray-400'
        }`}
        onClick={handleToggleOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0 overflow-hidden">
            {selectedCSKCB ? (
              <>
                {getTypeIcon(selectedCSKCB.loai_cskcb)}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {selectedCSKCB.ten}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {selectedCSKCB.value} - {getTypeLabel(selectedCSKCB.loai_cskcb)}
                  </div>
                </div>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 truncate">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="fixed z-[99999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-80 overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm cơ sở KCB..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <span className="text-sm mt-2 block">Đang tải...</span>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? (
                  <span className="text-sm">Không tìm thấy cơ sở KCB phù hợp</span>
                ) : (
                  <span className="text-sm">Không có cơ sở KCB nào</span>
                )}
              </div>
            ) : (
              <>
                {/* Clear option */}
                {selectedCSKCB && (
                  <div
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Xóa lựa chọn
                    </div>
                  </div>
                )}

                {/* CSKCB options */}
                {filteredList.map((cskcb) => (
                  <div
                    key={cskcb.id}
                    className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      selectedCSKCB?.id === cskcb.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(cskcb);
                    }}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {getTypeIcon(cskcb.loai_cskcb)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {cskcb.ten}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          <span className="font-mono">{cskcb.value}</span>
                          <span className="mx-2">•</span>
                          <span>{getTypeLabel(cskcb.loai_cskcb)}</span>
                          {!maTinh && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Tỉnh {cskcb.ma_tinh}</span>
                            </>
                          )}
                        </div>
                        {cskcb.dia_chi && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center min-w-0">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{cskcb.dia_chi}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation message */}
      {required && !value && (
        <div className="text-red-500 text-xs mt-1">
          Vui lòng chọn cơ sở khám chữa bệnh
        </div>
      )}
    </div>
  );
};

export default CSKCBSelector;
