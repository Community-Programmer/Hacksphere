from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import logging
import json
import os
from groq import Groq
from dotenv import load_dotenv
import re

# Enhanced logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()
load_dotenv()

# Initialize Groq client with better error handling
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.error("GROQ_API_KEY not found in environment variables")
    raise ValueError("GROQ_API_KEY is required")

client = Groq(api_key=GROQ_API_KEY)

class CodeSubmission(BaseModel):
    question: str
    answer: str
    language: str

def get_fallback_evaluation():
    return {
        "evaluation": {
            "is_correct": False,
            "error_type": "API_FAILURE",
            "error_message": "AI service temporarily unavailable",
            "test_cases": [
                {
                    "input": "default test case",
                    "expected": "unknown",
                    "actual": "unknown",
                    "passed": False
                }
            ],
            "code_review": {
                "style": {
                    "rating": "needs_improvement",
                    "comments": ["Unable to perform detailed style analysis"]
                },
                "efficiency": {
                    "rating": "unknown",
                    "comments": ["Unable to analyze code efficiency"]
                },
                "best_practices": {
                    "rating": "unknown",
                    "comments": ["Unable to evaluate best practices"]
                }
            },
            "suggestions": [
                "Please try submitting again later",
                "Ensure your code follows standard conventions"
            ]
        }
    }

def extract_json_from_response(response_content: str) -> dict:
    try:
        json_str_match = re.search(r'\{.*\}', response_content, re.DOTALL)
        if json_str_match:
            return json.loads(json_str_match.group())
        raise ValueError("No JSON object found in response")
    except json.JSONDecodeError as e:
        logging.error(f"JSON decoding error: {e}")
        raise HTTPException(status_code=500, detail="Invalid JSON in AI response")
    except Exception as e:
        logging.error(f"Error extracting JSON: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate")
async def evaluate_code(submission: CodeSubmission):
    logger.info(f'Received code evaluation request for language: {submission.language}')
    
    try:
        evaluation_prompt = f"""
        Evaluate the following code solution for the given programming question. 
        Provide a detailed analysis in the following JSON format:
        {{
            "evaluation": {{
                "is_correct": boolean,
                "error_type": string | null,
                "error_message": string | null,
                "test_cases": [
                    {{
                        "input": string,
                        "expected": string,
                        "actual": string,
                        "passed": boolean
                    }}
                ],
                "code_review": {{
                    "style": {{
                        "rating": "excellent" | "good" | "needs_improvement",
                        "comments": [string]
                    }},
                    "efficiency": {{
                        "rating": "excellent" | "good" | "needs_improvement",
                        "comments": [string]
                    }},
                    "best_practices": {{
                        "rating": "excellent" | "good" | "needs_improvement",
                        "comments": [string]
                    }}
                }},
                "suggestions": [string]
            }}
        }}

        Question:
        {submission.question}

        Solution ({submission.language}):
        {submission.answer}

        Evaluate the code for:
        1. Correctness
        2. Potential errors or edge cases
        3. Code style and formatting
        4. Time and space complexity
        5. Best practices
        6. Provide specific suggestions for improvement

        Return ONLY the JSON response with no additional text.
        """

        logger.debug("Sending request to Groq API")
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an expert code evaluator and technical interviewer."},
                    {"role": "user", "content": evaluation_prompt}
                ]
            )
            
            logger.debug(f"Received response from Groq API: {response.choices[0].message.content}")
            evaluation = extract_json_from_response(response.choices[0].message.content)
            return JSONResponse(content=evaluation, status_code=200)

        except Exception as api_error:
            logger.error(f"Groq API Error: {str(api_error)}")
            # Log the full error details for debugging
            logger.exception("Full API error details:")
            return JSONResponse(
                content={
                    "evaluation": {
                        "is_correct": False,
                        "error_type": "API_ERROR",
                        "error_message": f"API Error: {str(api_error)}",
                        "test_cases": [
                            {
                                "input": "API Error occurred",
                                "expected": "Valid response",
                                "actual": str(api_error),
                                "passed": False
                            }
                        ],
                        "code_review": {
                            "style": {"rating": "unknown", "comments": ["API Error occurred"]},
                            "efficiency": {"rating": "unknown", "comments": ["API Error occurred"]},
                            "best_practices": {"rating": "unknown", "comments": ["API Error occurred"]}
                        },
                        "suggestions": ["Please try again in a few moments"]
                    }
                },
                status_code=200
            )

    except Exception as e:
        logger.error(f"General Error: {str(e)}")
        logger.exception("Full error details:")
        return JSONResponse(content=get_fallback_evaluation(), status_code=200)