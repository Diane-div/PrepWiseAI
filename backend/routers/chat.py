from fastapi import APIRouter
from models.database import ChatMessage, save_chat, get_chat
from models.groq_service import chat_completion

router = APIRouter()

SYSTEM = """You are PrepWise Coach — an expert software engineering interview coach helping students crack top tech company interviews.

You excel at:
- DSA: algorithms, data structures, complexity analysis, LeetCode problem solving
- OOP: design patterns, SOLID principles, real-world examples
- DBMS: SQL, normalization, indexing, transactions, ACID
- OS: processes, threads, scheduling, memory management, deadlocks
- CN: TCP/IP, HTTP/HTTPS, DNS, sockets, OSI model
- System Design: scalability, microservices, caching, databases, load balancing
- Behavioral: STAR method, common questions, negotiation

Style: encouraging, concise, practical. Always give time/space complexity for algorithms. Use code snippets freely. Format answers with markdown."""

@router.post("/message")
def send_message(data: ChatMessage):
    history = (data.conversation_history or get_chat(data.user_id))[-18:]
    messages = history + [{"role": "user", "content": data.message}]
    reply = chat_completion(messages, system=SYSTEM, max_tokens=1200)
    updated = messages + [{"role": "assistant", "content": reply}]
    save_chat(data.user_id, updated)
    return {"reply": reply, "conversation_history": updated}

@router.get("/history/{user_id}")
def get_history(user_id: str):
    return {"history": get_chat(user_id)}
