from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_manager import websocket_manager
from config import logger

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time mood board progress tracking.
    """
    connection_id = None
    
    try:
        # Connect WebSocket
        connection_id = await websocket_manager.connect(websocket)
        
        # Keep connection alive and handle incoming messages
        while True:
            # Wait for client messages (ping/pong, connection status, etc.)
            data = await websocket.receive_text()
            
            # Handle client messages if needed
            logger.debug(f"Received message from {connection_id}: {data}")
            
            # For now, we just acknowledge the message
            await websocket_manager.send_personal_message({
                "type": "message_acknowledged",
                "original_message": data,
                "connection_id": connection_id
            }, connection_id)
            
    except WebSocketDisconnect:
        logger.debug(f"WebSocket connection disconnected: {connection_id}")
        if connection_id:
            websocket_manager.disconnect(connection_id)
            
    except Exception as e:
        logger.error(f"WebSocket error for {connection_id}: {str(e)}")
        if connection_id:
            websocket_manager.disconnect(connection_id)


@router.get("/ws/stats")
async def websocket_stats():
    """
    Get WebSocket connection statistics.
    """
    return {
        "success": True,
        "data": {
            "active_connections": websocket_manager.get_connection_count(),
            "connection_ids": websocket_manager.get_active_connections()
        },
        "message": "WebSocket statistics retrieved successfully"
    }
