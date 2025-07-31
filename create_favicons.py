#!/usr/bin/env python3
"""
Logo dosyasını farklı boyutlarda favicon formatlarına dönüştürür
"""

from PIL import Image
import os

def create_favicons():
    # Logo dosyasını yükle
    logo_path = "logo.png"
    output_dir = "frontend/public"
    
    if not os.path.exists(logo_path):
        print(f"Logo dosyası bulunamadı: {logo_path}")
        return
    
    # Logo dosyasını aç
    with Image.open(logo_path) as img:
        # RGBA formatına dönüştür (şeffaflık için)
        img = img.convert("RGBA")
        
        # Farklı boyutlar için favicon'lar oluştur
        sizes = [
            (16, 16),
            (32, 32),
            (48, 48),
            (64, 64),
            (128, 128),
            (192, 192),
            (256, 256),
            (512, 512)
        ]
        
        # ICO dosyası için boyutlar
        ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
        ico_images = []
        
        for size in sizes:
            # Resmi yeniden boyutlandır (high quality)
            resized_img = img.resize(size, Image.Resampling.LANCZOS)
            
            # PNG dosyalarını kaydet
            if size == (192, 192):
                resized_img.save(os.path.join(output_dir, "logo192.png"), "PNG")
                print("Created logo192.png")
            elif size == (512, 512):
                resized_img.save(os.path.join(output_dir, "logo512.png"), "PNG")
                print("Created logo512.png")
            
            # ICO dosyası için küçük boyutları sakla
            if size in ico_sizes:
                ico_images.append(resized_img.copy())
                print(f"Prepared {size[0]}x{size[1]} for ICO")
        
        # Favicon.ico dosyasını oluştur
        if ico_images:
            ico_images[0].save(
                os.path.join(output_dir, "favicon.ico"),
                format='ICO',
                sizes=[(img.width, img.height) for img in ico_images]
            )
            print("Created favicon.ico")
        
        # Ana logo dosyasını da public klasörüne kopyala
        img.save(os.path.join(output_dir, "logo.png"), "PNG")
        print("Updated logo.png in public folder")
        
        print("Tüm favicon dosyaları başarıyla güncellendi!")

if __name__ == "__main__":
    create_favicons()
