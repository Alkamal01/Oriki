"""
Script to seed the database with example cultural knowledge
"""
import asyncio
import sys
from seed_data import SEED_KNOWLEDGE
from agents.ingestion_agent import IngestionAgent
from agents.symbolic_encoder import SymbolicEncoder
from storage.database import Database
from storage.ipfs_client import IPFSClient
from datetime import datetime, timezone

async def seed_database():
    """Seed database with example knowledge"""
    print("🌱 Seeding Oríkì database with cultural knowledge...")
    
    # Initialize components
    db = Database()
    ipfs_client = IPFSClient()
    ingestion_agent = IngestionAgent()
    symbolic_encoder = SymbolicEncoder()
    
    for idx, knowledge in enumerate(SEED_KNOWLEDGE, 1):
        try:
            print(f"\n[{idx}/{len(SEED_KNOWLEDGE)}] Processing: {knowledge['culture']} - {knowledge['category']}")
            
            # Process through ingestion agent
            processed = await ingestion_agent.process(knowledge)
            print(f"  ✓ Extracted {len(processed['concepts'])} concepts, {len(processed['themes'])} themes")
            
            # Encode to symbolic representation
            symbolic = await symbolic_encoder.encode(processed)
            print(f"  ✓ Generated MeTTa symbolic representation")
            
            # Store in IPFS
            ipfs_hash = await ipfs_client.add_json({
                "content": knowledge["content"],
                "culture": knowledge["culture"],
                "symbolic": symbolic,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
            print(f"  ✓ Stored in IPFS: {ipfs_hash[:20]}...")
            
            # Store in database
            knowledge_id = await db.store_knowledge({
                **knowledge,
                "symbolic_representation": symbolic,
                "ipfs_hash": ipfs_hash,
                "processed_data": processed
            })
            print(f"  ✓ Stored in database: {knowledge_id}")
            
        except Exception as e:
            print(f"  ✗ Error processing entry: {e}")
            continue
    
    print(f"\n✅ Successfully seeded {len(SEED_KNOWLEDGE)} knowledge entries")
    cultures = await db.get_cultures()
    print(f"📚 Cultures represented: {', '.join(cultures)}")
    
    return db

if __name__ == "__main__":
    asyncio.run(seed_database())
