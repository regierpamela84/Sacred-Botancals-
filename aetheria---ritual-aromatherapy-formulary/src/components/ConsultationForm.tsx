import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Droplet, Flame, AlertCircle, Wand2 } from 'lucide-react';
import { ClientConsultationInput, ZodiacSign } from '../types';
import { calculateLifePathNumber } from '../utils/formulator';
import { NUMEROLOGY_MEANINGS, CARRIER_BASES } from '../data/correspondences';

interface ConsultationFormProps {
  initialValues: ClientConsultationInput;
  onSubmit: (data: ClientConsultationInput) => void;
  isLoading: boolean;
}

const ZODIAC_LIST: ZodiacSign[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const INTENT_PRESETS = [
  'Solar Sovereignty, Wealth & Vitality',
  'Emotional Sanctuary & Heart Restoration',
  'Psychic Intuition & Lucid Dreamwork',
  'Spiritual Protection & Auric Clearing',
  'Courage, Kundalini Fire & Creative Breakthrough',
  'Somatic Grounding & Nervous System Ease',
];

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ClientConsultationInput>(initialValues);
  const [manualLifePath, setManualLifePath] = useState<boolean>(false);

  // Sync when initialValues changes (e.g., clicking a preset)
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const computed = calculateLifePathNumber(val);
    setFormData((prev) => ({
      ...prev,
      birthDate: val,
      lifePathNumber: manualLifePath ? prev.lifePathNumber : computed,
    }));
  };

  const handleFieldChange = <K extends keyof ClientConsultationInput>(
    field: K,
    value: ClientConsultationInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const currentLifePathMeta = NUMEROLOGY_MEANINGS[formData.lifePathNumber] || NUMEROLOGY_MEANINGS[1];

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      <div className="border-b border-stone-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-stone-100 tracking-wide">
              Client Esoteric Consultation
            </h3>
            <p className="text-xs text-stone-400">
              Input seeker birth correspondences, metaphysical purpose, and skin specifications.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Client Name & Purpose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-1.5">
              Client / Seeker Name
            </label>
            <input
              type="text"
              id="client-name-input"
              value={formData.clientName}
              onChange={(e) => handleFieldChange('clientName', e.target.value)}
              placeholder="e.g. Lady Seraphina"
              className="w-full bg-stone-950/80 border border-stone-700/80 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-1.5">
              Bottle Size &amp; Vessel
            </label>
            <select
              id="bottle-size-select"
              value={formData.bottleSize}
              onChange={(e) => handleFieldChange('bottleSize', e.target.value as any)}
              className="w-full bg-stone-950/80 border border-stone-700/80 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none transition-colors"
            >
              <option value="1 oz (30 ml)">1 oz (30 ml) — Standard Ritual Bottle</option>
              <option value="2 oz (60 ml)">2 oz (60 ml) — Sacred Altar Apothecary Vessel</option>
            </select>
          </div>
        </div>

        {/* Astrological Trinity: Sun, Moon, Rising */}
        <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Astrological Trinity Correspondences
            </span>
            <span className="text-[11px] text-stone-400 font-mono">Planetary &amp; Elemental Roots</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-stone-400 font-medium mb-1">
                Sun Sign (Core Essence) *
              </label>
              <select
                id="sun-sign-select"
                value={formData.sunSign}
                onChange={(e) => handleFieldChange('sunSign', e.target.value as ZodiacSign)}
                className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none"
              >
                {ZODIAC_LIST.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 font-medium mb-1">
                Moon Sign (Emotional Waters)
              </label>
              <select
                id="moon-sign-select"
                value={formData.moonSign}
                onChange={(e) => handleFieldChange('moonSign', e.target.value as any)}
                className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none"
              >
                <option value="">-- Optional Alignment --</option>
                {ZODIAC_LIST.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 font-medium mb-1">
                Rising / Ascendant (Somatic Vessel)
              </label>
              <select
                id="rising-sign-select"
                value={formData.risingSign}
                onChange={(e) => handleFieldChange('risingSign', e.target.value as any)}
                className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none"
              >
                <option value="">-- Optional Alignment --</option>
                {ZODIAC_LIST.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Numerology Matrix */}
        <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Numerological Vibration Attunement
            </span>
            <button
              type="button"
              onClick={() => setManualLifePath(!manualLifePath)}
              className="text-[10px] text-amber-400/80 hover:text-amber-300 underline font-mono"
            >
              {manualLifePath ? 'Use Auto Birth Calculator' : 'Override Life Path Number'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-stone-400 font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                Birth Date (Auto-calculates Life Path)
              </label>
              <input
                type="date"
                id="birthdate-input"
                value={formData.birthDate || ''}
                onChange={handleBirthDateChange}
                className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 font-medium mb-1">
                Life Path Vibration Number
              </label>
              <select
                id="lifepath-select"
                value={formData.lifePathNumber}
                disabled={!manualLifePath && Boolean(formData.birthDate)}
                onChange={(e) => handleFieldChange('lifePathNumber', Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none disabled:opacity-75"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((num) => (
                  <option key={num} value={num}>
                    Number {num} — {NUMEROLOGY_MEANINGS[num]?.planet} ({NUMEROLOGY_MEANINGS[num]?.vibration})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-[11px] text-stone-400 flex items-start gap-2">
            <span className="font-mono text-amber-300 font-bold">Vibration #{formData.lifePathNumber}:</span>
            <span>{currentLifePathMeta?.essence}</span>
          </div>
        </div>

        {/* Metaphysical Intention */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-1.5">
            Metaphysical Intent &amp; Spiritual Aim
          </label>
          <input
            type="text"
            id="primary-intent-input"
            value={formData.primaryIntent}
            onChange={(e) => handleFieldChange('primaryIntent', e.target.value)}
            placeholder="e.g., Unconditional Heart Healing, New Moon Manifestation, Solar Leadership"
            className="w-full bg-stone-950/80 border border-stone-700/80 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none transition-colors"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {INTENT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleFieldChange('primaryIntent', preset)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-amber-200 border border-stone-700/60 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Carrier Oil & Dilution Safety Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-1.5 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-amber-400" />
              Infused Carrier Oil Base *
            </label>
            <select
              id="carrier-base-select"
              value={formData.carrierPreference}
              onChange={(e) => handleFieldChange('carrierPreference', e.target.value)}
              className="w-full bg-stone-950/80 border border-stone-700/80 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none transition-colors"
            >
              {CARRIER_BASES.map((carrier) => (
                <option key={carrier.id} value={carrier.name}>
                  {carrier.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-400 mt-1 italic">
              Mandatory infused lipid foundation for ritual stability and skin absorption.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-1.5">
              Safe Dilution Level (Aromatherapy Standard)
            </label>
            <select
              id="dilution-select"
              value={formData.dilutionPreference}
              onChange={(e) => handleFieldChange('dilutionPreference', e.target.value as any)}
              className="w-full bg-stone-950/80 border border-stone-700/80 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none transition-colors"
            >
              <option value="Gentle (1% / 10 drops)">
                Gentle (1% Dilution) — 10 drops total / 1 oz (Sensitive skin / Subtle aura)
              </option>
              <option value="Standard Ritual (2% / 15 drops)">
                Standard Ritual (2% Dilution) — 15 drops total / 1 oz (Apothecary benchmark)
              </option>
              <option value="Potent Anointing (2.5% / 20 drops)">
                Potent Anointing (2.5% Dilution) — 20 drops total / 1 oz (High intensity ritual)
              </option>
            </select>
            <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1 font-mono">
              <span>✓ Guaranteed strictly within 10-20 drops / oz limit</span>
            </div>
          </div>
        </div>

        {/* Scent family & Allergies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-1.5">
              Olfactory Scent Archetype
            </label>
            <select
              id="scent-family-select"
              value={formData.scentFamilyPreference}
              onChange={(e) => handleFieldChange('scentFamilyPreference', e.target.value)}
              className="w-full bg-stone-950/80 border border-stone-700/80 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none transition-colors"
            >
              <option value="Resinous & Sacred Woods">Resinous &amp; Sacred Woods (Frankincense, Cedar, Myrrh)</option>
              <option value="Ethereal Floral">Ethereal Floral (Rose, Geranium, Chamomile, Ylang)</option>
              <option value="Crisp Herbal Citrus">Crisp Herbal Citrus (Bergamot, Rosemary, Peppermint)</option>
              <option value="Warm Mystical Spice">Warm Mystical Spice (Cardamom, Black Pepper, Patchouli)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider font-cinzel mb-1.5">
              Dermal Sensitivities / Cautions
            </label>
            <input
              type="text"
              id="skin-sensitivities-input"
              value={formData.skinSensitivityNotes}
              onChange={(e) => handleFieldChange('skinSensitivityNotes', e.target.value)}
              placeholder="e.g. Sensitive to hot oils, avoids cinnamon, pregnancy notes"
              className="w-full bg-stone-950/80 border border-stone-700/80 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-recipe-btn"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-cinzel font-bold text-sm tracking-wider uppercase shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Channeling Master Formulation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Conceive Master Ritual Blend</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-stone-400 mt-2 font-mono">
            Enforces: Infused Carrier Base • 10-20 Drops/oz Dilution • 30/50/20 Balance • Astro-Numerology
          </p>
        </div>
      </form>
    </div>
  );
};
