/**
 * ValidationUtils - Comprehensive validation utility class
 * Provides standardized validation methods for different data types
 */
export class ValidationUtils {
  // Constants for validation limits
  static LIMITS = {
    ROOM: {
      MAX_HEIGHT: 2000,  // 20m
      MAX_WIDTH: 5000,   // 50m
      MAX_LENGTH: 5000,  // 50m
      MIN_SIZE: 10       // 10cm minimum
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128
    },
    EMAIL: {
      MAX_LENGTH: 255
    }
  };

  // Regex patterns
  static PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+90|0)?[0-9]{10}$/,
    STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  };

  /**
   * Validate room design form
   * @param {Object} form - Form data object
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  static validateRoomForm(form) {
    const errors = [];
    
    // Width validation
    const widthError = this.validateRoomDimension(form.width, 'Oda genişliği', this.LIMITS.ROOM.MAX_WIDTH);
    if (widthError) errors.push(widthError);
    
    // Length validation
    const lengthError = this.validateRoomDimension(form.length, 'Oda uzunluğu', this.LIMITS.ROOM.MAX_LENGTH);
    if (lengthError) errors.push(lengthError);
    
    // Height validation
    const heightError = this.validateRoomDimension(form.height, 'Oda yüksekliği', this.LIMITS.ROOM.MAX_HEIGHT);
    if (heightError) errors.push(heightError);
    
    // Notes validation - OPTIONAL (removed from required fields)
    // Notes are now optional - user can create designs without notes
    
    // Color palette validation (optional but recommended)
    // Removed console.warn to reduce noise
    
    // Product categories validation (optional but recommended)  
    // Removed console.warn to reduce noise

    // Door/window validation (check for conflicts)
    if (form.doorWindow) {
      const doorWindowError = this.validateDoorWindow(form.doorWindow);
      if (doorWindowError) errors.push(doorWindowError);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate single room dimension
   * @private
   * @param {string|number} value - Dimension value
   * @param {string} fieldName - Field name for error message
   * @param {number} maxValue - Maximum allowed value
   * @returns {string|null} Error message or null
   */
  static validateRoomDimension(value, fieldName, maxValue) {
    if (!value) {
      return `${fieldName} gerekli`;
    }
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      return `${fieldName} geçerli bir sayı olmalıdır`;
    }
    
    if (numValue < this.LIMITS.ROOM.MIN_SIZE) {
      return `${fieldName} minimum ${this.LIMITS.ROOM.MIN_SIZE}cm olmalıdır`;
    }
    
    if (numValue > maxValue) {
      return `${fieldName} maksimum ${maxValue}cm (${maxValue/100}m) olmalıdır`;
    }
    
    return null;
  }



  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {Object} {isValid: boolean, error: string}
   */
  static validateEmail(email) {
    if (!email?.trim()) {
      return { isValid: false, error: 'E-posta adresi gerekli' };
    }
    
    if (email.length > this.LIMITS.EMAIL.MAX_LENGTH) {
      return { isValid: false, error: 'E-posta adresi çok uzun' };
    }
    
    if (!this.PATTERNS.EMAIL.test(email)) {
      return { isValid: false, error: 'Geçerli bir e-posta adresi girin' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @param {boolean} requireStrong - Whether to require strong password
   * @returns {Object} {isValid: boolean, error: string, strength: string}
   */
  static validatePassword(password, requireStrong = false) {
    if (!password) {
      return { isValid: false, error: 'Şifre gerekli', strength: 'none' };
    }
    
    if (password.length < this.LIMITS.PASSWORD.MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `Şifre en az ${this.LIMITS.PASSWORD.MIN_LENGTH} karakter olmalıdır`,
        strength: 'weak'
      };
    }
    
    if (password.length > this.LIMITS.PASSWORD.MAX_LENGTH) {
      return { 
        isValid: false, 
        error: 'Şifre çok uzun',
        strength: 'weak'
      };
    }
    
    // Check strength
    const strength = this.getPasswordStrength(password);
    
    if (requireStrong && strength === 'weak') {
      return {
        isValid: false,
        error: 'Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir',
        strength
      };
    }
    
    return { isValid: true, strength };
  }

  /**
   * Calculate password strength
   * @private
   * @param {string} password - Password to check
   * @returns {string} Strength level: 'weak', 'medium', 'strong'
   */
  static getPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  }

  /**
   * Validate required fields
   * @param {Object} data - Data object to validate
   * @param {Array} requiredFields - Array of required field names
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  static validateRequiredFields(data, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        errors.push(`${field} gerekli`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate notes field (allows spaces)
   * @private
   * @param {string} notes - Notes to validate
   * @returns {boolean} Whether notes are valid
   */
  static isValidNotes(notes) {
    return notes && typeof notes === 'string' && notes.trim().length > 0;
  }

  /**
   * Sanitize input string for regular input fields
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Sanitize textarea input (preserves internal spaces)
   * @param {string} input - Textarea input to sanitize
   * @returns {string} Sanitized input
   */
  static sanitizeTextarea(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, '');
  }

  /**
   * Validate Turkish phone number
   * @param {string} phone - Phone number to validate
   * @returns {Object} {isValid: boolean, error: string}
   */
  static validatePhone(phone) {
    if (!phone?.trim()) {
      return { isValid: false, error: 'Telefon numarası gerekli' };
    }
    
    if (!this.PATTERNS.PHONE.test(phone)) {
      return { isValid: false, error: 'Geçerli bir telefon numarası girin (örn: 05551234567)' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate door/window configuration
   * @param {Object} doorWindow - Door/window configuration
   * @returns {string|null} Error message or null
   */
  static validateDoorWindow(doorWindow) {
    if (!doorWindow) return null;

    const { door, window } = doorWindow;

    // Check if both door and window are positioned on the same wall
    if (door && window && door.hasDoor && window.hasWindow) {
      if (door.position === window.position) {
        return 'Kapı ve pencere aynı duvarda olamaz';
      }
    }

    return null;
  }

  /**
   * Validate color palette selection
   * @param {Object} colorPalette - Color palette data
   * @returns {string|null} Error message or null
   */
  static validateColorPalette(colorPalette) {
    if (!colorPalette) return null;

    if (colorPalette.type === 'custom') {
      if (!colorPalette.description || colorPalette.description.trim().length < 10) {
        return 'Özel renk açıklaması en az 10 karakter olmalıdır';
      }
    } else if (colorPalette.type === 'palette') {
      if (!colorPalette.palette || !colorPalette.palette.id) {
        return 'Geçersiz renk paleti seçimi';
      }
    }

    return null;
  }

  /**
   * Validate product categories selection  
   * @param {Object} productCategories - Product categories data
   * @returns {string|null} Error message or null
   */
  static validateProductCategories(productCategories) {
    if (!productCategories) return null;

    if (productCategories.type === 'custom') {
      if (!productCategories.description || productCategories.description.trim().length < 10) {
        return 'Özel ürün açıklaması en az 10 karakter olmalıdır';
      }
    } else if (productCategories.type === 'categories') {
      if (!productCategories.productIds || productCategories.productIds.length === 0) {
        return 'En az bir ürün kategorisi seçmelisiniz';
      }
    }

    return null;
  }
}

export default ValidationUtils;
