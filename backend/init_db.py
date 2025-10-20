"""
Initialize database - Create tables and setup
"""
from storage.database import Database, Base
import asyncio

async def init_database():
    """Initialize the database"""
    print("🔧 Initializing Oríkì database...")
    
    db = Database()
    
    # Tables are created automatically in Database.__init__
    # This script is here for explicit initialization if needed
    
    print("✅ Database initialized successfully!")
    print(f"   Engine: {db.engine.url}")
    
    # Test connection
    health = await db.check_health()
    if health:
        print("✅ Database health check passed")
    else:
        print("❌ Database health check failed")
    
    return db

if __name__ == "__main__":
    asyncio.run(init_database())
