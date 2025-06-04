// Event emitter for cross-component communication
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  // Subscribe to an event
  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Unsubscribe from an event
  off(event: string, callback: Function): void {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    
    // Clean up empty event arrays
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  // Emit an event
  emit(event: string, data?: any): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event callback for ${event}:`, error);
      }
    });
  }

  // Remove all listeners for an event
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }

  // Get list of events
  getEvents(): string[] {
    return Object.keys(this.events);
  }

  // Check if event has listeners
  hasListeners(event: string): boolean {
    return !!(this.events[event] && this.events[event].length > 0);
  }
}

// Create a singleton instance
export const eventEmitter = new EventEmitter();

// Event types for type safety
export const EVENTS = {
  // Kê khai events
  KE_KHAI_CREATED: 'ke_khai_created',
  KE_KHAI_UPDATED: 'ke_khai_updated',
  KE_KHAI_DELETED: 'ke_khai_deleted',
  KE_KHAI_STATUS_CHANGED: 'ke_khai_status_changed',
  
  // Payment events
  PAYMENT_CREATED: 'payment_created',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PAYMENT_CANCELLED: 'payment_cancelled',
  
  // General refresh events
  REFRESH_KE_KHAI_MANAGEMENT: 'refresh_ke_khai_management',
  REFRESH_MY_PAYMENTS: 'refresh_my_payments',
  REFRESH_HO_SO_CHUA_XU_LY: 'refresh_ho_so_chua_xu_ly',
  REFRESH_HO_SO_DA_XU_LY: 'refresh_ho_so_da_xu_ly',
  REFRESH_ALL_KE_KHAI_PAGES: 'refresh_all_ke_khai_pages'
} as const;

export type EventType = typeof EVENTS[keyof typeof EVENTS];

// Helper functions for common events
export const emitKeKhaiStatusChanged = (keKhaiId: number, oldStatus: string, newStatus: string, keKhaiData?: any) => {
  eventEmitter.emit(EVENTS.KE_KHAI_STATUS_CHANGED, {
    keKhaiId,
    oldStatus,
    newStatus,
    keKhaiData,
    timestamp: new Date().toISOString()
  });
};

export const emitPaymentConfirmed = (keKhaiId: number, paymentId: number, keKhaiData?: any) => {
  eventEmitter.emit(EVENTS.PAYMENT_CONFIRMED, {
    keKhaiId,
    paymentId,
    keKhaiData,
    timestamp: new Date().toISOString()
  });
  
  // Also emit general refresh events
  eventEmitter.emit(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, {
    reason: 'payment_confirmed',
    keKhaiId,
    paymentId
  });
};

export const emitRefreshAllKeKhaiPages = (reason: string, data?: any) => {
  eventEmitter.emit(EVENTS.REFRESH_ALL_KE_KHAI_PAGES, {
    reason,
    data,
    timestamp: new Date().toISOString()
  });
};

export default eventEmitter;
