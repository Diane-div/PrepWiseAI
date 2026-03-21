from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import auth, plan, chat, topic

load_dotenv()

app = FastAPI(title="PrepWise API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,  prefix="/api/auth",  tags=["Auth"])
app.include_router(plan.router,  prefix="/api/plan",  tags=["Plan"])
app.include_router(chat.router,  prefix="/api/chat",  tags=["Chat"])
app.include_router(topic.router, prefix="/api/topic", tags=["Topic"])

@app.get("/")
def root():
    return {"status": "PrepWise API running", "ai": "Groq / llama-3.3-70b-versatile"}
