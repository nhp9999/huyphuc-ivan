import { useEffect } from 'react';
import { useCSKCBContext } from '../contexts/CSKCBContext';

/**
 * Custom hook to preload CSKCB data for common provinces
 * This helps reduce API calls by preloading data that's likely to be used
 */
export const useCSKCBPreloader = () => {
  const { preloadCSKCBData } = useCSKCBContext();

  useEffect(() => {
    const preloadCommonData = async () => {
      try {
        // Preload data for An Giang province (89) since it's commonly used
        // Based on the network logs, this is the province being used
        await preloadCSKCBData('89');
        
        console.log('CSKCBPreloader: Successfully preloaded CSKCB data for An Giang (89)');
      } catch (error) {
        console.error('CSKCBPreloader: Error preloading CSKCB data:', error);
      }
    };

    // Preload data after a short delay to not block initial render
    const timeoutId = setTimeout(preloadCommonData, 500);

    return () => clearTimeout(timeoutId);
  }, [preloadCSKCBData]);
};

export default useCSKCBPreloader;
