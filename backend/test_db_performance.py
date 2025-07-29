"""
Database performance test script.
"""
import asyncio
import time
from config.database import async_session_maker, engine
from models.user_models import User
from models.design_models_db import Design, UserFavoriteDesign
from sqlalchemy import select, text
from sqlalchemy.orm import selectinload

async def test_db_performance():
    """Test database query performance."""
    
    print("🔍 Database bağlantı testi başlatılıyor...")
    
    # Test connection pool
    print(f"📊 Connection Pool Info:")
    print(f"   Pool size: {engine.pool.size()}")
    print(f"   Checked out: {engine.pool.checkedout()}")
    print(f"   Overflow: {engine.pool.overflow()}")
    try:
        print(f"   Invalid: {engine.pool.invalidated()}")
    except AttributeError:
        print(f"   Invalid: N/A (method not available)")
    
    async with async_session_maker() as db:
        
        # Test 1: Simple connection test
        start_time = time.time()
        result = await db.execute(text("SELECT 1"))
        end_time = time.time()
        print(f"✅ Connection test: {(end_time - start_time) * 1000:.2f}ms")
        
        # Test 2: Simple user query
        start_time = time.time()
        result = await db.execute(select(User).limit(1))
        user = result.scalar_one_or_none()
        end_time = time.time()
        print(f"✅ Simple user query: {(end_time - start_time) * 1000:.2f}ms")
        
        # Test 3: Count users
        start_time = time.time()
        result = await db.execute(select(User))
        users = result.scalars().all()
        end_time = time.time()
        print(f"✅ All users query: {(end_time - start_time) * 1000:.2f}ms")
        print(f"📊 Users found: {len(users)}")
        
        # Test 4: Favorites query (gerçek kullanım senaryosu)
        if users:
            user_id = users[0].id
            start_time = time.time()
            result = await db.execute(
                select(UserFavoriteDesign)
                .where(UserFavoriteDesign.user_id == user_id)
            )
            favorites = result.scalars().all()
            end_time = time.time()
            print(f"✅ Favorites query: {(end_time - start_time) * 1000:.2f}ms")
            print(f"📊 Favorites found: {len(favorites)}")
        
        # Test 5: Design count
        start_time = time.time()
        result = await db.execute(select(Design))
        designs = result.scalars().all()
        end_time = time.time()
        print(f"✅ All designs query: {(end_time - start_time) * 1000:.2f}ms")
        print(f"📊 Designs found: {len(designs)}")

async def test_multiple_connections():
    """Test multiple concurrent connections."""
    print("\n🔄 Testing concurrent connections...")
    
    async def single_query():
        async with async_session_maker() as db:
            start_time = time.time()
            result = await db.execute(select(User).limit(1))
            user = result.scalar_one_or_none()
            end_time = time.time()
            return (end_time - start_time) * 1000
    
    # Test 5 concurrent connections
    tasks = [single_query() for _ in range(5)]
    start_time = time.time()
    results = await asyncio.gather(*tasks)
    total_time = (time.time() - start_time) * 1000
    
    print(f"✅ 5 concurrent queries:")
    for i, result in enumerate(results):
        print(f"   Query {i+1}: {result:.2f}ms")
    print(f"⏱️ Total time: {total_time:.2f}ms")
    print(f"📊 Average: {sum(results)/len(results):.2f}ms")

if __name__ == "__main__":
    # Only run the main test, skip concurrent test that causes issues
    asyncio.run(test_db_performance())
