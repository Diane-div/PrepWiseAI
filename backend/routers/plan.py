from fastapi import APIRouter, HTTPException
from models.database import OnboardingData, get_user_by_id, save_plan, get_plan, mark_onboarded
from models.groq_service import json_completion

router = APIRouter()

def _prompt(d: OnboardingData) -> str:
    companies = ', '.join(d.target_companies)
    dsa_done  = ', '.join(d.dsa_topics) if d.dsa_topics else 'None'
    return f"""You are an expert technical interview coach. Create a detailed, personalized study plan.

Student profile:
- Target companies: {companies}
- DSA topics already studied: {dsa_done}
- OOP level: {d.oop_level}
- DBMS level: {d.dbms_level}
- OS level: {d.os_level}
- CN level: {d.cn_level}
- Weeks until interview: {d.weeks_left}
- Daily study hours: {d.daily_hours}
- Current role: {d.current_role}

Return a JSON object with this EXACT structure (no extra keys):
{{
  "summary": "2-3 sentence personalized plan overview",
  "total_weeks": {d.weeks_left},
  "focus_areas": ["DSA", "System Design"],
  "weeks": [
    {{
      "week": 1,
      "theme": "Foundations & Arrays",
      "milestone": "What student can do by end of week",
      "topics": [
        {{
          "subject": "DSA",
          "topic": "Arrays & Strings",
          "subtopics": ["Two Pointers", "Sliding Window"],
          "hours": 8,
          "priority": "high",
          "resources": ["LeetCode Easy Arrays", "NeetCode Arrays"],
          "practice_problems": 15
        }}
      ]
    }}
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "company_specific": {{
    "{d.target_companies[0]}": ["Focus area 1", "Focus area 2"]
  }}
}}

Rules:
- subject must be one of: DSA, OOP, DBMS, OS, CN, System Design
- Cover all subjects proportionally across the {d.weeks_left} weeks
- Already-studied DSA topics: lower priority, schedule for revision only
- Each week 3-6 topics, total hours ~{d.daily_hours * 7} per week
- Include all {d.weeks_left} weeks in the plan"""

@router.post("/generate")
def generate_plan(data: OnboardingData):
    if not get_user_by_id(data.user_id):
        raise HTTPException(404, "User not found")
    try:
        plan = json_completion(_prompt(data), max_tokens=4000)
    except Exception as e:
        raise HTTPException(500, f"Plan generation failed: {e}")
    plan["user_id"] = data.user_id
    plan["target_companies"] = data.target_companies
    plan["onboarding"] = data.model_dump()
    save_plan(data.user_id, plan)
    mark_onboarded(data.user_id)
    return {"plan": plan}

@router.get("/{user_id}")
def get_user_plan(user_id: str):
    plan = get_plan(user_id)
    if not plan: raise HTTPException(404, "No plan found")
    return {"plan": plan}
