from fastapi import APIRouter, Form, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from config import logger
from config.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from models import DesignResponseModel
from models.user_models import User
from models.design_models_db import Design
from services import GeminiService, DesignHistoryService, mood_board_service, mood_board_log_service
from middleware.auth_middleware import OptionalAuth
import os
from datetime import datetime
import uuid

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
    connection_id: str = Form(None),  # WebSocket connection ID for mood board
    db: AsyncSession = Depends(get_db),
    auth_data: dict = Depends(OptionalAuth())
):
    """
    Main design request endpoint - processes data from frontend and generates design suggestions with Gemini AI.
    According to PRD, sends user-provided information to Gemini and gets detailed design suggestions.
    Supports both guest users and authenticated users.
    """
    user = auth_data.get("user")
    user_id = user.id if user else None
    user_email = user.email if user else "guest"
    
    logger.info(f"Design request received from {user_email}:")
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
        
        logger.info(f"Design suggestion created successfully for {user_email}: {design_result['title']}")
        
        # Save to history (existing JSON file method for now)
        request_id = history_service.save_design_request(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_result=design_result,
            success=True
        )
        
        # If user is authenticated, also save to database
        if user_id:
            try:
                # Create a unique design ID
                design_id = str(uuid.uuid4())
                
                # Save design to database
                db_design = Design(
                    id=design_id,
                    user_id=user_id,
                    title=design_result["title"],
                    description=design_result["description"],
                    room_type=room_type,
                    design_style=design_style,
                    notes=notes,
                    product_suggestion=design_result["product_suggestion"],
                    products=design_result.get("products", []),
                    gemini_response=design_result,
                    is_favorite=False
                )
                
                db.add(db_design)
                await db.commit()
                await db.refresh(db_design)
                
                logger.info(f"Design saved to database for user {user_email} with ID: {design_id}")
                
            except Exception as db_error:
                logger.error(f"Error saving design to database: {str(db_error)}")
                await db.rollback()
                # Continue with response even if database save fails
        
        return DesignResponseModel(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_title=design_result["title"],
            design_description=design_result["description"],
            product_suggestion=design_result["product_suggestion"],
            products=design_result.get("products", []),
            success=True,
            message=f"Design suggestion created successfully (ID: {request_id})" + 
                   (f" - Mood board generating for connection: {connection_id}" if connection_id else "") +
                   (f" - Saved to your account" if user_id else " - Sign in to save designs to your account")
        )
        
    except Exception as e:
        logger.error(f"Error while creating design suggestion for {user_email}: {str(e)}")
        
        # Save error to history
        error_result = {
            "title": f"Custom {design_style} {room_type} Design",
            "description": f"We are preparing a custom design concept in {design_style.lower()} style for this {room_type.lower()}. Please try again later.",
            "product_suggestion": "Product suggestions suitable for this design will be added soon",
            "products": []
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
            products=[],
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


@router.get("/my-designs")
async def get_my_designs(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    auth_data: dict = Depends(OptionalAuth())
):
    """
    Get authenticated user's designs from database.
    Returns empty list if user is not authenticated.
    """
    user = auth_data.get("user")
    
    if not user:
        return {
            "success": True,
            "data": [],
            "count": 0,
            "total": 0,
            "message": "Please sign in to view your designs"
        }
    
    try:
        from sqlalchemy import select, func
        
        # Get total count
        count_query = select(func.count(Design.id)).where(Design.user_id == user.id)
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        # Get designs with pagination
        query = (
            select(Design)
            .where(Design.user_id == user.id)
            .order_by(Design.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        
        result = await db.execute(query)
        designs = result.scalars().all()
        
        # Convert to list of dictionaries
        designs_data = [
            {
                "id": design.id,
                "title": design.title,
                "description": design.description,
                "room_type": design.room_type,
                "design_style": design.design_style,
                "notes": design.notes,
                "product_suggestion": design.product_suggestion,
                "products": design.products,
                "is_favorite": design.is_favorite,
                "created_at": design.created_at.isoformat(),
                "updated_at": design.updated_at.isoformat()
            }
            for design in designs
        ]
        
        return {
            "success": True,
            "data": designs_data,
            "count": len(designs_data),
            "total": total,
            "limit": limit,
            "offset": offset,
            "message": f"Found {len(designs_data)} designs"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving user designs: {str(e)}")
        return {
            "success": False,
            "data": [],
            "count": 0,
            "total": 0,
            "message": f"Error retrieving designs: {str(e)}"
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


@router.get("/my-designs/{design_id}")
async def get_my_design_by_id(
    design_id: str,
    db: AsyncSession = Depends(get_db),
    auth_data: dict = Depends(OptionalAuth())
):
    """
    Get a specific design by ID for authenticated user.
    """
    user = auth_data.get("user")
    
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        from sqlalchemy import select
        
        query = select(Design).where(
            Design.id == design_id,
            Design.user_id == user.id
        )
        
        result = await db.execute(query)
        design = result.scalar_one_or_none()
        
        if not design:
            raise HTTPException(status_code=404, detail="Design not found")
        
        design_data = {
            "id": design.id,
            "title": design.title,
            "description": design.description,
            "room_type": design.room_type,
            "design_style": design.design_style,
            "notes": design.notes,
            "product_suggestion": design.product_suggestion,
            "products": design.products,
            "is_favorite": design.is_favorite,
            "gemini_response": design.gemini_response,
            "created_at": design.created_at.isoformat(),
            "updated_at": design.updated_at.isoformat()
        }
        
        return {
            "success": True,
            "data": design_data,
            "message": "Design found successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving design by ID: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving design")


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
    