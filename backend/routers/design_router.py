from fastapi import APIRouter, Form, HTTPException
from config import logger
from models import DesignResponseModel
from services import GeminiService, DesignHistoryService

router = APIRouter()

# Initialize services
gemini_service = GeminiService()
history_service = DesignHistoryService()

@router.post("/test", response_model=DesignResponseModel)
async def design_request_endpoint(
    room_type: str = Form(...),
    design_style: str = Form(...),
    notes: str = Form(...)
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
            message=f"Design suggestion created successfully (ID: {request_id})"
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
    
    
