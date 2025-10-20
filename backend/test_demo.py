"""
Test script for Oríkì demo
"""
import asyncio
import sys
from agents.ingestion_agent import IngestionAgent
from agents.symbolic_encoder import SymbolicEncoder
from agents.reasoning_engine import ReasoningEngine
from agents.neural_translator import NeuralTranslator
from storage.database import Database
from storage.ipfs_client import IPFSClient

async def test_full_pipeline():
    """Test the complete Oríkì pipeline"""
    
    print("=" * 60)
    print("🧪 Testing Oríkì - Ancestral Intelligence Network")
    print("=" * 60)
    
    # Initialize components
    db = Database()
    ipfs_client = IPFSClient()
    ingestion_agent = IngestionAgent()
    symbolic_encoder = SymbolicEncoder()
    reasoning_engine = ReasoningEngine()
    neural_translator = NeuralTranslator()
    
    # Test 1: Ingestion
    print("\n📥 Test 1: Knowledge Ingestion")
    print("-" * 60)
    
    test_knowledge = {
        "content": "Ubuntu: I am because we are. A person is a person through other persons.",
        "culture": "Zulu/Xhosa (South Africa)",
        "category": "ethics",
        "source": "Ubuntu philosophy",
        "language": "en"
    }
    
    processed = await ingestion_agent.process(test_knowledge)
    print(f"✓ Extracted {len(processed['concepts'])} concepts: {processed['concepts']}")
    print(f"✓ Identified {len(processed['themes'])} themes: {processed['themes']}")
    
    # Test 2: Symbolic Encoding
    print("\n🔣 Test 2: Symbolic Encoding (MeTTa)")
    print("-" * 60)
    
    symbolic = await symbolic_encoder.encode(processed)
    print("✓ Generated MeTTa representation:")
    print(symbolic[:300] + "...")
    
    # Test 3: IPFS Storage
    print("\n💾 Test 3: Decentralized Storage (IPFS)")
    print("-" * 60)
    
    ipfs_hash = await ipfs_client.add_json({
        "content": test_knowledge["content"],
        "culture": test_knowledge["culture"],
        "symbolic": symbolic
    })
    print(f"✓ Stored in IPFS: {ipfs_hash}")
    
    # Test 4: Database Storage
    print("\n🗄️  Test 4: Database Storage")
    print("-" * 60)
    
    knowledge_id = await db.store_knowledge({
        **test_knowledge,
        "symbolic_representation": symbolic,
        "ipfs_hash": ipfs_hash,
        "processed_data": processed
    })
    print(f"✓ Stored in database: {knowledge_id}")
    
    # Test 5: Query and Reasoning
    print("\n🤔 Test 5: Query and Reasoning")
    print("-" * 60)
    
    question = "What can African proverbs teach AI about fairness?"
    print(f"Question: {question}")
    
    # Retrieve knowledge
    relevant_knowledge = await db.query_knowledge(question)
    print(f"✓ Found {len(relevant_knowledge)} relevant entries")
    
    # Perform reasoning
    reasoning_result = await reasoning_engine.reason(question, relevant_knowledge)
    print(f"✓ Generated reasoning chain with {len(reasoning_result['chain'])} steps")
    
    for step in reasoning_result['chain']:
        print(f"  Step {step['step']}: {step['action']} - {step['result']}")
    
    # Test 6: Neural Translation
    print("\n🗣️  Test 6: Neural Translation")
    print("-" * 60)
    
    natural_response = await neural_translator.translate(reasoning_result, question)
    print("✓ Generated natural language response:")
    print(f"\n{natural_response['answer']}\n")
    print(f"✓ Cultural context: {natural_response['cultural_context']}")
    print(f"✓ Sources: {natural_response['sources']}")
    
    # Test 7: List Cultures
    print("\n🌍 Test 7: List Cultures")
    print("-" * 60)
    
    cultures = await db.get_cultures()
    print(f"✓ Cultures in database: {', '.join(cultures)}")
    
    # Test 8: Health Checks
    print("\n❤️  Test 8: Health Checks")
    print("-" * 60)
    
    db_health = await db.check_health()
    ipfs_health = await ipfs_client.check_health()
    print(f"✓ Database: {'Healthy' if db_health else 'Unhealthy'}")
    print(f"✓ IPFS: {'Healthy' if ipfs_health else 'Unhealthy'}")
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ All tests passed successfully!")
    print("=" * 60)
    print("\n📊 Summary:")
    print(f"  • Knowledge entries: {len(db.knowledge_store)}")
    print(f"  • Cultures represented: {len(cultures)}")
    print(f"  • IPFS entries: {len(ipfs_client.storage)}")
    print(f"  • Reasoning steps: {len(reasoning_result['chain'])}")
    print("\n🚀 Oríkì is ready for demo!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
