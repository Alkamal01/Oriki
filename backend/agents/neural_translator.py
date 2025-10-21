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
        
    async def translate(self, reasoning_result: Dict[str, Any], question: str, web_fallback: Dict = None) -> Dict[str, Any]:
        """Translate symbolic reasoning to natural language"""
        
        conclusion = reasoning_result["conclusion"]
        chain = reasoning_result["chain"]
        relevant_knowledge = reasoning_result["relevant_knowledge"]
        
        print(f"🔄 Translator.translate called: use_llm={self.use_llm}, has_web_fallback={bool(web_fallback)}, web_answer={bool(web_fallback and web_fallback.get('answer')) if web_fallback else False}")
        print(f"🔄 Conclusion: primary_insight={bool(conclusion.get('primary_insight'))}")
        
        if self.use_llm:
            # Use OpenAI API for translation
            answer = await self._translate_with_llm(conclusion, chain, question, web_fallback)
        else:
            # Fallback to template-based translation
            answer = self._translate_with_template(conclusion, chain, web_fallback)
        
        print(f"✅ Answer generated, length={len(answer)}, starts_with={answer[:50] if answer else 'None'}")
        
        # Extract cultural context
        cultural_context = self._extract_cultural_context(relevant_knowledge)
        
        # Extract sources
        sources = self._extract_sources(relevant_knowledge)
        
        # Add web sources if available
        if web_fallback and web_fallback.get("results"):
            sources.extend([f"Web: {r['title']}" for r in web_fallback["results"][:2]])
        
        return {
            "answer": answer,
            "cultural_context": cultural_context,
            "sources": sources,
            "reasoning_steps": len(chain),
            "used_web_fallback": bool(web_fallback and not conclusion.get("primary_insight")),
            "web_result_data": web_fallback if (web_fallback and not conclusion.get("primary_insight")) else None
        }
    
    async def _translate_with_llm(self, conclusion: Dict, chain: List, question: str, web_fallback: Dict = None) -> str:
        """Use LLM to generate natural language response"""
        
        primary = conclusion.get("primary_insight")
        
        # If no primary insight, check web fallback first
        if not primary:
            if web_fallback and web_fallback.get("answer"):
                print("✅ LLM path: Using web fallback with cultural framing")
                
                # Frame the web result through ancestral wisdom lens
                try:
                    response = self.client.chat.completions.create(
                        model=os.getenv("ASI_MODEL", "qwen/qwen3-32b"),
                        messages=[
                            {
                                "role": "system",
                                "content": "You are a wise cultural elder and keeper of ancestral knowledge from diverse traditions (African, Asian, Indigenous, Middle Eastern, etc.). Your role is to interpret information through the lens of timeless cultural wisdom, drawing connections to traditional values, proverbs, and teachings. Always frame responses to honor ancestral knowledge and cultural heritage."
                            },
                            {
                                "role": "user",
                                "content": f"""A seeker asks: "{question}"

Here is information found: {web_fallback['answer']}

Please respond as a cultural elder would, by:
1. Acknowledging what the seeker asks about
2. Connecting it to ancestral wisdom and cultural values (draw from African Ubuntu, Asian harmony principles, Indigenous balance with nature, etc.)
3. Drawing parallels to traditional teachings when applicable
4. Offering perspective grounded in cultural heritage
5. Keeping the tone warm, respectful, and educational

Respond in 2-3 paragraphs, speaking as a wise elder sharing knowledge."""
                            }
                        ],
                        max_tokens=400,
                        temperature=0.7
                    )
                    
                    culturally_framed_answer = response.choices[0].message.content.strip()
                    
                    return (
                        f"{culturally_framed_answer}\n\n"
                        "---\n\n"
                        "💡 **Note:** This wisdom draws from web sources interpreted through ancestral perspectives. "
                        "If you have cultural knowledge to share, please contribute to help preserve our collective heritage!"
                    )
                    
                except Exception as e:
                    print(f"Cultural framing failed: {e}, using direct answer")
                    return (
                        f"**🌐 From the Web, Through Cultural Lens:**\n\n{web_fallback['answer']}\n\n"
                        "---\n\n"
                        "💡 **Note:** This information was found on the web. "
                        "Consider how ancestral wisdom from your culture might relate to this topic!"
                    )
            else:
                return (
                    "🔍 **Not found in local knowledge base**\n\n"
                    "I couldn't find relevant cultural knowledge to answer your question. "
                    "The database currently contains wisdom from African, Indian, Turkish, and Indigenous cultures. "
                    "\n\n💡 **Suggestions:**\n"
                    "• Try asking about concepts like community, fairness, wisdom, respect, or peace\n"
                    "• Contribute new cultural knowledge to expand the knowledge base\n"
                    "• Rephrase your question with more context\n\n"
                    "🌐 **Tip:** Make sure Tavily search is enabled (TAVILY_API_KEY) for automatic web fallback."
                )
        
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
            return self._translate_with_template(conclusion, chain, web_fallback)
    
    def _translate_with_template(self, conclusion: Dict, chain: List, web_fallback: Dict = None) -> str:
        """Template-based translation (fallback)"""
        
        primary = conclusion.get("primary_insight")
        
        # If no insight was generated, check if we have web fallback
        if not primary:
            if web_fallback and web_fallback.get("answer"):
                # Add cultural framing to web results
                web_answer = web_fallback['answer']
                return (
                    f"**🌍 Ancestral Wisdom Perspective:**\n\n"
                    f"From the knowledge gathered: {web_answer}\n\n"
                    f"**Cultural Reflection:**\n"
                    f"This knowledge reminds us that wisdom transcends borders and time. "
                    f"Across cultures—from African Ubuntu to Asian harmony, from Indigenous balance to Middle Eastern hospitality—"
                    f"we see common threads of human understanding. May this knowledge serve you well on your journey.\n\n"
                    "---\n\n"
                    "💡 **Note:** This wisdom draws from web sources interpreted through cultural perspectives. "
                    "Share your cultural knowledge to help preserve our collective heritage!"
                )
            else:
                return (
                    "🔍 **Not found in local knowledge base**\n\n"
                    "I couldn't find relevant cultural knowledge to answer your question. "
                    "The database currently contains wisdom from African, Indian, Turkish, and Indigenous cultures. "
                    "\n\n💡 **Suggestions:**\n"
                    "• Try asking about concepts like community, fairness, wisdom, respect, or peace\n"
                    "• Contribute new cultural knowledge to expand the knowledge base\n"
                    "• Rephrase your question with more context\n\n"
                    "🌐 **Tip:** Make sure Tavily search is enabled (TAVILY_API_KEY) for automatic web fallback."
                )
        
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
