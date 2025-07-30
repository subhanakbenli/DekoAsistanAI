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

            case 'mood_board_progress':
              setProgress(data.progress);
              setIsMoodBoardLoading(true);
              break;

            case 'mood_board_completed':
              setMoodBoard(data.mood_board);
              setProgress(null);
              setIsMoodBoardLoading(false);
              break;

            case 'mood_board_error':
              setProgress({ type: 'mood_board_error', error: data.error });
              setIsMoodBoardLoading(false);
              console.error('❌ Mood board error:', data.error);
              break;

            default:
              // Unknown message type
          }
        };

        wsRef.current.onclose = (event) => {
          // Reconnect after 3 seconds
          setTimeout(() => {
            connectWebSocket();
          }, 3000);
        };

        wsRef.current.onerror = (error) => {
          console.error('🚨 WebSocket error:', error);
        };

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Form değişiklik handler'ı
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Çıkıntı form değişiklik handler'ı
  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setNewBlock(prev => ({ ...prev, [name]: value }));
  };

  // Çıkıntı ekleme
  const addBlock = () => {
    const roomDimensions = {
      width: parseInt(form.width) || 0,
      length: parseInt(form.length) || 0
    };

    const validation = validateBlock(newBlock, roomDimensions);
    
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const blockToAdd = {
      ...newBlock,
      width: parseInt(newBlock.width),
      length: parseInt(newBlock.length),
      x: parseInt(newBlock.x) || 0,
      y: parseInt(newBlock.y) || 0
    };

    setForm(prev => ({
      ...prev,
      extras: [...prev.extras, blockToAdd]
    }));
    
    setNewBlock({ width: '', length: '', x: '', y: '' });
  };

  // Çıkıntı silme
  const removeBlock = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      extras: prev.extras.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Form gönderme - Backend'e istek gönder
  const handleSubmit = async () => {
    const validation = validateForm(form);
    
    if (!validation.isValid) {
      const errorMessage = '⚠️ Eksik Bilgi!\n\nLütfen aşağıdaki alanları doldurun:\n• ' + 
        validation.errors.join('\n• ') + 
        '\n\n💡 Tüm bilgiler tasarım önerisi için gereklidir.';
      alert(errorMessage);
      return;
    }

    setIsLoading(true);
    
    // Reset mood board states
    setMoodBoard(null);
    setProgress(null);
    setIsMoodBoardLoading(false);
    
    try {
      // Backend'e istek gönder (connectionId ile birlikte)
      const response = await designService.submitDesignRequest(form, connectionId);
      
      if (response.success) {
        // Backend'den gelen veriyi direkt result'a set et
        setResult(response.data);
        
        // Mood board loading başlat (eğer connection_id varsa)
        if (connectionId && response.data?.message?.includes('connection:')) {
          setIsMoodBoardLoading(true);
        }
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      // Only show alert for errors, not for success
      alert(`❌ Hata: ${error.message}`);
      
      // Hata durumunda fallback olarak lokal tasarım önerisi göster
      const designResult = generateDesignSuggestion(form);
      setResult(designResult);
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    form,
    newBlock,
    result,
    isLoading,
    
    // WebSocket State
    moodBoard,
    progress,
    isMoodBoardLoading,
    connectionId,
    
    // Handlers
    handleChange,
    handleExtraChange,
    addBlock,
    removeBlock,
    handleSubmit
  };
};
