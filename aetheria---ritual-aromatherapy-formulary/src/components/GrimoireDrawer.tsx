import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Sparkles, Droplet } from 'lucide-react';
import { RitualBlendRecipe } from '../types';

interface GrimoireDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: RitualBlendRecipe[];
  onSelectRecipe: (recipe: RitualBlendRecipe) => void;
  onDeleteRecipe: (id: string) => void;
  onClearAll: () => void;
}

export const GrimoireDrawer: React.FC<GrimoireDrawerProps> = ({
  isOpen,
  onClose,
  savedRecipes,
  onSelectRecipe,
  onDeleteRecipe,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="bg-stone-900 border-l border-stone-800 w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-cinzel text-base font-bold uppercase tracking-wider text-stone-100">
                Sacred Grimoire
              </h3>
              <p className="text-xs text-stone-400">Saved Master Ritual Recipes ({savedRecipes.length})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-800/80 mx-auto flex items-center justify-center text-stone-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-cinzel text-sm font-semibold text-stone-300">Your Grimoire is Empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Generate and save bespoke ritual oil formulations to preserve them for your apothecary records.
              </p>
            </div>
          ) : (
            savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-700/50 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {recipe.name}
                    </h4>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {recipe.clientName ? `Client: ${recipe.clientName} • ` : ''}
                      {recipe.bottleSize}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteRecipe(recipe.id)}
                    className="text-stone-500 hover:text-red-400 p-1 transition-colors"
                    title="Remove from Grimoire"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-stone-300 line-clamp-2 italic font-serif">
                  {recipe.metaphysicalIntent.summary}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
                  <span className="text-[11px] text-amber-300 font-mono">
                    {recipe.noteDistribution.totalDrops} drops (30/50/20)
                  </span>
                  <button
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold text-xs"
                  >
                    <span>View Parchment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedRecipes.length > 0 && (
          <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-xs text-red-400/80 hover:text-red-300 underline"
            >
              Clear All Saved Blends
            </button>
            <span className="text-xs text-stone-500 font-mono">Stored in browser cache</span>
          </div>
        )}
      </div>
    </div>
  );
};
