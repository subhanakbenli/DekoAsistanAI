"""
Gemini AI için kullanılan tüm prompt şablonları
Merkezi prompt yönetimi için oluşturulmuştur
"""

class GeminiPrompts:
    """
    Gemini AI servisi için tüm prompt şablonlarını içeren sınıf
    """
    
    @staticmethod
    def get_design_suggestion_prompt(room_type: str, design_style: str, notes: str, additional_context: str = "") -> str:
        """
        Tasarım önerisi için ana prompt şablonu (ESKİ VERSİYON - HİBRİT OLMAYAN)
        
        Args:
            room_type: Oda tipi
            design_style: Tasarım stili
            notes: Kullanıcı notları
            additional_context: Ek bağlam bilgisi (renk paleti, ürün kategorileri vs.)
            
        Returns:
            str: Formatlanmış prompt
        """
        return f"""
Sen bir uzman iç mimar ve dekorasyon danışmanısın. Türkiye'de yaşayan bir kullanıcı için tasarım önerisi hazırlayacaksın.

**Kullanıcı Bilgileri:**
- Oda Tipi: {room_type}
- Tasarım Stili: {design_style}
{additional_context}- Özel İstekler: {notes}

**ÖNEMLİ:** Cevabını mutlaka aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme, sadece JSON:

{{
  "title": "Tasarım başlığı (maksimum 60 karakter)",
  "description": "Bu tasarım hakkında detaylı açıklama. Renk paleti, atmosfer, stil özellikleri hakkında bilgi ver. Kullanıcının renk tercihlerini ve ürün kategorilerini de dikkate al.",
  "hashtags": ["#genel_kategori", "#stil", "#oda_tipi", "#renk", "#atmosfer", "#malzeme", "#ozellik1", "#ozellik2", "#detay1", "#detay2"],
  "products": [
    {{
      "category": "Kategori adı",
      "name": "Ürün adı",
      "description": "Ürün detayları ve neden önerildiği"
    }},
    {{
      "category": "Kategori adı",
      "name": "Ürün adı",
      "description": "Ürün detayları ve neden önerildiği"
    }}
  ]
}}

**Format Kuralları:**
- "title": Kısa ve çekici başlık (maksimum 60 karakter)
- "description": Tasarım konsepti hakkında kapsamlı açıklama (2-4 cümle). Kullanıcının seçtiği renk paletini ve ürün tercihlerini de açıklamaya dahil et.
- "hashtags": TAM 10 ADET hashtag listesi - GENELDEN ÖZELE SIRALI
  - # ile başlamalı (örn: "#modern", "#living_room")
  - snake_case kullan (örn: "#living_room", "#neutral_colors")
  - İngilizce kelimeler kullan, Türkçe karakter yok
  - Sıralama: En genel kategoriden en spesifik detaya doğru
  - Renk tercihlerini hashtaslarda da yansıt (örn: "#warm_colors", "#neutral_tones", "#bold_colors")
  - Örnek sıralama: #interior_design, #modern, #living_room, #neutral_tones, #minimalist, #scandinavian, #cozy, #functional, #natural_light, #urban_style
- "products": Ürün listesi array'i - Kullanıcının seçtiği ürün kategorilerine odaklan
  - "category": Ürün kategorisi (örn: "Mobilyalar", "Aydınlatma", "Tekstil", "Dekoratif Objeler" vs.)
  - "name": Ürün adı (maksimum 40 karakter)
  - "description": Ürün açıklaması (maksimum 120 karakter) - Renk paleti ile uyumunu da belirt

**Hashtag Örnekleri:**
- Genel: #interior_design, #home_decor, #room_design
- Stil: #modern, #classic, #contemporary, #minimalist, #industrial, #scandinavian
- Oda: #living_room, #bedroom, #kitchen, #bathroom, #office
- Renk: #neutral_tones, #warm_colors, #cool_colors, #monochrome, #colorful, #earth_tones, #bold_colors, #pastel_colors
- Atmosfer: #cozy, #elegant, #luxurious, #rustic, #urban, #vintage
- Malzeme: #wood, #metal, #glass, #stone, #fabric, #leather
- Özellikler: #spacious, #compact, #bright, #natural_light, #functional, #artistic

**Önemli:**
- TAM 10 adet hashtag oluştur, eksik veya fazla olmasın
- Hashtag sıralaması çok önemli: en genel kategoriden başla, en spesifik detaylarla bitir
- Kullanıcının seçtiği renk paletini ve ürün kategorilerini öncelikle dikkate al
- Renk tercihlerini hem description'da hem hashtag'lerde yansıt
- Sadece kullanıcının seçtiği ürün kategorilerinden önerilerde bulun (seçim yapmışlarsa)
- Kaç ürün önereceğin sana kalmış (önerilen: 6-12 ürün)
- Sadece JSON formatında cevap ver, başka hiçbir metin ekleme
- Kullanıcının özel isteklerini dikkate al
"""

    @staticmethod
    def get_hybrid_design_suggestion_prompt(room_type: str, design_style: str, notes: str, additional_context: str = "") -> str:
        """
        HİBRİT tasarım önerisi için prompt şablonu - Function Calling ile gerçek ürün arama
        
        Args:
            room_type: Oda tipi
            design_style: Tasarım stili
            notes: Kullanıcı notları
            additional_context: Ek bağlam bilgisi (renk paleti, ürün kategorileri vs.)
            
        Returns:
            str: Hibrit yaklaşım için formatlanmış prompt
        """
        return f"""
Sen bir uzman iç mimar ve dekorasyon danışmanısın. Türkiye'de yaşayan bir kullanıcı için tasarım önerisi hazırlayacaksın.

**Kullanıcı Bilgileri:**
- Oda Tipi: {room_type}
- Tasarım Stili: {design_style}
{additional_context}- Özel İstekler: {notes}

**ÖNEMLİ HİBRİT ÜRÜN STRATEJİSİ:**
1. **ÖNCE GERÇEK ÜRÜN ARA**: Her ürün kategorisi için find_product fonksiyonunu kullanarak veritabanında ürün ara
2. **BULAMAZSAN HAYALİ OLUŞTUR**: Eğer find_product fonksiyonu ürün bulamazsa, tasarıma uygun hayali ürün oluştur
3. **6-10 ÜRÜN ÖNER**: Toplam 6-10 ürün önerisi yap (gerçek + hayali karışım olabilir)
4. **TUTARLI TASARIM**: Tüm ürünler (gerçek ve hayali) birbirleriyle ve genel tasarım konseptiyle uyumlu olsun

**GERÇEK ÜRÜN ARAMA KURALLARI:**
- Her ürün kategorisi için find_product(category="kategori_adi", style="{design_style}", color="renk_tercihi") çağır
- Kategori zorunlu, style ve color opsiyonel
- Bulunan ürünleri tasarımda kullan

**HAYALİ ÜRÜN OLUŞTURMA KURALLARI:**
- Veritabanı şemasına uygun olsun (product_name, category, style, color, description, price)
- Türkiye pazarına uygun gerçekçi fiyat belirle (TL cinsinden)
- Diğer ürünlerle stil ve renk uyumu olsun
- Oda boyutları ve kullanım amacına uygun boyutlar ver

**CEVAP FORMATI:**
Mutlaka aşağıdaki JSON formatında cevap ver:

{{
  "title": "Tasarım başlığı (maksimum 60 karakter)",
  "description": "Detaylı tasarım açıklaması (2-4 cümle). Renk paleti, atmosfer, stil özelliklerini açıkla.",
  "hashtags": ["#genel_kategori", "#stil", "#oda_tipi", "#renk", "#atmosfer", "#malzeme", "#ozellik1", "#ozellik2", "#detay1", "#detay2"],
  "products": [
    {{
      "category": "Kategori adı",
      "name": "Ürün adı", 
      "description": "Ürün detayları ve neden önerildiği",
      "price": 2500,
      "style": "modern",
      "color": "beyaz"
    }}
  ]
}}

**Hashtag Kuralları:**
- TAM 10 ADET hashtag (genelden özele sıralı)
- # ile başlayan İngilizce kelimeler
- snake_case kullan (örn: #living_room, #neutral_colors)
- Sıralama: En genel kategoriden en spesifik detaya

**Son Hatırlatma:**
- ÖNCE find_product fonksiyonunu kullan
- Bulamazsan hayali ürün oluştur
- Sadece JSON formatında cevap ver
- Gerçek ve hayali ürünler arasında tutarlılık sağla
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
        Imagen 4 için prompt geliştirme talebi
        
        Args:
            room_type: Oda tipi
            design_style: Tasarım stili
            notes: Kullanıcı notları
            design_title: Tasarım başlığı
            design_description: Tasarım açıklaması
            products_text: Ürünler listesi metni
            dimensions_info: Oda boyutları bilgisi
            color_info: Renk paleti bilgisi
            
        Returns:
            str: Imagen prompt geliştirme talebi
        """
        return f"""
Sen bir AI görsel üretim uzmanısın. Aşağıdaki iç mekan tasarım bilgilerini kullanarak Imagen 4 modeli için optimize edilmiş bir prompt oluştur.

**Tasarım Bilgileri:**
- Oda Tipi: {room_type}
- Tasarım Stili: {design_style}
{dimensions_info}{color_info}- Kullanıcı Notları: {notes}
- Tasarım Başlığı: {design_title}
- Tasarım Açıklaması: {design_description}

{products_text}

**Görevin:**
Bu bilgileri kullanarak Imagen 4 için optimize edilmiş bir oda görseli prompt'u oluştur. Prompt:

1. **Görsel Stil**: Photo-realistic interior room visualization  
2. **İçerik**: A complete {design_style.lower()} style {room_type.lower()} interior room
3. **Renkler**: Seçilen renk paletini odada doğal şekilde kullan
4. **Ürünler**: Include the suggested products naturally in the room scene
5. **Detaylar**: Specific colors, materials, furniture pieces, lighting, textures from design description
6. **Kalite**: High-quality, professional interior photography style, realistic lighting
7. **Kompozisyon**: Well-furnished room with proper perspective and natural arrangement

**Önemli**: 
- Mood board DEĞİL, gerçekçi oda görseli oluştur
- Seçilen renk paletini odanın ana renk şeması olarak kullan
- Önerilen ürünleri odada doğal şekilde yerleştir
- Prompt'u İngilizce olarak yaz ve Imagen 4'ün anlayabileceği şekilde düzenle
- Maksimum 500 karakter olsun

Sadece prompt'u döndür, açıklama yapma.
"""

    @staticmethod
    def get_fallback_imagen_prompt(room_type: str, design_style: str) -> str:
        """
        Imagen 4 için yedek prompt (Gemini başarısız olursa)
        
        Args:
            room_type: Oda tipi
            design_style: Tasarım stili
            
        Returns:
            str: Yedek Imagen prompt'u
        """
        return f"Photo-realistic {design_style.lower()} style {room_type.lower()} interior, complete furnished room, professional photography, natural lighting, modern composition"

class PromptUtils:
    """
    Prompt'lar için yardımcı fonksiyonlar
    """
    
    @staticmethod
    def build_additional_context(parsed_info: dict) -> str:
        """
        Parse edilmiş bilgilerden ek bağlam oluşturur
        
        Args:
            parsed_info: Parse edilmiş kullanıcı bilgileri
            
        Returns:
            str: Ek bağlam metni
        """
        additional_context = ""
        
        if not parsed_info:
            return additional_context
        
        # Oda boyutları bağlamı
        if parsed_info.get('room_dimensions'):
            dims = parsed_info['room_dimensions']
            additional_context += f"- Oda Boyutları: {dims['width']}cm x {dims['length']}cm x {dims['height']}cm\n"
        
        # Renk paleti bağlamı
        if parsed_info.get('color_palette'):
            color_info = parsed_info['color_palette']
            if color_info['type'] == 'palette':
                additional_context += f"- Seçilen Renk Paleti: {color_info.get('description', 'Özel palet')}\n"
                if color_info.get('colors'):
                    additional_context += f"- Renk Kodları: {', '.join(color_info['colors'])}\n"
            elif color_info['type'] == 'custom':
                additional_context += f"- Özel Renk Tercihi: {color_info['description']}\n"
        
        # Ürün kategori tercihleri
        if parsed_info.get('product_categories') and len(parsed_info['product_categories']) > 0:
            if isinstance(parsed_info['product_categories'][0], dict) and 'type' in parsed_info['product_categories'][0]:
                # Özel ürün açıklaması
                additional_context += f"- Özel Ürün Tercihleri: {parsed_info['product_categories'][0]['description']}\n"
            else:
                # Seçilen kategoriler
                categories = [cat['name'] for cat in parsed_info['product_categories'] if 'name' in cat]
                if categories:
                    additional_context += f"- Seçilen Ürün Kategorileri: {', '.join(categories)}\n"
        
        # Ekstra alanlar bilgisi
        if parsed_info.get('extra_areas'):
            additional_context += f"- Ekstra Alanlar: {len(parsed_info['extra_areas'])} adet çıkıntı/girinti var\n"
        
        return additional_context
    
    @staticmethod
    def format_products_for_imagen(products: list) -> str:
        """
        Ürün listesini Imagen prompt'u için formatlar
        
        Args:
            products: Ürün listesi
            
        Returns:
            str: Formatlanmış ürün metni
        """
        if not products or len(products) == 0:
            return ""
        
        products_by_category = {}
        for product in products:
            category = product.get('category', 'Genel')
            if category not in products_by_category:
                products_by_category[category] = []
            products_by_category[category].append(product['name'])
        
        products_text = "Kullanılacak Ürünler:\n"
        for category, product_names in products_by_category.items():
            products_text += f"- {category}: {', '.join(product_names)}\n"
        
        return products_text
    
    @staticmethod
    def extract_color_info_for_imagen(parsed_info: dict) -> str:
        """
        Renk bilgisini Imagen prompt'u için formatlar
        
        Args:
            parsed_info: Parse edilmiş kullanıcı bilgileri
            
        Returns:
            str: Formatlanmış renk bilgisi
        """
        color_info = ""
        
        if parsed_info and parsed_info.get('color_palette'):
            color_data = parsed_info['color_palette']
            if color_data['type'] == 'palette':
                color_info = f"Renk Paleti: {color_data.get('description', '')}\n"
                if color_data.get('colors'):
                    color_info += f"Renk Kodları: {', '.join(color_data['colors'])}\n"
            elif color_data['type'] == 'custom':
                color_info = f"Özel Renk Tercihi: {color_data['description']}\n"
        
        return color_info
    
    @staticmethod
    def extract_dimensions_info_for_imagen(parsed_info: dict) -> str:
        """
        Oda boyutları bilgisini Imagen prompt'u için formatlar
        
        Args:
            parsed_info: Parse edilmiş kullanıcı bilgileri
            
        Returns:
            str: Formatlanmış boyut bilgisi
        """
        dimensions_info = ""
        
        if parsed_info and parsed_info.get('room_dimensions'):
            dims = parsed_info['room_dimensions']
            dimensions_info = f"Oda Boyutları: {dims['width']}cm x {dims['length']}cm x {dims['height']}cm\n"
        
        return dimensions_info
