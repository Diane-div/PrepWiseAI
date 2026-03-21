import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { ChevronRight, ChevronLeft, Zap, Building2, Code2, BookOpen, Clock } from "lucide-react";

const COMPANIES = ["Google","Meta","Amazon","Microsoft","Apple","Netflix","Flipkart","Uber","Atlassian","Razorpay","Swiggy","Zepto","PhonePe","CRED","Meesho","Groww","PayPal","Paytm"];
const DSA = ["Arrays","Strings","Linked Lists","Stacks & Queues","Trees","Graphs","Dynamic Programming","Recursion & Backtracking","Binary Search","Sorting","Heaps","Tries","Greedy Algorithms","Sliding Window","Two Pointers","Bit Manipulation"];
const LEVELS = ["beginner","intermediate","advanced"];
const STEPS = [
  { id:1, title:"Target Companies",  icon:<Building2 size={17}/>, sub:"Which companies are you targeting?" },
  { id:2, title:"DSA Knowledge",     icon:<Code2 size={17}/>,    sub:"Which DSA topics have you already studied?" },
  { id:3, title:"Core CS Subjects",  icon:<BookOpen size={17}/>, sub:"Rate your level in each subject" },
  { id:4, title:"Time & Schedule",   icon:<Clock size={17}/>,    sub:"How much time do you have?" },
];

function LevelRow({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-ink-400 mb-2 font-medium">{label}</p>
      <div className="flex gap-2">
        {LEVELS.map(l => (
          <button key={l} type="button" onClick={() => onChange(l)}
            className={`flex-1 py-2 text-xs rounded-lg border font-medium transition-all ${
              value === l ? "bg-lime-400/12 border-lime-400/40 text-lime-400" : "border-white/[0.07] text-ink-500 hover:border-white/[0.12] hover:text-ink-200"
            }`} style={value===l?{background:"rgba(200,255,0,0.08)"}:{}}>
            {l.charAt(0).toUpperCase()+l.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OnboardPage() {
  const { user, savePlan } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [custom, setCustom] = useState("");
  const [form, setForm] = useState({
    companies:[], dsaTopics:[], oopLevel:"beginner", dbmsLevel:"beginner",
    osLevel:"beginner", cnLevel:"beginner", weeks:8, hours:4, role:"student",
  });

  const toggle = (key, val) => setForm(f => ({
    ...f, [key]: f[key].includes(val) ? f[key].filter(x=>x!==val) : [...f[key], val]
  }));

  const addCustom = () => {
    const c = custom.trim();
    if (c && !form.companies.includes(c)) setForm(f=>({...f,companies:[...f.companies,c]}));
    setCustom("");
  };

  const canNext = () => step === 1 ? form.companies.length > 0 : true;

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.generatePlan({
        user_id: user.id,
        target_companies: form.companies,
        dsa_topics: form.dsaTopics,
        oop_level: form.oopLevel,
        dbms_level: form.dbmsLevel,
        os_level: form.osLevel,
        cn_level: form.cnLevel,
        weeks_left: form.weeks,
        daily_hours: form.hours,
        current_role: form.role,
      });
      savePlan(res.plan);
      toast.success("Your plan is ready!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.message || "Check your Groq API key in backend/.env");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 dot-bg pt-16 pb-12 px-4">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-7 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/25 bg-lime-400/[0.07] text-lime-400 text-xs mb-4">
            <Zap size={11} fill="currentColor" /> Setting up your personalized plan
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Tell us about yourself</h1>
          <p className="text-ink-500 text-sm mt-2">4 quick questions to tailor your roadmap</p>
        </div>

        {/* Step bar */}
        <div className="flex items-center gap-2 mb-7">
          {STEPS.map((s,i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border transition-all ${
                  step===s.id ? "border-lime-400 text-lime-400" : step>s.id ? "border-lime-400/40 text-lime-400" : "border-white/[0.08] text-ink-600"
                }`} style={step===s.id?{background:"rgba(200,255,0,0.1)"}:step>s.id?{background:"rgba(200,255,0,0.06)"}:{}}>
                  {step>s.id ? "✓" : s.id}
                </div>
                <span className={`text-[11px] hidden sm:block ${step===s.id?"text-white":step>s.id?"text-lime-400":"text-ink-600"}`}>{s.title}</span>
              </div>
              {i<STEPS.length-1 && <div className={`flex-1 h-px ${step>s.id?"bg-lime-400/25":"bg-white/[0.05]"}`}/>}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="card animate-fade-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lime-400 border border-lime-400/20" style={{background:"rgba(200,255,0,0.08)"}}>
              {STEPS[step-1].icon}
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-sm">{STEPS[step-1].title}</h2>
              <p className="text-ink-500 text-xs">{STEPS[step-1].sub}</p>
            </div>
          </div>

          {/* Step 1 */}
          {step===1 && (
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMPANIES.map(c => (
                  <button key={c} type="button" onClick={()=>toggle("companies",c)}
                    className={`chip ${form.companies.includes(c)?"on":""}`}>{c}</button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input type="text" placeholder="Add custom company + Enter" value={custom}
                  onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()}
                  className="flex-1 px-3 py-2 bg-ink-800 border border-white/[0.07] rounded-lg text-xs text-white placeholder:text-ink-700 focus:outline-none focus:border-lime-400/30"/>
                <button onClick={addCustom} className="btn-ghost text-xs px-3 py-2">Add</button>
              </div>
              {form.companies.length===0 && <p className="text-ink-700 text-xs mt-2">Select at least one company</p>}
            </div>
          )}

          {/* Step 2 */}
          {step===2 && (
            <div>
              <p className="text-ink-500 text-xs mb-3">Select topics you're <span className="text-lime-400">already comfortable with</span> — unchecked ones get more focus.</p>
              <div className="flex flex-wrap gap-2">
                {DSA.map(t => (
                  <button key={t} type="button" onClick={()=>toggle("dsaTopics",t)}
                    className={`chip ${form.dsaTopics.includes(t)?"on":""}`}>{t}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step===3 && (
            <div>
              <LevelRow label="Object-Oriented Programming (OOP)" value={form.oopLevel}  onChange={v=>setForm(f=>({...f,oopLevel:v}))}/>
              <LevelRow label="Database Management Systems (DBMS)" value={form.dbmsLevel} onChange={v=>setForm(f=>({...f,dbmsLevel:v}))}/>
              <LevelRow label="Operating Systems (OS)"             value={form.osLevel}   onChange={v=>setForm(f=>({...f,osLevel:v}))}/>
              <LevelRow label="Computer Networks (CN)"             value={form.cnLevel}   onChange={v=>setForm(f=>({...f,cnLevel:v}))}/>
            </div>
          )}

          {/* Step 4 */}
          {step===4 && (
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-ink-400 font-medium">Weeks until interview</label>
                  <span className="text-lime-400 font-mono font-bold text-sm">{form.weeks}w</span>
                </div>
                <input type="range" min={1} max={24} value={form.weeks}
                  onChange={e=>setForm(f=>({...f,weeks:+e.target.value}))}
                  className="w-full accent-lime-400"/>
                <div className="flex justify-between text-[10px] text-ink-700 mt-1"><span>1 week</span><span>24 weeks</span></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-ink-400 font-medium">Daily study hours</label>
                  <span className="text-lime-400 font-mono font-bold text-sm">{form.hours}h/day</span>
                </div>
                <input type="range" min={1} max={12} value={form.hours}
                  onChange={e=>setForm(f=>({...f,hours:+e.target.value}))}
                  className="w-full accent-lime-400"/>
                <div className="flex justify-between text-[10px] text-ink-700 mt-1"><span>1 hr</span><span>12 hrs</span></div>
              </div>
              <div>
                <p className="text-xs text-ink-400 font-medium mb-2">Current role</p>
                <div className="flex gap-2">
                  {["student","working professional"].map(r => (
                    <button key={r} type="button" onClick={()=>setForm(f=>({...f,role:r}))}
                      className={`flex-1 py-2 text-xs rounded-lg border font-medium transition-all ${
                        form.role===r ? "border-lime-400/40 text-lime-400" : "border-white/[0.07] text-ink-500"
                      }`} style={form.role===r?{background:"rgba(200,255,0,0.08)"}:{}}>
                      {r.charAt(0).toUpperCase()+r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex justify-between mt-7">
            <button onClick={()=>setStep(s=>s-1)} disabled={step===1} className="btn-ghost text-xs disabled:opacity-30">
              <ChevronLeft size={13}/>Back
            </button>
            {step<4 ? (
              <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()} className="btn-lime text-xs disabled:opacity-40">
                Next<ChevronRight size={13}/>
              </button>
            ) : (
              <button onClick={generate} disabled={loading} className="btn-lime text-xs disabled:opacity-50">
                {loading ? (
                  <><div className="w-3.5 h-3.5 border-2 border-ink-950 border-t-transparent rounded-full animate-spin"/>Generating…</>
                ) : (
                  <><Zap size={13} fill="currentColor"/>Generate My Plan</>
                )}
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="mt-4 p-4 rounded-xl border border-lime-400/20 text-center" style={{background:"rgba(200,255,0,0.04)"}}>
            <p className="text-lime-400 text-sm font-medium mb-1">🤖 Groq AI is building your roadmap…</p>
            <p className="text-ink-600 text-xs">Analyzing your profile and target companies. Takes ~10 seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
