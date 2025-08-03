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
        # Map room type to clear home terminology
        home_room_type = PromptUtils.map_room_type_to_home_english(room_type)
        
        return f"""
Sen bir AI görsel üretim uzmanısın. Aşağıdaki **KONUT İÇ MEKAN** tasarım bilgilerini kullanarak Imagen 4 modeli için optimize edilmiş bir prompt oluştur.

**ÖNEMLİ KONUT KURALLARI:**
- Bu bir EV/KONUT içi tasarımıdır - otel, ofis, restoran, düğün salonu değil
- Yaşam alanı, aile kullanımı için tasarlanmış ev odası olmalı
- Konut mobilyaları ve ev yaşam tarzını yansıtmalı

**Konut İç Mekan Tasarım Bilgileri:**
- Ev Odası Tipi: {home_room_type}
- Tasarım Stili: {design_style}
{dimensions_info}{color_info}- Kullanıcı Notları: {notes}
- Tasarım Başlığı: {design_title}
- Tasarım Açıklaması: {design_description}

{products_text}

**Görevin:**
Bu bilgileri kullanarak Imagen 4 için **EV İÇİ KONUT ODASI** görseli prompt'u oluştur. Prompt:

1. **Görsel Stil**: Photo-realistic HOME interior room visualization  
2. **İçerik**: A complete residential {design_style.lower()} style {home_room_type.lower()} interior
3. **Konut Atmosferi**: Family-friendly home environment, not commercial space
4. **Renkler**: Seçilen renk paletini ev odasında doğal şekilde kullan
5. **Ev Mobilyaları**: Include home furniture and residential products naturally
6. **Detaylar**: Home-specific colors, materials, residential furniture, cozy lighting
7. **Kalite**: High-quality residential interior photography, warm home lighting
8. **Kompozisyon**: Well-furnished family home room with lived-in comfort

**Kritik Konut Vurguları**: 
- "residential home interior" kelimelerini kullan
- "family home", "house interior", "domestic space" terimleri ekle  
- Commercial, hotel, restaurant, office, venue terimlerinden kaçın
- Ev yaşamına uygun, aile dostu atmosfer oluştur
- Prompt'u İngilizce olarak yaz ve konut odası vurgusunu unutma
- Maksimum 500 karakter olsun

Sadece prompt'u döndür, açıklama yapma.
"""

    @staticmethod
    def get_fallback_imagen_prompt(room_type: str, design_style: str) -> str:
        """
        Imagen 4 için yedek konut odası prompt'u (Gemini başarısız olursa)
        
        Args:
            room_type: Ev odası tipi
            design_style: Tasarım stili
            
        Returns:
            str: Yedek konut Imagen prompt'u
        """
        # Room type'ı ev odası terminolojisine çevir
        home_room_type = room_type.lower()
        if 'salon' in home_room_type or 'oturma' in home_room_type:
            home_room_type = 'living room'
        elif 'yatak' in home_room_type:
            home_room_type = 'bedroom'
        elif 'mutfak' in home_room_type:
            home_room_type = 'kitchen'
        elif 'banyo' in home_room_type:
            home_room_type = 'bathroom'
        
        return f"Photo-realistic residential {design_style.lower()} style home {home_room_type} interior, family house room, cozy domestic space, home furniture, warm lighting, lived-in comfort"

class PromptUtils:
    """
    Prompt'lar için yardımcı fonksiyonlar
    """
    
    @staticmethod
    def map_room_type_to_home_english(room_type: str) -> str:
        """
        Türkçe oda tiplerini ev odası İngilizce terimlerine çevirir
        
        Args:
            room_type: Türkçe oda tipi
            
        Returns:
            str: İngilizce ev odası terimi
        """
        room_mapping = {
            'salon': 'home living room',
            'oturma odası': 'family living room', 
            'oturma': 'living room',
            'yatak odası': 'home bedroom',
            'yatak': 'bedroom',
            'mutfak': 'home kitchen',
            'banyo': 'home bathroom',
            'çalışma odası': 'home office',
            'ofis': 'home office',
            'yemek odası': 'dining room',
            'balkon': 'home balcony',
            'teras': 'home terrace',
            'çocuk odası': 'children bedroom',
            'misafir odası': 'guest bedroom'
        }
        
        room_lower = room_type.lower()
        for turkish_term, english_term in room_mapping.items():
            if turkish_term in room_lower:
                return english_term
        
        # Fallback: add "home" prefix to make it clear it's residential
        return f"home {room_type.lower()}"
    
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
