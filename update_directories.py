#!/usr/bin/env python3
"""
Products Dizin İsimlerini Güncelleme Script'i
JSON dosyalarındaki yeni kategorilere göre products alt dizinlerini yeniden adlandırır.
"""

import os
import shutil

# Eski dizin isimleri -> Yeni dizin isimleri mapping'i
DIRECTORY_MAPPING = {
    "bebekkaryolalari": "cocuk_yatagi",
    "ciftkisilikyataklar": "yatak", 
    "dolaplar": "gardrop",
    "kitapliklar": "kitaplik",
    "koltuklar": "koltuk",
    "komodinler": "komodin",
    "tekkisilikyataklar": "yatak",
    "teklikoltuklar": "koltuk"
}

def update_product_directories():
    """
    Products dizinindeki alt dizinleri yeniden adlandırır
    """
    products_path = "backend/data/products"
    
    if not os.path.exists(products_path):
        print(f"❌ {products_path} dizini bulunamadı")
        return
    
    print(f"📁 {products_path} dizini güncelleniyor...")
    print("=" * 50)
    
    # Mevcut dizinleri listele
    existing_dirs = [d for d in os.listdir(products_path) 
                    if os.path.isdir(os.path.join(products_path, d))]
    
    print("📋 Mevcut dizinler:")
    for dir_name in existing_dirs:
        print(f"  📂 {dir_name}")
    print()
    
    # Yeniden adlandırma işlemleri
    renamed_count = 0
    for old_name, new_name in DIRECTORY_MAPPING.items():
        old_path = os.path.join(products_path, old_name)
        new_path = os.path.join(products_path, new_name)
        
        if os.path.exists(old_path):
            # Eğer hedef dizin zaten varsa ve farklıysa, içerikleri birleştir
            if os.path.exists(new_path) and old_path != new_path:
                print(f"⚠️  '{new_name}' dizini zaten var, '{old_name}' içeriği birleştiriliyor...")
                
                # Eski dizindeki dosyaları yeni dizine taşı
                for item in os.listdir(old_path):
                    old_item_path = os.path.join(old_path, item)
                    new_item_path = os.path.join(new_path, item)
                    
                    if os.path.exists(new_item_path):
                        # Dosya/dizin zaten varsa, numara ekle
                        base, ext = os.path.splitext(item)
                        counter = 1
                        while os.path.exists(new_item_path):
                            new_item_name = f"{base}_{counter}{ext}"
                            new_item_path = os.path.join(new_path, new_item_name)
                            counter += 1
                    
                    shutil.move(old_item_path, new_item_path)
                    print(f"    📄 {item} taşındı")
                
                # Eski boş dizini sil
                os.rmdir(old_path)
                print(f"  ✅ '{old_name}' içeriği '{new_name}' ile birleştirildi")
                
            elif old_path != new_path:
                # Normal yeniden adlandırma
                os.rename(old_path, new_path)
                print(f"  ✅ '{old_name}' -> '{new_name}'")
                renamed_count += 1
            else:
                print(f"  ⏭️  '{old_name}' zaten doğru isimde")
        else:
            print(f"  ⚠️  '{old_name}' dizini bulunamadı")
    
    print("\n" + "=" * 50)
    print(f"✅ Dizin güncelleme tamamlandı! {renamed_count} dizin yeniden adlandırıldı.")
    
    # Son durumu göster
    print("\n📋 Güncellenmiş dizin yapısı:")
    updated_dirs = [d for d in os.listdir(products_path) 
                   if os.path.isdir(os.path.join(products_path, d))]
    
    for dir_name in sorted(updated_dirs):
        file_count = len([f for f in os.listdir(os.path.join(products_path, dir_name))
                         if os.path.isfile(os.path.join(products_path, dir_name, f))])
        print(f"  📂 {dir_name} ({file_count} dosya)")

def update_json_image_paths():
    """
    JSON dosyalarındaki image_path'leri yeni dizin isimlerine göre günceller
    """
    print("\n📝 JSON dosyalarındaki image_path'ler güncelleniyor...")
    
    jsonlar_path = "backend/data/jsonlar"
    json_files = [f for f in os.listdir(jsonlar_path) if f.endswith('.json')]
    
    # JSON dosya adı -> yeni dizin adı mapping'i
    json_to_dir_mapping = {
        "bebekkaryolalari.json": "cocuk_yatagi",
        "ciftkisilikyataklar.json": "yatak",
        "dolaplar.json": "gardrop", 
        "kitapliklar.json": "kitaplik",
        "koltuklar.json": "koltuk",
        "komodinler.json": "komodin",
        "tekkisilikyataklar.json": "yatak",
        "teklikoltuklar.json": "koltuk"
    }
    
    import json
    
    for filename in json_files:
        if filename in json_to_dir_mapping:
            file_path = os.path.join(jsonlar_path, filename)
            new_dir_name = json_to_dir_mapping[filename]
            
            print(f"  📄 {filename} güncelleniyor...")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            updated_count = 0
            for item in data:
                if "image_path" in item:
                    old_path = item["image_path"]
                    # Eski dizin adını yeni dizin adıyla değiştir
                    for old_dir, new_dir in DIRECTORY_MAPPING.items():
                        if f"/{old_dir}/" in old_path:
                            new_path = old_path.replace(f"/{old_dir}/", f"/{new_dir}/")
                            item["image_path"] = new_path
                            updated_count += 1
                            break
            
            # Güncellenmişi kaydet
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print(f"    ✅ {updated_count} image_path güncellendi")

if __name__ == "__main__":
    print("📁 DekoAsistanAI - Products Dizin Güncelleme Script'i")
    print("=" * 60)
    
    print("\n1️⃣ Products dizin yapısı güncelleniyor...")
    update_product_directories()
    
    print("\n2️⃣ JSON dosyalarındaki image_path'ler güncelleniyor...")
    update_json_image_paths()
    
    print("\n🎉 Tüm güncelleme işlemleri tamamlandı!")
