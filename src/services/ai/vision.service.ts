import { GoogleGenerativeAI } from '@google/generative-ai';
import { type AnalysisPayload } from '../../types/nutrition';

export class VisionService {
  private static instance: VisionService;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string | undefined;

  constructor() {
    // DEBUG: Check all possible env var locations
    // Vite exposes env vars on import.meta.env
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    console.log("VisionService Init. API Key present:", !!this.apiKey, 
                "Key Length:", this.apiKey?.length, 
                "Key Start:", this.apiKey?.substring(0, 4) + "****");

    if (!this.apiKey) {
      console.error("CRITICAL: API Key is undefined in constructor. Check Vercel Env Vars format.");
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey || "dummy_key");
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
  }
  
  static getInstance(): VisionService {
    if (!VisionService.instance) {
      VisionService.instance = new VisionService();
    }
    return VisionService.instance;
  }

  async analyzeImage(file: File): Promise<AnalysisPayload> {
    // Runtime check
    if (!this.apiKey) {
      // Try late binding just in case
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!this.apiKey) {
            console.error("API Key Missing at Runtime Call");
            throw new Error("API_KEY_MISSING");
        }
    }

    const start = Date.now();
    
    try {
      const base64Data = await this.fileToGenerativePart(file);

      const prompt = `
        Rôle : Tu es un Coach Nutritionniste expert en Bodybuilding.
        Tâche : Analyser cette photo de repas pour un pratiquant de musculation.
        
        Si l'image est floue ou l'aliment difficile à reconnaître : FAIS TA MEILLEURE ESTIMATION PROBABLE. Ne réponds jamais que tu ne sais pas. Si ça ressemble à du poulet, dis "Poulet".
        
        Instructions :
        1. Identifie l'aliment principal (sois concis).
        2. Estime le poids visible (sois généreux sur l'estimation pour la prise de masse).
        3. Calcule les PROTÉINES totales.
        4. Donne un conseil motivationnel court ("Bonne source", "Post-training validé", etc).
        5. Assure-toi que le JSON est valide.
        
        Format JSON ATTENDU (Strict) :
        {
          "aliment": "Nom de l'aliment",
          "confiance_score": 0.9,
          "poids_estime": 150,
          "volume_estime_cm3": 0,
          "proteines_calculees": 30,
          "marge_erreur": 10,
          "details_analyse": {
             "reference_detectee": "Conseil motivationnel",
             "methode_calcul": "Vision AI"
          }
        }
      `;

      const result = await this.model.generateContent([prompt, base64Data]);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json|```/g, '').trim();
      
      let data;
      try {
        data = JSON.parse(cleanJson);
      } catch (e) {
        console.error("JSON Parse Error", cleanJson);
        throw new Error("INVALID_JSON_RESPONSE");
      }

      console.log(`Gemini Analysis took ${Date.now() - start}ms`, data);
      return data;

    } catch (e: any) {
      console.error("Gemini Vision Error Details:", e);
      throw new Error("VISION_FAILED: " + (e.message || "Unknown Error"));
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
