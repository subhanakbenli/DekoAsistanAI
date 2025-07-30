import { useState, useEffect, useRef } from 'react';

/**
 * WebSocket connection and mood board management hook
 * Handles WebSocket connectivity, mood board progress, and real-time updates
 */
export const useWebSocket = () => {
  const [moodBoard, setMoodBoard] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isMoodBoardLoading, setIsMoodBoardLoading] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  /**
   * Connect to WebSocket server
   */
  const connectWebSocket = () => {
    try {
      wsRef.current = new WebSocket('ws://localhost:8000/api/ws');
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('🔗 WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        console.log('🔌 WebSocket disconnected');
        
        // Reconnect after 3 seconds if not manually closed
        if (!event.wasClean) {
          setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('🚨 WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
    }
  };

  /**
   * Handle incoming WebSocket messages
   * @private
   */
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'connection_established':
        setConnectionId(data.connection_id);
        console.log('✅ WebSocket connection ID received:', data.connection_id);
        break;

      case 'mood_board_progress':
        setProgress(data.progress);
        setIsMoodBoardLoading(true);
        console.log('📊 Mood board progress:', data.progress);
        break;

      case 'mood_board_completed':
        setMoodBoard(data.mood_board);
        setProgress(null);
        setIsMoodBoardLoading(false);
        console.log('🎨 Mood board completed');
        break;

      case 'mood_board_error':
        setProgress({ type: 'mood_board_error', error: data.error });
        setIsMoodBoardLoading(false);
        console.error('❌ Mood board error:', data.error);
        break;

      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  };

  /**
   * Reset mood board state for new requests
   */
  const resetMoodBoardState = () => {
    setMoodBoard(null);
    setProgress(null);
    setIsMoodBoardLoading(false);
  };

  /**
   * Disconnect WebSocket
   */
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect'); // Clean close
      wsRef.current = null;
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    const connect = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8000/api/ws');
        
        wsRef.current.onopen = () => {
          setIsConnected(true);
          console.log('🔗 WebSocket connected');
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        };

        wsRef.current.onclose = (event) => {
          setIsConnected(false);
          console.log('🔌 WebSocket disconnected');
          
          // Reconnect after 3 seconds if not manually closed
          if (!event.wasClean) {
            setTimeout(() => {
              connect();
            }, 3000);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('🚨 WebSocket error:', error);
          setIsConnected(false);
        };

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setIsConnected(false);
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Manual disconnect');
        wsRef.current = null;
      }
    };
  }, []);

  return {
    // State
    moodBoard,
    progress,
    isMoodBoardLoading,
    connectionId,
    isConnected,
    
    // Actions
    resetMoodBoardState,
    reconnect: connectWebSocket,
    disconnect: disconnectWebSocket
  };
};

export default useWebSocket;
