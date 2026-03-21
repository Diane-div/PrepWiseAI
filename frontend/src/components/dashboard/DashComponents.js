import React from "react";
import { Calendar, Clock, BookOpen, Layers, Building2, Lightbulb } from "lucide-react";

export function StatsBar({ plan }) {
  const totalTopics = plan.weeks?.reduce((a,w)=>a+(w.topics?.length||0),0)||0;
  const totalHours  = plan.weeks?.reduce((a,w)=>a+(w.topics?.reduce((b,t)=>b+(t.hours||0),0)||0),0)||0;
  const stats = [
    { icon:<Calendar size={14} className="text-lime-400"/>,   label:"Weeks",       val: plan.total_weeks||plan.weeks?.length||0 },
    { icon:<Clock size={14} className="text-sky-400"/>,        label:"Total Hours",  val: `${totalHours}h` },
    { icon:<BookOpen size={14} className="text-teal-400"/>,    label:"Topics",       val: totalTopics },
    { icon:<Layers size={14} className="text-violet-400"/>,    label:"Focus Areas",  val: plan.focus_areas?.length||0 },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="card p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">{s.icon}</div>
          <div>
            <p className="text-[10px] text-ink-600 uppercase tracking-wide">{s.label}</p>
            <p className="font-display font-bold text-lg text-white leading-tight">{s.val}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompanyBadges({ companies }) {
  if (!companies?.length) return null;
  return (
    <div className="flex items-center gap-2.5 mb-6 flex-wrap">
      <span className="text-[11px] text-ink-600 flex items-center gap-1 shrink-0">
        <Building2 size={11}/> Targeting:
      </span>
      {companies.map(c => (
        <span key={c} className="text-[11px] px-2.5 py-1 rounded-full border border-lime-400/25 text-lime-400 font-medium" style={{background:"rgba(200,255,0,0.08)"}}>
          {c}
        </span>
      ))}
    </div>
  );
}

export function TipsPanel({ tips, focusAreas }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2">
          <Lightbulb size={14} className="text-gold-400"/> Preparation Tips
        </h3>
        <ul className="flex flex-col gap-3">
          {tips.map((tip,i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink-300">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-gold-400" style={{background:"rgba(251,191,36,0.12)"}}>
                {i+1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2">
          <Layers size={14} className="text-violet-400"/> Focus Areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {focusAreas.map(a => (
            <span key={a} className="px-3 py-1.5 rounded-lg text-xs border border-violet-400/25 text-violet-400 font-medium" style={{background:"rgba(167,139,250,0.08)"}}>
              {a}
            </span>
          ))}
        </div>
        <p className="text-ink-700 text-xs mt-4 leading-relaxed">
          These areas are prioritized based on your target companies' interview patterns and knowledge gaps.
        </p>
      </div>
    </div>
  );
}
