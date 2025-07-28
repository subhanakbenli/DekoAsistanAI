"""
Authentication API Test Script
"""
import requests
import json

# Base URL
BASE_URL = "http://127.0.0.1:8000"

def test_user_registration():
    """Test user registration endpoint."""
    print("🔹 Testing User Registration...")
    
    url = f"{BASE_URL}/api/auth/register"
    data = {
        "email": "testuser@dekoasistan.ai",
        "username": "testuser123",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
            return response.json()
        else:
            print("❌ Registration failed!")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_user_login():
    """Test user login endpoint."""
    print("\n🔹 Testing User Login...")
    
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "email": "testuser@dekoasistan.ai",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json()["access_token"]
        else:
            print("❌ Login failed!")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_current_user(token):
    """Test get current user endpoint."""
    print("\n🔹 Testing Get Current User...")
    
    url = f"{BASE_URL}/api/auth/me"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Get user info successful!")
        else:
            print("❌ Get user info failed!")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_health_check():
    """Test health check endpoint."""
    print("🔹 Testing Health Check...")
    
    # Health router is mounted without prefix, so it's at root "/"
    url = f"{BASE_URL}/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Health check successful!")
        else:
            print("❌ Health check failed!")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Run all tests."""
    print("🚀 Starting Authentication API Tests...")
    print("=" * 50)
    
    # Test health check first
    test_health_check()
    
    # Test registration
    user_data = test_user_registration()
    
    # Test login
    token = test_user_login()
    
    # Test authenticated endpoint
    if token:
        test_get_current_user(token)
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed!")

if __name__ == "__main__":
    main()
