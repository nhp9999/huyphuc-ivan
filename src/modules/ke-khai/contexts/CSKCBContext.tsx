import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DmCSKCB } from '../../../shared/services/api/supabaseClient';
import cskcbService from '../../../shared/services/cskcbService';

interface CSKCBCache {
  [key: string]: {
    data: DmCSKCB[];
    timestamp: number;
    loading: boolean;
  };
}

interface CSKCBContextType {
  getCSKCBData: (maTinh?: string) => Promise<DmCSKCB[]>;
  isLoading: (maTinh?: string) => boolean;
  clearCache: () => void;
  preloadCSKCBData: (maTinh: string) => Promise<void>;
}

const CSKCBContext = createContext<CSKCBContextType | undefined>(undefined);

// Cache expiry time: 5 minutes
const CACHE_EXPIRY_TIME = 5 * 60 * 1000;

interface CSKCBProviderProps {
  children: ReactNode;
}

export const CSKCBProvider: React.FC<CSKCBProviderProps> = ({ children }) => {
  const [cache, setCache] = useState<CSKCBCache>({});

  const getCacheKey = (maTinh?: string): string => {
    return maTinh || 'all';
  };

  const isCacheValid = (cacheEntry: CSKCBCache[string]): boolean => {
    return Date.now() - cacheEntry.timestamp < CACHE_EXPIRY_TIME;
  };

  const isLoading = useCallback((maTinh?: string): boolean => {
    const key = getCacheKey(maTinh);
    return cache[key]?.loading || false;
  }, [cache]);

  const getCSKCBData = useCallback(async (maTinh?: string): Promise<DmCSKCB[]> => {
    const key = getCacheKey(maTinh);
    const cacheEntry = cache[key];

    // Return cached data if valid and not loading
    if (cacheEntry && isCacheValid(cacheEntry) && !cacheEntry.loading) {
      console.log(`CSKCBContext: Returning cached data for ${key}`);
      return cacheEntry.data;
    }

    // If already loading, wait for the existing request
    if (cacheEntry?.loading) {
      console.log(`CSKCBContext: Already loading data for ${key}, waiting...`);
      // Poll until loading is complete
      return new Promise((resolve) => {
        const checkLoading = () => {
          const currentEntry = cache[key];
          if (currentEntry && !currentEntry.loading) {
            resolve(currentEntry.data);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    console.log(`CSKCBContext: Loading fresh data for ${key}`);

    // Set loading state
    setCache(prev => ({
      ...prev,
      [key]: {
        data: cacheEntry?.data || [],
        timestamp: cacheEntry?.timestamp || 0,
        loading: true
      }
    }));

    try {
      let data: DmCSKCB[];
      
      if (maTinh) {
        // Load cơ sở KCB theo tỉnh cụ thể
        data = await cskcbService.getCSKCBByTinh(maTinh);
      } else {
        // Load tất cả cơ sở KCB (giới hạn 500 để tránh tải quá nhiều)
        data = await cskcbService.getCSKCBList({
          trang_thai: 'active',
          limit: 500
        });
      }

      // Update cache with new data
      setCache(prev => ({
        ...prev,
        [key]: {
          data,
          timestamp: Date.now(),
          loading: false
        }
      }));

      console.log(`CSKCBContext: Successfully loaded ${data.length} items for ${key}`);
      return data;
    } catch (error) {
      console.error(`CSKCBContext: Error loading data for ${key}:`, error);
      
      // Clear loading state on error
      setCache(prev => ({
        ...prev,
        [key]: {
          data: cacheEntry?.data || [],
          timestamp: cacheEntry?.timestamp || 0,
          loading: false
        }
      }));

      // Return empty array on error
      return [];
    }
  }, [cache]);

  const preloadCSKCBData = useCallback(async (maTinh: string): Promise<void> => {
    await getCSKCBData(maTinh);
  }, [getCSKCBData]);

  const clearCache = useCallback(() => {
    console.log('CSKCBContext: Clearing all cache');
    setCache({});
  }, []);

  const contextValue: CSKCBContextType = {
    getCSKCBData,
    isLoading,
    clearCache,
    preloadCSKCBData
  };

  return (
    <CSKCBContext.Provider value={contextValue}>
      {children}
    </CSKCBContext.Provider>
  );
};

export const useCSKCBContext = (): CSKCBContextType => {
  const context = useContext(CSKCBContext);
  if (!context) {
    throw new Error('useCSKCBContext must be used within a CSKCBProvider');
  }
  return context;
};

export default CSKCBContext;
