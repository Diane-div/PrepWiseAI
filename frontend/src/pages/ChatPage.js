import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { Send, Bot, User, RotateCcw, Zap } from "lucide-react";

const QUICK = [
  "Explain time & space complexity of merge sort",
  "What is database normalization? Give examples",
  "How does TCP 3-way handshake work?",
  "Explain process vs thread in OS",
  "What are SOLID principles with examples?",
  "How to approach system design interviews?",
  "Explain dynamic programming with an example",
  "Difference between SQL and NoSQL databases?",
];

const WELCOME = {
  role: "assistant",
  content: `**Hello! I'm your PrepWise AI Coach** 🚀

I'm powered by Groq's ultra-fast LLaMA 3.3 70B and here to help you crack your dream company interview.

Ask me anything about:
- **DSA** — algorithms, data structures, complexity, LeetCode
- **OOP** — design patterns, SOLID, inheritance, polymorphism
- **DBMS** — SQL, normalization, indexing, transactions, ACID
- **OS** — processes, threads, scheduling, memory management
- **CN** — TCP/IP, HTTP, DNS, OSI model, sockets
- **System Design** — scalability, caching, microservices
- **Behavioral** — STAR method, interview strategies

What would you like to learn today?`,
};

function Dots() {
  return (
    <div className="flex gap-1.5 items-center px-1 py-1">
      {[0,1,2].map(i=>(
        <span key={i} className="w-2 h-2 rounded-full bg-lime-400"
          style={{animation:"bounce3 0.8s infinite",animationDelay:`${i*0.15}s`}}/>
      ))}
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.role==="user";
  return (
    <div className={`flex gap-3 animate-fade-in ${isUser?"flex-row-reverse":""}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 border ${
        isUser ? "border-lime-400/30" : "border-white/[0.08]"
      }`} style={{background: isUser?"rgba(200,255,0,0.12)":"#1d2025"}}>
        {isUser
          ? <User size={12} className="text-lime-400"/>
          : <Bot size={12} className="text-ink-400"/>
        }
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? "text-white rounded-tr-sm border border-lime-400/20"
          : "text-ink-200 rounded-tl-sm border border-white/[0.06]"
      }`} style={{background: isUser?"rgba(200,255,0,0.1)":"#0e1014"}}>
        {isUser
          ? <p className="text-sm">{msg.content}</p>
          : <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown></div>
        }
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const [msgs, setMsgs]     = useState([WELCOME]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, loading]);

  const send = async (text) => {
    const msg = (text||input).trim();
    if (!msg||loading) return;
    setInput("");
    const next = [...msgs, {role:"user",content:msg}];
    setMsgs(next);
    setLoading(true);

    const history = next.slice(1).slice(-16).map(m=>({role:m.role,content:m.content}));

    try {
      const res = await api.sendMessage({
        user_id: user.id,
        message: msg,
        conversation_history: history.slice(0,-1),
      });
      setMsgs([...next, {role:"assistant",content:res.reply}]);
    } catch(err) {
      toast.error("AI coach unavailable. Is the backend running?");
      setMsgs([...next, {role:"assistant",content:"Sorry, I hit an error. Please check the backend is running and try again."}]);
    } finally {
      setLoading(false);
      setTimeout(()=>inputRef.current?.focus(),80);
    }
  };

  return (
    <div className="bg-ink-950" style={{height:"100vh",display:"flex",flexDirection:"column",paddingTop:52}}>
      <style>{`@keyframes bounce3{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
      <div className="max-w-4xl mx-auto w-full flex flex-col px-4 py-5" style={{flex:1,minHeight:0}}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-lime-400/20" style={{background:"rgba(200,255,0,0.08)"}}>
              <Zap size={15} className="text-lime-400" fill="currentColor"/>
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-sm">AI Interview Coach</h1>
              <div className="flex items-center gap-1.5 text-[10px] text-teal-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"/>
                Groq · LLaMA 3.3 70B · Online
              </div>
            </div>
          </div>
          <button onClick={()=>setMsgs([WELCOME])}
            className="flex items-center gap-1 text-xs text-ink-600 hover:text-ink-300 border border-white/[0.06] px-3 py-1.5 rounded-lg hover:border-white/[0.1] transition-all">
            <RotateCcw size={11}/>Clear
          </button>
        </div>

        {/* Quick prompts */}
        {msgs.length<=1 && (
          <div className="mb-4 shrink-0">
            <p className="text-[10px] text-ink-700 uppercase tracking-widest mb-2">Quick questions</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK.map(q=>(
                <button key={q} onClick={()=>send(q)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.06] text-ink-500 hover:text-lime-400 hover:border-lime-400/25 transition-all" style={{background:"#0e1014"}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1" style={{minHeight:0}}>
          {msgs.map((m,i)=><Bubble key={i} msg={m}/>)}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center shrink-0 mt-1" style={{background:"#1d2025"}}>
                <Bot size={12} className="text-ink-500"/>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-white/[0.06]" style={{background:"#0e1014"}}>
                <Dots/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="mt-4 shrink-0">
          <div className="flex gap-2 rounded-2xl p-2 border border-white/[0.08] focus-within:border-lime-400/25 transition-colors" style={{background:"#0e1014"}}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
              placeholder="Ask about DSA, System Design, DBMS, OS, CN, OOP…"
              rows={1}
              className="flex-1 bg-transparent resize-none text-sm text-white placeholder:text-ink-700 focus:outline-none py-1.5 px-2 leading-relaxed"
              style={{maxHeight:100}}
            />
            <button onClick={()=>send()} disabled={!input.trim()||loading}
              className="w-9 h-9 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 self-end transition-all">
              {loading
                ? <div className="w-4 h-4 border-2 border-ink-950 border-t-transparent rounded-full animate-spin"/>
                : <Send size={13} className="text-ink-950"/>
              }
            </button>
          </div>
          <p className="text-[10px] text-ink-800 text-center mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
