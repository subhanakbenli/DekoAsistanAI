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
        break;

      case 'room_visualization_progress':
      case 'mood_board_progress': // Backward compatibility
        setProgress(data.progress);
        setIsMoodBoardLoading(true);
        break;

      case 'room_visualization_completed':
      case 'mood_board_completed': // Backward compatibility
        setMoodBoard(data.room_visualization || data.mood_board);
        setProgress(null);
        setIsMoodBoardLoading(false);
        break;

      case 'room_visualization_error':
      case 'mood_board_error': // Backward compatibility
        setProgress({ type: 'room_visualization_error', error: data.error });
        setIsMoodBoardLoading(false);
        console.error('❌ Room visualization error:', data.error);
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
