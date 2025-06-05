import { supabase } from './supabaseClient';

export interface VnPostToken {
  id: string;
  token_value: string;
  token_type: string;
  token_format: string;
  header_name: string;
  source_type: string;
  url: string;
  http_method: string;
  request_timestamp: string;
  request_timestamp_ms: number;
  is_jwt: boolean;
  created_at: string;
}

export interface TokenInfo {
  authorization: string;
  timestamp: number;
  isValid: boolean;
}

class VnPostTokenService {
  private cachedToken: TokenInfo | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (reduced from 5)
  private errorCount: number = 0;
  private lastErrorTime: number = 0;
  private readonly MAX_ERRORS_BEFORE_CLEAR = 3;
  private readonly ERROR_RESET_TIME = 5 * 60 * 1000; // 5 minutes

  /**
   * Get the latest authorization token and timestamp from vnpost_tokens table
   */
  async getLatestToken(): Promise<TokenInfo> {
    try {
      // Check cache first
      if (this.cachedToken && Date.now() < this.cacheExpiry) {
        return this.cachedToken;
      }

      const { data, error } = await supabase
        .from('vnpost_tokens')
        .select('token_value, request_timestamp_ms, created_at')
        .eq('token_type', 'request_header')
        .or('header_name.eq.Authorization,header_name.eq.authorization')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching vnpost token:', error);
        throw new Error('Không thể lấy token xác thực từ database');
      }

      if (!data) {
        throw new Error('Không tìm thấy token xác thực trong database');
      }

      // Extract Bearer token from token_value
      let authToken = data.token_value;
      if (!authToken.startsWith('Bearer ')) {
        authToken = `Bearer ${authToken}`;
      }

      const tokenInfo: TokenInfo = {
        authorization: authToken,
        timestamp: data.request_timestamp_ms || Date.now(),
        isValid: true
      };

      // Cache the token
      this.cachedToken = tokenInfo;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      console.log('Retrieved fresh token from database:', {
        hasToken: !!tokenInfo.authorization,
        timestamp: tokenInfo.timestamp,
        cacheExpiry: new Date(this.cacheExpiry).toISOString()
      });

      // Dispatch custom event for UI to listen to
      window.dispatchEvent(new CustomEvent('tokenRefreshed', {
        detail: { timestamp: tokenInfo.timestamp }
      }));

      return tokenInfo;
    } catch (error) {
      console.error('Error in getLatestToken:', error);
      
      // Return fallback token if database fails
      return {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        timestamp: Date.now(),
        isValid: false
      };
    }
  }

  /**
   * Clear the cached token to force refresh on next request
   */
  clearCache(): void {
    this.cachedToken = null;
    this.cacheExpiry = 0;
    console.log('Token cache cleared - next request will fetch fresh token from database');
  }

  /**
   * Force refresh token from database (clear cache and get new token)
   */
  async forceRefresh(): Promise<TokenInfo> {
    this.clearCache();
    return await this.getLatestToken();
  }

  /**
   * Report an authentication error to potentially trigger cache clear
   */
  reportAuthError(): void {
    const now = Date.now();

    // Reset error count if enough time has passed
    if (now - this.lastErrorTime > this.ERROR_RESET_TIME) {
      this.errorCount = 0;
    }

    this.errorCount++;
    this.lastErrorTime = now;

    console.log(`Auth error reported. Count: ${this.errorCount}/${this.MAX_ERRORS_BEFORE_CLEAR}`);

    // Clear cache if too many errors
    if (this.errorCount >= this.MAX_ERRORS_BEFORE_CLEAR) {
      console.log('Too many auth errors, clearing token cache automatically');
      this.clearCache();
      this.errorCount = 0; // Reset after clearing
    }
  }

  /**
   * Report a successful authentication to reset error count
   */
  reportAuthSuccess(): void {
    if (this.errorCount > 0) {
      console.log('Auth success reported, resetting error count');
      this.errorCount = 0;
    }
  }

  /**
   * Get all available tokens for debugging
   */
  async getAllTokens(): Promise<VnPostToken[]> {
    try {
      const { data, error } = await supabase
        .from('vnpost_tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching all tokens:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllTokens:', error);
      return [];
    }
  }

  /**
   * Save a new token to the database
   */
  async saveToken(tokenData: Partial<VnPostToken>): Promise<VnPostToken | null> {
    try {
      const { data, error } = await supabase
        .from('vnpost_tokens')
        .insert([{
          token_value: tokenData.token_value,
          token_type: tokenData.token_type || 'request_header',
          token_format: tokenData.token_format || 'bearer',
          header_name: tokenData.header_name || 'Authorization',
          source_type: tokenData.source_type || 'manual',
          url: tokenData.url || 'https://ssm.vnpost.vn/connect/tracuu/thongtinbhytforkekhai',
          http_method: tokenData.http_method || 'POST',
          request_timestamp_ms: tokenData.request_timestamp_ms || Date.now(),
          is_jwt: tokenData.is_jwt || false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving token:', error);
        return null;
      }

      // Clear cache to force refresh
      this.clearCache();

      return data;
    } catch (error) {
      console.error('Error in saveToken:', error);
      return null;
    }
  }
}

export const vnpostTokenService = new VnPostTokenService();
export default vnpostTokenService;
