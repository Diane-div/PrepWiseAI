from pydantic import BaseModel
from typing import Optional, List, Dict
import uuid, datetime

# ── In-memory store (swap with PostgreSQL for production) ─────────────────────
users_db: Dict[str, dict] = {}   # email -> user
plans_db: Dict[str, dict] = {}   # user_id -> plan
chats_db: Dict[str, list] = {}   # user_id -> message list

# ── Pydantic schemas ──────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class OnboardingData(BaseModel):
    user_id: str
    target_companies: List[str]
    dsa_topics: List[str]
    oop_level: str
    dbms_level: str
    os_level: str
    cn_level: str
    weeks_left: int
    daily_hours: int
    current_role: str

class ChatMessage(BaseModel):
    user_id: str
    message: str
    conversation_history: Optional[List[dict]] = []

class TopicContentRequest(BaseModel):
    subject: str
    topic: str
    subtopics: Optional[List[str]] = []

# ── Helpers ───────────────────────────────────────────────────────────────────
def create_user(name, email, password):
    uid = str(uuid.uuid4())
    u = {"id": uid, "name": name, "email": email, "password": password, "onboarded": False,
         "created_at": datetime.datetime.utcnow().isoformat()}
    users_db[email] = u
    return u

def get_user_by_email(email): return users_db.get(email)
def get_user_by_id(uid): return next((u for u in users_db.values() if u["id"] == uid), None)
def mark_onboarded(uid):
    for u in users_db.values():
        if u["id"] == uid: u["onboarded"] = True; break

def save_plan(uid, plan): plans_db[uid] = plan
def get_plan(uid): return plans_db.get(uid)
def save_chat(uid, history): chats_db[uid] = history
def get_chat(uid): return chats_db.get(uid, [])
