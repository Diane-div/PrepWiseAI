# PrepWise — AI Interview Prep Platform (Groq Edition)

Full-stack interview prep platform. React + FastAPI + Groq (LLaMA 3.3 70B, free tier).

## Quick Start

### 1. Get a free Groq API key
→ https://console.groq.com → API Keys → Create API Key

### 2. Add your key
Edit `backend/.env`:
```
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Start backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Start frontend (new terminal)
```bash
cd frontend
npm install
npm start
```

Open → http://localhost:3000

---

## Project Structure
```
prepwise/
├── backend/
│   ├── main.py
│   ├── .env                  ← add GROQ_API_KEY here
│   ├── requirements.txt
│   ├── models/
│   │   ├── database.py       schemas + in-memory store
│   │   └── groq_service.py   Groq client
│   └── routers/
│       ├── auth.py           register / login
│       ├── plan.py           AI plan generation
│       ├── chat.py           chatbot
│       └── topic.py          topic content
└── frontend/
    └── src/
        ├── pages/            LandingPage, AuthPage, OnboardPage,
        │                     DashboardPage, TopicPage, ChatPage
        ├── components/       Navbar, PlanCard, DashComponents
        ├── context/          AuthContext (localStorage persistence)
        └── utils/            api.js
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login + get plan |
| POST | /api/plan/generate | AI generates study plan |
| GET  | /api/plan/:id | Get saved plan |
| POST | /api/chat/message | Chat with AI coach |
| POST | /api/topic/content | AI topic content |
