"""
Search Agent - Enhances responses with real-time web search using Tavily
"""
from typing import Dict, Any, List, Optional
import os
from tavily import TavilyClient

class SearchAgent:
    def __init__(self):
        self.tavily_api_key = os.getenv("TAVILY_API_KEY", "")
        self.use_search = bool(self.tavily_api_key)
        
        if self.use_search:
            self.client = TavilyClient(api_key=self.tavily_api_key)
    
    async def search_cultural_context(
        self,
        query: str,
        culture: Optional[str] = None,
        max_results: int = 3
    ) -> Dict[str, Any]:
        """
        Search for additional cultural context and information
        """
        if not self.use_search:
            print("⚠️  Tavily search disabled - TAVILY_API_KEY not set")
            return {
                "enabled": False,
                "results": [],
                "answer": None,
                "note": "Set TAVILY_API_KEY to enable web search enrichment"
            }
        
        try:
            # Enhance query with cultural context
            search_query = query
            if culture:
                search_query = f"{query} {culture} cultural significance history"
            
            # Tavily has a 400 character limit - truncate if needed
            if len(search_query) > 400:
                # Extract key terms from the query
                search_query = self._extract_key_terms(search_query)[:400]
                print(f"⚠️  Query truncated to fit Tavily's 400 char limit")
            
            print(f"🔍 Searching Tavily for: {search_query}")
            
            # Perform search
            response = self.client.search(
                query=search_query,
                search_depth="advanced",
                max_results=max_results,
                include_answer=True,
                include_raw_content=False
            )
            
            print(f"✅ Tavily search successful - found {len(response.get('results', []))} results")
            
            # Extract relevant information
            results = []
            for result in response.get('results', []):
                results.append({
                    "title": result.get('title', ''),
                    "url": result.get('url', ''),
                    "content": result.get('content', ''),
                    "score": result.get('score', 0)
                })
            
            return {
                "enabled": True,
                "query": search_query,
                "answer": response.get('answer', ''),
                "results": results,
                "sources_count": len(results)
            }
            
        except Exception as e:
            print(f"❌ Tavily search error: {str(e)}")
            return {
                "enabled": True,
                "error": str(e),
                "results": [],
                "answer": None,
                "note": "Search failed, using local knowledge only"
            }
    
    async def enrich_knowledge_entry(
        self,
        content: str,
        culture: str,
        category: str
    ) -> Dict[str, Any]:
        """
        Enrich a knowledge entry with additional context from web search
        """
        if not self.use_search:
            return {
                "enriched": False,
                "original_content": content,
                "additional_context": None
            }
        
        try:
            # Search for related information
            search_query = f"{content[:100]} {culture} {category} cultural meaning"
            
            response = self.client.search(
                query=search_query,
                search_depth="basic",
                max_results=2,
                include_answer=True
            )
            
            additional_context = {
                "web_summary": response.get('answer', ''),
                "related_sources": [
                    {
                        "title": r.get('title', ''),
                        "url": r.get('url', '')
                    }
                    for r in response.get('results', [])[:2]
                ]
            }
            
            return {
                "enriched": True,
                "original_content": content,
                "additional_context": additional_context,
                "sources_found": len(additional_context['related_sources'])
            }
            
        except Exception as e:
            return {
                "enriched": False,
                "original_content": content,
                "error": str(e)
            }
    
    def _extract_key_terms(self, query: str) -> str:
        """Extract key terms from a long query for search"""
        # Remove common filler words
        filler_words = [
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
            'those', 'image', 'analysis', 'shows', 'depicts', 'represents'
        ]
        
        # Split into words and filter
        words = query.lower().split()
        key_words = [w for w in words if w not in filler_words and len(w) > 3]
        
        # Take first 50 words or until we hit 350 chars
        result = ' '.join(key_words[:50])
        return result[:350]
    
    async def verify_cultural_accuracy(
        self,
        content: str,
        culture: str
    ) -> Dict[str, Any]:
        """
        Verify cultural accuracy by cross-referencing with web sources
        """
        if not self.use_search:
            return {
                "verified": False,
                "confidence": "unknown",
                "note": "Verification requires TAVILY_API_KEY"
            }
        
        try:
            # Search for verification
            search_query = f'"{content[:80]}" {culture} authentic traditional'
            
            response = self.client.search(
                query=search_query,
                search_depth="basic",
                max_results=3
            )
            
            results = response.get('results', [])
            
            # Simple verification based on search results
            if len(results) > 0:
                avg_score = sum(r.get('score', 0) for r in results) / len(results)
                confidence = "high" if avg_score > 0.7 else "medium" if avg_score > 0.4 else "low"
            else:
                confidence = "unknown"
            
            return {
                "verified": True,
                "confidence": confidence,
                "sources_found": len(results),
                "verification_sources": [
                    {
                        "title": r.get('title', ''),
                        "url": r.get('url', ''),
                        "relevance": r.get('score', 0)
                    }
                    for r in results
                ]
            }
            
        except Exception as e:
            return {
                "verified": False,
                "confidence": "unknown",
                "error": str(e)
            }
    
    async def find_related_cultures(
        self,
        concept: str,
        origin_culture: str
    ) -> Dict[str, Any]:
        """
        Find similar concepts in other cultures
        """
        if not self.use_search:
            return {
                "found": False,
                "related_cultures": [],
                "note": "Requires TAVILY_API_KEY"
            }
        
        try:
            search_query = f"{concept} similar concepts other cultures traditions worldwide"
            
            response = self.client.search(
                query=search_query,
                search_depth="advanced",
                max_results=5,
                include_answer=True
            )
            
            return {
                "found": True,
                "origin_culture": origin_culture,
                "concept": concept,
                "cross_cultural_summary": response.get('answer', ''),
                "related_findings": [
                    {
                        "title": r.get('title', ''),
                        "content": r.get('content', '')[:200] + "...",
                        "url": r.get('url', '')
                    }
                    for r in response.get('results', [])
                ]
            }
            
        except Exception as e:
            return {
                "found": False,
                "error": str(e),
                "related_cultures": []
            }
    
    def get_status(self) -> Dict[str, Any]:
        """Get search agent status"""
        return {
            "enabled": self.use_search,
            "provider": "Tavily" if self.use_search else None,
            "features": {
                "cultural_context_search": self.use_search,
                "knowledge_enrichment": self.use_search,
                "accuracy_verification": self.use_search,
                "cross_cultural_discovery": self.use_search
            }
        }
