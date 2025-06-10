import React from 'react';
import Toast from '../../../shared/components/ui/Toast';
import { useKeKhai603FormData, calculateKeKhai603Amount, calculateKeKhai603AmountThucTe, calculateKeKhai603CardValidity } from '../hooks/useKeKhai603FormData';
import { useKeKhai603Participants } from '../hooks/useKeKhai603Participants';
import { useKeKhai603Api } from '../hooks/useKeKhai603Api';
import { useKeKhai603 } from '../hooks/useKeKhai603';
import { useToast } from '../../../shared/hooks/useToast';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';
import PaymentQRModal from './PaymentQRModal';

import { KeKhai603Header } from './kekhai603/KeKhai603Header';
import { HouseholdBulkInputModal } from './kekhai603/HouseholdBulkInputModal';
import { KeKhai603ParticipantTable } from './kekhai603/KeKhai603ParticipantTable';

import { useCSKCBPreloader } from '../hooks/useCSKCBPreloader';
import { useCSKCBContext } from '../contexts/CSKCBContext';
import { keKhaiService } from '../services/keKhaiService';
import { tinhService, TinhOption } from '../../../shared/services/location/tinhService';
import { huyenService, HuyenOption } from '../../../shared/services/location/huyenService';
import { xaService, XaOption } from '../../../shared/services/location/xaService';
import cskcbService from '../../../shared/services/cskcbService';
import { DmCSKCB } from '../../../shared/services/api/supabaseClient';
import SearchableDropdown, { DropdownOption } from './SearchableDropdown';

interface KeKhai603FormContentProps {
  pageParams: any;
}

export const KeKhai603FormContent: React.FC<KeKhai603FormContentProps> = ({ pageParams }) => {
  // Preload CSKCB data for better performance
  useCSKCBPreloader();



  // State for payment modal
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<ThanhToan | null>(null);

  // State for save participant functionality
  const [savingParticipant, setSavingParticipant] = React.useState(false);





  // State for household bulk input modal
  const [showHouseholdBulkInputModal, setShowHouseholdBulkInputModal] = React.useState(false);
  const [householdProcessing, setHouseholdProcessing] = React.useState(false);
  const [householdProgress, setHouseholdProgress] = React.useState<{
    current: number;
    total: number;
    currentCode?: string;
  } | null>(null);

  // Optimized state for location data with Maps for O(1) lookup
  const [locationData, setLocationData] = React.useState({
    // Shared province data for both Nkq and KS
    tinhOptions: [] as TinhOption[],
    tinhMap: new Map<string, string>(), // code -> name mapping for O(1) lookup

    // Nkq location data
    huyenNkqOptions: [] as HuyenOption[],
    huyenNkqMap: new Map<string, string>(),
    xaNkqOptions: [] as XaOption[],
    xaNkqMap: new Map<string, string>(),

    // KS location data
    huyenKSOptions: [] as HuyenOption[],
    huyenKSMap: new Map<string, string>(),
    xaKSOptions: [] as XaOption[],
    xaKSMap: new Map<string, string>(),

    // CSKCB (Medical facility) data
    cskcbOptions: [] as DmCSKCB[],
    cskcbMap: new Map<string, string>(), // value -> name mapping
  });

  // Consolidated loading states
  const [loadingStates, setLoadingStates] = React.useState({
    tinh: false,
    huyenNkq: false,
    xaNkq: false,
    huyenKS: false,
    xaKS: false,
    cskcb: false,
  });

  // Custom hooks - order matters for dependenciesệu
  const { searchLoading, participantSearchLoading, searchKeKhai603, searchParticipantData } = useKeKhai603Api();
  const { getCSKCBData } = useCSKCBContext();
  const { toast, showToast, hideToast } = useToast();

  // Get keKhaiInfo first
  const {
    keKhaiInfo,
    saving,
    submitting,
    initializeKeKhai,
    createNewKeKhai,
    submitDeclaration,
    saveAllParticipants
  } = useKeKhai603(pageParams);

  // Then use keKhaiInfo in dependent hooks
  const { formData, handleInputChange, resetForm, forceRecalculate, loadParticipantData } = useKeKhai603FormData(keKhaiInfo?.doi_tuong_tham_gia);

  const {
    participants,
    savingData,
    loadParticipants,
    handleParticipantChange,
    addParticipant,
    removeParticipant,
    removeMultipleParticipants,
    updateParticipantWithApiData,
    saveSingleParticipant,
    saveParticipantFromForm
  } = useKeKhai603Participants(keKhaiInfo?.id, keKhaiInfo?.doi_tuong_tham_gia);

  // DEBUG: Monitor participants state changes
  React.useEffect(() => {
    console.log('🔍 DEBUG: Participants state changed:', {
      length: participants.length,
      participants: participants.map(p => ({ id: p.id, hoTen: p.hoTen, maSoBHXH: p.maSoBHXH }))
    });
  }, [participants]);

  // DEBUG: Monitor keKhaiInfo changes
  React.useEffect(() => {
    console.log('🔍 DEBUG: keKhaiInfo changed:', {
      id: keKhaiInfo?.id,
      doi_tuong_tham_gia: keKhaiInfo?.doi_tuong_tham_gia,
      hasKeKhaiInfo: !!keKhaiInfo
    });
  }, [keKhaiInfo]);

  // Optimized: Load province data once for both Nkq and KS
  React.useEffect(() => {
    const loadTinhData = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, tinh: true }));
        console.log('🌍 Loading optimized province data...');
        const options = await tinhService.getTinhOptions();
        console.log('🌍 Province data loaded:', options.length, 'provinces');

        // Create Map for O(1) lookup
        const tinhMap = new Map<string, string>();
        options.forEach(option => {
          tinhMap.set(option.value, option.label);
        });

        setLocationData(prev => ({
          ...prev,
          tinhOptions: options,
          tinhMap
        }));
      } catch (error) {
        console.error('❌ Error loading province data:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, tinh: false }));
      }
    };

    loadTinhData();
  }, []);

  // Optimized: Load Nkq district data when province changes
  React.useEffect(() => {
    const loadHuyenNkqData = async () => {
      if (!formData.tinhKCB) {
        setLocationData(prev => ({
          ...prev,
          huyenNkqOptions: [],
          huyenNkqMap: new Map()
        }));
        return;
      }

      try {
        setLoadingStates(prev => ({ ...prev, huyenNkq: true }));
        console.log('🏘️ Loading Nkq district data for province:', formData.tinhKCB);
        const options = await huyenService.getHuyenOptionsByTinh(formData.tinhKCB);
        console.log('🏘️ Nkq District data loaded:', options.length, 'districts');

        // Create Map for O(1) lookup
        const huyenNkqMap = new Map<string, string>();
        options.forEach(option => {
          huyenNkqMap.set(option.value, option.label);
        });

        setLocationData(prev => ({
          ...prev,
          huyenNkqOptions: options,
          huyenNkqMap
        }));
      } catch (error) {
        console.error('❌ Error loading Nkq district data:', error);
        setLocationData(prev => ({
          ...prev,
          huyenNkqOptions: [],
          huyenNkqMap: new Map()
        }));
      } finally {
        setLoadingStates(prev => ({ ...prev, huyenNkq: false }));
      }
    };

    loadHuyenNkqData();
  }, [formData.tinhKCB]);

  // Optimized: Load Nkq ward data when district changes
  React.useEffect(() => {
    const loadXaNkqData = async () => {
      if (!formData.maHuyenNkq || !formData.tinhKCB) {
        setLocationData(prev => ({
          ...prev,
          xaNkqOptions: [],
          xaNkqMap: new Map()
        }));
        return;
      }

      try {
        setLoadingStates(prev => ({ ...prev, xaNkq: true }));
        console.log('🏠 Loading Nkq ward data for district:', formData.maHuyenNkq, 'in province:', formData.tinhKCB);
        const options = await xaService.getXaOptionsByHuyen(formData.maHuyenNkq, formData.tinhKCB);
        console.log('🏠 Nkq Ward data loaded:', options.length, 'wards');

        // Create Map for O(1) lookup
        const xaNkqMap = new Map<string, string>();
        options.forEach(option => {
          xaNkqMap.set(option.value, option.label);
        });

        setLocationData(prev => ({
          ...prev,
          xaNkqOptions: options,
          xaNkqMap
        }));
      } catch (error) {
        console.error('❌ Error loading Nkq ward data:', error);
        setLocationData(prev => ({
          ...prev,
          xaNkqOptions: [],
          xaNkqMap: new Map()
        }));
      } finally {
        setLoadingStates(prev => ({ ...prev, xaNkq: false }));
      }
    };

    loadXaNkqData();
  }, [formData.maHuyenNkq, formData.tinhKCB]);

  // Optimized: Load KS district data when KS province changes
  React.useEffect(() => {
    const loadHuyenKSData = async () => {
      if (!formData.maTinhKS) {
        setLocationData(prev => ({
          ...prev,
          huyenKSOptions: [],
          huyenKSMap: new Map()
        }));
        return;
      }

      try {
        setLoadingStates(prev => ({ ...prev, huyenKS: true }));
        console.log('🏘️ Loading KS district data for province:', formData.maTinhKS);
        const options = await huyenService.getHuyenOptionsByTinh(formData.maTinhKS);
        console.log('🏘️ KS District data loaded:', options.length, 'districts');

        // Create Map for O(1) lookup
        const huyenKSMap = new Map<string, string>();
        options.forEach(option => {
          huyenKSMap.set(option.value, option.label);
        });

        setLocationData(prev => ({
          ...prev,
          huyenKSOptions: options,
          huyenKSMap
        }));
      } catch (error) {
        console.error('❌ Error loading KS district data:', error);
        setLocationData(prev => ({
          ...prev,
          huyenKSOptions: [],
          huyenKSMap: new Map()
        }));
      } finally {
        setLoadingStates(prev => ({ ...prev, huyenKS: false }));
      }
    };

    loadHuyenKSData();
  }, [formData.maTinhKS]);

  // Optimized: Load KS ward data when KS district changes
  React.useEffect(() => {
    const loadXaKSData = async () => {
      if (!formData.maHuyenKS || !formData.maTinhKS) {
        setLocationData(prev => ({
          ...prev,
          xaKSOptions: [],
          xaKSMap: new Map()
        }));
        return;
      }

      try {
        setLoadingStates(prev => ({ ...prev, xaKS: true }));
        console.log('🏠 Loading KS ward data for district:', formData.maHuyenKS, 'in province:', formData.maTinhKS);
        const options = await xaService.getXaOptionsByHuyen(formData.maHuyenKS, formData.maTinhKS);
        console.log('🏠 KS Ward data loaded:', options.length, 'wards');

        // Create Map for O(1) lookup
        const xaKSMap = new Map<string, string>();
        options.forEach(option => {
          xaKSMap.set(option.value, option.label);
        });

        setLocationData(prev => ({
          ...prev,
          xaKSOptions: options,
          xaKSMap
        }));
      } catch (error) {
        console.error('❌ Error loading KS ward data:', error);
        setLocationData(prev => ({
          ...prev,
          xaKSOptions: [],
          xaKSMap: new Map()
        }));
      } finally {
        setLoadingStates(prev => ({ ...prev, xaKS: false }));
      }
    };

    loadXaKSData();
  }, [formData.maHuyenKS, formData.maTinhKS]);

  // Load CSKCB data when Nkq province changes
  React.useEffect(() => {
    const loadCSKCBData = async () => {
      if (!formData.tinhKCB) {
        setLocationData(prev => ({
          ...prev,
          cskcbOptions: [],
          cskcbMap: new Map()
        }));
        return;
      }

      try {
        setLoadingStates(prev => ({ ...prev, cskcb: true }));
        console.log('🏥 Loading CSKCB data for province:', formData.tinhKCB);
        const options = await cskcbService.getCSKCBList({ ma_tinh: formData.tinhKCB });
        console.log('🏥 CSKCB data loaded:', options.length, 'facilities');

        // Create Map for O(1) lookup
        const cskcbMap = new Map<string, string>();
        options.forEach(option => {
          cskcbMap.set(option.value, option.ten);
        });

        setLocationData(prev => ({
          ...prev,
          cskcbOptions: options,
          cskcbMap
        }));
      } catch (error) {
        console.error('❌ Error loading CSKCB data:', error);
        setLocationData(prev => ({
          ...prev,
          cskcbOptions: [],
          cskcbMap: new Map()
        }));
      } finally {
        setLoadingStates(prev => ({ ...prev, cskcb: false }));
      }
    };

    loadCSKCBData();
  }, [formData.tinhKCB]);

  // Note: Removed individual helper functions as they're replaced by dropdown options

  // Helper function to clean label (remove duplicate codes if present)
  const cleanLabel = React.useCallback((value: string, label: string): string => {
    if (!value || !label) return label || value || '';

    // Escape special regex characters in value
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Case 1: Label already has perfect "code - name" format
    const perfectPattern = new RegExp(`^${escapedValue}\\s*-\\s*(.+)$`, 'i');
    if (perfectPattern.test(label)) {
      return label;
    }

    // Case 2: Label has "code code name" (duplicate code) - most common issue
    const duplicatePattern = new RegExp(`^${escapedValue}\\s+${escapedValue}\\s+(.+)$`, 'i');
    const duplicateMatch = label.match(duplicatePattern);
    if (duplicateMatch) {
      return `${value} - ${duplicateMatch[1]}`;
    }

    // Case 3: Label starts with "code name" (no dash)
    const codeSpacePattern = new RegExp(`^${escapedValue}\\s+(.+)$`, 'i');
    const codeSpaceMatch = label.match(codeSpacePattern);
    if (codeSpaceMatch) {
      return `${value} - ${codeSpaceMatch[1]}`;
    }

    // Case 4: Label already contains the code somewhere (don't add again)
    const codeAnywherePattern = new RegExp(`\\b${escapedValue}\\b`, 'i');
    if (codeAnywherePattern.test(label)) {
      return label;
    }

    // Case 5: Label doesn't contain code, add it
    return `${value} - ${label}`;
  }, []);

  // Helper functions to convert location data to DropdownOption format
  const getTinhDropdownOptions = React.useMemo((): DropdownOption[] => {
    return locationData.tinhOptions.map(option => ({
      value: option.value,
      label: cleanLabel(option.value, option.label),
      searchText: `${option.value} ${option.label}` // For better search matching
    })).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  }, [locationData.tinhOptions, cleanLabel]);

  const getHuyenNkqDropdownOptions = React.useMemo((): DropdownOption[] => {
    return locationData.huyenNkqOptions.map(option => ({
      value: option.value,
      label: cleanLabel(option.value, option.label),
      searchText: `${option.value} ${option.label}`
    })).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  }, [locationData.huyenNkqOptions, cleanLabel]);

  const getXaNkqDropdownOptions = React.useMemo((): DropdownOption[] => {
    return locationData.xaNkqOptions.map(option => ({
      value: option.value,
      label: cleanLabel(option.value, option.label),
      searchText: `${option.value} ${option.label}`
    })).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  }, [locationData.xaNkqOptions, cleanLabel]);

  // KS dropdown options - COMMENTED OUT (fields are hidden)
  // const getHuyenKSDropdownOptions = React.useMemo((): DropdownOption[] => {
  //   return locationData.huyenKSOptions.map(option => ({
  //     value: option.value,
  //     label: cleanLabel(option.value, option.label),
  //     searchText: `${option.value} ${option.label}`
  //   })).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  // }, [locationData.huyenKSOptions, cleanLabel]);

  // const getXaKSDropdownOptions = React.useMemo((): DropdownOption[] => {
  //   return locationData.xaKSOptions.map(option => ({
  //     value: option.value,
  //     label: cleanLabel(option.value, option.label),
  //     searchText: `${option.value} ${option.label}`
  //   })).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  // }, [locationData.xaKSOptions, cleanLabel]);

  // Helper function for CSKCB (Medical facility) dropdown
  const getCSKCBDropdownOptions = React.useMemo((): DropdownOption[] => {
    const options = locationData.cskcbOptions.map(option => ({
      value: option.value,
      label: cleanLabel(option.value, option.ten),
      searchText: `${option.value} ${option.ten} ${option.ma}` // Include ma for search
    }));

    // Always include default hospital (006) if not already in the list
    const hasDefaultHospital = options.some(option => option.value === '006');
    if (!hasDefaultHospital) {
      options.unshift({
        value: '006',
        label: '006 - Trung tâm Y tế thị xã Tịnh Biên',
        searchText: '006 Trung tâm Y tế thị xã Tịnh Biên'
      });
    }

    return options.sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  }, [locationData.cskcbOptions, cleanLabel]);

  // Helper function for Số tháng đóng dropdown (only 3, 6, 12 months)
  const getSoThangDongDropdownOptions = React.useMemo((): DropdownOption[] => {
    return [
      {
        value: '3',
        label: '3 tháng',
        searchText: '3 tháng ba month'
      },
      {
        value: '6',
        label: '6 tháng',
        searchText: '6 tháng sáu month'
      },
      {
        value: '12',
        label: '12 tháng',
        searchText: '12 tháng mười hai năm year month'
      }
    ];
  }, []);

  // Handle cascading dropdown changes with reset
  const handleTinhNkqChange = React.useCallback((value: string) => {
    handleInputChange('tinhKCB', value);
    // Reset dependent dropdowns
    handleInputChange('maHuyenNkq', '');
    handleInputChange('maXaNkq', '');
  }, [handleInputChange]);

  const handleHuyenNkqChange = React.useCallback((value: string) => {
    handleInputChange('maHuyenNkq', value);
    // Reset dependent dropdown
    handleInputChange('maXaNkq', '');
  }, [handleInputChange]);

  const handleTinhKSChange = React.useCallback((value: string) => {
    handleInputChange('maTinhKS', value);
    // Reset dependent dropdowns
    handleInputChange('maHuyenKS', '');
    handleInputChange('maXaKS', '');
  }, [handleInputChange]);

  const handleHuyenKSChange = React.useCallback((value: string) => {
    handleInputChange('maHuyenKS', value);
    // Reset dependent dropdown
    handleInputChange('maXaKS', '');
  }, [handleInputChange]);

  // Handle CSKCB (Medical facility) change
  const handleCSKCBChange = React.useCallback((value: string) => {
    // Find the selected facility to get its name
    const selectedFacility = locationData.cskcbOptions.find(option => option.value === value);
    if (selectedFacility) {
      // Update all related medical facility fields
      handleInputChange('noiDangKyKCB', selectedFacility.ten);
      handleInputChange('maBenhVien', selectedFacility.value);
      handleInputChange('tenBenhVien', selectedFacility.ten);
      handleInputChange('tinhKCB', selectedFacility.ma_tinh);
      console.log('🏥 Medical facility updated:', selectedFacility.ten, 'Code:', selectedFacility.value);
    } else if (value === '006') {
      // Handle default hospital (006) even if not in loaded options
      handleInputChange('noiDangKyKCB', 'Trung tâm Y tế thị xã Tịnh Biên');
      handleInputChange('maBenhVien', '006');
      handleInputChange('tenBenhVien', 'Trung tâm Y tế thị xã Tịnh Biên');
      handleInputChange('tinhKCB', '89');
      console.log('🏥 Default medical facility selected: Trung tâm Y tế thị xã Tịnh Biên (006)');
    } else {
      // Clear medical facility fields if no selection
      handleInputChange('noiDangKyKCB', '');
      handleInputChange('maBenhVien', '');
      handleInputChange('tenBenhVien', '');
    }
  }, [handleInputChange, locationData.cskcbOptions]);



  // Helper function to find matching medical facility in CSKCB options
  const findMatchingMedicalFacility = async (facilityName: string) => {
    if (!facilityName) return null;

    try {
      // Get all CSKCB data
      const cskcbData = await getCSKCBData();

      // Try exact match first
      let matchedFacility = cskcbData.find(facility =>
        facility.ten === facilityName
      );

      // If no exact match, try partial match (case insensitive)
      if (!matchedFacility) {
        matchedFacility = cskcbData.find(facility =>
          facility.ten.toLowerCase().includes(facilityName.toLowerCase()) ||
          facilityName.toLowerCase().includes(facility.ten.toLowerCase())
        );
      }

      // If still no match, try matching by keywords
      if (!matchedFacility) {
        const facilityKeywords = facilityName.toLowerCase().split(' ').filter(word => word.length > 2);
        matchedFacility = cskcbData.find(facility => {
          const facilityWords = facility.ten.toLowerCase().split(' ');
          return facilityKeywords.some(keyword =>
            facilityWords.some(word => word.includes(keyword) || keyword.includes(word))
          );
        });
      }

      return matchedFacility;
    } catch (error) {
      console.error('Error finding matching medical facility:', error);
      return null;
    }
  };



  // Handle search for main form
  const handleSearch = async () => {
    console.log('🔍 DEBUG: handleSearch called with maSoBHXH:', formData.maSoBHXH);

    if (!formData.maSoBHXH.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    try {
      console.log('🔍 DEBUG: Searching for BHXH code:', formData.maSoBHXH);
      const result = await searchKeKhai603(formData.maSoBHXH);

      if (result.success && result.data) {
        // ALWAYS keep default hospital (006) when searching BHXH - ignore API medical facility data
        console.log('🏥 Keeping default hospital 006 - ignoring API medical facility data');

        // Update form data with search results (excluding ALL medical facility fields to preserve default hospital)
        Object.entries(result.data).forEach(([key, value]) => {
          if (!['noiDangKyKCB', 'tinhKCB', 'maBenhVien', 'tenBenhVien'].includes(key)) {
            handleInputChange(key as any, value as string);
          }
        });

        // NOTE: Removed automatic update of first participant to prevent data corruption
        // Form search should only update the form, not existing participants in the table
        console.log('✅ Form data updated from search, existing participants unchanged');

        // Kiểm tra nếu có cảnh báo về trạng thái thẻ
        const hasCardWarning = result.data.trangThaiThe &&
          result.data.trangThaiThe.includes('⚠️') &&
          result.data.trangThaiThe.toLowerCase().includes('không có thẻ');

        // Create success message - always mention that default hospital is kept
        let successMessage = 'Đã tìm thấy và cập nhật thông tin BHYT! Bệnh viện mặc định 006 được giữ nguyên.';

        if (hasCardWarning) {
          showToast('Đã tìm thấy Thông tin cơ bản! ⚠️ Lưu ý: Người này chưa có thẻ BHYT', 'warning');
        } else {
          showToast(successMessage, 'success');
        }
      } else {
        showToast(result.message || 'Không tìm thấy thông tin BHYT', 'warning');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.', 'error');
    }
  };

  // Handle search for participant
  const handleParticipantSearch = async (index: number) => {
    const participant = participants[index];
    if (!participant?.maSoBHXH?.trim()) {
      console.warn(`⚠️ No BHXH code for participant at index ${index}:`, participant);
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    try {
      const result = await searchParticipantData(participant.maSoBHXH, index);

      if (result.success && result.data) {
        // Handle medical facility matching for participant search
        let facilityUpdated = false;
        if (result.data.noiDangKyKCB) {
          const matchedFacility = await findMatchingMedicalFacility(result.data.noiDangKyKCB);
          if (matchedFacility) {
            // Update participant with matched facility data
            result.data.noiDangKyKCB = matchedFacility.ten;
            result.data.tinhKCB = matchedFacility.ma_tinh;
            result.data.maBenhVien = matchedFacility.value;
            result.data.tenBenhVien = matchedFacility.ten;
            facilityUpdated = true;
            console.log(`✅ Matched medical facility for participant ${index + 1}:`, matchedFacility.ten);
          } else {
            console.log(`⚠️ No exact match found for participant ${index + 1} facility:`, result.data.noiDangKyKCB);
          }
        }

        updateParticipantWithApiData(index, result.data);

        // Kiểm tra nếu có cảnh báo về trạng thái thẻ
        const hasCardWarning = result.data.trangThaiThe &&
          result.data.trangThaiThe.includes('⚠️') &&
          result.data.trangThaiThe.toLowerCase().includes('không có thẻ');

        // Create success message based on facility matching and card status
        let successMessage = 'Đã cập nhật thông tin người tham gia!';
        if (facilityUpdated) {
          successMessage += ' Cơ sở KCB đã được tự động chọn.';
        }

        if (hasCardWarning) {
          showToast('Đã cập nhật Thông tin cơ bản! ⚠️ Lưu ý: Người này chưa có thẻ BHYT', 'warning');
        } else {
          showToast(successMessage, 'success');
        }
      } else {
        showToast(result.message || 'Không tìm thấy thông tin BHYT', 'warning');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.', 'error');
    }
  };

  // Handle key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle participant key press for search
  const handleParticipantKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleParticipantSearch(index);
    }
  };



  // Handle household bulk input (optimized batch approach)
  const handleHouseholdBulkAddNew = async (
    bhxhCodes: string[],
    soThangDong: string,
    medicalFacility?: { maBenhVien: string; tenBenhVien: string; maTinh?: string },
    progressCallback?: (current: number, currentCode?: string) => void
  ) => {
    try {
      console.log(`🏠 Starting OPTIMIZED household bulk input for ${bhxhCodes.length} participants`);

      // Validate keKhaiInfo is available
      if (!keKhaiInfo?.id) {
        throw new Error('Chưa có thông tin kê khai. Vui lòng tạo kê khai mới từ trang chính.');
      }

      let successCount = 0;
      let errorCount = 0;
      const errors: Array<{ code: string; error: string }> = [];
      const savedParticipants: Array<{ id: string; bhxhCode: string }> = [];

      // Phase 1: Batch save participants to database
      progressCallback?.(0, 'Đang chuẩn bị dữ liệu...');
      const participantDataList = bhxhCodes.map((bhxhCode, i) => {
        const sttHo = keKhaiInfo?.doi_tuong_tham_gia && keKhaiInfo.doi_tuong_tham_gia.includes('DS') ? '1' : (i + 1).toString();

        // Create clean data object matching CreateNguoiThamGiaRequest interface
        const participantData: any = {
          ke_khai_id: keKhaiInfo.id, // Already validated above
          stt: participants.length + i + 1,
          ho_ten: '', // Will be populated by API
          ma_so_bhxh: bhxhCode,
          gioi_tinh: 'Nam',
          quoc_tich: 'VN',
          so_thang_dong: parseInt(soThangDong),
          stt_ho: sttHo,
          loai_to_chuc: keKhaiInfo?.loai_to_chuc || 'cong_ty',
          cong_ty_id: keKhaiInfo?.cong_ty_id,
          co_quan_bhxh_id: keKhaiInfo?.co_quan_bhxh_id,
          ngay_bien_lai: new Date().toISOString().split('T')[0]
        };

        // Calculate payment amounts using the same logic as individual entry
        if (sttHo && soThangDong) {
          // Calculate tien_dong (new formula)
          const tienDong = calculateKeKhai603Amount(sttHo, soThangDong);
          participantData.tien_dong = tienDong;

          // Calculate tien_dong_thuc_te (old formula with 4.5%)
          const tienDongThucTe = calculateKeKhai603AmountThucTe(sttHo, soThangDong, 2340000, keKhaiInfo?.doi_tuong_tham_gia);
          participantData.tien_dong_thuc_te = tienDongThucTe;

          console.log(`💰 Calculated amounts for ${bhxhCode}: tien_dong=${tienDong}, tien_dong_thuc_te=${tienDongThucTe}`);
        }

        // Add medical facility data if provided
        if (medicalFacility?.maBenhVien) {
          participantData.ma_benh_vien = medicalFacility.maBenhVien;
          participantData.noi_dang_ky_kcb = medicalFacility.tenBenhVien;
          participantData.noi_nhan_ho_so = medicalFacility.tenBenhVien; // Nơi nhận hồ sơ = tên bệnh viện
          participantData.tinh_kcb = medicalFacility.maTinh; // Mã tỉnh Nkq
          console.log(`🏥 Added medical facility data: ${medicalFacility.tenBenhVien} (${medicalFacility.maBenhVien}) - Tỉnh: ${medicalFacility.maTinh}`);
        }

        return participantData;
      });

      try {
        progressCallback?.(Math.floor(bhxhCodes.length * 0.2), 'Đang lưu vào cơ sở dữ liệu...');

        // Debug log the data being saved
        console.log(`💾 Saving ${participantDataList.length} participants with data:`, participantDataList.map(p => ({
          ma_so_bhxh: p.ma_so_bhxh,
          ma_benh_vien: p.ma_benh_vien,
          noi_dang_ky_kcb: p.noi_dang_ky_kcb,
          noi_nhan_ho_so: p.noi_nhan_ho_so,
          tinh_kcb: p.tinh_kcb
        })));

        const batchSaveResult = await keKhaiService.addMultipleNguoiThamGia(participantDataList);

        batchSaveResult.forEach((participant, index) => {
          savedParticipants.push({
            id: participant.id.toString(),
            bhxhCode: bhxhCodes[index]
          });
        });

        successCount = batchSaveResult.length;
        console.log(`✅ Batch saved ${successCount} participants to database`);
      } catch (batchError) {
        console.error('❌ Batch save failed, falling back to individual saves:', batchError);

        // Fallback: Individual saves
        for (let i = 0; i < bhxhCodes.length; i++) {
          const bhxhCode = bhxhCodes[i];
          progressCallback?.(i + 1, `Đang lưu ${bhxhCode}...`);

          try {
            const result = await saveParticipantFromForm(participantDataList[i]);
            if (result.success && result.participant?.id) {
              savedParticipants.push({
                id: result.participant.id.toString(),
                bhxhCode
              });
              successCount++;
            } else {
              errors.push({ code: bhxhCode, error: result.message || 'Lưu thất bại' });
              errorCount++;
            }
          } catch (error) {
            errors.push({ code: bhxhCode, error: error instanceof Error ? error.message : 'Lỗi không xác định' });
            errorCount++;
          }
        }
      }

      // Phase 2: Batch API lookup for all saved participants
      progressCallback?.(Math.floor(bhxhCodes.length * 0.4), 'Đang tra cứu thông tin từ API...');

      // Process API lookups with controlled concurrency
      const apiPromises = savedParticipants.map(async ({ id, bhxhCode }, index) => {
        try {
          // Add staggered delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, index * 200));

          progressCallback?.(Math.floor(bhxhCodes.length * 0.4) + index + 1, `Tra cứu ${bhxhCode}...`);

          const directSearchResult = await searchParticipantData(bhxhCode, -1);

          if (directSearchResult.success && directSearchResult.data) {
            // Update participant in database with API data
            const apiUpdateData: any = {
              ho_ten: directSearchResult.data.hoTen || '',
              ngay_sinh: directSearchResult.data.ngaySinh || undefined,
              gioi_tinh: directSearchResult.data.gioiTinh || '',
              so_cccd: directSearchResult.data.soCCCD || undefined,
              so_dien_thoai: directSearchResult.data.soDienThoai || undefined,
              so_the_bhyt: directSearchResult.data.soTheBHYT || undefined,
              dan_toc: directSearchResult.data.danToc || undefined,
              quoc_tich: directSearchResult.data.quocTich || 'VN',
              ma_tinh_ks: directSearchResult.data.maTinhKS || undefined,
              ma_huyen_ks: directSearchResult.data.maHuyenKS || undefined,
              ma_xa_ks: directSearchResult.data.maXaKS || undefined,
              ma_tinh_nkq: directSearchResult.data.maTinhNkq || directSearchResult.data.maTinhKS || undefined,
              ma_huyen_nkq: directSearchResult.data.maHuyenNkq || directSearchResult.data.maHuyenKS || undefined,
              ma_xa_nkq: directSearchResult.data.maXaNkq || directSearchResult.data.maXaKS || undefined,
              ma_ho_gia_dinh: directSearchResult.data.maHoGiaDinh || undefined,
              phuong_an: directSearchResult.data.phuongAn || undefined
            };

            // Handle noi_nhan_ho_so from API data (this is more accurate than modal data)
            if (directSearchResult.data.noiNhanHoSo) {
              apiUpdateData.noi_nhan_ho_so = directSearchResult.data.noiNhanHoSo;
              console.log(`📋 Using API noi_nhan_ho_so: ${directSearchResult.data.noiNhanHoSo}`);
            }

            // Handle card validity dates from API data
            if (directSearchResult.data.tuNgayTheCu) {
              apiUpdateData.tu_ngay_the_cu = directSearchResult.data.tuNgayTheCu;
              console.log(`📅 Using API tu_ngay_the_cu: ${directSearchResult.data.tuNgayTheCu}`);
            }

            if (directSearchResult.data.denNgayTheCu) {
              apiUpdateData.den_ngay_the_cu = directSearchResult.data.denNgayTheCu;
              console.log(`📅 Using API den_ngay_the_cu: ${directSearchResult.data.denNgayTheCu}`);
            }



            // Only update medical facility data if no facility was selected in modal
            // This preserves the user's choice from the household bulk input modal
            if (!medicalFacility?.maBenhVien) {
              apiUpdateData.noi_dang_ky_kcb = directSearchResult.data.noiDangKyKCB || undefined;
              apiUpdateData.tinh_kcb = directSearchResult.data.tinhKCB || undefined;
              apiUpdateData.ma_benh_vien = directSearchResult.data.maBenhVien || undefined;
              console.log(`🏥 Using API medical facility data`);
            } else {
              // If medical facility was selected in modal, preserve the modal choice
              console.log(`🏥 Preserving medical facility data from modal: ${medicalFacility.tenBenhVien}`);
            }

            // Clean undefined values but preserve important fields that were set in initial save
            Object.keys(apiUpdateData).forEach(key => {
              if (apiUpdateData[key] === undefined || apiUpdateData[key] === '') {
                delete apiUpdateData[key];
              }
            });

            console.log(`💾 Updating participant ${id} with API data:`, apiUpdateData);
            await keKhaiService.updateNguoiThamGia(parseInt(id), apiUpdateData);
            console.log(`✅ Successfully updated participant ${id} with API data`);

            // Calculate card validity dates after API update (need denNgayTheCu from API)
            const participantIndex = savedParticipants.findIndex(p => p.id === id);
            if (participantIndex !== -1) {
              const soThangDongValue = soThangDong; // Use the parameter from function scope
              const ngayBienLai = new Date().toISOString().split('T')[0]; // Today's date
              const denNgayTheCu = directSearchResult.data.denNgayTheCu || '';

              if (soThangDongValue && ngayBienLai) {
                const cardValidity = calculateKeKhai603CardValidity(soThangDongValue, denNgayTheCu, ngayBienLai);

                // Update card validity dates
                const cardUpdateData = {
                  tu_ngay_the_moi: cardValidity.tuNgay,
                  den_ngay_the_moi: cardValidity.denNgay,
                  ngay_bien_lai: ngayBienLai
                };

                await keKhaiService.updateNguoiThamGia(parseInt(id), cardUpdateData);
                console.log(`📅 Updated card validity for participant ${id}: ${cardValidity.tuNgay} to ${cardValidity.denNgay}`);
              }
            }

            return { success: true, bhxhCode };
          } else {
            return { success: false, bhxhCode, error: directSearchResult.message };
          }
        } catch (error) {
          return {
            success: false,
            bhxhCode,
            error: error instanceof Error ? error.message : 'Lỗi không xác định'
          };
        }
      });

      // Wait for all API lookups to complete
      const apiResults = await Promise.allSettled(apiPromises);

      // Count API successes and failures
      let apiSuccessCount = 0;
      let apiErrorCount = 0;

      apiResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          apiSuccessCount++;
        } else {
          apiErrorCount++;
          const bhxhCode = savedParticipants[index]?.bhxhCode || 'Unknown';
          const errorMsg = result.status === 'fulfilled' ? result.value.error : 'Promise rejected';
          errors.push({ code: bhxhCode, error: `API lookup failed: ${errorMsg}` });
        }
      });

      console.log(`🔍 API lookup completed: ${apiSuccessCount} success, ${apiErrorCount} errors`);

      // Final refresh to ensure all data is up to date
      console.log(`🔄 Final refresh of participants list...`);
      await loadParticipants();

      // Show final result
      if (errorCount === 0) {
        console.log(`🏠 Household bulk input completed successfully: ${successCount} participants added with API lookup`);
        showToast(`Đã thêm thành công ${successCount} người vào hộ gia đình và tra cứu thông tin từ API!`, 'success');
      } else {
        console.log(`🏠 Household bulk input completed with errors: ${successCount} success, ${errorCount} errors`);
        showToast(`Đã thêm ${successCount} người thành công, ${errorCount} người lỗi. Thông tin đã được tra cứu từ API.`, 'warning');
      }
    } catch (error) {
      console.error('Household bulk add error:', error);
      showToast('Có lỗi xảy ra khi thêm hộ gia đình. Vui lòng thử lại.', 'error');
    }
  };







  // Handle save all data (now redirects to combined save)
  const handleSaveAll = async () => {
    console.log('🚀 handleSaveAll triggered - redirecting to handleCombinedSave');
    await handleCombinedSave();
  };

  // Handle submit declaration
  const handleSubmit = async () => {
    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai để nộp. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    try {
      const result = await submitDeclaration();
      if (result.success) {
        showToast(result.message, 'success');

        // No QR modal shown immediately after submission
        // QR code will be generated and displayed after synthesis staff approval
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('Có lỗi xảy ra khi nộp kê khai. Vui lòng thử lại.', 'error');
    }
  };

  // Handle combined save: Save participant + Save all data
  const handleCombinedSave = async () => {
    console.log('🚀 handleCombinedSave called - Combined save function');
    console.log('🔍 DEBUG: keKhaiInfo:', keKhaiInfo);
    console.log('🔍 DEBUG: formData:', formData);
    console.log('🔍 DEBUG: participants length before save:', participants.length);

    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      console.log('❌ No keKhaiInfo available');
      showToast('Chưa có thông tin kê khai. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    try {
      setSavingParticipant(true);

      // Step 1: If form has participant data, save as new participant first
      const hasParticipantData = formData.maSoBHXH.trim() && formData.hoTen.trim() && formData.noiDangKyKCB.trim();

      if (hasParticipantData) {
        console.log('📋 Step 1: Saving new participant from form data...');

        const participantResult = await saveParticipantFromForm(formData);
        console.log('📊 saveParticipantFromForm result:', participantResult);

        if (participantResult.success) {
          console.log('✅ Participant saved successfully:', participantResult);
          showToast(participantResult.message, 'success');

          // Only refresh if it was a new participant (not editing)
          if (!formData.editingParticipantId) {
            console.log('🔄 Refreshing participants list for new participant...');
            await loadParticipants();
          } else {
            console.log('ℹ️ Skipping refresh for edit operation - local state already updated');
          }

          // Reset the form for next entry
          console.log('🔄 Resetting form after successful save...');
          console.log('🔍 DEBUG: Form data before reset:', {
            maSoBHXH: formData.maSoBHXH,
            hoTen: formData.hoTen,
            editingParticipantId: formData.editingParticipantId
          });
          resetForm();

          // Verify reset worked
          setTimeout(() => {
            console.log('🔍 DEBUG: Form data after reset (async check):', {
              maSoBHXH: formData.maSoBHXH,
              hoTen: formData.hoTen,
              editingParticipantId: formData.editingParticipantId
            });
          }, 100);
        } else {
          console.log('❌ Participant save failed:', participantResult);
          showToast(participantResult.message, 'error');
          return; // Don't proceed to save all if participant save failed
        }
      } else {
        console.log('ℹ️ No participant data to save, proceeding to save declaration only');
      }

      // Step 2: Save all data (declaration + existing participants)
      // Skip this step if we just edited a participant to avoid overwriting the update
      if (!formData.editingParticipantId) {
        console.log('📋 Step 2: Saving all data (declaration + participants)...');
        const saveAllResult = await saveAllParticipants(participants, formData);
        console.log('📊 saveAllParticipants result:', saveAllResult);

        if (saveAllResult.success) {
          console.log('✅ All data saved successfully');
          showToast(saveAllResult.message, 'success');

          // Final refresh to ensure everything is up to date
          await loadParticipants();
        } else {
          console.log('❌ Save all failed:', saveAllResult);
          showToast(saveAllResult.message, 'error');
        }
      } else {
        console.log('ℹ️ Skipping Step 2 for edit operation - participant already updated');
        showToast('Đã cập nhật thành công thông tin người tham gia!', 'success');
      }

    } catch (error) {
      console.error('❌ Combined save error:', error);
      showToast('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.', 'error');
    } finally {
      setSavingParticipant(false);
      console.log('🔄 Combined save process finished');
      console.log('🔍 DEBUG: Final participants length:', participants.length);
    }
  };



  // Handle add participant
  const handleAddParticipant = async () => {
    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    try {
      await addParticipant();
      showToast('Đã thêm người tham gia mới thành công!', 'success');
    } catch (error) {
      console.error('Add participant error:', error);
      showToast('Có lỗi xảy ra khi thêm người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  // Handle edit participant - Load participant data to form for editing
  const handleEditParticipant = (index: number) => {
    const participant = participants[index];
    if (!participant) {
      showToast('Không tìm thấy thông tin người tham gia', 'error');
      return;
    }

    console.log('🔄 Loading participant data to form for editing:', participant);

    // Load participant data to form using the dedicated function
    loadParticipantData(participant);

    // Force recalculate amounts after loading data
    setTimeout(() => {
      forceRecalculate();
    }, 100);

    showToast(`Đã tải thông tin của ${participant.hoTen || 'người tham gia'} lên form để chỉnh sửa`, 'success');

    // Scroll to form
    const formElement = document.querySelector('.ke-khai-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle remove participant
  const handleRemoveParticipant = async (index: number) => {
    try {
      await removeParticipant(index);
      showToast('Đã xóa người tham gia thành công!', 'success');
    } catch (error) {
      console.error('Remove participant error:', error);
      showToast('Có lỗi xảy ra khi xóa người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  // Handle bulk remove participants
  const handleBulkRemoveParticipants = async (indices: number[]) => {
    try {
      await removeMultipleParticipants(indices);
      const count = indices.length;
      showToast(`Đã xóa ${count} người tham gia thành công!`, 'success');
    } catch (error) {
      console.error('Bulk remove participants error:', error);
      showToast('Có lỗi xảy ra khi xóa người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  // Handle save single participant
  const handleSaveSingleParticipant = async (index: number) => {
    try {
      const result = await saveSingleParticipant(index);
      if (result.success) {
        showToast(result.message, 'success');
        // Refresh participants list to ensure data is up to date
        await loadParticipants();
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Save single participant error:', error);
      showToast('Có lỗi xảy ra khi lưu người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  // Handle create new declaration
  const handleCreateNewKeKhai = async () => {
    try {
      const result = await createNewKeKhai();
      if (result.success) {
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Create new ke khai error:', error);
      showToast('Có lỗi xảy ra khi tạo kê khai mới. Vui lòng thử lại.', 'error');
    }
  };

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  // Handle payment confirmed
  const handlePaymentConfirmed = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    showToast('Thanh toán đã được xác nhận thành công!', 'success');
  };

  // Handle household bulk input
  const handleHouseholdBulkInput = async (data: {
    bhxhCodes: string[];
    soThangDong: string;
    maBenhVien?: string;
    tenBenhVien?: string;
  }) => {
    if (!handleHouseholdBulkAddNew) return;

    setHouseholdProcessing(true);
    setHouseholdProgress({
      current: 0,
      total: data.bhxhCodes.length
    });

    try {
      const medicalFacility = data.maBenhVien && data.tenBenhVien ? {
        maBenhVien: data.maBenhVien,
        tenBenhVien: data.tenBenhVien,
        maTinh: data.maTinh
      } : undefined;

      // Create a wrapper function that updates progress
      const progressCallback = (current: number, currentCode?: string) => {
        setHouseholdProgress({
          current,
          total: data.bhxhCodes.length,
          currentCode
        });
      };

      await handleHouseholdBulkAddNew(data.bhxhCodes, data.soThangDong, medicalFacility, progressCallback);
      setShowHouseholdBulkInputModal(false);
    } catch (error) {
      console.error('Household bulk input error:', error);
    } finally {
      setHouseholdProcessing(false);
      setHouseholdProgress(null);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <KeKhai603Header
          keKhaiInfo={keKhaiInfo}
          onSaveAll={handleSaveAll}
          onSubmit={handleSubmit}
          saving={saving}
          submitting={submitting}
          savingData={savingData}
          onHouseholdBulkInput={() => setShowHouseholdBulkInputModal(true)}
          householdProcessing={householdProcessing}
        />



      {/* Main Content */}
      <div className="space-y-6">
        {!keKhaiInfo ? (
          /* No Declaration Info - Show Create Button */
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Chưa có thông tin kê khai
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Để sử dụng chức năng này, bạn cần tạo kê khai mới hoặc truy cập từ danh sách kê khai có sẵn.
              </p>
            </div>
            <button
              onClick={handleCreateNewKeKhai}
              disabled={saving}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <span>Tạo kê khai mới (Test)</span>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Main Form - Matching the image layout */}
            <div className="ke-khai-form bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
             

              {/* Form Content */}
              <div className="p-6">
                {/* Section 1: Thông tin cơ bản */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                    Thông tin cơ bản
                  </h4>
                  <div className="space-y-4">
                    {/* Row 1: Basic Information */}
                    <div className="grid grid-cols-12 gap-4">
                      {/* Mã số BHXH */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mã số BHXH <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.maSoBHXH}
                            onChange={(e) => handleInputChange('maSoBHXH', e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="01234567890"
                          />
                          <button
                            onClick={handleSearch}
                            disabled={searchLoading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                          >
                            {searchLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : (
                              <span className="text-sm">🔍</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Họ và tên */}
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.hoTen}
                          onChange={(e) => handleInputChange('hoTen', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Trần Đình Linh"
                        />
                      </div>

                      {/* CCCD */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CCCD <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.soCCCD}
                          onChange={(e) => handleInputChange('soCCCD', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Dây số"
                        />
                      </div>

                      {/* Ngày sinh */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.ngaySinh}
                          onChange={(e) => handleInputChange('ngaySinh', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Giới tính */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.gioiTinh}
                          onChange={(e) => handleInputChange('gioiTinh', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      </div>

                      {/* Số điện thoại */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          value={formData.soDienThoai}
                          onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0123456789"
                        />
                      </div>

                      {/* Dân tộc */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dân tộc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.danToc}
                          onChange={(e) => handleInputChange('danToc', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="01 - Kinh"
                        />
                      </div>
                    </div>

                    {/* Row 2: Location Information */}
                    <div className="grid grid-cols-12 gap-4 mt-4">
                      {/* Tỉnh Nkq */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tỉnh Nkq <span className="text-red-500">*</span>
                        </label>
                        <SearchableDropdown
                          options={getTinhDropdownOptions}
                          value={formData.tinhKCB}
                          onChange={handleTinhNkqChange}
                          placeholder="Chọn hoặc tìm tỉnh..."
                          loading={loadingStates.tinh}
                          disabled={false}
                          maxResults={15}
                          allowClear={true}
                        />
                      </div>

                      {/* Huyện Nkq */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Huyện Nkq <span className="text-red-500">*</span>
                        </label>
                        <SearchableDropdown
                          options={getHuyenNkqDropdownOptions}
                          value={formData.maHuyenNkq}
                          onChange={handleHuyenNkqChange}
                          placeholder="Chọn hoặc tìm huyện..."
                          loading={loadingStates.huyenNkq}
                          disabled={false}
                          maxResults={15}
                          allowClear={true}
                        />
                      </div>

                      {/* Xã Nkq */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Xã Nkq <span className="text-red-500">*</span>
                        </label>
                        <SearchableDropdown
                          options={getXaNkqDropdownOptions}
                          value={formData.maXaNkq}
                          onChange={(value) => handleInputChange('maXaNkq', value)}
                          placeholder="Chọn hoặc tìm xã/phường..."
                          loading={loadingStates.xaNkq}
                          disabled={false}
                          maxResults={15}
                          allowClear={true}
                        />
                      </div>

                      {/* Nơi nhận hồ sơ */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nơi nhận hồ sơ
                        </label>
                        <input
                          type="text"
                          value={formData.noiNhanHoSo}
                          onChange={(e) => handleInputChange('noiNhanHoSo', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Nơi nhận hồ sơ"
                        />
                      </div>

                      {/* Bệnh viện */}
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bệnh viện <span className="text-red-500">*</span>
                        </label>
                        <SearchableDropdown
                          options={getCSKCBDropdownOptions}
                          value={locationData.cskcbOptions.find(option => option.ten === formData.noiDangKyKCB)?.value || (formData.maBenhVien || '')}
                          onChange={handleCSKCBChange}
                          placeholder="Chọn hoặc tìm bệnh viện..."
                          loading={loadingStates.cskcb}
                          disabled={false}
                          maxResults={15}
                          allowClear={true}
                        />
                      </div>

                      {/* Tỉnh KS - HIDDEN */}
                      {/* <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tỉnh KS <span className="text-red-500">*</span>
                        </label>
                        <SearchableDropdown
                          options={getTinhDropdownOptions}
                          value={formData.maTinhKS}
                          onChange={handleTinhKSChange}
                          placeholder="Chọn hoặc tìm tỉnh..."
                          loading={loadingStates.tinh}
                          disabled={false}
                          maxResults={15}
                          allowClear={true}
                        />
                      </div> */}

                      {/* Huyện KS - HIDDEN */}
                      {/* <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Huyện KS <span className="text-red-500">*</span>
                        </label>
                        <SearchableDropdown
                          options={getHuyenKSDropdownOptions}
                          value={formData.maHuyenKS}
                          onChange={handleHuyenKSChange}
                          placeholder="Chọn hoặc tìm huyện..."
                          loading={loadingStates.huyenKS}
                          disabled={false}
                          maxResults={15}
                          allowClear={true}
                        />
                      </div> */}

                      {/* Xã KS - HIDDEN */}
                      {/* <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Xã KS
                        </label>
                        <SearchableDropdown
                          options={getXaKSDropdownOptions}
                          value={formData.maXaKS}
                          onChange={(value) => handleInputChange('maXaKS', value)}
                          placeholder="Chọn hoặc tìm xã/phường..."
                          loading={loadingStates.xaKS}
                          disabled={false}
                          maxResults={15}
                          allowClear={true}
                        />
                      </div> */}
                    </div>

                    {/* Row 3 - REMOVED: Số điện thoại đã chuyển lên Row 1, Nơi nhận hồ sơ và Bệnh viện đã chuyển lên Row 2 */}
                  </div>
                </div>

                {/* Section 2: Thông tin đóng BHYT */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                    Thông tin đóng BHYT
                  </h4>
                  <div className="space-y-4">
                    {/* Row 1: Payment and Card Information */}
                    <div className="grid grid-cols-12 gap-4">
                      {/* Số tháng đóng */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Số tháng đóng <span className="text-red-500">*</span>
                        </label>
                        <SearchableDropdown
                          options={getSoThangDongDropdownOptions}
                          value={formData.soThangDong}
                          onChange={(value) => handleInputChange('soThangDong', value)}
                          placeholder="Chọn số tháng..."
                          loading={false}
                          disabled={false}
                          maxResults={3}
                          allowClear={true}
                        />
                      </div>

                      {/* STT hộ */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          STT hộ <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.sttHo}
                          onChange={(e) => handleInputChange('sttHo', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Chọn</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      {/* Số thẻ BHYT */}
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Số thẻ BHYT
                        </label>
                        <input
                          type="text"
                          value={formData.soTheBHYT}
                          onChange={(e) => handleInputChange('soTheBHYT', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="HX4010516480000049"
                        />
                      </div>

                      {/* Từ ngày thẻ cũ */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Từ ngày thẻ cũ
                        </label>
                        <input
                          type="date"
                          value={formData.tuNgayTheCu}
                          onChange={(e) => handleInputChange('tuNgayTheCu', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Đến ngày thẻ cũ */}
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Đến ngày thẻ cũ
                        </label>
                        <input
                          type="date"
                          value={formData.denNgayTheCu}
                          onChange={(e) => handleInputChange('denNgayTheCu', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Row 2: Payment Information */}
                    <div className="grid grid-cols-12 gap-4 mt-4">
                      {/* Tỷ lệ đóng */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tỷ lệ đóng
                        </label>
                        <input
                          type="text"
                          value={formData.tyLeDong}
                          onChange={(e) => handleInputChange('tyLeDong', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="4.5"
                        />
                      </div>

                      {/* Từ ngày thẻ mới */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Từ ngày thẻ mới
                        </label>
                        <input
                          type="date"
                          value={formData.tuNgayTheMoi}
                          onChange={(e) => handleInputChange('tuNgayTheMoi', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Đến ngày thẻ mới */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Đến ngày thẻ mới
                        </label>
                        <input
                          type="date"
                          value={formData.denNgayTheMoi}
                          onChange={(e) => handleInputChange('denNgayTheMoi', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Ngày biên lai */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ngày biên lai
                        </label>
                        <input
                          type="date"
                          value={formData.ngayBienLai}
                          onChange={(e) => handleInputChange('ngayBienLai', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Lương cơ sở */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Lương cơ sở
                        </label>
                        <input
                          type="text"
                          value={formData.mucLuong}
                          onChange={(e) => handleInputChange('mucLuong', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Tiền đóng thực tế */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tiền đóng thực tế
                        </label>
                        <input
                          type="text"
                          value={formData.tienDongThucTe ? formData.tienDongThucTe.toLocaleString('vi-VN') : ''}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600"
                          placeholder="Tự động tính toán"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Row 3: Additional Information */}
                    <div className="grid grid-cols-12 gap-4 mt-4">
                      {/* Ghi chú đóng phí */}
                      <div className="col-span-12">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ghi chú
                        </label>
                        <input
                          type="text"
                          value={formData.ghiChuDongPhi}
                          onChange={(e) => handleInputChange('ghiChuDongPhi', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Ghi chú thêm (nếu có)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Participant Button - REMOVED (merged with header button) */}
              </div>
            </div>

            {/* Participant Table */}
            {/* DEBUG: Participants length = {participants.length} */}
            <KeKhai603ParticipantTable
              participants={participants}
              onParticipantSearch={handleParticipantSearch}
              onSaveSingleParticipant={handleSaveSingleParticipant}
              onRemoveParticipant={handleRemoveParticipant}
              onAddParticipant={handleAddParticipant}
              onBulkRemoveParticipants={handleBulkRemoveParticipants}
              onEditParticipant={handleEditParticipant}
              participantSearchLoading={participantSearchLoading}
              savingData={savingData}
              doiTuongThamGia={keKhaiInfo?.doi_tuong_tham_gia}
            />


          </>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/* Payment QR Modal */}
      {showPaymentModal && selectedPayment && (
        <PaymentQRModal
          payment={selectedPayment}
          onClose={handlePaymentModalClose}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}

      {/* Household Bulk Input Modal */}
      <HouseholdBulkInputModal
        isOpen={showHouseholdBulkInputModal}
        onClose={() => setShowHouseholdBulkInputModal(false)}
        onSubmit={handleHouseholdBulkInput}
        doiTuongThamGia={keKhaiInfo?.doi_tuong_tham_gia}
        cskcbOptions={[]} // Will be populated by the modal itself
        processing={householdProcessing}
        progress={householdProgress || undefined}
      />
    </div>
  );
};
