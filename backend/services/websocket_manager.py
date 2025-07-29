from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
from config import logger
import json
import uuid
from datetime import datetime

class WebSocketManager:
    """
    WebSocket connection manager for real-time mood board progress tracking.
    """
    
    def __init__(self):
        # Active WebSocket connections
        self.active_connections: Dict[str, WebSocket] = {}
        # Track mood board generation progress
        self.mood_board_progress: Dict[str, Dict] = {}
        
        logger.info("WebSocket Manager initialized")
    
    async def connect(self, websocket: WebSocket) -> str:
        """
        Accept new WebSocket connection and return connection ID.
        """
        await websocket.accept()
        connection_id = str(uuid.uuid4())
        self.active_connections[connection_id] = websocket
        
        logger.debug(f"New WebSocket connection established: {connection_id}")
        
        # Send connection confirmation
        await self.send_personal_message({
            "type": "connection_established",
            "connection_id": connection_id,
            "timestamp": datetime.now().isoformat(),
            "message": "WebSocket connection established successfully"
        }, connection_id)
        
        return connection_id
    
    def disconnect(self, connection_id: str):
        """
        Remove WebSocket connection.
        """
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
            
        if connection_id in self.mood_board_progress:
            del self.mood_board_progress[connection_id]
            
        logger.debug(f"WebSocket connection removed: {connection_id}")
    
    async def send_personal_message(self, message: dict, connection_id: str):
        """
        Send message to specific WebSocket connection.
        """
        if connection_id in self.active_connections:
            try:
                websocket = self.active_connections[connection_id]
                await websocket.send_text(json.dumps(message))
                logger.debug(f"Message sent to {connection_id}: {message.get('type', 'unknown')}")
            except Exception as e:
                logger.error(f"Error sending message to {connection_id}: {str(e)}")
                self.disconnect(connection_id)
    
    async def broadcast_message(self, message: dict):
        """
        Send message to all active WebSocket connections.
        """
        disconnected = []
        for connection_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to {connection_id}: {str(e)}")
                disconnected.append(connection_id)
        
        # Clean up disconnected connections
        for connection_id in disconnected:
            self.disconnect(connection_id)
    
    async def update_mood_board_progress(self, connection_id: str, progress_data: dict):
        """
        Update mood board generation progress and notify client.
        """
        if connection_id not in self.mood_board_progress:
            self.mood_board_progress[connection_id] = {}
        
        # Update progress data
        self.mood_board_progress[connection_id].update(progress_data)
        
        # Send progress update to client
        progress_message = {
            "type": "mood_board_progress",
            "connection_id": connection_id,
            "progress": progress_data,
            "timestamp": datetime.now().isoformat()
        }
        
        await self.send_personal_message(progress_message, connection_id)
        logger.info(f"Mood board progress updated for {connection_id}: {progress_data.get('stage', 'unknown')}")
    
    async def send_mood_board_completed(self, connection_id: str, mood_board_data: dict):
        """
        Send completed mood board data to client.
        """
        completion_message = {
            "type": "mood_board_completed",
            "connection_id": connection_id,
            "mood_board": mood_board_data,
            "timestamp": datetime.now().isoformat()
        }
        
        await self.send_personal_message(completion_message, connection_id)
        
        # Clean up progress tracking
        if connection_id in self.mood_board_progress:
            del self.mood_board_progress[connection_id]
        
        logger.info(f"Mood board completed and sent to {connection_id}")
    
    async def send_mood_board_error(self, connection_id: str, error_message: str):
        """
        Send mood board generation error to client.
        """
        error_response = {
            "type": "mood_board_error",
            "connection_id": connection_id,
            "error": error_message,
            "timestamp": datetime.now().isoformat()
        }
        
        await self.send_personal_message(error_response, connection_id)
        
        # Clean up progress tracking
        if connection_id in self.mood_board_progress:
            del self.mood_board_progress[connection_id]
        
        logger.error(f"Mood board error sent to {connection_id}: {error_message}")
    
    def get_connection_count(self) -> int:
        """
        Get current active connection count.
        """
        return len(self.active_connections)
    
    def get_active_connections(self) -> List[str]:
        """
        Get list of active connection IDs.
        """
        return list(self.active_connections.keys())


# Global WebSocket manager instance
websocket_manager = WebSocketManager()
