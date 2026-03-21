import React from "react";
import { Calendar, Clock, BookOpen, Layers } from "lucide-react";

export default function StatsBar({ plan }) {
  const totalTopics = plan.weeks?.reduce((acc, w) => acc + (w.topics?.length || 0), 0) || 0;
  const totalHours = plan.weeks?.reduce(
    (acc, w) => acc + (w.topics?.reduce((a, t) => a + (t.hours || 0), 0) || 0),
    0
  ) || 0;

  const stats = [
    { icon: <Calendar size={16} className="text-brand-400" />, label: "Weeks", value: plan.total_weeks || plan.weeks?.length || 0 },
    { icon: <Clock size={16} className="text-accent-amber" />, label: "Total Hours", value: `${totalHours}h` },
    { icon: <BookOpen size={16} className="text-accent-green" />, label: "Topics", value: totalTopics },
    { icon: <Layers size={16} className="text-accent-purple" />, label: "Focus Areas", value: plan.focus_areas?.length || 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="p-4 bg-surface-900 border border-white/[0.06] rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
            {s.icon}
          </div>
          <div>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="font-display font-bold text-lg">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
