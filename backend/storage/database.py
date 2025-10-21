"""
Database layer - PostgreSQL with SQLAlchemy
"""
from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime, timezone
import os
import openai
from sqlalchemy import create_engine, Column, String, Text, DateTime, JSON, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

Base = declarative_base()

class KnowledgeEntry(Base):
    __tablename__ = 'knowledge_entries'
    
    id = Column(String, primary_key=True)
    content = Column(Text, nullable=False)
    culture = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    source = Column(String)
    language = Column(String, default='en')
    symbolic_representation = Column(Text)
    ipfs_hash = Column(String)
    processed_data = Column(JSON)
    concepts = Column(JSON)
    themes = Column(JSON)
    patterns = Column(JSON)  # Reasoning patterns for inference
    created_at = Column(DateTime, default=datetime.utcnow)

class Database:
    def __init__(self):
        # Get database URL from environment or use SQLite for demo
        database_url = os.getenv('DATABASE_URL', 'sqlite:///./oriki.db')
        
        # Handle PostgreSQL URL format
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        # Create engine
        if 'sqlite' in database_url:
            # SQLite for local development
            self.engine = create_engine(
                database_url,
                connect_args={"check_same_thread": False},
                poolclass=StaticPool
            )
        else:
            # PostgreSQL for production
            self.engine = create_engine(database_url, pool_pre_ping=True)
        
        # Create tables
        Base.metadata.create_all(bind=self.engine)
        
        # Create session factory
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Setup AI for semantic search
        self.asi_api_key = os.getenv("ASI_API_KEY", "")
        self.asi_base_url = os.getenv("ASI_BASE_URL", "https://inference.asicloud.cudos.org/v1")
        self.use_ai_search = bool(self.asi_api_key)
        
        if self.use_ai_search:
            self.ai_client = openai.OpenAI(
                api_key=self.asi_api_key,
                base_url=self.asi_base_url
            )
        
    async def store_knowledge(self, knowledge_data: Dict[str, Any]) -> str:
        """Store knowledge entry"""
        knowledge_id = str(uuid.uuid4())
        
        session = self.SessionLocal()
        try:
            entry = KnowledgeEntry(
                id=knowledge_id,
                content=knowledge_data["content"],
                culture=knowledge_data["culture"],
                category=knowledge_data["category"],
                source=knowledge_data.get("source"),
                language=knowledge_data.get("language", "en"),
                symbolic_representation=knowledge_data["symbolic_representation"],
                ipfs_hash=knowledge_data.get("ipfs_hash"),
                processed_data=knowledge_data.get("processed_data", {}),
                concepts=knowledge_data.get("processed_data", {}).get("concepts", []),
                themes=knowledge_data.get("processed_data", {}).get("themes", []),
                patterns=knowledge_data.get("processed_data", {}).get("patterns", []),
                created_at=datetime.now(timezone.utc)
            )
            
            session.add(entry)
            session.commit()
            session.refresh(entry)
            
            return knowledge_id
        finally:
            session.close()
    
    async def get_knowledge(self, knowledge_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve specific knowledge entry"""
        session = self.SessionLocal()
        try:
            entry = session.query(KnowledgeEntry).filter(KnowledgeEntry.id == knowledge_id).first()
            if entry:
                return self._entry_to_dict(entry)
            return None
        finally:
            session.close()
    
    def _entry_to_dict(self, entry: KnowledgeEntry) -> Dict[str, Any]:
        """Convert SQLAlchemy model to dict"""
        return {
            "id": entry.id,
            "content": entry.content,
            "culture": entry.culture,
            "category": entry.category,
            "source": entry.source,
            "language": entry.language,
            "symbolic_representation": entry.symbolic_representation,
            "ipfs_hash": entry.ipfs_hash,
            "processed_data": entry.processed_data,
            "concepts": entry.concepts,
            "themes": entry.themes,
            "patterns": entry.patterns if hasattr(entry, 'patterns') else [],
            "created_at": entry.created_at.isoformat() if entry.created_at else None
        }
    
    async def list_knowledge(
        self,
        culture: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """List knowledge entries with optional filters"""
        session = self.SessionLocal()
        try:
            query = session.query(KnowledgeEntry)
            
            # Apply filters
            if culture:
                query = query.filter(KnowledgeEntry.culture == culture)
            if category:
                query = query.filter(KnowledgeEntry.category == category)
            
            # Limit results
            entries = query.limit(limit).all()
            
            return [self._entry_to_dict(entry) for entry in entries]
        finally:
            session.close()
    
    async def query_knowledge(self, query: str) -> List[Dict[str, Any]]:
        """Query knowledge base with AI-powered semantic search"""
        
        print(f"🔍 Database query: '{query}', use_ai_search={self.use_ai_search}")
        
        if self.use_ai_search:
            # Use AI semantic search for better results
            results = await self._ai_semantic_search(query)
        else:
            # Fallback to keyword search
            results = await self._keyword_search(query)
        
        print(f"📊 Database found {len(results)} results")
        if results:
            print(f"   Top result: {results[0].get('content', '')[:100]}")
        
        return results
    
    async def _ai_semantic_search(self, query: str) -> List[Dict[str, Any]]:
        """AI-powered semantic search using ASI Cloud"""
        session = self.SessionLocal()
        
        try:
            # Get all entries
            entries = session.query(KnowledgeEntry).all()
            
            if not entries:
                return []
            
            # Use AI to analyze query and find best matches
            entries_text = []
            for idx, entry in enumerate(entries):
                entry_summary = f"{entry.culture} - {entry.category}: {entry.content[:200]}"
                entries_text.append(f"[{idx}] {entry_summary}")
            
            # Ask AI to rank entries by relevance
            prompt = f"""Given this user query: "{query}"

Analyze these cultural knowledge entries and return ONLY the indices (numbers in brackets) of the most relevant entries, ranked by relevance. Return up to 5 indices as a comma-separated list.

Entries:
{chr(10).join(entries_text[:20])}  

Return format: Just the numbers, e.g., "3,7,1,12,5"
Relevant indices:"""
            
            try:
                response = self.ai_client.chat.completions.create(
                    model=os.getenv("ASI_MODEL", "qwen/qwen3-32b"),
                    messages=[
                        {"role": "system", "content": "You are a cultural knowledge search assistant. Return only the requested indices."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=50,
                    temperature=0.3
                )
                
                # Parse AI response to get indices
                ai_response = response.choices[0].message.content.strip()
                indices = []
                
                # Extract numbers from response
                import re
                numbers = re.findall(r'\d+', ai_response)
                indices = [int(n) for n in numbers if int(n) < len(entries)]
                
                # Build results from AI-ranked indices
                results = []
                for rank, idx in enumerate(indices[:5]):
                    if idx < len(entries):
                        entry_dict = self._entry_to_dict(entries[idx])
                        entry_dict["relevance_score"] = 10 - rank  # Higher score for higher rank
                        results.append(entry_dict)
                
                # If AI didn't return enough results, supplement with keyword search
                if len(results) < 3:
                    keyword_results = await self._keyword_search(query)
                    for kr in keyword_results:
                        if kr["id"] not in [r["id"] for r in results]:
                            results.append(kr)
                            if len(results) >= 5:
                                break
                
                return results
                
            except Exception as e:
                print(f"AI search failed: {e}, falling back to keyword search")
                return await self._keyword_search(query)
                
        finally:
            session.close()
    
    async def _keyword_search(self, query: str) -> List[Dict[str, Any]]:
        """Keyword-based search (fallback)"""
        query_lower = query.lower()
        query_words = query_lower.split()
        session = self.SessionLocal()
        
        try:
            # Get all entries
            entries = session.query(KnowledgeEntry).all()
            print(f"   Keyword search: checking {len(entries)} entries")
            results = []
            
            for entry in entries:
                # Simple relevance scoring
                score = 0
                content_lower = entry.content.lower()
                
                # Check for exact phrase match in content
                if query_lower in content_lower:
                    score += 5
                
                # Check for individual word matches in content
                for word in query_words:
                    if len(word) > 2 and word in content_lower:
                        score += 2
                
                # Check culture field
                if entry.culture and query_lower in entry.culture.lower():
                    score += 3
                
                # Check concepts
                if entry.concepts:
                    for concept in entry.concepts:
                        concept_lower = concept.lower()
                        if concept_lower in query_lower or query_lower in concept_lower:
                            score += 3
                        # Check word matches
                        for word in query_words:
                            if len(word) > 2 and word in concept_lower:
                                score += 1
                
                # Check themes
                if entry.themes:
                    for theme in entry.themes:
                        theme_normalized = theme.replace("_", " ").lower()
                        if theme_normalized in query_lower or query_lower in theme_normalized:
                            score += 3
                        # Check word matches
                        for word in query_words:
                            if len(word) > 2 and word in theme_normalized:
                                score += 1
                
                # Check category
                if entry.category and query_lower in entry.category.lower():
                    score += 2
                
                if score > 0:
                    entry_dict = self._entry_to_dict(entry)
                    entry_dict["relevance_score"] = score
                    results.append(entry_dict)
            
            # Sort by relevance
            results.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
            
            return results[:10]  # Top 10 results
        finally:
            session.close()
    
    async def get_cultures(self) -> List[str]:
        """Get list of all cultures in database"""
        session = self.SessionLocal()
        try:
            # Get distinct cultures
            cultures = session.query(KnowledgeEntry.culture).distinct().all()
            return sorted([c[0] for c in cultures])
        finally:
            session.close()
    
    async def check_health(self) -> bool:
        """Health check"""
        try:
            session = self.SessionLocal()
            # Try a simple query
            session.query(KnowledgeEntry).first()
            session.close()
            return True
        except Exception as e:
            print(f"Database health check failed: {e}")
            return False
