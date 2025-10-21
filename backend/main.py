from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from agents.ingestion_agent import IngestionAgent
from agents.symbolic_encoder import SymbolicEncoder
from agents.reasoning_engine import ReasoningEngine
from agents.neural_translator import NeuralTranslator
from agents.fetchai_orchestrator import FetchAIOrchestrator
from agents.multimodal_processor import MultiModalProcessor
from agents.search_agent import SearchAgent
from storage.ipfs_client import IPFSClient
from storage.database import Database

app = FastAPI(title="Oríkì - Ancestral Intelligence Network")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
db = Database()
ipfs_client = IPFSClient()
multimodal_processor = MultiModalProcessor()
search_agent = SearchAgent()

# Option to use Fetch.ai decentralized agents or direct agents
USE_FETCHAI = os.getenv("USE_FETCHAI", "true").lower() == "true"

if USE_FETCHAI:
    # Use Fetch.ai orchestrator for true decentralized multi-agent system
    fetchai_orchestrator = FetchAIOrchestrator()
else:
    # Use direct agents (fallback)
    ingestion_agent = IngestionAgent()
    symbolic_encoder = SymbolicEncoder()
    reasoning_engine = ReasoningEngine()
    neural_translator = NeuralTranslator()

# Pydantic models
class KnowledgeInput(BaseModel):
    content: str
    culture: str
    category: str
    source: Optional[str] = None
    language: Optional[str] = "en"

class QueryInput(BaseModel):
    question: str
    context: Optional[str] = None

class KnowledgeResponse(BaseModel):
    id: str
    content: str
    culture: str
    category: str
    symbolic_representation: str
    ipfs_hash: Optional[str] = None
    created_at: str

class ReasoningResponse(BaseModel):
    question: str
    answer: str
    reasoning_chain: List[Dict[str, Any]]
    cultural_context: List[str]
    sources: List[str]
    used_web_fallback: Optional[bool] = False
    web_result_data: Optional[Dict[str, Any]] = None

@app.get("/")
async def root():
    return {
        "message": "Oríkì - The Ancestral Intelligence Network",
        "version": "1.0.0",
        "status": "active",
        "agent_mode": "fetchai_decentralized" if USE_FETCHAI else "direct"
    }

@app.post("/knowledge/ingest", response_model=KnowledgeResponse)
async def ingest_knowledge(knowledge: KnowledgeInput):
    """Ingest cultural knowledge into the system"""
    try:
        knowledge_data = knowledge.model_dump()
        
        if USE_FETCHAI:
            # Use Fetch.ai decentralized agent orchestration
            result = await fetchai_orchestrator.process_knowledge_ingestion(knowledge_data)
            processed = result["processed_data"]
            symbolic = result["symbolic_representation"]
        else:
            # Use direct agents
            processed = await ingestion_agent.process(knowledge_data)
            symbolic = await symbolic_encoder.encode(processed)
        
        # Store in IPFS
        ipfs_hash = await ipfs_client.add_json({
            "content": knowledge.content,
            "culture": knowledge.culture,
            "symbolic": symbolic,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Store metadata in database
        knowledge_id = await db.store_knowledge({
            **knowledge_data,
            "symbolic_representation": symbolic,
            "ipfs_hash": ipfs_hash,
            "processed_data": processed
        })
        
        return KnowledgeResponse(
            id=knowledge_id,
            content=knowledge.content,
            culture=knowledge.culture,
            category=knowledge.category,
            symbolic_representation=symbolic,
            ipfs_hash=ipfs_hash,
            created_at=datetime.now(timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=ReasoningResponse)
async def query_knowledge(query: QueryInput):
    """Query the cultural knowledge base with reasoning and web search enrichment"""
    try:
        import traceback
        # Retrieve relevant knowledge from database
        relevant_knowledge = await db.query_knowledge(query.question)
        
        # Enrich with web search if available
        search_results = await search_agent.search_cultural_context(
            query.question,
            culture=None,  # Will be extracted from relevant_knowledge if available
            max_results=3
        )
        print(f"🔍 Search results: enabled={search_results.get('enabled')}, has_answer={bool(search_results.get('answer'))}, results_count={len(search_results.get('results', []))}")
        
        if USE_FETCHAI:
            # Use Fetch.ai decentralized agent orchestration
            
            # Check if this is an image query (contains "Image context:" or "image uploaded")
            is_image_query = "image context:" in query.question.lower() or "image uploaded:" in query.question.lower()
            
            # For image queries, prioritize web search over potentially irrelevant local knowledge
            if is_image_query and search_results.get("answer"):
                print(f"📷 Image query detected - using web search results")
                result = await fetchai_orchestrator.process_query(
                    query.question,
                    [],  # Don't use local knowledge for image queries
                    web_fallback=search_results
                )
                
                return ReasoningResponse(
                    question=query.question,
                    answer=result["answer"],
                    reasoning_chain=result["reasoning_chain"],
                    cultural_context=result["cultural_context"],
                    sources=result["sources"],
                    used_web_fallback=True,
                    web_result_data=search_results
                )
            
            # For regular queries, try local knowledge first
            result = await fetchai_orchestrator.process_query(
                query.question,
                relevant_knowledge,
                web_fallback=None  # Don't pass web fallback yet
            )
            
            # Check if we got a useful answer (not the "not found" message)
            has_useful_answer = not result["answer"].startswith("🔍 **Not found")
            
            print(f"📊 FetchAI path - Local knowledge: relevant_count={len(relevant_knowledge)}, has_useful_answer={has_useful_answer}")
            
            # If no useful answer, try again with web fallback
            if not has_useful_answer and search_results.get("answer"):
                print(f"🌐 FetchAI path - Retrying with web fallback")
                result = await fetchai_orchestrator.process_query(
                    query.question,
                    relevant_knowledge,
                    web_fallback=search_results
                )
                
                return ReasoningResponse(
                    question=query.question,
                    answer=result["answer"],
                    reasoning_chain=result["reasoning_chain"],
                    cultural_context=result["cultural_context"],
                    sources=result["sources"],
                    used_web_fallback=True,
                    web_result_data=search_results
                )
            
            # We have local knowledge, optionally enhance with web context
            answer = result["answer"]
            sources = result["sources"]
            
            if has_useful_answer and search_results.get("answer"):
                answer += f"\n\n**Additional Web Context:** {search_results['answer']}"
                if search_results.get("results"):
                    sources.extend([f"Web: {r['title']}" for r in search_results["results"][:2]])
            
            return ReasoningResponse(
                question=query.question,
                answer=answer,
                reasoning_chain=result["reasoning_chain"],
                cultural_context=result["cultural_context"],
                sources=sources,
                used_web_fallback=False,
                web_result_data=None
            )
        else:
            # Use direct agents
            
            # Check if this is an image query
            is_image_query = "image context:" in query.question.lower() or "image uploaded:" in query.question.lower()
            
            # For image queries, prioritize web search
            if is_image_query and search_results.get("answer"):
                print(f"📷 Image query detected - using web search results")
                # Create a simple reasoning result for web-based answer
                reasoning_result = {
                    "chain": [{"step": 1, "action": "web_search", "result": "Using web search for image analysis"}],
                    "conclusion": {"primary_insight": None},
                    "relevant_knowledge": [],
                    "patterns": []
                }
                
                natural_response = await neural_translator.translate(
                    reasoning_result,
                    query.question,
                    web_fallback=search_results
                )
                
                return ReasoningResponse(
                    question=query.question,
                    answer=natural_response["answer"],
                    reasoning_chain=reasoning_result["chain"],
                    cultural_context=["Web Search"],
                    sources=natural_response["sources"],
                    used_web_fallback=True,
                    web_result_data=search_results
                )
            
            # For regular queries, use local knowledge
            reasoning_result = await reasoning_engine.reason(
                query.question,
                relevant_knowledge
            )
            
            # Check if we found local knowledge
            has_local_knowledge = len(relevant_knowledge) > 0 and reasoning_result["conclusion"].get("primary_insight")
            
            print(f"📊 Local knowledge check: relevant_count={len(relevant_knowledge)}, has_insight={bool(reasoning_result['conclusion'].get('primary_insight'))}, has_local={has_local_knowledge}")
            
            # Pass web search as fallback if no local knowledge found
            web_fallback = search_results if not has_local_knowledge else None
            
            print(f"🌐 Web fallback: {'ENABLED' if web_fallback else 'DISABLED'}, has_answer={bool(web_fallback and web_fallback.get('answer')) if web_fallback else False}")
            
            natural_response = await neural_translator.translate(
                reasoning_result,
                query.question,
                web_fallback=web_fallback
            )
            
            # If we have local knowledge, enhance with web context
            answer = natural_response["answer"]
            if has_local_knowledge and search_results.get("answer"):
                answer += f"\n\n**Additional Web Context:** {search_results['answer']}"
            
            return ReasoningResponse(
                question=query.question,
                answer=answer,
                reasoning_chain=reasoning_result["chain"],
                cultural_context=natural_response["cultural_context"],
                sources=natural_response["sources"],
                used_web_fallback=natural_response.get("used_web_fallback", False),
                web_result_data=natural_response.get("web_result_data")
            )
    except Exception as e:
        import traceback
        print(f"❌ Query error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/knowledge/list")
async def list_knowledge(
    culture: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 50
):
    """List stored cultural knowledge"""
    try:
        knowledge_list = await db.list_knowledge(culture, category, limit)
        return {"knowledge": knowledge_list, "count": len(knowledge_list)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/knowledge/{knowledge_id}")
async def get_knowledge(knowledge_id: str):
    """Get specific knowledge entry"""
    try:
        knowledge = await db.get_knowledge(knowledge_id)
        if not knowledge:
            raise HTTPException(status_code=404, detail="Knowledge not found")
        return knowledge
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cultures")
async def list_cultures():
    """List all cultures in the knowledge base"""
    try:
        cultures = await db.get_cultures()
        return {"cultures": cultures}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents/status")
async def get_agent_status():
    """Get status of all agents in the network"""
    try:
        if USE_FETCHAI:
            return await fetchai_orchestrator.get_agent_status()
        else:
            return {
                "mode": "direct",
                "agents": {
                    "ingestion": {"status": "active", "type": "direct"},
                    "encoder": {"status": "active", "type": "direct"},
                    "reasoning": {"status": "active", "type": "direct"},
                    "translator": {"status": "active", "type": "direct"}
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/multimodal/process-audio")
async def process_audio(file: UploadFile = File(...), language: str = "en"):
    """Process audio recording - transcribe oral tradition"""
    try:
        audio_data = await file.read()
        result = await multimodal_processor.process_audio(audio_data, language)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/multimodal/process-image")
async def process_image(file: UploadFile = File(...)):
    """Process image - analyze cultural symbols and artifacts"""
    try:
        image_data = await file.read()
        result = await multimodal_processor.process_image(image_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/multimodal/ingest")
async def ingest_multimodal(
    text: Optional[str] = None,
    culture: str = "",
    category: str = "proverb",
    audio_file: Optional[UploadFile] = File(None),
    image_file: Optional[UploadFile] = File(None),
    source: Optional[str] = None,
    language: str = "en"
):
    """Ingest multi-modal cultural knowledge (text + audio + image)"""
    try:
        audio_result = None
        image_result = None
        
        # Process audio if provided
        if audio_file:
            audio_data = await audio_file.read()
            audio_result = await multimodal_processor.process_audio(audio_data, language)
        
        # Process image if provided
        if image_file:
            image_data = await image_file.read()
            image_result = await multimodal_processor.process_image(image_data)
        
        # Combine all modalities
        combined = await multimodal_processor.combine_multimodal(
            text=text,
            audio_result=audio_result,
            image_result=image_result
        )
        
        # Extract metadata
        metadata = await multimodal_processor.extract_cultural_metadata(combined)
        
        # Create knowledge entry with synthesized content
        knowledge_data = {
            "content": combined["synthesized_content"],
            "culture": culture,
            "category": category,
            "source": source or "Multi-modal submission",
            "language": language
        }
        
        # Process through standard pipeline
        if USE_FETCHAI:
            result = await fetchai_orchestrator.process_knowledge_ingestion(knowledge_data)
            processed = result["processed_data"]
            symbolic = result["symbolic_representation"]
        else:
            processed = await ingestion_agent.process(knowledge_data)
            symbolic = await symbolic_encoder.encode(processed)
        
        # Store in IPFS with multi-modal metadata
        ipfs_data = {
            "content": knowledge_data["content"],
            "culture": culture,
            "symbolic": symbolic,
            "multimodal_metadata": metadata,
            "modalities": combined["modalities"],
            "enriched_context": combined.get("enriched_context", {}),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        ipfs_hash = await ipfs_client.add_json(ipfs_data)
        
        # Store in database
        knowledge_id = await db.store_knowledge({
            **knowledge_data,
            "symbolic_representation": symbolic,
            "ipfs_hash": ipfs_hash,
            "processed_data": processed
        })
        
        return {
            "id": knowledge_id,
            "content": knowledge_data["content"],
            "culture": culture,
            "category": category,
            "symbolic_representation": symbolic,
            "ipfs_hash": ipfs_hash,
            "multimodal_metadata": metadata,
            "modalities_used": combined["modalities"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search/status")
async def search_status():
    """Get search agent status"""
    status = search_agent.get_status()
    # Test search
    test_result = await search_agent.search_cultural_context("test", max_results=1)
    return {
        **status,
        "test_search": {
            "enabled": test_result.get("enabled"),
            "has_results": len(test_result.get("results", [])) > 0,
            "has_answer": bool(test_result.get("answer"))
        }
    }

@app.post("/search/cultural-context")
async def search_cultural_context(query: str, culture: Optional[str] = None):
    """Search for cultural context using web search"""
    try:
        result = await search_agent.search_cultural_context(query, culture)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search/verify")
async def verify_cultural_accuracy(content: str, culture: str):
    """Verify cultural accuracy using web sources"""
    try:
        result = await search_agent.verify_cultural_accuracy(content, culture)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search/related-cultures")
async def find_related_cultures(concept: str, origin_culture: str):
    """Find similar concepts in other cultures"""
    try:
        result = await search_agent.find_related_cultures(concept, origin_culture)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/knowledge/add-from-web")
async def add_web_result_to_knowledge(
    content: str,
    culture: str,
    category: str = "proverb",
    source: str = "Web search result",
    language: str = "en"
):
    """Add a web search result to the knowledge base"""
    try:
        knowledge_data = {
            "content": content,
            "culture": culture,
            "category": category,
            "source": f"Community curated from web: {source}",
            "language": language
        }
        
        # Process through standard pipeline
        if USE_FETCHAI:
            result = await fetchai_orchestrator.process_knowledge_ingestion(knowledge_data)
            processed = result["processed_data"]
            symbolic = result["symbolic_representation"]
        else:
            ingestion_agent = IngestionAgent()
            symbolic_encoder = SymbolicEncoder()
            processed = await ingestion_agent.process(knowledge_data)
            symbolic = await symbolic_encoder.encode(processed)
        
        # Store in IPFS
        ipfs_hash = await ipfs_client.add_json({
            "content": content,
            "culture": culture,
            "symbolic": symbolic,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "community_curated"
        })
        
        # Store in database
        knowledge_id = await db.store_knowledge({
            **knowledge_data,
            "symbolic_representation": symbolic,
            "ipfs_hash": ipfs_hash,
            "processed_data": processed
        })
        
        return {
            "success": True,
            "id": knowledge_id,
            "message": "Web result successfully added to knowledge base!",
            "ipfs_hash": ipfs_hash
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    agent_mode = "fetchai_decentralized" if USE_FETCHAI else "direct"
    search_status = search_agent.get_status()
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent_mode": agent_mode,
        "multimodal_enabled": True,
        "search_enabled": search_status["enabled"],
        "services": {
            "database": await db.check_health(),
            "ipfs": await ipfs_client.check_health(),
            "search": search_status["enabled"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
