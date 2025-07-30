/**
 * ErrorHandler - Centralized error handling utility
 * Provides consistent error processing and user-friendly messaging
 */
export class ErrorHandler {
  static ERROR_TYPES = {
    NETWORK: 'network',
    AUTHENTICATION: 'authentication', 
    VALIDATION: 'validation',
    SERVER: 'server',
    UNKNOWN: 'unknown'
  };

  static TURKISH_MESSAGES = {
    NETWORK: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
    AUTHENTICATION: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
    VALIDATION: 'Girdiğiniz bilgilerde hata var. Lütfen kontrol edin.',
    SERVER: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    UNKNOWN: 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.'
  };

  /**
   * Handle and process errors with context
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   * @param {Object} options - Error handling options
   * @returns {Object} Processed error information
   */
  static handle(error, context = 'Unknown', options = {}) {
    const {
      showAlert = false,
      logToConsole = true,
      returnUserMessage = true
    } = options;

    // Determine error type
    const errorType = this.determineErrorType(error);
    
    // Log error if enabled
    if (logToConsole) {
      console.group(`🚨 Error in ${context}`);
      console.error('Original Error:', error);
      console.error('Error Type:', errorType);
      console.error('Error Stack:', error.stack);
      console.groupEnd();
    }

    // Get user-friendly message
    const userMessage = this.getUserMessage(error, errorType);

    // Show alert if requested
    if (showAlert) {
      alert(`❌ Hata: ${userMessage}`);
    }

    const processedError = {
      originalError: error,
      type: errorType,
      context,
      userMessage,
      timestamp: new Date().toISOString(),
      ...(error.status && { status: error.status }),
      ...(error.data && { data: error.data })
    };

    return returnUserMessage ? userMessage : processedError;
  }

  /**
   * Determine error type based on error characteristics
   * @private
   * @param {Error} error - The error object
   * @returns {string} Error type
   */
  static determineErrorType(error) {
    // Network errors
    if (error.message?.includes('fetch') || 
        error.message?.includes('Network') ||
        error.code === 'NETWORK_ERROR') {
      return this.ERROR_TYPES.NETWORK;
    }

    // Authentication errors
    if (error.status === 401 || 
        error.message?.includes('Unauthorized') ||
        error.message?.includes('token')) {
      return this.ERROR_TYPES.AUTHENTICATION;
    }

    // Validation errors
    if (error.status === 400 || 
        error.status === 422 ||
        error.message?.includes('validation')) {
      return this.ERROR_TYPES.VALIDATION;
    }

    // Server errors
    if (error.status >= 500 || 
        error.message?.includes('Server')) {
      return this.ERROR_TYPES.SERVER;
    }

    return this.ERROR_TYPES.UNKNOWN;
  }

  /**
   * Get user-friendly error message
   * @private
   * @param {Error} error - The error object
   * @param {string} errorType - Determined error type
   * @returns {string} User-friendly message
   */
  static getUserMessage(error, errorType) {
    // Check for specific backend error messages
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      
      // Handle Turkish error messages from backend
      if (typeof detail === 'string') {
        if (detail.includes('E-posta') || detail.includes('email')) {
          return detail;
        }
        if (detail.includes('şifre') || detail.includes('password')) {
          return detail;
        }
      }
      
      // Handle validation error arrays
      if (Array.isArray(detail)) {
        return detail.map(err => err.msg || err.message).join(', ');
      }
    }

    // Check for enhanced error from BaseService
    if (error.data?.detail) {
      return error.data.detail;
    }

    // Fallback to type-based messages
    return this.TURKISH_MESSAGES[errorType] || this.TURKISH_MESSAGES.UNKNOWN;
  }

  /**
   * Handle form validation errors specifically
   * @param {Array} errors - Array of validation errors
   * @returns {string} Formatted error message
   */
  static handleValidationErrors(errors) {
    if (!Array.isArray(errors) || errors.length === 0) {
      return 'Validasyon hatası oluştu.';
    }

    const errorMessage = '⚠️ Eksik Bilgi!\n\nLütfen aşağıdaki alanları doldurun:\n• ' + 
      errors.join('\n• ') + 
      '\n\n💡 Tüm bilgiler gereklidir.';

    return errorMessage;
  }

  /**
   * Create a user-friendly error for API timeouts
   * @returns {string} Timeout error message
   */
  static getTimeoutMessage() {
    return 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.';
  }

  /**
   * Handle async operation errors with automatic retry
   * @param {Function} operation - Async operation to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @param {string} context - Operation context
   * @returns {Promise} Operation result or error
   */
  static async withRetry(operation, maxRetries = 3, context = 'Operation') {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw this.handle(error, `${context} (Final Attempt)`, {
            logToConsole: true,
            returnUserMessage: false
          });
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
}

export default ErrorHandler;
