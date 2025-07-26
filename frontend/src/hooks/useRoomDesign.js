import { useState, useEffect, useRef } from 'react';
import { validateForm, validateBlock, generateDesignSuggestion } from '../utils/roomDesignUtils';
import { DesignService } from '../services/designService';

/**
 * Oda tasarımı hook'u - Ana business logic
 * @returns {Object} State ve handler fonksiyonları
 */
export const useRoomDesign = () => {
  const [form, setForm] = useState({
    roomType: 'salon',
    designStyle: 'modern',
    notes: '',
    width: '',
    length: '',
    height: '',
    extras: []
  });

  const [newBlock, setNewBlock] = useState({
    width: '', length: '', x: '', y: ''
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // WebSocket state
  const [moodBoard, setMoodBoard] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isMoodBoardLoading, setIsMoodBoardLoading] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const wsRef = useRef(null);

  // WebSocket bağlantısı kur
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8000/api/ws');
        
        wsRef.current.onopen = () => {
          console.log('🔗 WebSocket connected');
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);

          switch (data.type) {
            case 'connection_established':
              setConnectionId(data.connection_id);
              console.log('✅ Connection ID set:', data.connection_id);
              break;

            case 'mood_board_progress':
              setProgress(data.progress);
              setIsMoodBoardLoading(true);
              console.log('📊 Progress update:', data.progress);
              break;

            case 'mood_board_completed':
              setMoodBoard(data.mood_board);
              setProgress(null);
              setIsMoodBoardLoading(false);
              console.log('🎨 Mood board completed:', data.mood_board);
              break;

            case 'mood_board_error':
              setProgress({ type: 'mood_board_error', error: data.error });
              setIsMoodBoardLoading(false);
              console.error('❌ Mood board error:', data.error);
              break;

            default:
              console.log('📦 Unknown message type:', data.type);
          }
        };

        wsRef.current.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code);
          // Reconnect after 3 seconds
          setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
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
      const response = await DesignService.submitDesignRequest(form, connectionId);
      
      console.log('🔄 Hook received response:', response);
      
      if (response.success) {
        // Backend'den gelen veriyi direkt result'a set et
        console.log('✅ Setting result to:', response.data);
        setResult(response.data);
        
        // Mood board loading başlat (eğer connection_id varsa)
        if (connectionId && response.data.message && response.data.message.includes('connection:')) {
          setIsMoodBoardLoading(true);
          console.log('🎨 Starting mood board generation...');
        }
        
        alert('✅ Tasarım önerisi başarıyla oluşturuldu!');
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Submit error:', error);
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
