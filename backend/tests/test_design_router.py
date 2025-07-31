"""
Tests for design router endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock


class TestDesignEndpoints:
    """Test design generation endpoints."""

    def test_generate_design_suggestion(self, client: TestClient, sample_design_request, mock_gemini_response):
        """Test design suggestion generation endpoint."""
        with patch("services.ai.gemini_service.GeminiService.generate_design_suggestion") as mock_generate:
            mock_generate.return_value = mock_gemini_response
            
            response = client.post("/api/design/test", json=sample_design_request)
            
            assert response.status_code == 200
            data = response.json()
            
            assert "design_title" in data
            assert "design_description" in data
            assert "products" in data
            assert "hashtags" in data
            assert data["design_title"] == mock_gemini_response["design_title"]

    def test_generate_design_invalid_request(self, client: TestClient):
        """Test design generation with invalid request."""
        invalid_request = {
            "room_type": "",  # Empty room type
            "design_style": "Modern",
            "notes": "Test notes"
        }
        
        response = client.post("/api/design/test", json=invalid_request)
        
        assert response.status_code == 422  # Validation error

    def test_get_design_history(self, client: TestClient):
        """Test getting design history."""
        with patch("services.design.design_history_service.DesignHistoryService.get_user_designs") as mock_get_designs:
            mock_get_designs.return_value = [
                {
                    "id": "1",
                    "design_title": "Modern Living Room",
                    "created_at": "2025-07-31T12:00:00Z",
                    "room_type": "Living Room",
                    "design_style": "Modern"
                }
            ]
            
            headers = {"Authorization": "Bearer fake_token"}
            response = client.get("/api/design/history", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            
            assert isinstance(data, list)
            if data:  # If there are designs
                assert "design_title" in data[0]
                assert "room_type" in data[0]

    def test_get_design_by_id(self, client: TestClient):
        """Test getting a specific design by ID."""
        design_id = "123"
        
        with patch("services.design.design_history_service.DesignHistoryService.get_design_by_id") as mock_get_design:
            mock_get_design.return_value = {
                "id": design_id,
                "design_title": "Modern Living Room",
                "design_description": "A beautiful modern room",
                "room_type": "Living Room",
                "design_style": "Modern",
                "products": []
            }
            
            response = client.get(f"/api/design/{design_id}")
            
            assert response.status_code == 200
            data = response.json()
            
            assert data["id"] == design_id
            assert "design_title" in data

    def test_get_design_not_found(self, client: TestClient):
        """Test getting a non-existent design."""
        design_id = "nonexistent"
        
        with patch("services.design.design_history_service.DesignHistoryService.get_design_by_id") as mock_get_design:
            mock_get_design.return_value = None
            
            response = client.get(f"/api/design/{design_id}")
            
            assert response.status_code == 404

    def test_create_mood_board(self, client: TestClient):
        """Test room visualization creation."""
        mood_board_request = {
            "room_type": "Living Room",
            "design_style": "Modern",
            "notes": "Create a cozy atmosphere",
            "design_title": "Cozy Modern Living",
            "design_description": "A cozy modern living room"
        }
        
        with patch("services.design.mood_board_service.mood_board_service.create_mood_board") as mock_create:
            mock_create.return_value = {
                "mood_board_id": "mb123",
                "status": "completed",
                "image_url": "https://example.com/image.jpg"
            }
            
            response = client.post("/design/mood-board", json=mood_board_request)
            
            assert response.status_code == 200
            data = response.json()
            
            assert "mood_board_id" in data
            assert "status" in data
