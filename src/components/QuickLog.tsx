import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drumstick, Egg, Milk, Wheat, Zap, Utensils } from 'lucide-react';
import { HistoryService } from '../services/storage/history.service';

interface QuickLogProps {
  onLog: (protein: number) => void;
  streak: number;
}

const PRESETS = [
  { id: 'poulet', name: 'Poulet/Viande', protein: 30, icon: Drumstick, color: '#D4FF00', portion: '150g' },
  { id: 'oeufs', name: '3 Oeufs', protein: 18, icon: Egg, color: '#FFD700', portion: '3 pcs' },
  { id: 'fromage', name: 'Fromage Blanc', protein: 20, icon: Milk, color: '#FFFFFF', portion: '250g' },
  { id: 'pates', name: 'Pâtes', protein: 12, icon: Wheat, color: '#FFA500', portion: '200g' },
  { id: 'shake', name: 'Whey Shake', protein: 25, icon: Zap, color: '#00FFFF', portion: '1 scoop' },
  { id: 'snack', name: 'Barre Prot.', protein: 20, icon: Utensils, color: '#FF00FF', portion: '1 barre' },
];

export const QuickLog: React.FC<QuickLogProps> = ({ onLog, streak }) => {
  const [lastXp, setLastXp] = useState<{ id: number, val: number } | null>(null);

  const handleClick = (preset: typeof PRESETS[0]) => {
    // 1. Log to Persistence
    HistoryService.logEntry({
      foodName: preset.name,
      protein: preset.protein,
      weight: 0, // Not tracking exact weight for quick logs
      method: "QUICK_LOG" 
    });

    // 2. Trigger "XP Gain" Animation
    setLastXp({ id: Date.now(), val: preset.protein });

    // 3. Callback to update global state
    onLog(preset.protein);
    
    // 4. Haptic
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
       
       {/* Header */}
       <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>QUICK LOG</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px' }}>
             <Zap size={16} className="text-accent" fill="currentColor" />
             <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Série : {streak} Jours</span>
          </div>
       </div>

       {/* Grid */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', flex: 1, alignContent: 'center' }}>
          {PRESETS.map((preset) => (
             <motion.button
               key={preset.id}
               whileTap={{ scale: 0.95 }}
               onClick={() => handleClick(preset)}
               style={{ 
                 background: 'var(--bg-card)', 
                 borderRadius: '20px', 
                 padding: '1.5rem', 
                 border: '1px solid transparent',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 position: 'relative',
                 aspectRatio: '1',
               }}
               whileHover={{ borderColor: preset.color, background: 'var(--bg-card-hover)' }}
             >
                <preset.icon size={32} color={preset.color} />
                <div style={{ textAlign: 'center' }}>
                   <div style={{ fontWeight: 700, fontSize: '1rem' }}>{preset.name}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>+{preset.protein}g Prot.</div>
                </div>
             </motion.button>
          ))}
       </div>

        {/* Floating XP Text */}
        <AnimatePresence>
          {lastXp && (
             <motion.div
               key={lastXp.id}
               initial={{ opacity: 1, y: 0, scale: 0.5 }}
               animate={{ opacity: 0, y: -100, scale: 1.5 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.8 }}
               style={{ 
                 position: 'fixed', 
                 top: '50%', 
                 left: '50%', 
                 transform: 'translate(-50%, -50%)',
                 pointerEvents: 'none',
                 color: 'var(--accent-primary)',
                 fontWeight: 900,
                 fontSize: '3rem',
                 textShadow: '0 0 20px rgba(212, 255, 0, 0.5)',
                 zIndex: 100
               }}
             >
               +{lastXp.val}g XP
             </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
};
