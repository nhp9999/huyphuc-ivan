import { supabase } from './api/supabaseClient';

class UploadService {
  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Check if user is authenticated using custom auth system
  private isAuthenticated(): boolean {
    try {
      const savedUser = localStorage.getItem('user');
      return !!savedUser && savedUser !== 'null';
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Get current user from localStorage
  private getCurrentUser(): { id: string; email: string; name: string } | null {
    try {
      const savedUser = localStorage.getItem('user');

      if (savedUser && savedUser !== 'null') {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser;
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Upload image to Supabase Storage
  async uploadPaymentProof(file: File, paymentId: number): Promise<string> {
    try {
      // Check authentication using custom auth system
      if (!this.isAuthenticated()) {
        throw new Error('Bạn cần đăng nhập để tải lên ảnh');
      }

      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Bạn cần đăng nhập để tải lên ảnh');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `payment-proof-${paymentId}-${Date.now()}.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;

      console.log('Uploading file:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        userId: currentUser.id
      });

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading to storage:', error);
        throw new Error(`Không thể tải lên ảnh: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadPaymentProof:', error);

      // Don't fallback to base64 - just throw the error
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Không thể tải lên ảnh chứng minh');
      }
    }
  }

  // Upload general file
  async uploadFile(file: File, folder: string = 'general'): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw new Error('Không thể tải lên file');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }

  // Delete file from storage
  async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        throw new Error('Không thể xóa file');
      }
    } catch (error) {
      console.error('Error in deleteFile:', error);
      throw error;
    }
  }

  // Validate image file
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Vui lòng chọn file ảnh' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'Kích thước file không được vượt quá 5MB' };
    }

    // Check file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      return { isValid: false, error: 'Chỉ hỗ trợ file ảnh: JPG, PNG, GIF, WebP' };
    }

    return { isValid: true };
  }

  // Get file size in human readable format
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new UploadService();
