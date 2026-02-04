import { GoogleGenerativeAI } from '@google/generative-ai';
import { type AnalysisPayload } from '../../types/nutrition';

export class VisionService {
  private static instance: VisionService;
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key Missing");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "");
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } // Force JSON mode
    });
  }
  
  static getInstance(): VisionService {
    if (!VisionService.instance) {
      VisionService.instance = new VisionService();
    }
    return VisionService.instance;
  }

  async analyzeImage(file: File): Promise<AnalysisPayload> {
    const start = Date.now();
    
    try {
      const base64Data = await this.fileToGenerativePart(file);

      // UPDATED PROMPT SYSTEM
      const prompt = `
        Rôle : Tu es un expert en nutrition sportive spécialiste.
        Objectif : Analyser l'image d'un repas, estimer les quantités et fournir un bilan nutritionnel précis.
        
        Instructions strictes :
        1. Identifie l'aliment principal.
        2. Estime le poids total.
        3. Calcule UNIQUEMENT les Protéines pour l'affichage principal, et donne un conseil.
        
        Réponds exclusivement avec ce schéma JSON exact :
        {
          "aliment": "Nom de l'aliment principal",
          "confiance_score": 0.9,
          "poids_estime": 150,
          "volume_estime_cm3": 0,
          "proteines_calculees": 30,
          "marge_erreur": 5,
          "details_analyse": {
             "reference_detectee": "Conseil court (ex: Excellent post-legday)",
             "methode_calcul": "Gemini Expert"
          }
        }
      `;

      const result = await this.model.generateContent([prompt, base64Data]);
      const response = await result.response;
      const text = response.text();
      
      const data = JSON.parse(text);

      console.log(`Gemini Analysis took ${Date.now() - start}ms`);
      return data;

    } catch (e) {
      console.error("Gemini Vision Error", e);
      // Fallback simulates error or returns manual prompt
      throw new Error("VISION_FAILED");
    }
  }

  private async fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
