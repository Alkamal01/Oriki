"""
Reasoning Engine - Performs symbolic reasoning using MeTTa-like logic
"""
from typing import Dict, Any, List
import re

class ReasoningEngine:
    def __init__(self):
        self.knowledge_graph = {}
        self.reasoning_rules = []
        
    async def reason(self, question: str, knowledge_entries: List[Dict]) -> Dict[str, Any]:
        """Perform symbolic reasoning on the question"""
        
        # Parse question to extract intent
        intent = self._parse_question(question)
        
        # Build reasoning chain
        reasoning_chain = []
        
        # Step 1: Identify relevant knowledge
        relevant = self._find_relevant_knowledge(intent, knowledge_entries)
        reasoning_chain.append({
            "step": 1,
            "action": "identify_relevant_knowledge",
            "result": f"Found {len(relevant)} relevant cultural knowledge entries",
            "details": [k.get("culture", "unknown") for k in relevant]
        })
        
        # Step 2: Extract symbolic patterns
        patterns = self._extract_patterns(relevant)
        reasoning_chain.append({
            "step": 2,
            "action": "extract_symbolic_patterns",
            "result": f"Identified {len(patterns)} reasoning patterns",
            "details": patterns
        })
        
        # Step 3: Apply reasoning rules
        inferences = self._apply_rules(patterns, intent)
        reasoning_chain.append({
            "step": 3,
            "action": "apply_reasoning_rules",
            "result": f"Generated {len(inferences)} inferences",
            "details": inferences
        })
        
        # Step 4: Synthesize conclusion
        conclusion = self._synthesize_conclusion(inferences, intent)
        reasoning_chain.append({
            "step": 4,
            "action": "synthesize_conclusion",
            "result": "Generated final reasoning",
            "details": conclusion
        })
        
        return {
            "chain": reasoning_chain,
            "conclusion": conclusion,
            "relevant_knowledge": relevant,
            "patterns": patterns
        }
    
    def _parse_question(self, question: str) -> Dict[str, Any]:
        """Parse question to understand intent"""
        question_lower = question.lower()
        
        intent = {
            "type": "general",
            "concepts": [],
            "seeking": "knowledge"
        }
        
        # Identify question type
        if any(word in question_lower for word in ["teach", "learn", "lesson"]):
            intent["type"] = "learning"
            intent["seeking"] = "wisdom"
        elif any(word in question_lower for word in ["fair", "just", "right", "wrong", "ethical"]):
            intent["type"] = "ethical"
            intent["seeking"] = "moral_guidance"
        elif any(word in question_lower for word in ["community", "together", "collective"]):
            intent["type"] = "social"
            intent["seeking"] = "social_principle"
        
        # Extract key concepts
        concept_keywords = [
            "fairness", "justice", "community", "wisdom", "respect",
            "honor", "truth", "unity", "balance", "harmony"
        ]
        
        for concept in concept_keywords:
            if concept in question_lower:
                intent["concepts"].append(concept)
        
        return intent
    
    def _find_relevant_knowledge(self, intent: Dict, knowledge_entries: List[Dict]) -> List[Dict]:
        """Find knowledge entries relevant to the intent"""
        relevant = []
        
        for entry in knowledge_entries:
            score = 0
            
            # Check if concepts match
            entry_concepts = entry.get("concepts", [])
            for concept in intent["concepts"]:
                if concept in entry_concepts:
                    score += 2
            
            # Check if themes match intent type
            entry_themes = entry.get("themes", [])
            if intent["type"] == "ethical" and "ethics" in entry_themes:
                score += 3
            if intent["type"] == "social" and "collective_good" in entry_themes:
                score += 3
            if intent["type"] == "learning" and "wisdom" in entry_themes:
                score += 3
            
            if score > 0:
                entry["relevance_score"] = score
                relevant.append(entry)
        
        # Sort by relevance
        relevant.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
        
        return relevant[:5]  # Top 5 most relevant
    
    def _extract_patterns(self, knowledge_entries: List[Dict]) -> List[str]:
        """Extract reasoning patterns from knowledge"""
        patterns = []
        
        for entry in knowledge_entries:
            themes = entry.get("themes", [])
            concepts = entry.get("concepts", [])
            
            # Pattern: If theme X, then principle Y
            if "collective_good" in themes:
                patterns.append("collective_good → community_first_principle")
            if "ethics" in themes and "fairness" in concepts:
                patterns.append("ethics + fairness → justice_through_community")
            if "wisdom" in themes:
                patterns.append("wisdom → ancestral_knowledge_principle")
        
        return list(set(patterns))  # Remove duplicates
    
    def _apply_rules(self, patterns: List[str], intent: Dict) -> List[str]:
        """Apply reasoning rules to generate inferences"""
        inferences = []
        
        for pattern in patterns:
            if "collective_good" in pattern and intent["type"] == "ethical":
                inferences.append(
                    "Fairness is achieved through prioritizing collective well-being over individual gain"
                )
            if "ethics" in pattern and "fairness" in intent["concepts"]:
                inferences.append(
                    "Justice emerges from community consensus and shared responsibility"
                )
            if "wisdom" in pattern:
                inferences.append(
                    "Ancestral knowledge provides time-tested principles for ethical decision-making"
                )
        
        # Add general inference if specific ones not found
        if not inferences:
            inferences.append(
                "Cultural wisdom emphasizes interconnectedness and collective responsibility"
            )
        
        return inferences
    
    def _synthesize_conclusion(self, inferences: List[str], intent: Dict) -> Dict[str, Any]:
        """Synthesize final conclusion from inferences"""
        return {
            "primary_insight": inferences[0] if inferences else "No specific insight generated",
            "supporting_insights": inferences[1:] if len(inferences) > 1 else [],
            "reasoning_type": intent["type"],
            "confidence": "high" if len(inferences) >= 2 else "medium"
        }
