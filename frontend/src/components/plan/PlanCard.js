import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Clock, BookOpen, ArrowUpRight, Star } from "lucide-react";

const SUBJ = {
  "DSA":           "text-lime-400 border-lime-400/25",
  "OOP":           "text-violet-400 border-violet-400/25",
  "DBMS":          "text-sky-400 border-sky-400/25",
  "OS":            "text-gold-400 border-gold-400/25",
  "CN":            "text-teal-400 border-teal-400/25",
  "System Design": "text-rose-400 border-rose-400/25",
};

const SUBJ_BG = {
  "DSA":           "rgba(200,255,0,0.07)",
  "OOP":           "rgba(167,139,250,0.07)",
  "DBMS":          "rgba(56,189,248,0.07)",
  "OS":            "rgba(251,191,36,0.07)",
  "CN":            "rgba(45,212,191,0.07)",
  "System Design": "rgba(251,113,133,0.07)",
};

const PRIO = { high:"text-rose-400", medium:"text-gold-400", low:"text-teal-400" };

function TopicTile({ topic }) {
  const nav = useNavigate();
  const sc = SUBJ[topic.subject] || "text-ink-300 border-white/10";
  const bg = SUBJ_BG[topic.subject] || "rgba(255,255,255,0.04)";
  const slug = topic.topic.toLowerCase().replace(/[^a-z0-9]+/g,"-");

  return (
    <div onClick={() => nav(`/topic/${encodeURIComponent(topic.subject)}/${slug}`, { state:{ topic:topic.topic, subtopics:topic.subtopics||[] } })}
      className="p-3.5 rounded-xl border border-white/[0.05] hover:border-white/[0.1] cursor-pointer group transition-all"
      style={{background:"#0e1014"}}>
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc}`} style={{background:bg}}>
            {topic.subject}
          </span>
          {topic.priority && (
            <span className={`text-[10px] ${PRIO[topic.priority]||"text-ink-500"}`}>● {topic.priority}</span>
          )}
        </div>
        <ArrowUpRight size={12} className="text-ink-700 group-hover:text-lime-400 transition-colors shrink-0"/>
      </div>
      <h4 className="text-sm font-medium text-white group-hover:text-lime-400 transition-colors mb-2 leading-snug">{topic.topic}</h4>
      {topic.subtopics?.length>0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {topic.subtopics.slice(0,3).map(s=>(
            <span key={s} className="text-[10px] text-ink-600 px-1.5 py-0.5 rounded" style={{background:"#151719"}}>{s}</span>
          ))}
          {topic.subtopics.length>3 && <span className="text-[10px] text-ink-700">+{topic.subtopics.length-3}</span>}
        </div>
      )}
      <div className="flex items-center gap-3 text-[10px] text-ink-600">
        <span className="flex items-center gap-1"><Clock size={9}/>{topic.hours}h</span>
        {topic.practice_problems && <span className="flex items-center gap-1"><BookOpen size={9}/>{topic.practice_problems} problems</span>}
      </div>
    </div>
  );
}

export default function PlanCard({ week, index }) {
  const [open, setOpen] = useState(index===0);
  return (
    <div className={`rounded-2xl border transition-all ${open?"border-white/[0.08] bg-ink-900":"border-white/[0.05] bg-ink-900/50 hover:border-white/[0.07]"}`}>
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lime-400 text-sm shrink-0 border border-lime-400/20" style={{background:"rgba(200,255,0,0.08)"}}>
            W{week.week}
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">{week.theme}</h3>
            <p className="text-ink-600 text-xs mt-0.5">
              {week.topics?.length||0} topics
              {week.milestone && <span className="hidden sm:inline ml-2 text-ink-700"> · {week.milestone.length>55?week.milestone.slice(0,55)+"…":week.milestone}</span>}
            </p>
          </div>
        </div>
        <span className="text-ink-600">{open?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 animate-fade-in">
          {week.milestone && (
            <div className="flex items-start gap-2 p-3 rounded-xl mb-4 border border-lime-400/15" style={{background:"rgba(200,255,0,0.05)"}}>
              <Star size={11} className="text-lime-400 mt-0.5 shrink-0" fill="currentColor"/>
              <p className="text-xs text-lime-400">{week.milestone}</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-2.5">
            {week.topics?.map((t,i)=><TopicTile key={i} topic={t}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
