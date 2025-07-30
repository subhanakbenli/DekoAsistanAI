import { useWebSocket } from './useWebSocket';
import { useFormState } from './useFormState';
import { useDesignSubmission } from './useDesignSubmission';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * Composed room design hook - Orchestrates all design-related functionality
 * Combines WebSocket, form state, and design submission hooks
 * 
 * @returns {Object} Complete room design interface
 */
export const useRoomDesign = () => {
  // Composed hooks
  const webSocket = useWebSocket();
  const formState = useFormState();
  const designSubmission = useDesignSubmission();

  /**
   * Submit design with full validation and error handling
   */
  const handleSubmit = async () => {
    try {
      // Validate form first
      const validation = formState.validateForm();
      
      if (!validation.isValid) {
        const errorMessage = ErrorHandler.handleValidationErrors(validation.errors);
        alert(errorMessage);
        return false;
      }

      // Reset mood board state before new submission
      webSocket.resetMoodBoardState();
      
      // Get clean form data
      const formData = formState.getFormData();
      
      // Submit design with WebSocket callback
      const success = await designSubmission.submitDesign(
        formData, 
        webSocket.connectionId,
        () => {
          // Callback when mood board generation starts
          console.log('🎨 Mood board generation started');
        }
      );
      
      return success;
      
    } catch (error) {
      ErrorHandler.handle(error, 'Design Submission Handler', {
        showAlert: true,
        logToConsole: true
      });
      return false;
    }
  };

  /**
   * Reset all states to initial values
   */
  const resetAll = () => {
    formState.resetForm();
    designSubmission.clearResult();
    webSocket.resetMoodBoardState();
  };

  /**
   * Check if submit is possible
   * @returns {boolean} Whether submit can be performed
   */
  const canSubmit = () => {
    return !designSubmission.isLoading && 
           formState.form.width && 
           formState.form.length && 
           formState.form.height &&
           formState.form.notes?.trim();
  };

  // Return composed interface
  return {
    // Form State
    form: formState.form,
    newBlock: formState.newBlock,
    isDirty: formState.isDirty,
    
    // Form Actions
    handleChange: formState.handleFormChange,
    handleExtraChange: formState.handleBlockChange,
    addBlock: formState.addBlock,
    removeBlock: formState.removeBlock,
    resetForm: formState.resetForm,
    updateForm: formState.updateForm,
    
    // Design Submission
    result: designSubmission.result,
    isLoading: designSubmission.isLoading,
    error: designSubmission.error,
    hasValidResult: designSubmission.hasValidResult,
    resultStatus: designSubmission.resultStatus,
    
    // WebSocket
    moodBoard: webSocket.moodBoard,
    progress: webSocket.progress,
    isMoodBoardLoading: webSocket.isMoodBoardLoading,
    connectionId: webSocket.connectionId,
    isConnected: webSocket.isConnected,
    
    // Composed Actions
    handleSubmit,
    resetAll,
    canSubmit: canSubmit(),
    
    // Advanced Actions
    retrySubmission: (formData, connectionId, callback) => 
      designSubmission.retrySubmission(formData || formState.getFormData(), connectionId || webSocket.connectionId, callback),
    saveToHistory: designSubmission.saveToHistory,
    reconnectWebSocket: webSocket.reconnect
  };
};
