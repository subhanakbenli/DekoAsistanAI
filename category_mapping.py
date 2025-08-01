#!/usr/bin/env python3
"""
Kategori Mapping ve Düzenleme Script'i
Bu script JSON dosyalarındaki kategorileri roomCategories.js'deki standarda uygun hale getirir.
"""

import json
import os
import re
from typing import Dict, List, Any

# roomCategories.js'den alınan PRODUCT_CATEGORIES eşlemeleri
CATEGORY_MAPPING = {
    # Mevcut kategoriler -> Yeni kategoriler (roomCategories.js'deki id'ler)
    
    # Oturma ve Dinlenme
    "Kanepe": "koltuk",
    "Koltuk": "koltuk", 
    "Berjer": "berjer",
    "Mobilyalar": "koltuk",  # Genel mobilya kategorisi -> koltuk (koltuklar.json için)
    
    # Yataklar
    "Yatak": "yatak",
    "Çocuk Yatağı": "cocuk_yatagi",
    "Ranza": "ranza",
    
    # Depolama
    "Gardırop": "gardrop",
    "Gardirop": "gardrop",
    "Dolap": "dolap",
    "Komodin": "komodin",
    "Kitaplık": "kitaplik",
    "Kitaplıklar": "kitaplik",
    "Oyuncak Dolabı": "oyuncak_dolabi",
    "Dosya Dolabı": "dosya_dolabi",
    
    # Masalar
    "Sehpa": "sehpa",
    "Orta Sehpa": "sehpa",
    "Yan Sehpa": "sehpa",
    "TV Ünitesi": "tv_unitesi",
    "Yemek Masası": "yemek_masasi",
    "Çalışma Masası": "calisma_masasi",
    "Büfe": "bufe",
    "Bufe": "bufe",
    "Konsol": "sehpa",  # Konsol -> sehpa kategorisine
    
    # Sandalyeler
    "Sandalye": "sandalye",
    "Bar Taburesi": "bar_taburesi",
    "Ofis Koltuğu": "sandalye",  # Ofis koltuğu -> sandalye
    
    # Mutfak & Banyo
    "Mutfak Dolabı": "mutfak_dolabi",
    "Tezgah": "tezgah",
    "Lavabo": "lavabo",
    "Duş": "dus",
    "Duş Kabini": "dus",
    "Banyo Depolama": "banyo_depolama",
    
    # Aydınlatma
    "Sarkıt Lamba": "aydinlatma",
    "Lambader": "aydinlatma",
    "Aplik": "aydinlatma",
    "Aydınlatma": "aydinlatma",
    
    # Dekorasyon
    "Halı": "hali",
    "Perde": "perde",
    "Ayna": "ayna",
    "Dekoratif Objeler": "dekoratif_objeler",
    "Duvar Dekorasyonu": "duvar_dekorasyonu",
    "Aksesuar": "aksesuar",
    "Tablo": "duvar_dekorasyonu",
    "Tekstil": "aksesuar",
    
    # Özel Alanlar
    "Oyun Alanı": "oyun_alani"
}

# Dosya adına göre özel kategori mapping'leri
FILE_SPECIFIC_MAPPING = {
    "koltuklar.json": "koltuk",
    "teklikoltuklar.json": "koltuk", 
    "kitapliklar.json": "kitaplik",
    "dolaplar.json": "gardrop",  # Dolaplar genelde gardırop
    "komodinler.json": "komodin",
    "tekkisilikyataklar.json": "yatak",
    "ciftkisilikyataklar.json": "yatak",
    "bebekkaryolalari.json": "cocuk_yatagi"
}

def map_category(old_category: str, filename: str = "") -> str:
    """
    Eski kategoriyi yeni kategoriye map eder
    """
    # Önce dosya adına özel mapping'i kontrol et
    if filename in FILE_SPECIFIC_MAPPING:
        return FILE_SPECIFIC_MAPPING[filename]
    
    # Sonra genel mapping'i kontrol et
    if old_category in CATEGORY_MAPPING:
        return CATEGORY_MAPPING[old_category]
    
    # Eğer eşleşme bulunamazsa, default olarak 'aksesuar' döndür
    return "aksesuar"

def update_dataset_json():
    """
    Ana dataset.json dosyasındaki kategorileri günceller - ŞU AN KULLANILMIYOR
    """
    print("⏭️ dataset.json atlanıyor (şu an işimiz yok)")

def update_jsonlar_files():
    """
    backend/data/jsonlar/ klasöründeki JSON dosyalarını günceller
    """
    jsonlar_path = "backend/data/jsonlar"
    
    if not os.path.exists(jsonlar_path):
        print(f"❌ {jsonlar_path} klasörü bulunamadı")
        return
    
    json_files = [f for f in os.listdir(jsonlar_path) if f.endswith('.json')]
    
    for filename in json_files:
        file_path = os.path.join(jsonlar_path, filename)
        print(f"📝 {filename} dosyası güncelleniyor...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        updated_count = 0
        for item in data:
            if "category" in item:
                old_category = item["category"]
                new_category = map_category(old_category, filename)
                
                if old_category != new_category:
                    item["category"] = new_category
                    updated_count += 1
                    print(f"  ✅ '{old_category}' -> '{new_category}'")
        
        # Güncellenmişi kaydet
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ {filename} güncellendi. {updated_count} kategori değiştirildi.")

def show_current_categories():
    """
    Mevcut kategorilerin durumunu gösterir - sadece jsonlar klasörü
    """
    print("📊 Mevcut Kategori Analizi (sadece /jsonlar klasörü):\n")
    
    # jsonlar klasörü kategorileri
    jsonlar_path = "backend/data/jsonlar"
    if os.path.exists(jsonlar_path):
        print("📁 backend/data/jsonlar/ kategorileri:")
        json_files = [f for f in os.listdir(jsonlar_path) if f.endswith('.json')]
        
        for filename in json_files:
            file_path = os.path.join(jsonlar_path, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            categories = {}
            for item in data:
                if "category" in item:
                    cat = item["category"]
                    categories[cat] = categories.get(cat, 0) + 1
            
            print(f"  📄 {filename}:")
            for cat, count in sorted(categories.items()):
                print(f"    • {cat}: {count} ürün")
        print()

if __name__ == "__main__":
    print("🏠 DekoAsistanAI - Kategori Mapping Script'i")
    print("=" * 50)
    
    print("\n1️⃣ Mevcut durum analizi (sadece /jsonlar klasörü)...")
    show_current_categories()
    
    print("\n2️⃣ /jsonlar klasöründeki kategoriler güncelleniyor...")
    update_jsonlar_files()
    
    print("\n3️⃣ Güncellenmiş durum:")
    show_current_categories()
    
    print("🎉 /jsonlar klasörü kategori güncelleme tamamlandı!")
