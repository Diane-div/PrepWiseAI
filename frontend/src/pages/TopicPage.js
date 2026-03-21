import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { ArrowLeft, Clock, BookOpen, Code2, Star, Lightbulb, ChevronDown, ChevronUp, MessageSquare, ExternalLink } from "lucide-react";

const DIFF = { Easy:"text-teal-400 border-teal-400/25", Medium:"text-gold-400 border-gold-400/25", Hard:"text-rose-400 border-rose-400/25" };
const DIFF_BG = { Easy:"rgba(45,212,191,0.07)", Medium:"rgba(251,191,36,0.07)", Hard:"rgba(251,113,133,0.07)" };

const SUBJ_C = {
  "DSA":"text-lime-400 border-lime-400/25","OOP":"text-violet-400 border-violet-400/25",
  "DBMS":"text-sky-400 border-sky-400/25","OS":"text-gold-400 border-gold-400/25",
  "CN":"text-teal-400 border-teal-400/25","System Design":"text-rose-400 border-rose-400/25",
};
const SUBJ_BG = {
  "DSA":"rgba(200,255,0,0.07)","OOP":"rgba(167,139,250,0.07)","DBMS":"rgba(56,189,248,0.07)",
  "OS":"rgba(251,191,36,0.07)","CN":"rgba(45,212,191,0.07)","System Design":"rgba(251,113,133,0.07)",
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative group my-3">
      <div className="flex items-center justify-between px-3 py-1.5 border border-b-0 border-white/[0.06] rounded-t-lg" style={{background:"#1d2025"}}>
        <span className="text-[10px] text-ink-500 font-mono">{language||"code"}</span>
        <button onClick={()=>{navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
          className="text-[10px] text-ink-600 hover:text-lime-400 transition-colors">
          {copied?"Copied!":"Copy"}
        </button>
      </div>
      <pre className="border border-white/[0.06] border-t-0 rounded-b-lg p-4 overflow-x-auto text-xs font-mono text-ink-200 leading-relaxed" style={{background:"#07080a"}}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function QCard({ q, index }) {
  const [open, setOpen] = useState(false);
  const dc = DIFF[q.difficulty]||"text-ink-400";
  const dbg = DIFF_BG[q.difficulty]||"transparent";
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-start justify-between p-4 text-left hover:bg-white/[0.02] transition-all">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-[10px] text-ink-700 font-mono mt-0.5 shrink-0 w-5">Q{index+1}</span>
          <div className="flex-1">
            <p className="text-sm text-ink-200 font-medium leading-snug">{q.question}</p>
            {q.difficulty && (
              <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full border ${dc}`} style={{background:dbg}}>
                {q.difficulty}
              </span>
            )}
          </div>
        </div>
        <span className="text-ink-700 shrink-0 ml-2 mt-0.5">{open?<ChevronUp size={13}/>:<ChevronDown size={13}/>}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 flex flex-col gap-3 animate-fade-in">
          {q.hint && (
            <div className="flex items-start gap-2 p-3 rounded-lg border border-gold-400/20" style={{background:"rgba(251,191,36,0.06)"}}>
              <Lightbulb size={12} className="text-gold-400 shrink-0 mt-0.5"/>
              <p className="text-xs text-gold-400 leading-relaxed"><strong>Hint:</strong> {q.hint}</p>
            </div>
          )}
          {q.approach && (
            <div>
              <p className="text-[10px] text-ink-700 uppercase tracking-widest mb-1.5">Approach</p>
              <p className="text-sm text-ink-300 leading-relaxed">{q.approach}</p>
            </div>
          )}
          {(q.time_complexity||q.space_complexity) && (
            <div className="flex gap-2 flex-wrap">
              {q.time_complexity && <span className="text-xs px-2.5 py-1 rounded-lg border border-lime-400/20 text-lime-400 font-mono" style={{background:"rgba(200,255,0,0.07)"}}>Time: {q.time_complexity}</span>}
              {q.space_complexity && <span className="text-xs px-2.5 py-1 rounded-lg border border-violet-400/20 text-violet-400 font-mono" style={{background:"rgba(167,139,250,0.07)"}}>Space: {q.space_complexity}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Skel({ h="16px", w="100%" }) {
  return <div className="shimmer rounded" style={{height:h,width:w}}/>;
}

const TABS = [
  { id:"theory",    label:"Theory",        icon:<BookOpen size={12}/> },
  { id:"questions", label:"Questions",     icon:<Star size={12}/> },
  { id:"code",      label:"Code Examples", icon:<Code2 size={12}/> },
];

export default function TopicPage() {
  const { subject, slug } = useParams();
  const loc = useLocation();
  const nav = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("theory");

  const topicName = loc.state?.topic || slug.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
  const subtopics = loc.state?.subtopics||[];

  useEffect(() => {
    setLoading(true); setContent(null);
    api.getTopicContent({ subject, topic: topicName, subtopics })
      .then(r => setContent(r.content))
      .catch(() => toast.error("Failed to load content"))
      .finally(() => setLoading(false));
  }, [subject, slug]); // eslint-disable-line

  const sc = SUBJ_C[subject]||"text-ink-300 border-white/10";
  const sbg = SUBJ_BG[subject]||"rgba(255,255,255,0.04)";

  return (
    <div className="min-h-screen bg-ink-950 pt-14">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={()=>nav(-1)} className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={13}/> Back to Dashboard
        </button>

        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="text-center py-6">
              <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
              <p className="text-ink-500 text-sm">Groq AI is generating content for <span className="text-lime-400 font-medium">{topicName}</span>…</p>
            </div>
            <Skel h="32px" w="60%"/>
            <Skel h="16px"/><Skel h="16px" w="80%"/>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">{[1,2,3,4].map(i=><Skel key={i} h="90px"/>)}</div>
            <Skel h="200px"/>
          </div>
        ) : content ? (
          <>
            {/* Header */}
            <div className="mb-7">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${sc}`} style={{background:sbg}}>{subject}</span>
                {content.difficulty && <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${DIFF[content.difficulty]||""}`} style={{background:DIFF_BG[content.difficulty]||""}}>{content.difficulty}</span>}
                {content.estimated_time && <span className="text-[11px] text-ink-600 flex items-center gap-1"><Clock size={10}/>{content.estimated_time}</span>}
              </div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">{content.title||topicName}</h1>
              {content.description && <p className="text-ink-400 text-sm leading-relaxed max-w-2xl">{content.description}</p>}
            </div>

            {/* Key concepts */}
            {content.key_concepts?.length>0 && (
              <div className="grid sm:grid-cols-2 gap-3 mb-7">
                {content.key_concepts.slice(0,4).map((kc,i)=>(
                  <div key={i} className="card p-4">
                    <h4 className="text-sm font-semibold text-lime-400 mb-1">{kc.concept}</h4>
                    <p className="text-xs text-ink-400 leading-relaxed mb-2">{kc.explanation}</p>
                    {kc.example && <code className="block text-[11px] px-2 py-1.5 rounded text-ink-300 font-mono leading-relaxed border border-white/[0.05]" style={{background:"#07080a"}}>{kc.example}</code>}
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl p-1 mb-6 w-fit border border-white/[0.06]" style={{background:"#0e1014"}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${tab===t.id?"bg-lime-400 text-ink-950":"text-ink-500 hover:text-white"}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Theory */}
            {tab==="theory" && (
              <div className="card animate-fade-in">
                {content.theory
                  ? <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content.theory}</ReactMarkdown></div>
                  : <p className="text-ink-600 text-sm">No theory content available.</p>
                }
              </div>
            )}

            {/* Questions */}
            {tab==="questions" && (
              <div className="flex flex-col gap-2.5 animate-fade-in">
                {content.common_questions?.length>0
                  ? content.common_questions.map((q,i)=><QCard key={i} q={q} index={i}/>)
                  : <p className="text-ink-600 text-sm py-8 text-center">No questions available.</p>
                }
              </div>
            )}

            {/* Code */}
            {tab==="code" && (
              <div className="flex flex-col gap-5 animate-fade-in">
                {content.code_examples?.length>0
                  ? content.code_examples.map((ex,i)=>(
                      <div key={i} className="card">
                        <h4 className="font-display font-semibold text-white text-sm mb-1">{ex.title}</h4>
                        {ex.explanation && <p className="text-ink-500 text-xs mb-3 leading-relaxed">{ex.explanation}</p>}
                        <CodeBlock code={ex.code} language={ex.language}/>
                      </div>
                    ))
                  : <p className="text-ink-600 text-sm py-8 text-center">No code examples available.</p>
                }
              </div>
            )}

            {/* Tips + Related */}
            <div className="grid md:grid-cols-2 gap-4 mt-7">
              {content.interview_tips?.length>0 && (
                <div className="card">
                  <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
                    <Lightbulb size={13} className="text-gold-400"/>Interview Tips
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {content.interview_tips.map((tip,i)=>(
                      <li key={i} className="flex items-start gap-2 text-xs text-ink-400">
                        <span className="text-gold-400 mt-0.5 shrink-0">→</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.related_topics?.length>0 && (
                <div className="card">
                  <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
                    <ExternalLink size={13} className="text-sky-400"/>Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {content.related_topics.map(rt=>(
                      <span key={rt} className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] text-ink-500" style={{background:"#151719"}}>{rt}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ask AI CTA */}
            <div className="mt-7 p-5 rounded-2xl flex items-center justify-between gap-4 flex-wrap border border-lime-400/15" style={{background:"rgba(200,255,0,0.04)"}}>
              <div>
                <p className="font-semibold text-white text-sm">Still have questions?</p>
                <p className="text-ink-500 text-xs mt-0.5">Ask the AI coach for deeper explanations or problem practice.</p>
              </div>
              <button onClick={()=>nav("/chat")} className="btn-lime text-sm shrink-0">
                <MessageSquare size={13}/>Ask AI Coach
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-ink-600">Content could not be loaded. Go back and try again.</div>
        )}
      </div>
    </div>
  );
}
