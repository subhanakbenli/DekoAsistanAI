from fastapi import APIRouter, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from config import logger
from models import DesignResponseModel
from services import GeminiService, DesignHistoryService, mood_board_service, mood_board_log_service
import os
from datetime import datetime

router = APIRouter()

# Initialize services
gemini_service = GeminiService()
history_service = DesignHistoryService()

@router.post("/test", response_model=DesignResponseModel)
async def design_request_endpoint(
    background_tasks: BackgroundTasks,
    room_type: str = Form(...),
    design_style: str = Form(...),
    notes: str = Form(...),
    connection_id: str = Form(None)  # WebSocket connection ID for mood board
):
    """
    Main design request endpoint - processes data from frontend and generates design suggestions with Gemini AI.
    According to PRD, sends user-provided information to Gemini and gets detailed design suggestions.
    """
    logger.info("Design request received:")
    logger.info(f"Room Type: {room_type}")
    logger.info(f"Design Style: {design_style}")
    logger.info(f"Notes: {notes}")
    
    try:
        # Generate design suggestion using Gemini service
        design_result = gemini_service.generate_design_suggestion(
            room_type=room_type,
            design_style=design_style,
            notes=notes
        )
        
        logger.info(f"Design suggestion created successfully: {design_result['title']}")
        
        # Start mood board generation in background if connection_id provided
        if connection_id:
            logger.info(f"Starting mood board generation for connection: {connection_id}")
            background_tasks.add_task(
                mood_board_service.generate_mood_board,
                connection_id,
                room_type,
                design_style, 
                notes,
                design_result["title"],
                design_result["description"]
            )
        
        # Save to history
        request_id = history_service.save_design_request(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_result=design_result,
            success=True
        )
        
        return DesignResponseModel(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_title=design_result["title"],
            design_description=design_result["description"],
            product_suggestion=design_result["product_suggestion"],
            success=True,
            message=f"Design suggestion created successfully (ID: {request_id})" + 
                   (f" - Mood board generating for connection: {connection_id}" if connection_id else "")
        )
        
    except Exception as e:
        logger.error(f"Error while creating design suggestion: {str(e)}")
        
        # Save error to history
        error_result = {
            "title": f"Custom {design_style} {room_type} Design",
            "description": f"We are preparing a custom design concept in {design_style.lower()} style for this {room_type.lower()}. Please try again later.",
            "product_suggestion": "Product suggestions suitable for this design will be added soon"
        }
        
        request_id = history_service.save_design_request(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_result=error_result,
            success=False,
            error_message=str(e)
        )
        
        # Fallback response in case of error
        return DesignResponseModel(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_title=f"Custom {design_style} {room_type} Design",
            design_description=f"We are preparing a custom design concept in {design_style.lower()} style for this {room_type.lower()}. Please try again later.",
            product_suggestion="Product suggestions suitable for this design will be added soon",
            success=False,
            message=f"A temporary error occurred: {str(e)} (ID: {request_id})"
        )


@router.post("/test-image-generation")
async def test_image_generation(prompt: str = Form(...)):
    """
    Test endpoint for Imagen API - generates image from prompt and measures execution time.
    For testing purposes only.
    """
    import time
    
    logger.info(f"Test image generation requested with prompt: {prompt}")
    
    try:
        # Start timing
        start_time = time.time()
        
        # Generate image using mood board service's imagen method
        image_result = await mood_board_service._generate_image_with_imagen(prompt)
        
        # Calculate execution time
        end_time = time.time()
        execution_time = round(end_time - start_time, 2)
        
        if image_result and image_result.get("success"):
            logger.info(f"Test image generated successfully in {execution_time} seconds")
            
            # Save test image to file
            if image_result.get("base64"):
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                test_filename = f"test_image_{timestamp}.png"
                saved_path = mood_board_service._save_mood_board_image(f"test_{timestamp}", image_result["base64"])
                
                return {
                    "success": True,
                    "message": f"Image generated successfully in {execution_time} seconds",
                    "execution_time_seconds": execution_time,
                    "prompt_used": prompt,
                    "image_saved_to": saved_path,
                    "image_base64": image_result["base64"],
                    "model_used": mood_board_service.settings.IMAGEN_MODEL_NAME,
                    "timestamp": timestamp
                }
            else:
                return {
                    "success": False,
                    "message": f"Image generation completed in {execution_time} seconds but no image data returned",
                    "execution_time_seconds": execution_time,
                    "prompt_used": prompt
                }
        else:
            return {
                "success": False,
                "message": f"Image generation failed after {execution_time} seconds",
                "execution_time_seconds": execution_time,
                "prompt_used": prompt,
                "error": "No result or unsuccessful generation"
            }
            
    except Exception as e:
        end_time = time.time()
        execution_time = round(end_time - start_time, 2) if 'start_time' in locals() else 0
        
        logger.error(f"Error in test image generation: {str(e)}")
        return {
            "success": False,
            "message": f"Error occurred after {execution_time} seconds: {str(e)}",
            "execution_time_seconds": execution_time,
            "prompt_used": prompt,
            "error": str(e)
        }


@router.get("/history")
async def get_design_history(limit: int = 20):
    """
    Get recent design history.
    """
    try:
        history = history_service.get_design_history(limit=limit)
        return {
            "success": True,
            "data": history,
            "count": len(history),
            "message": "Design history retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Error retrieving design history: {str(e)}")
        return {
            "success": False,
            "data": [],
            "count": 0,
            "message": f"Error retrieving history: {str(e)}"
        }


@router.get("/history/{request_id}")
async def get_design_by_id(request_id: str):
    """
    Get specific design by request ID.
    """
    try:
        design = history_service.get_design_by_id(request_id)
        if design:
            return {
                "success": True,
                "data": design,
                "message": "Design found successfully"
            }
        else:
            return {
                "success": False,
                "data": None,
                "message": "Design not found"
            }
    except Exception as e:
        logger.error(f"Error retrieving design by ID: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving design: {str(e)}"
        }


@router.get("/stats")
async def get_design_stats():
    """
    Get design request statistics.
    """
    try:
        stats = history_service.get_design_stats()
        return {
            "success": True,
            "data": stats,
            "message": "Statistics retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Error retrieving design stats: {str(e)}")
        return {
            "success": False,
            "data": {},
            "message": f"Error retrieving statistics: {str(e)}"
        }
@router.get("/mood-board/history")
async def get_mood_board_history(limit: int = 20):
    """
    Get recent mood board generation history.
    """
    try:
        history = mood_board_log_service.get_mood_board_history(limit=limit)
        return {
            "success": True,
            "data": history,
            "count": len(history),
            "message": "Mood board history retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Error retrieving mood board history: {str(e)}")
        return {
            "success": False,
            "data": [],
            "count": 0,
            "message": f"Error retrieving mood board history: {str(e)}"
        }


@router.get("/mood-board/stats")
async def get_mood_board_stats():
    """
    Get mood board generation statistics.
    """
    try:
        stats = mood_board_log_service.get_mood_board_stats()
        return {
            "success": True,
            "data": stats,
            "message": "Mood board statistics retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Error retrieving mood board stats: {str(e)}")
        return {
            "success": False,
            "data": {},
            "message": f"Error retrieving mood board statistics: {str(e)}"
        }


@router.get("/mood-board/{mood_board_id}")
async def get_mood_board_by_id(mood_board_id: str):
    """
    Get specific mood board by ID.
    """
    try:
        mood_board = mood_board_log_service.get_mood_board_by_id(mood_board_id)
        if mood_board:
            return {
                "success": True,
                "data": mood_board,
                "message": "Mood board found successfully"
            }
        else:
            return {
                "success": False,
                "data": None,
                "message": "Mood board not found"
            }
    except Exception as e:
        logger.error(f"Error retrieving mood board by ID: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving mood board: {str(e)}"
        }
    

@router.get("/mood-board/image/{mood_board_id}")
async def get_mood_board_image(mood_board_id: str):
    """
    Get mood board image file by ID.
    """
    try:
        # Get mood board info from history
        mood_board = mood_board_log_service.get_mood_board_by_id(mood_board_id)
        
        if not mood_board:
            raise HTTPException(status_code=404, detail="Mood board not found")
        
        # Check if file path exists in generation result
        generation_result = mood_board.get("generation_result", {})
        image_file_path = generation_result.get("image_file_path")
        
        if not image_file_path or not os.path.exists(image_file_path):
            raise HTTPException(status_code=404, detail="Mood board image file not found")
        
        # Return image file
        return FileResponse(
            path=image_file_path,
            media_type="image/png",
            filename=f"mood_board_{mood_board_id[:8]}.png"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving mood board image: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving mood board image")


@router.get("/mood-board/files")
async def list_mood_board_files():
    """
    List all saved mood board files.
    """
    try:
        mood_boards_dir = os.path.join("data", "mood_boards")
        
        if not os.path.exists(mood_boards_dir):
            return {
                "success": True,
                "data": [],
                "count": 0,
                "message": "No mood board files found"
            }
        
        # List PNG files in mood_boards directory
        files = []
        for filename in os.listdir(mood_boards_dir):
            if filename.endswith('.png'):
                file_path = os.path.join(mood_boards_dir, filename)
                file_stat = os.stat(file_path)
                
                files.append({
                    "filename": filename,
                    "file_path": file_path,
                    "size_bytes": file_stat.st_size,
                    "created_at": datetime.fromtimestamp(file_stat.st_ctime).isoformat(),
                    "modified_at": datetime.fromtimestamp(file_stat.st_mtime).isoformat()
                })
        
        # Sort by creation time (newest first)
        files.sort(key=lambda x: x["created_at"], reverse=True)
        
        return {
            "success": True,
            "data": files,
            "count": len(files),
            "message": f"Found {len(files)} mood board files"
        }
        
    except Exception as e:
        logger.error(f"Error listing mood board files: {str(e)}")
        return {
            "success": False,
            "data": [],
            "count": 0,
            "message": f"Error listing mood board files: {str(e)}"
        }
    