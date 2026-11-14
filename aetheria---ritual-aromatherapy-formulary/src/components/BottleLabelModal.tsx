import React from 'react';
import { X, Printer, Sparkles, Droplet } from 'lucide-react';
import { RitualBlendRecipe } from '../types';

interface BottleLabelModalProps {
  recipe: RitualBlendRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BottleLabelModal: React.FC<BottleLabelModalProps> = ({ recipe, isOpen, onClose }) => {
  if (!isOpen || !recipe) return null;

  const topOils = recipe.essentialOils.filter((o) => o.note === 'Top');
  const middleOils = recipe.essentialOils.filter((o) => o.note === 'Middle');
  const baseOils = recipe.essentialOils.filter((o) => o.note === 'Base');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-stone-200">
              Apothecary Bottle Label Preview (1 oz / 30ml)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Vintage Apothecary Label */}
        <div className="p-1 rounded-xl bg-gradient-to-b from-amber-700/40 via-amber-900/20 to-stone-900 shadow-inner">
          <div className="bg-[#fcf8ec] text-[#241a0d] p-6 rounded-lg border-2 border-[#875d27] relative font-serif text-center space-y-3">
            {/* Corner Filigree Borders */}
            <div className="absolute top-1 left-1 text-[#875d27] text-xs">✦</div>
            <div className="absolute top-1 right-1 text-[#875d27] text-xs">✦</div>
            <div className="absolute bottom-1 left-1 text-[#875d27] text-xs">✦</div>
            <div className="absolute bottom-1 right-1 text-[#875d27] text-xs">✦</div>

            <div className="text-[10px] tracking-[0.25em] uppercase font-cinzel font-bold text-[#6d491f]">
              Aetheria Artisanal Apothecary
            </div>

            <div className="border-t border-b border-[#875d27]/40 py-2">
              <h2 className="font-cinzel text-lg sm:text-xl font-extrabold uppercase tracking-wide text-[#1b1206]">
                {recipe.name}
              </h2>
              <div className="text-xs italic text-[#553b19] mt-0.5">
                {recipe.metaphysicalIntent.astrologyAlignment}
              </div>
            </div>

            <div className="text-[11px] leading-snug text-[#3d2a13]">
              <div className="font-bold uppercase tracking-wider font-cinzel text-[9px] mb-1">
                Concealed Formula (30/50/20 Ratio • {recipe.bottleSize})
              </div>
              <p className="text-[10px] font-mono">
                {topOils.map((o) => `${o.drops}d ${o.name}`).join(', ')} (Top) •{' '}
                {middleOils.map((o) => `${o.drops}d ${o.name}`).join(', ')} (Mid) •{' '}
                {baseOils.map((o) => `${o.drops}d ${o.name}`).join(', ')} (Base)
              </p>
              <p className="text-[10px] text-[#6d491f] mt-1">
                Base: {recipe.carrierBase[0]?.name || 'Infused Jojoba'}
              </p>
            </div>

            <div className="bg-[#f0e8d5] p-2 rounded border border-[#875d27]/30 text-[10px] text-[#4d3417] text-left space-y-1">
              <div>
                <strong>Application:</strong>{' '}
                {recipe.ritualInstructions.applicationPoints[0] || 'Wrist pulse points'}
              </div>
              <div>
                <strong>Timing:</strong> {recipe.ritualInstructions.consecrationTiming.slice(0, 70)}...
              </div>
            </div>

            <div className="text-[9px] text-[#78231c] font-bold border-t border-[#875d27]/30 pt-1.5 uppercase tracking-wider">
              ⚠️ For External Ritual Anointing Only • 24hr Skin Patch Test Mandated
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5 pt-3 border-t border-stone-800">
          <span className="text-xs text-stone-400 font-mono">
            Standard 1.75&quot; x 3.25&quot; Dropper Label Size
          </span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label</span>
          </button>
        </div>
      </div>
    </div>
  );
};
