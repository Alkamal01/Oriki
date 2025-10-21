"""
Migration script to add patterns column to knowledge_entries table
"""
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def migrate():
    """Add patterns column to existing database"""
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ DATABASE_URL not found in environment")
        return
    
    print(f"🔄 Connecting to database...")
    engine = create_engine(database_url)
    
    try:
        with engine.connect() as conn:
            # Check if column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='knowledge_entries' 
                AND column_name='patterns'
            """))
            
            if result.fetchone():
                print("✅ Column 'patterns' already exists")
                return
            
            # Add the patterns column
            print("📝 Adding 'patterns' column...")
            conn.execute(text("""
                ALTER TABLE knowledge_entries 
                ADD COLUMN patterns JSON
            """))
            conn.commit()
            
            print("✅ Migration successful! Column 'patterns' added to knowledge_entries table")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    migrate()
