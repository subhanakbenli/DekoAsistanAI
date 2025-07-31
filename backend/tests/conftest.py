"""
Test configuration and fixtures.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import sys
import os

# Add the parent directory to the path so we can import from the main app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mock the database and services before importing the main app
with patch('config.database.get_async_session'):
    with patch('services.ai.gemini_service.GeminiService'):
        with patch('services.auth.auth_service.AuthService'):
            with patch('services.communication.websocket_manager.websocket_manager'):
                from main import app

@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(app)

@pytest.fixture
def mock_gemini_response():
    """Mock Gemini API response."""
    return {
        "design_title": "Modern Living Room",
        "design_description": "A beautiful modern living room with clean lines",
        "room_type": "Living Room",
        "design_style": "Modern",
        "color_palette": ["#FFFFFF", "#000000", "#808080"],
        "products": [
            {
                "name": "Modern Sofa",
                "description": "Comfortable modern sofa",
                "category": "Furniture",
                "price_range": "1000-2000 TL"
            }
        ],
        "hashtags": ["modern", "livingroom", "comfortable"]
    }

@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }

@pytest.fixture
def sample_design_request():
    """Sample design request data."""
    return {
        "room_type": "Living Room",
        "design_style": "Modern",
        "notes": "400cm x 300cm room with large windows, prefer neutral colors"
    }
