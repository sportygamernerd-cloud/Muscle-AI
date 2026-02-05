import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GamificationService, UserStats } from '../services/game/gamification.service';
import { HistoryService } from '../services/storage/history.service';

interface AvatarProps {
  triggerTheGlow: boolean; // Prop to trigger "Protein Glow"
}

export const AvatarEvolution: React.FC<AvatarProps> = ({ triggerTheGlow }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // Calc stats on mount/update (Hydrate from History Service which acts as DB proxy)
    const logs = HistoryService.getLogs();
    const totalProt = logs.reduce((acc, curr) => acc + curr.protein, 0);
    // Mock streak for now, ideally passed down
    const s = GamificationService.calculateStats(totalProt, 12); 
    setStats(s);
  }, [triggerTheGlow]); // Re-calc when action happens

  if (!stats) return null;

  const progressPercent = Math.min(100, (stats.muscleScore / stats.nextLevelScore) * 100);

  return (
    <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
       
       {/* Level Title */}
       <motion.div 
         key={stats.levelTitle}
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         style={{ 
           fontSize: '0.9rem', 
           fontWeight: 800, 
           color: 'var(--accent-primary)', 
           letterSpacing: '2px',
           marginBottom: '1rem',
           textShadow: '0 0 10px rgba(212, 255, 0, 0.3)'
         }}
       >
          LVL {stats.level} // {stats.levelTitle}
       </motion.div>

       {/* Avatar Container with Glow Logic */}
       <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
          
          {/* Neon Glow Aura */}
          {triggerTheGlow && (
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: [0.5, 1, 0.5], scale: 1.1 }}
               transition={{ duration: 2, repeat: Infinity }}
               style={{ 
                 position: 'absolute', 
                 inset: 0, 
                 borderRadius: '50%', 
                 background: 'radial-gradient(circle, rgba(212,255,0,0.4) 0%, transparent 70%)',
                 zIndex: 0
               }}
            />
          )}

          <motion.img 
            key={stats.level}
            src={GamificationService.getAvatarUrl(stats.level)}
            alt="Avatar"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            // Pulse Effect on XP Gain
            whileTap={{ scale: 1.1 }} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              position: 'relative', 
              zIndex: 10,
              filter: stats.level === 5 ? 'drop-shadow(0 0 15px var(--accent-primary))' : 'none'
            }}
          />
       </div>

       {/* XP Bar */}
       <div style={{ 
          marginTop: '1.5rem', 
          background: '#222', 
          height: '12px', 
          borderRadius: '6px', 
          overflow: 'hidden',
          position: 'relative'
       }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
            style={{ 
              height: '100%', 
              background: 'var(--accent-primary)',
              borderRadius: '6px',
            }}
          />
       </div>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          <span>{stats.muscleScore} PTS</span>
          <span>NEXT: {stats.nextLevelScore === Infinity ? 'MAX' : stats.nextLevelScore}</span>
       </div>

    </div>
  );
};
