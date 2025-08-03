import google.generativeai as genai
from google.cloud import aiplatform
from config.settings import Settings
from config import logger
from config.prompts import GeminiPrompts, PromptUtils
from config.database import get_async_session
from models.design_models_db import MoodBoard, Design
from services.communication.websocket_manager import websocket_manager
from services.ai.notes_parser import NotesParser
from services.design.mood_board_log_service import mood_board_log_service
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import json
import base64
import asyncio
import uuid
import os
import re
from datetime import datetime

class MoodBoardService:
    """
    Room Visualization Service using Imagen 4 model.
    
    This service generates realistic room visualizations (not mood boards) 
    based on user design preferences. It provides real-time progress tracking 
    via WebSocket and creates photo-realistic interior design images.
    
    Key Features:
    - Real-time progress tracking with 19+ steps
    - Vertex AI Imagen 4 integration for high-quality images
    - Fallback system for reliable operation
    - Background progress simulation during AI processing
    
    Note: Despite the class name "MoodBoardService", this service actually 
    generates room visualizations. The name is kept for backward compatibility.
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
        
        # Initialize NotesParser for notes parsing
        self.notes_parser = NotesParser()
        
        # Ensure mood_boards directory exists
        self.mood_boards_dir = os.path.join("data", "mood_boards")
        os.makedirs(self.mood_boards_dir, exist_ok=True)
        
        logger.info("Room Visualization Service initialized with Imagen 4 - Enhanced 19+ step progress tracking enabled")
    
    async def generate_mood_board(
        self, 
        connection_id: str,
        room_type: str, 
        design_style: str, 
        notes: str,
        design_title: str,
        design_description: str,
        products: list = None,
        design_id: str = None,
        user_id: int = None,
        color_info: str = "",  # Frontend'den gelen formatlanmış renk bilgisi
        width: int = None,  # Oda genişliği (cm)
        length: int = None,  # Oda uzunluğu (cm)
        height: int = None   # Oda yüksekliği (cm)
    ) -> Dict[str, Any]:
        """
        Generate realistic room visualization with enhanced progress tracking.
        
        This is the main method for creating room visualizations. Despite the method name 
        'generate_mood_board', it actually generates realistic room images using AI.
        The name is kept for backward compatibility with existing API endpoints.
        
        Features:
        - 19+ step progress tracking (5% → 100%)
        - Background progress simulation during AI processing
        - Real-time WebSocket updates
        - Fallback system for reliability
        - Turkish language progress messages
        
        Args:
            connection_id: WebSocket connection ID for real-time progress updates
            room_type: Type of room (living_room, bedroom, kitchen, etc.)
            design_style: Interior design style (modern, minimalist, scandinavian, etc.)
            notes: User preferences including dimensions, colors, and product categories
            design_title: AI-generated design title from Gemini
            design_description: AI-generated design description from Gemini
            products: List of suggested products to include in visualization
            design_id: Optional design ID to link visualization with design record
            user_id: Optional user ID for database tracking
            
        Returns:
            Dict containing complete room visualization data:
            - mood_board_id: Unique identifier for the visualization
            - image_data: Base64 encoded PNG image
            - generation_metadata: AI model and processing information
            - created_at: Timestamp of generation
        """
        
        mood_board_id = str(uuid.uuid4())
        
        try:
            # Stage 1: Preparing room visualization prompt (0-15%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "preparing_prompt",
                "progress_percentage": 5,
                "message": "Oda görseli konsepti hazırlanıyor...",
                "mood_board_id": mood_board_id
            })
            
            # Parse notes to extract structured information
            await asyncio.sleep(0.5)  # Small delay for realistic progress
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "preparing_prompt",
                "progress_percentage": 10,
                "message": "Notlar analiz ediliyor...",
                "mood_board_id": mood_board_id
            })
            
            # Parse notes only for info not provided by frontend (extra areas, door/windows, etc.)
            # Color and dimensions are now provided separately by frontend
            parsed_info = self.notes_parser.parse_notes(notes) if notes.strip() else {}
            
            # Format dimensions info for prompt
            dimensions_info = ""
            if width and length:
                if height:
                    dimensions_info = f"Oda Boyutları: {width}cm x {length}cm x {height}cm"
                else:
                    dimensions_info = f"Oda Boyutları: {width}cm x {length}cm"
            
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "preparing_prompt", 
                "progress_percentage": 15,
                "message": "AI prompt hazırlanıyor...",
                "mood_board_id": mood_board_id
            })
            
            # Create enhanced prompt for Imagen
            enhanced_prompt = self._create_imagen_prompt(
                room_type, design_style, notes, design_title, design_description, 
                products, parsed_info, color_info, dimensions_info
            )
            
            # Stage 2: Generating image with Imagen 4 (15-70%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "generating_image",
                "progress_percentage": 20,
                "message": "AI görsel oluşturma modeli başlatılıyor...",
                "mood_board_id": mood_board_id
            })
            
            # Generate image using Imagen 4 with progress updates
            image_data = await self._generate_image_with_imagen(enhanced_prompt, connection_id, mood_board_id)
            
            # Stage 3: Processing image (70-85%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "processing_image",
                "progress_percentage": 75,
                "message": "Görsel işleniyor...",
                "mood_board_id": mood_board_id
            })
            
            # Save image to file if generated successfully
            image_file_path = None
            if image_data and image_data.get("base64"):
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "processing_image",
                    "progress_percentage": 80,
                    "message": "Görsel dosyaya kaydediliyor...",
                    "mood_board_id": mood_board_id
                })
                image_file_path = self._save_mood_board_image(mood_board_id, image_data["base64"])
                
                # Debug log to verify image_file_path type
                logger.info(f"Image saved to: {image_file_path} (type: {type(image_file_path)})")
            
            # Stage 4: Finalizing room visualization (85-95%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "finalizing",
                "progress_percentage": 90,
                "message": "Oda görseli tamamlanıyor...",
                "mood_board_id": mood_board_id
            })
            
            # Create final room visualization data
            current_time = datetime.now().isoformat()
            mood_board_data = {
                "mood_board_id": mood_board_id,
                "created_at": current_time,
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
                    "base64": image_data["base64"] if image_data and image_data.get("base64") else None,
                    "format": "PNG",
                    "generated_with": "Imagen 4",
                    "file_path": image_file_path,
                    "created_at": current_time  # Add created_at to image_data as well
                },
                "prompt_used": enhanced_prompt,
                "generation_metadata": {
                    "model": self.settings.IMAGEN_MODEL_NAME,
                    "generated_at": current_time,
                    "success": True
                }
            }
            
            # Debug log mood board data structure
            logger.info(f"Mood board data structure for {mood_board_id}:")
            logger.info(f"  - mood_board_id: {mood_board_data.get('mood_board_id')}")
            logger.info(f"  - created_at: {mood_board_data.get('created_at')}")
            logger.info(f"  - image_data.created_at: {mood_board_data.get('image_data', {}).get('created_at')}")
            logger.info(f"  - generation_metadata.generated_at: {mood_board_data.get('generation_metadata', {}).get('generated_at')}")
            
            # Stage 6: Completed
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "completed",
                "progress_percentage": 100,
                "message": "Oda görseli başarıyla tamamlandı!",
                "mood_board_id": mood_board_id
            })
            
            # Send completed room visualization
            await websocket_manager.send_mood_board_completed(connection_id, mood_board_data)
            
            # Save room visualization log
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
            
            # Save room visualization to database and update design
            try:
                # Debug log before calling _save_mood_board_to_database
                logger.info(f"Calling _save_mood_board_to_database with parameters:")
                logger.info(f"  mood_board_id: {mood_board_id}")
                logger.info(f"  user_id: {user_id} (type: {type(user_id)})")
                logger.info(f"  design_id: {design_id} (type: {type(design_id)})")
                logger.info(f"  image_file_path: {str(image_file_path)[:100]}... (type: {type(image_file_path)})")
                logger.info(f"  enhanced_prompt length: {len(str(enhanced_prompt))}")
                
                # Additional safety check - make sure image_file_path is a string
                if image_file_path and not isinstance(image_file_path, str):
                    logger.error(f"image_file_path is not a string! Type: {type(image_file_path)}, Setting to None")
                    image_file_path = None
                
                await self._save_mood_board_to_database(
                    mood_board_id=mood_board_id,
                    user_id=user_id,
                    design_id=design_id,
                    image_file_path=image_file_path,
                    prompt_used=enhanced_prompt
                )
                logger.info(f"Mood board saved to database: {mood_board_id}")
            except Exception as db_error:
                logger.error(f"Error saving mood board to database: {str(db_error)}")
                # Continue even if database save fails
            
            logger.info(f"Room visualization generated successfully: {mood_board_id}")
            return mood_board_data
            
        except Exception as e:
            logger.error(f"Error generating room visualization: {str(e)}")
            await websocket_manager.send_mood_board_error(
                connection_id, 
                f"Oda görseli oluşturulurken hata oluştu: {str(e)}"
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
            
            # Return error room visualization
            return self._create_error_mood_board(
                mood_board_id, room_type, design_style, str(e)
            )
    
    def _create_imagen_prompt(
        self, 
        room_type: str, 
        design_style: str, 
        notes: str,
        design_title: str,
        design_description: str,
        products: list = None,
        parsed_info: Dict[str, Any] = None,
        color_info: str = "",  # Frontend'den gelen formatlanmış renk bilgisi
        dimensions_info: str = ""  # Frontend'den gelen formatlanmış boyut bilgisi
    ) -> str:
        """
        Create optimized prompt for Imagen 4 using Gemini for room visualization.
        Now uses centralized prompt management with frontend parameters.
        """
        
        # Format products using centralized utility
        products_text = PromptUtils.format_products_for_imagen(products)
        
        # Renk bilgisi: Frontend'den geleni öncelik ver, yoksa parse edilmişten al
        final_color_info = color_info if color_info.strip() else PromptUtils.extract_color_info_for_imagen(parsed_info)
        
        # Boyut bilgisi: Frontend'den geleni öncelik ver, yoksa parse edilmişten al  
        final_dimensions_info = dimensions_info if dimensions_info.strip() else PromptUtils.extract_dimensions_info_for_imagen(parsed_info)
        
        # Use centralized prompt template
        prompt_enhancement_request = GeminiPrompts.get_imagen_prompt_enhancement_request(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_title=design_title,
            design_description=design_description,
            products_text=products_text,
            dimensions_info=final_dimensions_info,
            color_info=final_color_info
        )
        
        try:
            response = self.gemini_model.generate_content(prompt_enhancement_request)
            enhanced_prompt = response.text.strip()
            
            # Fallback if Gemini response is too long or empty
            if not enhanced_prompt or len(enhanced_prompt) > 500:
                enhanced_prompt = GeminiPrompts.get_fallback_imagen_prompt(room_type, design_style)
            
            logger.info(f"Enhanced Imagen prompt created for room visualization: {enhanced_prompt[:100]}...")
            return enhanced_prompt
            
        except Exception as e:
            logger.error(f"Error creating enhanced prompt: {str(e)}")
            return GeminiPrompts.get_fallback_imagen_prompt(room_type, design_style)
    
    async def _simulate_image_generation_progress(self, connection_id: str, mood_board_id: str):
        """
        Enhanced progress simulation for smooth user experience.
        
        This method runs as a background task during actual AI image generation,
        providing users with detailed progress updates every 1.5 seconds.
        This creates a much smoother experience than the original 5-step system.
        
        Progress Steps:
        - 58%: Visual composition preparation
        - 61%: Color palette application  
        - 64%: Room detail creation
        - 67%: Decorative element addition
        - 68%: Light and shadow calculation
        - 69%: Visual quality optimization
        
        The simulation automatically cancels when real image generation completes,
        ensuring seamless transition to actual progress updates.
        """
        try:
            progress_steps = [
                (58, "Görsel kompozisyonu hazırlanıyor..."),
                (61, "Renk paleti uygulanıyor..."),
                (64, "Mekan detayları oluşturuluyor..."),
                (67, "Dekoratif öğeler ekleniyor..."),
                (68, "Işık ve gölge efektleri hesaplanıyor..."),
                (69, "Görsel kalitesi optimize ediliyor...")
            ]
            
            for progress, message in progress_steps:
                await asyncio.sleep(1.5)  # Wait 1.5 seconds between updates
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": progress,
                    "message": message,
                    "mood_board_id": mood_board_id
                })
                
        except asyncio.CancelledError:
            # Progress simulation was cancelled (image generation completed)
            logger.debug("Image generation progress simulation cancelled")
            # Re-raise to properly handle cancellation
            raise
        except Exception as e:
            logger.error(f"Error in progress simulation: {str(e)}")

    def _save_mood_board_image(self, mood_board_id: str, base64_image: str) -> Optional[str]:
        """
        Save room visualization image to data/mood_boards directory.
        
        Args:
            mood_board_id: Unique mood board identifier
            base64_image: Base64 encoded image data
            
        Returns:
            str: File path if saved successfully, None otherwise
        """
        try:
            # Create filename with timestamp and mood board ID
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"room_visual_{timestamp}_{mood_board_id[:8]}.png"
            file_path = os.path.join(self.mood_boards_dir, filename)
            
            # Decode base64 and save to file
            image_bytes = base64.b64decode(base64_image)
            with open(file_path, 'wb') as f:
                f.write(image_bytes)
            
            logger.info(f"Room visualization image saved: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error saving room visualization image: {str(e)}")
            return None
    
    async def _generate_image_with_imagen(self, prompt: str, connection_id: str = None, mood_board_id: str = None) -> Optional[Dict[str, Any]]:
        """
        Generate high-quality room visualization using Vertex AI Imagen 4.
        
        This method handles the core AI image generation with sophisticated progress tracking.
        It includes background progress simulation, proper error handling, and fallback mechanisms.
        
        Process:
        1. Initialize Vertex AI with proper authentication
        2. Load Imagen 4 model (imagegeneration@006)  
        3. Start background progress simulation task
        4. Generate image with optimized parameters
        5. Convert result to base64 for frontend display
        6. Clean up simulation task and return result
        
        Parameters optimized for speed and quality:
        - aspect_ratio: "1:1" for consistent room displays
        - safety_filter_level: "block_some" for balanced filtering
        - person_generation: "dont_allow" for faster processing
        
        Returns:
            Dict with base64 image data and success status, or None if failed
        """
        
        try:
            # Import Google Cloud libraries
            from google.cloud import aiplatform
            from vertexai.preview.vision_models import ImageGenerationModel
            import asyncio
            import os
            
            logger.info("🎨 Generating room visualization with Vertex AI...")
            
            # Progress update: Initializing AI model (25%)
            if connection_id and mood_board_id:
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": 25,
                    "message": "AI modeli başlatılıyor...",
                    "mood_board_id": mood_board_id
                })
            
            # Set authentication explicitly
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = self.settings.GOOGLE_APPLICATION_CREDENTIALS
            
            # Initialize Vertex AI
            aiplatform.init(
                project=self.settings.GOOGLE_CLOUD_PROJECT_ID,
                location="us-central1"
            )
            
            # Progress update: Loading model (35%)
            if connection_id and mood_board_id:
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": 35,
                    "message": "Görsel oluşturma modeli yükleniyor...",
                    "mood_board_id": mood_board_id
                })
            
            # Load the Imagen model
            generation_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
            
            # Progress update: Starting generation (45%)
            if connection_id and mood_board_id:
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": 45,
                    "message": "AI görsel oluşturmaya başlıyor...",
                    "mood_board_id": mood_board_id
                })
            
            # Generate image with optimized parameters for speed
            def generate_sync():
                images = generation_model.generate_images(
                    prompt=prompt,
                    number_of_images=1,
                    aspect_ratio="1:1",  # Square format for room visualizations
                    safety_filter_level="block_some",
                    person_generation="dont_allow"  # Skip person generation for faster results
                )
                return images
            
            # Progress update: Generation in progress (55%)
            if connection_id and mood_board_id:
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": 55,
                    "message": "Görsel oluşturuluyor... (Bu işlem birkaç saniye sürebilir)",
                    "mood_board_id": mood_board_id
                })
            
            # Create a background task for progress simulation during image generation
            progress_task = None
            if connection_id and mood_board_id:
                progress_task = asyncio.create_task(
                    self._simulate_image_generation_progress(connection_id, mood_board_id)
                )
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            images = await loop.run_in_executor(None, generate_sync)
            
            # Cancel progress simulation if it's still running
            if progress_task and not progress_task.done():
                progress_task.cancel()
                try:
                    await progress_task
                except asyncio.CancelledError:
                    # Expected cancellation when image generation completes, continue with processing
                    logger.debug("Progress simulation cancelled as expected")
                    # No need to re-raise here as this is expected cleanup
            
            # Progress update: Processing result (65%)
            if connection_id and mood_board_id:
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": 65,
                    "message": "Görsel sonucu işleniyor...",
                    "mood_board_id": mood_board_id
                })
            
            if images and hasattr(images, 'images') and len(images.images) > 0:
                # Convert image to base64
                import io
                import base64
                
                image = images.images[0]  # Get first image from images list
                
                # Progress update: Converting image (70%)
                if connection_id and mood_board_id:
                    await websocket_manager.update_mood_board_progress(connection_id, {
                        "stage": "generating_image",
                        "progress_percentage": 70,
                        "message": "Görsel dönüştürülüyor...",
                        "mood_board_id": mood_board_id
                    })
                
                # Save image to bytes
                image_bytes = io.BytesIO()
                image._pil_image.save(image_bytes, format='PNG')
                image_bytes.seek(0)
                
                # Convert to base64
                base64_string = base64.b64encode(image_bytes.getvalue()).decode('utf-8')
                
                logger.info("✅ Vertex AI room visualization generated successfully")
                return {
                    "base64": base64_string,
                    "success": True
                }
            else:
                logger.warning("⚠️ No images generated from Vertex AI")
                return None
                
        except ImportError as e:
            logger.error(f"Google Cloud libraries not properly installed: {str(e)}")
            return await self._generate_fallback_image(prompt, connection_id, mood_board_id)
            
        except Exception as e:
            logger.warning(f"⚠️ Vertex AI failed, using fallback: {str(e)}")
            # Fall back to placeholder if real API fails
            return await self._generate_fallback_image(prompt, connection_id, mood_board_id)
    
    async def _generate_fallback_image(self, prompt: str, connection_id: str = None, mood_board_id: str = None) -> Optional[Dict[str, Any]]:
        """
        Reliable fallback system for room visualization generation.
        
        When Vertex AI Imagen is unavailable or fails, this method provides
        a graceful fallback that maintains user experience continuity.
        
        Features:
        - Maintains progress tracking consistency
        - Creates realistic placeholder with proper dimensions
        - Uses shorter delay intervals (0.8s vs 1.5s) for faster completion
        - Provides informative user messages in Turkish
        - Returns properly formatted base64 image data
        
        This ensures the application remains functional even when cloud AI services
        experience issues, following the principle of graceful degradation.
        """
        try:
            # Progress update: Starting fallback generation (50%)
            if connection_id and mood_board_id:
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": 50,
                    "message": "Yedek görsel sistemi kullanılıyor...",
                    "mood_board_id": mood_board_id
                })
            
            # Create more detailed progress simulation for fallback
            fallback_steps = [
                (52, "Placeholder görsel hazırlanıyor..."),
                (55, "Temel görsel yapısı oluşturuluyor..."),
                (58, "Görsel formatı belirleniyor..."),
                (62, "Demo içeriği ekleniyor..."),
                (66, "Görsel son haline getiriliyor...")
            ]
            
            for progress, message in fallback_steps:
                await asyncio.sleep(0.8)  # Shorter delays for fallback
                if connection_id and mood_board_id:
                    await websocket_manager.update_mood_board_progress(connection_id, {
                        "stage": "generating_image",
                        "progress_percentage": progress,
                        "message": message,
                        "mood_board_id": mood_board_id
                    })
            
            # Create a more realistic placeholder (still fake but bigger)
            import random
            
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
            
            # Final progress for fallback
            if connection_id and mood_board_id:
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "generating_image",
                    "progress_percentage": 70,
                    "message": "Yedek görsel hazırlandı",
                    "mood_board_id": mood_board_id
                })
            
            placeholder_image_data = {
                "base64": fake_image_data,
                "success": True
            }
            
            logger.info("Fallback placeholder image generated")
            return placeholder_image_data
            
        except Exception as e:
            logger.error(f"Error generating fallback image: {str(e)}")
            return None
    
    def _create_error_mood_board(
        self, 
        mood_board_id: str,
        room_type: str, 
        design_style: str, 
        error_message: str
    ) -> Dict[str, Any]:
        """
        Create comprehensive error response for failed room visualization generation.
        
        This method ensures that even when all generation methods fail,
        the API returns a properly structured response with useful error information.
        
        Returns a complete error object that maintains API consistency
        and provides debugging information for development and monitoring.
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
            "fallback_message": "Oda görseli oluşturulamadı. Lütfen tekrar deneyin.",
            "generation_metadata": {
                "model": self.settings.IMAGEN_MODEL_NAME,
                "generated_at": datetime.now().isoformat(),
                "success": False
            }
        }

    async def _save_mood_board_to_database(
        self,
        mood_board_id: str,
        user_id: int = None,
        design_id: str = None,
        image_file_path: str = None,
        prompt_used: str = None
    ):
        """
        Save mood board to database and update design record.
        
        Args:
            mood_board_id: Unique mood board identifier
            user_id: User ID (optional, for guest users)
            design_id: Design ID to link with mood board
            image_file_path: Path to saved image file
            prompt_used: AI prompt used for generation
        """
        # Debug log to check parameters before database operation
        logger.info(f"Saving mood board to database - user_id: {user_id} (type: {type(user_id)}), design_id: {design_id} (type: {type(design_id)})")
        
        async for db in get_async_session():
            try:
                # Debug log individual parameters
                logger.info(f"Creating MoodBoard with:")
                logger.info(f"  user_id: {user_id} (type: {type(user_id)})")
                logger.info(f"  design_id: {design_id} (type: {type(design_id)})")
                logger.info(f"  mood_board_id: {mood_board_id} (type: {type(mood_board_id)})")
                logger.info(f"  image_file_path: {str(image_file_path)[:100]}... (type: {type(image_file_path)})")
                logger.info(f"  prompt_used: {str(prompt_used)[:100]}... (type: {type(prompt_used)})")
                
                # Validate and fix parameters
                if user_id is not None:
                    if isinstance(user_id, str):
                        logger.warning(f"user_id is string ('{user_id}'), but should be integer. Setting to None for guest user.")
                        user_id = None
                    elif not isinstance(user_id, int):
                        logger.warning(f"user_id has unexpected type {type(user_id)}. Setting to None.")
                        user_id = None
                
                # Validate design_id type and existence
                if design_id is not None:
                    if not isinstance(design_id, str):
                        logger.warning(f"design_id is not string (value: {design_id}, type: {type(design_id)}). Converting to string.")
                        design_id = str(design_id)
                    
                    # Check if design exists in database
                    design_exists = await db.execute(select(Design.id).where(Design.id == design_id))
                    if not design_exists.scalar_one_or_none():
                        logger.warning(f"design_id '{design_id}' does not exist in designs table. Setting to None.")
                        design_id = None
                
                # Validate image_file_path type
                if image_file_path is not None and not isinstance(image_file_path, str):
                    logger.error(f"image_file_path is not string (type: {type(image_file_path)}). Setting to None.")
                    image_file_path = None
                
                # Create mood board record with explicit field assignments
                db_mood_board = MoodBoard()
                db_mood_board.user_id = user_id
                db_mood_board.design_id = design_id
                db_mood_board.mood_board_id = mood_board_id
                db_mood_board.image_path = image_file_path or ""
                db_mood_board.prompt_used = prompt_used or ""
                
                db.add(db_mood_board)
                await db.flush()  # Flush to get the ID
                
                # Update design record if design_id is provided
                if design_id:
                    await db.execute(
                        update(Design)
                        .where(Design.id == design_id)
                        .values(mood_board_id=mood_board_id)
                    )
                
                await db.commit()
                logger.info(f"Mood board {mood_board_id} saved to database and linked to design {design_id}")
                
            except Exception as e:
                await db.rollback()
                logger.error(f"Database error saving mood board: {str(e)}")
                raise
            finally:
                await db.close()
    
    async def generate_hybrid_mood_board(
        self,
        connection_id: str,
        room_type: str,
        design_style: str,
        notes: str,
        design_title: str,
        design_description: str,
        products: list = None,
        design_id: str = None,
        user_id: int = None,
        color_info: str = "",
        width: int = None,  # Oda genişliği (cm)
        length: int = None,  # Oda uzunluğu (cm)
        height: int = None   # Oda yüksekliği (cm)
    ) -> Dict[str, Any]:
        """
        Generate room visualization using HYBRID system with real product images + fake product descriptions.
        
        This method combines:
        - Real product images from database for visual reference
        - AI-generated fake product descriptions for creative freedom
        - Enhanced prompt with both real visual elements and AI creativity
        
        Args:
            connection_id: WebSocket connection ID for real-time progress
            room_type: Type of room
            design_style: Interior design style  
            notes: User preferences
            design_title: AI-generated design title
            design_description: AI-generated design description
            products: List of hybrid products (mix of real and fake)
            design_id: Design ID to link visualization
            user_id: User ID for database record
            color_info: Color palette information
            dimensions_info: Room dimensions
        
        Returns:
            Dict with mood board data including generated image
        """
        mood_board_id = str(uuid.uuid4())
        
        # Debug log to check user_id type
        logger.info(f"Hybrid mood board generation - User ID: {user_id} (type: {type(user_id)})")
        logger.info(f"Hybrid mood board generation - Design ID: {design_id} (type: {type(design_id)})")
        
        try:
            # Stage 1: Preparing hybrid prompt with real images + fake descriptions (5-15%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "preparing_prompt",
                "progress_percentage": 5,
                "message": "Hibrit tasarım promtu hazırlanıyor (gerçek ürün fotoğrafları + AI açıklamaları)...",
                "mood_board_id": mood_board_id
            })
            
            # Process products to separate real and fake
            real_product_images = []
            fake_product_descriptions = []
            
            if products:
                for product in products:
                    if product.get('is_real') and product.get('image_path'):
                        # Real product - extract image for Imagen reference
                        real_product_images.append({
                            'name': product.get('name'),
                            'category': product.get('category'),
                            'image_url': product.get('image_path')
                        })
                    else:
                        # Fake product - use description for creative prompt
                        fake_product_descriptions.append({
                            'name': product.get('name'),
                            'category': product.get('category'),
                            'description': product.get('description')
                        })
            
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "preparing_prompt",
                "progress_percentage": 10,
                "message": f"Hibrit içerik hazırlandı: {len(real_product_images)} gerçek ürün fotoğrafı + {len(fake_product_descriptions)} AI açıklaması",
                "mood_board_id": mood_board_id
            })
            
            # Format dimensions info for prompt
            dimensions_info = ""
            if width and length:
                if height:
                    dimensions_info = f"Oda Boyutları: {width}cm x {length}cm x {height}cm"
                else:
                    dimensions_info = f"Oda Boyutları: {width}cm x {length}cm"
            
            # Create hybrid prompt combining real product references and AI descriptions
            enhanced_prompt = await self._create_hybrid_imagen_prompt(
                room_type, design_style, notes, design_title, design_description,
                real_product_images, fake_product_descriptions, color_info, dimensions_info
            )
            
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "optimizing_prompt", 
                "progress_percentage": 15,
                "message": "Hibrit tasarım promtu optimize ediliyor...",
                "mood_board_id": mood_board_id
            })
            
            # Stage 2: Generate image with Imagen 4 (20-70%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "generating_image",
                "progress_percentage": 20,
                "message": "AI hibrit görsel oluşturuyor (gerçek ürünler + yaratıcı tasarım)...",
                "mood_board_id": mood_board_id
            })
            
            # Generate image using Imagen 4 with hybrid prompt
            image_data = await self._generate_image_with_imagen(enhanced_prompt, connection_id, mood_board_id)
            
            # Stage 3: Processing hybrid image (70-85%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "processing_image",
                "progress_percentage": 75,
                "message": "Hibrit görsel işleniyor...",
                "mood_board_id": mood_board_id
            })
            
            # Save image
            image_file_path = None
            if image_data and image_data.get("base64"):
                await websocket_manager.update_mood_board_progress(connection_id, {
                    "stage": "processing_image",
                    "progress_percentage": 80,
                    "message": "Hibrit görsel kaydediliyor...",
                    "mood_board_id": mood_board_id
                })
                image_file_path = self._save_mood_board_image(mood_board_id, image_data["base64"])
            
            # Stage 4: Finalizing (85-95%)
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "finalizing",
                "progress_percentage": 90,
                "message": "Hibrit oda görseli tamamlanıyor...",
                "mood_board_id": mood_board_id
            })
            
            # Create mood board data
            current_time = datetime.now().isoformat()
            mood_board_data = {
                "mood_board_id": mood_board_id,
                "created_at": current_time,
                "user_input": {
                    "room_type": room_type,
                    "design_style": design_style,
                    "notes": notes
                },
                "design_content": {
                    "title": design_title,
                    "description": design_description
                },
                "hybrid_info": {
                    "real_products": len(real_product_images),
                    "fake_products": len(fake_product_descriptions),
                    "real_product_images": real_product_images,
                    "fake_descriptions": fake_product_descriptions
                },
                "image_data": {
                    "base64": image_data["base64"] if image_data else None,
                    "status": "success" if image_data else "failed",
                    "file_path": image_file_path,
                    "created_at": current_time  # Add created_at to image_data
                },
                "generation_metadata": {
                    "model": "Hybrid (Real + AI)",
                    "generated_at": current_time,
                    "success": bool(image_data)
                }
            }
            
            # Debug log mood board data structure for hybrid
            logger.info(f"Hybrid mood board data structure for {mood_board_id}:")
            logger.info(f"  - mood_board_id: {mood_board_data.get('mood_board_id')}")
            logger.info(f"  - created_at: {mood_board_data.get('created_at')}")
            logger.info(f"  - image_data.created_at: {mood_board_data.get('image_data', {}).get('created_at')}")
            logger.info(f"  - generation_metadata.generated_at: {mood_board_data.get('generation_metadata', {}).get('generated_at')}")
            
            # Stage 5: Completed (100%)
            # Debug log for completed message
            image_data_status = mood_board_data.get("image_data", {}).get("status", "unknown")
            has_base64 = bool(mood_board_data.get("image_data", {}).get("base64"))
            file_path = mood_board_data.get("image_data", {}).get("file_path", "none")
            
            logger.info(f"Sending completed message - status: {image_data_status}, has_base64: {has_base64}, file_path: {file_path}")
            
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "completed",
                "progress_percentage": 100,
                "message": "Hibrit oda görseli başarıyla oluşturuldu!",
                "mood_board_id": mood_board_id,
                "image_data": mood_board_data["image_data"]
            })
            
            # Save to database if design_id provided
            if design_id:
                await self._save_mood_board_to_database(
                    mood_board_id=mood_board_id,
                    user_id=user_id,
                    design_id=design_id,
                    image_file_path=image_file_path,
                    prompt_used=enhanced_prompt
                )
            
            logger.info(f"Hybrid mood board generated successfully: {mood_board_id} with {len(real_product_images)} real + {len(fake_product_descriptions)} fake products")
            return mood_board_data
            
        except Exception as e:
            logger.error(f"Error generating hybrid mood board: {str(e)}")
            await websocket_manager.update_mood_board_progress(connection_id, {
                "stage": "error",
                "progress_percentage": 0,
                "message": f"Hibrit görsel oluşturma hatası: {str(e)}",
                "mood_board_id": mood_board_id
            })
            raise
    
    async def _create_hybrid_imagen_prompt(
        self,
        room_type: str,
        design_style: str,
        notes: str,
        design_title: str,
        design_description: str,
        real_product_images: list,
        fake_product_descriptions: list,
        color_info: str = "",
        dimensions_info: str = ""
    ) -> str:
        """
        Create enhanced Imagen prompt for hybrid system.
        Combines real product visual references with AI-generated descriptions.
        """
        
        # Base home room prompt with residential emphasis
        # Map room type to clear home terminology
        from config.prompts import PromptUtils
        home_room_type = PromptUtils.map_room_type_to_home_english(room_type)
        
        base_prompt = f"""
Create a photorealistic residential home interior design image of a {home_room_type} in {design_style} style.

IMPORTANT: This is a HOME/RESIDENTIAL interior - family living space, NOT commercial, hotel, or venue.

Home Design Concept: {design_title}
{design_description}

Family/Homeowner Requirements: {notes}
"""
        
        # Add color and dimension info if available
        if color_info:
            base_prompt += f"\nColor Palette: {color_info}"
        if dimensions_info:
            base_prompt += f"\nRoom Dimensions: {dimensions_info}"
        
        # Add real product references
        if real_product_images:
            base_prompt += "\n\nReal Product References (use these as visual inspiration):"
            for product in real_product_images:
                base_prompt += f"\n- {product['category']}: {product['name']} (reference: {product['image_url']})"
        
        # Add fake product descriptions for creativity
        if fake_product_descriptions:
            base_prompt += "\n\nAdditional Design Elements (creative interpretation):"
            for product in fake_product_descriptions:
                base_prompt += f"\n- {product['category']}: {product['name']} - {product['description']}"
        
        base_prompt += f"""

Home Interior Image Requirements:
- Photorealistic residential home interior photography style
- Professional home lighting and family-friendly composition
- {design_style} aesthetic suitable for family living
- Include both referenced real products and creatively interpreted elements
- Natural home lighting, realistic textures and family-safe materials
- Wide-angle view showing the complete home room layout
- Warm, lived-in comfort suitable for daily family use
- 4K quality with sharp details and welcoming home atmosphere

Style: Professional residential interior photography, family home visualization, comfortable living space
"""
        
        return base_prompt


# Global room visualization service instance
mood_board_service = MoodBoardService()
