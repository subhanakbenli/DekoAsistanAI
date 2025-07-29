#!/usr/bin/env python3
"""
Detailed Database Integration Test for Mood Board
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


async def test_detailed_database_integration():
    """Test detailed database integration for mood board functionality."""
    
    print("🔍 Detailed Database Integration Test for Mood Board...")
    
    async for db in get_async_session():
        try:
            # Test 1: Check specific design with mood board
            print("\n1️⃣ Checking specific design-mood board relationship...")
            
            # Get the mood board that was created
            result = await db.execute(select(MoodBoard))
            mood_boards = result.scalars().all()
            
            if mood_boards:
                mood_board = mood_boards[0]
                print(f"   🎨 Found Mood Board:")
                print(f"      ID: {mood_board.mood_board_id}")
                print(f"      Design ID: {mood_board.design_id}")
                print(f"      Image Path: {mood_board.image_path}")
                
                # Check if design exists with this ID
                if mood_board.design_id:
                    result = await db.execute(
                        select(Design).where(Design.id == mood_board.design_id)
                    )
                    design = result.scalar_one_or_none()
                    
                    if design:
                        print(f"   📋 Linked Design Found:")
                        print(f"      Design ID: {design.id}")
                        print(f"      Title: {design.title}")
                        print(f"      Mood Board ID in Design: {design.mood_board_id}")
                        
                        # Check if the link is correct
                        if design.mood_board_id == mood_board.mood_board_id:
                            print("   ✅ Link is correct!")
                        else:
                            print("   ❌ Link is broken!")
                            print(f"      Expected: {mood_board.mood_board_id}")
                            print(f"      Found: {design.mood_board_id}")
                    else:
                        print(f"   ❌ Design with ID {mood_board.design_id} not found!")
                        
            # Test 2: Check all designs with their mood board status
            print("\n2️⃣ Checking all designs with mood board status...")
            result = await db.execute(select(Design).order_by(Design.created_at.desc()))
            designs = result.scalars().all()
            
            for design in designs:
                mood_board_status = "✅ Has mood board" if design.mood_board_id else "❌ No mood board"
                print(f"   📋 {design.title[:30]}... - {mood_board_status}")
                if design.mood_board_id:
                    print(f"      Mood Board ID: {design.mood_board_id}")
            
            # Test 3: Check mood board files
            print("\n3️⃣ Checking mood board files...")
            mood_boards_dir = "data/mood_boards"
            if os.path.exists(mood_boards_dir):
                files = [f for f in os.listdir(mood_boards_dir) if f.endswith('.png')]
                print(f"   📁 Found {len(files)} mood board files:")
                for file in files[-3:]:  # Show last 3 files
                    file_path = os.path.join(mood_boards_dir, file)
                    file_size = os.path.getsize(file_path)
                    print(f"      📄 {file} ({file_size} bytes)")
            else:
                print("   ❌ Mood boards directory not found!")
            
            print("\n✅ Detailed database integration test completed!")
            
        except Exception as e:
            print(f"\n❌ Detailed database test failed: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            await db.close()


if __name__ == "__main__":
    asyncio.run(test_detailed_database_integration())
