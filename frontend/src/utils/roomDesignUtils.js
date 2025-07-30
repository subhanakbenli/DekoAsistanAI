import ValidationUtils from './ValidationUtils';

/**
 * RoomDesignUtils - Room design utility class
 * Provides room design specific operations and calculations
 */
class RoomDesignUtils {
  /**
   * Room types with Turkish labels
   */
  static ROOM_TYPES = {
    'living_room': 'Oturma Odası',
    'bedroom': 'Yatak Odası',
    'kitchen': 'Mutfak',
    'bathroom': 'Banyo',
    'office': 'Çalışma Odası',
    'dining_room': 'Yemek Odası'
  };

  /**
   * Design styles with descriptions
   */
  static DESIGN_STYLES = {
    'modern': 'Modern',
    'classic': 'Klasik',
    'minimalist': 'Minimalist',
    'industrial': 'Endüstriyel',
    'scandinavian': 'İskandinav',
    'bohemian': 'Bohem'
  };

  /**
   * Validate room design form
   * @param {Object} form - Form data
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  static validateForm(form) {
    return ValidationUtils.validateRoomForm(form);
  }

  /**
   * Validate room block/extension
   * @param {Object} block - Block data
   * @param {Object} roomDimensions - Room dimensions {width, length}
   * @returns {Object} {isValid: boolean, error: string}
   */
  static validateBlock(block, roomDimensions) {
    return ValidationUtils.validateRoomBlock(block, roomDimensions);
  }

  /**
   * Calculate room area
   * @param {number} width - Room width in cm
   * @param {number} length - Room length in cm
   * @returns {number} Area in square meters
   */
  static calculateArea(width, length) {
    if (!width || !length || width <= 0 || length <= 0) {
      return 0;
    }
    return (width * length) / 10000; // Convert cm² to m²
  }

  /**
   * Calculate room volume
   * @param {number} width - Room width in cm
   * @param {number} length - Room length in cm
   * @param {number} height - Room height in cm
   * @returns {number} Volume in cubic meters
   */
  static calculateVolume(width, length, height) {
    if (!width || !length || !height || width <= 0 || length <= 0 || height <= 0) {
      return 0;
    }
    return (width * length * height) / 1000000; // Convert cm³ to m³
  }

  /**
   * Generate design suggestion based on form data
   * @param {Object} form - Form data
   * @returns {Object} Design suggestion
   */
  static generateDesignSuggestion(form) {
    const area = RoomDesignUtils.calculateArea(form.width, form.length);
    const roomTypeLabel = RoomDesignUtils.ROOM_TYPES[form.roomType] || form.roomType;
    const styleLabel = RoomDesignUtils.DESIGN_STYLES[form.designStyle] || form.designStyle;

    return {
      suggestion: `${styleLabel} tarzında ${roomTypeLabel} için öneriler hazır!`,
      area: `${area.toFixed(1)} m²`,
      dimensions: `${form.width} × ${form.length} × ${form.height} cm`,
      extras: form.extras || [],
      roomType: roomTypeLabel,
      designStyle: styleLabel
    };
  }

  /**
   * Check if room dimensions are realistic
   * @param {number} width - Room width in cm
   * @param {number} length - Room length in cm
   * @param {number} height - Room height in cm
   * @returns {Object} {isRealistic: boolean, warnings: string[]}
   */
  static checkRealisticDimensions(width, length, height) {
    const warnings = [];
    let isRealistic = true;

    const area = RoomDesignUtils.calculateArea(width, length);
    
    // Very small room (less than 5m²)
    if (area < 5) {
      warnings.push('Oda çok küçük görünüyor. Gerçekçi mi?');
      isRealistic = false;
    }
    
    // Very large room (more than 100m²)
    if (area > 100) {
      warnings.push('Oda çok büyük görünüyor. Gerçekçi mi?');
    }
    
    // Very low ceiling (less than 200cm)
    if (height < 200) {
      warnings.push('Tavan çok alçak görünüyor.');
      isRealistic = false;
    }
    
    // Very high ceiling (more than 400cm)
    if (height > 400) {
      warnings.push('Tavan çok yüksek görünüyor.');
    }

    return { isRealistic, warnings };
  }
}

export default RoomDesignUtils;

// Legacy exports for backward compatibility
export const validateForm = RoomDesignUtils.validateForm;
export const validateBlock = RoomDesignUtils.validateBlock;
export const generateDesignSuggestion = RoomDesignUtils.generateDesignSuggestion;
