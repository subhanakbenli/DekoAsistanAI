#!/usr/bin/env python3
"""
Script that loads the JSON files in the backend/data/jsonlaryeni directory into the PostgreSQL products table
"""

import json
import uuid
import os
from pathlib import Path
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, Text, DateTime, Float, text
from sqlalchemy.sql import func
from config.settings import settings

# Build the sync database URL  
DATABASE_URL = f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

# Directory paths
JSONLAR_DIR = Path("data/jsonlaryeni")
PRODUCTS_DIR = Path("data/products")

# Define the products table (to avoid cross-model dependencies)
metadata = MetaData()

products_table = Table(
    'products', metadata,
    Column('id', String(36), primary_key=True),
    Column('product_name', String(255), nullable=False),
    Column('category', String(50), nullable=False),
    Column('style', String(50), nullable=False),
    Column('color', String(100), nullable=False),
    Column('width_cm', Integer, nullable=True),
    Column('depth_cm', Integer, nullable=True),
    Column('height_cm', Integer, nullable=True),
    Column('description', Text, nullable=False),
    Column('price', Integer, nullable=False),
    Column('image_path', String(255), nullable=True),
    Column('product_link', String(500), nullable=True),
    Column('created_at', DateTime(timezone=True), server_default=func.now()),
    Column('updated_at', DateTime(timezone=True), nullable=True),
)

def load_jsonlaryeni_to_products():
    """Load the JSON files in the backend/data/jsonlaryeni directory into the database"""
    
    # Database connection
    engine = create_engine(DATABASE_URL)
    
    # Create the products table (if it does not exist)
    metadata.create_all(bind=engine, checkfirst=True)
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # List the JSON files
        json_files = list(JSONLAR_DIR.glob("*.json"))
        
        if not json_files:
            print(f"❌ No JSON files found in the {JSONLAR_DIR} directory!")
            return
        
        print("📦 Loading backend/data/jsonlaryeni data into the Products table...")
        print("=" * 70)
        
        total_loaded = 0
        total_skipped = 0
        file_summary = {}
        
        for json_file in json_files:
            print(f"\n📄 Processing {json_file.name}...")
            
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    products_data = json.load(f)
                
                loaded_count = 0
                skipped_count = 0
                
                for product_data in products_data:
                    try:
                        # Generate UUID
                        product_id = str(uuid.uuid4())
                        
                        # Extract dimensions (from the dimensions dict)
                        dimensions = product_data.get('dimensions', {})
                        if dimensions is None:
                            dimensions = {}  # Use an empty dict if None
                        
                        width_cm = dimensions.get('width_cm') if isinstance(dimensions, dict) else None
                        depth_cm = dimensions.get('depth_cm') if isinstance(dimensions, dict) else None
                        height_cm = dimensions.get('height_cm') if isinstance(dimensions, dict) else None
                        
                        # Use a raw SQL insert
                        insert_query = products_table.insert().values(
                            id=product_id,
                            product_name=product_data['product_name'],
                            category=product_data['category'], 
                            style=product_data['style'],
                            color=product_data['color'],
                            width_cm=width_cm,
                            depth_cm=depth_cm,
                            height_cm=height_cm,
                            description=product_data['description'],
                            price=product_data['price'],
                            image_path=product_data.get('image_path'),
                            product_link=product_data.get('product_link')
                        )
                        
                        session.execute(insert_query)
                        loaded_count += 1
                        
                    except Exception as e:
                        print(f"      ❌ Error: {product_data.get('product_name', 'Unknown')}: {e}")
                        skipped_count += 1
                        continue
                
                print(f"    ✅ {loaded_count} products added, {skipped_count} skipped")
                file_summary[json_file.name] = {
                    'loaded': loaded_count,
                    'skipped': skipped_count
                }
                total_loaded += loaded_count
                total_skipped += skipped_count
                
            except Exception as e:
                print(f"    ❌ File read error: {e}")
                continue
        
        # Commit changes
        session.commit()
        
        print(f"\n🎉 Completed successfully!")
        print(f"📊 {total_loaded} products loaded into the database in total")
        print(f"⚠️  {total_skipped} products skipped in total (due to errors)")
        
        # Per-file summary
        print(f"\n📋 Per-file summary:")
        for filename, stats in file_summary.items():
            print(f"  • {filename}: {stats['loaded']} loaded, {stats['skipped']} skipped")
        
        # Check: total number of products in the database
        result = session.execute(text("SELECT COUNT(*) FROM products")).fetchone()
        total_in_db = result[0] if result else 0
        print(f"\n📋 Total number of products in the database: {total_in_db}")
        
        # Category distribution
        print(f"\n📊 Category distribution:")
        category_result = session.execute(text("""
            SELECT category, COUNT(*) as count 
            FROM products 
            GROUP BY category 
            ORDER BY count DESC
        """)).fetchall()
        
        for category, count in category_result:
            print(f"  • {category}: {count} products")
            
    except Exception as e:
        print(f"❌ General error: {e}")
        session.rollback()
        raise
    finally:
        session.close()

def verify_loaded_data():
    """Verify the loaded data"""
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # Check whether there are products in the database
        result = session.execute(text("SELECT COUNT(*) FROM products")).fetchone()
        total_products = result[0] if result else 0
        
        if total_products == 0:
            print(f"\n❌ No products found in the database. Load the data first.")
            return
            
        print(f"\n🔍 Data verification:")
        print("=" * 30)
        
        # Sample products
        sample_result = session.execute(text("""
            SELECT product_name, category, style, color, width_cm, depth_cm, height_cm, product_link
            FROM products 
            LIMIT 5
        """)).fetchall()
        
        for row in sample_result:
            product_name, category, style, color, width_cm, depth_cm, height_cm, product_link = row
            print(f"\n📦 {product_name}")
            print(f"   Category: {category}")
            print(f"   Style: {style}")
            print(f"   Color: {color}")
            print(f"   Dimensions: {width_cm}x{depth_cm}x{height_cm} cm")
            print(f"   Link: {product_link}")
        
        # Style distribution
        print(f"\n🎨 Style distribution:")
        style_result = session.execute(text("""
            SELECT style, COUNT(*) as count 
            FROM products 
            GROUP BY style 
            ORDER BY count DESC
        """)).fetchall()
        
        for style, count in style_result:
            print(f"  • {style}: {count} products")
        
        # Color distribution (top 10)
        print(f"\n🌈 Most popular colors:")
        color_result = session.execute(text("""
            SELECT color, COUNT(*) as count 
            FROM products 
            GROUP BY color 
            ORDER BY count DESC 
            LIMIT 10
        """)).fetchall()
        
        for color, count in color_result:
            print(f"  • {color}: {count} products")
            
    except Exception as e:
        print(f"❌ Verification error: {e}")
    finally:
        session.close()

def clear_products_table():
    """Clear the products table - WARNING: all products are deleted!"""
    print("⚠️  WARNING: This will delete ALL data in the products table!")
    choice = input("Type 'YES' if you want to continue: ")
    
    if choice != 'YES':
        print("Operation cancelled.")
        return
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # First get the current count
        result = session.execute(text("SELECT COUNT(*) FROM products")).fetchone()
        deleted_count = result[0] if result else 0
        
        # Delete all products
        session.execute(text("DELETE FROM products"))
        session.commit()
        
        print(f"🗑️  {deleted_count} products deleted.")
        
    except Exception as e:
        print(f"❌ Delete error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    print("🏠 DekoAsistanAI - jsonlaryeni -> Products Database Loading Script")
    print("=" * 75)
    
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--clear":
            clear_products_table()
            sys.exit(0)
        elif sys.argv[1] == "--verify":
            verify_loaded_data()
            sys.exit(0)
    
    try:
        load_jsonlaryeni_to_products()
        verify_loaded_data()
        
        print(f"\n✅ Completed successfully!")
        print(f"\n💡 Notes:")
        print(f"   • Price fields were taken from the JSON files")
        print(f"   • Image paths were taken from the JSON files") 
        print(f"   • Images are located in the data/products/<category>/ directories")
        print(f"   • To clear the table: python load_dataset.py --clear")
        print(f"   • To verify only: python load_dataset.py --verify")
        
    except KeyboardInterrupt:
        print(f"\n⏹️  Operation stopped by the user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        raise
