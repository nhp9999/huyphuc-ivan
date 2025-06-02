# 🏗️ Core Directory

Thư mục core chứa các thành phần cốt lõi của hệ thống, được sử dụng xuyên suốt ứng dụng.

## 📁 Cấu trúc

```
core/
├── components/         # Layout components (Header, Sidebar, Layout)
├── contexts/          # Core contexts (Theme, Navigation)
├── config/            # System configuration
├── layout/            # Layout configuration
├── pages/             # Core pages
├── routing/           # Routing configuration
└── index.ts           # Core exports
```

## 🧩 Components

### Layout.tsx
- Main layout wrapper
- Quản lý sidebar state
- Theme integration

### Header.tsx  
- Top navigation bar
- User menu
- Search functionality
- Notifications

### Sidebar.tsx
- Side navigation
- Menu items
- Collapsible design

## 🎨 Contexts

### ThemeContext
- Light/Dark theme switching
- Theme persistence
- System theme detection

### NavigationContext
- Current page tracking
- Navigation state management
- Page parameters handling

## 🔄 Usage

```typescript
// Import core components
import { Layout, Header, Sidebar } from '../core';
import { ThemeProvider, useTheme } from '../core';
```