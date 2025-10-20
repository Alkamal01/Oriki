"""
Ingestion Agent - Processes and validates cultural knowledge input
Uses ASI Cloud (CUDOS) for intelligent keyword extraction
"""
import re
import os
from typing import Dict, Any, List
import openai

class IngestionAgent:
    def __init__(self):
        self.categories = ["proverb", "story", "ritual", "medicine", "governance", "ethics"]
        self.asi_api_key = os.getenv("ASI_API_KEY", "")
        self.asi_base_url = os.getenv("ASI_BASE_URL", "https://inference.asicloud.cudos.org/v1")
        self.asi_model = os.getenv("ASI_MODEL", "qwen/qwen3-32b")
        self.use_asi = bool(self.asi_api_key)
        
        if self.use_asi:
            self.client = openai.OpenAI(
                api_key=self.asi_api_key,
                base_url=self.asi_base_url
            )
        
    async def process(self, knowledge: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming cultural knowledge"""
        
        # Extract key concepts using OpenAI or fallback
        concepts = await self._extract_concepts(knowledge["content"])
        
        # Identify themes
        themes = self._identify_themes(knowledge["content"], knowledge["category"])
        
        # Extract entities (people, places, values)
        entities = await self._extract_entities(knowledge["content"])
        
        # Validate cultural context
        validated = self._validate_context(knowledge)
        
        return {
            "original": knowledge,
            "concepts": concepts,
            "themes": themes,
            "entities": entities,
            "validated": validated,
            "metadata": {
                "word_count": len(knowledge["content"].split()),
                "language": knowledge.get("language", "en"),
                "culture": knowledge["culture"]
            }
        }
    
    async def _extract_concepts(self, content: str) -> List[str]:
        """Extract key concepts from content using ASI Cloud"""
        if self.use_asi:
            try:
                response = self.client.chat.completions.create(
                    model=self.asi_model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert in cultural anthropology and knowledge extraction. Extract key concepts from cultural wisdom."
                        },
                        {
                            "role": "user",
                            "content": f"""Extract 3-7 key concepts from this cultural knowledge. Return ONLY a comma-separated list of single words or short phrases (2-3 words max).

Cultural Knowledge: {content}

Key Concepts:"""
                        }
                    ],
                    max_tokens=100,
                    temperature=0.3
                )
                
                concepts_text = response.choices[0].message.content.strip()
                concepts = [c.strip().lower() for c in concepts_text.split(',')]
                return concepts[:7]  # Limit to 7 concepts
                
            except Exception as e:
                print(f"ASI Cloud extraction failed, using fallback: {e}")
                return self._extract_concepts_fallback(content)
        else:
            return self._extract_concepts_fallback(content)
    
    def _extract_concepts_fallback(self, content: str) -> List[str]:
        """Fallback keyword extraction without OpenAI"""
        keywords = [
            "community", "wisdom", "ancestor", "unity", "respect",
            "fairness", "justice", "harmony", "balance", "truth",
            "family", "elder", "tradition", "spirit", "nature"
        ]
        
        content_lower = content.lower()
        found_concepts = [kw for kw in keywords if kw in content_lower]
        
        return found_concepts
    
    def _identify_themes(self, content: str, category: str) -> List[str]:
        """Identify thematic elements"""
        themes = []
        
        theme_patterns = {
            "collective_good": ["community", "together", "we", "collective"],
            "wisdom": ["wisdom", "knowledge", "learn", "teach"],
            "ethics": ["right", "wrong", "moral", "virtue", "honor"],
            "nature": ["earth", "nature", "land", "water", "tree"],
            "spirituality": ["spirit", "ancestor", "divine", "sacred"]
        }
        
        content_lower = content.lower()
        for theme, patterns in theme_patterns.items():
            if any(pattern in content_lower for pattern in patterns):
                themes.append(theme)
        
        return themes
    
    async def _extract_entities(self, content: str) -> Dict[str, List[str]]:
        """Extract entities using ASI Cloud"""
        if self.use_asi:
            try:
                response = self.client.chat.completions.create(
                    model=self.asi_model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert in cultural analysis. Extract values, concepts, and actions from cultural wisdom."
                        },
                        {
                            "role": "user",
                            "content": f"""Analyze this cultural knowledge and extract:
1. Values (moral principles)
2. Concepts (abstract ideas)
3. Actions (behaviors or practices)

Return in format:
Values: word1, word2, word3
Concepts: word1, word2, word3
Actions: word1, word2, word3

Cultural Knowledge: {content}"""
                        }
                    ],
                    max_tokens=150,
                    temperature=0.3
                )
                
                result_text = response.choices[0].message.content.strip()
                entities = self._parse_entities_response(result_text)
                return entities
                
            except Exception as e:
                print(f"ASI Cloud entity extraction failed, using fallback: {e}")
                return self._extract_entities_fallback(content)
        else:
            return self._extract_entities_fallback(content)
    
    def _parse_entities_response(self, response: str) -> Dict[str, List[str]]:
        """Parse OpenAI response into entities dict"""
        entities = {
            "values": [],
            "concepts": [],
            "actions": []
        }
        
        lines = response.split('\n')
        for line in lines:
            if line.startswith('Values:'):
                entities["values"] = [v.strip().lower() for v in line.replace('Values:', '').split(',') if v.strip()]
            elif line.startswith('Concepts:'):
                entities["concepts"] = [c.strip().lower() for c in line.replace('Concepts:', '').split(',') if c.strip()]
            elif line.startswith('Actions:'):
                entities["actions"] = [a.strip().lower() for a in line.replace('Actions:', '').split(',') if a.strip()]
        
        return entities
    
    def _extract_entities_fallback(self, content: str) -> Dict[str, List[str]]:
        """Fallback entity extraction without OpenAI"""
        entities = {
            "values": [],
            "concepts": [],
            "actions": []
        }
        
        # Simple pattern matching
        value_words = ["respect", "honor", "truth", "justice", "fairness", "unity"]
        action_words = ["share", "give", "help", "teach", "learn", "protect"]
        
        content_lower = content.lower()
        
        for value in value_words:
            if value in content_lower:
                entities["values"].append(value)
        
        for action in action_words:
            if action in content_lower:
                entities["actions"].append(action)
        
        return entities
    
    def _validate_context(self, knowledge: Dict[str, Any]) -> bool:
        """Validate that the knowledge has proper context"""
        required_fields = ["content", "culture", "category"]
        
        # Check required fields
        if not all(field in knowledge for field in required_fields):
            return False
        
        # Check content length
        if len(knowledge["content"]) < 10:
            return False
        
        # Check category validity
        if knowledge["category"] not in self.categories:
            return False
        
        return True
