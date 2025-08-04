import { BaseService } from './BaseService';
import { DESIGN_ENDPOINTS, DESIGN_SCHEMAS } from '../config/api';

/**
 * DesignService - Interior design and AI-powered room design service
 * Extends BaseService to provide design-specific functionality
 */
class DesignService extends BaseService {
  constructor() {
    super();
    this.endpoints = DESIGN_ENDPOINTS;
    this.schemas = DESIGN_SCHEMAS;
  }

  /**
   * Submit design request to backend with JSON body
   * @param {Object} formData - Design form data
   * @param {string|null} connectionId - WebSocket connection ID
   * @returns {Promise<Object>} Design response with success/error status
   */
  async submitDesignRequest(formData, connectionId = null) {
    try {
      // Create JSON request body
      const requestBody = {
        room_type: formData.roomType,
        design_style: formData.designStyle,
        notes: this.createFullNotes(formData),
        connection_id: connectionId,
        width: formData.width ? parseInt(formData.width) : null,
        length: formData.length ? parseInt(formData.length) : null,
        height: formData.height ? parseInt(formData.height) : null,
        price: formData.price ? parseFloat(formData.price) : null
      };

      // Add color info as structured object
      if (formData.colorPalette) {
        requestBody.color_info = {
          dominantColor: formData.colorPalette.dominantColor,
          colorName: formData.colorPalette.colorName,
          colorPalette: formData.colorPalette.colorPalette
        };
      }

      // Add product categories as structured object
      if (formData.productCategories) {
        requestBody.product_categories = {
          type: formData.productCategories.type,
          products: formData.productCategories.products,
          description: formData.productCategories.description
        };
      }

      // Send JSON request
      const response = await fetch(`${this.baseURL}${this.endpoints.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(requestBody),
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
      return await this.get(this.endpoints.HISTORY);
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
      return await this.get(`${this.endpoints.DETAIL}/${designId}`);
    } catch (error) {
      throw this.handleError(error);
    }
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
