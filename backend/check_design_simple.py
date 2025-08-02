#!/usr/bin/env python3
"""
Design tablosundaki verileri inceleyen basit script
"""
import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from config.database import async_session_maker

async def check_design_table_simple():
    """Design tablosundaki verileri SQL sorguları ile incele"""
    
    async with async_session_maker() as session:
        try:
            print("🔍 Design Tablosu İnceleme Raporu")
            print("=" * 50)
            
            # 1. Tablo bilgileri
            table_info = await session.execute(text("""
                SELECT 
                    column_name,
                    data_type,
                    is_nullable,
                    column_default
                FROM information_schema.columns 
                WHERE table_name = 'designs'
                ORDER BY ordinal_position;
            """))
            
            print("📋 Tablo Yapısı (designs):")
            print("-" * 60)
            for row in table_info:
                nullable = "NULL" if row.is_nullable == "YES" else "NOT NULL"
                default = f" DEFAULT {row.column_default}" if row.column_default else ""
                print(f"  {row.column_name:<20} | {row.data_type:<15} | {nullable}{default}")
            
            # 2. Toplam kayıt sayısı
            total_result = await session.execute(text("SELECT COUNT(*) FROM designs"))
            total = total_result.scalar()
            print(f"\n📊 Toplam tasarım sayısı: {total}")
            
            if total == 0:
                print("❌ Tabloda hiç veri yok!")
                return
                
            # 3. Boyut bilgisi olan kayıtlar
            dimension_result = await session.execute(text("""
                SELECT COUNT(*) FROM designs 
                WHERE width IS NOT NULL AND length IS NOT NULL
            """))
            dimension_total = dimension_result.scalar()
            print(f"📐 Boyut bilgisi olan tasarımlar: {dimension_total}/{total}")
            
            # 4. Son 5 tasarım
            recent_designs = await session.execute(text("""
                SELECT 
                    id, title, room_type, design_style, 
                    width, length, height, created_at
                FROM designs 
                ORDER BY created_at DESC 
                LIMIT 5
            """))
            
            print(f"\n📋 Son 5 Tasarım:")
            print("-" * 80)
            for design in recent_designs:
                dimensions = "❌ Boyut yok"
                if design.width and design.length:
                    if design.height:
                        dimensions = f"📐 {design.width}×{design.length}×{design.height}cm"
                    else:
                        dimensions = f"📐 {design.width}×{design.length}cm"
                        
                title_short = design.title[:40] if design.title else "Başlıksız"
                print(f"🏠 {title_short:<40} | {design.room_type:<10} | {design.design_style:<12} | {dimensions}")
                print(f"   ID: {design.id} | Tarih: {design.created_at}")
                print()
                
            # 5. Boyut istatistikleri
            if dimension_total > 0:
                print(f"📊 Boyut İstatistikleri:")
                print("-" * 30)
                
                # En büyük oda
                max_result = await session.execute(text("""
                    SELECT width, length, height, title
                    FROM designs 
                    WHERE width IS NOT NULL AND length IS NOT NULL
                    ORDER BY (width * length) DESC 
                    LIMIT 1
                """))
                max_design = max_result.first()
                if max_design:
                    area = (max_design.width * max_design.length) / 10000  # m²'ye çevir
                    print(f"🏆 En büyük oda: {max_design.width}×{max_design.length}cm ({area:.1f}m²)")
                    print(f"   Tasarım: {max_design.title}")
                
                # En küçük oda
                min_result = await session.execute(text("""
                    SELECT width, length, height, title
                    FROM designs 
                    WHERE width IS NOT NULL AND length IS NOT NULL
                    ORDER BY (width * length) ASC 
                    LIMIT 1
                """))
                min_design = min_result.first()
                if min_design:
                    area = (min_design.width * min_design.length) / 10000  # m²'ye çevir
                    print(f"🏠 En küçük oda: {min_design.width}×{min_design.length}cm ({area:.1f}m²)")
                    print(f"   Tasarım: {min_design.title}")
                    
            # 6. Oda tipi dağılımı
            print(f"\n📊 Oda Tipi Dağılımı:")
            print("-" * 25)
            room_types = await session.execute(text("""
                SELECT room_type, COUNT(*) as count
                FROM designs 
                GROUP BY room_type 
                ORDER BY count DESC 
                LIMIT 10
            """))
            for row in room_types:
                percentage = (row.count / total) * 100
                print(f"🏠 {row.room_type:<15}: {row.count:>3} ({percentage:.1f}%)")
                
            # 7. Tasarım stili dağılımı
            print(f"\n🎨 Tasarım Stili Dağılımı:")
            print("-" * 28)
            design_styles = await session.execute(text("""
                SELECT design_style, COUNT(*) as count
                FROM designs 
                GROUP BY design_style 
                ORDER BY count DESC 
                LIMIT 10
            """))
            for row in design_styles:
                percentage = (row.count / total) * 100
                print(f"🎨 {row.design_style:<15}: {row.count:>3} ({percentage:.1f}%)")
                
        except Exception as e:
            print(f"❌ Hata oluştu: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_design_table_simple())
