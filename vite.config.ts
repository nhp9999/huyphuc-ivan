import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react'],
          'vendor-data': ['@supabase/supabase-js', 'axios'],
          'vendor-excel': ['exceljs'],

          // Feature-based chunks
          'auth-module': [
            './src/modules/auth/contexts/AuthContext.tsx',
            './src/modules/auth/pages/Login.tsx'
          ],
          'quan-ly-services': [
            './src/modules/quan-ly/services/nguoiDungService.ts',
            './src/modules/quan-ly/services/daiLyService.ts',
            './src/modules/quan-ly/services/donViService.ts',
            './src/modules/quan-ly/services/congTacVienAccountService.ts'
          ],
          'ke-khai-services': [
            './src/modules/ke-khai/services/keKhaiService.ts',
            './src/modules/ke-khai/services/paymentService.ts'
          ],
          'tra-cuu-services': [
            './src/modules/tra-cuu/services/bhytService.ts',
            './src/modules/tra-cuu/services/bhxhService.ts'
          ],
          'shared-services': [
            './src/shared/services/luongCoSoService.ts',
            './src/shared/services/cskcbService.ts'
          ],
          'location-services': [
            './src/shared/services/location/tinhService.ts',
            './src/shared/services/location/huyenService.ts',
            './src/shared/services/location/xaService.ts'
          ]
        }
      }
    }
  }
});
