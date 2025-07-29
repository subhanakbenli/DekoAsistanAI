import asyncio
import httpx
import json

async def test_favorites_security():
    """Test favorites endpoint security."""
    print("🔒 Testing favorites endpoint security...")
    
    base_url = "http://127.0.0.1:8000"
    
    # Test without authentication
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{base_url}/favorites/my-favorites")
            print(f"❌ No auth test: {response.status_code}")
            if response.status_code == 401:
                print("✅ GOOD: Unauthenticated access blocked")
            else:
                print("⚠️ WARNING: Should require authentication")
        except Exception as e:
            print(f"Connection failed: {e}")
            print("💡 Make sure backend server is running")

if __name__ == "__main__":
    asyncio.run(test_favorites_security())
