import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";

function Input({ icon, type, placeholder, value, onChange, right }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} required
        className="w-full pl-9 pr-10 py-2.5 bg-ink-800 border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-ink-600 focus:outline-none focus:border-lime-400/40 transition-colors" />
      {right && <span className="absolute right-3 top-1/2 -translate-y-1/2">{right}</span>}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (mode === "login") {
        res = await api.login({ email: form.email, password: form.password });
      } else {
        if (!form.name.trim()) { toast.error("Name is required"); setLoading(false); return; }
        res = await api.register({ name: form.name, email: form.email, password: form.password });
      }
      login({ ...res.user, token: res.token }, res.has_plan ? res.plan : null);
      toast.success(mode === "login" ? `Welcome back, ${res.user.name}!` : "Account created!");
      nav(res.has_plan ? "/dashboard" : "/onboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 dot-bg flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-lime-400/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-1.5 text-ink-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={13} /> Back to home
        </Link>

        <div className="flex items-center gap-2 mb-7">
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center">
            <Zap size={14} className="text-ink-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-white">PrepWise</span>
        </div>

        <div className="card">
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            {mode === "login" ? "Welcome back" : "Get started"}
          </h1>
          <p className="text-ink-500 text-sm mb-6">
            {mode === "login" ? "Sign in to continue your prep journey" : "Create a free account to begin"}
          </p>

          {/* Tab switcher */}
          <div className="flex bg-ink-950 rounded-xl p-1 mb-5 gap-1">
            {["login","register"].map(m => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  mode === m ? "bg-lime-400 text-ink-950" : "text-ink-500 hover:text-white"
                }`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === "register" && (
              <Input icon={<User size={13}/>} type="text" placeholder="Full name" value={form.name} onChange={set("name")} />
            )}
            <Input icon={<Mail size={13}/>} type="email" placeholder="Email address" value={form.email} onChange={set("email")} />
            <Input
              icon={<Lock size={13}/>}
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={set("password")}
              right={
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-ink-600 hover:text-ink-300 transition-colors">
                  {showPw ? <EyeOff size={13}/> : <Eye size={13}/>}
                </button>
              }
            />
            <button type="submit" disabled={loading} className="btn-lime w-full mt-1 justify-center">
              {loading
                ? <div className="w-4 h-4 border-2 border-ink-950 border-t-transparent rounded-full animate-spin"/>
                : mode === "login" ? "Sign In" : "Create Account"
              }
            </button>
          </form>

          <p className="text-center text-ink-600 text-xs mt-4">
            {mode === "login" ? "No account? " : "Have an account? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-lime-400 hover:text-lime-300 transition-colors">
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
