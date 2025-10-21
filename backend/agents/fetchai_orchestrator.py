"""
Fetch.ai Agent Orchestrator
Coordinates decentralized agents for cultural knowledge processing
"""
from uagents import Agent, Context, Model, Bureau
from uagents.setup import fund_agent_if_low
from typing import Dict, Any, List, Optional
import asyncio
import json
from datetime import datetime, timezone
import os


# Message Models for inter-agent communication
class KnowledgeIngestionRequest(Model):
    content: str
    culture: str
    category: str
    source: Optional[str] = None
    language: str = "en"
    request_id: str


class KnowledgeIngestionResponse(Model):
    request_id: str
    processed_data: Dict[str, Any]
    status: str
    timestamp: str


class SymbolicEncodingRequest(Model):
    request_id: str
    processed_data: Dict[str, Any]


class SymbolicEncodingResponse(Model):
    request_id: str
    symbolic_representation: str
    status: str


class ReasoningRequest(Model):
    request_id: str
    question: str
    knowledge_context: List[Dict[str, Any]]


class ReasoningResponse(Model):
    request_id: str
    reasoning_chain: List[Dict[str, Any]]
    conclusions: List[str]
    status: str


class TranslationRequest(Model):
    request_id: str
    reasoning_result: Dict[str, Any]
    question: str


class TranslationResponse(Model):
    request_id: str
    answer: str
    cultural_context: List[str]
    sources: List[str]
    status: str


class FetchAIOrchestrator:
    """Orchestrates decentralized agents using Fetch.ai"""
    
    def __init__(self):
        self.seed = os.getenv("FETCHAI_SEED", "oriki_orchestrator_seed_phrase")
        self.port = int(os.getenv("FETCHAI_PORT", "8001"))
        self.endpoint = [f"http://127.0.0.1:{self.port}/submit"]
        
        # Create main orchestrator agent
        self.orchestrator = Agent(
            name="oriki_orchestrator",
            seed=self.seed,
            port=self.port,
            endpoint=self.endpoint
        )
        
        # Create specialized agents
        self.ingestion_agent = self._create_ingestion_agent()
        self.encoder_agent = self._create_encoder_agent()
        self.reasoning_agent = self._create_reasoning_agent()
        self.translator_agent = self._create_translator_agent()
        
        # Storage for pending requests
        self.pending_requests: Dict[str, Dict[str, Any]] = {}
        
        # Setup message handlers
        self._setup_handlers()
        
        # Create bureau to run all agents
        self.bureau = Bureau(port=self.port)
        self.bureau.add(self.orchestrator)
        self.bureau.add(self.ingestion_agent)
        self.bureau.add(self.encoder_agent)
        self.bureau.add(self.reasoning_agent)
        self.bureau.add(self.translator_agent)
    
    def _create_ingestion_agent(self) -> Agent:
        """Create the knowledge ingestion agent"""
        agent = Agent(
            name="oriki_ingestion",
            seed=f"{self.seed}_ingestion",
            port=self.port + 1,
            endpoint=[f"http://127.0.0.1:{self.port + 1}/submit"]
        )
        
        @agent.on_message(model=KnowledgeIngestionRequest)
        async def handle_ingestion(ctx: Context, sender: str, msg: KnowledgeIngestionRequest):
            ctx.logger.info(f"Processing ingestion request: {msg.request_id}")
            
            # Import here to avoid circular dependencies
            from agents.ingestion_agent import IngestionAgent
            ingestion = IngestionAgent()
            
            # Process the knowledge
            processed = await ingestion.process({
                "content": msg.content,
                "culture": msg.culture,
                "category": msg.category,
                "source": msg.source,
                "language": msg.language
            })
            
            # Send response back to orchestrator
            response = KnowledgeIngestionResponse(
                request_id=msg.request_id,
                processed_data=processed,
                status="success",
                timestamp=datetime.now(timezone.utc).isoformat()
            )
            await ctx.send(sender, response)
        
        return agent
    
    def _create_encoder_agent(self) -> Agent:
        """Create the symbolic encoding agent"""
        agent = Agent(
            name="oriki_encoder",
            seed=f"{self.seed}_encoder",
            port=self.port + 2,
            endpoint=[f"http://127.0.0.1:{self.port + 2}/submit"]
        )
        
        @agent.on_message(model=SymbolicEncodingRequest)
        async def handle_encoding(ctx: Context, sender: str, msg: SymbolicEncodingRequest):
            ctx.logger.info(f"Processing encoding request: {msg.request_id}")
            
            from agents.symbolic_encoder import SymbolicEncoder
            encoder = SymbolicEncoder()
            
            # Encode to symbolic representation
            symbolic = await encoder.encode(msg.processed_data)
            
            response = SymbolicEncodingResponse(
                request_id=msg.request_id,
                symbolic_representation=symbolic,
                status="success"
            )
            await ctx.send(sender, response)
        
        return agent
    
    def _create_reasoning_agent(self) -> Agent:
        """Create the reasoning engine agent"""
        agent = Agent(
            name="oriki_reasoning",
            seed=f"{self.seed}_reasoning",
            port=self.port + 3,
            endpoint=[f"http://127.0.0.1:{self.port + 3}/submit"]
        )
        
        @agent.on_message(model=ReasoningRequest)
        async def handle_reasoning(ctx: Context, sender: str, msg: ReasoningRequest):
            ctx.logger.info(f"Processing reasoning request: {msg.request_id}")
            
            from agents.reasoning_engine import ReasoningEngine
            reasoning = ReasoningEngine()
            
            # Perform reasoning
            result = await reasoning.reason(msg.question, msg.knowledge_context)
            
            response = ReasoningResponse(
                request_id=msg.request_id,
                reasoning_chain=result["chain"],
                conclusions=result.get("conclusions", []),
                status="success"
            )
            await ctx.send(sender, response)
        
        return agent
    
    def _create_translator_agent(self) -> Agent:
        """Create the neural translation agent"""
        agent = Agent(
            name="oriki_translator",
            seed=f"{self.seed}_translator",
            port=self.port + 4,
            endpoint=[f"http://127.0.0.1:{self.port + 4}/submit"]
        )
        
        @agent.on_message(model=TranslationRequest)
        async def handle_translation(ctx: Context, sender: str, msg: TranslationRequest):
            ctx.logger.info(f"Processing translation request: {msg.request_id}")
            
            from agents.neural_translator import NeuralTranslator
            translator = NeuralTranslator()
            
            # Translate to natural language
            result = await translator.translate(msg.reasoning_result, msg.question)
            
            response = TranslationResponse(
                request_id=msg.request_id,
                answer=result["answer"],
                cultural_context=result["cultural_context"],
                sources=result["sources"],
                status="success"
            )
            await ctx.send(sender, response)
        
        return agent
    
    def _setup_handlers(self):
        """Setup message handlers for the orchestrator"""
        
        @self.orchestrator.on_message(model=KnowledgeIngestionResponse)
        async def handle_ingestion_response(ctx: Context, sender: str, msg: KnowledgeIngestionResponse):
            ctx.logger.info(f"Received ingestion response: {msg.request_id}")
            if msg.request_id in self.pending_requests:
                self.pending_requests[msg.request_id]["ingestion_result"] = msg.processed_data
                self.pending_requests[msg.request_id]["status"] = "ingested"
        
        @self.orchestrator.on_message(model=SymbolicEncodingResponse)
        async def handle_encoding_response(ctx: Context, sender: str, msg: SymbolicEncodingResponse):
            ctx.logger.info(f"Received encoding response: {msg.request_id}")
            if msg.request_id in self.pending_requests:
                self.pending_requests[msg.request_id]["symbolic"] = msg.symbolic_representation
                self.pending_requests[msg.request_id]["status"] = "encoded"
        
        @self.orchestrator.on_message(model=ReasoningResponse)
        async def handle_reasoning_response(ctx: Context, sender: str, msg: ReasoningResponse):
            ctx.logger.info(f"Received reasoning response: {msg.request_id}")
            if msg.request_id in self.pending_requests:
                self.pending_requests[msg.request_id]["reasoning"] = {
                    "chain": msg.reasoning_chain,
                    "conclusions": msg.conclusions
                }
                self.pending_requests[msg.request_id]["status"] = "reasoned"
        
        @self.orchestrator.on_message(model=TranslationResponse)
        async def handle_translation_response(ctx: Context, sender: str, msg: TranslationResponse):
            ctx.logger.info(f"Received translation response: {msg.request_id}")
            if msg.request_id in self.pending_requests:
                self.pending_requests[msg.request_id]["final_result"] = {
                    "answer": msg.answer,
                    "cultural_context": msg.cultural_context,
                    "sources": msg.sources
                }
                self.pending_requests[msg.request_id]["status"] = "completed"
    
    async def process_knowledge_ingestion(self, knowledge_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrate the full knowledge ingestion pipeline using decentralized agents
        """
        request_id = f"ingest_{datetime.now(timezone.utc).timestamp()}"
        
        # Initialize request tracking
        self.pending_requests[request_id] = {
            "status": "pending",
            "started_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Send to ingestion agent
        ingestion_request = KnowledgeIngestionRequest(
            content=knowledge_data["content"],
            culture=knowledge_data["culture"],
            category=knowledge_data["category"],
            source=knowledge_data.get("source"),
            language=knowledge_data.get("language", "en"),
            request_id=request_id
        )
        
        # In a real deployment, this would use agent addresses
        # For now, we'll use direct processing
        from agents.ingestion_agent import IngestionAgent
        from agents.symbolic_encoder import SymbolicEncoder
        
        ingestion = IngestionAgent()
        encoder = SymbolicEncoder()
        
        processed = await ingestion.process(knowledge_data)
        symbolic = await encoder.encode(processed)
        
        return {
            "request_id": request_id,
            "processed_data": processed,
            "symbolic_representation": symbolic,
            "status": "completed"
        }
    
    async def process_query(self, question: str, knowledge_context: List[Dict[str, Any]], web_fallback: Dict = None) -> Dict[str, Any]:
        """
        Orchestrate the query processing pipeline using decentralized agents
        """
        request_id = f"query_{datetime.now(timezone.utc).timestamp()}"
        
        # Initialize request tracking
        self.pending_requests[request_id] = {
            "status": "pending",
            "started_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Process through reasoning and translation agents
        from agents.reasoning_engine import ReasoningEngine
        from agents.neural_translator import NeuralTranslator
        
        reasoning = ReasoningEngine()
        translator = NeuralTranslator()
        
        reasoning_result = await reasoning.reason(question, knowledge_context)
        translation_result = await translator.translate(reasoning_result, question, web_fallback=web_fallback)
        
        return {
            "request_id": request_id,
            "reasoning_chain": reasoning_result["chain"],
            "answer": translation_result["answer"],
            "cultural_context": translation_result["cultural_context"],
            "sources": translation_result["sources"],
            "status": "completed"
        }
    
    def run(self):
        """Run the agent bureau"""
        self.bureau.run()
    
    async def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all agents in the network"""
        return {
            "orchestrator": {
                "name": self.orchestrator.name,
                "address": str(self.orchestrator.address),
                "status": "active"
            },
            "agents": {
                "ingestion": {
                    "name": self.ingestion_agent.name,
                    "address": str(self.ingestion_agent.address),
                    "status": "active"
                },
                "encoder": {
                    "name": self.encoder_agent.name,
                    "address": str(self.encoder_agent.address),
                    "status": "active"
                },
                "reasoning": {
                    "name": self.reasoning_agent.name,
                    "address": str(self.reasoning_agent.address),
                    "status": "active"
                },
                "translator": {
                    "name": self.translator_agent.name,
                    "address": str(self.translator_agent.address),
                    "status": "active"
                }
            },
            "pending_requests": len(self.pending_requests),
            "network": "Fetch.ai Testnet"
        }
