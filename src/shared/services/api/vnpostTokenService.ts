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
  private readonly CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours (aggressive caching since JWT lasts 5 hours)
  private errorCount: number = 0;
  private lastErrorTime: number = 0;
  private readonly MAX_ERRORS_BEFORE_CLEAR = 3;
  private readonly ERROR_RESET_TIME = 5 * 60 * 1000; // 5 minutes

  // Enhanced automatic error correction properties
  private autoFixEnabled: boolean = true;
  private autoFixInProgress: boolean = false;
  private autoFixAttempts: number = 0;
  private readonly MAX_AUTO_FIX_ATTEMPTS = 3;
  private readonly AUTO_FIX_COOLDOWN = 30 * 1000; // 30 seconds
  private lastAutoFixTime: number = 0;
  private errorPatterns: Map<string, number> = new Map();
  private consecutiveFailures: number = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 5;

  // Token readiness tracking
  private tokenInitialized: boolean = false;
  private initializationPromise: Promise<TokenInfo> | null = null;
  private readonly TOKEN_INITIALIZATION_TIMEOUT = 10000; // 10 seconds

  // Performance optimization
  private lastSuccessfulCall: number = 0;
  private readonly SKIP_CHECK_DURATION = 10 * 60 * 1000; // 10 minutes - skip token check if last call was recent

  /**
   * Initialize token service and ensure token is ready
   */
  async initializeToken(): Promise<TokenInfo> {
    // If already initialized and cached token is valid, return it
    if (this.tokenInitialized && this.cachedToken && Date.now() < this.cacheExpiry) {
      return this.cachedToken;
    }

    // If initialization is already in progress, wait for it
    if (this.initializationPromise) {
      return await this.initializationPromise;
    }

    // Start initialization
    this.initializationPromise = this.performTokenInitialization();

    try {
      const token = await this.initializationPromise;
      this.tokenInitialized = true;
      return token;
    } catch (error) {
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * Perform the actual token initialization
   */
  private async performTokenInitialization(): Promise<TokenInfo> {
    console.log('🔑 Initializing VNPost token service...');

    try {
      const token = await this.getLatestToken();

      // Validate token
      if (!token.authorization || token.authorization === 'Bearer undefined') {
        throw new Error('Invalid token received from database');
      }

      console.log('✅ Token service initialized successfully');

      // Dispatch initialization complete event
      window.dispatchEvent(new CustomEvent('tokenServiceInitialized', {
        detail: {
          timestamp: token.timestamp,
          isValid: token.isValid
        }
      }));

      return token;
    } catch (error) {
      console.error('❌ Token service initialization failed:', error);
      throw error;
    }
  }

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
   * Ensure token is ready before API calls (optimized for speed)
   */
  async ensureTokenReady(): Promise<TokenInfo> {
    const now = Date.now();

    // Fast path: Skip check if we had a successful call recently and token is cached
    if (this.cachedToken &&
        now < this.cacheExpiry &&
        (now - this.lastSuccessfulCall) < this.SKIP_CHECK_DURATION) {
      console.log('⚡ Fast path: Using recent successful token');
      return this.cachedToken;
    }

    if (!this.tokenInitialized) {
      console.log('⏳ Token not initialized, initializing now...');
      return await this.initializeToken();
    }

    // Check if cached token is still valid
    if (this.cachedToken && now < this.cacheExpiry) {
      return this.cachedToken;
    }

    // Token expired, refresh it
    console.log('🔄 Token expired, refreshing...');
    return await this.getLatestToken();
  }

  /**
   * Clear the cached token to force refresh on next request
   */
  clearCache(): void {
    this.cachedToken = null;
    this.cacheExpiry = 0;
    this.tokenInitialized = false;
    this.initializationPromise = null;
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
   * Report successful API call to reset error tracking and optimize future calls
   */
  reportSuccess(): void {
    this.errorCount = 0;
    this.consecutiveFailures = 0;
    this.lastErrorTime = 0;
    this.lastSuccessfulCall = Date.now(); // Track for performance optimization
    console.log('✅ API call successful - error tracking reset, performance optimized');
  }

  /**
   * Report an authentication error with enhanced automatic correction
   */
  async reportAuthError(errorDetails?: {
    statusCode?: number;
    message?: string;
    endpoint?: string;
    timestamp?: number;
  }): Promise<void> {
    const now = Date.now();

    // Reset error count if enough time has passed
    if (now - this.lastErrorTime > this.ERROR_RESET_TIME) {
      this.errorCount = 0;
      this.consecutiveFailures = 0;
      this.errorPatterns.clear();
    }

    this.errorCount++;
    this.consecutiveFailures++;
    this.lastErrorTime = now;

    // Track error patterns for intelligent correction
    if (errorDetails?.message) {
      const errorKey = this.categorizeError(errorDetails.message);
      this.errorPatterns.set(errorKey, (this.errorPatterns.get(errorKey) || 0) + 1);
    }

    console.log(`🚨 Auth error reported. Count: ${this.errorCount}/${this.MAX_ERRORS_BEFORE_CLEAR}, Consecutive: ${this.consecutiveFailures}`);
    console.log('Error details:', errorDetails);

    // Trigger automatic error correction if enabled
    if (this.autoFixEnabled && this.shouldTriggerAutoFix(errorDetails)) {
      await this.triggerAutoFix(errorDetails);
    }

    // Clear cache if too many errors (fallback)
    if (this.errorCount >= this.MAX_ERRORS_BEFORE_CLEAR) {
      console.log('🔄 Too many auth errors, clearing token cache automatically');
      this.clearCache();
      this.errorCount = 0; // Reset after clearing
    }
  }

  /**
   * Report a successful authentication to reset error count
   */
  reportAuthSuccess(): void {
    if (this.errorCount > 0 || this.consecutiveFailures > 0) {
      console.log('✅ Auth success reported, resetting error counters');
      this.errorCount = 0;
      this.consecutiveFailures = 0;
      this.autoFixAttempts = 0;

      // Clear error patterns on success
      if (this.errorPatterns.size > 0) {
        console.log('🧹 Clearing error patterns after successful auth');
        this.errorPatterns.clear();
      }
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
   * Categorize error for pattern recognition
   */
  private categorizeError(errorMessage: string): string {
    const message = errorMessage.toLowerCase();

    if (message.includes('token') && message.includes('expired')) {
      return 'TOKEN_EXPIRED';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'UNAUTHORIZED';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return 'FORBIDDEN';
    }
    if (message.includes('timestamp') || message.includes('time')) {
      return 'TIMESTAMP_MISMATCH';
    }
    if (message.includes('secretid') || message.includes('secretpass')) {
      return 'SECRET_INVALID';
    }
    if (message.includes('406')) {
      return 'NOT_ACCEPTABLE';
    }

    return 'UNKNOWN_ERROR';
  }

  /**
   * Determine if automatic fix should be triggered
   */
  private shouldTriggerAutoFix(errorDetails?: any): boolean {
    const now = Date.now();

    // Check cooldown period
    if (now - this.lastAutoFixTime < this.AUTO_FIX_COOLDOWN) {
      console.log('🕒 Auto-fix in cooldown period, skipping...');
      return false;
    }

    // Check if already in progress
    if (this.autoFixInProgress) {
      console.log('🔄 Auto-fix already in progress, skipping...');
      return false;
    }

    // Check max attempts
    if (this.autoFixAttempts >= this.MAX_AUTO_FIX_ATTEMPTS) {
      console.log('🚫 Max auto-fix attempts reached, skipping...');
      return false;
    }

    // Check consecutive failures threshold
    if (this.consecutiveFailures >= 2) {
      console.log('🎯 Consecutive failures threshold reached, triggering auto-fix');
      return true;
    }

    // Check specific error patterns
    if (errorDetails?.statusCode === 406 || errorDetails?.statusCode === 401) {
      console.log('🎯 Critical error detected, triggering auto-fix');
      return true;
    }

    return false;
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

  /**
   * Trigger automatic error correction
   */
  private async triggerAutoFix(errorDetails?: any): Promise<void> {
    if (this.autoFixInProgress) {
      return;
    }

    this.autoFixInProgress = true;
    this.autoFixAttempts++;
    this.lastAutoFixTime = Date.now();

    console.log(`🤖 Starting automatic error correction (attempt ${this.autoFixAttempts}/${this.MAX_AUTO_FIX_ATTEMPTS})`);

    try {
      // Dispatch event to notify UI
      window.dispatchEvent(new CustomEvent('autoFixStarted', {
        detail: {
          attempt: this.autoFixAttempts,
          errorDetails,
          timestamp: Date.now()
        }
      }));

      // Determine fix strategy based on error pattern
      const strategy = this.determineFixStrategy(errorDetails);
      console.log(`🎯 Using fix strategy: ${strategy}`);

      switch (strategy) {
        case 'GEMLOGIN_REFRESH':
          await this.executeGemLoginRefresh();
          break;
        case 'SIMPLE_REFRESH':
          await this.executeSimpleRefresh();
          break;
        case 'DEEP_REFRESH':
          await this.executeDeepRefresh();
          break;
        default:
          await this.executeSimpleRefresh();
      }

      console.log('✅ Automatic error correction completed successfully');

      // Dispatch success event
      window.dispatchEvent(new CustomEvent('autoFixCompleted', {
        detail: {
          success: true,
          strategy,
          timestamp: Date.now()
        }
      }));

    } catch (error) {
      console.error('❌ Automatic error correction failed:', error);

      // Dispatch failure event
      window.dispatchEvent(new CustomEvent('autoFixCompleted', {
        detail: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }
      }));
    } finally {
      this.autoFixInProgress = false;
    }
  }

  /**
   * Determine the best fix strategy based on error patterns
   */
  private determineFixStrategy(errorDetails?: any): string {
    // Check error patterns frequency
    const tokenExpiredCount = this.errorPatterns.get('TOKEN_EXPIRED') || 0;
    const timestampMismatchCount = this.errorPatterns.get('TIMESTAMP_MISMATCH') || 0;
    const secretInvalidCount = this.errorPatterns.get('SECRET_INVALID') || 0;

    // If multiple timestamp mismatches, use GemLogin refresh
    if (timestampMismatchCount >= 2 || secretInvalidCount >= 2) {
      return 'GEMLOGIN_REFRESH';
    }

    // If token expired multiple times, use deep refresh
    if (tokenExpiredCount >= 2) {
      return 'DEEP_REFRESH';
    }

    // Check specific status codes
    if (errorDetails?.statusCode === 406) {
      return 'GEMLOGIN_REFRESH';
    }

    // Default to simple refresh
    return 'SIMPLE_REFRESH';
  }

  /**
   * Execute GemLogin-based refresh (most comprehensive)
   */
  private async executeGemLoginRefresh(): Promise<void> {
    console.log('🔧 Executing GemLogin refresh strategy...');

    try {
      // Phase 1: Test GemLogin API
      const payload = {
        token: "W1tRXRGrogqDKKfi2vjntmYAKwUGURDrkH7fUzxRjoM82Ee9B1mjazatTWGnPOcA",
        device_id: "F2DEA0FC4095FCA69F6E20A06B5A0B03",
        profile_id: "1",
        workflow_id: "CvfYXv3KTCMKjjHmLk4ze",
        parameter: {},
        soft_id: "1",
        close_browser: false
      };

      const response = await fetch('https://app.gemlogin.vn/api/v2/execscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ GemLogin API test successful:', data);
      } else {
        console.warn('⚠️ GemLogin API test failed, continuing with refresh...');
      }

      // Phase 2: Wait 5 seconds for token generation
      console.log('⏳ Waiting 5 seconds for token generation...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Phase 3: Force refresh token
      await this.forceRefresh();

    } catch (error) {
      console.error('❌ GemLogin refresh failed:', error);
      // Fallback to simple refresh
      await this.executeSimpleRefresh();
    }
  }

  /**
   * Execute simple token refresh
   */
  private async executeSimpleRefresh(): Promise<void> {
    console.log('🔄 Executing simple refresh strategy...');
    await this.forceRefresh();
  }

  /**
   * Execute deep refresh with cache clearing and multiple attempts
   */
  private async executeDeepRefresh(): Promise<void> {
    console.log('🔧 Executing deep refresh strategy...');

    // Clear all caches
    this.clearCache();

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Force refresh
    await this.forceRefresh();

    // Additional verification
    const token = await this.getLatestToken();
    if (!token.isValid) {
      throw new Error('Deep refresh failed - token still invalid');
    }
  }

  /**
   * Enable/disable automatic error correction
   */
  setAutoFixEnabled(enabled: boolean): void {
    this.autoFixEnabled = enabled;
    console.log(`🤖 Automatic error correction ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get auto-fix status
   */
  getAutoFixStatus(): {
    enabled: boolean;
    inProgress: boolean;
    attempts: number;
    maxAttempts: number;
    lastAttemptTime: number;
    errorPatterns: Record<string, number>;
  } {
    return {
      enabled: this.autoFixEnabled,
      inProgress: this.autoFixInProgress,
      attempts: this.autoFixAttempts,
      maxAttempts: this.MAX_AUTO_FIX_ATTEMPTS,
      lastAttemptTime: this.lastAutoFixTime,
      errorPatterns: Object.fromEntries(this.errorPatterns)
    };
  }

  /**
   * Reset auto-fix state
   */
  resetAutoFixState(): void {
    this.autoFixAttempts = 0;
    this.lastAutoFixTime = 0;
    this.errorPatterns.clear();
    this.consecutiveFailures = 0;
    console.log('🔄 Auto-fix state reset');
  }

  /**
   * Check if token service is ready
   */
  isTokenReady(): boolean {
    return this.tokenInitialized &&
           this.cachedToken !== null &&
           Date.now() < this.cacheExpiry;
  }

  /**
   * Get token readiness status
   */
  getTokenStatus(): {
    initialized: boolean;
    cached: boolean;
    expired: boolean;
    valid: boolean;
  } {
    return {
      initialized: this.tokenInitialized,
      cached: this.cachedToken !== null,
      expired: this.cachedToken ? Date.now() >= this.cacheExpiry : true,
      valid: this.cachedToken?.isValid || false
    };
  }
}

export const vnpostTokenService = new VnPostTokenService();
export default vnpostTokenService;
