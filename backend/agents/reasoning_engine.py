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
        conclusion = self._synthesize_conclusion(inferences, intent, relevant)
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
        # If database already scored entries, use those
        if knowledge_entries and knowledge_entries[0].get("relevance_score", 0) > 0:
            return knowledge_entries[:5]  # Top 5 from database
        
        # Otherwise, score them here
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
            # First priority: use AI-extracted patterns from ingestion
            entry_patterns = entry.get("patterns", [])
            if entry_patterns:
                patterns.extend(entry_patterns)
                print(f"   Using AI-extracted patterns: {entry_patterns}")
            
            themes = entry.get("themes", [])
            concepts = entry.get("concepts", [])
            culture = entry.get("culture", "")
            content = entry.get("content", "")
            
            # Fallback: Extract key concepts from content
            if "peace" in content.lower() or "harmony" in content.lower():
                patterns.append(f"{culture}: peace_and_harmony_principle")
            
            if "community" in content.lower() or "collective" in content.lower():
                patterns.append(f"{culture}: community_first_principle")
            
            if "truth" in content.lower() or "honesty" in content.lower():
                patterns.append(f"{culture}: truth_and_integrity_principle")
            
            if "respect" in content.lower() or "dignity" in content.lower():
                patterns.append(f"{culture}: human_dignity_principle")
            
            # Pattern: If theme X, then principle Y
            if "collective_good" in themes:
                patterns.append("collective_good")
            if "ethics" in themes and "fairness" in concepts:
                patterns.append("ethics")
            if "wisdom" in themes:
                patterns.append("wisdom")
        
        return list(set(patterns))  # Remove duplicates
    
    def _apply_rules(self, patterns: List[str], intent: Dict) -> List[str]:
        """Apply reasoning rules to generate inferences"""
        inferences = []
        
        # Map patterns to philosophical insights
        pattern_insights = {
            "humility": "Humility reminds us that no matter how far we travel or how much we achieve, we remain connected to our origins and roots",
            "collective_good": "Individual wellbeing is interconnected with collective prosperity",
            "wisdom_transmission": "Ancestral knowledge provides time-tested principles passed down through generations",
            "ethics": "Moral principles guide us toward justice and fairness in our communities",
            "reciprocity": "What we give to others returns to us; mutual exchange strengthens bonds",
            "resilience": "Strength comes from enduring challenges and learning from adversity",
            "truth_integrity": "Truth and integrity form the foundation of lasting relationships and societies",
            "human_dignity": "Respect for human dignity transcends social status and material wealth",
            "unity_diversity": "Strength emerges from unity while celebrating our differences",
            "nature_harmony": "Balance with the natural world sustains both humanity and the earth",
            "spirituality": "Connection to ancestors and the divine provides guidance and meaning",
            "respect_hierarchy": "Honoring elders and wisdom-keepers preserves cultural knowledge"
        }
        
        for pattern in patterns:
            # Check if we have a direct mapping
            for key, insight in pattern_insights.items():
                if key in pattern.lower():
                    inferences.append(insight)
                    break
            
            # Legacy pattern matching
            if "peace_and_harmony" in pattern:
                inferences.append("Peace and harmony are achieved through mutual understanding and reconciliation")
            if "community_first" in pattern:
                inferences.append("Individual wellbeing is interconnected with collective prosperity")
        
        return list(set(inferences))  # Remove duplicates
    
    def _synthesize_conclusion(self, inferences: List[str], intent: Dict, relevant_knowledge: List[Dict] = None) -> Dict[str, Any]:
        """Synthesize final conclusion from inferences"""
        if not inferences:
            # If no pattern-based inferences but we have relevant knowledge, use the content directly
            if relevant_knowledge and len(relevant_knowledge) > 0:
                top_entry = relevant_knowledge[0]
                content = top_entry.get("content", "")
                culture = top_entry.get("culture", "Unknown")
                
                if content:
                    return {
                        "primary_insight": f"According to {culture} wisdom: {content}",
                        "supporting_insights": [],
                        "reasoning_type": "direct_knowledge",
                        "confidence": "high"
                    }
            
            return {
                "primary_insight": None,
                "supporting_insights": [],
                "reasoning_type": intent["type"],
                "confidence": "none"
            }
        
        return {
            "primary_insight": inferences[0],
            "supporting_insights": inferences[1:] if len(inferences) > 1 else [],
            "reasoning_type": intent["type"],
            "confidence": "high" if len(inferences) >= 2 else "medium"
        }
