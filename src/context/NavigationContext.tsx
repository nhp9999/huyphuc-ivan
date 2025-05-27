import React, { createContext, useContext, useState } from 'react';

type Page = 'dashboard' | 'settings' | 'analytics' | 'customers' | 'calendar' | 'messages' | 'documents' | 'help' | 'bhyt-lookup';

interface NavigationContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
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

  const value = {
    currentPage,
    setCurrentPage
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
