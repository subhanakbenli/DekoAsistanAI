"""
Database data reset script.
This script deletes the data in all database tables but keeps the table structures.
The alembic_version table is preserved.
"""
import asyncio
import sys
from sqlalchemy import text
from config.database import engine
from config.settings import settings

async def reset_database_data():
    """Delete all data in the database (except alembic_version)."""
    
    print("🚨 WARNING: This will delete ALL DATA in the database!")
    print("Only the table structures will be kept. The alembic_version table will not be touched.")
    print(f"Target database: {settings.DB_NAME}")
    print("-" * 50)
    
    # Ask the user for confirmation
    confirm = input("Are you sure you want to continue? (type YES): ")
    if confirm != "YES":
        print("Operation cancelled.")
        return
    
    try:
        async with engine.begin() as conn:
            print("🔍 Checking existing tables...")
            
            # List all tables (except alembic_version)
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                AND table_name != 'alembic_version'
                ORDER BY table_name;
            """))
            
            tables = [row[0] for row in result.fetchall()]
            
            if not tables:
                print("❌ No tables found to delete.")
                return
                
            print(f"📋 Tables to be cleared ({len(tables)}):")
            for table in tables:
                print(f"  - {table}")
            
            print("\n" + "="*50)
            final_confirm = input("Are you sure you want to delete ALL DATA in these tables? (type YES): ")
            if final_confirm != "YES":
                print("Operation cancelled.")
                return
            
            print("\n🗑️  Starting data deletion...")
            
            # Order tables by foreign key dependencies (child -> parent)
            # Deleting in this order avoids foreign key constraint violations
            table_order = [
                'blog_post_likes',      # depends on blog_posts
                'blog_posts',           # depends on designs
                'design_hashtags',      # depends on designs
                'user_favorite_designs', # depends on users and designs
                'user_favorite_products', # depends on users (designs optional)
                'mood_boards',          # depends on users and designs
                'designs',              # depends on users
                'user_profiles',        # depends on users
                'products',             # Independent
                'hashtags',             # Independent
                'users'                 # Last
            ]
            
            # Process only existing tables, in order
            ordered_tables = [t for t in table_order if t in tables]
            # Also add tables not in the list
            remaining_tables = [t for t in tables if t not in table_order]
            all_tables_ordered = ordered_tables + remaining_tables
            
            # Clear each table
            deleted_counts = {}
            for table in all_tables_ordered:
                try:
                    # First get the current record count
                    count_result = await conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    initial_count = count_result.scalar()
                    
                    if initial_count > 0:
                        # Delete all data
                        await conn.execute(text(f"DELETE FROM {table}"))
                        deleted_counts[table] = initial_count
                        print(f"  ✅ {table}: {initial_count} records deleted")
                    else:
                        print(f"  ⚪ {table}: Already empty")
                        
                except Exception as e:
                    print(f"  ❌ {table}: Error - {str(e)}")
            
            # Reset sequences (for AUTO_INCREMENT IDs)
            print("\n🔢 Resetting ID sequences...")
            for table in all_tables_ordered:
                try:
                    # Check whether this table has a serial/identity column
                    seq_result = await conn.execute(text(f"""
                        SELECT column_name
                        FROM information_schema.columns 
                        WHERE table_name = '{table}' 
                        AND column_default LIKE 'nextval%'
                    """))
                    
                    seq_columns = [row[0] for row in seq_result.fetchall()]
                    
                    for col in seq_columns:
                        # Find the sequence name and reset it
                        await conn.execute(text(f"""
                            SELECT setval(pg_get_serial_sequence('{table}', '{col}'), 1, false)
                        """))
                        print(f"  ✅ {table}.{col} sequence reset")
                        
                except Exception as e:
                    print(f"  ⚠️  {table} sequence reset: {str(e)}")
            
            print("\n" + "="*50)
            print("✅ DATABASE CLEANUP COMPLETED!")
            print(f"🔢 Total records deleted: {sum(deleted_counts.values())}")
            
            if deleted_counts:
                print("\n📊 Detailed report:")
                for table, count in deleted_counts.items():
                    print(f"  - {table}: {count} records")
            
            print("\n💡 The alembic_version table was preserved.")
            print("💡 Table structures were not changed.")
            print("💡 ID sequences were reset to start from 1.")
            
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")
        return False
    
    return True

async def verify_reset():
    """Verify the cleanup."""
    print("\n🔍 Verifying cleanup...")
    
    try:
        async with engine.begin() as conn:
            # Check all tables
            result = await conn.execute(text("""
                SELECT 
                    table_name,
                    (SELECT COUNT(*) FROM information_schema.tables t2 WHERE t2.table_name = t1.table_name) as exists,
                    CASE 
                        WHEN table_name = 'alembic_version' THEN 'PRESERVED'
                        ELSE 'CLEARED'
                    END as status
                FROM information_schema.tables t1
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """))
            
            tables = result.fetchall()
            
            print("📋 Table statuses:")
            for table_name, exists, status in tables:
                if table_name == 'alembic_version':
                    # Check the alembic_version record count
                    count_result = await conn.execute(text("SELECT COUNT(*) FROM alembic_version"))
                    count = count_result.scalar()
                    print(f"  ✅ {table_name}: {status} ({count} records)")
                else:
                    # Check the record count of the other tables
                    count_result = await conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                    count = count_result.scalar()
                    if count == 0:
                        print(f"  ✅ {table_name}: EMPTY (0 records)")
                    else:
                        print(f"  ⚠️  {table_name}: {count} records (unexpected!)")
            
    except Exception as e:
        print(f"❌ Verification error: {str(e)}")

if __name__ == "__main__":
    print("🗃️  DekoAsistanAI - Database Data Cleanup")
    print("=" * 50)
    
    # Run the main operation
    success = asyncio.run(reset_database_data())
    
    if success:
        # Run verification
        asyncio.run(verify_reset())
        print("\n🎉 Operation completed successfully!")
    else:
        print("\n💥 Operation failed!")
        sys.exit(1)
