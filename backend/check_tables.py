import asyncio
from sqlalchemy import text
from config.database import get_async_session

async def check_tables():
    async for db in get_async_session():
        result = await db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = result.fetchall()
        print('Mevcut tablolar:')
        for table in tables:
            print(f'- {table[0]}')
        break

if __name__ == "__main__":
    asyncio.run(check_tables())
