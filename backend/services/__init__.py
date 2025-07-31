"""
Services Package - Organized service layer following KISS principle.
Services are grouped by domain responsibility for better maintainability.
"""
from .base_service import BaseService

# AI Services
from .ai import GeminiService, GeminiClient, NotesParser, ResponseProcessor

# Authentication Services  
from .auth import AuthService

# Design Services
from .design import (
    DesignHistoryService, 
    HashtagService,
    MoodBoardService, 
    mood_board_service,
    MoodBoardLogService,
    mood_board_log_service
)

# Communication Services
from .communication import WebSocketManager, websocket_manager

__all__ = [
    # Base
    "BaseService",
    
    # AI Services
    "GeminiService",
    "GeminiClient", 
    "NotesParser",
    "ResponseProcessor",
    
    # Auth Services
    "AuthService",
    
    # Design Services
    "DesignHistoryService",
    "HashtagService",
    "MoodBoardService", 
    "mood_board_service",
    "MoodBoardLogService",
    "mood_board_log_service",
    
    # Communication Services
    "WebSocketManager",
    "websocket_manager"
]
