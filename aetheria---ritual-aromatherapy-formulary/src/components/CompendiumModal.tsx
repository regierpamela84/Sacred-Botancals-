import React, { useState } from 'react';
import { X, Search, Sparkles, AlertTriangle, ShieldCheck, Sun, Moon } from 'lucide-react';
import { ESSENTIAL_OILS_COMPENDIUM, CARRIER_BASES, NUMEROLOGY_MEANINGS, ZODIAC_CORRESPONDENCES } from '../data/correspondences';
import { NoteType } from '../types';

interface CompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompendiumModal: React.FC<CompendiumModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'oils' | 'carriers' | 'numerology' | 'zodiac'>('oils');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteFilter, setNoteFilter] = useState<'All' | NoteType>('All');

  if (!isOpen) return null;

  const filteredOils = ESSENTIAL_OILS_COMPENDIUM.filter((oil) => {
    const matchesSearch =
      oil.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      oil.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      oil.planet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      oil.metaphysicalRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNote = noteFilter === 'All' || oil.note === noteFilter;
    return matchesSearch && matchesNote;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold uppercase tracking-wider text-stone-100">
                Aetheria Esoteric Compendium
              </h3>
              <p className="text-xs text-stone-400">
                Aromatherapy Notes, Astrological Rulers &amp; Numerological Frequencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-4 pt-2 gap-2 text-xs font-cinzel overflow-x-auto">
          <button
            onClick={() => setActiveTab('oils')}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'oils'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Essential Oils ({ESSENTIAL_OILS_COMPENDIUM.length})
          </button>
          <button
            onClick={() => setActiveTab('carriers')}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'carriers'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Infused Carrier Bases ({CARRIER_BASES.length})
          </button>
          <button
            onClick={() => setActiveTab('numerology')}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'numerology'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Numerology Numbers (1–33)
          </button>
          <button
            onClick={() => setActiveTab('zodiac')}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'zodiac'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Zodiac Alignments (12 Signs)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'oils' && (
            <>
              {/* Search & Note filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search oils by name, botanical name, planet, or purpose..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-stone-400 font-cinzel">Note:</span>
                  {(['All', 'Top', 'Middle', 'Base'] as const).map((note) => (
                    <button
                      key={note}
                      onClick={() => setNoteFilter(note)}
                      className={`px-2.5 py-1 rounded-lg border transition-colors ${
                        noteFilter === note
                          ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                          : 'bg-stone-950 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>

              {/* Oils grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredOils.map((oil, idx) => {
                  const isTop = oil.note === 'Top';
                  const isMiddle = oil.note === 'Middle';
                  const noteBadgeClass = isTop
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                    : isMiddle
                    ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-purple-400/20 text-purple-300 border-purple-400/30';

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-stone-700 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-stone-100">{oil.name}</h4>
                          <span className="text-[11px] text-stone-400 italic">
                            {oil.botanicalName}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${noteBadgeClass} uppercase tracking-wider font-cinzel`}
                        >
                          {oil.note} Note
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-mono">
                          Planet: {oil.planet}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 font-mono">
                          Zodiac: {oil.zodiac.join(', ')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 font-mono">
                          Vibration: #{oil.numerology.join(', ')}
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 leading-snug">
                        <strong>Metaphysical:</strong> {oil.metaphysicalRole}
                      </p>

                      <p className="text-[11px] text-stone-400">
                        <strong>Aroma:</strong> {oil.scentProfile}
                      </p>

                      {oil.safetyCaution && (
                        <div className="text-[10px] p-2 rounded bg-amber-950/30 border border-amber-900/40 text-amber-200 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{oil.safetyCaution}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'carriers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CARRIER_BASES.map((carrier, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-amber-300 font-cinzel">{carrier.name}</h4>
                    <span className="text-xs font-mono text-stone-400">{carrier.amount}</span>
                  </div>
                  <div className="text-xs text-amber-200/90 italic bg-amber-950/30 p-2 rounded border border-amber-900/40">
                    <strong>Infusion:</strong> {carrier.botanicalInfusion}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{carrier.properties}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'numerology' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(NUMEROLOGY_MEANINGS).map(([num, meta]) => (
                <div
                  key={num}
                  className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-base font-bold text-amber-300">
                      Number {num} — {meta.vibration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-900 text-[11px] font-mono text-stone-300 border border-stone-800">
                      Ruler: {meta.planet}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{meta.essence}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'zodiac' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(ZODIAC_CORRESPONDENCES).map(([sign, meta]) => (
                <div
                  key={sign}
                  className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-stone-200 font-cinzel">
                    <span>{sign}</span>
                    <span className="text-amber-400">{meta.planet}</span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Element: {meta.element} ({meta.polarity})
                  </div>
                  <div className="text-[11px] text-amber-200/90">
                    <strong>Herbs:</strong> {meta.coreHerb}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Affinity: {meta.keyAffinity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
