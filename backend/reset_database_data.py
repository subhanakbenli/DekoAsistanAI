"""
Database data reset script.
Bu script veritabanındaki tüm tabloların verilerini siler ama tablo yapılarını korur.
alembic_version tablosu korunur.
"""
import asyncio
import sys
from sqlalchemy import text
from config.database import engine
from config.settings import settings

async def reset_database_data():
    """Veritabanındaki tüm verileri sil (alembic_version hariç)."""
    
    print("🚨 DİKKAT: Bu işlem veritabanındaki TÜM VERİLERİ silecek!")
    print("Sadece tablo yapıları korunacak. alembic_version tablosu dokunulmayacak.")
    print(f"Hedef veritabanı: {settings.DB_NAME}")
    print("-" * 50)
    
    # Kullanıcıdan onay al
    confirm = input("Devam etmek istediğinizden emin misiniz? (EVET yazın): ")
    if confirm != "EVET":
        print("İşlem iptal edildi.")
        return
    
    try:
        async with engine.begin() as conn:
            print("🔍 Mevcut tabloları kontrol ediliyor...")
            
            # Tüm tabloları listele (alembic_version hariç)
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                AND table_name != 'alembic_version'
                ORDER BY table_name;
            """))
            
            tables = [row[0] for row in result.fetchall()]
            
            if not tables:
                print("❌ Silinecek tablo bulunamadı.")
                return
                
            print(f"📋 Silinecek tablolar ({len(tables)} adet):")
            for table in tables:
                print(f"  - {table}")
            
            print("\n" + "="*50)
            final_confirm = input("Bu tabloların TÜM VERİLERİNİ silmek istediğinizden emin misiniz? (EVET yazın): ")
            if final_confirm != "EVET":
                print("İşlem iptal edildi.")
                return
            
            print("\n🗑️  Veri silme işlemi başlıyor...")
            
            # Foreign key bağımlılıklarına göre tabloları sırala (child -> parent)
            # Bu sırayla silersek foreign key constraint ihlali yaşamayız
            table_order = [
                'blog_post_likes',      # blog_posts'a bağlı
                'blog_posts',           # designs'a bağlı
                'design_hashtags',      # designs'a bağlı
                'user_favorite_designs', # users ve designs'a bağlı
                'user_favorite_products', # users'a bağlı (designs opsiyonel)
                'mood_boards',          # users ve designs'a bağlı
                'designs',              # users'a bağlı
                'user_profiles',        # users'a bağlı
                'products',             # Bağımsız
                'hashtags',             # Bağımsız
                'users'                 # En son
            ]
            
            # Sadece mevcut tabloları işle, sıralı şekilde
            ordered_tables = [t for t in table_order if t in tables]
            # Listede olmayan tabloları da ekle
            remaining_tables = [t for t in tables if t not in table_order]
            all_tables_ordered = ordered_tables + remaining_tables
            
            # Her tabloyu temizle
            deleted_counts = {}
            for table in all_tables_ordered:
                try:
                    # Önce mevcut kayıt sayısını al
                    count_result = await conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    initial_count = count_result.scalar()
                    
                    if initial_count > 0:
                        # Tüm verileri sil
                        await conn.execute(text(f"DELETE FROM {table}"))
                        deleted_counts[table] = initial_count
                        print(f"  ✅ {table}: {initial_count} kayıt silindi")
                    else:
                        print(f"  ⚪ {table}: Zaten boş")
                        
                except Exception as e:
                    print(f"  ❌ {table}: Hata - {str(e)}")
            
            # Sequence'leri sıfırla (AUTO_INCREMENT ID'ler için)
            print("\n🔢 ID sequence'leri sıfırlanıyor...")
            for table in all_tables_ordered:
                try:
                    # Bu tabloda serial/identity column var mı kontrol et
                    seq_result = await conn.execute(text(f"""
                        SELECT column_name
                        FROM information_schema.columns 
                        WHERE table_name = '{table}' 
                        AND column_default LIKE 'nextval%'
                    """))
                    
                    seq_columns = [row[0] for row in seq_result.fetchall()]
                    
                    for col in seq_columns:
                        # Sequence adını bul ve sıfırla
                        await conn.execute(text(f"""
                            SELECT setval(pg_get_serial_sequence('{table}', '{col}'), 1, false)
                        """))
                        print(f"  ✅ {table}.{col} sequence sıfırlandı")
                        
                except Exception as e:
                    print(f"  ⚠️  {table} sequence sıfırlama: {str(e)}")
            
            print("\n" + "="*50)
            print("✅ VERİTABANI TEMİZLEME TAMAMLANDI!")
            print(f"🔢 Toplam silinen kayıt sayısı: {sum(deleted_counts.values())}")
            
            if deleted_counts:
                print("\n📊 Detaylı rapor:")
                for table, count in deleted_counts.items():
                    print(f"  - {table}: {count} kayıt")
            
            print("\n💡 alembic_version tablosu korundu.")
            print("💡 Tablo yapıları değiştirilmedi.")
            print("💡 ID sequence'leri 1'den başlayacak şekilde sıfırlandı.")
            
    except Exception as e:
        print(f"❌ Hata oluştu: {str(e)}")
        return False
    
    return True

async def verify_reset():
    """Temizleme işlemini doğrula."""
    print("\n🔍 Temizleme işlemi doğrulanıyor...")
    
    try:
        async with engine.begin() as conn:
            # Tüm tabloları kontrol et
            result = await conn.execute(text("""
                SELECT 
                    table_name,
                    (SELECT COUNT(*) FROM information_schema.tables t2 WHERE t2.table_name = t1.table_name) as exists,
                    CASE 
                        WHEN table_name = 'alembic_version' THEN 'KORUNDU'
                        ELSE 'TEMİZLENDİ'
                    END as status
                FROM information_schema.tables t1
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """))
            
            tables = result.fetchall()
            
            print("📋 Tablo durumları:")
            for table_name, exists, status in tables:
                if table_name == 'alembic_version':
                    # alembic_version kayıt sayısını kontrol et
                    count_result = await conn.execute(text("SELECT COUNT(*) FROM alembic_version"))
                    count = count_result.scalar()
                    print(f"  ✅ {table_name}: {status} ({count} kayıt)")
                else:
                    # Diğer tabloların kayıt sayısını kontrol et
                    count_result = await conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                    count = count_result.scalar()
                    if count == 0:
                        print(f"  ✅ {table_name}: BOŞ (0 kayıt)")
                    else:
                        print(f"  ⚠️  {table_name}: {count} kayıt (beklenmeyen!)")
            
    except Exception as e:
        print(f"❌ Doğrulama hatası: {str(e)}")

if __name__ == "__main__":
    print("🗃️  DekoAsistanAI - Veritabanı Veri Temizleme")
    print("=" * 50)
    
    # Ana işlemi çalıştır
    success = asyncio.run(reset_database_data())
    
    if success:
        # Doğrulama yap
        asyncio.run(verify_reset())
        print("\n🎉 İşlem başarıyla tamamlandı!")
    else:
        print("\n💥 İşlem başarısız!")
        sys.exit(1)
