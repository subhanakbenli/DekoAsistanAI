import json
import os
from datetime import datetime
from typing import Dict, Any, List
from config import logger

class DesignHistoryService:
    """
    Service for saving and managing design history in JSON format.
    """
    
    def __init__(self, history_file: str = "data/design_history.json"):
        self.history_file = history_file
        self._ensure_data_directory()
    
    def _ensure_data_directory(self):
        """Create data directory if it doesn't exist."""
        os.makedirs(os.path.dirname(self.history_file), exist_ok=True)
    
    def save_design_request(self, 
                          room_type: str, 
                          design_style: str, 
                          notes: str, 
                          design_result: Dict[str, Any],
                          success: bool = True,
                          error_message: str = None) -> str:
        """
        Save design request and result to JSON file.
        
        Args:
            room_type: Type of room
            design_style: Design style
            notes: User notes
            design_result: Result from Gemini
            success: Whether request was successful
            error_message: Error message if failed
            
        Returns:
            str: Request ID for tracking
        """
        try:
            # Generate unique request ID
            request_id = self._generate_request_id()
            
            # Create design record
            design_record = {
                "request_id": request_id,
                "timestamp": datetime.now().isoformat(),
                "input": {
                    "room_type": room_type,
                    "design_style": design_style,
                    "notes": notes
                },
                "output": {
                    "success": success,
                    "design_title": design_result.get("title", ""),
                    "design_description": design_result.get("description", ""),
                    "product_suggestion": design_result.get("product_suggestion", ""),
                    "raw_response": design_result.get("raw_response", "")
                },
                "error_message": error_message
            }
            
            # Load existing history
            history = self._load_history()
            
            # Add new record
            history.append(design_record)
            
            # Save updated history
            self._save_history(history)
            
            logger.info(f"Design request saved with ID: {request_id}")
            return request_id
            
        except Exception as e:
            logger.error(f"Error saving design request: {str(e)}")
            # Return a fallback request ID even on error
            return f"error_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    def get_design_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get recent design history.
        
        Args:
            limit: Maximum number of records to return
            
        Returns:
            List of design records
        """
        try:
            history = self._load_history()
            # Return most recent records first
            return sorted(history, key=lambda x: x["timestamp"], reverse=True)[:limit]
        except Exception as e:
            logger.error(f"Error loading design history: {str(e)}")
            return []
    
    def get_design_by_id(self, request_id: str) -> Dict[str, Any]:
        """
        Get specific design by request ID.
        
        Args:
            request_id: Request ID to search for
            
        Returns:
            Design record or None if not found
        """
        try:
            history = self._load_history()
            for record in history:
                if record["request_id"] == request_id:
                    return record
            return None
        except Exception as e:
            logger.error(f"Error searching design by ID: {str(e)}")
            return None
    
    def get_design_stats(self) -> Dict[str, Any]:
        """
        Get basic statistics about design requests.
        
        Returns:
            Statistics dictionary
        """
        try:
            history = self._load_history()
            
            if not history:
                return {
                    "total_requests": 0,
                    "successful_requests": 0,
                    "failed_requests": 0,
                    "most_popular_room_type": None,
                    "most_popular_design_style": None
                }
            
            successful = [r for r in history if r["output"]["success"]]
            room_types = [r["input"]["room_type"] for r in history]
            design_styles = [r["input"]["design_style"] for r in history]
            
            return {
                "total_requests": len(history),
                "successful_requests": len(successful),
                "failed_requests": len(history) - len(successful),
                "most_popular_room_type": max(set(room_types), key=room_types.count) if room_types else None,
                "most_popular_design_style": max(set(design_styles), key=design_styles.count) if design_styles else None
            }
            
        except Exception as e:
            logger.error(f"Error calculating design stats: {str(e)}")
            return {}
    
    def _load_history(self) -> List[Dict[str, Any]]:
        """Load history from JSON file."""
        try:
            if os.path.exists(self.history_file):
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            logger.error(f"Error loading history file: {str(e)}")
            return []
    
    def _save_history(self, history: List[Dict[str, Any]]):
        """Save history to JSON file."""
        try:
            with open(self.history_file, 'w', encoding='utf-8') as f:
                json.dump(history, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error saving history file: {str(e)}")
    
    def _generate_request_id(self) -> str:
        """Generate unique request ID."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]  # Include milliseconds
        return f"design_{timestamp}"
