import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/contexts/AuthContext';
import nguoiDungService from '../../quan-ly/services/nguoiDungService';

interface DaiLyInfo {
  id: number;
  ma: string;
  ten: string;
  cap?: number;
  has_children: boolean;
  cha_id?: number;
  is_clickable: boolean;
  is_current: boolean;
  ma_tinh?: string;
  type?: number;
  is_dai_ly: boolean;
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  ten_cha?: string;
  ma_cha?: string;
  loai_dai_ly: string;
  ten_cap: string;
}

interface DonViInfo {
  id: number;
  dai_ly_id: number;
  don_vi_id: number;
  ma_dai_ly: string;
  ten_dai_ly: string;
  ma_don_vi: string;
  ten_don_vi: string;
  ma_co_quan_bhxh?: string;
  ma_so_bhxh?: string;
  is_bhxh_tn?: boolean;
  is_bhyt?: boolean;
  type?: number;
  trang_thai: string;
  ngay_lien_ket?: string;
  ghi_chu?: string;
}

export const useUserDaiLyDonVi = () => {
  const { user } = useAuth();
  const [userDaiLy, setUserDaiLy] = useState<DaiLyInfo[]>([]);
  const [selectedDaiLy, setSelectedDaiLy] = useState<DaiLyInfo | null>(null);
  const [donViList, setDonViList] = useState<DonViInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load đại lý của user dựa trên tổ chức hiện tại
  const loadUserDaiLy = async () => {
    if (!user?.currentOrganization) {
      setUserDaiLy([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const daiLyData = await nguoiDungService.getUserDaiLy(
        parseInt(user.id),
        user.currentOrganization.organization_type,
        user.currentOrganization.organization_id
      );

      setUserDaiLy(daiLyData);

      // Tự động chọn đại lý đầu tiên nếu chỉ có 1 đại lý
      if (daiLyData.length === 1) {
        setSelectedDaiLy(daiLyData[0]);
        await loadDonViByDaiLy(daiLyData[0].id);
      } else if (daiLyData.length === 0) {
        setSelectedDaiLy(null);
        setDonViList([]);
      }
    } catch (err) {
      console.error('Error loading user dai ly:', err);
      setError('Không thể tải danh sách đại lý');
      setUserDaiLy([]);
    } finally {
      setLoading(false);
    }
  };

  // Load đơn vị theo đại lý được chọn
  const loadDonViByDaiLy = async (daiLyId: number) => {
    setLoading(true);
    setError(null);

    try {
      const donViData = await nguoiDungService.getUserDonViByDaiLy(daiLyId);
      setDonViList(donViData);
    } catch (err) {
      console.error('Error loading don vi by dai ly:', err);
      setError('Không thể tải danh sách đơn vị');
      setDonViList([]);
    } finally {
      setLoading(false);
    }
  };

  // Chọn đại lý và load đơn vị tương ứng
  const selectDaiLy = async (daiLy: DaiLyInfo) => {
    setSelectedDaiLy(daiLy);
    await loadDonViByDaiLy(daiLy.id);
  };

  // Load dữ liệu khi user hoặc organization thay đổi
  useEffect(() => {
    if (user?.currentOrganization) {
      loadUserDaiLy();
    } else {
      setUserDaiLy([]);
      setSelectedDaiLy(null);
      setDonViList([]);
    }
  }, [user?.currentOrganization]);

  return {
    userDaiLy,
    selectedDaiLy,
    donViList,
    loading,
    error,
    loadUserDaiLy,
    selectDaiLy,
    loadDonViByDaiLy
  };
};
