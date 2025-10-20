"""
Database layer - PostgreSQL with SQLAlchemy
"""
from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime
import os
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
                created_at=datetime.utcnow()
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
        """Query knowledge base with relevance scoring"""
        query_lower = query.lower()
        session = self.SessionLocal()
        
        try:
            # Get all entries (in production, use full-text search)
            entries = session.query(KnowledgeEntry).all()
            results = []
            
            for entry in entries:
                # Simple relevance scoring
                score = 0
                
                # Check content
                if query_lower in entry.content.lower():
                    score += 3
                
                # Check concepts
                if entry.concepts:
                    for concept in entry.concepts:
                        if concept in query_lower:
                            score += 2
                
                # Check themes
                if entry.themes:
                    for theme in entry.themes:
                        if theme.replace("_", " ") in query_lower:
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
