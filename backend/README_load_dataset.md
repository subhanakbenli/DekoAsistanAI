# jsonlaryeni Veritabanı Yükleme Kılavuzu

Bu script, `backend/data/jsonlaryeni/` dizinindeki JSON dosyalarından ürün verilerini PostgreSQL veritabanındaki products tablosuna yükler.

## Kaynak Veri

- **JSON Dosyaları:** `backend/data/jsonlaryeni/*.json`
- **Resim Dosyaları:** `backend/data/products/{kategori}/` alt dizinleri
- **Kategoriler:** aksesuar, aydinlatma, ayna, bar-sandalyesi, berjer, bufe, calisma-masasi, dolap, duvar-dekorasyonu, hali, kitaplik, koltuk, komodin, lavabo, oyuncak-dolabi, ranza, sandalye, tek-kisilik-baza, tezgah, tv-unitesi, yatak, yemek-masasi

## Özellikler

- ✅ Kategori bazında JSON dosyalarını otomatik işler
- ✅ UUID ile benzersiz ID oluşturma
- ✅ Gerçek fiyat ve resim yolu verilerini kullanır
- ✅ Hata yönetimi ve dosya bazında raporlama
- ✅ Kategori dağılımı analizi
- ✅ Veri doğrulama

## Kullanım

### 1. Temel Yükleme
```bash
cd backend
python load_dataset.py
```

### 2. Sadece Veri Doğrulama
```bash
python load_dataset.py --verify
```

### 3. Tabloyu Temizleme (DİKKAT!)
```bash
python load_dataset.py --clear
```

## Veri Mapping Tablosu

| JSON Field | Database Field | Açıklama |
|------------|----------------|----------|
| `product_name` | `product_name` | Ürün adı |
| `category` | `category` | Kategori |
| `style` | `style` | Stil |
| `color` | `color` | Renk |
| `dimensions.width_cm` | `width_cm` | Genişlik |
| `dimensions.depth_cm` | `depth_cm` | Derinlik |
| `dimensions.height_cm` | `height_cm` | Yükseklik |
| `description` | `description` | Açıklama |
| `price` | `price` | **Gerçek fiyat (kuruş)** |
| `image_path` | `image_path` | **Gerçek resim yolu** |
| `product_link` | `product_link` | Ürün linki |

## Önemli Notlar

- **Fiyat:** JSON dosyalarında gerçek fiyat bilgileri mevcut (kuruş cinsinden)
- **Resim:** Resim yolları JSON'da belirtilmiş, dosyalar `data/products/{kategori}/` dizinlerinde
- **Benzersiz ID:** Her ürün için UUID oluşturulur
- **Kategori Dosyaları:** Her kategori için ayrı JSON dosyası işlenir

## Örnek Çıktı

```
📦 dataset.json verilerini Products tablosuna yükleniyor...
============================================================
  ✅ 50 ürün işlendi...
  ✅ 100 ürün işlendi...
  ✅ 150 ürün işlendi...
  ✅ 200 ürün işlendi...

🎉 Başarıyla tamamlandı!
📊 Toplam 228 ürün veritabanına yüklendi
⚠️  0 ürün atlandı (hata nedeniyle)
📋 Veritabanındaki toplam ürün sayısı: 228

📊 Kategori dağılımı:
  • Kanepe: 15 ürün
  • Sandalye: 12 ürün
  • Orta Sehpa: 11 ürün
  ...
```

## Hata Giderme

### 1. Database Connection Error
```bash
# Veritabanı ayarlarını kontrol edin
cat backend/config/settings.py
```

### 3. JSON Parse Error
```bash
# JSON dosyalarının varlığını kontrol edin
ls -la backend/data/jsonlaryeni/
```

### 3. Import Error
```bash
# Python path'i düzeltin
export PYTHONPATH=$PYTHONPATH:$(pwd)
python load_dataset.py
```

## Fiyat ve Resim Durumu

Artık fiyat güncellemesine gerek yok! JSON dosyalarında:

- ✅ **Gerçek fiyatlar** mevcut (kuruş cinsinden)
- ✅ **Resim yolları** belirtilmiş
- ✅ **Resim dosyaları** kategoriler halinde organize edilmiş

```bash
# Resim dosyalarını kontrol etmek için:
ls backend/data/products/koltuk/
ls backend/data/products/sandalye/
# vs...
```
