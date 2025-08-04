import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
from config import logger

class ImagenPromptLogService:
    """
    Service for logging Imagen prompts and related data.
    Basit bir şekilde tüm Imagen prompt işlemlerini loglar.
    """
    
    def __init__(self):
        self.logs_dir = "logs"
        self._ensure_logs_dir_exists()
        logger.debug("Imagen Prompt Log Service initialized")
    
    def _ensure_logs_dir_exists(self):
        """Logs klasörünün var olduğundan emin ol."""
        os.makedirs(self.logs_dir, exist_ok=True)
    
    def _get_log_filename(self, log_type: str) -> str:
        """Günlük log dosya adını oluştur."""
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
        Imagen prompt geliştirme talebi için Gemini'ye gönderilen prompt'u logla.
        
        Args:
            room_type: Oda tipi
            design_style: Tasarım stili
            notes: Kullanıcı notları
            design_title: Tasarım başlığı
            design_description: Tasarım açıklaması
            products_text: Ürün metni
            dimensions_info: Boyut bilgisi
            color_info: Renk bilgisi
            additional_data: Ek veriler
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
        Imagen'e gönderilen final prompt'u logla.
        
        Args:
            enhanced_prompt: Imagen'e gönderilen final prompt
            original_request_data: Orijinal istek verileri
            prompt_source: Prompt kaynağı (gemini_enhanced, fallback vs.)
            additional_data: Ek veriler
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
        Imagen görsel üretim sonucunu logla.
        
        Args:
            enhanced_prompt: Kullanılan prompt
            generation_success: Üretim başarısı
            image_data: Görsel verileri (base64 hariç)
            error_message: Hata mesajı
            generation_time_ms: Üretim süresi (ms)
            additional_data: Ek veriler
        """
        try:
            # Image data'dan base64'ü çıkar (log boyutunu küçültmek için)
            safe_image_data = {}
            if image_data:
                safe_image_data = {k: v for k, v in image_data.items() if k != "base64"}
                if "base64" in image_data:
                    safe_image_data["has_base64"] = True
                    safe_image_data["base64_length"] = len(image_data.get("base64", ""))
            
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "prompt_type": "imagen_generation_result",
                "enhanced_prompt": enhanced_prompt[:200] + "..." if len(enhanced_prompt) > 200 else enhanced_prompt,
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
        """Log entry'yi dosyaya ekle."""
        log_file = self._get_log_filename(log_type)
        
        # Dosya varsa oku, yoksa boş liste oluştur
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    logs = json.load(f)
            except (json.JSONDecodeError, Exception):
                logs = []
        else:
            logs = []
        
        # Yeni entry'yi ekle
        logs.append(log_entry)
        
        # Dosyaya yaz
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
    
    def get_daily_logs(self, log_type: str, date: str = None) -> list:
        """Belirli bir günün loglarını getir."""
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
        """Günlük log özetini getir."""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        summary = {
            "date": date,
            "imagen_enhancement_requests": len(self.get_daily_logs("imagen_enhancement_prompts", date)),
            "final_imagen_prompts": len(self.get_daily_logs("imagen_final_prompts", date)),
            "imagen_generation_results": len(self.get_daily_logs("imagen_generation_results", date))
        }
        
        return summary
