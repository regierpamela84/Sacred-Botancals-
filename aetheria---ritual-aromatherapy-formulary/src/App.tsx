import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ConsultationForm } from './components/ConsultationForm';
import { RecipeDisplay } from './components/RecipeDisplay';
import { BottleLabelModal } from './components/BottleLabelModal';
import { CompendiumModal } from './components/CompendiumModal';
import { GrimoireDrawer } from './components/GrimoireDrawer';
import { ClientConsultationInput, RitualBlendRecipe, ZodiacSign } from './types';
import { generateDeterministicRitualRecipe } from './utils/formulator';
import { Sparkles, ShieldCheck, Info } from 'lucide-react';

const DEFAULT_CONSULTATION: ClientConsultationInput = {
  clientName: 'Lady Aurelia',
  sunSign: 'Leo',
  moonSign: 'Aries',
  risingSign: 'Sagittarius',
  birthDate: '1992-08-10',
  lifePathNumber: 1,
  primaryIntent: 'Solar Sovereignty, Divine Vitality & Unshakable Heart Courage',
  carrierPreference: 'Golden Jojoba (Calendula & Amber Infused)',
  bottleSize: '1 oz (30 ml)',
  dilutionPreference: 'Standard Ritual (2% / 15 drops)',
  scentFamilyPreference: 'Resinous & Sacred Woods',
  skinSensitivityNotes: '',
};

export default function App() {
  const [consultation, setConsultation] = useState<ClientConsultationInput>(DEFAULT_CONSULTATION);
  const [currentRecipe, setCurrentRecipe] = useState<RitualBlendRecipe>(() =>
    generateDeterministicRitualRecipe(DEFAULT_CONSULTATION)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedRecipes, setSavedRecipes] = useState<RitualBlendRecipe[]>(() => {
    try {
      const stored = localStorage.getItem('aetheria_saved_recipes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);
  const [engineStatus, setEngineStatus] = useState<string>('Online');
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Check health endpoint on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setEngineStatus('Gemini AI & Esoteric Matrix');
        } else {
          setEngineStatus('Master Esoteric Formulation Engine');
        }
      })
      .catch(() => {
        setEngineStatus('Master Esoteric Formulation Engine (Offline Ready)');
      });
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aetheria_saved_recipes', JSON.stringify(savedRecipes));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedRecipes]);

  const handleGenerate = async (input: ClientConsultationInput) => {
    setIsLoading(true);
    setGenerationNotice(null);

    try {
      const response = await fetch('/api/generate-blend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.recipe) {
        setCurrentRecipe(data.recipe);
        setGenerationNotice('Channeled via Master Gemini AI with exact 30/50/20 & dilution compliance.');
      } else {
        // Deterministic fallback
        const fallbackRecipe = generateDeterministicRitualRecipe(input);
        setCurrentRecipe(fallbackRecipe);
        setGenerationNotice('Conceived via Master Esoteric Formulation Engine.');
      }
    } catch (err: any) {
      console.warn('Falling back to deterministic esoteric formulator:', err?.message);
      const fallbackRecipe = generateDeterministicRitualRecipe(input);
      setCurrentRecipe(fallbackRecipe);
      setGenerationNotice('Conceived via Master Esoteric Formulation Engine.');
    } finally {
      setIsLoading(false);
      // Auto-clear notice after 6 seconds
      setTimeout(() => setGenerationNotice(null), 6000);
    }
  };

  const handleSelectPreset = (preset: {
    sunSign: ZodiacSign;
    lifePath: number;
    intent: string;
    carrier: string;
    scent: string;
    dilution: 'Gentle (1% / 10 drops)' | 'Standard Ritual (2% / 15 drops)' | 'Potent Anointing (2.5% / 20 drops)';
  }) => {
    const updated: ClientConsultationInput = {
      ...consultation,
      sunSign: preset.sunSign,
      lifePathNumber: preset.lifePath,
      primaryIntent: preset.intent,
      carrierPreference: preset.carrier,
      scentFamilyPreference: preset.scent,
      dilutionPreference: preset.dilution,
    };
    setConsultation(updated);
    handleGenerate(updated);
  };

  const handleSaveToGrimoire = (recipe: RitualBlendRecipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id);
      } else {
        return [recipe, ...prev];
      }
    });
  };

  const isCurrentSaved = savedRecipes.some((r) => r.id === currentRecipe?.id);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      {/* Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onOpenGrimoire={() => setIsGrimoireOpen(true)}
        onOpenCompendium={() => setIsCompendiumOpen(true)}
        savedCount={savedRecipes.length}
        engineStatus={engineStatus}
      />

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Notification pill if present */}
        {generationNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{generationNotice}</span>
            </div>
            <button
              onClick={() => setGenerationNotice(null)}
              className="text-stone-400 hover:text-stone-200 text-xs font-mono"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Client Consultation Desk (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 no-print">
            <ConsultationForm
              initialValues={consultation}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />

            {/* Quick blending compliance summary card */}
            <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-cinzel font-bold text-xs uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict Wellness Apothecary Mandates</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-[11px] text-stone-300">
                <li>
                  <strong>Carrier Foundation:</strong> Infused lipid base (Golden Jojoba, Sweet Almond, Rosehip, Argan) in exact 1 oz / 30 ml or 2 oz / 60 ml.
                </li>
                <li>
                  <strong>Dilution Ceiling:</strong> 10 to 20 drops maximum essential oil per ounce (1% to 2.5% max).
                </li>
                <li>
                  <strong>Aromatic Harmony:</strong> Classical 30% Top, 50% Middle, 20% Base balance.
                </li>
                <li>
                  <strong>Esoteric Grounding:</strong> Planetary correspondences and Life Path vibration numbers aligned with each botanical drop.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Consecrated Ritual Parchment (7 cols on lg) */}
          <div className="lg:col-span-7">
            {currentRecipe && (
              <RecipeDisplay
                recipe={currentRecipe}
                onSaveToGrimoire={handleSaveToGrimoire}
                onOpenLabelModal={() => setIsLabelModalOpen(true)}
                isSaved={isCurrentSaved}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <BottleLabelModal
        recipe={currentRecipe}
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
      />

      <CompendiumModal
        isOpen={isCompendiumOpen}
        onClose={() => setIsCompendiumOpen(false)}
      />

      <GrimoireDrawer
        isOpen={isGrimoireOpen}
        onClose={() => setIsGrimoireOpen(false)}
        savedRecipes={savedRecipes}
        onSelectRecipe={(r) => setCurrentRecipe(r)}
        onDeleteRecipe={(id) => setSavedRecipes((prev) => prev.filter((r) => r.id !== id))}
        onClearAll={() => setSavedRecipes([])}
      />

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-cinzel text-stone-400">
            Aetheria Alchemy • Ritual-Grade Aromatherapeutic Formulations
          </div>
          <div className="text-[11px] text-stone-500">
            Adheres strictly to the 30/50/20 rule &amp; professional dermal dilution limits.
          </div>
        </div>
      </footer>
    </div>
  );
}
