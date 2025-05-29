import React, { createContext, useContext, useState } from 'react';

type Page = 'dashboard' | 'settings' | 'calendar' | 'messages' | 'help' | 'bhyt-lookup' | 'bhxh-lookup' | 'bhxh-id-lookup' | 'family-lookup' | 'declaration-categories' | 'create-declaration' | 'bhyt-declaration' | 'declaration-history' | 'don-vi-management' | 'dai-ly-management' | 'dai-ly-don-vi-link';

interface NavigationContextType {
  currentPage: Page;
  setCurrentPage: (page: Page, params?: any) => void;
  pageParams: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [pageParams, setPageParams] = useState<any>(null);

  const handleSetCurrentPage = (page: Page, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
  };

  const value = {
    currentPage,
    setCurrentPage: handleSetCurrentPage,
    pageParams
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
