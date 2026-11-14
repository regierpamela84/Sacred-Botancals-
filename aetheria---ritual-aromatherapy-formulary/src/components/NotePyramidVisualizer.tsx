import React from 'react';
import { NoteDistribution, EssentialOilIngredient } from '../types';

interface NotePyramidProps {
  distribution: NoteDistribution;
  essentialOils: EssentialOilIngredient[];
}

export const NotePyramidVisualizer: React.FC<NotePyramidProps> = ({ distribution, essentialOils }) => {
  const topOils = essentialOils.filter((o) => o.note === 'Top');
  const middleOils = essentialOils.filter((o) => o.note === 'Middle');
  const baseOils = essentialOils.filter((o) => o.note === 'Base');

  const topDrops = topOils.reduce((sum, o) => sum + o.drops, 0);
  const middleDrops = middleOils.reduce((sum, o) => sum + o.drops, 0);
  const baseDrops = baseOils.reduce((sum, o) => sum + o.drops, 0);
  const total = distribution.totalDrops || (topDrops + middleDrops + baseDrops);

  const topPct = Math.round((topDrops / total) * 100);
  const middlePct = Math.round((middleDrops / total) * 100);
  const basePct = Math.round((baseDrops / total) * 100);

  return (
    <div className="bg-stone-900/80 border border-amber-900/40 rounded-xl p-5 backdrop-blur-sm shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-stone-800 pb-3">
        <div>
          <h4 className="text-amber-300 font-cinzel font-semibold text-sm tracking-wide uppercase flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            30 / 50 / 20 Aromatic Note Balance Rule
          </h4>
          <p className="text-stone-400 text-xs mt-0.5">
            Classical French perfume & ritual grade alchemy structure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-200 font-mono">
            {total} Drops Total
          </span>
          <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 font-mono flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Harmonized Ratio
          </span>
        </div>
      </div>

      {/* Visual Pyramid / Tier Stack */}
      <div className="space-y-3">
        {/* TOP NOTES (Target: ~30%) */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-400 text-stone-950 uppercase tracking-wider font-cinzel">
                Top Notes
              </span>
              <span className="text-stone-300 font-medium">Head / Etheric Awakening</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-amber-300 font-bold">{topDrops} Drops</span>
              <span className="text-stone-400">({topPct}% • Target ~30%)</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${topPct}%` }}
            ></div>
          </div>
          {/* Active Oils list */}
          <div className="flex flex-wrap gap-1.5">
            {topOils.map((oil, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded bg-stone-800/90 text-amber-200 border border-amber-500/20 flex items-center gap-1.5"
              >
                <span className="font-semibold text-amber-300">{oil.drops}d</span>
                <span>{oil.name}</span>
                <span className="text-stone-400 text-[10px] italic">({oil.planetaryCorrespondence})</span>
              </span>
            ))}
          </div>
        </div>

        {/* MIDDLE NOTES (Target: ~50%) */}
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-400 text-stone-950 uppercase tracking-wider font-cinzel">
                Middle Notes
              </span>
              <span className="text-stone-300 font-medium">Heart / Emotional Resonator</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-emerald-300 font-bold">{middleDrops} Drops</span>
              <span className="text-stone-400">({middlePct}% • Target ~50%)</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${middlePct}%` }}
            ></div>
          </div>
          {/* Active Oils list */}
          <div className="flex flex-wrap gap-1.5">
            {middleOils.map((oil, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded bg-stone-800/90 text-emerald-200 border border-emerald-500/20 flex items-center gap-1.5"
              >
                <span className="font-semibold text-emerald-300">{oil.drops}d</span>
                <span>{oil.name}</span>
                <span className="text-stone-400 text-[10px] italic">({oil.planetaryCorrespondence})</span>
              </span>
            ))}
          </div>
        </div>

        {/* BASE NOTES (Target: ~20%) */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-400 text-stone-950 uppercase tracking-wider font-cinzel">
                Base Notes
              </span>
              <span className="text-stone-300 font-medium">Root / Fixative & Grounding</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-purple-300 font-bold">{baseDrops} Drops</span>
              <span className="text-stone-400">({basePct}% • Target ~20%)</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${basePct}%` }}
            ></div>
          </div>
          {/* Active Oils list */}
          <div className="flex flex-wrap gap-1.5">
            {baseOils.map((oil, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded bg-stone-800/90 text-purple-200 border border-purple-500/20 flex items-center gap-1.5"
              >
                <span className="font-semibold text-purple-300">{oil.drops}d</span>
                <span>{oil.name}</span>
                <span className="text-stone-400 text-[10px] italic">({oil.planetaryCorrespondence})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
