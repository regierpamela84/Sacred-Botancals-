import React from 'react';
import { Sparkles, BookOpen, ShieldCheck, Bookmark, Compass } from 'lucide-react';
import { ZodiacSign } from '../types';

interface HeaderProps {
  onSelectPreset: (preset: {
    sunSign: ZodiacSign;
    lifePath: number;
    intent: string;
    carrier: string;
    scent: string;
    dilution: 'Gentle (1% / 10 drops)' | 'Standard Ritual (2% / 15 drops)' | 'Potent Anointing (2.5% / 20 drops)';
  }) => void;
  onOpenGrimoire: () => void;
  onOpenCompendium: () => void;
  savedCount: number;
  engineStatus: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onOpenGrimoire,
  onOpenCompendium,
  savedCount,
  engineStatus,
}) => {
  const PRESETS = [
    {
      label: 'Solar Sovereignty',
      glyph: '☀️',
      sunSign: 'Leo' as ZodiacSign,
      lifePath: 1,
      intent: 'Sovereign leadership, divine vitality, radiant heart courage',
      carrier: 'Golden Jojoba (Calendula & Amber Infused)',
      scent: 'Resinous & Sacred Woods',
      dilution: 'Standard Ritual (2% / 15 drops)' as const,
    },
    {
      label: 'Lunar Sanctuary',
      glyph: '🌙',
      sunSign: 'Cancer' as ZodiacSign,
      lifePath: 2,
      intent: 'Deep somatic rest, psychic intuition, emotional renewal',
      carrier: 'Sweet Almond (Chamomile & Pearl Infused)',
      scent: 'Ethereal Floral',
      dilution: 'Gentle (1% / 10 drops)' as const,
    },
    {
      label: 'Mercurial Caduceus',
      glyph: '⚡',
      sunSign: 'Gemini' as ZodiacSign,
      lifePath: 5,
      intent: 'Sharp intellectual clarity, throat chakra eloquence, swift travel',
      carrier: 'Golden Jojoba (Calendula & Amber Infused)',
      scent: 'Crisp Herbal Citrus',
      dilution: 'Standard Ritual (2% / 15 drops)' as const,
    },
    {
      label: 'Venusian Heart',
      glyph: '🌹',
      sunSign: 'Taurus' as ZodiacSign,
      lifePath: 6,
      intent: 'Unconditional love attraction, sensual embodiment, aesthetic grace',
      carrier: 'Wild Rosehip Seed & Golden Jojoba Blend',
      scent: 'Ethereal Floral',
      dilution: 'Standard Ritual (2% / 15 drops)' as const,
    },
    {
      label: 'Mystic Temple',
      glyph: '👁️',
      sunSign: 'Pisces' as ZodiacSign,
      lifePath: 7,
      intent: 'Astral lucidity, meditation communion, third-eye awakening',
      carrier: 'Sweet Almond (Chamomile & Pearl Infused)',
      scent: 'Resinous & Sacred Woods',
      dilution: 'Standard Ritual (2% / 15 drops)' as const,
    },
    {
      label: 'Saturnian Anchor',
      glyph: '⚖️',
      sunSign: 'Capricorn' as ZodiacSign,
      lifePath: 8,
      intent: 'Karmic boundary protection, material wealth manifestation, deep earth grounding',
      carrier: 'Organic Moroccan Argan (Frankincense Resin Cured)',
      scent: 'Resinous & Sacred Woods',
      dilution: 'Potent Anointing (2.5% / 20 drops)' as const,
    },
    {
      label: 'Mars Warrior Flame',
      glyph: '⚔️',
      sunSign: 'Aries' as ZodiacSign,
      lifePath: 9,
      intent: 'Courage under pressure, breaking inertia, psychic auric clearing',
      carrier: 'Golden Jojoba (Calendula & Amber Infused)',
      scent: 'Warm Mystical Spice',
      dilution: 'Standard Ritual (2% / 15 drops)' as const,
    },
  ];

  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-700/30 to-stone-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-950/40">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-stone-100 uppercase">
                  Aetheria
                </h1>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                  Apothecary
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Master Ritual Oil Formulary • Astrology, Numerology &amp; Safe Aromatherapy
              </p>
            </div>
          </div>

          {/* Action buttons & Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dilution Max 10-20d/oz • 30/50/20 Rule</span>
            </div>

            <button
              id="open-compendium-btn"
              onClick={onOpenCompendium}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-200 transition-colors"
              title="Aroma, Zodiac & Numerology Database"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Esoteric Compendium</span>
            </button>

            <button
              id="open-grimoire-btn"
              onClick={onOpenGrimoire}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/50 text-xs text-amber-200 font-medium transition-colors"
              title="View Saved Ritual Recipes"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Saved Grimoire ({savedCount})</span>
            </button>
          </div>
        </div>

        {/* Quick Archetype Presets Bar */}
        <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-stone-400 text-[11px] uppercase tracking-wider font-cinzel whitespace-nowrap flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-amber-400" />
            Quick Archetypes:
          </span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1 rounded-full bg-stone-900/90 hover:bg-amber-950/60 text-stone-300 hover:text-amber-200 border border-stone-800 hover:border-amber-600/50 whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 text-xs"
            >
              <span>{preset.glyph}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
