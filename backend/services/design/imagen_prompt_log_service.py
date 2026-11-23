import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
from config import logger

class ImagenPromptLogService:
    """
    Service for logging Imagen prompts and related data.
    Simply logs all Imagen prompt operations.
    """
    
    def __init__(self):
        self.logs_dir = "logs"
        self._ensure_logs_dir_exists()
        logger.debug("Imagen Prompt Log Service initialized")
    
    def _ensure_logs_dir_exists(self):
        """Make sure the logs folder exists."""
        os.makedirs(self.logs_dir, exist_ok=True)
    
    def _get_log_filename(self, log_type: str) -> str:
        """Build the daily log file name."""
        today = datetime.now().strftime("%Y-%m-%d")
        return os.path.join(self.logs_dir, f"{log_type}_{today}.json")
    
    def log_imagen_enhancement_request(
        self,
        room_type: str,
        design_style: str,
        notes: str,
        design_title: str,
        design_description: str,
        products_text: str = "",
        dimensions_info: str = "",
        color_info: str = "",
        additional_data: Dict[str, Any] = None
    ) -> None:
        """
        Log the prompt sent to Gemini for an Imagen prompt enhancement request.
        
        Args:
            room_type: Room type
            design_style: Design style
            notes: User notes
            design_title: Design title
            design_description: Design description
            products_text: Product text
            dimensions_info: Dimension info
            color_info: Color info
            additional_data: Additional data
        """
        try:
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "prompt_type": "imagen_enhancement_request",
                "request_data": {
                    "room_type": room_type,
                    "design_style": design_style,
                    "notes": notes,
                    "design_title": design_title,
                    "design_description": design_description,
                    "products_text": products_text,
                    "dimensions_info": dimensions_info,
                    "color_info": color_info
                },
                "additional_data": additional_data or {}
            }
            
            self._append_to_log_file("imagen_enhancement_prompts", log_entry)
            logger.info("Imagen enhancement request logged successfully")
            
        except Exception as e:
            logger.error(f"Error logging Imagen enhancement request: {str(e)}")
    
    def log_final_imagen_prompt(
        self,
        enhanced_prompt: str,
        original_request_data: Dict[str, Any] = None,
        prompt_source: str = "gemini_enhanced",
        additional_data: Dict[str, Any] = None
    ) -> None:
        """
        Log the final prompt sent to Imagen.
        
        Args:
            enhanced_prompt: Final prompt sent to Imagen
            original_request_data: Original request data
            prompt_source: Prompt source (gemini_enhanced, fallback, etc.)
            additional_data: Additional data
        """
        try:
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "prompt_type": "final_imagen_prompt",
                "enhanced_prompt": enhanced_prompt,
                "prompt_source": prompt_source,
                "prompt_length": len(enhanced_prompt),
                "original_request_data": original_request_data or {},
                "additional_data": additional_data or {}
            }
            
            self._append_to_log_file("imagen_final_prompts", log_entry)
            logger.info(f"Final Imagen prompt logged (source: {prompt_source}, length: {len(enhanced_prompt)})")
            
        except Exception as e:
            logger.error(f"Error logging final Imagen prompt: {str(e)}")
    
    def log_imagen_generation_result(
        self,
        enhanced_prompt: str,
        generation_success: bool,
        image_data: Dict[str, Any] = None,
        error_message: str = None,
        generation_time_ms: int = None,
        additional_data: Dict[str, Any] = None
    ) -> None:
        """
        Log the Imagen image generation result.
        
        Args:
            enhanced_prompt: Prompt used
            generation_success: Whether generation succeeded
            image_data: Image data (excluding base64)
            error_message: Error message
            generation_time_ms: Generation time (ms)
            additional_data: Additional data
        """
        try:
            # Strip base64 from image data (to keep the log small)
            safe_image_data = {}
            if image_data:
                safe_image_data = {k: v for k, v in image_data.items() if k != "base64"}
                if "base64" in image_data:
                    safe_image_data["has_base64"] = True
                    safe_image_data["base64_length"] = len(image_data.get("base64", ""))
            
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "prompt_type": "imagen_generation_result",
                "enhanced_prompt": enhanced_prompt,
                "generation_success": generation_success,
                "image_data": safe_image_data,
                "error_message": error_message,
                "generation_time_ms": generation_time_ms,
                "additional_data": additional_data or {}
            }
            
            self._append_to_log_file("imagen_generation_results", log_entry)
            logger.info(f"Imagen generation result logged (success: {generation_success})")
            
        except Exception as e:
            logger.error(f"Error logging Imagen generation result: {str(e)}")
    
    def _append_to_log_file(self, log_type: str, log_entry: Dict[str, Any]) -> None:
        """Append the log entry to the file."""
        log_file = self._get_log_filename(log_type)
        
        # Read the file if it exists, otherwise start with an empty list
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    logs = json.load(f)
            except (json.JSONDecodeError, Exception):
                logs = []
        else:
            logs = []
        
        # Add the new entry
        logs.append(log_entry)
        
        # Write to file
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
    
    def get_daily_logs(self, log_type: str, date: str = None) -> list:
        """Get the logs for a given day."""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        log_file = self._get_log_filename(log_type)
        
        if not os.path.exists(log_file):
            return []
        
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error reading log file {log_file}: {str(e)}")
            return []
    
    def get_log_summary(self, date: str = None) -> Dict[str, Any]:
        """Get the daily log summary."""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        summary = {
            "date": date,
            "imagen_enhancement_requests": len(self.get_daily_logs("imagen_enhancement_prompts", date)),
            "final_imagen_prompts": len(self.get_daily_logs("imagen_final_prompts", date)),
            "imagen_generation_results": len(self.get_daily_logs("imagen_generation_results", date))
        }
        
        return summary
