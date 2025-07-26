import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
from config import logger

class MoodBoardLogService:
    """
    Service for managing mood board generation history and logs.
    """
    
    def __init__(self):
        self.mood_board_log_file = "data/mood_board_history.json"
        self._ensure_log_file_exists()
        logger.info("Mood Board Log Service initialized")
    
    def _ensure_log_file_exists(self):
        """Ensure the mood board log file exists."""
        os.makedirs(os.path.dirname(self.mood_board_log_file), exist_ok=True)
        
        if not os.path.exists(self.mood_board_log_file):
            with open(self.mood_board_log_file, 'w', encoding='utf-8') as f:
                json.dump([], f, ensure_ascii=False, indent=2)
            logger.info(f"Created mood board log file: {self.mood_board_log_file}")
    
    def save_mood_board_log(
        self,
        mood_board_id: str,
        connection_id: str,
        user_input: Dict[str, Any],
        design_content: Dict[str, Any],
        generation_result: Dict[str, Any],
        success: bool = True,
        error_message: str = None
    ) -> str:
        """
        Save mood board generation log.
        
        Args:
            mood_board_id: Unique mood board ID
            connection_id: WebSocket connection ID
            user_input: User's input data
            design_content: Design data from Gemini
            generation_result: Imagen generation result
            success: Whether generation was successful
            error_message: Error message if failed
            
        Returns:
            str: Log entry ID
        """
        
        try:
            # Create log entry
            log_entry = {
                "log_id": f"mbl_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{mood_board_id[:8]}",
                "mood_board_id": mood_board_id,
                "connection_id": connection_id,
                "timestamp": datetime.now().isoformat(),
                "user_input": user_input,
                "design_content": design_content,
                "generation_result": {
                    "success": success,
                    "model_used": generation_result.get("model", "imagen-3.0-generate-001"),
                    "generation_time": generation_result.get("generation_time"),
                    "prompt_used": generation_result.get("prompt_used"),
                    "image_generated": generation_result.get("image_data") is not None
                },
                "success": success,
                "error_message": error_message
            }
            
            # Load existing logs
            with open(self.mood_board_log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
            
            # Add new log entry
            logs.append(log_entry)
            
            # Keep only last 100 entries
            if len(logs) > 100:
                logs = logs[-100:]
            
            # Save updated logs
            with open(self.mood_board_log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, ensure_ascii=False, indent=2)
            
            logger.info(f"Mood board log saved: {log_entry['log_id']}")
            return log_entry['log_id']
            
        except Exception as e:
            logger.error(f"Error saving mood board log: {str(e)}")
            return f"error_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    def get_mood_board_history(self, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get recent mood board generation history.
        
        Args:
            limit: Maximum number of entries to return
            
        Returns:
            List of mood board log entries
        """
        
        try:
            with open(self.mood_board_log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
            
            # Return most recent entries first
            recent_logs = logs[-limit:] if len(logs) > limit else logs
            recent_logs.reverse()
            
            logger.info(f"Retrieved {len(recent_logs)} mood board history entries")
            return recent_logs
            
        except Exception as e:
            logger.error(f"Error retrieving mood board history: {str(e)}")
            return []
    
    def get_mood_board_by_id(self, mood_board_id: str) -> Optional[Dict[str, Any]]:
        """
        Get specific mood board by ID.
        
        Args:
            mood_board_id: Mood board ID to search for
            
        Returns:
            Mood board log entry if found, None otherwise
        """
        
        try:
            with open(self.mood_board_log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
            
            # Find mood board by ID
            for log_entry in reversed(logs):
                if log_entry.get("mood_board_id") == mood_board_id:
                    logger.info(f"Found mood board: {mood_board_id}")
                    return log_entry
            
            logger.warning(f"Mood board not found: {mood_board_id}")
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving mood board by ID: {str(e)}")
            return None
    
    def get_mood_board_stats(self) -> Dict[str, Any]:
        """
        Get mood board generation statistics.
        
        Returns:
            Dictionary containing statistics
        """
        
        try:
            with open(self.mood_board_log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
            
            if not logs:
                return {
                    "total_mood_boards": 0,
                    "successful_generations": 0,
                    "failed_generations": 0,
                    "success_rate": 0.0,
                    "most_popular_styles": [],
                    "most_popular_rooms": []
                }
            
            # Calculate statistics
            total = len(logs)
            successful = sum(1 for log in logs if log.get("success", False))
            failed = total - successful
            success_rate = (successful / total * 100) if total > 0 else 0
            
            # Count popular styles and rooms
            styles = {}
            rooms = {}
            
            for log in logs:
                user_input = log.get("user_input", {})
                style = user_input.get("design_style", "Unknown")
                room = user_input.get("room_type", "Unknown")
                
                styles[style] = styles.get(style, 0) + 1
                rooms[room] = rooms.get(room, 0) + 1
            
            # Sort by popularity
            popular_styles = sorted(styles.items(), key=lambda x: x[1], reverse=True)[:5]
            popular_rooms = sorted(rooms.items(), key=lambda x: x[1], reverse=True)[:5]
            
            stats = {
                "total_mood_boards": total,
                "successful_generations": successful,
                "failed_generations": failed,
                "success_rate": round(success_rate, 2),
                "most_popular_styles": [{"style": style, "count": count} for style, count in popular_styles],
                "most_popular_rooms": [{"room": room, "count": count} for room, count in popular_rooms],
                "last_generation": logs[-1].get("timestamp") if logs else None
            }
            
            logger.info(f"Mood board statistics calculated: {total} total, {success_rate:.1f}% success rate")
            return stats
            
        except Exception as e:
            logger.error(f"Error calculating mood board statistics: {str(e)}")
            return {
                "total_mood_boards": 0,
                "successful_generations": 0,
                "failed_generations": 0,
                "success_rate": 0.0,
                "error": str(e)
            }


# Global mood board log service instance
mood_board_log_service = MoodBoardLogService()
