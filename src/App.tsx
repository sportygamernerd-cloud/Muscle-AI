import { useState } from 'react';
import { QuickLog } from './components/QuickLog';
import { HistoryView } from './components/HistoryView';
import { AnimatePresence, motion } from 'framer-motion';
import { History } from 'lucide-react';

function App() {
  const [view, setView] = useState<'quicklog' | 'history'>('quicklog');
  const [streak, setStreak] = useState(12);

  const updateStats = () => {
    // Refresh stats logic here (future: re-read history)
    setStreak(s => s); 
  };

  return (
    <>
      <div style={{ background: 'var(--bg-app)', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
        
        {/* Top Right History Button (Permanent) */}
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 50 }}>
            <motion.button
             whileTap={{ scale: 0.9 }}
             onClick={() => setView(view === 'history' ? 'quicklog' : 'history')}
             style={{ 
               background: 'rgba(255,255,255,0.05)', 
               padding: '12px', 
               borderRadius: '50%', 
               color: view === 'history' ? 'var(--accent-primary)' : 'white', 
               border: '1px solid rgba(255,255,255,0.1)',
               backdropFilter: 'blur(10px)'
             }}
           >
              <History size={20} />
           </motion.button>
        </div>

        <AnimatePresence mode="wait">
          
          {view === 'quicklog' && (
            <motion.div 
              key="quicklog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', height: '100%' }}
            >
              <QuickLog onLog={updateStats} streak={streak} />
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
    </>
  );
}

export default App;
