import React from "react";
import { Lightbulb, Layers } from "lucide-react";

export default function TipsPanel({ tips, focusAreas }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-surface-900 border border-white/[0.07] rounded-2xl">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <Lightbulb size={16} className="text-accent-amber" /> Preparation Tips
        </h3>
        <ul className="flex flex-col gap-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="w-5 h-5 rounded-full bg-accent-amber/20 text-accent-amber flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 bg-surface-900 border border-white/[0.07] rounded-2xl">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <Layers size={16} className="text-accent-purple" /> Focus Areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <span
              key={area}
              className="px-3 py-1.5 rounded-lg text-sm bg-accent-purple/15 border border-accent-purple/30 text-purple-300"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
