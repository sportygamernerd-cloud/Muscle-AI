export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface AnalysisPayload {
  aliment: string;
  confiance_score: number;
  volume_estime_cm3: number;
  poids_estime: number;
  proteines_calculees: number;
  marge_erreur: number;
  details_analyse: {
    reference_detectee: string;
    methode_calcul: string;
  };
}

export interface FoodLogEntry {
  id: string;
  userIdHash: string;
  timestamp: number;
  foodName: string;
  protein: number;
  weight: number;
  method: 'AI_SCAN' | 'MANUAL_SEARCH' | 'QUICK_LOG'; // Added QUICK_LOG
}
