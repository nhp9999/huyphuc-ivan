import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type Page = 'dashboard' | 'settings' | 'calendar' | 'messages' | 'help' | 'bhyt-lookup' | 'bhxh-lookup' | 'bhxh-id-lookup' | 'family-lookup' | 'declaration-categories' | 'ke-khai-603' | 'ke-khai-603-form' | 'declaration-history' | 'don-vi-management' | 'dai-ly-management' | 'dai-ly-don-vi-link';

interface NavigationContextType {
  currentPage: Page;
  setCurrentPage: (page: Page, params?: any) => void;
  pageParams: any;
}

// Map page names to routes
const pageToRoute: Record<Page, string> = {
  'dashboard': '/dashboard',
  'settings': '/settings',
  'calendar': '/calendar',
  'messages': '/messages',
  'help': '/help',
  'bhyt-lookup': '/bhyt-lookup',
  'bhxh-lookup': '/bhxh-lookup',
  'bhxh-id-lookup': '/bhxh-id-lookup',
  'family-lookup': '/family-lookup',
  'declaration-categories': '/declaration-categories',
  'ke-khai-603': '/ke-khai-603',
  'ke-khai-603-form': '/ke-khai-603-form',
  'declaration-history': '/declaration-history',
  'don-vi-management': '/don-vi-management',
  'dai-ly-management': '/dai-ly-management',
  'dai-ly-don-vi-link': '/dai-ly-don-vi-link'
};

// Map routes to page names
const routeToPage: Record<string, Page> = Object.fromEntries(
  Object.entries(pageToRoute).map(([page, route]) => [route, page as Page])
);

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Helper functions for localStorage
const getStoredNavigation = () => {
  try {
    const stored = localStorage.getItem('navigation');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        currentPage: parsed.currentPage || 'dashboard',
        pageParams: parsed.pageParams || null
      };
    }
  } catch (error) {
    console.warn('Error reading navigation from localStorage:', error);
  }
  return {
    currentPage: 'dashboard' as Page,
    pageParams: null
  };
};

const storeNavigation = (currentPage: Page, pageParams: any) => {
  try {
    localStorage.setItem('navigation', JSON.stringify({
      currentPage,
      pageParams
    }));
  } catch (error) {
    console.warn('Error storing navigation to localStorage:', error);
  }
};

// Navigation hook that works with React Router
const useNavigationInternal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageParams, setPageParams] = useState<any>(null);

  // Get current page from URL
  const currentPage = routeToPage[location.pathname] || 'dashboard';

  const handleSetCurrentPage = (page: Page, params?: any) => {
    const newParams = params || null;
    setPageParams(newParams);

    // Store params to localStorage for persistence
    if (newParams) {
      storeNavigation(page, newParams);
    }

    // Navigate to the new route
    const route = pageToRoute[page];
    if (route) {
      navigate(route);
    }
  };

  // Load params from localStorage on mount
  useEffect(() => {
    const storedNavigation = getStoredNavigation();
    if (storedNavigation.pageParams && storedNavigation.currentPage === currentPage) {
      setPageParams(storedNavigation.pageParams);
    }
  }, [currentPage]);

  return {
    currentPage,
    setCurrentPage: handleSetCurrentPage,
    pageParams
  };
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNavigationInternal();

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};
