#!/usr/bin/env python3
"""
Sadece Products Tablosu İçin Basit Yükleme Script'i
"""

import json
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

# Database konfigürasyonu
from config.settings import settings

# Sync database URL oluştur
DATABASE_URL = f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

Base = declarative_base()

class Product(Base):
    """Products table for Gemini function calling."""
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True, index=True)  # UUID string
    
    # Product information
    product_name = Column(String(255), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # roomCategories.js uyumlu
    style = Column(String(50), nullable=False, index=True)
    color = Column(String(100), nullable=False, index=True)
    
    # Dimensions
    width_cm = Column(Integer, nullable=True, index=True)
    depth_cm = Column(Integer, nullable=True, index=True) 
    height_cm = Column(Integer, nullable=True, index=True)
    
    # Details
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False, index=True)  # Price in kuruş or cents
    
    # Links and media
    image_path = Column(String(255), nullable=True)
    product_link = Column(String(500), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Indexes for better search performance
    __table_args__ = (
        Index('idx_products_category_style', 'category', 'style'),
        Index('idx_products_price_range', 'price'),
        Index('idx_products_dimensions', 'width_cm', 'depth_cm', 'height_cm'),
    )
    
    def __repr__(self):
        return f"<Product(id={self.id}, name={self.product_name}, category={self.category})>"

def load_products_to_database():
    """JSON dosyalarından ürünleri veritabanına yükler"""
    
    # Veritabanı bağlantısı
    engine = create_engine(DATABASE_URL)
    
    # Tabloları oluştur (eğer yoksa)
    Base.metadata.create_all(bind=engine)
    
    # Session oluştur
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        jsonlar_path = "data/jsonlar"
        json_files = [f for f in os.listdir(jsonlar_path) if f.endswith('.json')]
        
        total_loaded = 0
        
        print("📦 JSON verilerini Products tablosuna yükleniyor...")
        print("=" * 60)
        
        for filename in json_files:
            file_path = os.path.join(jsonlar_path, filename)
            print(f"\n📄 {filename} işleniyor...")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                products_data = json.load(f)
            
            loaded_count = 0
            for product_data in products_data:
                try:
                    # UUID oluştur
                    product_id = str(uuid.uuid4())
                    
                    # Dimensions dict'inden değerleri çıkar
                    dimensions = product_data.get('dimensions', {})
                    
                    # Product objesi oluştur
                    product = Product(
                        id=product_id,
                        product_name=product_data['product_name'],
                        category=product_data['category'],
                        style=product_data['style'],
                        color=product_data['color'],
                        width_cm=dimensions.get('width_cm'),
                        depth_cm=dimensions.get('depth_cm'),
                        height_cm=dimensions.get('height_cm'),
                        description=product_data['description'],
                        price=product_data['price'],
                        image_path=product_data.get('image_path'),
                        product_link=product_data.get('product_link')
                    )
                    
                    session.add(product)
                    loaded_count += 1
                    
                except Exception as e:
                    print(f"    ❌ Hata: {product_data.get('product_name', 'Unknown')}: {e}")
                    continue
            
            print(f"    ✅ {loaded_count} ürün eklendi")
            total_loaded += loaded_count
        
        # Değişiklikleri kaydet
        session.commit()
        
        print(f"\n🎉 Başarıyla tamamlandı!")
        print(f"📊 Toplam {total_loaded} ürün veritabanına yüklendi")
        
        # Kontrol: Veritabanındaki toplam ürün sayısı
        total_in_db = session.query(Product).count()
        print(f"📋 Veritabanındaki toplam ürün sayısı: {total_in_db}")
        
        # Kategori dağılımı
        print(f"\n📊 Kategori dağılımı:")
        from sqlalchemy import func
        category_counts = session.query(
            Product.category, 
            func.count(Product.id)
        ).group_by(Product.category).all()
        
        for category, count in category_counts:
            print(f"  • {category}: {count} ürün")
            
    except Exception as e:
        print(f"❌ Genel hata: {e}")
        session.rollback()
    finally:
        session.close()

def verify_data():
    """Yüklenen verileri doğrular"""
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        print(f"\n🔍 Veri doğrulama:")
        print("=" * 30)
        
        # Örnek ürünler
        sample_products = session.query(Product).limit(3).all()
        
        for product in sample_products:
            print(f"\n📦 {product.product_name}")
            print(f"   Kategori: {product.category}")
            print(f"   Stil: {product.style}")
            print(f"   Renk: {product.color}")
            print(f"   Boyutlar: {product.width_cm}x{product.depth_cm}x{product.height_cm} cm")
            print(f"   Fiyat: {product.price} TL")
            print(f"   Resim: {product.image_path}")
        
        # Gemini function calling için test sorguları
        print(f"\n🤖 Gemini Function Calling Test Sorguları:")
        print("=" * 50)
        
        # Kategori bazlı filtreleme
        koltuk_count = session.query(Product).filter(Product.category == 'koltuk').count()
        print(f"  • Koltuk kategorisinde {koltuk_count} ürün")
        
        # Fiyat aralığı
        affordable_count = session.query(Product).filter(Product.price <= 10000).count()
        print(f"  • 10.000 TL altında {affordable_count} ürün")
        
        # Stil filtreleme
        modern_count = session.query(Product).filter(Product.style == 'Modern').count()
        print(f"  • Modern stilinde {modern_count} ürün")
        
        # Boyut filtreleme örneği
        compact_count = session.query(Product).filter(
            Product.width_cm <= 150,
            Product.depth_cm <= 80
        ).count()
        print(f"  • Kompakt boyutlarda (≤150x80cm) {compact_count} ürün")
        
    except Exception as e:
        print(f"❌ Doğrulama hatası: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    print("🏠 DekoAsistanAI - Products Veritabanı Yükleme Script'i (Basit)")
    print("=" * 65)
    
    load_products_to_database()
    verify_data()
    
    print(f"\n✅ Products tablosu hazır! Gemini function calling için kullanılabilir.")
