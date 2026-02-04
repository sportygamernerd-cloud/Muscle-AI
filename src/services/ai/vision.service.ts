import { GoogleGenerativeAI } from '@google/generative-ai';
import { type AnalysisPayload } from '../../types/nutrition';

export class VisionService {
  private static instance: VisionService;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Hardcoded Fallback for Production Safety
    if (!this.apiKey || this.apiKey.includes("undefined")) {
       this.apiKey = "AIzaSyAMRjMR_ngcZcSWXaHW1uc78a05xPGRX6g";
    }

    console.log("VisionService Init. Key Loaded:", !!this.apiKey ? "YES" : "NO");

    this.genAI = new GoogleGenerativeAI(this.apiKey || "");
    
    // MODEL UPDATE: Using specific version to avoid 404s on aliases
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-001", 
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
        You are an expert Bodybuilding Nutritionist.
        Analyze this food image.
        
        Guidance:
        1. Identify the main food item.
        2. Estimate the weight (generous estimate for bulk).
        3. Calculate PROTEIN.
        4. Give a short motivation tip.
        
        Strict JSON Response:
        {
          "aliment": "Name",
          "confiance_score": 0.9,
          "poids_estime": 150,
          "volume_estime_cm3": 0,
          "proteines_calculees": 30,
          "marge_erreur": 10,
          "details_analyse": {
             "reference_detectee": "Motivation Tip",
             "methode_calcul": "Vision AI"
          }
        }
      `;

      const result = await this.model.generateContent([prompt, base64Data]);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);

      console.log(`Msg: Success. Took ${Date.now() - start}ms`, data);
      return data;

    } catch (e: any) {
      console.error("Gemini Vision Error Details:", e);
      throw new Error("VISION_FAILED: " + (e.message || "Unknown error"));
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
