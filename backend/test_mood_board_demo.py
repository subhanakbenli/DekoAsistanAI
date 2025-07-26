"""
Demo test script for Mood Board WebSocket functionality.
Run this script to test the complete mood board generation flow.
"""

import asyncio
import websockets
import json
import requests
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000"
WEBSOCKET_URL = "ws://localhost:8000/api/ws"

async def test_mood_board_flow():
    """
    Test complete mood board generation flow with WebSocket.
    """
    
    print("🚀 Starting Mood Board WebSocket Test")
    print("="*50)
    
    connection_id = None
    
    try:
        # Step 1: Connect to WebSocket
        print("📡 Connecting to WebSocket...")
        async with websockets.connect(WEBSOCKET_URL) as websocket:
            
            # Wait for connection confirmation
            connection_message = await websocket.recv()
            connection_data = json.loads(connection_message)
            
            if connection_data["type"] == "connection_established":
                connection_id = connection_data["connection_id"]
                print(f"✅ WebSocket connected: {connection_id}")
            else:
                print("❌ WebSocket connection failed")
                return
            
            # Step 2: Send design request with connection_id
            print("\n🎨 Sending design request...")
            
            design_data = {
                "room_type": "Living Room",
                "design_style": "Modern",
                "notes": "I want a cozy and comfortable space with warm colors",
                "connection_id": connection_id
            }
            
            # Send POST request to design endpoint
            response = requests.post(
                f"{BACKEND_URL}/api/test",
                data=design_data
            )
            
            if response.status_code == 200:
                design_result = response.json()
                print(f"✅ Design request successful:")
                print(f"   Title: {design_result['design_title']}")
                print(f"   Message: {design_result['message']}")
            else:
                print(f"❌ Design request failed: {response.status_code}")
                return
            
            # Step 3: Listen for mood board progress updates
            print(f"\n📊 Listening for mood board progress updates...")
            
            progress_stages = []
            
            while True:
                try:
                    # Wait for WebSocket messages with timeout
                    message = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                    data = json.loads(message)
                    
                    print(f"📨 Received: {data['type']}")
                    
                    if data["type"] == "mood_board_progress":
                        progress = data["progress"]
                        stage = progress.get("stage", "unknown")
                        percentage = progress.get("progress_percentage", 0)
                        message_text = progress.get("message", "")
                        
                        progress_stages.append(stage)
                        print(f"   🔄 Stage: {stage} ({percentage}%) - {message_text}")
                        
                    elif data["type"] == "mood_board_completed":
                        mood_board = data["mood_board"]
                        print(f"   ✅ Mood board completed!")
                        print(f"   📋 ID: {mood_board['mood_board_id']}")
                        print(f"   🖼️  Image data: {'Yes' if mood_board['image_data']['base64'] else 'No'}")
                        print(f"   📝 Prompt: {mood_board['prompt_used'][:100]}...")
                        break
                        
                    elif data["type"] == "mood_board_error":
                        print(f"   ❌ Mood board error: {data['error']}")
                        break
                        
                except asyncio.TimeoutError:
                    print("⏰ Timeout waiting for mood board completion")
                    break
            
            # Step 4: Test mood board history endpoints
            print(f"\n📚 Testing mood board history endpoints...")
            
            # Get mood board history
            history_response = requests.get(f"{BACKEND_URL}/api/mood-board/history")
            if history_response.status_code == 200:
                history_data = history_response.json()
                print(f"✅ History retrieved: {history_data['count']} entries")
            else:
                print(f"❌ History request failed: {history_response.status_code}")
            
            # Get mood board stats
            stats_response = requests.get(f"{BACKEND_URL}/api/mood-board/stats")
            if stats_response.status_code == 200:
                stats_data = stats_response.json()
                print(f"✅ Stats retrieved: {stats_data['data']['total_mood_boards']} total mood boards")
            else:
                print(f"❌ Stats request failed: {stats_response.status_code}")
            
            print(f"\n🎉 Test completed successfully!")
            print(f"📊 Progress stages: {' → '.join(progress_stages)}")
            
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
    
    print("="*50)


def test_websocket_stats():
    """
    Test WebSocket statistics endpoint.
    """
    
    print("📊 Testing WebSocket stats...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/ws/stats")
        
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ WebSocket Stats:")
            print(f"   Active connections: {stats['data']['active_connections']}")
            print(f"   Connection IDs: {stats['data']['connection_ids']}")
        else:
            print(f"❌ WebSocket stats request failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ WebSocket stats test failed: {str(e)}")


if __name__ == "__main__":
    print("🧪 Mood Board WebSocket Demo Test")
    print("="*50)
    print("Make sure the backend server is running on http://localhost:8000")
    print("="*50)
    
    # Test WebSocket stats first
    test_websocket_stats()
    print()
    
    # Run main mood board test
    asyncio.run(test_mood_board_flow())
