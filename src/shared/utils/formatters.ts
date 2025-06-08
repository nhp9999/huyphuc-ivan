/**
 * Utility functions for formatting data
 */

/**
 * Format a number as Vietnamese currency (VND)
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '';
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a number with thousand separators (Vietnamese style)
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num) || num === null || num === undefined) {
    return '';
  }
  
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Format a date string to Vietnamese format (dd/mm/yyyy)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return '';
  }
};

/**
 * Format a date string to ISO format (yyyy-mm-dd) for input fields
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

/**
 * Format a datetime string to Vietnamese format with time
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  } catch (error) {
    return '';
  }
};

/**
 * Format phone number to Vietnamese format
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    // Mobile: 0xxx xxx xxx
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11) {
    // Landline: 0xx xxxx xxxx
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
  }
  
  return phone; // Return original if doesn't match expected patterns
};

/**
 * Format BHXH code with spaces for readability
 */
export const formatBHXHCode = (code: string): string => {
  if (!code) return '';
  
  // Remove all spaces and format as groups of 3 digits
  const cleaned = code.replace(/\s/g, '');
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
};

/**
 * Format CCCD/CMND with spaces for readability
 */
export const formatCCCD = (cccd: string): string => {
  if (!cccd) return '';
  
  const cleaned = cccd.replace(/\s/g, '');
  
  if (cleaned.length === 12) {
    // CCCD: xxx xxx xxx xxx
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  } else if (cleaned.length === 9) {
    // CMND: xxx xxx xxx
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return cccd; // Return original if doesn't match expected patterns
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (isNaN(value) || value === null || value === undefined) {
    return '';
  }
  
  return `${value.toFixed(decimals)}%`;
};
