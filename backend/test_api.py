#!/usr/bin/env python3
"""
Manuel API test - boyutlu tasarım oluşturma
"""
import requests
import json

# API test
def test_design_api():
    url = "http://localhost:8000/design/test"
    
    # Test verisi
    data = {
        'room_type': 'salon',
        'design_style': 'modern',
        'notes': 'Test amaçlı komplet tasarım - tüm yeni alanlar',
        'width': 350,   # 350cm genişlik
        'length': 450,  # 450cm uzunluk  
        'height': 280,  # 280cm yükseklik
        'color_info': 'Renk Paleti: Modern Nötr - Beyaz, gri ve siyah tonlarında modern paletRenk Kodları: #FFFFFF, #F5F5F5, #333333',
        'product_categories': '{"type":"categories","products":[{"name":"Koltuk Takımı","icon":"🛋️"},{"name":"Sehpa","icon":"🪑"}]}'
    }
    
    try:
        print("🚀 API test başlatılıyor...")
        response = requests.post(url, data=data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Tasarım başarıyla oluşturuldu!")
            print(f"📋 Design ID: {result.get('design_id')}")
            print(f"🏠 Başlık: {result.get('design_title')}")
            print(f"📐 Boyutlar: {data['width']}×{data['length']}×{data['height']}cm")
        else:
            print(f"❌ Hata: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Bağlantı hatası: {e}")
        print("💡 Backend çalışıyor mu? 'uvicorn main:app --reload' ile başlatın")

if __name__ == "__main__":
    test_design_api()
