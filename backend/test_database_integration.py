#!/usr/bin/env python3
"""
Database Integration Test for Mood Board
"""

import asyncio
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from config.database import get_async_session
from models.design_models_db import Design, MoodBoard


async def test_database_integration():
    """Test database integration for mood board functionality."""
    
    print("🔍 Testing Database Integration for Mood Board...")
    
    async for db in get_async_session():
        try:
            # Test 1: Check designs table
            print("\n1️⃣ Testing designs table...")
            result = await db.execute(select(Design).limit(5))
            designs = result.scalars().all()
            
            print(f"   ✅ Found {len(designs)} designs in database")
            
            for design in designs[:3]:  # Show first 3
                print(f"   📋 Design ID: {design.id}")
                print(f"      Title: {design.title}")
                print(f"      Mood Board ID: {design.mood_board_id}")
                print(f"      Created: {design.created_at}")
                print()
            
            # Test 2: Check mood_boards table
            print("2️⃣ Testing mood_boards table...")
            result = await db.execute(select(MoodBoard).limit(5))
            mood_boards = result.scalars().all()
            
            print(f"   ✅ Found {len(mood_boards)} mood boards in database")
            
            for mood_board in mood_boards[:3]:  # Show first 3
                print(f"   🎨 Mood Board ID: {mood_board.mood_board_id}")
                print(f"      Linked Design ID: {mood_board.design_id}")
                print(f"      Image Path: {mood_board.image_path}")
                print(f"      Created: {mood_board.created_at}")
                print()
            
            # Test 3: Check linked designs and mood boards
            print("3️⃣ Testing linked designs and mood boards...")
            result = await db.execute(
                select(Design, MoodBoard)
                .join(MoodBoard, Design.mood_board_id == MoodBoard.mood_board_id, isouter=True)
                .limit(5)
            )
            
            linked_data = result.all()
            print(f"   ✅ Found {len(linked_data)} design-moodboard links")
            
            linked_count = 0
            for design, mood_board in linked_data:
                if mood_board:
                    linked_count += 1
                    print(f"   🔗 Design '{design.title}' linked to mood board {mood_board.mood_board_id}")
            
            print(f"   📊 {linked_count} designs have mood boards")
            print(f"   📊 {len(linked_data) - linked_count} designs don't have mood boards yet")
            
            print("\n✅ Database integration test completed successfully!")
            
        except Exception as e:
            print(f"\n❌ Database test failed: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            await db.close()


if __name__ == "__main__":
    asyncio.run(test_database_integration())
