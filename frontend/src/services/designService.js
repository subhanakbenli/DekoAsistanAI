import { API_CONFIG } from '../config/api';

/**
 * Design service - Backend API communication
 */
export class DesignService {
  static async submitDesignRequest(formData, connectionId = null) {
    try {
      const formDataObj = new FormData();
      
      formDataObj.append('room_type', formData.roomType);
      formDataObj.append('design_style', formData.designStyle);
      
      const fullNotes = this.createFullNotes(formData);
      formDataObj.append('notes', fullNotes);

      // WebSocket connection ID ekle (eğer varsa)
      if (connectionId) {
        formDataObj.append('connection_id', connectionId);
      }

      // Authentication token ekle
      const token = localStorage.getItem('token');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/design/test`, {
        method: 'POST',
        headers,
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
        data: actualData  // Use actualData instead of result
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
   */
  static createFullNotes(formData) {
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
}
