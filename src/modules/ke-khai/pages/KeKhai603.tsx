import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import { donViService } from '../../quan-ly/services/donViService';
import { daiLyService } from '../../quan-ly/services/daiLyService';
import { luongCoSoService } from '../../../shared/services/luongCoSoService';
import { keKhaiService } from '../services/keKhaiService';
import paymentService from '../services/paymentService';
import { VDonViChiTiet, VDaiLyChiTiet, DmLuongCoSo, DanhSachKeKhai, ThanhToan } from '../../../shared/services/api/supabaseClient';
import { useAuth } from '../../auth/contexts/AuthContext';
import {
  FileText,
  Save,
  Send,
  Download,
  RefreshCw,
  AlertCircle,
  Trash2,
  Eye,
  CreditCard,
  QrCode,
  FileSpreadsheet,
  Copy,
  Check,
  Edit3,
  X,
  MoreVertical,
  ChevronDown,
  User,
  Phone,
  Calendar
} from 'lucide-react';
import DaiLyDonViSelector from '../components/DaiLyDonViSelector';
import PaymentQRModal from '../components/PaymentQRModal';
import { useToast } from '../../../shared/hooks/useToast';
import { exportD03TK1VNPTExcel } from '../../../shared/utils/excelExport';

const KeKhai603: React.FC = () => {
  const { pageParams, setCurrentPage } = useNavigation();
  const { user } = useAuth();
  const { showToast } = useToast();

  // State cho dữ liệu đơn vị
  const [donViList, setDonViList] = useState<VDonViChiTiet[]>([]);
  const [filteredDonViList, setFilteredDonViList] = useState<VDonViChiTiet[]>([]);
  const [loadingDonVi, setLoadingDonVi] = useState(false);
  const [errorDonVi, setErrorDonVi] = useState<string | null>(null);
  const [selectedDonVi, setSelectedDonVi] = useState<VDonViChiTiet | null>(null);

  // State cho dữ liệu đại lý
  const [daiLyList, setDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [filteredDaiLyList, setFilteredDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [loadingDaiLy, setLoadingDaiLy] = useState(false);
  const [errorDaiLy, setErrorDaiLy] = useState<string | null>(null);
  const [selectedDaiLy, setSelectedDaiLy] = useState<VDaiLyChiTiet | null>(null);

  // State cho lương cơ sở
  const [currentBaseSalary, setCurrentBaseSalary] = useState<DmLuongCoSo | null>(null);
  const [baseSalaryLoading, setBaseSalaryLoading] = useState(false);

  // State cho danh sách kê khai
  const [keKhaiList, setKeKhaiList] = useState<DanhSachKeKhai[]>([]);
  const [loadingKeKhai, setLoadingKeKhai] = useState(false);
  const [errorKeKhai, setErrorKeKhai] = useState<string | null>(null);

  // State cho modal xác nhận xóa
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    keKhai: DanhSachKeKhai | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    keKhai: null,
    isDeleting: false
  });

  // State cho việc tạo kê khai mới
  const [isCreating, setIsCreating] = useState(false);

  // State cho thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ThanhToan | null>(null);
  const [creatingPayment, setCreatingPayment] = useState<number | null>(null);

  // State cho export Excel
  const [exportingExcel, setExportingExcel] = useState<number | null>(null);

  // State cho copy mã hồ sơ
  const [copiedKeKhaiId, setCopiedKeKhaiId] = useState<number | null>(null);
  const [copiedHoSoId, setCopiedHoSoId] = useState<number | null>(null);

  // State cho chỉnh sửa mã hồ sơ inline
  const [editingHoSoId, setEditingHoSoId] = useState<number | null>(null);
  const [editingHoSoValue, setEditingHoSoValue] = useState<string>('');
  const [savingHoSo, setSavingHoSo] = useState<number | null>(null);

  // State cho dropdown menu
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // State cho tab view - chỉ hiển thị participants
  const [activeTab, setActiveTab] = useState<'participants'>('participants');

  // State cho participants data
  const [participantsList, setParticipantsList] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [errorParticipants, setErrorParticipants] = useState<string | null>(null);

  // State cho checkbox selection
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [selectAllParticipants, setSelectAllParticipants] = useState(false);

  const [formData, setFormData] = useState({
    // Thông tin đại lý
    bienLaiDienTu: true,
    chonDonVi: '',
    chonDaiLy: '',

    // Nghiệp vụ
    doiTuongThamGia: 'GD - Hộ gia đình',
    hinhThucTinh: 'Hỗ trợ dựa trên mức đóng từng người',
    luongCoSo: '',
    nguonDong: 'Tự đóng',

    // Form fields
    noiDangKyKCBBanDau: '',
    bienLaiNgayThamGia: '',
    soThang: '',
    ngay: '',
    tyLeNSNNHoTro: '',
    ghiChu: ''
  });

  const declarationCode = pageParams?.code || '603';
  const declarationName = pageParams?.name || 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT';

  // Load dữ liệu đơn vị từ Supabase
  const loadDonViData = async () => {
    setLoadingDonVi(true);
    setErrorDonVi(null);
    try {
      // Lọc đơn vị có dịch vụ BHYT dựa trên mã thủ tục
      const searchParams = {
        loaiDichVu: 'BHYT' as const, // Chỉ lấy đơn vị có dịch vụ BHYT
        trangThai: 'active'
      };

      const donViData = await donViService.searchDonVi(searchParams);
      setDonViList(donViData);
      setFilteredDonViList(donViData);
    } catch (err) {
      console.error('Error loading don vi data:', err);
      setErrorDonVi('Không thể tải danh sách đơn vị. Vui lòng thử lại.');
    } finally {
      setLoadingDonVi(false);
    }
  };

  // Load dữ liệu đại lý từ Supabase
  const loadDaiLyData = async () => {
    setLoadingDaiLy(true);
    setErrorDaiLy(null);
    try {
      const daiLyData = await daiLyService.getAllDaiLy();
      setDaiLyList(daiLyData);
      setFilteredDaiLyList(daiLyData);
    } catch (err) {
      console.error('Error loading dai ly data:', err);
      setErrorDaiLy('Không thể tải danh sách đại lý. Vui lòng thử lại.');
    } finally {
      setLoadingDaiLy(false);
    }
  };

  // Load dữ liệu lương cơ sở từ Supabase
  const loadBaseSalaryData = async () => {
    setBaseSalaryLoading(true);
    try {
      const baseSalary = await luongCoSoService.getCurrentLuongCoSo();
      setCurrentBaseSalary(baseSalary);

      // Cập nhật form data với lương cơ sở mới
      if (baseSalary) {
        setFormData(prev => ({
          ...prev,
          luongCoSo: luongCoSoService.formatNumber(baseSalary.mucluong)
        }));
      }
    } catch (err) {
      console.error('Error loading base salary data:', err);
      // Fallback to default value
      setFormData(prev => ({
        ...prev,
        luongCoSo: '2,340,000'
      }));
    } finally {
      setBaseSalaryLoading(false);
    }
  };

  // Load danh sách kê khai từ Supabase
  const loadKeKhaiData = async () => {
    setLoadingKeKhai(true);
    setErrorKeKhai(null);
    try {
      // Lọc kê khai theo loại (603) và sắp xếp theo ngày tạo mới nhất
      const searchParams: any = {
        loai_ke_khai: declarationCode,
        // Có thể thêm filter theo đại lý hoặc đơn vị nếu cần
      };

      // QUAN TRỌNG: Kiểm tra quyền user để quyết định filter
      let keKhaiData: any[] = [];
      if (user?.id) {
        console.log('🔍 Checking user permissions for:', user.id, user.email);

        // SECURITY FIX: Tạm thời force filter theo created_by để đảm bảo bảo mật
        // TODO: Cần kiểm tra lại logic phân quyền admin
        const FORCE_USER_FILTER = true; // Set false khi đã fix logic admin

        if (FORCE_USER_FILTER) {
          console.log('🔒 SECURITY: Force filtering by user ID for security');
          searchParams.created_by = user.id;
          keKhaiData = await keKhaiService.getKeKhaiList(searchParams);
        } else {
          const isAdmin = await keKhaiService.isUserAdmin(user.id);
          console.log('👤 User admin status:', isAdmin);

          if (isAdmin) {
            // Admin có thể xem tất cả kê khai (không filter theo created_by)
            console.log('🔓 Loading ALL ke khai for admin');
            keKhaiData = await keKhaiService.getKeKhaiListForAdmin(searchParams);
          } else {
            // Chỉ hiển thị kê khai của user hiện tại nếu không phải admin
            console.log('🔒 Loading ke khai ONLY for user:', user.id);
            searchParams.created_by = user.id;
            keKhaiData = await keKhaiService.getKeKhaiList(searchParams);
          }
        }
        console.log('📋 Loaded ke khai count:', keKhaiData.length);
      } else {
        // Nếu không có user, không hiển thị gì
        keKhaiData = [];
      }

      setKeKhaiList(keKhaiData);
    } catch (err) {
      console.error('Error loading ke khai data:', err);
      setErrorKeKhai('Không thể tải danh sách kê khai. Vui lòng thử lại.');
    } finally {
      setLoadingKeKhai(false);
    }
  };

  // Load danh sách người tham gia từ Supabase
  const loadParticipantsData = async () => {
    setLoadingParticipants(true);
    setErrorParticipants(null);
    try {
      if (!user?.id) {
        setParticipantsList([]);
        return;
      }

      console.log('🔍 Loading participants for user:', user.id);

      // Lấy danh sách kê khai của user trước
      const searchParams: any = {
        loai_ke_khai: declarationCode,
        created_by: user.id
      };

      const keKhaiData = await keKhaiService.getKeKhaiList(searchParams);
      console.log('📋 Found ke khai for participants:', keKhaiData.length);

      // Lấy tất cả người tham gia từ các kê khai này
      const allParticipants: any[] = [];

      for (const keKhai of keKhaiData) {
        try {
          const nguoiThamGiaList = await keKhaiService.getNguoiThamGiaByKeKhai(keKhai.id);

          // Thêm thông tin kê khai vào mỗi người tham gia
          const participantsWithKeKhai = nguoiThamGiaList.map(participant => ({
            ...participant,
            ke_khai: keKhai
          }));

          allParticipants.push(...participantsWithKeKhai);
        } catch (error) {
          console.error(`Error loading participants for ke khai ${keKhai.id}:`, error);
        }
      }

      // Sắp xếp theo ngày tạo mới nhất
      allParticipants.sort((a, b) =>
        new Date(b.ke_khai.created_at || '').getTime() - new Date(a.ke_khai.created_at || '').getTime()
      );

      console.log('👥 Loaded participants count:', allParticipants.length);
      setParticipantsList(allParticipants);
    } catch (err) {
      console.error('Error loading participants data:', err);
      setErrorParticipants('Không thể tải danh sách người tham gia. Vui lòng thử lại.');
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadDonViData();
    loadDaiLyData();
    loadBaseSalaryData();
    loadKeKhaiData();
    loadParticipantsData();
  }, []);

  // Load participants data when component mounts
  useEffect(() => {
    loadParticipantsData();
  }, []);

  // Reset selection when participants data changes
  useEffect(() => {
    setSelectedParticipants(new Set());
    setSelectAllParticipants(false);
  }, [participantsList]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Xử lý khi chọn đại lý từ component mới
  const handleNewDaiLyChange = (daiLyId: number | null) => {
    handleInputChange('chonDaiLy', daiLyId ? daiLyId.toString() : '');
  };

  // Xử lý khi chọn đơn vị từ component mới
  const handleNewDonViChange = (donViId: number | null) => {
    const donViIdString = donViId ? donViId.toString() : '';

    // Sử dụng logic từ handleDonViChange để tự động điền đối tượng tham gia
    const selectedDonViData = donViList.find(dv => dv.id === donViId);
    setSelectedDonVi(selectedDonViData || null);

    // Cập nhật form data
    handleInputChange('chonDonVi', donViIdString);

    // Tự động điền đối tượng tham gia dựa trên khối KCB
    if (selectedDonViData && selectedDonViData.ma_khoi_kcb) {
      let doiTuongText = `${selectedDonViData.ma_khoi_kcb} - ${selectedDonViData.ten_khoi_kcb}`;

      // Rút ngắn chuỗi nếu quá 100 ký tự để tránh lỗi database
      if (doiTuongText.length > 100) {
        doiTuongText = doiTuongText.substring(0, 97) + '...';
      }

      handleInputChange('doiTuongThamGia', doiTuongText);
    } else if (!selectedDonViData) {
      // Reset về mặc định khi không chọn đơn vị
      handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');
    }
  };

  // Xử lý khi chọn đơn vị (legacy - giữ lại cho tương thích)
  const handleDonViChange = (donViId: string) => {
    const selectedDonViData = donViList.find(dv => dv.id.toString() === donViId);
    setSelectedDonVi(selectedDonViData || null);

    // Cập nhật form data
    handleInputChange('chonDonVi', donViId);

    // Tự động điền đối tượng tham gia dựa trên khối KCB
    if (selectedDonViData && selectedDonViData.ma_khoi_kcb) {
      let doiTuongText = `${selectedDonViData.ma_khoi_kcb} - ${selectedDonViData.ten_khoi_kcb}`;

      // Rút ngắn chuỗi nếu quá 100 ký tự để tránh lỗi database
      if (doiTuongText.length > 100) {
        doiTuongText = doiTuongText.substring(0, 97) + '...';
      }

      handleInputChange('doiTuongThamGia', doiTuongText);
    } else if (!selectedDonViData) {
      // Reset về mặc định khi không chọn đơn vị
      handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');
    }
  };

  // Xử lý khi chọn đại lý
  const handleDaiLyChange = async (daiLyId: string) => {
    const selectedDaiLyData = daiLyList.find(dl => dl.id.toString() === daiLyId);
    setSelectedDaiLy(selectedDaiLyData || null);

    // Cập nhật form data
    handleInputChange('chonDaiLy', daiLyId);

    // Tự động lọc đơn vị theo đại lý được chọn
    if (selectedDaiLyData) {
      try {
        setLoadingDonVi(true);
        const donViByDaiLy = await daiLyService.getDonViByDaiLy(selectedDaiLyData.id);
        setFilteredDonViList(donViByDaiLy);

        // Reset đơn vị đã chọn vì danh sách đã thay đổi
        setSelectedDonVi(null);
        handleInputChange('chonDonVi', '');
        handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');

        console.log('Filtered don vi by dai ly:', donViByDaiLy);
      } catch (err) {
        console.error('Error loading don vi by dai ly:', err);
        setErrorDonVi('Không thể tải danh sách đơn vị cho đại lý này.');
      } finally {
        setLoadingDonVi(false);
      }
    } else {
      // Reset về tất cả đơn vị khi không chọn đại lý
      setFilteredDonViList(donViList);
      setSelectedDonVi(null);
      handleInputChange('chonDonVi', '');
      handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');
    }
  };

  const handleSave = () => {
    console.log('Saving declaration:', formData);
    // Implement save logic
  };

  const handleSubmit = async () => {
    console.log('Creating new declaration:', formData);
    console.log('User info:', user);
    console.log('User organizations:', user?.organizations);
    console.log('Current organization:', user?.currentOrganization);

    // Validate required fields first
    if (!formData.chonDonVi) {
      // For testing purposes, allow creating declaration without selecting unit
      console.warn('No unit selected, creating declaration for testing purposes');
    }

    // Validate user organization
    if (!user?.currentOrganization) {
      if (!user?.organizations || user.organizations.length === 0) {
        alert('Tài khoản của bạn chưa được gán vào tổ chức nào. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
      } else {
        alert('Vui lòng chọn tổ chức trước khi tạo kê khai mới. Bạn có thể chọn tổ chức ở góc trên bên phải.');
      }
      return;
    }

    try {
      setIsCreating(true);

      // Prepare organization data based on user's current organization
      const organizationData: { cong_ty_id?: number; co_quan_bhxh_id?: number } = {};
      if (user.currentOrganization.organization_type === 'cong_ty') {
        organizationData.cong_ty_id = user.currentOrganization.organization_id;
      } else if (user.currentOrganization.organization_type === 'co_quan_bhxh') {
        organizationData.co_quan_bhxh_id = user.currentOrganization.organization_id;
      }

      // Prepare data for creating new declaration
      const keKhaiData = {
        ten_ke_khai: declarationName,
        loai_ke_khai: declarationCode,
        dai_ly_id: formData.chonDaiLy ? parseInt(formData.chonDaiLy) : undefined,
        don_vi_id: formData.chonDonVi ? parseInt(formData.chonDonVi) : undefined,
        doi_tuong_tham_gia: formData.doiTuongThamGia,
        hinh_thuc_tinh: formData.hinhThucTinh,
        luong_co_so: formData.luongCoSo ? parseFloat(formData.luongCoSo.replace(/[.,]/g, '')) : undefined,
        nguon_dong: formData.nguonDong,
        noi_dang_ky_kcb_ban_dau: formData.noiDangKyKCBBanDau || undefined,
        bien_lai_ngay_tham_gia: formData.bienLaiNgayThamGia || undefined,
        so_thang: formData.soThang ? parseInt(formData.soThang) : undefined,
        ngay_tao: formData.ngay || undefined,
        ty_le_nsnn_ho_tro: formData.tyLeNSNNHoTro ? parseFloat(formData.tyLeNSNNHoTro) : undefined,
        ghi_chu: formData.ghiChu || undefined,
        created_by: user.id || 'system',
        ...organizationData // Add organization fields
      };

      // Create new declaration in database
      const newKeKhai = await keKhaiService.createKeKhai(keKhaiData);

      // Reload the list to show the new declaration
      await loadKeKhaiData();

      // Navigate to the new declaration form
      setCurrentPage('ke-khai-603-form', {
        declarationCode,
        declarationName,
        formData,
        keKhaiId: newKeKhai.id
      });

      console.log(`Đã tạo kê khai mới: ${newKeKhai.ma_ke_khai}`);
    } catch (error) {
      console.error('Error creating new declaration:', error);
      alert('Có lỗi xảy ra khi tạo kê khai mới. Vui lòng thử lại.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleExport = () => {
    console.log('Exporting declaration:', formData);
    // Implement export logic
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (keKhai: DanhSachKeKhai) => {
    setDeleteModal({
      isOpen: true,
      keKhai,
      isDeleting: false
    });
  };

  // Đóng modal xác nhận xóa
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      keKhai: null,
      isDeleting: false
    });
  };

  // Xóa kê khai
  const handleDeleteKeKhai = async () => {
    if (!deleteModal.keKhai) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await keKhaiService.deleteKeKhai(deleteModal.keKhai.id);

      // Cập nhật danh sách local
      setKeKhaiList(prev => prev.filter(kk => kk.id !== deleteModal.keKhai!.id));

      // Đóng modal
      closeDeleteModal();

      // Có thể thêm toast notification ở đây
      console.log(`Đã xóa kê khai ${deleteModal.keKhai.ma_ke_khai} thành công`);
    } catch (error) {
      console.error('Error deleting ke khai:', error);
      // Có thể thêm toast error ở đây
      alert('Có lỗi xảy ra khi xóa kê khai. Vui lòng thử lại.');
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Tạo thanh toán cho kê khai - DEPRECATED: QR codes are now created only after synthesis staff approval
  const handleCreatePayment = async (keKhai: DanhSachKeKhai) => {
    try {
      setCreatingPayment(keKhai.id);

      // Tính tổng số tiền cần thanh toán
      const totalAmount = await paymentService.calculateTotalAmount(keKhai.id);

      // Tạo yêu cầu thanh toán
      const payment = await paymentService.createPayment({
        ke_khai_id: keKhai.id,
        so_tien: totalAmount,
        phuong_thuc_thanh_toan: 'qr_code',
        payment_description: `Thanh toán kê khai ${keKhai.ma_ke_khai}`,
        created_by: user?.id
      });

      // Cập nhật trạng thái kê khai thành pending_payment
      await keKhaiService.updateKeKhai(keKhai.id, {
        trang_thai: 'pending_payment',
        payment_status: 'pending',
        total_amount: totalAmount,
        payment_required_at: new Date().toISOString(),
        payment_id: payment.id,
        updated_at: new Date().toISOString(),
        updated_by: user?.id
      } as any);

      // Reload danh sách để cập nhật trạng thái
      await loadKeKhaiData();

      // Hiển thị modal thanh toán
      setSelectedPayment(payment);
      setShowPaymentModal(true);

      showToast('Đã tạo yêu cầu thanh toán thành công!', 'success');
    } catch (error) {
      console.error('Error creating payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo thanh toán';
      showToast(errorMessage, 'error');
    } finally {
      setCreatingPayment(null);
    }
  };

  // Xem thanh toán
  const handleViewPayment = async (keKhai: DanhSachKeKhai) => {
    try {
      const payment = await paymentService.getPaymentByKeKhaiId(keKhai.id);
      if (payment) {
        setSelectedPayment(payment);
        setShowPaymentModal(true);
      } else {
        showToast('Không tìm thấy thông tin thanh toán', 'error');
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
      showToast('Không thể lấy thông tin thanh toán', 'error');
    }
  };

  // Copy mã kê khai
  const handleCopyKeKhaiCode = async (keKhai: DanhSachKeKhai) => {
    try {
      await navigator.clipboard.writeText(keKhai.ma_ke_khai);
      setCopiedKeKhaiId(keKhai.id);
      showToast(`Đã copy mã kê khai: ${keKhai.ma_ke_khai}`, 'success');

      // Reset trạng thái copy sau 2 giây
      setTimeout(() => {
        setCopiedKeKhaiId(null);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Không thể copy mã kê khai', 'error');
    }
  };

  // Copy mã hồ sơ
  const handleCopyHoSoCode = async (keKhai: DanhSachKeKhai) => {
    if (!keKhai.ma_ho_so) {
      showToast('Không có mã hồ sơ để copy', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(keKhai.ma_ho_so);
      setCopiedHoSoId(keKhai.id);
      showToast(`Đã copy mã hồ sơ: ${keKhai.ma_ho_so}`, 'success');

      // Reset trạng thái copy sau 2 giây
      setTimeout(() => {
        setCopiedHoSoId(null);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Không thể copy mã hồ sơ', 'error');
    }
  };

  // Bắt đầu chỉnh sửa mã hồ sơ
  const handleStartEditHoSo = (keKhai: DanhSachKeKhai) => {
    setEditingHoSoId(keKhai.id);
    setEditingHoSoValue(keKhai.ma_ho_so || '');
  };

  // Hủy chỉnh sửa mã hồ sơ
  const handleCancelEditHoSo = () => {
    setEditingHoSoId(null);
    setEditingHoSoValue('');
  };

  // Lưu mã hồ sơ
  const handleSaveHoSo = async (keKhaiId: number) => {
    console.log('handleSaveHoSo called:', { keKhaiId, editingHoSoValue });
    setSavingHoSo(keKhaiId);
    try {
      const maHoSo = editingHoSoValue.trim() || null;
      console.log('Calling updateMaHoSo with:', { keKhaiId, maHoSo });

      await keKhaiService.updateMaHoSo(keKhaiId, maHoSo);

      // Cập nhật danh sách kê khai
      setKeKhaiList(prev => prev.map(item =>
        item.id === keKhaiId
          ? { ...item, ma_ho_so: maHoSo }
          : item
      ));

      setEditingHoSoId(null);
      setEditingHoSoValue('');
      showToast(
        maHoSo
          ? 'Đã cập nhật mã hồ sơ thành công'
          : 'Đã xóa mã hồ sơ thành công',
        'success'
      );
    } catch (error) {
      console.error('Error updating ma ho so:', error);
      showToast(`Không thể cập nhật mã hồ sơ: ${error.message}`, 'error');
    } finally {
      setSavingHoSo(null);
    }
  };

  // Xử lý phím Enter khi chỉnh sửa mã hồ sơ
  const handleHoSoKeyPress = (e: React.KeyboardEvent, keKhaiId: number) => {
    if (e.key === 'Enter') {
      handleSaveHoSo(keKhaiId);
    } else if (e.key === 'Escape') {
      handleCancelEditHoSo();
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (keKhaiId: number) => {
    setOpenDropdownId(openDropdownId === keKhaiId ? null : keKhaiId);
  };

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdownId]);

  // Đóng dropdown khi nhấn Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [openDropdownId]);

  // Đóng modal thanh toán
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  // Xử lý khi thanh toán được xác nhận
  const handlePaymentConfirmed = async () => {
    // Reload danh sách để cập nhật trạng thái
    await loadKeKhaiData();
    handleClosePaymentModal();
    showToast('Thanh toán đã được xác nhận!', 'success');
  };

  // Kiểm tra xem kê khai có cần thanh toán không (chỉ sau khi được duyệt)
  const needsPayment = (keKhai: DanhSachKeKhai): boolean => {
    // QR code chỉ được tạo sau khi synthesis staff duyệt, không phải ngay khi collection staff submit
    return false; // Removed automatic payment creation for submitted declarations
  };

  // Kiểm tra xem kê khai có đang chờ thanh toán không (sau khi được duyệt)
  const isPendingPayment = (keKhai: DanhSachKeKhai): boolean => {
    return keKhai.trang_thai === 'pending_payment' || keKhai.payment_status === 'pending';
  };

  // Kiểm tra xem kê khai đã thanh toán chưa
  const isPaid = (keKhai: DanhSachKeKhai): boolean => {
    return keKhai.trang_thai === 'paid' || keKhai.payment_status === 'completed';
  };

  // Format currency for display
  const formatCurrency = (amount: number | string | null | undefined): string => {
    if (!amount || amount === 0) return '0';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN').format(numAmount);
  };

  // Format date helper
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return '';
    }
  };

  // Get status color for participants
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending_payment':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Get status text for participants
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Nháp';
      case 'submitted':
        return 'Đã nộp';
      case 'processing':
        return 'Đang xử lý';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending_payment':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      default:
        return status;
    }
  };

  // Handle select all participants
  const handleSelectAllParticipants = (checked: boolean) => {
    setSelectAllParticipants(checked);
    if (checked) {
      const allIds = new Set(participantsList.map(p => `${p.ke_khai.id}-${p.id}`));
      setSelectedParticipants(allIds);
    } else {
      setSelectedParticipants(new Set());
    }
  };

  // Handle individual participant selection
  const handleParticipantSelection = (participantKey: string, checked: boolean) => {
    const newSelected = new Set(selectedParticipants);
    if (checked) {
      newSelected.add(participantKey);
    } else {
      newSelected.delete(participantKey);
    }
    setSelectedParticipants(newSelected);

    // Update select all state
    setSelectAllParticipants(newSelected.size === participantsList.length);
  };

  // Get total amount for display
  const getTotalAmountDisplay = (keKhai: DanhSachKeKhai): string => {
    if (keKhai.total_amount && keKhai.total_amount > 0) {
      return formatCurrency(keKhai.total_amount);
    }
    return 'Chưa tính';
  };

  // Xuất Excel D03-TK1-VNPT
  const handleExportD03TK1Excel = async (keKhai: DanhSachKeKhai) => {
    try {
      setExportingExcel(keKhai.id);

      // Lấy danh sách người tham gia
      const participants = await keKhaiService.getNguoiThamGiaByKeKhai(keKhai.id);

      if (!participants || participants.length === 0) {
        showToast('Kê khai này chưa có người tham gia nào để xuất Excel', 'warning');
        return;
      }

      // Lấy thông tin mã nhân viên từ user hiện tại
      let maNhanVienThu = '';
      if (user?.id) {
        try {
          // Import nguoiDungService để lấy thông tin user đầy đủ
          const { default: nguoiDungService } = await import('../../quan-ly/services/nguoiDungService');
          const userInfo = await nguoiDungService.getNguoiDungById(parseInt(user.id));
          maNhanVienThu = userInfo?.ma_nhan_vien || '';
        } catch (error) {
          console.warn('Could not get user employee code:', error);
          maNhanVienThu = user.id; // Fallback to user ID
        }
      }

      // Convert database format to UI format for export
      const convertedParticipants = participants.map(item => ({
        id: item.id,
        hoTen: item.ho_ten || '',
        maSoBHXH: item.ma_so_bhxh || '',
        ngaySinh: item.ngay_sinh || '',
        gioiTinh: item.gioi_tinh || 'Nam',
        noiDangKyKCB: item.noi_dang_ky_kcb || '',
        tinhKCB: item.tinh_kcb || '',
        maBenhVien: item.ma_benh_vien || '',
        tenBenhVien: item.noi_dang_ky_kcb || '',
        mucLuong: item.muc_luong?.toString() || '',
        tyLeDong: item.ty_le_dong?.toString() || '100',
        soTienDong: item.tien_dong?.toString() || '', // Sử dụng tien_dong thay vì so_tien_dong
        tienDongThucTe: item.tien_dong_thuc_te, // Thêm trường tienDongThucTe
        tuNgayTheCu: item.tu_ngay_the_cu || '',
        denNgayTheCu: item.den_ngay_the_cu || '',
        ngayBienLai: item.ngay_bien_lai || new Date().toISOString().split('T')[0],
        sttHo: item.stt_ho || '',
        soThangDong: item.so_thang_dong?.toString() || '',
        maTinhNkq: item.ma_tinh_nkq || '',
        maHuyenNkq: item.ma_huyen_nkq || '',
        maXaNkq: item.ma_xa_nkq || '',
        noiNhanHoSo: item.noi_nhan_ho_so || '',
        soCCCD: item.so_cccd || '',
        maHoGiaDinh: item.ma_ho_gia_dinh || '',
        phuongAn: item.phuong_an || 'ON',
        maTinhKS: item.ma_tinh_ks || '',
        maHuyenKS: item.ma_huyen_ks || '',
        maXaKS: item.ma_xa_ks || ''
      }));

      // Xuất Excel với mã nhân viên thu
      await exportD03TK1VNPTExcel(convertedParticipants, keKhai, maNhanVienThu);

      showToast('Đã xuất file Excel D03-TK1-VNPT thành công!', 'success');
    } catch (error) {
      console.error('Error exporting D03-TK1-VNPT Excel:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xuất Excel';
      showToast(errorMessage, 'error');
    } finally {
      setExportingExcel(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Tạo kê khai</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 break-words">
            {declarationCode} - {declarationName}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={() => {
              loadDonViData();
              loadDaiLyData();
              loadBaseSalaryData();
              loadKeKhaiData();
              loadParticipantsData();
            }}
            disabled={loadingDonVi || loadingDaiLy || baseSalaryLoading || loadingKeKhai || loadingParticipants}
            className="flex items-center justify-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-3 sm:py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors min-h-[44px] text-sm sm:text-base disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${(loadingDonVi || loadingDaiLy || baseSalaryLoading || loadingKeKhai || loadingParticipants) ? 'animate-spin' : ''}`} />
            <span>{(loadingDonVi || loadingDaiLy || baseSalaryLoading || loadingKeKhai || loadingParticipants) ? 'Đang tải...' : 'Tải dữ liệu'}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[44px] text-sm sm:text-base"
          >
            <Save className="w-4 h-4" />
            <span>Lưu C4S</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-3 sm:py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors min-h-[44px] text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span>Import tờ khai</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.chonDonVi || isCreating}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
          >
            {isCreating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isCreating ? 'Đang tạo...' : 'Thêm Mới'}</span>
          </button>
        </div>
      </div>

      {/* Error Alerts */}
      {errorDonVi && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{errorDonVi}</span>
            <button
              onClick={loadDonViData}
              className="ml-auto flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {errorDaiLy && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{errorDaiLy}</span>
            <button
              onClick={loadDaiLyData}
              className="ml-auto flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {errorKeKhai && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{errorKeKhai}</span>
            <button
              onClick={loadKeKhaiData}
              className="ml-auto flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {errorParticipants && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{errorParticipants}</span>
            <button
              onClick={loadParticipantsData}
              className="ml-auto flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Thông tin đại lý Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Thông tin đại lý</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
              <span>Đại lý và đơn vị được tự động chọn theo tài khoản</span>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bienLaiDienTu"
                checked={formData.bienLaiDienTu}
                onChange={(e) => handleInputChange('bienLaiDienTu', e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="bienLaiDienTu" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                Biên lai điện tử
              </label>
            </div>
            {/* Component mới để chọn đại lý và đơn vị */}
            <DaiLyDonViSelector
              onDaiLyChange={handleNewDaiLyChange}
              onDonViChange={handleNewDonViChange}
              selectedDonViId={formData.chonDonVi ? parseInt(formData.chonDonVi) : null}
            />
          </div>
        </div>

        {/* Nghiệp vụ Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Nghiệp vụ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đối tượng tham gia
              </label>
              <input
                type="text"
                value={formData.doiTuongThamGia}
                onChange={(e) => handleInputChange('doiTuongThamGia', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="Nhập đối tượng tham gia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nguồn đóng (*)
              </label>
              <input
                type="text"
                value={formData.nguonDong}
                onChange={(e) => handleInputChange('nguonDong', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                placeholder="Nhập nguồn đóng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hình thức tính
              </label>
              <select
                value={formData.hinhThucTinh}
                onChange={(e) => handleInputChange('hinhThucTinh', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              >
                <option value="Không được ngân sách nhà nước hỗ trợ">Không được ngân sách nhà nước hỗ trợ</option>
                <option value="Hỗ trợ dựa trên mức đóng của người thụ hưởng chưa giảm trừ">Hỗ trợ dựa trên mức đóng của người thụ hưởng chưa giảm trừ</option>
                <option value="Hỗ trợ dựa trên mức đóng từng người">Hỗ trợ dựa trên mức đóng từng người</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lương cơ sở
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={baseSalaryLoading
                    ? "Đang tải..."
                    : formData.luongCoSo || "2,340,000"
                  }
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base bg-gray-50 dark:bg-gray-600"
                  placeholder="Lương cơ sở hiện tại"
                  readOnly
                />
                {currentBaseSalary && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                    {currentBaseSalary.thanghienthi}
                  </div>
                )}
              </div>
              {currentBaseSalary?.ghichu && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {currentBaseSalary.ghichu}
                </p>
              )}
              {!baseSalaryLoading && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Lương cơ sở được tự động cập nhật từ hệ thống
                </p>
              )}
            </div>
          </div>
        </div>


      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Danh sách người tham gia
              </h3>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
              {loadingParticipants ? (
                <span className="flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Đang tải...</span>
                </span>
              ) : (
                <span>
                  Có <strong className="text-blue-600 dark:text-blue-400">{participantsList.length}</strong> người tham gia
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile-friendly table */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {loadingParticipants ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                <p className="text-sm sm:text-base">Đang tải danh sách người tham gia...</p>
              </div>
            ) : participantsList.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm sm:text-base">Chưa có người tham gia nào</p>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Tạo kê khai và thêm người tham gia để xem danh sách
                </p>
              </div>
            ) : (
              // Participants Content
              loadingParticipants ? (
                <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                  <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                  <p className="text-sm sm:text-base">Đang tải danh sách người tham gia...</p>
                </div>
              ) : participantsList.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base">Chưa có người tham gia nào</p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Tạo kê khai và thêm người tham gia để xem danh sách
                  </p>
                </div>
              ) : (
                <>
                  {/* Action buttons */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Xuất TK1-TS
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Xuất D03/D05
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Xuất D03/D05 (Excel)
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Xuất file (Excel)
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      In C45
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Xuất Excel
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Sao chép
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      Tra Cứu
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse" style={{minWidth: '2000px'}}>
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '40px', minWidth: '40px'}}>
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selectAllParticipants}
                            onChange={(e) => handleSelectAllParticipants(e.target.checked)}
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
                          Số CCCD
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                          Ngày sinh
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                          Giới tính
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                          Số ĐT
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
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                          Tỷ lệ (%)
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                          Số tiền đóng
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                          Số tháng đóng
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                          STT hộ
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                          Ngày biên lai
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                          Mã kê khai
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {participantsList.map((participant, index) => {
                        const participantKey = `${participant.ke_khai.id}-${participant.id}`;
                        return (
                        <tr key={participantKey} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '40px', minWidth: '40px'}}>
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedParticipants.has(participantKey)}
                              onChange={(e) => handleParticipantSelection(participantKey, e.target.checked)}
                            />
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '50px', minWidth: '50px'}}>
                            {index + 1}
                          </td>
                          <td className="px-2 py-2 text-left text-xs border border-gray-300" style={{width: '150px', minWidth: '150px'}}>
                            <div className="truncate" title={participant.ho_ten}>
                              {participant.ho_ten}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 font-mono whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                            {participant.ma_so_bhxh || ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 font-mono whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                            {participant.so_cccd || ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                            {participant.ngay_sinh ?
                              formatDate(participant.ngay_sinh) : ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                            {participant.gioi_tinh === 'Nam' ? 'Nam' : 'Nữ'}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                            {participant.so_dien_thoai || ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 font-mono whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                            {participant.so_the_bhyt || ''}
                          </td>
                          <td className="px-2 py-2 text-left text-xs border border-gray-300" style={{width: '200px', minWidth: '200px'}}>
                            <div className="truncate" title={participant.noi_dang_ky_kcb}>
                              {participant.noi_dang_ky_kcb || ''}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-right text-xs border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                            {participant.muc_luong ?
                              formatCurrency(participant.muc_luong) : ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                            {participant.ty_le_dong || '100'}%
                          </td>
                          <td className="px-2 py-2 text-right text-xs border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                            {participant.tien_dong_thuc_te ?
                              formatCurrency(participant.tien_dong_thuc_te) :
                              participant.tien_dong ?
                              formatCurrency(participant.tien_dong) : '0'}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '80px', minWidth: '80px'}}>
                            {participant.so_thang_dong || ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '70px', minWidth: '70px'}}>
                            {participant.stt_ho || ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '90px', minWidth: '90px'}}>
                            {participant.ngay_bien_lai ?
                              formatDate(participant.ngay_bien_lai) : ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 font-mono whitespace-nowrap" style={{width: '120px', minWidth: '120px'}}>
                            {participant.ke_khai.ma_ke_khai || ''}
                          </td>
                          <td className="px-2 py-2 text-center text-xs border border-gray-300 whitespace-nowrap" style={{width: '100px', minWidth: '100px'}}>
                            <span className={`px-1 py-1 rounded text-white text-xs whitespace-nowrap ${
                              participant.ke_khai.trang_thai === 'submitted' ? 'bg-blue-500' :
                              participant.ke_khai.trang_thai === 'approved' ? 'bg-green-500' :
                              participant.ke_khai.trang_thai === 'rejected' ? 'bg-red-500' :
                              participant.ke_khai.trang_thai === 'paid' ? 'bg-green-600' :
                              participant.ke_khai.trang_thai === 'pending_payment' ? 'bg-orange-500' :
                              'bg-gray-500'
                            }`}>
                              {getStatusText(participant.ke_khai.trang_thai)}
                            </span>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Xác nhận xóa kê khai
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Bạn có chắc chắn muốn xóa kê khai{' '}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {deleteModal.keKhai?.ma_ke_khai}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Tất cả dữ liệu liên quan bao gồm danh sách người tham gia sẽ bị xóa vĩnh viễn.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteModal.isDeleting}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteKeKhai}
                  disabled={deleteModal.isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deleteModal.isDeleting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa kê khai</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment QR Modal */}
      {showPaymentModal && selectedPayment && (
        <PaymentQRModal
          payment={selectedPayment}
          onClose={handleClosePaymentModal}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}

    </div>
  );
};

export default KeKhai603;

