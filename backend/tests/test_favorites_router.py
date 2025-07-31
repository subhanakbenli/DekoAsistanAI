"""
Tests for favorites router endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock


class TestFavoritesEndpoints:
    """Test favorites management endpoints."""

    def test_add_favorite_design(self, client: TestClient):
        """Test adding a design to favorites."""
        favorite_data = {
            "design_id": "design123",
            "design_title": "Modern Living Room",
            "design_style": "Modern",
            "room_type": "Living Room"
        }
        
        headers = {"Authorization": "Bearer fake_token"}
        
        with patch("routers.favorites_router.add_favorite_design_db") as mock_add:
            mock_add.return_value = {
                "id": "fav123",
                "design_id": favorite_data["design_id"],
                "user_id": "user123",
                "created_at": "2025-07-31T12:00:00Z"
            }
            
            response = client.post("/api/favorites/designs", json=favorite_data, headers=headers)
            
            assert response.status_code == 201
            data = response.json()
            
            assert "message" in data
            assert "favorite" in data

    def test_get_favorite_designs(self, client: TestClient):
        """Test getting user's favorite designs."""
        headers = {"Authorization": "Bearer fake_token"}
        
        with patch("routers.favorites_router.get_user_favorite_designs") as mock_get:
            mock_get.return_value = [
                {
                    "id": "fav123",
                    "design_id": "design123",
                    "design_title": "Modern Living Room",
                    "design_style": "Modern",
                    "room_type": "Living Room",
                    "created_at": "2025-07-31T12:00:00Z"
                }
            ]
            
            response = client.get("/api/favorites/designs", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            
            assert isinstance(data, list)
            if data:
                assert "design_id" in data[0]
                assert "design_title" in data[0]

    def test_remove_favorite_design(self, client: TestClient):
        """Test removing a design from favorites."""
        favorite_id = "fav123"
        headers = {"Authorization": "Bearer fake_token"}
        
        with patch("routers.favorites_router.remove_favorite_design_db") as mock_remove:
            mock_remove.return_value = True
            
            response = client.delete(f"/api/favorites/designs/{favorite_id}", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            
            assert "message" in data
            assert "removed" in data["message"].lower()

    def test_add_favorite_product(self, client: TestClient):
        """Test adding a product to favorites."""
        product_data = {
            "product_name": "Modern Sofa",
            "product_description": "Comfortable modern sofa",
            "product_category": "Furniture",
            "design_id": "design123"
        }
        
        headers = {"Authorization": "Bearer fake_token"}
        
        with patch("routers.favorites_router.add_favorite_product_db") as mock_add:
            mock_add.return_value = {
                "id": "prod_fav123",
                "product_name": product_data["product_name"],
                "user_id": "user123",
                "created_at": "2025-07-31T12:00:00Z"
            }
            
            response = client.post("/api/favorites/products", json=product_data, headers=headers)
            
            assert response.status_code == 201
            data = response.json()
            
            assert "message" in data
            assert "favorite" in data

    def test_get_favorite_products(self, client: TestClient):
        """Test getting user's favorite products."""
        headers = {"Authorization": "Bearer fake_token"}
        
        with patch("routers.favorites_router.get_user_favorite_products") as mock_get:
            mock_get.return_value = [
                {
                    "id": "prod_fav123",
                    "product_name": "Modern Sofa",
                    "product_description": "Comfortable sofa",
                    "product_category": "Furniture",
                    "created_at": "2025-07-31T12:00:00Z"
                }
            ]
            
            response = client.get("/api/favorites/products", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            
            assert isinstance(data, list)
            if data:
                assert "product_name" in data[0]
                assert "product_category" in data[0]

    def test_remove_favorite_product(self, client: TestClient):
        """Test removing a product from favorites."""
        favorite_id = "prod_fav123"
        headers = {"Authorization": "Bearer fake_token"}
        
        with patch("routers.favorites_router.remove_favorite_product_db") as mock_remove:
            mock_remove.return_value = True
            
            response = client.delete(f"/api/favorites/products/{favorite_id}", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            
            assert "message" in data
            assert "removed" in data["message"].lower()

    def test_unauthorized_access(self, client: TestClient):
        """Test accessing favorites without authentication."""
        response = client.get("/api/favorites/designs")
        
        assert response.status_code == 401
