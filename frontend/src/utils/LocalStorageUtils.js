/**
 * LocalStorage Utilities
 * Centralized localStorage operations with error handling
 * Follows DRY principle by consolidating repetitive code
 */

export class LocalStorageUtils {
  /**
   * Safely get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === 'null') {
        return defaultValue;
      }
      
      // Try to parse JSON, return string if it fails
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Safely set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  static setItem(key, value) {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Safely remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove multiple items at once
   * @param {string[]} keys - Array of storage keys
   * @returns {boolean} Success status for all operations
   */
  static removeItems(keys) {
    return keys.every(key => this.removeItem(key));
  }

  /**
   * Clear all items with a specific prefix
   * @param {string} prefix - Key prefix to match
   * @returns {number} Number of items removed
   */
  static clearByPrefix(prefix) {
    try {
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return keysToRemove.length;
    } catch (error) {
      console.warn(`Error clearing localStorage with prefix "${prefix}":`, error);
      return 0;
    }
  }
}

/**
 * Hook-specific localStorage utilities
 * Type-safe storage operations for common patterns
 */
export class HookStorageUtils extends LocalStorageUtils {
  /**
   * Color palette specific storage operations
   */
  static colorPalette = {
    getPalette: () => this.getItem('selectedColorPalette', ''),
    setPalette: (paletteId) => this.setItem('selectedColorPalette', paletteId || ''),
    getUseCustom: () => this.getItem('useCustomColorDescription', 'false') === 'true',
    setUseCustom: (useCustom) => this.setItem('useCustomColorDescription', useCustom.toString()),
    getCustomDescription: () => this.getItem('customColorDescription', ''),
    setCustomDescription: (description) => this.setItem('customColorDescription', description),
    clear: () => this.removeItems([
      'selectedColorPalette',
      'useCustomColorDescription', 
      'customColorDescription'
    ])
  };

  /**
   * Product categories specific storage operations
   */
  static productCategories = {
    getProducts: (roomType) => this.getItem(`selectedProducts_${roomType}`, []),
    setProducts: (roomType, products) => this.setItem(`selectedProducts_${roomType}`, products),
    getUseCustom: (roomType) => this.getItem(`useCustomProducts_${roomType}`, 'false') === 'true',
    setUseCustom: (roomType, useCustom) => this.setItem(`useCustomProducts_${roomType}`, useCustom.toString()),
    getCustomDescription: (roomType) => this.getItem(`customProductDescription_${roomType}`, ''),
    setCustomDescription: (roomType, description) => this.setItem(`customProductDescription_${roomType}`, description),
    clear: (roomType) => this.removeItems([
      `selectedProducts_${roomType}`,
      `useCustomProducts_${roomType}`,
      `customProductDescription_${roomType}`
    ])
  };
}

export default LocalStorageUtils;
