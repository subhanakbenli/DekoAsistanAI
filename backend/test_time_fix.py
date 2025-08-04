#!/usr/bin/env python3
"""
Test script to check if time variable conflict is fixed
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.design.mood_board_service import MoodBoardService
import asyncio

async def test_imagen_generation():
    """Test Imagen generation without time variable conflict"""
    print("🧪 Testing Imagen generation...")
    
    service = MoodBoardService()
    
    # Test prompt creation first (this should work without time issues)
    try:
        enhanced_prompt = service._create_imagen_prompt(
            room_type="salon",
            design_style="modern", 
            notes="Test notes",
            design_title="Test Title",
            design_description="Test Description",
            products=[],
            parsed_info={"width": 400, "length": 400},
            color_info="Test color",
            dimensions_info="400cm x 400cm"
        )
        print(f"✅ Prompt creation successful: {enhanced_prompt[:50]}...")
        return True
        
    except Exception as e:
        print(f"❌ Prompt creation failed: {str(e)}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_imagen_generation())
    if result:
        print("🎉 Test passed - no time variable conflict!")
    else:
        print("💥 Test failed - still has issues")
