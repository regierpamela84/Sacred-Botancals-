import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health and status endpoint
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'ok',
      hasApiKey: hasKey,
      engine: hasKey ? 'Gemini 3.8 Flash + Esoteric Formulation Engine' : 'Esoteric Formulation Engine (Client & Server Fallback)',
    });
  });

  // AI-Powered Master Ritual Oil Blend Generator
  app.post('/api/generate-blend', async (req, res) => {
    try {
      const {
        clientName = 'The Seeker',
        sunSign = 'Leo',
        moonSign = '',
        risingSign = '',
        birthDate = '',
        lifePathNumber = 1,
        primaryIntent = 'Sovereign Vitality and Spiritual Grounding',
        carrierPreference = 'Golden Jojoba (Calendula & Amber Infused)',
        bottleSize = '1 oz (30 ml)',
        dilutionPreference = 'Standard Ritual (2% / 15 drops)',
        scentFamilyPreference = 'Resinous & Sacred Woods',
        skinSensitivityNotes = '',
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      const isKeyValid = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5;

      if (!isKeyValid) {
        return res.status(200).json({
          useFallback: true,
          message: 'Using offline master esoteric formulation engine (API key not configured).',
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
You are a master aromatherapist, astrologer, and numerologist custom-built for a ultra-luxury wellness apothecary.
Generate a precise, ritual-grade oil recipe based on the following client consultation inputs:

CLIENT INPUTS:
- Client Name: ${clientName}
- Astrological Chart: Sun in ${sunSign}${moonSign ? `, Moon in ${moonSign}` : ''}${risingSign ? `, Rising in ${risingSign}` : ''}
- Numerology: Life Path Number ${lifePathNumber}${birthDate ? ` (Birth Date: ${birthDate})` : ''}
- Metaphysical Intent: ${primaryIntent}
- Carrier Oil Base Preference: ${carrierPreference}
- Bottle Size: ${bottleSize}
- Dilution Preference: ${dilutionPreference}
- Preferred Scent Family: ${scentFamilyPreference}
- Skin Sensitivities / Cautions: ${skinSensitivityNotes || 'None reported'}

CRITICAL CORE BLENDING RULES (NEVER VIOLATE):
1. Every recipe must include a base of infused carrier oils (e.g., Jojoba, Sweet Almond, Rosehip, or Calendula-infused Jojoba) with exact fluid measurements (e.g. 28-30 ml for 1 oz, or 56-60 ml for 2 oz).
2. Adhere strictly to safe dilution guidelines:
   - For 1 oz (30 ml) bottle: MAXIMUM 10-20 drops of total essential oil.
     * If Gentle (1%): exactly 10 drops.
     * If Standard Ritual (2%): exactly 15 drops.
     * If Potent Anointing (2.5%): exactly 20 drops.
   - For 2 oz (60 ml) bottle: exactly double the drop count (20, 30, or 40 drops total).
3. Strictly use the 30/50/20 aromatic blending rule for perfect olfactory balance:
   - Exactly 30% Top notes (e.g., in 15 drops = 4 or 5 drops Top)
   - Exactly 50% Middle notes (e.g., in 15 drops = 7 or 8 drops Middle)
   - Exactly 20% Base notes (e.g., in 15 drops = 3 drops Base)
   THE SUM OF ALL ESSENTIAL OIL DROPS MUST EXACTLY EQUAL THE TOTAL DROPS SPECIFIED.
4. Ground every ingredient choice in astrological correspondences (e.g., Rosemary for Aries/Mars, Frankincense for Leo/Sun, Sandalwood for Venus/Moon, Lavender for Mercury/Virgo) and numerological vibrations (e.g., Number 1 = Sun, Number 2 = Moon, Number 3 = Jupiter, Number 5 = Mercury, etc.).
5. Produce the required 5-part output format:
   - Name of the Ritual Blend
   - Metaphysical Intent (Astrology/Numerology alignment)
   - The Recipe: Exact carrier oil measurements and drop counts for essential oils (broken down by Top, Middle, Base note)
   - Ritual/Application Instructions: How the user should charge or apply the blend
   - Safety Disclaimer: Mandate a skin patch test and include specific ingredient warnings (phototoxicity, skin irritation, pregnancy precautions)

Return the response in strictly valid JSON adhering to this schema.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an esteemed master aromatherapist, esoteric botanist, astrologer, and numerologist. You create immaculate, mathematically sound, safe ritual oil recipes. Return only valid JSON with no markdown backticks outside of JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Name of the Ritual Blend' },
              subtitle: { type: Type.STRING, description: 'Poetic subtitle or dedication' },
              metaphysicalIntent: {
                type: Type.OBJECT,
                properties: {
                  astrologyAlignment: { type: Type.STRING },
                  numerologyAlignment: { type: Type.STRING },
                  elementalDominance: { type: Type.STRING },
                  planetaryRuler: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ['astrologyAlignment', 'numerologyAlignment', 'summary'],
              },
              bottleSize: { type: Type.STRING },
              dilutionRate: { type: Type.STRING },
              carrierBase: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    botanicalInfusion: { type: Type.STRING },
                    properties: { type: Type.STRING },
                  },
                  required: ['name', 'amount', 'properties'],
                },
              },
              essentialOils: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    botanicalName: { type: Type.STRING },
                    note: { type: Type.STRING, enum: ['Top', 'Middle', 'Base'] },
                    drops: { type: Type.INTEGER },
                    planetaryCorrespondence: { type: Type.STRING },
                    astrologicalSign: { type: Type.STRING },
                    numerologyVibration: { type: Type.STRING },
                    aromaticProfile: { type: Type.STRING },
                    therapeuticIntent: { type: Type.STRING },
                    safetyCaution: { type: Type.STRING },
                  },
                  required: [
                    'name',
                    'note',
                    'drops',
                    'planetaryCorrespondence',
                    'astrologicalSign',
                    'numerologyVibration',
                    'aromaticProfile',
                    'therapeuticIntent',
                  ],
                },
              },
              noteDistribution: {
                type: Type.OBJECT,
                properties: {
                  topPercent: { type: Type.NUMBER },
                  topDrops: { type: Type.INTEGER },
                  middlePercent: { type: Type.NUMBER },
                  middleDrops: { type: Type.INTEGER },
                  basePercent: { type: Type.NUMBER },
                  baseDrops: { type: Type.INTEGER },
                  totalDrops: { type: Type.INTEGER },
                  targetRatio: { type: Type.STRING },
                },
                required: ['topDrops', 'middleDrops', 'baseDrops', 'totalDrops'],
              },
              ritualInstructions: {
                type: Type.OBJECT,
                properties: {
                  consecrationTiming: { type: Type.STRING },
                  chargingMethod: { type: Type.STRING },
                  applicationPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  incantationOrIntention: { type: Type.STRING },
                },
                required: ['consecrationTiming', 'chargingMethod', 'applicationPoints', 'incantationOrIntention'],
              },
              safetyDisclaimer: {
                type: Type.OBJECT,
                properties: {
                  skinPatchTestMandate: { type: Type.STRING },
                  specificWarnings: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  phototoxicityFlag: { type: Type.BOOLEAN },
                  pregnancyWarning: { type: Type.BOOLEAN },
                },
                required: ['skinPatchTestMandate', 'specificWarnings'],
              },
            },
            required: [
              'name',
              'metaphysicalIntent',
              'carrierBase',
              'essentialOils',
              'noteDistribution',
              'ritualInstructions',
              'safetyDisclaimer',
            ],
          },
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      parsed.id = `ritual-${Date.now()}`;
      parsed.timestamp = Date.now();
      parsed.clientName = clientName;

      return res.status(200).json({ success: true, recipe: parsed });
    } catch (err: any) {
      console.error('Gemini generation error, providing fallback:', err?.message);
      return res.status(200).json({
        useFallback: true,
        error: err?.message || 'Server generation error',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Master Ritual Oil Formulary Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
