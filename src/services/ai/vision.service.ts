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

      // UPDATED PROMPT: More robust estimation
      const prompt = `
        Rôle : Tu es un Coach Nutritionniste expert en Bodybuilding.
        Tâche : Analyser cette photo de repas pour un pratiquant de musculation.
        
        Si l'image est floue ou l'aliment difficile à reconnaître : FAIS TA MEILLEURE ESTIMATION PROBABLE. Ne réponds jamais que tu ne sais pas. Si ça ressemble à du poulet, dis "Poulet".
        
        Instructions :
        1. Identifie l'aliment principal (sois concis).
        2. Estime le poids visible (sois généreux sur l'estimation pour la prise de masse).
        3. Calcule les PROTÉINES totales.
        4. Donne un conseil motivationnel court ("Bonne source", "Post-training validé", etc).
        
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
      
      const data = JSON.parse(text);

      console.log(`Gemini Analysis took ${Date.now() - start}ms`, data);
      return data;

    } catch (e) {
      console.error("Gemini Vision Error", e);
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
