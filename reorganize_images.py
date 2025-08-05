#!/usr/bin/env python3
"""
Görsel Yeniden Düzenleme ve Boyutlandırma Script'i

Bu script şu işlemleri yapar:
1. products/ klasöründeki tüm alt dizinlerdeki görselleri products/size2000/ dizinine taşır
2. Bu görsellerin 400x400 boyutunda kopyalarını products/size400/ dizininde oluşturur
3. Orijinal klasör yapısını korur
"""

import os
import shutil
from PIL import Image
import glob
from pathlib import Path

def create_directories():
    """Gerekli dizinleri oluşturur"""
    base_path = Path("backend/data/products")
    size2000_path = base_path / "size2000"
    size400_path = base_path / "size400"
    
    # Ana dizinleri oluştur
    size2000_path.mkdir(exist_ok=True)
    size400_path.mkdir(exist_ok=True)
    
    print(f"✓ {size2000_path} dizini oluşturuldu")
    print(f"✓ {size400_path} dizini oluşturuldu")
    
    return size2000_path, size400_path

def get_product_categories():
    """Ürün kategorilerini listeler"""
    base_path = Path("backend/data/products")
    categories = []
    
    for item in base_path.iterdir():
        if item.is_dir() and item.name not in ['size2000', 'size400']:
            categories.append(item.name)
    
    return categories

def move_images_to_size2000(categories, size2000_path):
    """Tüm görselleri size2000 dizinine taşır"""
    base_path = Path("backend/data/products")
    moved_count = 0
    
    for category in categories:
        category_path = base_path / category
        target_category_path = size2000_path / category
        
        # Hedef kategori dizinini oluştur
        target_category_path.mkdir(exist_ok=True)
        
        # Bu kategorideki tüm jpg dosyalarını bul ve taşı
        for image_file in category_path.glob("*.jpg"):
            target_file = target_category_path / image_file.name
            
            try:
                shutil.move(str(image_file), str(target_file))
                moved_count += 1
                print(f"✓ Taşındı: {image_file.name} -> {target_file}")
            except Exception as e:
                print(f"✗ Hata: {image_file.name} taşınırken hata: {e}")
        
        # PNG dosyalarını da kontrol et
        for image_file in category_path.glob("*.png"):
            target_file = target_category_path / image_file.name
            
            try:
                shutil.move(str(image_file), str(target_file))
                moved_count += 1
                print(f"✓ Taşındı: {image_file.name} -> {target_file}")
            except Exception as e:
                print(f"✗ Hata: {image_file.name} taşınırken hata: {e}")
    
    print(f"\n✓ Toplam {moved_count} görsel size2000 dizinine taşındı")
    return moved_count

def resize_images_to_400x400(size2000_path, size400_path):
    """Size2000'deki görselleri 400x400 boyutunda size400'e kopyalar"""
    resized_count = 0
    error_count = 0
    
    # Size2000'deki tüm kategorileri gez
    for category_dir in size2000_path.iterdir():
        if category_dir.is_dir():
            # Size400'de karşılık gelen kategori dizinini oluştur
            target_category_path = size400_path / category_dir.name
            target_category_path.mkdir(exist_ok=True)
            
            # Bu kategorideki tüm görselleri işle
            for image_path in category_dir.glob("*"):
                if image_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                    target_path = target_category_path / image_path.name
                    
                    try:
                        # Görseli aç
                        with Image.open(image_path) as img:
                            # RGB moduna çevir (PNG'ler için)
                            if img.mode in ('RGBA', 'LA', 'P'):
                                img = img.convert('RGB')
                            
                            # 400x400 boyutuna yeniden boyutlandır
                            resized_img = img.resize((400, 400), Image.Resampling.LANCZOS)
                            
                            # Kaydet
                            resized_img.save(target_path, 'JPEG', quality=90)
                            resized_count += 1
                            print(f"✓ Boyutlandırıldı: {image_path.name} -> 400x400")
                    
                    except Exception as e:
                        error_count += 1
                        print(f"✗ Hata: {image_path.name} boyutlandırılırken hata: {e}")
    
    print(f"\n✓ Toplam {resized_count} görsel 400x400 boyutunda oluşturuldu")
    if error_count > 0:
        print(f"✗ {error_count} görselde hata oluştu")
    
    return resized_count, error_count

def cleanup_empty_directories():
    """Boş kalan eski kategori dizinlerini temizler"""
    base_path = Path("backend/data/products")
    removed_dirs = []
    
    for item in base_path.iterdir():
        if item.is_dir() and item.name not in ['size2000', 'size400']:
            try:
                # Eğer dizin boşsa sil
                if not any(item.iterdir()):
                    item.rmdir()
                    removed_dirs.append(item.name)
                    print(f"✓ Boş dizin silindi: {item.name}")
                else:
                    print(f"⚠ Dizin boş değil, silinmedi: {item.name}")
            except Exception as e:
                print(f"✗ Dizin silinirken hata: {item.name} - {e}")
    
    if removed_dirs:
        print(f"\n✓ {len(removed_dirs)} boş dizin temizlendi")
    else:
        print("\n• Temizlenecek boş dizin bulunamadı")

def main():
    """Ana fonksiyon"""
    print("🚀 Görsel Yeniden Düzenleme İşlemi Başlıyor...")
    print("=" * 50)
    
    try:
        # 1. Gerekli dizinleri oluştur
        print("\n📁 1. Hedef dizinleri oluşturuluyor...")
        size2000_path, size400_path = create_directories()
        
        # 2. Mevcut kategorileri listele
        print("\n📋 2. Ürün kategorileri listeleniyor...")
        categories = get_product_categories()
        print(f"✓ {len(categories)} kategori bulundu: {', '.join(categories)}")
        
        # 3. Görselleri size2000'e taşı
        print("\n📦 3. Görseller size2000 dizinine taşınıyor...")
        moved_count = move_images_to_size2000(categories, size2000_path)
        
        # 4. Görselleri 400x400 boyutunda size400'e kopyala
        print("\n🖼️ 4. Görseller 400x400 boyutunda oluşturuluyor...")
        resized_count, error_count = resize_images_to_400x400(size2000_path, size400_path)
        
        # 5. Boş dizinleri temizle
        print("\n🧹 5. Boş dizinler temizleniyor...")
        cleanup_empty_directories()
        
        # Özet
        print("\n" + "=" * 50)
        print("✅ İşlem Tamamlandı!")
        print(f"📊 Taşınan görsel sayısı: {moved_count}")
        print(f"📊 Boyutlandırılan görsel sayısı: {resized_count}")
        if error_count > 0:
            print(f"⚠️ Hata sayısı: {error_count}")
        print("\n📂 Yeni yapı:")
        print("  └── products/")
        print("      ├── size2000/  (Orijinal görseller)")
        print("      └── size400/   (400x400 boyutlu görseller)")
        
    except Exception as e:
        print(f"\n❌ Genel hata oluştu: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
