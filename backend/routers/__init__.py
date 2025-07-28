from .health_router import router as health_router
from .design_router import router as design_router
from .websocket_router import router as websocket_router
from .auth_router import router as auth_router

__all__ = ["health_router", "design_router", "websocket_router", "auth_router"]
