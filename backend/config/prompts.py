"""
Gemini AI prompt templates and utilities.
Centralized prompt management for design generation.
"""

import json
from config import logger

class GeminiPrompts:
    """
    Gemini AI prompt templates for design generation
    """
    
    @staticmethod
    def get_design_suggestion_prompt(room_type: str, design_style: str, notes: str, additional_context: str = "") -> str:
        """
        Generate design suggestion prompt for legacy system.
        
        Returns: Formatted prompt string for Gemini AI
        """
        return f"""
Sen bir konut iç mimarı ve ev dekorasyon uzmanısın. Türkiye'de yaşayan bir aile/kişi için **EV İÇİ KONUT ODASI** tasarım önerisi hazırlayacaksın.

**KONUT BİLGİLERİ:**
- Ev Odası Tipi: {room_type} (bu bir konut/ev odası - otel, ofis, restoran değil)
- Tasarım Stili: {design_style}
{additional_context}- Özel İstekler: {notes}

**ÖNEMLİ KONUT KURALLARI:**
- Bu bir EV/KONUT içi tasarımıdır - ticari mekan değil
- Aile yaşamına uygun, ev konforu odaklı olmalı
- Yaşanabilir, fonksiyonel ev odası tasarımı yapacaksın
- Salon = Oturma odası/living room (düğün salonu değil!)

**ÖNEMLİ:** Cevabını mutlaka aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme, sadece JSON:

{{
  "title": "Ev odası tasarım başlığı (maksimum 60 karakter)",
  "description": "Bu konut odası tasarımı hakkında detaylı açıklama. Ev yaşamına uygun renk paleti, aile atmosferi, konut stil özellikleri hakkında bilgi ver. Kullanıcının renk tercihlerini ve ev ürün kategorilerini de dikkate al.",
  "hashtags": ["#ic_tasarim", "#ev_tasarimi", "#oturma_odasi", "#notr_renkler", "#aile_dostu", "#rahat", "#fonksiyonel", "#dogal_isik", "#konforlu", "#sicak_atmosfer"],
  "products": [
    {{
      "category": "Ev Mobilyaları",
      "name": "Konut ürün adı",
      "description": "Ev yaşamına uygun ürün detayları ve neden ev için önerildiği"
    }},
    {{
      "category": "Ev Tekstili",
      "name": "Ev ürün adı", 
      "description": "Aile yaşamına uygun ürün detayları"
    }}
  ]
}}

**Format Kuralları:**
- "title": Kısa ve çekici **EV ODASI** başlığı (maksimum 60 karakter)
- "description": **KONUT ODASI** tasarım konsepti hakkında kapsamlı açıklama (2-4 cümle). Ev yaşamı, aile konforu vurgula. Kullanıcının seçtiği renk paletini ve ev ürün tercihlerini açıklamaya dahil et.
- "hashtags": TAM 10 ADET SADECE TÜRKÇE hashtag listesi - GENELDEN ÖZELE SIRALI
  - # ile başlamalı (örn: "#ic_tasarim", "#oturma_odasi", "#aile_evi")
  - snake_case kullan (örn: "#oturma_odasi", "#notr_renkler", "#aile_dostu")
  - SADECE Türkçe kelimeler kullan, İngilizce kelime kesinlikle yasak
  - İlk hashtag mutlaka #ic_tasarim veya #ev_tasarimi olsun
  - Sıralama: En genel kategoriden en spesifik detaya doğru
  - Renk tercihlerini hashtaslarda da yansıt (örn: "#sicak_renkler", "#notr_tonlar")
  - Örnek sıralama: #ic_tasarim, #modern, #oturma_odasi, #notr_tonlar, #aile_dostu, #rahat, #fonksiyonel, #dogal_isik, #konforlu, #ev_tasarimi
- "products": **EV ÜRÜN** listesi array'i - Kullanıcının seçtiği ev ürün kategorilerine odaklan
  - "category": Ev ürün kategorisi (örn: "Ev Mobilyaları", "Ev Aydınlatması", "Ev Tekstili", "Ev Dekoratif Objeler" vs.)
  - "name": Ev ürün adı (maksimum 40 karakter)
  - "description": Ev ürün açıklaması (maksimum 120 karakter) - Ev yaşamına uygunluğu ve renk paleti uyumunu belirt

**Hashtag Örnekleri:**
- Genel: #ic_tasarim, #ev_tasarimi, #aile_evi, #konut_tasarimi
- Stil: #modern_ev, #klasik_ev, #cagdas_konut, #minimalist_ev, #iskandinavya_evi
- Oda: #oturma_odasi, #ev_yatak_odasi, #aile_mutfagi, #ev_banyosu, #calisma_odasi
- Renk: #notr_ev, #sicak_ev_renkleri, #soguk_ev_tonlari, #rahat_renkler, #aile_dostu_renkler
- Atmosfer: #rahat_ev, #sik_konut, #konforlu_yasam, #aile_konforu, #ev_sicakligi
- Malzeme: #ev_ahsap, #konut_malzemeleri, #aile_guvenli_malzemeler
- Özellikler: #ferah_ev, #kompakt_yasam, #aydinlik_ev, #fonksiyonel_aile, #konforlu_ev

**Önemli:**
- TAM 10 adet SADECE TÜRKÇE hashtag oluştur, eksik veya fazla olmasın
- İlk hashtag mutlaka #ic_tasarim veya #ev_tasarimi olsun
- Hashtag sıralaması: en genel ev kategorisinden başla, en spesifik ev detaylarıyla bitir
- Kullanıcının seçtiği renk paletini ve ev ürün kategorilerini öncelikle dikkate al
- Renk tercihlerini hem description'da hem hashtag'lerde ev yaşamı bağlamında yansıt
- Sadece kullanıcının seçtiği ev ürün kategorilerinden önerilerde bulun (seçim yapmışlarsa)
- Hashtag'lar SADECE Türkçe olmalı, İngilizce kelime kesinlikle kullanma
- Kaç ürün önereceğin sana kalmış (önerilen: 6-12 ev ürünü)
- Sadece JSON formatında cevap ver, başka hiçbir metin ekleme
- Kullanıcının özel isteklerini ev yaşamı bağlamında dikkate al
- SALON = OTURMA ODASI/LİVİNG ROOM (düğün salonu değil!)
"""

    @staticmethod
    def get_hybrid_design_suggestion_prompt(room_type: str, design_style: str, notes: str, additional_context: str = "") -> str:
        """
        Generate hybrid design prompt with function calling support.
        
        Returns: Formatted prompt for real product search + AI generation
        """
        return f"""
Sen bir konut iç mimarı ve ev dekorasyon uzmanısın. Türkiye'de yaşayan bir aile/kişi için **EV İÇİ KONUT ODASI** hibrit tasarım önerisi hazırlayacaksın.

**KONUT BİLGİLERİ:**
- Ev Odası Tipi: {room_type} (bu bir konut/ev odası - otel, ofis, restoran değil)
- Tasarım Stili: {design_style}
{additional_context}- Özel İstekler: {notes}

**ÖNEMLİ KONUT KURALLARI:**
- Bu bir EV/KONUT içi tasarımıdır - ticari mekan değil
- Aile yaşamına uygun, ev konforu odaklı olmalı
- Yaşanabilir, fonksiyonel ev odası tasarımı yapacaksın
- Salon = Oturma odası/living room (düğün salonu değil!)

**ÖNEMLİ HİBRİT EV ÜRÜN STRATEJİSİ:**
1. **ÖNCE GERÇEK EV ÜRÜN ARA**: Her ev ürün kategorisi için find_product fonksiyonunu kullanarak veritabanında ürün ara
2. **BULAMAZSAN HAYALİ EV ÜRÜN OLUŞTUR**: Eğer find_product fonksiyonu ürün bulamazsa, ev tasarımına uygun hayali ürün oluştur
3. **6-10 EV ÜRÜN ÖNER**: Toplam 6-10 ev ürün önerisi yap (gerçek + hayali karışım olabilir)
4. **TUTARLI EV TASARIM**: Tüm ürünler (gerçek ve hayali) birbirleriyle ve genel ev tasarım konseptiyle uyumlu olsun

**GERÇEK EV ÜRÜN ARAMA KURALLARI:**
- Her ev ürün kategorisi için find_product(category="kategori_adi", style="{design_style}", color="renk_tercihi") çağır
- Kategori zorunlu, style ve color opsiyonel
- Bulunan ev ürünlerini konut tasarımında kullan

**HAYALİ EV ÜRÜN OLUŞTURMA KURALLARI:**
- Veritabanı şemasına uygun olsun (product_name, category, style, color, description, price)
- Türkiye pazarına uygun gerçekçi ev ürün fiyatı belirle (TL cinsinden)
- Diğer ev ürünleriyle stil ve renk uyumu olsun
- Ev oda boyutları ve aile kullanım amacına uygun boyutlar ver
- Aile yaşamına uygun güvenli malzemeler seç (çocuk güvenliği vs.)

**CEVAP FORMATI:**
Mutlaka aşağıdaki JSON formatında cevap ver:

{{
  "title": "Ev odası tasarım başlığı (maksimum 60 karakter)",
  "description": "Detaylı konut odası tasarım açıklaması (2-4 cümle). Ev yaşamı, aile konforu, renk paleti, atmosfer, stil özelliklerini açıkla.",
  "hashtags": ["#ic_tasarim", "#ev_tasarimi", "#oturma_odasi", "#notr_renkler", "#aile_dostu", "#rahat", "#fonksiyonel", "#dogal_isik", "#konforlu", "#sicak_atmosfer"],
  "products": [
    {{
      "category": "Ev Mobilyaları",
      "name": "Ev ürün adı", 
      "description": "Ev ürün detayları ve neden ev için önerildiği",
      "price": 2500,
      "style": "modern",
      "color": "beyaz"
    }}
  ]
}}

**Hashtag Kuralları:**
- TAM 10 ADET SADECE TÜRKÇE hashtag (genelden özele sıralı)
- # ile başlayan SADECE Türkçe kelimeler, İngilizce kelime kesinlikle yasak
- snake_case kullan (örn: #oturma_odasi, #notr_renkler, #aile_dostu)
- İlk hashtag mutlaka #ic_tasarim veya #ev_tasarimi olsun
- Sıralama: En genel ev kategorisinden en spesifik ev detayına
- ÖRNEKLERDEKİ GİBİ TAMAMEN TÜRKÇE HASHTAG OLUŞTUR

**Son EV TASARIM Hatırlatması:**
- ÖNCE find_product fonksiyonunu kullanarak ev ürünü ara
- Bulamazsan aile yaşamına uygun hayali ev ürün oluştur
- Sadece JSON formatında cevap ver
- Gerçek ve hayali ev ürünleri arasında tutarlılık sağla
- HASHTAG'LAR SADECE TÜRKÇE OLACAK - İngilizce kelime yasak
- SALON = OTURMA ODASI/LİVİNG ROOM (düğün salonu değil!)
- Ev yaşamı ve aile konforu odaklı tasarım yap
"""

    @staticmethod
    def get_imagen_prompt_enhancement_request(
        room_type: str, 
        design_style: str, 
        notes: str,
        design_title: str,
        design_description: str,
        products_text: str = "",
        dimensions_info: str = "",
        color_info: str = ""
    ) -> str:
        """
        Generate Turkish→English translation for Imagen 4 - Ultra strict and concise.
        
        Returns: Gemini prompt for creating optimized English Imagen prompt
        """
        return f"""TASK: Create English Imagen prompt from Turkish data

INPUT:
Room: {room_type}
Style: {design_style}
Notes: {notes}
{color_info}
{products_text}

RULES:
- Start with "Photo-realistic"
- MAXIMUM 480 characters total
- MAXIMUM 5 products mentioned
- 100% English only - zero Turkish characters
- salon→living room, yatak→bedroom, mutfak→kitchen, banyo→bathroom, çocuk→kids room
- Focus only on visual elements for image generation

Your response must be exactly 480 characters or less, pure English:"""

class PromptUtils:
    """
    Utility functions for prompt generation
    """
    
    @staticmethod
    def build_additional_context(parsed_info: dict) -> str:
        """
        Build additional context from parsed user information.
        
        Returns: Formatted context string
        """
        additional_context = ""
        
        if not parsed_info:
            return additional_context
        
        # Oda boyutları bağlamı
        if parsed_info.get('room_dimensions'):
            dims = parsed_info['room_dimensions']
            additional_context += f"- Oda Boyutları: {dims['width']}cm x {dims['length']}cm x {dims['height']}cm\n"
        
        # Renk paleti bağlamı
        if parsed_info.get('color_info'):
            color_info_str = parsed_info['color_info']
            # Color info JSON string'i parse et
            try:
                import json
                color_info = json.loads(color_info_str) if isinstance(color_info_str, str) else color_info_str
                
                if isinstance(color_info, dict):
                    # Frontend'den gelen yeni format
                    if color_info.get('colorName'):
                        additional_context += f"- Seçilen Ana Renk: {color_info['colorName']}\n"
                    if color_info.get('dominantColor'):
                        additional_context += f"- Dominant Renk Kodu: {color_info['dominantColor']}\n"
                    if color_info.get('colorPalette') and isinstance(color_info['colorPalette'], list):
                        additional_context += f"- Renk Paleti: {', '.join(color_info['colorPalette'])}\n"
            except (json.JSONDecodeError, TypeError):
                # Fallback: eğer parse edilemezse string olarak kullan
                additional_context += f"- Renk Bilgisi: {color_info_str}\n"
        
        # Eski renk paleti formatı için geriye uyumluluk
        elif parsed_info.get('color_palette'):
            color_info = parsed_info['color_palette']
            if color_info['type'] == 'palette':
                additional_context += f"- Seçilen Renk Paleti: {color_info.get('description', 'Özel palet')}\n"
                if color_info.get('colors'):
                    additional_context += f"- Renk Kodları: {', '.join(color_info['colors'])}\n"
            elif color_info['type'] == 'custom':
                additional_context += f"- Özel Renk Tercihi: {color_info['description']}\n"
        
        # Ürün kategori tercihleri - VURGULU FORMATLAMA
        if parsed_info.get('product_categories'):
            product_categories = parsed_info['product_categories']
            
            # Frontend'den gelen format kontrolü
            if isinstance(product_categories, dict):
                if product_categories.get('type') == 'categories' and product_categories.get('products'):
                    # Seçilen kategoriler - Vurgulu format
                    categories = [cat.get('name') for cat in product_categories['products'] if cat.get('name')]
                    if categories:
                        additional_context += f"- **ÖZEL ODAK KATEGORİLERİ** (görsel odada BELİRGİN olarak vurgulanmalı): {', '.join(categories)}\n"
                        additional_context += "- Bu kategorilerden ürünler odanın ana odak noktalarında yerleştirilmeli ve görsel olarak öne çıkarılmalı\n"
                elif product_categories.get('type') == 'custom' and product_categories.get('description'):
                    # Özel ürün açıklaması
                    additional_context += f"- Özel Ürün Tercihleri: {product_categories['description']}\n"
            # Eski format desteği (list formatı)
            elif isinstance(product_categories, list) and len(product_categories) > 0:
                if isinstance(product_categories[0], dict) and 'type' in product_categories[0]:
                    # Özel ürün açıklaması
                    additional_context += f"- Özel Ürün Tercihleri: {product_categories[0]['description']}\n"
                else:
                    # Seçilen kategoriler - Vurgulu format
                    categories = [cat['name'] for cat in product_categories if 'name' in cat]
                    if categories:
                        additional_context += f"- **ÖZEL ODAK KATEGORİLERİ** (görsel odada BELİRGİN olarak vurgulanmalı): {', '.join(categories)}\n"
                        additional_context += "- Bu kategorilerden ürünler odanın ana odak noktalarında yerleştirilmeli ve görsel olarak öne çıkarılmalı\n"
        
        # Ekstra alanlar bilgisi
        if parsed_info.get('extra_areas'):
            additional_context += f"- Ekstra Alanlar: {len(parsed_info['extra_areas'])} adet çıkıntı/girinti var\n"
        
        return additional_context
    
    @staticmethod
    def format_products_for_imagen(products: list) -> str:
        """
        Format hybrid product list for Imagen prompt generation.
        
        Returns: Formatted product text with real/AI product descriptions
        """
        if not products or len(products) == 0:
            return ""
        
        real_products = []
        fake_products = []
        products_by_category = {}
        
        for product in products:
            category = product.get('category', 'Genel')
            product_name = product.get('name', '')
            product_description = product.get('description', '')
            image_path = product.get('image_path', '')
            is_real = product.get('is_real', False)
            
            # Kategoriye göre grupla
            if category not in products_by_category:
                products_by_category[category] = []
            
            product_info = {
                'name': product_name,
                'description': product_description,
                'image_path': image_path,
                'is_real': is_real
            }
            products_by_category[category].append(product_info)
            
            # Gerçek/fake ayrımı
            if is_real:
                real_products.append(product_info)
            else:
                fake_products.append(product_info)
        
        # Ürün listesi formatla - KOMPAKT
        products_text = f"**ÜRÜN LİSTESİ** ({len(real_products)} gerçek + {len(fake_products)} AI ürün):\n\n"
        
        # Seçilen kategorileri kısa listele
        category_names = list(products_by_category.keys())
        products_text += f"**KATEGORİLER**: {', '.join(category_names)}\n\n"
        
        # Gerçek ürünleri KISA formatta listele
        if real_products:
            products_text += "**GERÇEK ÜRÜNLER**:\n"
            for product in real_products:
                # KISA FORMAT: Sadece isim + temel özellik
                short_desc = product['name']
                if product['description']:
                    # Açıklamayı kısalt: ilk 25 karakter + temel kelimeler
                    desc = product['description'][:25].split(',')[0].split('.')[0]
                    short_desc += f" ({desc})"
                products_text += f"- {short_desc}\n"
            products_text += "\n"
        
        # AI ürünleri de KISA formatta listele
        if fake_products:
            products_text += "**AI ÜRÜNLER**:\n"
            for product in fake_products:
                short_desc = product['name']
                if product['description']:
                    # Kısa açıklama: sadece stil/renk/temel özellik
                    desc = product['description'][:20].split(',')[0].split('.')[0]
                    short_desc += f" ({desc})"
                products_text += f"- {short_desc}\n"
            products_text += "\n"
        
        return products_text
    
    @staticmethod
    def extract_dimensions_info_for_imagen(parsed_info: dict) -> str:
        """
        Extract room dimensions for Imagen prompt formatting.
        
        Returns: Formatted dimension information string
        """
        dimensions_info = ""
        
        # Direkt width/length parametrelerini kontrol et
        width = parsed_info.get('width') if parsed_info else None
        length = parsed_info.get('length') if parsed_info else None
        height = parsed_info.get('height') if parsed_info else None
        
        # Eski room_dimensions formatını da kontrol et
        if not width and parsed_info and parsed_info.get('room_dimensions'):
            dims = parsed_info['room_dimensions']
            width = dims.get('width')
            length = dims.get('length') 
            height = dims.get('height')
        
        if width and length:
            # m2 cinsinden alan hesapla
            area_m2 = (width * length) / 10000  # cm2 to m2
            
            dimensions_info += "**ODA BOYUTLARI BİLGİSİ** (görsel bu boyutlara uygun olmalı):\n"
            dimensions_info += f"- Oda Genişliği: {width}cm\n"
            dimensions_info += f"- Oda Uzunluğu: {length}cm\n"
            if height:
                dimensions_info += f"- Oda Yüksekliği: {height}cm\n"
            dimensions_info += f"- Toplam Alan: {area_m2:.1f}m²\n"
            
            # Oda büyüklük karakterizasyonu
            if area_m2 < 8:
                size_desc = "çok küçük ve kompakt"
                english_size = "very compact and small"
            elif area_m2 < 12:
                size_desc = "küçük"
                english_size = "small and cozy"
            elif area_m2 < 20:
                size_desc = "orta büyüklükte"
                english_size = "medium-sized"
            elif area_m2 < 30:
                size_desc = "büyük"
                english_size = "large and spacious"
            else:
                size_desc = "çok büyük ve ferah"
                english_size = "very large and spacious"
            
            dimensions_info += f"- Oda Karakteri: {size_desc} oda ({area_m2:.1f}m²)\n"
            dimensions_info += f"\n**İMAGEN PROMPT İÇİN BOYUT VURGUSU**: {english_size} room interior, showing proper spatial proportions\n"
            
            # Aspect ratio analizi
            aspect_ratio = max(width, length) / min(width, length)
            if aspect_ratio > 2:
                dimensions_info += f"**ŞEKİL VURGUSU**: Uzun ve dar oda ({aspect_ratio:.1f}:1 oranı) - elongated room layout\n"
            elif aspect_ratio < 1.3:
                dimensions_info += f"**ŞEKİL VURGUSU**: Kare şeklinde oda ({aspect_ratio:.1f}:1 oranı) - square room layout\n"
            else:
                dimensions_info += f"**ŞEKİL VURGUSU**: Dikdörtgen oda ({aspect_ratio:.1f}:1 oranı) - rectangular room layout\n"
        
        return dimensions_info
