import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, MessageSquare, LogOut, Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  if (["/", "/auth"].includes(loc.pathname)) return null;

  const links = [
    { to: "/dashboard", icon: <LayoutDashboard size={14} />, label: "Dashboard" },
    { to: "/chat",      icon: <MessageSquare size={14} />,   label: "AI Coach"  },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-13 border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-xl" style={{height:52}}>
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">

        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-lime-400 flex items-center justify-center">
            <Zap size={13} className="text-ink-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-sm text-white tracking-tight">PrepWise</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                loc.pathname.startsWith(to)
                  ? "bg-lime-400/10 text-lime-400"
                  : "text-ink-300 hover:text-white hover:bg-white/[0.05]"
              }`}>
              {icon}{label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-400 text-xs font-bold font-display">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-ink-400">{user.name}</span>
            </div>
          )}
          <button onClick={() => { logout(); nav("/"); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-ink-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut size={13} /><span className="hidden md:inline">Logout</span>
          </button>
          <button className="md:hidden text-ink-400" onClick={() => setOpen(!open)}>
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-ink-900 border-t border-white/[0.06] px-4 py-3 flex flex-col gap-1">
          {links.map(({ to, icon, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                loc.pathname.startsWith(to) ? "text-lime-400 bg-lime-400/10" : "text-ink-300"
              }`}>
              {icon}{label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
