import { useState } from 'react';
import { QuickLog } from './components/QuickLog';
import { HistoryView } from './components/HistoryView';
import { AvatarEvolution } from './components/AvatarEvolution';
import { AnimatePresence, motion } from 'framer-motion';
import { History, Dumbbell } from 'lucide-react';

function App() {
  const [view, setView] = useState<'quicklog' | 'history'>('quicklog');
  const [glowState, setGlowState] = useState(false);

  const handleLogAction = () => {
    // Trigger "Protein Glow" effect
    setGlowState(true);
    // Reset glow after animation (simulate 1h fade in real app, here 2s feedback)
    setTimeout(() => setGlowState(false), 2000);
  };

  return (
    <>
      <div style={{ background: 'var(--bg-app)', minHeight: '100vh', width: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Persistent Floating Header (HUD) */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
            {/* Logo/Home */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Dumbbell size={24} className="text-accent" />
               <span style={{ fontWeight: 900, letterSpacing: '-1px' }}>MUSCLE.AI</span>
            </div>

            {/* History Toggle */}
            <motion.button
             whileTap={{ scale: 0.9 }}
             onClick={() => setView(view === 'history' ? 'quicklog' : 'history')}
             style={{ 
               background: 'rgba(255,255,255,0.05)', 
               padding: '10px', 
               borderRadius: '50%', 
               color: view === 'history' ? 'var(--accent-primary)' : 'white', 
               border: '1px solid rgba(255,255,255,0.1)',
             }}
           >
              <History size={20} />
           </motion.button>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <AnimatePresence mode="wait">
            
            {view === 'quicklog' && (
              <motion.div 
                key="quicklog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {/* 1. Avatar Section (Top) */}
                <div style={{ padding: '0 1.5rem' }}>
                   <AvatarEvolution triggerTheGlow={glowState} />
                </div>

                {/* 2. Quick Log System (Bottom) */}
                <div style={{ flex: 1, marginTop: '1rem' }}>
                   <QuickLog onLog={handleLogAction} streak={0} /> {/* Streak managed inside QuickLog now */}
                </div>
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                style={{ width: '100%', height: '100%' }}
              >
                <HistoryView onBack={() => setView('quicklog')} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;
