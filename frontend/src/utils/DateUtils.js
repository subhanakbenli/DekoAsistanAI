/**
 * DateUtils - Date manipulation utility class
 * Provides date formatting and calculation operations
 */
class DateUtils {
  /**
   * Format date to Turkish locale
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date
   */
  static formatTurkish(date, options = {}) {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('tr-TR', defaultOptions).format(new Date(date));
  }

  /**
   * Format date to short format (DD/MM/YYYY)
   * @param {Date|string} date - Date to format
   * @returns {string} Short formatted date
   */
  static formatShort(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  }

  /**
   * Format time to Turkish locale
   * @param {Date|string} date - Date to format
   * @param {boolean} includeSeconds - Include seconds
   * @returns {string} Formatted time
   */
  static formatTime(date, includeSeconds = false) {
    if (!date) return '';
    
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' })
    };
    
    return new Intl.DateTimeFormat('tr-TR', options).format(new Date(date));
  }

  /**
   * Get relative time (e.g., "2 saat önce")
   * @param {Date|string} date - Date to compare
   * @returns {string} Relative time
   */
  static getRelativeTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = now - targetDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Az önce';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else if (diffInDays < 7) {
      return `${diffInDays} gün önce`;
    } else {
      return DateUtils.formatShort(date);
    }
  }

  /**
   * Check if date is today
   * @param {Date|string} date - Date to check
   * @returns {boolean} Is today
   */
  static isToday(date) {
    if (!date) return false;
    const today = new Date();
    const targetDate = new Date(date);
    
    return today.toDateString() === targetDate.toDateString();
  }

  /**
   * Check if date is yesterday
   * @param {Date|string} date - Date to check
   * @returns {boolean} Is yesterday
   */
  static isYesterday(date) {
    if (!date) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDate = new Date(date);
    
    return yesterday.toDateString() === targetDate.toDateString();
  }

  /**
   * Add days to date
   * @param {Date|string} date - Base date
   * @param {number} days - Days to add
   * @returns {Date} New date
   */
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Calculate age from birth date
   * @param {Date|string} birthDate - Birth date
   * @returns {number} Age in years
   */
  static calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Get start of day
   * @param {Date|string} date - Input date
   * @returns {Date} Start of day
   */
  static startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day
   * @param {Date|string} date - Input date
   * @returns {Date} End of day
   */
  static endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }
}

export default DateUtils;
