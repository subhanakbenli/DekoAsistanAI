from fastapi import APIRouter
from config import logger

router = APIRouter()

@router.get("/")
async def root():
    """
    Main endpoint - check if API is running.
    """
    logger.info("Request received at root endpoint")
    return {"message": "API is running"}
