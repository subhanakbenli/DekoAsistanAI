#!/usr/bin/env python3
"""
Test script for the new image generation endpoint
"""

import requests
import json
import time

# Test endpoint URL
URL = "http://127.0.0.1:8000/api/test-image-generation"

def test_image_generation(prompt):
    """Test the image generation endpoint with a given prompt"""
    
    print(f"🧪 Testing image generation with prompt: '{prompt}'")
    print("⏳ Sending request...")
    
    # Prepare form data
    data = {
        'prompt': prompt
    }
    
    try:
        # Send POST request
        start_time = time.time()
        response = requests.post(URL, data=data)
        end_time = time.time()
        
        request_time = round(end_time - start_time, 2)
        
        print(f"📡 Request completed in {request_time} seconds")
        print(f"🔄 HTTP Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Response received:")
            print(f"   Success: {result.get('success')}")
            print(f"   Message: {result.get('message')}")
            print(f"   Execution Time: {result.get('execution_time_seconds')} seconds")
            print(f"   Model Used: {result.get('model_used')}")
            print(f"   Image Saved To: {result.get('image_saved_to')}")
            print(f"   Image Base64 Length: {len(result.get('image_base64', ''))} characters")
            
            return result
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"💥 Exception occurred: {str(e)}")
        return None

if __name__ == "__main__":
    # Test prompts
    test_prompts = [
        "Modern living room with minimalist design, clean lines, neutral colors",
        "Cozy bedroom with warm lighting, wooden furniture, vintage decor",
        "Professional kitchen interior with marble countertops, stainless steel appliances"
    ]
    
    print("🚀 Starting Image Generation Tests")
    print("=" * 60)
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n📋 Test {i}/{len(test_prompts)}")
        print("-" * 40)
        
        result = test_image_generation(prompt)
        
        if result:
            print("✅ Test completed successfully")
        else:
            print("❌ Test failed")
        
        # Wait between tests
        if i < len(test_prompts):
            print("⏳ Waiting 2 seconds before next test...")
            time.sleep(2)
    
    print("\n" + "=" * 60)
    print("🏁 All tests completed!")
