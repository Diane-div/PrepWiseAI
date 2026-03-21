from fastapi import APIRouter, HTTPException
from models.database import UserRegister, UserLogin, create_user, get_user_by_email, get_plan

router = APIRouter()

def _pub(u): return {"id": u["id"], "name": u["name"], "email": u["email"], "onboarded": u["onboarded"]}

@router.post("/register")
def register(data: UserRegister):
    if get_user_by_email(data.email):
        raise HTTPException(400, "Email already registered")
    u = create_user(data.name, data.email, data.password)
    return {"token": u["id"], "user": _pub(u), "has_plan": False, "plan": None}

@router.post("/login")
def login(data: UserLogin):
    u = get_user_by_email(data.email)
    if not u or u["password"] != data.password:
        raise HTTPException(401, "Invalid email or password")
    plan = get_plan(u["id"])
    return {"token": u["id"], "user": _pub(u), "has_plan": plan is not None, "plan": plan}
