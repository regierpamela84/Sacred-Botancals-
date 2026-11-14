import {
  ClientConsultationInput,
  RitualBlendRecipe,
  EssentialOilIngredient,
  CarrierOilComponent,
  ZodiacSign,
} from '../types';
import {
  ESSENTIAL_OILS_COMPENDIUM,
  CARRIER_BASES,
  NUMEROLOGY_MEANINGS,
  ZODIAC_CORRESPONDENCES,
  OilProfile,
} from '../data/correspondences';

export function calculateLifePathNumber(birthDateStr: string): number {
  if (!birthDateStr) return 1;
  const digits = birthDateStr.replace(/\D/g, '');
  if (!digits) return 1;

  const sumDigits = (numStr: string): number => {
    return numStr.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  };

  let sum = sumDigits(digits);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sumDigits(sum.toString());
  }
  return sum;
}

export function computeNoteBreakdown(
  bottleSize: '1 oz (30 ml)' | '2 oz (60 ml)',
  dilutionPreference: string
): { totalDrops: number; topDrops: number; middleDrops: number; baseDrops: number } {
  const is2oz = bottleSize.includes('2 oz');

  let baseDropsCount = 15;
  if (dilutionPreference.includes('10 drops') || dilutionPreference.includes('Gentle')) {
    baseDropsCount = 10;
  } else if (dilutionPreference.includes('20 drops') || dilutionPreference.includes('Potent')) {
    baseDropsCount = 20;
  } else {
    baseDropsCount = 15;
  }

  const multiplier = is2oz ? 2 : 1;
  const totalDrops = baseDropsCount * multiplier;

  // 30 / 50 / 20 rule
  // E.g. for 10: 3 / 5 / 2 = 10
  // E.g. for 15: 4 / 8 / 3 = 15 (or 5 / 7 / 3) -> 4.5/7.5/3 -> rounded to 5 / 7 / 3 = 15
  // E.g. for 20: 6 / 10 / 4 = 20
  // E.g. for 30: 9 / 15 / 6 = 30
  // E.g. for 40: 12 / 20 / 8 = 40
  let topDrops: number;
  let middleDrops: number;
  let baseDrops: number;

  if (totalDrops === 10) {
    topDrops = 3;
    middleDrops = 5;
    baseDrops = 2;
  } else if (totalDrops === 15) {
    topDrops = 5;
    middleDrops = 7;
    baseDrops = 3;
  } else if (totalDrops === 20) {
    topDrops = 6;
    middleDrops = 10;
    baseDrops = 4;
  } else if (totalDrops === 30) {
    topDrops = 9;
    middleDrops = 15;
    baseDrops = 6;
  } else if (totalDrops === 40) {
    topDrops = 12;
    middleDrops = 20;
    baseDrops = 8;
  } else {
    baseDrops = Math.round(totalDrops * 0.2);
    topDrops = Math.round(totalDrops * 0.3);
    middleDrops = totalDrops - topDrops - baseDrops;
  }

  return { totalDrops, topDrops, middleDrops, baseDrops };
}

export function generateDeterministicRitualRecipe(input: ClientConsultationInput): RitualBlendRecipe {
  const lifePathNum = input.lifePathNumber || (input.birthDate ? calculateLifePathNumber(input.birthDate) : 1);
  const lifePathInfo = NUMEROLOGY_MEANINGS[lifePathNum] || NUMEROLOGY_MEANINGS[1];
  const sunSignInfo = ZODIAC_CORRESPONDENCES[input.sunSign] || ZODIAC_CORRESPONDENCES.Leo;

  const { totalDrops, topDrops, middleDrops, baseDrops } = computeNoteBreakdown(
    input.bottleSize,
    input.dilutionPreference
  );

  // Pick carrier oil
  const selectedCarrierBase =
    CARRIER_BASES.find((c) => c.name.toLowerCase().includes(input.carrierPreference.toLowerCase())) ||
    (sunSignInfo.element === 'Fire'
      ? CARRIER_BASES[0]
      : sunSignInfo.element === 'Water'
      ? CARRIER_BASES[1]
      : sunSignInfo.element === 'Earth'
      ? CARRIER_BASES[3]
      : CARRIER_BASES[2]);

  const carrierList: CarrierOilComponent[] = [
    {
      name: selectedCarrierBase.name,
      amount:
        input.bottleSize === '2 oz (60 ml)'
          ? '56 ml (approx. 1.9 oz)'
          : selectedCarrierBase.amount,
      botanicalInfusion: selectedCarrierBase.botanicalInfusion,
      properties: selectedCarrierBase.properties,
    },
  ];

  // Helper to score oil relevance
  const scoreOil = (oil: OilProfile): number => {
    let score = 0;
    if (oil.zodiac.includes(input.sunSign)) score += 5;
    if (input.moonSign && oil.zodiac.includes(input.moonSign as ZodiacSign)) score += 3;
    if (input.risingSign && oil.zodiac.includes(input.risingSign as ZodiacSign)) score += 2;
    if (oil.numerology.includes(Number(lifePathNum))) score += 4;
    if (oil.element === sunSignInfo.element) score += 2;
    if (input.primaryIntent && (
      oil.metaphysicalRole.toLowerCase().includes(input.primaryIntent.toLowerCase()) ||
      oil.scentProfile.toLowerCase().includes(input.primaryIntent.toLowerCase())
    )) {
      score += 5;
    }
    return score;
  };

  const topCandidates = ESSENTIAL_OILS_COMPENDIUM.filter((o) => o.note === 'Top').sort((a, b) => scoreOil(b) - scoreOil(a));
  const middleCandidates = ESSENTIAL_OILS_COMPENDIUM.filter((o) => o.note === 'Middle').sort((a, b) => scoreOil(b) - scoreOil(a));
  const baseCandidates = ESSENTIAL_OILS_COMPENDIUM.filter((o) => o.note === 'Base').sort((a, b) => scoreOil(b) - scoreOil(a));

  // Build Essential Oils array adhering strictly to drops breakdown
  const essentialOils: EssentialOilIngredient[] = [];

  // Top notes: 1 or 2 oils that sum to topDrops
  if (topDrops <= 3 || topCandidates.length < 2) {
    const t1 = topCandidates[0];
    essentialOils.push({
      name: t1.name,
      botanicalName: t1.botanicalName,
      note: 'Top',
      drops: topDrops,
      planetaryCorrespondence: t1.planet,
      astrologicalSign: t1.zodiac.join(', '),
      numerologyVibration: t1.numerology.join(' & '),
      aromaticProfile: t1.scentProfile,
      therapeuticIntent: t1.metaphysicalRole,
      safetyCaution: t1.safetyCaution,
    });
  } else {
    const d1 = Math.ceil(topDrops * 0.6);
    const d2 = topDrops - d1;
    const t1 = topCandidates[0];
    const t2 = topCandidates[1];
    essentialOils.push({
      name: t1.name,
      botanicalName: t1.botanicalName,
      note: 'Top',
      drops: d1,
      planetaryCorrespondence: t1.planet,
      astrologicalSign: t1.zodiac.join(', '),
      numerologyVibration: t1.numerology.join(' & '),
      aromaticProfile: t1.scentProfile,
      therapeuticIntent: t1.metaphysicalRole,
      safetyCaution: t1.safetyCaution,
    });
    essentialOils.push({
      name: t2.name,
      botanicalName: t2.botanicalName,
      note: 'Top',
      drops: d2,
      planetaryCorrespondence: t2.planet,
      astrologicalSign: t2.zodiac.join(', '),
      numerologyVibration: t2.numerology.join(' & '),
      aromaticProfile: t2.scentProfile,
      therapeuticIntent: t2.metaphysicalRole,
      safetyCaution: t2.safetyCaution,
    });
  }

  // Middle notes: 1 or 2 oils that sum to middleDrops
  if (middleDrops <= 5 || middleCandidates.length < 2) {
    const m1 = middleCandidates[0];
    essentialOils.push({
      name: m1.name,
      botanicalName: m1.botanicalName,
      note: 'Middle',
      drops: middleDrops,
      planetaryCorrespondence: m1.planet,
      astrologicalSign: m1.zodiac.join(', '),
      numerologyVibration: m1.numerology.join(' & '),
      aromaticProfile: m1.scentProfile,
      therapeuticIntent: m1.metaphysicalRole,
      safetyCaution: m1.safetyCaution,
    });
  } else {
    const d1 = Math.ceil(middleDrops * 0.6);
    const d2 = middleDrops - d1;
    const m1 = middleCandidates[0];
    const m2 = middleCandidates[1];
    essentialOils.push({
      name: m1.name,
      botanicalName: m1.botanicalName,
      note: 'Middle',
      drops: d1,
      planetaryCorrespondence: m1.planet,
      astrologicalSign: m1.zodiac.join(', '),
      numerologyVibration: m1.numerology.join(' & '),
      aromaticProfile: m1.scentProfile,
      therapeuticIntent: m1.metaphysicalRole,
      safetyCaution: m1.safetyCaution,
    });
    essentialOils.push({
      name: m2.name,
      botanicalName: m2.botanicalName,
      note: 'Middle',
      drops: d2,
      planetaryCorrespondence: m2.planet,
      astrologicalSign: m2.zodiac.join(', '),
      numerologyVibration: m2.numerology.join(' & '),
      aromaticProfile: m2.scentProfile,
      therapeuticIntent: m2.metaphysicalRole,
      safetyCaution: m2.safetyCaution,
    });
  }

  // Base notes: 1 or 2 oils that sum to baseDrops
  if (baseDrops <= 3 || baseCandidates.length < 2) {
    const b1 = baseCandidates[0];
    essentialOils.push({
      name: b1.name,
      botanicalName: b1.botanicalName,
      note: 'Base',
      drops: baseDrops,
      planetaryCorrespondence: b1.planet,
      astrologicalSign: b1.zodiac.join(', '),
      numerologyVibration: b1.numerology.join(' & '),
      aromaticProfile: b1.scentProfile,
      therapeuticIntent: b1.metaphysicalRole,
      safetyCaution: b1.safetyCaution,
    });
  } else {
    const d1 = Math.ceil(baseDrops * 0.6);
    const d2 = baseDrops - d1;
    const b1 = baseCandidates[0];
    const b2 = baseCandidates[1];
    essentialOils.push({
      name: b1.name,
      botanicalName: b1.botanicalName,
      note: 'Base',
      drops: d1,
      planetaryCorrespondence: b1.planet,
      astrologicalSign: b1.zodiac.join(', '),
      numerologyVibration: b1.numerology.join(' & '),
      aromaticProfile: b1.scentProfile,
      therapeuticIntent: b1.metaphysicalRole,
      safetyCaution: b1.safetyCaution,
    });
    essentialOils.push({
      name: b2.name,
      botanicalName: b2.botanicalName,
      note: 'Base',
      drops: d2,
      planetaryCorrespondence: b2.planet,
      astrologicalSign: b2.zodiac.join(', '),
      numerologyVibration: b2.numerology.join(' & '),
      aromaticProfile: b2.scentProfile,
      therapeuticIntent: b2.metaphysicalRole,
      safetyCaution: b2.safetyCaution,
    });
  }

  // Safety checks
  const specificWarnings: string[] = [
    'Perform a 24-hour inner forearm patch test with 1 diluted drop before full ritual anointing.',
  ];
  let hasPhototoxic = false;
  let hasPregnancyFlag = false;

  essentialOils.forEach((oil) => {
    if (oil.safetyCaution) {
      specificWarnings.push(`${oil.name}: ${oil.safetyCaution}`);
    }
    if (oil.name.includes('Orange') || oil.name.includes('Grapefruit') || oil.name.includes('Bergamot (traditional)')) {
      hasPhototoxic = true;
    }
    if (oil.name.includes('Clary Sage') || oil.name.includes('Rosemary') || oil.name.includes('Myrrh') || oil.name.includes('Cedarwood')) {
      hasPregnancyFlag = true;
    }
  });

  if (hasPhototoxic) {
    specificWarnings.push('Contains photosensitizing citrus compounds: Avoid direct sun or UV exposure on anointed skin for at least 12-18 hours.');
  }
  if (hasPregnancyFlag) {
    specificWarnings.push('Contains emmenagogue / uterine-stimulating botanical essences: Consult a qualified midwife or healthcare practitioner if pregnant or nursing.');
  }

  const blendTitlesByElement: Record<string, string[]> = {
    Fire: ['Solar Altar Anointing Elixir', 'Ignis Sanctus: Sovereign Will Ritual Oil', 'Aethelgard Golden Flame Consecration'],
    Water: ['Somatic Waters: Lunar Sanctuary Oil', 'Undine Tears: Deep Heart Restoration Blend', 'Oceanic Mystic: Third Eye Anointing Nectar'],
    Air: ['Zephyr Caduceus: Ethereal Clarity Oil', 'Mercurial Breath: Sacred Discernment Essence', 'Aero Sanctum: Visionary Insight Blend'],
    Earth: ['Terra Radix: Ancestral Grounding Oil', 'Karmic Anchor: Sovereign Earth Manifestation', 'Resina Aeterna: Temple Foundation Elixir'],
  };

  const titleOptions = blendTitlesByElement[sunSignInfo.element] || blendTitlesByElement.Fire;
  const blendName = `${titleOptions[Math.floor(Math.random() * titleOptions.length)]} (No. ${lifePathNum})`;

  // Application points based on sun sign affinity
  const appPoints = [
    'Radial pulse points on both wrists (breathe deeply 3 times)',
    sunSignInfo.keyAffinity.split(',')[0].trim() || 'Third Eye center (between the brows)',
    'Crown of the head or nape of the neck',
  ];

  const recipe: RitualBlendRecipe = {
    id: `ritual-${Date.now()}`,
    timestamp: Date.now(),
    name: blendName,
    subtitle: `Bespoke Astro-Aromatic Formulation for ${input.clientName || 'The Seeker'}`,
    clientName: input.clientName,
    metaphysicalIntent: {
      astrologyAlignment: `${input.sunSign} Sun (${sunSignInfo.planet} / ${sunSignInfo.element} Element)${
        input.moonSign ? ` with ${input.moonSign} Moon` : ''
      }${input.risingSign ? ` & ${input.risingSign} Ascendant` : ''}`,
      numerologyAlignment: `Life Path Number ${lifePathNum}: ${lifePathInfo.vibration} (${lifePathInfo.planet}) — ${lifePathInfo.essence}`,
      elementalDominance: `${sunSignInfo.element} Element (${sunSignInfo.polarity})`,
      planetaryRuler: sunSignInfo.planet,
      summary: `Crafted to awaken ${input.primaryIntent || 'sovereign equilibrium and spiritual attunement'}, synthesizing the fiery vigor of ${sunSignInfo.planet} with the sacred vibration of Number ${lifePathNum}.`,
    },
    bottleSize: input.bottleSize,
    dilutionRate: `${input.dilutionPreference} (${totalDrops} drops in ${input.bottleSize.includes('2 oz') ? '60 ml / 2 oz' : '30 ml / 1 oz'} carrier oil)`,
    carrierBase: carrierList,
    essentialOils,
    noteDistribution: {
      topPercent: Math.round((topDrops / totalDrops) * 100),
      topDrops,
      middlePercent: Math.round((middleDrops / totalDrops) * 100),
      middleDrops,
      basePercent: Math.round((baseDrops / totalDrops) * 100),
      baseDrops,
      totalDrops,
      targetRatio: '30/50/20',
    },
    ritualInstructions: {
      consecrationTiming:
        sunSignInfo.element === 'Fire'
          ? 'Consecrate at High Noon or during the planetary hour of the Sun (Sunday) to magnify solar vitality.'
          : sunSignInfo.element === 'Water'
          ? 'Consecrate under the Waxing or Full Moon during the planetary hour of the Moon (Monday) or Venus (Friday).'
          : sunSignInfo.element === 'Air'
          ? 'Consecrate at sunrise during the planetary hour of Mercury (Wednesday) amidst aromatic smoke or clear ventilation.'
          : 'Consecrate at twilight during the planetary hour of Saturn (Saturday) with feet bare upon the earth.',
      chargingMethod:
        'Warm the amber glass bottle between your palms for 3 minutes. Close your eyes and chant the intention 3 times while visualizing a luminous seal locking the botanical frequencies into the lipid matrix. Rest the vessel over a clear quartz or selenite plate for one planetary cycle.',
      applicationPoints: appPoints,
      incantationOrIntention: `“By root of Earth, heart of Water, breath of Air, and spark of Sun: I anoint my temple. As above in the stars of ${input.sunSign}, so below in the sacred number ${lifePathNum}. My path is clear; my spirit is sovereign.”`,
    },
    safetyDisclaimer: {
      skinPatchTestMandate:
        'MANDATORY SKIN PATCH TEST: Apply 1 drop of the diluted ritual blend to your inner forearm. Cover loosely and observe for 24 hours. Do not use if redness, itching, or irritation manifests.',
      specificWarnings,
      phototoxicityFlag: hasPhototoxic,
      pregnancyWarning: hasPregnancyFlag,
    },
  };

  return recipe;
}
