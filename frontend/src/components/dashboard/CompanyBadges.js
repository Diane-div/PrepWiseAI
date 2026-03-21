import React from "react";
import { Building2 } from "lucide-react";

export default function CompanyBadges({ companies }) {
  if (!companies.length) return null;
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <span className="text-xs text-slate-500 flex items-center gap-1">
        <Building2 size={12} /> Targeting:
      </span>
      {companies.map((c) => (
        <span
          key={c}
          className="text-xs px-3 py-1 rounded-full bg-brand-600/15 border border-brand-500/30 text-brand-300 font-medium"
        >
          {c}
        </span>
      ))}
    </div>
  );
}
