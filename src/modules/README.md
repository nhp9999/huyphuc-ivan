# 📁 Modules Directory

Thư mục này chứa các business modules của ứng dụng, mỗi module có trách nhiệm rõ ràng và độc lập.

## 🏗️ Cấu trúc Module

Mỗi module tuân theo cấu trúc chuẩn:

```
module-name/
├── components/          # Components riêng của module
├── pages/              # Pages của module
├── services/           # Business logic và API calls
├── hooks/              # Custom hooks (nếu có)
├── types/              # TypeScript types (nếu có)
├── contexts/           # React contexts (nếu có)
└── index.ts            # Export file
```

## 📋 Danh sách Modules

### 🔐 auth/
**Chức năng**: Xác thực và phân quyền
- Login page
- AuthContext
- OrganizationSelector

### 🔍 tra-cuu/
**Chức năng**: Tra cứu thông tin BHYT, BHXH
- BhytLookup, BhxhLookup pages
- BulkLookup component
- BHYT/BHXH services

### 👥 quan-ly/
**Chức năng**: Quản lý các entity (công ty, đại lý, đơn vị, người dùng)
- Management pages
- CRUD modals
- Management services

### 📋 ke-khai/
**Chức năng**: Kê khai 603 và declarations
- KeKhai603 forms
- Declaration history
- KeKhai hooks và services

### 📊 dashboard/
**Chức năng**: Dashboard và settings
- Dashboard page
- Settings page

## 🔄 Import/Export Pattern

### Import từ module khác:
```typescript
// ✅ Đúng - import từ index.ts
import { Login, AuthProvider } from '../auth';

// ❌ Sai - import trực tiếp
import Login from '../auth/pages/Login';
```

### Export trong index.ts:
```typescript
// auth/index.ts
export { default as Login } from './pages/Login';
export { AuthProvider, useAuth } from './contexts/AuthContext';
```

## 📝 Quy tắc Module

1. **Single Responsibility**: Mỗi module chỉ có một trách nhiệm chính
2. **Loose Coupling**: Module ít phụ thuộc lẫn nhau
3. **High Cohesion**: Các file trong module liên quan chặt chẽ
4. **Clear Interface**: Export rõ ràng qua index.ts