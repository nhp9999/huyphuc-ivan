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
  QrCode
} from 'lucide-react';
import DaiLyDonViSelector from '../components/DaiLyDonViSelector';
import PaymentQRModal from '../components/PaymentQRModal';
import { useToast } from '../../../shared/hooks/useToast';

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
        const isAdmin = await keKhaiService.isUserAdmin(user.id);
        if (isAdmin) {
          // Admin có thể xem tất cả kê khai (không filter theo created_by)
          keKhaiData = await keKhaiService.getKeKhaiListForAdmin(searchParams);
        } else {
          // Chỉ hiển thị kê khai của user hiện tại nếu không phải admin
          searchParams.created_by = user.id;
          keKhaiData = await keKhaiService.getKeKhaiList(searchParams);
        }
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

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadDonViData();
    loadDaiLyData();
    loadBaseSalaryData();
    loadKeKhaiData();
  }, []);

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
    handleInputChange('chonDonVi', donViId ? donViId.toString() : '');

    // Reset đối tượng tham gia về mặc định khi thay đổi đơn vị
    handleInputChange('doiTuongThamGia', 'GD - Hộ gia đình');
  };

  // Xử lý khi chọn đơn vị (legacy - giữ lại cho tương thích)
  const handleDonViChange = (donViId: string) => {
    const selectedDonViData = donViList.find(dv => dv.id.toString() === donViId);
    setSelectedDonVi(selectedDonViData || null);

    // Cập nhật form data
    handleInputChange('chonDonVi', donViId);

    // Tự động điền đối tượng tham gia dựa trên khối KCB
    if (selectedDonViData && selectedDonViData.ma_khoi_kcb) {
      const doiTuongText = `${selectedDonViData.ma_khoi_kcb} - ${selectedDonViData.ten_khoi_kcb}`;
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

  // Tạo thanh toán cho kê khai
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

  // Kiểm tra xem kê khai có cần thanh toán không
  const needsPayment = (keKhai: DanhSachKeKhai): boolean => {
    return keKhai.trang_thai === 'submitted' && !keKhai.payment_status;
  };

  // Kiểm tra xem kê khai có đang chờ thanh toán không
  const isPendingPayment = (keKhai: DanhSachKeKhai): boolean => {
    return keKhai.trang_thai === 'pending_payment' || keKhai.payment_status === 'pending';
  };

  // Kiểm tra xem kê khai đã thanh toán chưa
  const isPaid = (keKhai: DanhSachKeKhai): boolean => {
    return keKhai.trang_thai === 'paid' || keKhai.payment_status === 'completed';
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
            }}
            disabled={loadingDonVi || loadingDaiLy || baseSalaryLoading || loadingKeKhai}
            className="flex items-center justify-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-3 sm:py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors min-h-[44px] text-sm sm:text-base disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${(loadingDonVi || loadingDaiLy || baseSalaryLoading || loadingKeKhai) ? 'animate-spin' : ''}`} />
            <span>{(loadingDonVi || loadingDaiLy || baseSalaryLoading || loadingKeKhai) ? 'Đang tải...' : 'Tải dữ liệu'}</span>
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
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
              Danh sách kê khai
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loadingKeKhai ? (
                <span className="flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Đang tải...</span>
                </span>
              ) : (
                <span>
                  Có <strong className="text-blue-600 dark:text-blue-400">{keKhaiList.length}</strong> kê khai
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile-friendly table */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {loadingKeKhai ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                <p className="text-sm sm:text-base">Đang tải danh sách kê khai...</p>
              </div>
            ) : keKhaiList.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm sm:text-base">Chưa có kê khai nào</p>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Nhấn "Thêm Mới" để tạo kê khai đầu tiên
                </p>
              </div>
            ) : (
              <>
                {/* Table header - hidden on mobile, shown on larger screens */}
                <div className="hidden lg:block bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="col-span-2">Mã kê khai</div>
                    <div className="col-span-2">Tên kê khai</div>
                    <div className="col-span-2">Đối tượng tham gia</div>
                    <div className="col-span-1">Trạng thái</div>
                    <div className="col-span-1">Thanh toán</div>
                    <div className="col-span-2">Ngày tạo</div>
                    <div className="col-span-2">Thao tác</div>
                  </div>
                </div>

                {/* Table rows */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {keKhaiList.map((keKhai, index) => (
                    <div key={keKhai.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {/* Mobile layout */}
                      <div className="lg:hidden space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {keKhai.ma_ke_khai}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            keKhai.trang_thai === 'draft'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : keKhai.trang_thai === 'submitted'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {keKhai.trang_thai === 'draft' ? 'Nháp' :
                             keKhai.trang_thai === 'submitted' ? 'Đã nộp' : keKhai.trang_thai}
                          </span>
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {keKhai.ten_ke_khai}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {keKhai.doi_tuong_tham_gia || 'Chưa xác định'}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(keKhai.created_at || '').toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentPage('ke-khai-603-form', {
                                declarationCode,
                                declarationName,
                                formData: {},
                                keKhaiId: keKhai.id
                              });
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Xem chi tiết</span>
                          </button>

                          {/* Payment button for mobile */}
                          {needsPayment(keKhai) && (
                            <button
                              onClick={() => handleCreatePayment(keKhai)}
                              disabled={creatingPayment === keKhai.id}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                              title="Tạo thanh toán"
                            >
                              {creatingPayment === keKhai.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CreditCard className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {isPendingPayment(keKhai) && (
                            <button
                              onClick={() => handleViewPayment(keKhai)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                              title="Xem QR thanh toán"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => openDeleteModal(keKhai)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-2 lg:items-center">
                        <div className="col-span-2 font-medium text-blue-600 dark:text-blue-400">
                          {keKhai.ma_ke_khai}
                        </div>
                        <div className="col-span-2 text-sm text-gray-900 dark:text-white">
                          {keKhai.ten_ke_khai}
                        </div>
                        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                          {keKhai.doi_tuong_tham_gia || 'Chưa xác định'}
                        </div>
                        <div className="col-span-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            keKhai.trang_thai === 'draft'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : keKhai.trang_thai === 'submitted'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : keKhai.trang_thai === 'pending_payment'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                              : keKhai.trang_thai === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {keKhai.trang_thai === 'draft' ? 'Nháp' :
                             keKhai.trang_thai === 'submitted' ? 'Đã nộp' :
                             keKhai.trang_thai === 'pending_payment' ? 'Chờ thanh toán' :
                             keKhai.trang_thai === 'paid' ? 'Đã thanh toán' : keKhai.trang_thai}
                          </span>
                        </div>
                        <div className="col-span-1">
                          {isPaid(keKhai) ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Đã thanh toán
                            </span>
                          ) : isPendingPayment(keKhai) ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                              Chờ thanh toán
                            </span>
                          ) : needsPayment(keKhai) ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Cần thanh toán
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                              Chưa xác định
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(keKhai.created_at || '').toLocaleDateString('vi-VN')}
                        </div>
                        <div className="col-span-2 flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentPage('ke-khai-603-form', {
                                declarationCode,
                                declarationName,
                                formData: {},
                                keKhaiId: keKhai.id
                              });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Xem chi tiết</span>
                          </button>

                          {/* Payment buttons for desktop */}
                          {needsPayment(keKhai) && (
                            <button
                              onClick={() => handleCreatePayment(keKhai)}
                              disabled={creatingPayment === keKhai.id}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-2 py-1 rounded text-sm transition-colors flex items-center justify-center"
                              title="Tạo thanh toán"
                            >
                              {creatingPayment === keKhai.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <CreditCard className="w-3 h-3" />
                              )}
                            </button>
                          )}

                          {isPendingPayment(keKhai) && (
                            <button
                              onClick={() => handleViewPayment(keKhai)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-sm transition-colors flex items-center justify-center"
                              title="Xem QR thanh toán"
                            >
                              <QrCode className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => openDeleteModal(keKhai)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm transition-colors flex items-center justify-center"
                            title="Xóa kê khai"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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

