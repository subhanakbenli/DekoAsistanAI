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
        console.log('🔗 Adding connection_id to request:', connectionId);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/test`, {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('✅ Backend Response Received:');
      console.log('📊 Full Response:', result);
      console.log('🎯 Response Structure:', {
        success: result.success,
        message: result.message,
        design_title: result.design_title,
        design_description: result.design_description,
        product_suggestion: result.product_suggestion,
        room_type: result.room_type,
        design_style: result.design_style,
        notes: result.notes
      });
      
      return {
        success: true,
        data: result
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
