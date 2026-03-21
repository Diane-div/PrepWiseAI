import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { ChevronRight, ChevronLeft, Zap, Building2, Code2, BookOpen, Clock } from "lucide-react";

const COMPANIES = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Flipkart", "Uber", "Atlassian", "Razorpay", "Swiggy", "Zepto", "PhonePe", "CRED", "Meesho", "Groww"];

const DSA_TOPICS = ["Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Dynamic Programming", "Recursion & Backtracking", "Binary Search", "Sorting & Searching", "Heaps", "Tries", "Greedy Algorithms", "Sliding Window", "Two Pointers"];

const LEVELS = ["beginner", "intermediate", "advanced"];
const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

const steps = [
  { id: 1, title: "Target Companies", subtitle: "Which companies are you targeting?", icon: <Building2 size={20} /> },
  { id: 2, title: "DSA Knowledge", subtitle: "Which DSA topics have you studied?", icon: <Code2 size={20} /> },
  { id: 3, title: "Core Subjects", subtitle: "Rate your knowledge in core CS subjects", icon: <BookOpen size={20} /> },
  { id: 4, title: "Time & Schedule", subtitle: "How much time do you have?", icon: <Clock size={20} /> },
];

function LevelSelect({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
      <div className="flex gap-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
              value === l
                ? "bg-brand-600/30 border-brand-500 text-brand-300"
                : "border-white/[0.06] text-slate-400 hover:border-white/10"
            }`}
          >
            {LEVEL_LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    target_companies: [],
    dsa_topics: [],
    oop_level: "beginner",
    dbms_level: "beginner",
    os_level: "beginner",
    cn_level: "beginner",
    weeks_left: 8,
    daily_hours: 4,
    current_role: "student",
  });

  const toggleCompany = (c) => {
    setForm((f) => ({
      ...f,
      target_companies: f.target_companies.includes(c)
        ? f.target_companies.filter((x) => x !== c)
        : [...f.target_companies, c],
    }));
  };

  const toggleDSA = (t) => {
    setForm((f) => ({
      ...f,
      dsa_topics: f.dsa_topics.includes(t)
        ? f.dsa_topics.filter((x) => x !== t)
        : [...f.dsa_topics, t],
    }));
  };

  const canNext = () => {
    if (step === 1) return form.target_companies.length > 0;
    return true;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generatePlan({ user_id: user.id, ...form });
      updatePlan(res.plan);
      toast.success("Your personalized plan is ready!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 grid-bg pt-16 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/15 border border-brand-500/30 text-brand-400 text-sm mb-4">
            <Zap size={13} />
            Setting up your personalized plan
          </div>
          <h1 className="font-display text-3xl font-bold">Tell us about yourself</h1>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 ${step === s.id ? "text-white" : step > s.id ? "text-brand-400" : "text-slate-600"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                  step === s.id ? "border-brand-500 bg-brand-600/30 text-brand-300" :
                  step > s.id ? "border-brand-500/50 bg-brand-600/10 text-brand-400" :
                  "border-white/10 text-slate-600"
                }`}>{s.id}</div>
                <span className="text-xs hidden sm:block">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${step > s.id ? "bg-brand-500/40" : "bg-white/[0.06]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 flex items-center justify-center text-brand-400">
              {steps[step - 1].icon}
            </div>
            <div>
              <h2 className="font-display font-bold">{steps[step - 1].title}</h2>
              <p className="text-slate-400 text-sm">{steps[step - 1].subtitle}</p>
            </div>
          </div>

          {/* Step 1: Companies */}
          {step === 1 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {COMPANIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCompany(c)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.target_companies.includes(c)
                        ? "bg-brand-600/30 border-brand-500 text-brand-300"
                        : "border-white/[0.06] text-slate-400 hover:border-white/10"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {form.target_companies.length === 0 && (
                <p className="text-slate-500 text-xs mt-3">Select at least one company</p>
              )}
              {/* Custom company */}
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2">Not listed? Add custom:</p>
                <input
                  type="text"
                  placeholder="Company name + Enter"
                  className="w-full px-3 py-2 bg-surface-950 border border-white/[0.06] rounded-lg text-sm placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      toggleCompany(e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 2: DSA */}
          {step === 2 && (
            <div>
              <p className="text-slate-400 text-sm mb-3">Select topics you're already comfortable with (leave unchecked = needs study)</p>
              <div className="flex flex-wrap gap-2">
                {DSA_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleDSA(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.dsa_topics.includes(t)
                        ? "bg-accent-green/20 border-accent-green/50 text-accent-green"
                        : "border-white/[0.06] text-slate-400 hover:border-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Core subjects */}
          {step === 3 && (
            <div>
              <LevelSelect label="Object-Oriented Programming (OOP)" value={form.oop_level} onChange={(v) => setForm({ ...form, oop_level: v })} />
              <LevelSelect label="Database Management Systems (DBMS)" value={form.dbms_level} onChange={(v) => setForm({ ...form, dbms_level: v })} />
              <LevelSelect label="Operating Systems (OS)" value={form.os_level} onChange={(v) => setForm({ ...form, os_level: v })} />
              <LevelSelect label="Computer Networks (CN)" value={form.cn_level} onChange={(v) => setForm({ ...form, cn_level: v })} />
            </div>
          )}

          {/* Step 4: Time */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Weeks until interview</label>
                  <span className="text-brand-400 font-bold font-mono">{form.weeks_left} weeks</span>
                </div>
                <input
                  type="range" min={1} max={24} value={form.weeks_left}
                  onChange={(e) => setForm({ ...form, weeks_left: +e.target.value })}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>1 week</span><span>24 weeks</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Daily study hours</label>
                  <span className="text-brand-400 font-bold font-mono">{form.daily_hours} hrs/day</span>
                </div>
                <input
                  type="range" min={1} max={12} value={form.daily_hours}
                  onChange={(e) => setForm({ ...form, daily_hours: +e.target.value })}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>1 hr</span><span>12 hrs</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-300 mb-2">Current role</p>
                <div className="flex gap-3">
                  {["student", "working professional"].map((r) => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, current_role: r })}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                        form.current_role === r ? "bg-brand-600/30 border-brand-500 text-brand-300" : "border-white/[0.06] text-slate-400"
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white border border-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} /> Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition-all"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 rounded-lg text-sm font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <><Zap size={15} /> Generate My Plan</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
