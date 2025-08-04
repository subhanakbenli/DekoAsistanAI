"""
Gemini AI için kullanılan tüm prompt şablonları
Merkezi prompt yönetimi için oluşturulmuştur
"""

import json

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
        Imagen 4 için parametrelere odaklı prompt geliştirme talebi
        
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
            str: Parametreler odaklı Imagen prompt geliştirme talebi
        """
        # Map room type to clear home terminology
        home_room_type = PromptUtils.map_room_type_to_home_english(room_type)
        
        return f"""
Sen bir AI görsel üretim uzmanısın. Aşağıdaki **KONUT İÇ MEKAN** tasarım bilgilerini kullanarak kullanıcının verdiği parametrelere TAM UYUMLU Imagen 4 prompt'u oluştur.

**ÖNEMLİ: KULLANICI PARAMETRELERİNE SIKI UYUM KURALLARI:**
- Verilen oda boyutları mutlaka görsele yansıtılmalı
- Seçilen renk paleti odanın DOMİNANT renkleri olmalı  
- Belirtilen ürün kategorileri odada AÇIKÇA GÖRÜNÜR olmalı
- Tasarım stili görselin ana karakterini belirlemeli
- Kullanıcı notları görselde net şekilde yansıtılmalı

**Konut İç Mekan Tasarım Bilgileri:**
- Ev Odası Tipi: {home_room_type}
- Tasarım Stili: {design_style}
{dimensions_info}{color_info}- Kullanıcı Notları: {notes}
- Tasarım Başlığı: {design_title}
- Tasarım Açıklaması: {design_description}

{products_text}

**PARAMETRELERİ YANSITAN PROMPT OLUŞTURMA KURALLARI:**

1. **ODA BOYUTLARI VURGUSU**: Eğer boyut bilgisi varsa, odanın büyüklük hissini prompt'a ekle (spacious/compact/medium-sized)
2. **RENK PALETİ DOMİNANSI**: Verilen renkleri "dominated by [renk], featuring [diğer renkler]" formatında vurgula
3. **ÜRÜN KATEGORİ ODAĞI**: Seçilen kategorilerdeki ürünleri "prominently displaying [kategori], featuring visible [ürün]" şeklinde açıkça belirt
4. **STIL KARAKTERİZASYONU**: Tasarım stilini odanın temel özelliği olarak vurgula
5. **KULLANICI NOTLARI ENTEGRASYONu**: Özel istekleri prompt'un ana parçası olarak dahil et

**Görsel Teknik Gereksinimler:**
- Photo-realistic home interior photography
- Professional interior design visualization  
- Sharp focus on furniture and decor details
- Natural home lighting that enhances color palette
- Wide-angle view showing room proportions accurately

**ÖNEMLİ HATIRLATMALAR:**
- Parametrelere uygun olmayan genel/belirsiz ifadeler kullanma
- Her parametre (boyut, renk, kategori, stil) prompt'ta net şekilde yer almalı
- Odanın EV/KONUT karakteri vurgulanmalı (residential home interior)
- Maksimum 450 karakter limit'i içinde tüm parametreleri dahil et

Sadece parametrelere uyumlu İngilizce prompt'u döndür, açıklama yapma.
"""

    @staticmethod
    def get_fallback_imagen_prompt(room_type: str, design_style: str, width: int = None, length: int = None, color_info: str = "", product_categories: list = None) -> str:
        """
        Imagen 4 için parametrelere uygun yedek konut odası prompt'u (Gemini başarısız olursa)
        
        Args:
            room_type: Ev odası tipi
            design_style: Tasarım stili
            width: Oda genişliği (cm)
            length: Oda uzunluğu (cm) 
            color_info: Renk bilgisi
            product_categories: Ürün kategorileri
            
        Returns:
            str: Parametrelere uygun yedek konut Imagen prompt'u
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
        else:
            home_room_type = f'home {room_type.lower()}'
        
        # Oda boyutu karakterizasyonu
        size_descriptor = ""
        if width and length:
            area = (width * length) / 10000  # cm2 to m2
            if area < 10:
                size_descriptor = "compact "
            elif area > 25:
                size_descriptor = "spacious "
            else:
                size_descriptor = "medium-sized "
        
        # Renk bilgisi analizi
        color_descriptor = ""
        if color_info:
            try:
                import json
                if isinstance(color_info, str):
                    color_data = json.loads(color_info)
                else:
                    color_data = color_info
                
                if isinstance(color_data, dict):
                    if color_data.get('colorName'):
                        color_descriptor = f" dominated by {color_data['colorName'].lower()}"
                    elif color_data.get('dominantColor'):
                        color_descriptor = f" with {color_data['dominantColor'].lower()} color scheme"
            except:
                # Fallback: string olarak kullan
                if 'beyaz' in color_info.lower() or 'white' in color_info.lower():
                    color_descriptor = " dominated by white"
                elif 'siyah' in color_info.lower() or 'black' in color_info.lower():
                    color_descriptor = " dominated by black"
                elif 'gri' in color_info.lower() or 'gray' in color_info.lower():
                    color_descriptor = " dominated by gray"
        
        # Ürün kategorisi vurgusu
        category_descriptor = ""
        if product_categories and len(product_categories) > 0:
            # Kategorileri İngilizce'ye çevir
            category_mappings = {
                'Ev Mobilyaları': 'furniture',
                'Ev Tekstili': 'textiles',
                'Ev Aydınlatması': 'lighting',
                'Ev Dekoratif Objeler': 'decor',
                'Mutfak': 'kitchen items',
                'Banyo': 'bathroom fixtures'
            }
            
            english_categories = []
            for cat in product_categories:
                if isinstance(cat, dict) and cat.get('name'):
                    cat_name = cat['name']
                elif isinstance(cat, str):
                    cat_name = cat
                else:
                    continue
                    
                english_cat = category_mappings.get(cat_name, cat_name.lower())
                english_categories.append(english_cat)
            
            if english_categories:
                category_descriptor = f" prominently featuring {', '.join(english_categories[:2])}"
        
        # Final prompt oluşturma
        prompt = f"Photo-realistic residential {design_style.lower()} style {size_descriptor}{home_room_type} interior{color_descriptor}{category_descriptor}, family house room, cozy domestic space, professional interior photography, natural lighting"
        
        # 450 karakter limitini kontrol et
        if len(prompt) > 450:
            # Kısalt
            prompt = f"Photo-realistic {design_style.lower()} {size_descriptor}{home_room_type}{color_descriptor}{category_descriptor}, residential interior, natural lighting"
        
        return prompt

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
        Ürün listesini Imagen prompt'u için detaylı formatlar - Seçilen kategorileri ve ürünleri vurgular
        
        Args:
            products: Ürün listesi
            
        Returns:
            str: Detaylı formatlanmış ürün metni
        """
        if not products or len(products) == 0:
            return ""
        
        products_by_category = {}
        specific_products = []
        
        for product in products:
            category = product.get('category', 'Genel')
            product_name = product.get('name', '')
            
            # Kategoriye göre grupla
            if category not in products_by_category:
                products_by_category[category] = []
            products_by_category[category].append(product_name)
            
            # Spesifik ürün detayları
            if product_name:
                specific_products.append(product_name)
        
        # Kategorileri vurgulu şekilde formatla
        products_text = "**KULLANICI TARAFINDAN SEÇİLEN ÜRÜN KATEGORİLERİ** (Bu kategorilerden ürünler odada MUTLAKA GÖRÜNÜR olmalı):\n"
        category_names = list(products_by_category.keys())
        
        for category, product_names in products_by_category.items():
            products_text += f"- **{category}** kategorisi: {', '.join(product_names[:3])}\n"  # İlk 3 ürünü göster
        
        # Spesifik ürün listesi
        if specific_products:
            products_text += f"\n**SPESİFİK ÜRÜNLER** (odada görünür olmalı): {', '.join(specific_products[:5])}\n"
        
        # İngilizce kategori çevirisi prompt için
        category_mappings = {
            'Ev Mobilyaları': 'home furniture',
            'Ev Tekstili': 'home textiles and fabrics', 
            'Ev Aydınlatması': 'home lighting fixtures',
            'Ev Dekoratif Objeler': 'home decorative objects',
            'Mutfak': 'kitchen appliances and items',
            'Banyo': 'bathroom fixtures and accessories',
            'Yatak Odası': 'bedroom furniture',
            'Oturma Odası': 'living room furniture'
        }
        
        english_categories = []
        for cat in category_names:
            english_cat = category_mappings.get(cat, cat.lower())
            english_categories.append(english_cat)
        
        if english_categories:
            products_text += f"\n**İMAGEN PROMPT İÇİN KATEGORİ VURGUSU**: Prominently display and feature {', '.join(english_categories)} throughout the room layout\n"
            products_text += f"**VİZÜEL ODAK**: These categories should be clearly visible and form focal points in the interior design\n"
        
        return products_text
    
    @staticmethod
    def extract_dimensions_info_for_imagen(parsed_info: dict) -> str:
        """
        Oda boyutları bilgisini Imagen prompt'u için detaylı formatlar
        
        Args:
            parsed_info: Parse edilmiş kullanıcı bilgileri
            
        Returns:
            str: Detaylı formatlanmış boyut bilgisi
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
