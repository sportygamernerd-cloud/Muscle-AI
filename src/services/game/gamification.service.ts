import { HistoryService } from '../storage/history.service';

export interface UserStats {
  muscleScore: number;
  level: number;
  levelTitle: string;
  nextLevelScore: number;
}

const LEVELS = [
  { max: 150, title: "The Ectomorph", id: 1 },
  { max: 600, title: "The Novice", id: 2 },
  { max: 1500, title: "The Athlete", id: 3 },
  { max: 3500, title: "The Tank", id: 4 },
  { max: Infinity, title: "The Legend", id: 5 }
];

export class GamificationService {
  
  static calculateStats(totalProtein: number, streak: number): UserStats {
    // Score Formula: Total Protein + (Streak * 10 Bonus)
    const score = totalProtein + (streak * 10);
    
    // Find Current Level
    let currentLevel = LEVELS[0];
    for (const lvl of LEVELS) {
      if (score <= lvl.max) {
        currentLevel = lvl;
        break;
      }
      // If higher than all (Legend), keep last
      if (lvl.max === Infinity) currentLevel = lvl;
    }

    return {
      muscleScore: score,
      level: currentLevel.id,
      levelTitle: currentLevel.title.toUpperCase(),
      nextLevelScore: currentLevel.max
    };
  }

  static getAvatarUrl(level: number): string {
    // Using robohash sets as placeholders for "Skinny" to "Beast" progression
    
    const seed = `muscle_avatar_lvl_${level}`;
    
    // Level 1-2: Skinny/Normal (Set 5 - Human)
    if (level <= 2) return `https://robohash.org/${seed}?set=set5&bg=set1`;
    
    // Level 3-4: Beast/Tank (Set 2 - Monsters)
    if (level <= 4) return `https://robohash.org/${seed}?set=set2&bg=set1`;
    
    // Level 5: Legend (Set 1 - Robots/Mecha)
    return `https://robohash.org/${seed}?set=set1&bg=set1`;
  }
}
