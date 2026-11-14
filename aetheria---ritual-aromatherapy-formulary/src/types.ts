export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type Planet =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

export type NoteType = 'Top' | 'Middle' | 'Base';

export interface EssentialOilIngredient {
  name: string;
  botanicalName?: string;
  note: NoteType;
  drops: number;
  planetaryCorrespondence: string;
  astrologicalSign: string;
  numerologyVibration: number | string;
  aromaticProfile: string;
  therapeuticIntent: string;
  safetyCaution?: string;
}

export interface CarrierOilComponent {
  name: string;
  amount: string; // e.g. "25 ml (approx. 0.85 oz) Cold-Pressed Golden Jojoba"
  botanicalInfusion?: string; // e.g. "Infused with Solar Calendula Blossoms"
  properties: string;
}

export interface NoteDistribution {
  topPercent: number;
  topDrops: number;
  middlePercent: number;
  middleDrops: number;
  basePercent: number;
  baseDrops: number;
  totalDrops: number;
  targetRatio: '30/50/20';
}

export interface RitualBlendRecipe {
  id: string;
  timestamp: number;
  name: string;
  subtitle?: string;
  clientName?: string;
  metaphysicalIntent: {
    astrologyAlignment: string;
    numerologyAlignment: string;
    elementalDominance: string;
    planetaryRuler: string;
    summary: string;
  };
  bottleSize: string; // e.g., "1 oz (30 ml)"
  dilutionRate: string; // e.g., "2% Dilution (15 drops in 30ml)"
  carrierBase: CarrierOilComponent[];
  essentialOils: EssentialOilIngredient[];
  noteDistribution: NoteDistribution;
  ritualInstructions: {
    consecrationTiming: string; // e.g., "Dawn on Sunday or Waxing Moon"
    chargingMethod: string; // Crystals, breath, planetary hour
    applicationPoints: string[]; // e.g., ["Third Eye", "Wrist Pulse Points", "Crown"]
    incantationOrIntention: string;
  };
  safetyDisclaimer: {
    skinPatchTestMandate: string;
    specificWarnings: string[];
    phototoxicityFlag: boolean;
    pregnancyWarning: boolean;
  };
  rawFormattedText?: string;
}

export interface ClientConsultationInput {
  clientName: string;
  sunSign: ZodiacSign;
  moonSign?: ZodiacSign | '';
  risingSign?: ZodiacSign | '';
  birthDate?: string;
  lifePathNumber: number | string;
  primaryIntent: string;
  carrierPreference: string;
  bottleSize: '1 oz (30 ml)' | '2 oz (60 ml)';
  dilutionPreference: 'Gentle (1% / 10 drops)' | 'Standard Ritual (2% / 15 drops)' | 'Potent Anointing (2.5% / 20 drops)';
  scentFamilyPreference: string;
  skinSensitivityNotes: string;
}
