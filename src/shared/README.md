# 🤝 Shared Directory

Thư mục shared chứa các utilities, components và services được chia sẻ giữa các module.

## 📁 Cấu trúc

```
shared/
├── components/        # Shared components
│   ├── ui/           # Basic UI components
│   ├── widgets/      # Complex widgets  
│   └── charts/       # Chart components
├── hooks/            # Shared custom hooks
├── services/         # Shared services
│   ├── api/          # API clients
│   └── location/     # Location services
├── types/            # Shared TypeScript types
├── utils/            # Utility functions
└── index.ts          # Shared exports
```

## 🧩 Components

### UI Components
- Toast: Notification messages
- Tooltip: Hover information
- Modals: Confirm dialogs

### Widgets
- StatsCard: Statistics display
- QuickActions: Action buttons
- SystemStatus: System information

### Charts
- BarChart: Bar chart visualization
- DonutChart: Donut chart display
- LineChart: Line chart graphs

## 🎣 Hooks

### useToast
- Toast notification management
- Success/Error/Warning messages

### useBhytApi  
- BHYT API integration
- Common API patterns

## 🔧 Services

### API Services
- supabaseClient: Database client
- api: HTTP client configuration

### Location Services
- tinhService: Province management
- huyenService: District management
- xaService: Ward management

## 🔄 Usage

```typescript
// Import shared components
import { Toast, StatsCard } from '../shared';
import { useToast } from '../shared/hooks/useToast';
```