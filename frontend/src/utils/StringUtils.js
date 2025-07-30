/**
 * StringUtils - String manipulation utility class
 * Provides common string operations following OOP principles
 */
class StringUtils {
  /**
   * Capitalize first letter of string
   * @param {string} str - Input string
   * @returns {string} Capitalized string
   */
  static capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convert string to title case
   * @param {string} str - Input string
   * @returns {string} Title case string
   */
  static toTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().split(' ').map(StringUtils.capitalize).join(' ');
  }

  /**
   * Convert camelCase to kebab-case
   * @param {string} str - CamelCase string
   * @returns {string} kebab-case string
   */
  static camelToKebab(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Convert kebab-case to camelCase
   * @param {string} str - kebab-case string
   * @returns {string} camelCase string
   */
  static kebabToCamel(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Truncate string with ellipsis
   * @param {string} str - Input string
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix to add (default: '...')
   * @returns {string} Truncated string
   */
  static truncate(str, maxLength, suffix = '...') {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Remove extra whitespace and normalize
   * @param {string} str - Input string
   * @returns {string} Normalized string
   */
  static normalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().replace(/\s+/g, ' ');
  }

  /**
   * Check if string is empty or only whitespace
   * @param {string} str - Input string
   * @returns {boolean} Is empty
   */
  static isEmpty(str) {
    return !str || typeof str !== 'string' || str.trim().length === 0;
  }

  /**
   * Generate slug from string
   * @param {string} str - Input string
   * @returns {string} URL-friendly slug
   */
  static slugify(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Extract initials from full name
   * @param {string} name - Full name
   * @param {number} maxInitials - Maximum number of initials
   * @returns {string} Initials
   */
  static getInitials(name, maxInitials = 2) {
    if (!name || typeof name !== 'string') return '';
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .slice(0, maxInitials)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Format file size in human readable format
   * @param {number} bytes - Size in bytes
   * @param {number} decimals - Number of decimals
   * @returns {string} Formatted size
   */
  static formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

export default StringUtils;
