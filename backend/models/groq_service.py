import os, json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = None

def _get():
    global _client
    if _client is None:
        key = os.getenv("GROQ_API_KEY", "")
        if not key or key.startswith("gsk_your"):
            raise RuntimeError("GROQ_API_KEY not set in backend/.env")
        _client = Groq(api_key=key)
    return _client

MODEL = "llama-3.3-70b-versatile"

def chat_completion(messages: list, system: str = "", max_tokens: int = 1500) -> str:
    msgs = ([{"role": "system", "content": system}] if system else []) + messages
    r = _get().chat.completions.create(model=MODEL, messages=msgs, max_tokens=max_tokens, temperature=0.7)
    return r.choices[0].message.content

def json_completion(prompt: str, max_tokens: int = 4000) -> dict:
    msgs = [{"role": "user", "content": prompt}]
    r = _get().chat.completions.create(
        model=MODEL, messages=msgs, max_tokens=max_tokens, temperature=0.4,
        response_format={"type": "json_object"}
    )
    return json.loads(r.choices[0].message.content)
