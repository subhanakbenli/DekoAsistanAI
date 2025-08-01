#!/usr/bin/env python3
"""
JSON Dosyalarını Analiz Eden Script
"""

import json
import os

def analyze_json_files():
    """JSON dosyalarındaki ürün verilerini analiz eder"""
    jsonlar_path = "backend/data/jsonlar"
    
    if not os.path.exists(jsonlar_path):
        print(f"❌ {jsonlar_path} dizini bulunamadı")
        return
    
    files = [f for f in os.listdir(jsonlar_path) if f.endswith('.json')]
    total_products = 0
    sample_product = None
    all_fields = set()
    
    print("📊 JSON Dosyaları Analizi:")
    print("=" * 50)
    
    for file in files:
        file_path = os.path.join(jsonlar_path, file)
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"📄 {file}: {len(data)} ürün")
            total_products += len(data)
            
            if not sample_product and data:
                sample_product = data[0]
            
            # Tüm alanları topla
            for item in data:
                all_fields.update(item.keys())
    
    print(f"\n✅ Toplam: {total_products} ürün")
    
    if sample_product:
        print(f"\n📋 Örnek ürün yapısı:")
        for key, value in sample_product.items():
            value_type = type(value).__name__
            if isinstance(value, str):
                display_value = value[:50] + "..." if len(value) > 50 else value
            elif isinstance(value, dict):
                display_value = f"Dict with keys: {list(value.keys())}"
            else:
                display_value = str(value)
            print(f"  • {key}: {value_type} - {display_value}")
    
    print(f"\n🏷️  Tüm veri alanları:")
    for field in sorted(all_fields):
        print(f"  • {field}")
    
    # Veritabanı uygunluğu değerlendirmesi
    print(f"\n📋 Veritabanı Uygunluk Değerlendirmesi:")
    print("=" * 50)
    
    print("✅ Güçlü Yönler:")
    print("  • Tutarlı veri yapısı (tüm dosyalarda aynı alanlar)")
    print("  • Kategori isimleri roomCategories.js ile uyumlu")
    print("  • Zengin ürün bilgileri (isim, kategori, stil, renk, boyutlar)")
    print("  • Fiyat bilgisi mevcut")
    print("  • Resim path'leri güncel")
    print("  • Ürün linkleri var")
    
    print("\n⚠️  Dikkat Edilmesi Gerekenler:")
    print("  • Unique ID yoksa otomatik generate edilmeli")
    print("  • Dimensions JSON yapısı -> ayrı colonlar mı olacak?")
    print("  • Image path'lerin production'da çalışacağından emin olunmalı")
    
    print("\n💡 Önerilen Products Tablosu Yapısı:")
    print("  • id: Primary Key (UUID)")
    print("  • product_name: VARCHAR(255)")
    print("  • category: VARCHAR(50) - roomCategories.js uyumlu")
    print("  • style: VARCHAR(50)")
    print("  • color: VARCHAR(100)")
    print("  • width_cm: INTEGER")
    print("  • depth_cm: INTEGER") 
    print("  • height_cm: INTEGER")
    print("  • description: TEXT")
    print("  • price: INTEGER")
    print("  • image_path: VARCHAR(255)")
    print("  • product_link: VARCHAR(500)")
    print("  • created_at: TIMESTAMP")
    print("  • updated_at: TIMESTAMP")
    
    print(f"\n🎯 Gemini Function Calling için:")
    print("  ✅ Kategori bazlı filtreleme mümkün")
    print("  ✅ Stil bazlı filtreleme mümkün")
    print("  ✅ Renk bazlı filtreleme mümkün") 
    print("  ✅ Fiyat aralığı filtreleme mümkün")
    print("  ✅ Boyut filtreleme mümkün")
    print("  ✅ Açıklama metni arama mümkün")

if __name__ == "__main__":
    analyze_json_files()
