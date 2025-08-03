#!/usr/bin/env python3
"""
backend/data/jsonlaryeni dizinindeki JSON dosyalarını PostgreSQL products tablosuna yükleyen script
"""

import json
import uuid
import os
from pathlib import Path
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, Text, DateTime, Float, text
from sqlalchemy.sql import func
from config.settings import settings

# Sync database URL oluştur  
DATABASE_URL = f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

# Dizin yolları
JSONLAR_DIR = Path("data/jsonlaryeni")
PRODUCTS_DIR = Path("data/products")

# Product tablosunu tanımla (modeller arası bağımlılığı önlemek için)
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
    """backend/data/jsonlaryeni dizinindeki JSON dosyalarını veritabanına yükler"""
    
    # Veritabanı bağlantısı
    engine = create_engine(DATABASE_URL)
    
    # Products tablosunu oluştur (eğer yoksa)
    metadata.create_all(bind=engine, checkfirst=True)
    
    # Session oluştur
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # JSON dosyalarını listele
        json_files = list(JSONLAR_DIR.glob("*.json"))
        
        if not json_files:
            print(f"❌ {JSONLAR_DIR} dizininde JSON dosyası bulunamadı!")
            return
        
        print("📦 backend/data/jsonlaryeni verilerini Products tablosuna yükleniyor...")
        print("=" * 70)
        
        total_loaded = 0
        total_skipped = 0
        file_summary = {}
        
        for json_file in json_files:
            print(f"\n📄 {json_file.name} işleniyor...")
            
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    products_data = json.load(f)
                
                loaded_count = 0
                skipped_count = 0
                
                for product_data in products_data:
                    try:
                        # UUID oluştur
                        product_id = str(uuid.uuid4())
                        
                        # Boyutları çıkar (dimensions dict'inden)
                        dimensions = product_data.get('dimensions', {})
                        if dimensions is None:
                            dimensions = {}  # None ise boş dict kullan
                        
                        width_cm = dimensions.get('width_cm') if isinstance(dimensions, dict) else None
                        depth_cm = dimensions.get('depth_cm') if isinstance(dimensions, dict) else None
                        height_cm = dimensions.get('height_cm') if isinstance(dimensions, dict) else None
                        
                        # Raw SQL insert kullan
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
                        print(f"      ❌ Hata: {product_data.get('product_name', 'Unknown')}: {e}")
                        skipped_count += 1
                        continue
                
                print(f"    ✅ {loaded_count} ürün eklendi, {skipped_count} atlandı")
                file_summary[json_file.name] = {
                    'loaded': loaded_count,
                    'skipped': skipped_count
                }
                total_loaded += loaded_count
                total_skipped += skipped_count
                
            except Exception as e:
                print(f"    ❌ Dosya okuma hatası: {e}")
                continue
        
        # Değişiklikleri kaydet
        session.commit()
        
        print(f"\n🎉 Başarıyla tamamlandı!")
        print(f"📊 Toplam {total_loaded} ürün veritabanına yüklendi")
        print(f"⚠️  Toplam {total_skipped} ürün atlandı (hata nedeniyle)")
        
        # Dosya bazında özet
        print(f"\n📋 Dosya bazında özet:")
        for filename, stats in file_summary.items():
            print(f"  • {filename}: {stats['loaded']} yüklendi, {stats['skipped']} atlandı")
        
        # Kontrol: Veritabanındaki toplam ürün sayısı
        result = session.execute(text("SELECT COUNT(*) FROM products")).fetchone()
        total_in_db = result[0] if result else 0
        print(f"\n📋 Veritabanındaki toplam ürün sayısı: {total_in_db}")
        
        # Kategori dağılımı
        print(f"\n📊 Kategori dağılımı:")
        category_result = session.execute(text("""
            SELECT category, COUNT(*) as count 
            FROM products 
            GROUP BY category 
            ORDER BY count DESC
        """)).fetchall()
        
        for category, count in category_result:
            print(f"  • {category}: {count} ürün")
            
    except Exception as e:
        print(f"❌ Genel hata: {e}")
        session.rollback()
        raise
    finally:
        session.close()

def verify_loaded_data():
    """Yüklenen verileri doğrular"""
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # Veritabanında ürün var mı kontrol et
        result = session.execute(text("SELECT COUNT(*) FROM products")).fetchone()
        total_products = result[0] if result else 0
        
        if total_products == 0:
            print(f"\n❌ Veritabanında ürün bulunamadı. Önce verileri yükleyin.")
            return
            
        print(f"\n🔍 Veri doğrulama:")
        print("=" * 30)
        
        # Örnek ürünler
        sample_result = session.execute(text("""
            SELECT product_name, category, style, color, width_cm, depth_cm, height_cm, product_link
            FROM products 
            LIMIT 5
        """)).fetchall()
        
        for row in sample_result:
            product_name, category, style, color, width_cm, depth_cm, height_cm, product_link = row
            print(f"\n📦 {product_name}")
            print(f"   Kategori: {category}")
            print(f"   Stil: {style}")
            print(f"   Renk: {color}")
            print(f"   Boyutlar: {width_cm}x{depth_cm}x{height_cm} cm")
            print(f"   Link: {product_link}")
        
        # Stil dağılımı
        print(f"\n🎨 Stil dağılımı:")
        style_result = session.execute(text("""
            SELECT style, COUNT(*) as count 
            FROM products 
            GROUP BY style 
            ORDER BY count DESC
        """)).fetchall()
        
        for style, count in style_result:
            print(f"  • {style}: {count} ürün")
        
        # Renk dağılımı (en popüler 10)
        print(f"\n🌈 En popüler renkler:")
        color_result = session.execute(text("""
            SELECT color, COUNT(*) as count 
            FROM products 
            GROUP BY color 
            ORDER BY count DESC 
            LIMIT 10
        """)).fetchall()
        
        for color, count in color_result:
            print(f"  • {color}: {count} ürün")
            
    except Exception as e:
        print(f"❌ Doğrulama hatası: {e}")
    finally:
        session.close()

def clear_products_table():
    """Products tablosunu temizler - DİKKAT: Tüm ürünler silinir!"""
    print("⚠️  DİKKAT: Bu işlem products tablosundaki TÜM verileri silecek!")
    choice = input("Devam etmek istiyorsanız 'EVET' yazın: ")
    
    if choice != 'EVET':
        print("İşlem iptal edildi.")
        return
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # Önce mevcut sayıyı al
        result = session.execute(text("SELECT COUNT(*) FROM products")).fetchone()
        deleted_count = result[0] if result else 0
        
        # Tüm ürünleri sil
        session.execute(text("DELETE FROM products"))
        session.commit()
        
        print(f"🗑️  {deleted_count} ürün silindi.")
        
    except Exception as e:
        print(f"❌ Silme hatası: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    print("🏠 DekoAsistanAI - jsonlaryeni -> Products Veritabanı Yükleme Script'i")
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
        
        print(f"\n✅ Başarıyla tamamlandı!")
        print(f"\n💡 Notlar:")
        print(f"   • Fiyat alanları JSON dosyalarından alındı")
        print(f"   • Resim yolları JSON dosyalarından alındı") 
        print(f"   • Resimler data/products/kategori/ dizinlerinde bulunuyor")
        print(f"   • Tabloyu temizlemek için: python load_dataset.py --clear")
        print(f"   • Sadece doğrulama için: python load_dataset.py --verify")
        
    except KeyboardInterrupt:
        print(f"\n⏹️  İşlem kullanıcı tarafından durduruldu.")
    except Exception as e:
        print(f"\n❌ Beklenmeyen hata: {e}")
        raise
