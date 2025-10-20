from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
from datetime import datetime

from agents.ingestion_agent import IngestionAgent
from agents.symbolic_encoder import SymbolicEncoder
from agents.reasoning_engine import ReasoningEngine
from agents.neural_translator import NeuralTranslator
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

@app.get("/")
async def root():
    return {
        "message": "Oríkì - The Ancestral Intelligence Network",
        "version": "1.0.0",
        "status": "active"
    }

@app.post("/knowledge/ingest", response_model=KnowledgeResponse)
async def ingest_knowledge(knowledge: KnowledgeInput):
    """Ingest cultural knowledge into the system"""
    try:
        # Step 1: Process through ingestion agent
        processed = await ingestion_agent.process(knowledge.dict())
        
        # Step 2: Encode to symbolic representation (MeTTa)
        symbolic = await symbolic_encoder.encode(processed)
        
        # Step 3: Store in IPFS
        ipfs_hash = await ipfs_client.add_json({
            "content": knowledge.content,
            "culture": knowledge.culture,
            "symbolic": symbolic,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Step 4: Store metadata in database
        knowledge_id = await db.store_knowledge({
            **knowledge.dict(),
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
            created_at=datetime.utcnow().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=ReasoningResponse)
async def query_knowledge(query: QueryInput):
    """Query the cultural knowledge base with reasoning"""
    try:
        # Step 1: Retrieve relevant knowledge from database
        relevant_knowledge = await db.query_knowledge(query.question)
        
        # Step 2: Perform symbolic reasoning with MeTTa
        reasoning_result = await reasoning_engine.reason(
            query.question,
            relevant_knowledge
        )
        
        # Step 3: Translate to natural language
        natural_response = await neural_translator.translate(
            reasoning_result,
            query.question
        )
        
        return ReasoningResponse(
            question=query.question,
            answer=natural_response["answer"],
            reasoning_chain=reasoning_result["chain"],
            cultural_context=natural_response["cultural_context"],
            sources=natural_response["sources"]
        )
    except Exception as e:
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

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": await db.check_health(),
            "ipfs": await ipfs_client.check_health()
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
