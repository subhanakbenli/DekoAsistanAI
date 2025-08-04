#!/usr/bin/env python3
"""
Imagen Prompt Logging Test Script
Bu script Imagen prompt logging sistemini test eder.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.design.imagen_prompt_log_service import ImagenPromptLogService
import json

def test_imagen_logging():
    """Imagen logging sistemini test et"""
    print("🧪 Imagen Prompt Logging Test Başlıyor...")
    
    # Log servisini başlat
    logger = ImagenPromptLogService()
    
    # 1. Imagen enhancement request log testi
    print("\n1️⃣ Enhancement Request Log Testi...")
    logger.log_imagen_enhancement_request(
        room_type="salon",
        design_style="modern",
        notes="Test notları",
        design_title="Test Tasarım",
        design_description="Test açıklaması",
        products_text="Test ürün metni",
        dimensions_info="400cm x 400cm",
        color_info="Beyaz dominant",
        additional_data={"test": True}
    )
    print("✅ Enhancement request başarıyla loglandı")
    
    # 2. Final prompt log testi
    print("\n2️⃣ Final Prompt Log Testi...")
    logger.log_final_imagen_prompt(
        enhanced_prompt="Photo-realistic modern living room interior with white dominant colors",
        original_request_data={
            "room_type": "salon",
            "design_style": "modern"
        },
        prompt_source="gemini_enhanced",
        additional_data={"test": True}
    )
    print("✅ Final prompt başarıyla loglandı")
    
    # 3. Generation result log testi (başarılı)
    print("\n3️⃣ Generation Result Log Testi (Başarılı)...")
    logger.log_imagen_generation_result(
        enhanced_prompt="Photo-realistic modern living room interior",
        generation_success=True,
        image_data={
            "format": "PNG",
            "aspect_ratio": "1:1"
        },
        generation_time_ms=5000
    )
    print("✅ Başarılı generation result loglandı")
    
    # 4. Generation result log testi (başarısız)
    print("\n4️⃣ Generation Result Log Testi (Başarısız)...")
    logger.log_imagen_generation_result(
        enhanced_prompt="Photo-realistic modern living room interior",
        generation_success=False,
        error_message="Test error message",
        generation_time_ms=2000
    )
    print("✅ Başarısız generation result loglandı")
    
    # 5. Log dosyalarını kontrol et
    print("\n5️⃣ Log Dosyaları Kontrolü...")
    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")
    
    enhancement_logs = logger.get_daily_logs("imagen_enhancement_prompts", today)
    final_logs = logger.get_daily_logs("imagen_final_prompts", today)
    result_logs = logger.get_daily_logs("imagen_generation_results", today)
    
    print(f"📊 Enhancement requests: {len(enhancement_logs)} adet")
    print(f"📊 Final prompts: {len(final_logs)} adet")
    print(f"📊 Generation results: {len(result_logs)} adet")
    
    # 6. Log özeti
    print("\n6️⃣ Log Özeti...")
    summary = logger.get_log_summary(today)
    print(f"📈 Günlük log özeti: {json.dumps(summary, indent=2, ensure_ascii=False)}")
    
    print("\n🎉 Tüm testler başarıyla tamamlandı!")
    return True

if __name__ == "__main__":
    test_imagen_logging()
