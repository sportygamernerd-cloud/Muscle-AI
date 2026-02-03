import { type FoodLogEntry } from '../../types/nutrition';

export class HistoryService {
  private static STORAGE_KEY = 'MUSCLE_AI_HISTORY_V1';

  static async logEntry(entry: Omit<FoodLogEntry, 'id' | 'timestamp' | 'userIdHash'>): Promise<boolean> {
    try {
      const logs = this.getLogs();
      
      const newEntry: FoodLogEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        userIdHash: 'ANONYMOUS_USER_HASH' // Placeholder for privacy layer
      };

      logs.push(newEntry);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
      return true;
    } catch (e) {
      console.error("Storage Error", e);
      return false;
    }
  }

  static getLogs(): FoodLogEntry[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  
  static getDailyProtein(): number {
    const today = new Date().setHours(0,0,0,0);
    return this.getLogs()
      .filter(l => l.timestamp >= today)
      .reduce((acc, curr) => acc + curr.protein, 0);
  }
}
