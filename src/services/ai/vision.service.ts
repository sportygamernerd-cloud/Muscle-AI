import { type AnalysisPayload } from '../../types/nutrition';

// Mock DB moved to service
const CIQUAL_LITE: Record<string, { density: number; proteinPer100g: number }> = {
  "blanc_poulet_cuit": { density: 1.05, proteinPer100g: 31 },
  "steak_hache_5mg": { density: 0.95, proteinPer100g: 25 },
  "oeuf_dur": { density: 1.03, proteinPer100g: 13 },
  "riz_blanc_cuit": { density: 0.85, proteinPer100g: 2.7 },
  "saumon_cuit": { density: 1.01, proteinPer100g: 22 },
  "whey_shaker": { density: 1.1, proteinPer100g: 80 }
};

export class VisionService {
  private static instance: VisionService;
  
  // Singleton pattern for Token Management & Caching
  static getInstance(): VisionService {
    if (!VisionService.instance) {
      VisionService.instance = new VisionService();
    }
    return VisionService.instance;
  }

  async analyzeImage(_file: File): Promise<AnalysisPayload> {
    // 1. Simulate Latency (Optimized)
    await new Promise(resolve => setTimeout(resolve, 800));

    // 2. Simulate Recognition Logic
    // Random chance of "Unknown Food" to test Error Handling (10%)
    const isUnknown = Math.random() < 0.1;

    if (isUnknown) {
      throw new Error("ALIMENT_NON_IDENTIFIE");
    }

    // 3. Normal Analysis Flow
    const keys = Object.keys(CIQUAL_LITE);
    const detectedKey = keys[Math.floor(Math.random() * keys.length)];
    const dbData = CIQUAL_LITE[detectedKey];

    const volumeCm3 = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
    const poidsGrammes = Math.round(volumeCm3 * dbData.density);
    const proteines = Math.round((poidsGrammes * dbData.proteinPer100g) / 100);
    const errorMargin = Math.floor(Math.random() * (12 - 4 + 1)) + 4; // Optimized margins

    return {
      aliment: this.formatLabel(detectedKey),
      confiance_score: 0.92 + (Math.random() * 0.07),
      volume_estime_cm3: volumeCm3,
      poids_estime: poidsGrammes,
      proteines_calculees: proteines,
      marge_erreur: errorMargin,
      details_analyse: {
        reference_detectee: "Assiette Standard (26cm)",
        methode_calcul: "Deep-Volatric v2"
      }
    };
  }

  private formatLabel(key: string): string {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
