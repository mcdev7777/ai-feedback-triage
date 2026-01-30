import json
import os
from typing import Dict, Any
from openai import AsyncOpenAI
import asyncio

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY")
        self.model = os.getenv("LLM_MODEL", "o4-mini-2025-04-16")
        self.base_url = os.getenv("LLM_BASE_URL")
        
        if not self.api_key:
            raise ValueError("LLM_API_KEY environment variable is required")
        
        if self.base_url:
            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
        else:
            self.client = AsyncOpenAI(
                api_key=self.api_key
            )
    
    def _create_prompt(self, feedback_text: str) -> str:
        prompt = f"""You are a feedback analysis agent. Your task is to analyze user feedback and classify it into one of four categories, then assign an urgency score.

Categories:
- "Bug Report": Identifies a technical issue or something that is broken
- "Feature Request": Suggests a new feature or enhancement to an existing one  
- "Praise/Positive Feedback": Expresses satisfaction or appreciation
- "General Inquiry": Asks a question or provides a comment that doesn't fit the other categories

Urgency Scale (1-5):
- 1: Not Urgent
- 2: Low
- 3: Medium  
- 4: High
- 5: Critical

Here are some examples to guide your analysis:

Example 1:
Feedback: "The login page crashes every time I try to sign in with my Google account. This is blocking me from accessing my work files."
Analysis: {{"category": "Bug Report", "urgency_score": 4}}

Example 2:
Feedback: "Would love to see a dark mode option in the settings. It would make using the app at night much easier."
Analysis: {{"category": "Feature Request", "urgency_score": 2}}

Example 3:
Feedback: "Amazing update! The new interface is so much cleaner and faster. Great job team!"
Analysis: {{"category": "Praise/Positive Feedback", "urgency_score": 1}}

Example 4:
Feedback: "How do I change my notification settings? I can't find the option anywhere in the menu."
Analysis: {{"category": "General Inquiry", "urgency_score": 2}}

Example 5:
Feedback: "URGENT: Payment processing is completely broken! Customers can't complete purchases and we're losing revenue!"
Analysis: {{"category": "Bug Report", "urgency_score": 5}}

Example 6:
Feedback: "The search function could be improved with filters for date, category, and price range."
Analysis: {{"category": "Feature Request", "urgency_score": 3}}

Now analyze the following feedback and respond with ONLY a JSON object in this exact format:
{{"category": "category_name", "urgency_score": number}}

Feedback to analyze: "{feedback_text}"

Response:"""
        return prompt
    
    async def analyze_feedback(self, feedback_text: str) -> Dict[str, Any]:
        # Input validation
        if not feedback_text or not feedback_text.strip():
            raise ValueError("Feedback text cannot be empty")
        
        if len(feedback_text) > 1000:
            raise ValueError("Feedback text exceeds maximum length of 1000 characters")
        
        prompt = self._create_prompt(feedback_text.strip())
        
        try:
            response = await asyncio.wait_for(
                self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    max_completion_tokens=100,
                    temperature=0.3
                ),
                timeout=30.0
            )
            
            # Check if response has content
            if not response.choices or not response.choices[0].message.content:
                raise ValueError("Empty response from LLM")
            
            content = response.choices[0].message.content.strip()
            
            # Try to extract JSON even if there's extra text
            content = self._extract_json_from_response(content)
            
            try:
                result = json.loads(content)
                
                # Validate result structure
                if not isinstance(result, dict):
                    raise ValueError("LLM response must be a JSON object")
                
                # Validate required fields
                if "category" not in result:
                    raise ValueError("Missing 'category' field in LLM response")
                if "urgency_score" not in result:
                    raise ValueError("Missing 'urgency_score' field in LLM response")
                
                # Validate category
                valid_categories = ["Bug Report", "Feature Request", "Praise/Positive Feedback", "General Inquiry"]
                if result.get("category") not in valid_categories:
                    raise ValueError(f"Invalid category: {result.get('category')}. Must be one of: {valid_categories}")
                
                # Validate urgency score
                urgency = result.get("urgency_score")
                if not isinstance(urgency, int) or urgency not in [1, 2, 3, 4, 5]:
                    raise ValueError(f"Invalid urgency score: {urgency}. Must be an integer between 1 and 5")
                
                return result
                
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON response from LLM: {content}")
                
        except asyncio.TimeoutError:
            raise Exception("LLM API request timed out")
        except ValueError:
            # Re-raise ValueError exceptions (validation errors) as-is
            raise
        except Exception as e:
            raise Exception(f"LLM API error: {str(e)}")
    
    def _extract_json_from_response(self, content: str) -> str:
        """Extract JSON object from LLM response, handling cases where there might be extra text."""
        content = content.strip()
        
        # Look for JSON object in the response
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            return content[start_idx:end_idx + 1]
        
        # If no JSON braces found, return original content
        return content