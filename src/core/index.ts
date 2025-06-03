// Core Module Exports
export { default as Layout } from './components/Layout';
export { default as Header } from './components/Header';
export { default as Sidebar } from './components/Sidebar';
export { ThemeProvider, useTheme } from './contexts/ThemeContext';
export { NavigationProvider, useNavigation } from './contexts/NavigationContext';
export { RoleProvider, useRoleContext } from './contexts/RoleContext';

// Hooks
export { useUserRole } from './hooks/useUserRole';
export { useOptimizedRole } from './hooks/useOptimizedRole';
export { useInstantRole } from './hooks/useInstantRole';

// Utils
export { roleStorage } from './utils/roleStorage';