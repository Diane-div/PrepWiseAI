from fastapi import APIRouter
from models.database import TopicContentRequest
from models.groq_service import json_completion

router = APIRouter()

def _prompt(r: TopicContentRequest) -> str:
    subs = ', '.join(r.subtopics) if r.subtopics else 'all key subtopics'
    return f"""You are an expert technical interview coach. Generate comprehensive study content.

Subject: {r.subject}
Topic: {r.topic}
Subtopics: {subs}

Return ONLY a JSON object:
{{
  "title": "{r.topic}",
  "subject": "{r.subject}",
  "difficulty": "Easy",
  "estimated_time": "3 hours",
  "description": "2-3 sentence overview for interview prep",
  "key_concepts": [
    {{"concept": "Name", "explanation": "2-3 sentence explanation", "example": "code or real-world example"}}
  ],
  "theory": "Detailed markdown explanation. Use ## headings, bullet points, code blocks with ```. At least 400 words. Cover definitions, how it works, when to use, common pitfalls.",
  "common_questions": [
    {{"question": "Question text", "difficulty": "Medium", "hint": "Short hint", "approach": "Step-by-step approach", "time_complexity": "O(n)", "space_complexity": "O(1)"}}
  ],
  "code_examples": [
    {{"title": "Example title", "language": "python", "code": "actual working code", "explanation": "what it demonstrates"}}
  ],
  "interview_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "related_topics": ["Topic 1", "Topic 2"]
}}

Include at least 3 key_concepts, 4 common_questions, 2 code_examples."""

@router.post("/content")
def get_content(req: TopicContentRequest):
    try:
        content = json_completion(_prompt(req), max_tokens=3000)
    except Exception:
        content = {"title": req.topic, "subject": req.subject, "difficulty": "Medium",
                   "estimated_time": "3 hours", "description": f"Content for {req.topic}.",
                   "key_concepts": [], "theory": "Could not load content. Please try again.",
                   "common_questions": [], "code_examples": [], "interview_tips": [], "related_topics": []}
    return {"content": content}
