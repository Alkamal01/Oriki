"""
Symbolic Encoder - Converts cultural knowledge to MeTTa symbolic representation
"""
from typing import Dict, Any, List

class SymbolicEncoder:
    def __init__(self):
        self.concept_counter = 0
        
    async def encode(self, processed_data: Dict[str, Any]) -> str:
        """Encode processed knowledge into MeTTa format"""
        
        original = processed_data["original"]
        concepts = processed_data["concepts"]
        themes = processed_data["themes"]
        entities = processed_data["entities"]
        
        metta_code = []
        
        # Create main knowledge node
        knowledge_id = self._generate_id(original["culture"], original["category"])
        
        # Define the knowledge concept
        metta_code.append(f"; Cultural Knowledge: {original['category']} from {original['culture']}")
        metta_code.append(f"(: {knowledge_id} (→ CulturalKnowledge))")
        metta_code.append(f"(= ({knowledge_id})")
        metta_code.append(f"   (knowledge")
        metta_code.append(f"      (id \"{knowledge_id}\")")
        metta_code.append(f"      (culture \"{original['culture']}\")")
        metta_code.append(f"      (category \"{original['category']}\")")
        metta_code.append(f"      (content \"{self._escape_string(original['content'][:100])}...\")")
        
        # Add concepts
        if concepts:
            metta_code.append(f"      (concepts {' '.join([f'\"{c}\"' for c in concepts])})")
        
        # Add themes
        if themes:
            metta_code.append(f"      (themes {' '.join([f'\"{t}\"' for t in themes])})")
        
        metta_code.append("   ))")
        metta_code.append("")
        
        # Create reasoning rules based on themes
        for theme in themes:
            rule_code = self._create_reasoning_rule(knowledge_id, theme, entities)
            if rule_code:
                metta_code.append(rule_code)
                metta_code.append("")
        
        # Create relationships
        for concept in concepts:
            relation = self._create_concept_relation(knowledge_id, concept)
            metta_code.append(relation)
        
        return "\n".join(metta_code)
    
    def _generate_id(self, culture: str, category: str) -> str:
        """Generate unique identifier for knowledge"""
        self.concept_counter += 1
        culture_clean = culture.lower().replace(" ", "-")
        category_clean = category.lower().replace(" ", "-")
        return f"{culture_clean}-{category_clean}-{self.concept_counter}"
    
    def _escape_string(self, text: str) -> str:
        """Escape special characters for MeTTa strings"""
        return text.replace('"', '\\"').replace('\n', ' ')
    
    def _create_reasoning_rule(self, knowledge_id: str, theme: str, entities: Dict) -> str:
        """Create reasoning rules based on themes"""
        
        rules = {
            "collective_good": f"""(: rule-{knowledge_id}-collective (→ Rule))
(= (rule-{knowledge_id}-collective)
   (if (has-theme {knowledge_id} "collective_good")
       (implies (value "community-first")
                (principle "individual-serves-collective"))))""",
            
            "ethics": f"""(: rule-{knowledge_id}-ethics (→ Rule))
(= (rule-{knowledge_id}-ethics)
   (if (has-theme {knowledge_id} "ethics")
       (implies (value "moral-action")
                (principle "right-conduct"))))""",
            
            "wisdom": f"""(: rule-{knowledge_id}-wisdom (→ Rule))
(= (rule-{knowledge_id}-wisdom)
   (if (has-theme {knowledge_id} "wisdom")
       (implies (value "ancestral-knowledge")
                (principle "learn-from-elders"))))"""
        }
        
        return rules.get(theme, "")
    
    def _create_concept_relation(self, knowledge_id: str, concept: str) -> str:
        """Create concept relationships"""
        return f"(has-concept {knowledge_id} \"{concept}\")"
