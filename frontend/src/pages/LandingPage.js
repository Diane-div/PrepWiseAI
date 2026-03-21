import React from "react";
import { Link } from "react-router-dom";
import { Zap, Target, Brain, BookOpen, MessageSquare, ArrowRight, Code2, Database, Cpu, Network, GitBranch } from "lucide-react";

const FEATURES = [
  { icon: <Target size={17} />,      title: "Personalized Roadmap",   desc: "AI generates a week-by-week study plan based on your target companies, knowledge gaps, and available time." },
  { icon: <Brain size={17} />,       title: "Groq-Powered AI",        desc: "Ultra-fast LLaMA 3.3 70B generates your plan and content in seconds — not minutes." },
  { icon: <BookOpen size={17} />,    title: "Topic Deep Dives",       desc: "Click any topic in your plan to get AI-generated theory, interview questions, code examples, and tips." },
  { icon: <MessageSquare size={17} />,title: "24/7 AI Coach",         desc: "Ask anything about DSA, System Design, DBMS, OS, CN. Get answers with code and complexity analysis." },
];

const SUBJECTS = [
  { icon: <Code2 size={13} />,     label: "DSA",           cls: "text-lime-400 bg-lime-400/10 border-lime-400/25" },
  { icon: <Database size={13} />,  label: "DBMS",          cls: "text-sky-400 bg-sky-400/10 border-sky-400/25" },
  { icon: <Cpu size={13} />,       label: "OS",            cls: "text-gold-400 bg-gold-400/10 border-gold-400/25" },
  { icon: <Network size={13} />,   label: "CN",            cls: "text-teal-400 bg-teal-400/10 border-teal-400/25" },
  { icon: <GitBranch size={13} />, label: "System Design", cls: "text-violet-400 bg-violet-400/10 border-violet-400/25" },
];

const COMPANIES = ["Google","Meta","Amazon","Microsoft","Apple","Flipkart","Uber","Atlassian","Razorpay","Swiggy","Zepto","PhonePe","CRED","Groww","Meesho","PayPal"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 dot-bg overflow-x-hidden">

      {/* Top nav */}
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-lime-400 flex items-center justify-center">
            <Zap size={13} className="text-ink-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-sm text-white">PrepWise</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-ink-400 hover:text-white transition-colors">Sign in</Link>
          <Link to="/auth" className="btn-lime text-sm py-2 px-4 rounded-lg">Get started free</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-16 text-center">
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 pointer-events-none">
          <div className="absolute inset-0 bg-lime-400/[0.04] rounded-full blur-3xl" />
          <div className="absolute top-16 left-1/3 w-64 h-48 bg-sky-500/[0.06] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/25 bg-lime-400/[0.07] text-lime-400 text-xs font-medium mb-7">
            <Zap size={11} fill="currentColor" /> Powered by Groq · LLaMA 3.3 70B · Ultra-fast AI
          </div>

          <h1 className="font-display text-5xl md:text-[68px] font-bold leading-[1.04] tracking-tight mb-5 text-white">
            Crack your<br />
            <span className="text-lime-400">dream company</span>
          </h1>

          <p className="text-ink-300 text-lg max-w-xl mx-auto mb-9 leading-relaxed">
            PrepWise builds a personalized interview prep plan powered by AI,
            teaches every topic with generated content, and coaches you live through a chatbot.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link to="/auth" className="btn-lime text-sm">
              Start for free <ArrowRight size={14} />
            </Link>
            <Link to="/auth" className="btn-ghost text-sm">Sign in to account</Link>
          </div>

          {/* Subject pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SUBJECTS.map(s => (
              <span key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${s.cls}`}>
                {s.icon}{s.label}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-full border border-white/[0.08] text-xs text-ink-500">+ OOP & Behavioral</span>
          </div>
        </div>
      </div>

      {/* Companies */}
      <div className="max-w-5xl mx-auto px-5 mb-16">
        <p className="text-center text-ink-600 text-[11px] uppercase tracking-widest mb-4">Prepare for top companies</p>
        <div className="flex flex-wrap justify-center gap-2">
          {COMPANIES.map(c => (
            <span key={c} className="px-3 py-1.5 rounded-lg bg-ink-800 border border-white/[0.05] text-ink-400 text-xs">{c}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-5 pb-20">
        <h2 className="font-display text-3xl font-bold text-center text-white mb-2">Everything in one place</h2>
        <p className="text-ink-500 text-center text-sm mb-10">No more juggling YouTube, LeetCode, and random notes.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="card hover:border-lime-400/20 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-lime-400/10 flex items-center justify-center text-lime-400 mb-4 group-hover:bg-lime-400/15 transition-all">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-sm text-white mb-2">{f.title}</h3>
              <p className="text-ink-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-xl mx-auto px-5 pb-20 text-center">
        <div className="card border-lime-400/15">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Ready to start?</h2>
          <p className="text-ink-400 text-sm mb-6">Create a free account and get your personalized plan in 2 minutes.</p>
          <Link to="/auth" className="btn-lime text-sm mx-auto">
            Create free account <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/[0.04] py-5 text-center text-ink-700 text-xs">
        PrepWise © 2024 · AI-powered by Groq
      </div>
    </div>
  );
}
