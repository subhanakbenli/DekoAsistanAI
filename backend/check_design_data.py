#!/usr/bin/env python3
"""
Design tablosundaki verileri inceleyen script
"""
import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from config.database import async_session_maker
from models.design_models_db import Design

async def check_design_table():
    """Design tablosundaki verileri incele"""
    
    async with async_session_maker() as session:
        try:
            print("🔍 Design Tablosu İnceleme Raporu")
            print("=" * 50)
            
            # 1. Toplam kayıt sayısı
            total_count = await session.execute(select(func.count(Design.id)))
            total = total_count.scalar()
            print(f"📊 Toplam tasarım sayısı: {total}")
            
            if total == 0:
                print("❌ Tabloda hiç veri yok!")
                return
                
            # 2. Boyut bilgisi olan kayıtlar
            dimension_query = select(func.count(Design.id)).where(
                Design.width.isnot(None) & 
                Design.length.isnot(None)
            )
            dimension_count = await session.execute(dimension_query)
            dimension_total = dimension_count.scalar()
            print(f"📐 Boyut bilgisi olan tasarımlar: {dimension_total}/{total}")
            
            # 3. En son 5 tasarım
            recent_designs = await session.execute(
                select(Design.id, Design.title, Design.room_type, Design.design_style, 
                       Design.width, Design.length, Design.height, Design.created_at)
                .order_by(Design.created_at.desc())
                .limit(5)
            )
            
            print(f"\n📋 Son 5 Tasarım:")
            print("-" * 80)
            for design in recent_designs:
                dimensions = "❌ Boyut yok"
                if design.width and design.length:
                    if design.height:
                        dimensions = f"📐 {design.width}×{design.length}×{design.height}cm"
                    else:
                        dimensions = f"📐 {design.width}×{design.length}cm"
                        
                print(f"🏠 {design.title[:40]:<40} | {design.room_type:<10} | {design.design_style:<12} | {dimensions}")
                print(f"   ID: {design.id} | Tarih: {design.created_at}")
                print()
                
            # 4. Boyut istatistikleri
            if dimension_total > 0:
                print(f"\n📊 Boyut İstatistikleri:")
                print("-" * 30)
                
                # En büyük ve en küçük odalar
                max_query = await session.execute(
                    select(Design.width, Design.length, Design.title)
                    .where(Design.width.isnot(None) & Design.length.isnot(None))
                    .order_by((Design.width * Design.length).desc())
                    .limit(1)
                )
                max_design = max_query.first()
                if max_design:
                    area = max_design.width * max_design.length / 10000  # m²'ye çevir
                    print(f"🏆 En büyük oda: {max_design.width}×{max_design.length}cm ({area:.1f}m²)")
                    print(f"   Tasarım: {max_design.title}")
                
                min_query = await session.execute(
                    select(Design.width, Design.length, Design.title)
                    .where(Design.width.isnot(None) & Design.length.isnot(None))
                    .order_by((Design.width * Design.length).asc())
                    .limit(1)
                )
                min_design = min_query.first()
                if min_design:
                    area = min_design.width * min_design.length / 10000  # m²'ye çevir
                    print(f"🏠 En küçük oda: {min_design.width}×{min_design.length}cm ({area:.1f}m²)")
                    print(f"   Tasarım: {min_design.title}")
                    
            # 5. Oda tipi ve stil dağılımı
            print(f"\n📊 Oda Tipi Dağılımı:")
            print("-" * 25)
            room_types = await session.execute(
                select(Design.room_type, func.count(Design.id))
                .group_by(Design.room_type)
                .order_by(func.count(Design.id).desc())
                .limit(10)
            )
            for room_type, count in room_types:
                percentage = (count / total) * 100
                print(f"🏠 {room_type:<15}: {count:>3} ({percentage:.1f}%)")
                
            print(f"\n🎨 Tasarım Stili Dağılımı:")
            print("-" * 28)
            design_styles = await session.execute(
                select(Design.design_style, func.count(Design.id))
                .group_by(Design.design_style)
                .order_by(func.count(Design.id).desc())
                .limit(10)
            )
            for design_style, count in design_styles:
                percentage = (count / total) * 100
                print(f"🎨 {design_style:<15}: {count:>3} ({percentage:.1f}%)")
                
        except Exception as e:
            print(f"❌ Hata oluştu: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_design_table())
