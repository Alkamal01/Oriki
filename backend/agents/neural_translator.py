"""
Neural Translator - Converts symbolic reasoning to natural language using ASI Cloud LLM
"""
from typing import Dict, Any, List
import os
import openai

class NeuralTranslator:
    def __init__(self):
        self.asi_api_key = os.getenv("ASI_API_KEY", "")
        self.asi_base_url = os.getenv("ASI_BASE_URL", "https://inference.asicloud.cudos.org/v1")
        self.asi_model = os.getenv("ASI_MODEL", "qwen/qwen3-32b")
        self.use_llm = bool(self.asi_api_key)
        
        if self.use_llm:
            self.client = openai.OpenAI(
                api_key=self.asi_api_key,
                base_url=self.asi_base_url
            )
        
    async def translate(self, reasoning_result: Dict[str, Any], question: str) -> Dict[str, Any]:
        """Translate symbolic reasoning to natural language"""
        
        conclusion = reasoning_result["conclusion"]
        chain = reasoning_result["chain"]
        relevant_knowledge = reasoning_result["relevant_knowledge"]
        
        if self.use_llm:
            # Use OpenAI API for translation
            answer = await self._translate_with_llm(conclusion, chain, question)
        else:
            # Fallback to template-based translation
            answer = self._translate_with_template(conclusion, chain)
        
        # Extract cultural context
        cultural_context = self._extract_cultural_context(relevant_knowledge)
        
        # Extract sources
        sources = self._extract_sources(relevant_knowledge)
        
        return {
            "answer": answer,
            "cultural_context": cultural_context,
            "sources": sources,
            "reasoning_steps": len(chain)
        }
    
    async def _translate_with_llm(self, conclusion: Dict, chain: List, question: str) -> str:
        """Use LLM to generate natural language response"""
        try:
            import openai
            openai.api_key = self.api_key
            
            # Build context from reasoning chain
            context = "\n".join([
                f"Step {step['step']}: {step['action']} - {step['result']}"
                for step in chain
            ])
            
            prompt = f"""Based on the following symbolic reasoning about cultural wisdom:

Question: {question}

Reasoning Process:
{context}

Conclusion: {conclusion['primary_insight']}

Please provide a clear, culturally sensitive explanation that:
1. Answers the question directly
2. Explains the cultural wisdom behind the answer
3. Shows how ancestral knowledge informs this perspective
4. Is accessible to a general audience

Response:"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a cultural knowledge translator helping people understand ancestral wisdom."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            # Fallback to template if LLM fails
            return self._translate_with_template(conclusion, chain)
    
    def _translate_with_template(self, conclusion: Dict, chain: List) -> str:
        """Template-based translation (fallback)"""
        
        primary = conclusion["primary_insight"]
        supporting = conclusion.get("supporting_insights", [])
        
        answer_parts = [
            f"Based on ancestral wisdom, {primary.lower()}",
        ]
        
        if supporting:
            answer_parts.append(
                f"\n\nAdditionally, cultural knowledge teaches us that {supporting[0].lower()}"
            )
        
        answer_parts.append(
            "\n\nThis perspective comes from analyzing traditional proverbs, stories, and ethical teachings "
            "that have guided communities for generations. The reasoning process involved identifying "
            f"relevant cultural knowledge ({chain[0]['result']}), extracting symbolic patterns, "
            "and applying traditional reasoning principles to derive these insights."
        )
        
        return "".join(answer_parts)
    
    def _extract_cultural_context(self, knowledge_entries: List[Dict]) -> List[str]:
        """Extract cultural context from knowledge entries"""
        contexts = []
        
        for entry in knowledge_entries[:3]:  # Top 3 entries
            culture = entry.get("culture", "Unknown")
            category = entry.get("category", "knowledge")
            contexts.append(f"{culture} {category}")
        
        return list(set(contexts))
    
    def _extract_sources(self, knowledge_entries: List[Dict]) -> List[str]:
        """Extract source references"""
        sources = []
        
        for entry in knowledge_entries[:3]:
            culture = entry.get("culture", "Unknown")
            source = entry.get("source", f"{culture} oral tradition")
            sources.append(source)
        
        return sources
