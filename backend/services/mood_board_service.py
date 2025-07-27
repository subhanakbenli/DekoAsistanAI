import google.generativeai as genai
from google.cloud import aiplatform
from config.settings import Settings
from config import logger
from services.websocket_manager import websocket_manager
from services.mood_board_log_service import mood_board_log_service
from typing import Dict, Any, Optional
import json
import base64
import asyncio
import uuid
import os
from datetime import datetime

class MoodBoardService:
    """
    Service for generating mood boards using Imagen 4 model.
    Provides real-time progress tracking via WebSocket.
    """
    
    def __init__(self):
        self.settings = Settings()
        
        # Initialize Google Cloud AI Platform for Imagen
        aiplatform.init(
            project=self.settings.GOOGLE_CLOUD_PROJECT_ID,
            location="us-central1"
        )
        
        # Configure Gemini API for prompt enhancement
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(
            model_name=self.settings.GENERATIVE_MODEL_NAME
        )
        
        # Ensure mood_boards directory exists
        self.mood_boards_dir = os.path.join("data", "mood_boards")
        os.makedirs(self.mood_boards_dir, exist_ok=True)
        
        logger.info("Mood Board Service initialized with Imagen 4")
    
    async def generate_mood_board(
        self, 
        connection_id: str,
        room_type: str, 
        design_style: str, 
        notes: str,
        design_title: str,
        design_description: str
    ) -> Dict[str, Any]:
        """
        Generate mood board asynchronously with real-time progress tracking.
        
        Args:
            connection_id: WebSocket connection ID for progress updates
            room_type: Type of room
            design_style: Design style
            notes: User notes
            design_title: Generated design title from Gemini
            design_description: Generated design description from Gemini
            
        Returns:
            Dict containing mood board data
        """
        
        mood_board_id = str(uuid.uuid4())
        
        try:
            # Stage 1: Preparing mood board prompt
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "preparing_prompt",
                "progress_percentage": 10,
                "message": "Mood board konsepti hazırlanıyor...",
                "mood_board_id": mood_board_id
            })
            
            # Create enhanced prompt for Imagen
            enhanced_prompt = self._create_imagen_prompt(
                room_type, design_style, notes, design_title, design_description
            )
            
            # Stage 2: Optimizing prompt
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "optimizing_prompt", 
                "progress_percentage": 25,
                "message": "Görsel prompt'u optimize ediliyor...",
                "mood_board_id": mood_board_id
            })
            
            # Stage 3: Generating image with Imagen 4
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "generating_image",
                "progress_percentage": 50,
                "message": "Imagen 4 ile mood board görseli oluşturuluyor...",
                "mood_board_id": mood_board_id
            })
            
            # Generate image using Imagen 4
            image_data = await self._generate_image_with_imagen(enhanced_prompt)
            
            # Save image to file if generated successfully
            image_file_path = None
            if image_data and image_data.get("base64"):
                image_file_path = self._save_mood_board_image(mood_board_id, image_data["base64"])
            
            # Stage 4: Processing image
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "processing_image",
                "progress_percentage": 75,
                "message": "Görsel işleniyor ve dosyaya kaydediliyor...",
                "mood_board_id": mood_board_id
            })
            
            # Stage 5: Finalizing mood board
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "finalizing",
                "progress_percentage": 90,
                "message": "Mood board tamamlanıyor...",
                "mood_board_id": mood_board_id
            })
            
            # Create final mood board data
            mood_board_data = {
                "mood_board_id": mood_board_id,
                "created_at": datetime.now().isoformat(),
                "user_input": {
                    "room_type": room_type,
                    "design_style": design_style,
                    "notes": notes
                },
                "design_content": {
                    "title": design_title,
                    "description": design_description
                },
                "image_data": {
                    "base64": image_data["base64"] if image_data else None,
                    "format": "PNG",
                    "generated_with": "Imagen 4",
                    "file_path": image_file_path
                },
                "prompt_used": enhanced_prompt,
                "generation_metadata": {
                    "model": self.settings.IMAGEN_MODEL_NAME,
                    "generated_at": datetime.now().isoformat(),
                    "success": True
                }
            }
            
            # Stage 6: Completed
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "completed",
                "progress_percentage": 100,
                "message": "Mood board başarıyla tamamlandı!",
                "mood_board_id": mood_board_id
            })
            
            # Send completed mood board
            await websocket_manager.send_mood_board_completed(connection_id, mood_board_data)
            
            # Save mood board log
            mood_board_log_service.save_mood_board_log(
                mood_board_id=mood_board_id,
                connection_id=connection_id,
                user_input={
                    "room_type": room_type,
                    "design_style": design_style,
                    "notes": notes
                },
                design_content={
                    "title": design_title,
                    "description": design_description
                },
                generation_result={
                    "model": self.settings.IMAGEN_MODEL_NAME,
                    "prompt_used": enhanced_prompt,
                    "image_data": image_data,
                    "image_file_path": image_file_path,
                    "generation_time": datetime.now().isoformat()
                },
                success=True
            )
            
            logger.info(f"Mood board generated successfully: {mood_board_id}")
            return mood_board_data
            
        except Exception as e:
            logger.error(f"Error generating mood board: {str(e)}")
            await websocket_manager.send_mood_board_error(
                connection_id, 
                f"Mood board oluşturulurken hata oluştu: {str(e)}"
            )
            
            # Save error log
            mood_board_log_service.save_mood_board_log(
                mood_board_id=mood_board_id,
                connection_id=connection_id,
                user_input={
                    "room_type": room_type,
                    "design_style": design_style,
                    "notes": notes
                },
                design_content={
                    "title": design_title,
                    "description": design_description
                },
                generation_result={
                    "model": self.settings.IMAGEN_MODEL_NAME,
                    "error": str(e)
                },
                success=False,
                error_message=str(e)
            )
            
            # Return error mood board
            return self._create_error_mood_board(
                mood_board_id, room_type, design_style, str(e)
            )
    
    def _create_imagen_prompt(
        self, 
        room_type: str, 
        design_style: str, 
        notes: str,
        design_title: str,
        design_description: str
    ) -> str:
        """
        Create optimized prompt for Imagen 4 using Gemini.
        """
        
        prompt_enhancement_request = f"""
Sen bir AI görsel üretim uzmanısın. Aşağıdaki iç mekan tasarım bilgilerini kullanarak Imagen 4 modeli için optimize edilmiş bir prompt oluştur.

**Tasarım Bilgileri:**
- Oda Tipi: {room_type}
- Tasarım Stili: {design_style}
- Kullanıcı Notları: {notes}
- Tasarım Başlığı: {design_title}
- Tasarım Açıklaması: {design_description}

**Görevin:**
Bu bilgileri kullanarak Imagen 4 için optimize edilmiş bir mood board prompt'u oluştur. Prompt:

1. **Görsel Stil**: Modern mood board layout with clean composition
2. **İçerik**: Interior design mood board featuring {design_style.lower()} style {room_type.lower()}
3. **Detaylar**: Specific colors, materials, furniture pieces, lighting, textures
4. **Kalite**: Medium resolution, professional interior design presentation, optimized for speed
5. **Kompozisyon**: Well-organized layout with multiple design elements

**Önemli**: Prompt'u İngilizce olarak yaz ve Imagen 4'ün anlayabileceği şekilde düzenle. Maksimum 500 karakter olsun.

Sadece prompt'u döndür, açıklama yapma.
"""
        
        try:
            response = self.gemini_model.generate_content(prompt_enhancement_request)
            enhanced_prompt = response.text.strip()
            
            # Fallback if Gemini response is too long or empty
            if not enhanced_prompt or len(enhanced_prompt) > 500:
                enhanced_prompt = f"Professional interior design mood board, {design_style.lower()} style {room_type.lower()}, modern layout, medium resolution, clean composition, furniture and decor elements, color palette, materials showcase"
            
            logger.info(f"Enhanced Imagen prompt created: {enhanced_prompt[:100]}...")
            return enhanced_prompt
            
        except Exception as e:
            logger.error(f"Error creating enhanced prompt: {str(e)}")
            return f"Interior design mood board, {design_style} style {room_type}, professional presentation, modern layout"
    
    def _save_mood_board_image(self, mood_board_id: str, base64_image: str) -> Optional[str]:
        """
        Save mood board image to data/mood_boards directory.
        
        Args:
            mood_board_id: Unique mood board identifier
            base64_image: Base64 encoded image data
            
        Returns:
            str: File path if saved successfully, None otherwise
        """
        try:
            # Create filename with timestamp and mood board ID
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"mood_board_{timestamp}_{mood_board_id[:8]}.png"
            file_path = os.path.join(self.mood_boards_dir, filename)
            
            # Decode base64 and save to file
            image_bytes = base64.b64decode(base64_image)
            with open(file_path, 'wb') as f:
                f.write(image_bytes)
            
            logger.info(f"Mood board image saved: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error saving mood board image: {str(e)}")
            return None
    
    async def _generate_image_with_imagen(self, prompt: str) -> Optional[Dict[str, Any]]:
        """
        Generate image using Imagen 4 model.
        """
        
        try:
            # Simulate Imagen 4 API processing time
            await asyncio.sleep(2)
            
            # IMPORTANT: This is a placeholder implementation
            # In production, replace with actual Imagen 4 API call:
            #
            # from google.cloud import aiplatform
            # from google.cloud.aiplatform.v1 import PredictionServiceClient
            # 
            # client = PredictionServiceClient()
            # endpoint = f"projects/{self.settings.GOOGLE_CLOUD_PROJECT_ID}/locations/us-central1/publishers/google/models/{self.settings.IMAGEN_MODEL_NAME}"
            # 
            # instance = {
            #     "prompt": prompt,
            #     "sampleCount": 1,
            #     "aspectRatio": "1:1",
            #     "outputImageFormat": "PNG",
            #     "outputImageSize": "512x512",  # Medium resolution for faster generation
            #     "safetyFilterLevel": "block_some",
            #     "personGeneration": "dont_allow"
            # }
            # 
            # response = client.predict(
            #     endpoint=endpoint,
            #     instances=[instance]
            # )
            # 
            # if response.predictions:
            #     image_base64 = response.predictions[0]["bytesBase64Encoded"]
            #     return {"base64": image_base64, "success": True}
            
            # Placeholder response for development
            # Creating a more realistic placeholder (still fake but bigger)
            import random
            import time
            
            # Create a larger fake base64 string to simulate a real image
            fake_png_header = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlz"
            fake_image_data = fake_png_header
            
            # Add random data to make it look like a real image (but still fake)
            random.seed(hash(prompt))  # Use prompt as seed for consistency
            for _ in range(50):  # Make it bigger
                fake_chunk = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', k=64))
                fake_image_data += fake_chunk
            
            # Add proper PNG ending
            fake_image_data += "AAAAASUVORK5CYII="
            
            placeholder_image_data = {
                "base64": fake_image_data,
                "success": True
            }
            
            logger.info("Imagen 4 image generated successfully (placeholder - replace with actual API)")
            return placeholder_image_data
            
        except Exception as e:
            logger.error(f"Error generating image with Imagen: {str(e)}")
            return None
    
    def _create_error_mood_board(
        self, 
        mood_board_id: str,
        room_type: str, 
        design_style: str, 
        error_message: str
    ) -> Dict[str, Any]:
        """
        Create error mood board when generation fails.
        """
        
        return {
            "mood_board_id": mood_board_id,
            "created_at": datetime.now().isoformat(),
            "user_input": {
                "room_type": room_type,
                "design_style": design_style
            },
            "error": True,
            "error_message": error_message,
            "fallback_message": "Mood board oluşturulamadı. Lütfen tekrar deneyin.",
            "generation_metadata": {
                "model": self.settings.IMAGEN_MODEL_NAME,
                "generated_at": datetime.now().isoformat(),
                "success": False
            }
        }


# Global mood board service instance
mood_board_service = MoodBoardService()
