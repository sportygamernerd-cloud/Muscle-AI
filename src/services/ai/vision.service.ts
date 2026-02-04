import { GoogleGenerativeAI } from '@google/generative-ai';
import { type AnalysisPayload } from '../../types/nutrition';

export class VisionService {
  private static instance: VisionService;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string | undefined;

  constructor() {
    // STRATÉGIE "CEINTURE ET BRETELLES"
    // 1. Essai via Vite import.meta.env
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 2. Fallback ultime : La clé fournie par l'utilisateur (Hardcoded pour débloquer la prod)
    if (!this.apiKey || this.apiKey.includes("undefined")) {
       console.warn("Using Hardcoded Fallback Key");
       this.apiKey = "AIzaSyAMRjMR_ngcZcSWXaHW1uc78a05xPGRX6g";
    }

    console.log("VisionService Final Status. Key Loaded:", !!this.apiKey);

    this.genAI = new GoogleGenerativeAI(this.apiKey || "");
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
    const start = Date.now();
    
    try {
      const base64Data = await this.fileToGenerativePart(file);

      const prompt = `
        Rôle : Tu es un Coach Nutritionniste expert en Bodybuilding.
        Instructions :
        1. Identifie l'aliment principal.
        2. Estime le poids (sois généreux).
        3. Calcule les PROTÉINES.
        4. Donne un conseil court.
        
        Format JSON Strict :
        {
          "aliment": "Nom",
          "confiance_score": 0.9,
          "poids_estime": 150,
          "volume_estime_cm3": 0,
          "proteines_calculees": 30,
          "marge_erreur": 10,
          "details_analyse": {
             "reference_detectee": "Conseil",
             "methode_calcul": "Vision AI"
          }
        }
      `;

      const result = await this.model.generateContent([prompt, base64Data]);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);

      console.log(`Gemini Analysis took ${Date.now() - start}ms`, data);
      return data;

    } catch (e: any) {
      console.error("Gemini Vision Error:", e);
      throw new Error("VISION_FAILED: " + (e.message || "Unknown"));
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
