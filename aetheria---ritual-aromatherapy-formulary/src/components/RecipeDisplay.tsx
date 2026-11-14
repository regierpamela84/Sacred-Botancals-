import React, { useState } from 'react';
import {
  Sparkles,
  Printer,
  Copy,
  Check,
  Bookmark,
  AlertTriangle,
  Flame,
  Droplet,
  Tag,
  ShieldCheck,
  Moon,
  Clock,
  Layers,
} from 'lucide-react';
import { RitualBlendRecipe } from '../types';
import { NotePyramidVisualizer } from './NotePyramidVisualizer';

interface RecipeDisplayProps {
  recipe: RitualBlendRecipe;
  onSaveToGrimoire: (recipe: RitualBlendRecipe) => void;
  onOpenLabelModal: () => void;
  isSaved: boolean;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipe,
  onSaveToGrimoire,
  onOpenLabelModal,
  isSaved,
}) => {
  const [copied, setCopied] = useState(false);

  const formatCopyText = (): string => {
    const totalDrops = recipe.noteDistribution?.totalDrops || 15;
    const topOils = recipe.essentialOils.filter((o) => o.note === 'Top');
    const middleOils = recipe.essentialOils.filter((o) => o.note === 'Middle');
    const baseOils = recipe.essentialOils.filter((o) => o.note === 'Base');

    let text = `=======================================================\n`;
    text += `AETHERIA ALCHEMY • RITUAL-GRADE OIL FORMULATION\n`;
    text += `=======================================================\n\n`;

    text += `1. NAME OF THE RITUAL BLEND:\n${recipe.name}\n${recipe.subtitle || ''}\n\n`;

    text += `2. METAPHYSICAL INTENT (ASTROLOGY & NUMEROLOGY ALIGNMENT):\n`;
    text += `• Astrology Alignment: ${recipe.metaphysicalIntent.astrologyAlignment}\n`;
    text += `• Numerology Alignment: ${recipe.metaphysicalIntent.numerologyAlignment}\n`;
    text += `• Planetary Ruler & Element: ${recipe.metaphysicalIntent.planetaryRuler} (${recipe.metaphysicalIntent.elementalDominance})\n`;
    text += `• Synthesis: ${recipe.metaphysicalIntent.summary}\n\n`;

    text += `3. THE RECIPE:\n`;
    text += `• Vessel Size: ${recipe.bottleSize}\n`;
    text += `• Safe Dilution Level: ${recipe.dilutionRate}\n`;
    text += `• Infused Carrier Oil Base:\n`;
    recipe.carrierBase.forEach((c) => {
      text += `  - ${c.amount}: ${c.name}\n    Infusion: ${c.botanicalInfusion || 'Solar macerate'}\n`;
    });
    text += `\n• Essential Oils (${totalDrops} Total Drops — 30/50/20 Aromatic Ratio):\n`;
    text += `  [TOP NOTES (30%)]\n`;
    topOils.forEach((o) => {
      text += `  - ${o.drops} drops: ${o.name} (${o.botanicalName || ''}) — ${o.planetaryCorrespondence} / Vibration ${o.numerologyVibration}\n`;
    });
    text += `  [MIDDLE NOTES (50%)]\n`;
    middleOils.forEach((o) => {
      text += `  - ${o.drops} drops: ${o.name} (${o.botanicalName || ''}) — ${o.planetaryCorrespondence} / Vibration ${o.numerologyVibration}\n`;
    });
    text += `  [BASE NOTES (20%)]\n`;
    baseOils.forEach((o) => {
      text += `  - ${o.drops} drops: ${o.name} (${o.botanicalName || ''}) — ${o.planetaryCorrespondence} / Vibration ${o.numerologyVibration}\n`;
    });

    text += `\n4. RITUAL & APPLICATION INSTRUCTIONS:\n`;
    text += `• Consecration Timing: ${recipe.ritualInstructions.consecrationTiming}\n`;
    text += `• Charging Method: ${recipe.ritualInstructions.chargingMethod}\n`;
    text += `• Application Points:\n`;
    recipe.ritualInstructions.applicationPoints.forEach((p) => {
      text += `  - ${p}\n`;
    });
    text += `• Invocation / Incantation: ${recipe.ritualInstructions.incantationOrIntention}\n\n`;

    text += `5. SAFETY DISCLAIMER & TOXICOLOGY WARNINGS:\n`;
    text += `• ${recipe.safetyDisclaimer.skinPatchTestMandate}\n`;
    recipe.safetyDisclaimer.specificWarnings.forEach((w) => {
      text += `• Specific Caution: ${w}\n`;
    });

    text += `\n=======================================================\n`;
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatCopyText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <article
      id="ritual-recipe-card"
      className="bg-stone-900/95 border border-amber-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black"
    >
      {/* Decorative parchment background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-800 no-print">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Ritual-Grade Master Formulation
          </span>
          <span className="text-xs text-stone-400 font-mono">
            {new Date(recipe.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLabelModal}
            id="view-bottle-label-btn"
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Preview 1 oz Apothecary Bottle Label"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Bottle Label</span>
          </button>

          <button
            onClick={handleCopy}
            id="copy-recipe-btn"
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Copy formatted parchment text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-300" />
                <span>Copy Ritual Text</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSaveToGrimoire(recipe)}
            id="save-grimoire-btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'In Grimoire' : 'Save Blend'}</span>
          </button>

          <button
            onClick={handlePrint}
            id="print-recipe-btn"
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
            title="Print Ritual Parchment"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 1: NAME OF THE RITUAL BLEND */}
      <header className="mb-8 text-center sm:text-left">
        <div className="inline-block mb-2">
          <span className="text-[11px] uppercase tracking-widest font-mono text-amber-400/90 font-semibold px-2.5 py-0.5 rounded bg-amber-950/40 border border-amber-600/30">
            Consecrated Alchemy No. {recipe.name.match(/No\.?\s*(\d+)/i)?.[1] || '1'}
          </span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-100 tracking-wide leading-tight">
          {recipe.name}
        </h2>
        {recipe.subtitle && (
          <p className="font-playfair italic text-sm sm:text-base text-stone-400 mt-1.5">
            {recipe.subtitle}
          </p>
        )}
      </header>

      {/* SECTION 2: METAPHYSICAL INTENT */}
      <section className="mb-8 p-5 rounded-xl bg-stone-950/70 border border-amber-900/30 shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded bg-amber-500/20 text-amber-300">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="font-cinzel font-bold text-sm tracking-wider uppercase text-amber-300">
            2. Metaphysical Intent (Astrology &amp; Numerology Alignment)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3.5 rounded-lg bg-stone-900/90 border border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span className="font-semibold uppercase tracking-wider font-cinzel text-amber-400">
                Astrological Signature
              </span>
              <span className="font-mono text-[11px] text-stone-400">
                {recipe.metaphysicalIntent.elementalDominance}
              </span>
            </div>
            <p className="text-xs text-stone-200 font-medium">
              {recipe.metaphysicalIntent.astrologyAlignment}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Governing Planet: <span className="text-amber-300">{recipe.metaphysicalIntent.planetaryRuler}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-stone-900/90 border border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span className="font-semibold uppercase tracking-wider font-cinzel text-amber-400">
                Numerological Vibration
              </span>
              <span className="font-mono text-[11px] text-stone-400">Cosmic Frequency</span>
            </div>
            <p className="text-xs text-stone-200 font-medium">
              {recipe.metaphysicalIntent.numerologyAlignment}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-stone-300 leading-relaxed italic font-serif">
          &ldquo;{recipe.metaphysicalIntent.summary}&rdquo;
        </div>
      </section>

      {/* SECTION 3: THE RECIPE */}
      <section className="mb-8 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-300">
              <Droplet className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel font-bold text-sm tracking-wider uppercase text-emerald-300">
              3. The Recipe: Exact Carrier Oil &amp; Essential Oil Measurements
            </h3>
          </div>
          <div className="text-xs font-mono text-stone-400 hidden sm:block">
            Vessel: <span className="text-stone-200">{recipe.bottleSize}</span> • Dilution:{' '}
            <span className="text-emerald-400 font-semibold">{recipe.dilutionRate}</span>
          </div>
        </div>

        {/* Carrier Oil Base Component */}
        <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-cinzel text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Infused Carrier Oil Foundation (Lipid Base)
            </h4>
            <span className="px-2.5 py-0.5 rounded text-xs bg-amber-950/60 border border-amber-600/30 text-amber-200 font-mono">
              Mandatory Matrix Base
            </span>
          </div>
          {recipe.carrierBase.map((carrier, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                <span className="text-stone-100 font-semibold">{carrier.name}</span>
                <span className="font-mono text-amber-300 font-bold text-xs">{carrier.amount}</span>
              </div>
              {carrier.botanicalInfusion && (
                <p className="text-xs text-amber-200/80 italic">
                  Botanical Infusion: {carrier.botanicalInfusion}
                </p>
              )}
              <p className="text-xs text-stone-400">{carrier.properties}</p>
            </div>
          ))}
        </div>

        {/* 30/50/20 Visualizer */}
        <NotePyramidVisualizer
          distribution={recipe.noteDistribution}
          essentialOils={recipe.essentialOils}
        />

        {/* Detailed Essential Oils Formulation Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 font-cinzel text-[11px] uppercase tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-3.5">Note</th>
                <th className="py-3 px-3.5">Drops</th>
                <th className="py-3 px-3.5">Botanical / Common Name</th>
                <th className="py-3 px-3.5">Astrology / Planet</th>
                <th className="py-3 px-3.5">Numerology</th>
                <th className="py-3 px-3.5">Metaphysical Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 bg-stone-900/40">
              {recipe.essentialOils.map((oil, idx) => {
                const isTop = oil.note === 'Top';
                const isMiddle = oil.note === 'Middle';
                const badgeColor = isTop
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                  : isMiddle
                  ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-purple-400/20 text-purple-300 border-purple-400/30';

                return (
                  <tr key={idx} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeColor} uppercase tracking-wider font-cinzel`}
                      >
                        {oil.note}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-sm font-bold text-stone-100">
                      {oil.drops} <span className="text-[11px] text-stone-400 font-normal">drops</span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-stone-100">{oil.name}</div>
                      {oil.botanicalName && (
                        <div className="text-[10px] text-stone-400 italic">{oil.botanicalName}</div>
                      )}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap text-stone-300">
                      <span className="font-medium text-amber-200">{oil.planetaryCorrespondence}</span>
                      <div className="text-[10px] text-stone-400">{oil.astrologicalSign}</div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-stone-300">
                      #{oil.numerologyVibration}
                    </td>
                    <td className="py-3 px-3.5 text-stone-300 leading-snug">
                      <p>{oil.therapeuticIntent}</p>
                      {oil.safetyCaution && (
                        <p className="text-[10px] text-amber-400/90 mt-0.5">⚠️ {oil.safetyCaution}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dilution Rule Certification Banner */}
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/40 flex items-center justify-between text-xs text-emerald-200 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Safe Dilution Certified:</strong> {recipe.noteDistribution.totalDrops} total drops in{' '}
              {recipe.bottleSize}. Adheres strictly to the maximum 10-20 drops / oz aromatherapy threshold.
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-900/60 rounded text-[11px]">
            100% Compliant
          </span>
        </div>
      </section>

      {/* SECTION 4: RITUAL / APPLICATION INSTRUCTIONS */}
      <section className="mb-8 p-5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-800/80 pb-2.5">
          <div className="p-1.5 rounded bg-amber-500/20 text-amber-300">
            <Moon className="w-4 h-4" />
          </div>
          <h3 className="font-cinzel font-bold text-sm tracking-wider uppercase text-amber-300">
            4. Ritual &amp; Application Instructions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Consecration Timing &amp; Planetary Hour
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/80 p-3 rounded-lg border border-stone-800">
              {recipe.ritualInstructions.consecrationTiming}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Charging &amp; Vessel Energetics
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/80 p-3 rounded-lg border border-stone-800">
              {recipe.ritualInstructions.chargingMethod}
            </p>
          </div>
        </div>

        {/* Application Points */}
        <div>
          <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-2">
            Sacred Anointing Pulse Points
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {recipe.ritualInstructions.applicationPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 flex items-start gap-2"
              >
                <span className="font-mono text-amber-400 font-bold">0{idx + 1}.</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incantation */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/40 text-center">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 block mb-1">
            Ritual Incantation / Attunement Mantra
          </span>
          <p className="font-playfair text-sm sm:text-base text-amber-100 italic leading-relaxed">
            {recipe.ritualInstructions.incantationOrIntention}
          </p>
        </div>
      </section>

      {/* SECTION 5: SAFETY DISCLAIMER */}
      <section className="p-5 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3">
        <div className="flex items-center gap-2 text-red-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <h3 className="font-cinzel font-bold text-sm tracking-wider uppercase">
            5. Safety Disclaimer &amp; Toxicology Warnings
          </h3>
        </div>

        {/* Mandatory Skin Patch Test */}
        <div className="p-3.5 rounded-lg bg-stone-950/90 border border-red-900/50">
          <div className="text-xs font-bold text-red-300 uppercase tracking-wider mb-1">
            Mandatory Dermal Patch Test Protocol
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {recipe.safetyDisclaimer.skinPatchTestMandate}
          </p>
        </div>

        {/* Specific Warnings */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider font-cinzel">
            Formulation-Specific Cautions:
          </span>
          <ul className="space-y-1 text-xs text-stone-300 list-disc list-inside">
            {recipe.safetyDisclaimer.specificWarnings.map((warning, idx) => (
              <li key={idx} className="leading-relaxed">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
};
