"""
Multi-Modal Processor - Handles audio, image, and video processing
"""
from typing import Dict, Any, Optional
import os
import base64
from io import BytesIO
import openai
import tempfile

class MultiModalProcessor:
    def __init__(self):
        # Use OpenAI for multi-modal processing (Whisper + GPT-4 Vision)
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.use_openai = bool(self.openai_api_key)
        
        # Fallback to ASI Cloud for text-only
        self.asi_api_key = os.getenv("ASI_API_KEY", "")
        self.asi_base_url = os.getenv("ASI_BASE_URL", "https://inference.asicloud.cudos.org/v1")
        
        if self.use_openai:
            self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
        
        if self.asi_api_key:
            self.asi_client = openai.OpenAI(
                api_key=self.asi_api_key,
                base_url=self.asi_base_url
            )
    
    async def process_audio(self, audio_data: bytes, language: str = "en") -> Dict[str, Any]:
        """
        Process audio recording - transcribe oral tradition using OpenAI Whisper
        """
        try:
            if not self.use_openai:
                return {
                    "transcription": "[Audio transcription requires OpenAI API key]",
                    "language": language,
                    "confidence": 0.0,
                    "duration": "unknown",
                    "type": "oral_tradition",
                    "note": "Set OPENAI_API_KEY to enable audio transcription"
                }
            
            # Save audio to temporary file for Whisper API
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                temp_audio.write(audio_data)
                temp_audio_path = temp_audio.name
            
            try:
                # Use OpenAI Whisper for transcription
                with open(temp_audio_path, "rb") as audio_file:
                    transcript = self.openai_client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file,
                        language=language if language != "en" else None,  # Auto-detect if English
                        response_format="verbose_json"
                    )
                
                result = {
                    "transcription": transcript.text,
                    "language": transcript.language if hasattr(transcript, 'language') else language,
                    "confidence": 0.95,  # Whisper doesn't provide confidence, using high default
                    "duration": str(transcript.duration) if hasattr(transcript, 'duration') else "unknown",
                    "type": "oral_tradition",
                    "metadata": {
                        "model": "whisper-1",
                        "audio_quality": "processed",
                        "segments": len(transcript.segments) if hasattr(transcript, 'segments') else 0
                    }
                }
                
                return result
                
            finally:
                # Clean up temporary file
                import os as os_module
                if os_module.path.exists(temp_audio_path):
                    os_module.unlink(temp_audio_path)
            
        except Exception as e:
            return {
                "error": str(e),
                "transcription": f"[Transcription failed: {str(e)}]",
                "language": language,
                "confidence": 0.0,
                "type": "oral_tradition"
            }
    
    async def process_image(self, image_data: bytes) -> Dict[str, Any]:
        """
        Process image - analyze cultural symbols and artifacts using GPT-4 Vision
        """
        try:
            if not self.use_openai:
                return {
                    "description": "[Image analysis requires OpenAI API key]",
                    "symbols_detected": [],
                    "cultural_context": "unknown",
                    "confidence": 0.0,
                    "note": "Set OPENAI_API_KEY to enable image analysis"
                }
            
            # Convert image to base64 for GPT-4 Vision
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            # Use GPT-4 Vision to analyze the image
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",  # or "gpt-4-vision-preview"
                messages=[
                    {
                        "role": "system",
                        "content": "You are a cultural anthropologist and expert in analyzing artifacts, symbols, and cultural imagery. Provide detailed, respectful analysis of cultural elements."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Analyze this cultural artifact, symbol, or image. Please provide:
1. A detailed description of what you see
2. Any cultural symbols or patterns you can identify
3. Potential cultural significance or context
4. Historical or traditional elements present

Keep your response informative but concise (under 250 words)."""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=400,
                temperature=0.7
            )
            
            description = response.choices[0].message.content.strip()
            
            # Extract potential symbols/patterns from description
            symbols_detected = []
            keywords = ["pattern", "symbol", "motif", "design", "traditional", "geometric", "tribal"]
            for keyword in keywords:
                if keyword in description.lower():
                    symbols_detected.append(keyword)
            
            result = {
                "description": description,
                "symbols_detected": list(set(symbols_detected)),
                "cultural_context": "Analyzed using GPT-4 Vision",
                "confidence": 0.90,
                "metadata": {
                    "model": "gpt-4o-mini",
                    "image_size": len(image_data),
                    "format": "base64_encoded"
                }
            }
            
            return result
            
        except Exception as e:
            return {
                "error": str(e),
                "description": f"[Image analysis failed: {str(e)}]",
                "symbols_detected": [],
                "cultural_context": "unknown",
                "confidence": 0.0
            }
    
    async def combine_multimodal(
        self,
        text: Optional[str] = None,
        audio_result: Optional[Dict] = None,
        image_result: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Combine multiple modalities into unified knowledge entry
        """
        combined = {
            "content": "",
            "modalities": [],
            "enriched_context": {}
        }
        
        # Combine text
        if text:
            combined["content"] = text
            combined["modalities"].append("text")
        
        # Add audio transcription
        if audio_result and audio_result.get("transcription"):
            if combined["content"]:
                combined["content"] += "\n\n[Oral Tradition]: "
            combined["content"] += audio_result["transcription"]
            combined["modalities"].append("audio")
            combined["enriched_context"]["audio"] = {
                "language": audio_result.get("language"),
                "duration": audio_result.get("duration"),
                "confidence": audio_result.get("confidence")
            }
        
        # Add image analysis
        if image_result and image_result.get("description"):
            if combined["content"]:
                combined["content"] += "\n\n[Visual Context]: "
            combined["content"] += image_result["description"]
            combined["modalities"].append("image")
            combined["enriched_context"]["image"] = {
                "symbols": image_result.get("symbols_detected", []),
                "cultural_context": image_result.get("cultural_context"),
                "confidence": image_result.get("confidence")
            }
        
        # Use AI to synthesize if available
        if len(combined["modalities"]) > 1:
            try:
                synthesis_prompt = f"""Synthesize this multi-modal cultural knowledge into a coherent entry:

{combined['content']}

Create a unified description that integrates all modalities (text, audio, visual) into a single coherent cultural knowledge entry. Keep it under 300 words."""

                # Try OpenAI first, fallback to ASI Cloud
                if self.use_openai:
                    response = self.openai_client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[
                            {"role": "system", "content": "You are a cultural knowledge curator synthesizing multi-modal information."},
                            {"role": "user", "content": synthesis_prompt}
                        ],
                        max_tokens=400,
                        temperature=0.7
                    )
                elif self.asi_api_key:
                    response = self.asi_client.chat.completions.create(
                        model=os.getenv("ASI_MODEL", "qwen/qwen3-32b"),
                        messages=[
                            {"role": "system", "content": "You are a cultural knowledge curator synthesizing multi-modal information."},
                            {"role": "user", "content": synthesis_prompt}
                        ],
                        max_tokens=400,
                        temperature=0.7
                    )
                else:
                    combined["synthesized_content"] = combined["content"]
                    return combined
                
                combined["synthesized_content"] = response.choices[0].message.content.strip()
                
            except Exception as e:
                combined["synthesized_content"] = combined["content"]
        else:
            combined["synthesized_content"] = combined["content"]
        
        return combined
    
    async def extract_cultural_metadata(self, multimodal_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract cultural metadata from multi-modal input
        """
        metadata = {
            "modalities_used": multimodal_data.get("modalities", []),
            "richness_score": len(multimodal_data.get("modalities", [])) / 3.0,  # 0-1 scale
            "has_oral_tradition": "audio" in multimodal_data.get("modalities", []),
            "has_visual_context": "image" in multimodal_data.get("modalities", []),
            "has_textual_description": "text" in multimodal_data.get("modalities", []),
        }
        
        # Calculate completeness
        if metadata["richness_score"] >= 0.66:
            metadata["completeness"] = "comprehensive"
        elif metadata["richness_score"] >= 0.33:
            metadata["completeness"] = "moderate"
        else:
            metadata["completeness"] = "basic"
        
        return metadata
