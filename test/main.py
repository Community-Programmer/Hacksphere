import json
from typing import List, Optional
from pydantic import BaseModel
from groq import Groq

# Replace with your actual API key
GROQ_API_KEY = "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"
groq = Groq(api_key=GROQ_API_KEY)

class RoadMapItem(BaseModel):
    lessonNumber: int
    lessonName: str
    objective: str
    topic: Optional[List[str]] = []

def generate_study_roadmap(topic: str):
    prompt = f"""
    Create a structured study roadmap for learning {topic}.
    Each roadmap item should contain:
    - A lesson number (starting from 1).
    - A lesson name (concise).
    - A clear learning objective.
    - A list of key topics covered in this lesson.

    Format the output as a JSON array with each item following this structure:
    {{
        "lessonNumber": <int>,
        "lessonName": "<str>",
        "objective": "<str>",
        "topic": ["<str>", "<str>", ...]
    }}
    """

    response = groq.chat.completions.create(
        model="llama3-8b-8192",  # Choose an appropriate model
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1024
    )

    roadmap_text = response.choices[0].message.content
    print(roadmap_text)

    try:
        roadmap_data = json.loads(roadmap_text)
        structured_roadmap = [RoadMapItem(**item).dict() for item in roadmap_data]
        return json.dumps(structured_roadmap, indent=4)

    except (json.JSONDecodeError, ValueError) as e:
        return json.dumps({"error": "Failed to parse roadmap response", "details": str(e)}, indent=4)

# Example usage
topic = "Machine Learning for Cybersecurity"
roadmap = generate_study_roadmap(topic)
print(roadmap)
