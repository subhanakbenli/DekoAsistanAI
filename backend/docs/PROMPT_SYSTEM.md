# Prompt Yönetim Sistemi

## Genel Bakış
Backend'de tüm Gemini AI prompt'ları merkezi olarak `config/prompts.py` dosyasında yönetilmektedir. Bu sistem, prompt'ların daha kolay güncellenmesi ve tutarlılığın sağlanması için tasarlanmıştır.

## Dosya Yapısı

### `config/prompts.py`
- `GeminiPrompts`: Ana prompt şablonlarını içeren sınıf
- `PromptUtils`: Prompt'lar için yardımcı fonksiyonlar

## Kullanım

### 1. Tasarım Önerisi Prompt'u
```python
from config.prompts import GeminiPrompts, PromptUtils

# Parse edilmiş bilgilerden ek bağlam oluştur
additional_context = PromptUtils.build_additional_context(parsed_info)

# Ana tasarım prompt'unu al
prompt = GeminiPrompts.get_design_suggestion_prompt(
    room_type="salon",
    design_style="modern", 
    notes="Kullanıcı notları",
    additional_context=additional_context
)
```

### 2. Imagen Prompt Geliştirme
```python
# Ürün listesini formatla
products_text = PromptUtils.format_products_for_imagen(products)

# Renk ve boyut bilgilerini çıkar
color_info = PromptUtils.extract_color_info_for_imagen(parsed_info)
dimensions_info = PromptUtils.extract_dimensions_info_for_imagen(parsed_info)

# Imagen prompt geliştirme talebi
prompt = GeminiPrompts.get_imagen_prompt_enhancement_request(
    room_type="salon",
    design_style="modern",
    notes="notlar",
    design_title="başlık",
    design_description="açıklama",
    products_text=products_text,
    dimensions_info=dimensions_info,
    color_info=color_info
)
```

### 3. Yedek Imagen Prompt'u
```python
# Gemini başarısız olursa kullanılacak yedek prompt
fallback_prompt = GeminiPrompts.get_fallback_imagen_prompt("salon", "modern")
```

## Prompt Şablonları

### Ana Tasarım Prompt'u
- JSON formatında yanıt talep eder
- Renk paleti ve ürün kategori bilgilerini dahil eder
- 10 adet hashtag gerektirir (genelden özele sıralı)
- Ürün önerileri için kategori bazlı yapı kullanır

### Imagen Prompt Geliştirme
- Oda görselleştirmesi için optimize edilmiş
- Renk paleti ve ürün bilgilerini görsel prompt'a dahil eder
- Maksimum 500 karakter sınırı
- Photo-realistic sonuçlar için tasarlanmış

## Avantajları

1. **Merkezi Yönetim**: Tüm prompt'lar tek yerde
2. **Kolay Güncelleme**: Prompt değişiklikleri tek dosyadan yapılır
3. **Tutarlılık**: Aynı prompt'lar her yerde kullanılır
4. **Modülerlik**: Yardımcı fonksiyonlarla kolay genişletme
5. **Test Edilebilirlik**: Prompt'lar ayrı ayrı test edilebilir

## Kullanılan Yerler

- `services/gemini_service.py`: Ana tasarım önerileri
- `services/mood_board_service.py`: Görsel oluşturma prompt'ları
- Her iki servis de aynı parse fonksiyonları ve utilities kullanır

## Prompt Güncelleme Rehberi

1. `config/prompts.py` dosyasını düzenle
2. Değişiklikleri test et:
   ```bash
   python -c "from config.prompts import GeminiPrompts; print('Test OK')"
   ```
3. Servislerde herhangi bir değişiklik gerekmez
4. Restart backend for changes to take effect
