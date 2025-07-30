import { BaseService } from './BaseService';
import { API_CONFIG } from '../config/api';

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
      
      // Create comprehensive notes
      const fullNotes = this.createFullNotes(formData);
      formDataObj.append('notes', fullNotes);

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
    
    // Room dimensions
    if (formData.width && formData.length && formData.height) {
      notes.push(`Oda Boyutları: ${formData.width}cm x ${formData.length}cm x ${formData.height}cm (G x U x Y)`);
    } else if (formData.width && formData.length) {
      notes.push(`Oda Boyutları: ${formData.width}cm x ${formData.length}cm (Genişlik x Uzunluk)`);
      if (formData.height) {
        notes.push(`Tavan Yüksekliği: ${formData.height}cm`);
      }
    }

    // Extra areas (protrusions)
    if (formData.extras && formData.extras.length > 0) {
      notes.push(`Ekstra Alanlar:`);
      formData.extras.forEach((extra, index) => {
        notes.push(`  ${index + 1}. ${extra.width}cm x ${extra.length}cm (Konum: x:${extra.x}cm, y:${extra.y}cm)`);
      });
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
}

// Create and export singleton instance
export const designService = new DesignService();
export default designService;
