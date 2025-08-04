# Test JSON API endpoints

## 1. Test Color Info Structure
POST /design/test
Content-Type: application/json

{
  "room_type": "salon",
  "design_style": "modern",
  "notes": "Test notları",
  "width": 300,
  "length": 400,
  "height": 250,
  "price": 25000,
  "color_info": {
    "dominantColor": "#2563eb",
    "colorName": "Mavi",
    "colorPalette": ["#2563eb", "#ffffff", "#f3f4f6"]
  },
  "product_categories": {
    "type": "categories",
    "products": [
      {
        "name": "Koltuk Takımı",
        "icon": "🛋️"
      },
      {
        "name": "Sehpa",
        "icon": "📱"
      }
    ]
  },
  "connection_id": "test_connection_123"
}

## 2. Test Minimal Request
POST /design/test
Content-Type: application/json

{
  "room_type": "yatak",
  "design_style": "minimal",
  "notes": "Basit test"
}

## 3. Test Custom Product Categories
POST /design/test
Content-Type: application/json

{
  "room_type": "mutfak",
  "design_style": "endüstriyel", 
  "notes": "Özel ürün testi",
  "product_categories": {
    "type": "custom",
    "description": "Paslanmaz çelik mutfak eşyaları ve ahşap detaylar"
  }
}
