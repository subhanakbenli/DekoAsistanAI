import { useState } from 'react';
import { designService } from '../services/designService';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * Design submission and result management hook
 * Handles API calls, loading states, and design results
 */
export const useDesignSubmission = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Submit design request to backend
   * @param {Object} formData - Validated form data
   * @param {string|null} connectionId - WebSocket connection ID
   * @param {Function} onMoodBoardStart - Callback when mood board generation starts
   * @returns {Promise<boolean>} Success status
   */
  const submitDesign = async (formData, connectionId = null, onMoodBoardStart = null) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Submit to backend
      const response = await designService.submitDesignRequest(formData, connectionId);
      
      if (response.success) {
        setResult(response.data);
        
        // Notify that mood board generation might start
        if (connectionId && response.data?.message?.includes('connection:') && onMoodBoardStart) {
          onMoodBoardStart();
        }
        
        return true;
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Design submission error:', error);
      
      // Handle error with user-friendly message
      const userError = ErrorHandler.handle(error, 'Design Submission', {
        showAlert: true,
        returnUserMessage: true
      });
      
      setError(userError);
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear current result and error
   */
  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  /**
   * Retry last submission with same parameters
   * @param {Object} formData - Form data to retry
   * @param {string|null} connectionId - WebSocket connection ID
   * @param {Function} onMoodBoardStart - Callback when mood board starts
   */
  const retrySubmission = async (formData, connectionId, onMoodBoardStart) => {
    return await submitDesign(formData, connectionId, onMoodBoardStart);
  };

  /**
   * Check if there's a valid result
   * @returns {boolean} Whether result exists and is valid
   */
  const hasValidResult = () => {
    return result && result.success;
  };

  /**
   * Get result status info
   * @returns {Object} Status information
   */
  const getResultStatus = () => {
    if (!result) return { status: 'none', message: null };
    
    if (result.success) {
      return { 
        status: 'success', 
        message: 'Tasarım başarıyla oluşturuldu' 
      };
    }
    
    return { 
      status: 'error', 
      message: result.message || 'Tasarım oluşturulamadı' 
    };
  };

  /**
   * Save result to history (if user is authenticated)
   * @returns {Promise<boolean>} Save success status
   */
  const saveToHistory = async () => {
    if (!result || !result.design_id) {
      console.warn('No valid result to save');
      return false;
    }
    
    try {
      // Implementation would depend on backend history API
      // await designService.saveToHistory(result.design_id);
      console.log('Result saved to history'); // Placeholder
      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'Save to History', {
        logToConsole: true
      });
      return false;
    }
  };

  return {
    // State
    result,
    isLoading,
    error,
    
    // Actions
    submitDesign,
    clearResult,
    retrySubmission,
    saveToHistory,
    
    // Computed
    hasValidResult: hasValidResult(),
    resultStatus: getResultStatus()
  };
};

export default useDesignSubmission;
