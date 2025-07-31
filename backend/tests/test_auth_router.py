"""
Tests for authentication router endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock


class TestAuthEndpoints:
    """Test authentication endpoints."""

    def test_register_user(self, client: TestClient, sample_user_data):
        """Test user registration endpoint."""
        with patch("services.auth.auth_service.AuthService.register") as mock_register:
            mock_register.return_value = {
                "id": "123",
                "email": sample_user_data["email"],
                "full_name": sample_user_data["full_name"],
                "is_active": True
            }
            
            response = client.post("/api/auth/register", json=sample_user_data)
            
            assert response.status_code == 201
            data = response.json()
            
            assert "user" in data
            assert data["user"]["email"] == sample_user_data["email"]
            assert "access_token" in data

    def test_login_user(self, client: TestClient, sample_user_data):
        """Test user login endpoint."""
        login_data = {
            "email": sample_user_data["email"],
            "password": sample_user_data["password"]
        }
        
        with patch("services.auth.auth_service.AuthService.login") as mock_login:
            mock_login.return_value = {
                "access_token": "fake_token",
                "token_type": "bearer",
                "user": {
                    "id": "123",
                    "email": sample_user_data["email"],
                    "full_name": sample_user_data["full_name"]
                }
            }
            
            response = client.post("/api/auth/login", json=login_data)
            
            assert response.status_code == 200
            data = response.json()
            
            assert "access_token" in data
            assert "user" in data
            assert data["user"]["email"] == sample_user_data["email"]

    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        invalid_data = {
            "email": "wrong@example.com",
            "password": "wrongpassword"
        }
        
        with patch("services.auth.auth_service.AuthService.login") as mock_login:
            mock_login.side_effect = Exception("Invalid credentials")
            
            response = client.post("/api/auth/login", json=invalid_data)
            
            assert response.status_code == 401

    def test_get_current_user(self, client: TestClient):
        """Test get current user endpoint."""
        headers = {"Authorization": "Bearer fake_token"}
        
        with patch("middleware.auth_middleware.get_current_user_optional") as mock_get_user:
            mock_get_user.return_value = {
                "id": "123",
                "email": "test@example.com",
                "full_name": "Test User"
            }
            
            response = client.get("/api/auth/me", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            
            assert "email" in data
            assert data["email"] == "test@example.com"

    def test_logout_user(self, client: TestClient):
        """Test user logout endpoint."""
        headers = {"Authorization": "Bearer fake_token"}
        
        response = client.post("/api/auth/logout", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "message" in data
        assert "logout" in data["message"].lower()
