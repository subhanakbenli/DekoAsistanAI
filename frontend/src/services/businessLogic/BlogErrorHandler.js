import { ErrorHandler } from '../../utils/ErrorHandler';

/**
 * Blog Error Handler - Specialized error handling for blog operations
 * Extends base ErrorHandler with blog-specific error handling
 */
export class BlogErrorHandler extends ErrorHandler {
  
  /**
   * Handle like operation errors
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  static handleLikeError(error) {
    if (error.response?.status === 401) {
      return 'Beğeni için giriş yapmalısınız';
    }
    if (error.response?.status === 404) {
      return 'Tasarım bulunamadı';
    }
    if (error.response?.status === 429) {
      return 'Çok fazla istek gönderdiniz, lütfen bekleyin';
    }
    return 'Beğeni işlemi başarısız oldu';
  }

  /**
   * Handle view recording errors
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  static handleViewError(error) {
    // View errors are usually not critical, return generic message
    return 'Görüntülenme kaydedilemedi';
  }

  /**
   * Handle blog post fetching errors
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  static handleFetchError(error) {
    if (error.response?.status === 503) {
      return 'Sunucu geçici olarak kullanılamıyor, lütfen tekrar deneyin';
    }
    if (error.code === 'NETWORK_ERROR') {
      return 'İnternet bağlantınızı kontrol edin';
    }
    return 'Blog gönderileri yüklenirken bir hata oluştu';
  }

  /**
   * Handle filter operation errors
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  static handleFilterError(error) {
    return 'Filtre seçenekleri yüklenirken bir hata oluştu';
  }

  /**
   * Determine if error is retriable
   * @param {Error} error - Error object
   * @returns {boolean} True if operation can be retried
   */
  static isRetriableError(error) {
    const retriableCodes = [503, 502, 504, 'NETWORK_ERROR', 'TIMEOUT'];
    return retriableCodes.includes(error.response?.status) || 
           retriableCodes.includes(error.code);
  }

  /**
   * Get retry delay based on error type
   * @param {Error} error - Error object
   * @param {number} attemptCount - Current attempt count
   * @returns {number} Delay in milliseconds
   */
  static getRetryDelay(error, attemptCount = 1) {
    const baseDelay = 1000; // 1 second
    const maxDelay = 10000; // 10 seconds
    
    // Exponential backoff
    const delay = Math.min(baseDelay * Math.pow(2, attemptCount - 1), maxDelay);
    
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }
}
