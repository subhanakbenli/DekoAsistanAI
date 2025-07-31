from fastapi import APIRouter, Form, HTTPException, BackgroundTasks, Depends, Query, status
from fastapi.responses import FileResponse
from config import logger
from config.database import get_db, get_async_session
from config.constants import DESIGN_NOT_FOUND, DESIGN_CREATED_SUCCESS
from utils.error_handler import ErrorHandler
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from models import DesignResponseModel
from models.user_models import User
from models.design_models_db import Design, MoodBoard, DesignHashtag
from services import GeminiService, DesignHistoryService, mood_board_service, mood_board_log_service
from middleware.auth_middleware import OptionalAuth, optional_auth
import os
import time
from datetime import datetime
import uuid

router = APIRouter(prefix="/design")

def get_clean_image_filename(image_path):
    """Extract clean filename from image path, handling various path formats."""
    if not image_path:
        return None
    
    # Remove any leading/trailing whitespace
    path = image_path.strip()
    
    # Handle different path separators and formats
    if '\\' in path:
        filename = path.split('\\')[-1]
    elif '/' in path:
        filename = path.split('/')[-1]
    else:
        filename = path
    
    # Remove any remaining path prefixes
    if filename.startswith('data/mood_boards/'):
        filename = filename.replace('data/mood_boards/', '')
    elif filename.startswith('data\\mood_boards\\'):
        filename = filename.replace('data\\mood_boards\\', '')
    
    return filename

# Service Container Pattern
class DesignServices:
    """Service container for design operations"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.gemini_service = GeminiService()
            cls._instance.history_service = DesignHistoryService()
        return cls._instance

services = DesignServices()

@router.post("/test", response_model=DesignResponseModel)
async def design_request_endpoint(
    background_tasks: BackgroundTasks,
    room_type: str = Form(...),
    design_style: str = Form(...),
    notes: str = Form(...),
    connection_id: str = Form(None),  # WebSocket connection ID for real-time room visualization
    color_info: str = Form(""),  # Renk paleti bilgisi (frontend'den formatlanmış)
    dimensions_info: str = Form(""),  # Oda boyutları bilgisi (frontend'den formatlanmış)
    db: AsyncSession = Depends(get_db),
    auth_data: dict = Depends(OptionalAuth())
):
    """
    Main design request endpoint - Enhanced room visualization generation.
    
    Processes user preferences and generates comprehensive design suggestions with Gemini AI.
    When connection_id is provided, automatically starts background room visualization generation
    using Imagen 4 with 19+ step progress tracking via WebSocket.
    
    Features:
    - AI-powered design suggestions with Turkish language support
    - Real-time room visualization with enhanced progress tracking  
    - Background task processing for non-blocking user experience
    - Guest and authenticated user support
    - Database persistence for design history
    
    According to PRD: Sends user-provided information to Gemini and returns detailed 
    design suggestions with optional room visualization generation.
    """
    user = auth_data.get("user")
    user_id = user.id if user else None
    user_email = user.email if user else "guest"
    
    logger.info(f"Design request from {user_email}: {room_type} - {design_style}")
    
    try:
        # Generate design suggestion using Gemini service
        design_result = services.gemini_service.generate_design_suggestion(
            room_type=room_type,
            design_style=design_style,
            notes=notes
        )
        
        logger.info(f"Design suggestion created successfully for {user_email}: {design_result['title']}")
        
        # Generate design ID for response
        design_id = str(uuid.uuid4())
        
        # Start room visualization generation in background if connection_id is provided
        if connection_id:
            logger.info(f"Starting background room visualization generation for connection: {connection_id}")
            background_tasks.add_task(
                mood_board_service.generate_mood_board,
                connection_id=connection_id,
                room_type=room_type,
                design_style=design_style,
                notes=notes,
                design_title=design_result["title"],
                design_description=design_result["description"],
                products=design_result.get("products", []),  # Pass products for room visualization
                design_id=design_id,  # Link visualization to design record
                user_id=user_id,      # User ID for database tracking
                color_info=color_info,  # Frontend'den gelen renk bilgisi
                dimensions_info=dimensions_info  # Frontend'den gelen boyut bilgisi
            )
        
        # If user is authenticated, save to database
        # Save design to database for all users (guest and authenticated)
        try:
            db_design = Design(
                id=design_id,
                user_id=user_id,  # Will be None for guests
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
            
            logger.info(f"Design saved to database for {user_email} with ID: {design_id}")
            
            # Save hashtags if they exist
            hashtags = design_result.get("hashtags", {})
            if hashtags and hashtags.get("en"):  # Check if English hashtags exist
                try:
                    await services.gemini_service.save_design_hashtags(db, design_id, hashtags)
                    logger.info(f"Hashtags saved for design {design_id}: EN={hashtags.get('en', [])} TR={hashtags.get('tr', [])}")
                except Exception as hashtag_error:
                    logger.error(f"Error saving hashtags for design {design_id}: {str(hashtag_error)}")
                    # Continue even if hashtag saving fails
            
        except Exception as db_error:
            logger.error(f"Error saving design to database: {str(db_error)}")
            await db.rollback()
            # Continue with response even if database save fails
        
        return DesignResponseModel(
            design_id=design_id,  # Always provide design_id for favorites UI
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_title=design_result["title"],
            design_description=design_result["description"],
            hashtags=design_result.get("hashtags", {"en": [], "tr": [], "display": []}),
            product_suggestion=design_result["product_suggestion"],
            products=design_result.get("products", []),
            success=True,
            message=DESIGN_CREATED_SUCCESS + 
                   (f" - Room visualization generating for connection: {connection_id}" if connection_id else "") +
                   (" - Saved to your account" if user_id else " - Sign in to save designs to your account")
        )
        
    except Exception as e:
        logger.error(f"Error while creating design suggestion for {user_email}: {str(e)}")
        
        # Fallback response in case of error
        return DesignResponseModel(
            design_id=None,
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            design_title=f"Custom {design_style} {room_type} Design",
            design_description=f"We are preparing a custom design concept in {design_style.lower()} style for this {room_type.lower()}. Please try again later.",
            hashtags={"en": [], "tr": [], "display": []},  # Empty hashtags structure for error case
            product_suggestion="Product suggestions suitable for this design will be added soon",
            products=[],
            success=False,
            message=f"A temporary error occurred: {str(e)}"
        )


@router.get("/history")
async def get_design_history(
    limit: int = Query(20, description="Number of designs to return"),
    user_auth: dict = Depends(optional_auth),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Get user's design history from database.
    Requires authentication.
    """
    user = user_auth.get("user")
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to view design history"
        )
    
    try:
        # Get user's designs from database
        result = await db.execute(
            select(Design)
            .where(Design.user_id == user.id)
            .order_by(Design.created_at.desc())
            .limit(limit)
        )
        
        designs = result.scalars().all()
        
        # Convert to response format
        design_history = []
        for design in designs:
            design_history.append({
                "design_id": design.id,
                "title": design.title,
                "description": design.description,
                "room_type": design.room_type,
                "design_style": design.design_style,
                "notes": design.notes,
                "product_suggestion": design.product_suggestion,
                "products": design.products,
                "is_favorite": design.is_favorite,
                "mood_board_id": design.mood_board_id,  # Include mood board ID
                "created_at": design.created_at.isoformat()
            })
        
        return {
            "designs": design_history,
            "total": len(design_history),
            "message": f"Retrieved {len(design_history)} designs from your history"
        }
        
    except Exception as e:
        logger.error(f"Error fetching design history for user {user.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving design history"
        )


@router.post("/test-image-generation")
async def test_image_generation(prompt: str = Form(...)):
    """
    Test endpoint for Imagen API - generates image from prompt and measures execution time.
    For testing purposes only.
    """
    
    logger.info(f"Test image generation requested with prompt: {prompt}")
    
    try:
        # Start timing
        start_time = time.time()
        
        # Generate image using mood board service's imagen method (without progress tracking for test)
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
        history = services.history_service.get_design_history(limit=limit)
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
            raise HTTPException(status_code=404, detail=DESIGN_NOT_FOUND)
        
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
        design = services.history_service.get_design_by_id(request_id)
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
                "message": DESIGN_NOT_FOUND
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
        stats = services.history_service.get_design_stats()
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

@router.get("/{design_id}")
async def get_design_details(
    design_id: str,
    db: AsyncSession = Depends(get_async_session),
    auth_data: dict = Depends(OptionalAuth())
):
    """Get design details by ID."""
    
    try:
        # Query design from database with hashtags and mood board
        result = await db.execute(
            select(Design, MoodBoard)
            .outerjoin(MoodBoard, Design.id == MoodBoard.design_id)
            .options(selectinload(Design.hashtags).selectinload(DesignHashtag.hashtag))
            .where(Design.id == design_id)
        )
        design_with_mood_board = result.first()
        
        if not design_with_mood_board or not design_with_mood_board.Design:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=DESIGN_NOT_FOUND
            )
        
        design = design_with_mood_board.Design
        mood_board = design_with_mood_board.MoodBoard
        
        # Get hashtags and translate them
        hashtags_data = {"en": [], "tr": [], "display": []}
        if design.hashtags:
            # Sort hashtags by order_index to maintain general-to-specific ordering
            sorted_hashtags = sorted(design.hashtags, key=lambda x: x.order_index)
            english_hashtags = [dh.hashtag.name for dh in sorted_hashtags]
            
            # Use hashtag service to translate
            hashtag_translations = services.gemini_service.hashtag_service.translate_hashtags(english_hashtags)
            hashtags_data = hashtag_translations
        
        # Convert to response format
        design_data = {
            "design_id": design.id,
            "design_title": design.title,
            "design_description": design.description,
            "room_type": design.room_type,
            "design_style": design.design_style,
            "notes": design.notes,
            "product_suggestion": design.product_suggestion,
            "products": design.products or [],
            "hashtags": hashtags_data,  # Add hashtags to response
            "image": {
                "has_image": mood_board is not None,
                "image_url": f"/static/mood_boards/{get_clean_image_filename(mood_board.image_path)}" if mood_board and mood_board.image_path else None,
                "mood_board_id": mood_board.mood_board_id if mood_board else None,
                "generation_time": mood_board.generation_time_seconds if mood_board else None,
                "debug_original_path": mood_board.image_path if mood_board else None  # Debug için
            },
            "created_at": design.created_at.isoformat() if design.created_at else None,
            "updated_at": design.updated_at.isoformat() if design.updated_at else None,
            "is_favorite": design.is_favorite,
            "mood_board_id": design.mood_board_id
        }
        
        logger.debug(f"Design details retrieved for ID: {design_id}")
        return design_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving design details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/mood-board/database/{mood_board_id}")
async def get_mood_board_from_database(
    mood_board_id: str,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Get mood board data from database by mood_board_id.
    """
    try:
        # Get mood board from database
        result = await db.execute(
            select(MoodBoard)
            .where(MoodBoard.mood_board_id == mood_board_id)
        )
        
        mood_board = result.scalar_one_or_none()
        
        if not mood_board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mood board not found in database"
            )
        
        # Convert to response format
        mood_board_data = {
            "id": mood_board.id,
            "user_id": mood_board.user_id,
            "design_id": mood_board.design_id,
            "mood_board_id": mood_board.mood_board_id,
            "image_path": mood_board.image_path,
            "prompt_used": mood_board.prompt_used,
            "generation_time_seconds": mood_board.generation_time_seconds,
            "image_size": mood_board.image_size,
            "created_at": mood_board.created_at.isoformat() if mood_board.created_at else None
        }
        
        return {
            "success": True,
            "data": mood_board_data,
            "message": "Mood board retrieved from database successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving mood board from database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving mood board from database"
        )


@router.get("/mood-board/by-design/{design_id}")
async def get_mood_board_by_design_id(
    design_id: str,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Get mood board data by design_id.
    """
    try:
        # Get mood board from database by design_id
        result = await db.execute(
            select(MoodBoard)
            .where(MoodBoard.design_id == design_id)
        )
        
        mood_board = result.scalar_one_or_none()
        
        if not mood_board:
            return {
                "success": False,
                "data": None,
                "message": "No mood board found for this design"
            }
        
        # Convert to response format
        mood_board_data = {
            "id": mood_board.id,
            "user_id": mood_board.user_id,
            "design_id": mood_board.design_id,
            "mood_board_id": mood_board.mood_board_id,
            "image_path": mood_board.image_path,
            "prompt_used": mood_board.prompt_used,
            "generation_time_seconds": mood_board.generation_time_seconds,
            "image_size": mood_board.image_size,
            "created_at": mood_board.created_at.isoformat() if mood_board.created_at else None
        }
        
        return {
            "success": True,
            "data": mood_board_data,
            "message": "Mood board retrieved by design ID successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving mood board by design ID: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving mood board by design ID"
        )
    