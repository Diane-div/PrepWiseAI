import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PlanCard from "../components/plan/PlanCard";
import { StatsBar, CompanyBadges, TipsPanel } from "../components/dashboard/DashComponents";
import { MessageSquare, Calendar, Zap, Target } from "lucide-react";

const TABS = [
  { id:"plan",    label:"Study Plan",      icon:<Calendar size={12}/> },
  { id:"tips",    label:"Tips & Strategy", icon:<Zap size={12}/> },
  { id:"company", label:"Company Focus",   icon:<Target size={12}/> },
];

export default function DashboardPage() {
  const { user, plan } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("plan");
  if (!plan) return null;

  return (
    <div className="min-h-screen bg-ink-950 pt-14">
      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[600px] h-40 pointer-events-none" style={{background:"radial-gradient(ellipse,rgba(200,255,0,0.03) 0%,transparent 70%)"}}/>
      <div className="max-w-6xl mx-auto px-4 py-8 relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7">
          <div>
            <p className="text-ink-600 text-[11px] uppercase tracking-widest mb-1">Your personalized roadmap</p>
            <h1 className="font-display text-3xl font-bold text-white">Hey, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="text-ink-400 text-sm mt-2 max-w-xl leading-relaxed">{plan.summary}</p>
          </div>
          <button onClick={()=>nav("/chat")} className="btn-lime text-sm shrink-0 self-start">
            <MessageSquare size={13}/>Ask AI Coach
          </button>
        </div>

        <StatsBar plan={plan}/>
        <CompanyBadges companies={plan.target_companies}/>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 mb-6 w-fit border border-white/[0.06]" style={{background:"#0e1014"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab===t.id ? "bg-lime-400 text-ink-950" : "text-ink-500 hover:text-white"
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Plan */}
        {tab==="plan" && (
          <div className="flex flex-col gap-3 animate-fade-in">
            {plan.weeks?.map((w,i)=><PlanCard key={w.week} week={w} index={i}/>)}
            {(!plan.weeks||plan.weeks.length===0) && (
              <div className="card text-center py-12 text-ink-500 text-sm">
                No weeks found in your plan. Try regenerating.
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {tab==="tips" && (
          <div className="animate-fade-in">
            <TipsPanel tips={plan.tips||[]} focusAreas={plan.focus_areas||[]}/>
          </div>
        )}

        {/* Company */}
        {tab==="company" && (
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
            {Object.entries(plan.company_specific||{}).map(([co,areas])=>(
              <div key={co} className="card">
                <h3 className="font-display font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Target size={13} className="text-lime-400"/>{co}
                </h3>
                <ul className="flex flex-col gap-2">
                  {(Array.isArray(areas)?areas:[areas]).map((a,i)=>(
                    <li key={i} className="text-ink-300 text-sm flex items-start gap-2">
                      <span className="text-lime-400 mt-0.5 shrink-0">→</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {Object.keys(plan.company_specific||{}).length===0 && (
              <p className="text-ink-600 text-sm col-span-2 py-8 text-center">No company-specific data. Regenerate your plan.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
