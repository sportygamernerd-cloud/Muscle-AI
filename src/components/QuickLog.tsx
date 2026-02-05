import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drumstick, Egg, Milk, Wheat, Zap, Utensils } from 'lucide-react';
import { HistoryService } from '../services/storage/history.service';

interface QuickLogProps {
  onLog: () => void;
  streak: number; 
}

const PRESETS = [
  { id: 'poulet', name: 'Poulet', protein: 30, icon: Drumstick, color: '#D4FF00', portion: '150g' },
  { id: 'oeufs', name: 'Oeufs', protein: 18, icon: Egg, color: '#FFD700', portion: '3 pcs' },
  { id: 'fromage', name: 'F. Blanc', protein: 20, icon: Milk, color: '#FFFFFF', portion: '250g' },
  { id: 'pates', name: 'Pâtes', protein: 12, icon: Wheat, color: '#FFA500', portion: '200g' },
  { id: 'shake', name: 'Whey', protein: 25, icon: Zap, color: '#00FFFF', portion: '1 scoop' },
  { id: 'snack', name: 'Barre', protein: 20, icon: Utensils, color: '#FF00FF', portion: '1 barre' },
];

export const QuickLog: React.FC<QuickLogProps> = ({ onLog }) => {
  const [lastXp, setLastXp] = useState<{ id: number, val: number } | null>(null);

  const handleClick = (preset: typeof PRESETS[0]) => {
    HistoryService.logEntry({
      foodName: preset.name,
      protein: preset.protein,
      weight: 0, 
      method: "QUICK_LOG" 
    });

    setLastXp({ id: Date.now(), val: preset.protein });
    onLog();
    
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="container" style={{ padding: '0 1.5rem 2rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
       
       <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-muted)' }}>MANGER POUR ÉVOLUER</h2>

       {/* Grid */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flex: 1, alignContent: 'start' }}>
          {PRESETS.map((preset) => (
             <motion.button
               key={preset.id}
               whileTap={{ scale: 0.9 }}
               onClick={() => handleClick(preset)}
               style={{ 
                 background: 'var(--bg-card)', 
                 borderRadius: '16px', 
                 padding: '1rem 0.5rem', 
                 border: '1px solid #222',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px',
                 aspectRatio: '0.8'
               }}
               whileHover={{ borderColor: preset.color, background: 'var(--bg-card-hover)', y: -2 }}
             >
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '50%' }}>
                  <preset.icon size={24} color={preset.color} />
                </div>
                <div style={{ textAlign: 'center' }}>
                   <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{preset.name}</div>
                   <div style={{ fontSize: '0.7rem', color: preset.color, fontWeight: 800 }}>+{preset.protein} XP</div>
                </div>
             </motion.button>
          ))}
       </div>

        {/* Floating XP Text */}
        <AnimatePresence>
          {lastXp && (
             <motion.div
               key={lastXp.id}
               initial={{ opacity: 0, y: 50, scale: 0.5, x: '-50%' }}
               animate={{ opacity: [0, 1, 0], y: -200, scale: 1.2 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               style={{ 
                 position: 'fixed', 
                 top: '60%', 
                 left: '50%', 
                 pointerEvents: 'none',
                 color: 'var(--accent-primary)',
                 fontWeight: 900,
                 fontSize: '4rem',
                 textShadow: '0 0 30px rgba(212, 255, 0, 0.8)',
                 zIndex: 100,
                 whiteSpace: 'nowrap'
               }}
             >
               +{lastXp.val} XP
             </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
};
