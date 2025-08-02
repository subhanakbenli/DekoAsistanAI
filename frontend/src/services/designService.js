import { BaseService } from './BaseService';

/**
 * DesignService - Interior design and AI-powered room design service
 * Extends BaseService to provide design-specific functionality
 */
class DesignService extends BaseService {
  constructor() {
    super();
    this.endpoints = {
      DESIGN_TEST: '/design/test',
      DESIGN_HISTORY: '/design/history',
      DESIGN_DETAIL: '/design'
    };
  }

  /**
   * Submit design request to backend with WebSocket support
   * @param {Object} formData - Design form data
   * @param {string|null} connectionId - WebSocket connection ID
   * @returns {Promise<Object>} Design response with success/error status
   */
  async submitDesignRequest(formData, connectionId = null) {
    try {
      const formDataObj = new FormData();
      
      // Add form fields
      formDataObj.append('room_type', formData.roomType);
      formDataObj.append('design_style', formData.designStyle);
      
      // Create comprehensive notes (excluding color and dimensions - they're separate now)
      const fullNotes = this.createFullNotes(formData);
      formDataObj.append('notes', fullNotes);

      // Add color info as separate parameter (professional approach)
      const colorInfo = this.formatColorInfo(formData.colorPalette);
      if (colorInfo) {
        formDataObj.append('color_info', colorInfo);
      }

      // Add dimensions as separate parameters (professional approach)  
      if (formData.width) {
        formDataObj.append('width', formData.width);
      }
      if (formData.length) {
        formDataObj.append('length', formData.length);
      }
      if (formData.height) {
        formDataObj.append('height', formData.height);
      }

      // Add product categories as separate parameter (professional approach)
      if (formData.productCategories) {
        formDataObj.append('product_categories', JSON.stringify(formData.productCategories));
      }

      // Add WebSocket connection ID if available
      if (connectionId) {
        formDataObj.append('connection_id', connectionId);
      }

      // Use fetch for FormData (better compatibility)
      const response = await fetch(`${this.baseURL}${this.endpoints.DESIGN_TEST}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Backend response structure check - actual data is in 'output' field
      const actualData = result.output || result;
      
      return {
        success: true,
        data: actualData
      };

    } catch (error) {
      console.error('Design service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Converts form data into comprehensive notes for AI processing
   * @private
   * @param {Object} formData - Form data object
   * @returns {string} Formatted notes string
   */
  createFullNotes(formData) {
    let notes = [];
    
    // Extra areas (protrusions) - dimensions and colors are sent separately now
    if (formData.extras && formData.extras.length > 0) {
      notes.push(`Ekstra Alanlar:`);
      formData.extras.forEach((extra, index) => {
        notes.push(`  ${index + 1}. ${extra.width}cm x ${extra.length}cm (Konum: x:${extra.x}cm, y:${extra.y}cm)`);
      });
    }

    // Product categories information - YENİ EKLENEN!
    if (formData.productCategories) {
      if (formData.productCategories.type === 'categories') {
        const products = formData.productCategories.products || [];
        if (products.length > 0) {
          notes.push(`Seçilen Ürün Kategorileri:`);
          products.forEach(product => {
            notes.push(`  - ${product.name} (${product.icon})`);
          });
        }
      } else if (formData.productCategories.type === 'custom') {
        notes.push(`Özel Ürün Açıklaması: ${formData.productCategories.description}`);
      }
    }

    // Door/Window position information - KAPIYA HAZIR!
    if (formData.doorWindow) {
      notes.push(`Kapı/Pencere Pozisyonları: ${JSON.stringify(formData.doorWindow)}`);
    }

    // User notes
    if (formData.notes?.trim()) {
      notes.push(`Kullanıcı Notları: ${formData.notes}`);
    }

    return notes.join('\n');
  }

  /**
   * Get design history for authenticated user
   * @returns {Promise<Array>} Design history
   */
  async getDesignHistory() {
    try {
      return await this.get(this.endpoints.DESIGN_HISTORY);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get design details by ID
   * @param {string} designId - Design ID
   * @returns {Promise<Object>} Design details
   */
  async getDesignDetails(designId) {
    try {
      return await this.get(`${this.endpoints.DESIGN_DETAIL}/${designId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format color palette information for backend
   * @private
   * @param {Object} colorPalette - Color palette data
   * @returns {string} Formatted color information
   */
  formatColorInfo(colorPalette) {
    if (!colorPalette) return '';

    if (colorPalette.type === 'palette' && colorPalette.palette) {
      const palette = colorPalette.palette;
      let colorInfo = `Renk Paleti: ${palette.name} - ${palette.description}\n`;
      if (palette.colors && palette.colors.length > 0) {
        colorInfo += `Renk Kodları: ${palette.colors.join(', ')}`;
      }
      return colorInfo;
    } else if (colorPalette.type === 'custom' && colorPalette.description) {
      return `Özel Renk Tercihi: ${colorPalette.description}`;
    }

    return '';
  }

  /**
   * Format dimensions information for backend
   * @private
   * @param {Object} formData - Form data containing dimensions
   * @returns {string} Formatted dimensions information
   */
  formatDimensionsInfo(formData) {
    if (!formData.width || !formData.length) return '';

    let dimensionsInfo = `Oda Boyutları: ${formData.width}cm x ${formData.length}cm`;
    
    if (formData.height) {
      dimensionsInfo += ` x ${formData.height}cm (G x U x Y)`;
    } else {
      dimensionsInfo += ' (Genişlik x Uzunluk)';
    }

    return dimensionsInfo;
  }
}

// Create and export singleton instance
export const designService = new DesignService();
export default designService;
