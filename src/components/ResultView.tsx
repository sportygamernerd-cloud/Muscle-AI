import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { type AnalysisResult } from '../engine/AnalysisEngine';

interface ResultViewProps {
  data: AnalysisResult;
  onValidate: () => void;
  onRetake: () => void;
  imageSrc: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ data, onValidate, onRetake, imageSrc }) => {
  // Swipe Logic
  const x = useMotionValue(0);
  const background = useTransform(x, [0, 200], ["var(--bg-card)", "var(--accent-primary)"]);
  const [swiped, setSwiped] = useState(false); // Used implicitly for logic state

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 150) {
      setSwiped(true); // Keep track of swiped state
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]); // Success Haptic
      onValidate();
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 25 });
    }
  };

  return (
    <div className="container" style={{ padding: '0', height: '100vh', display: 'flex', flexDirection: 'column', pointerEvents: swiped ? 'none' : 'auto' }}>
      
      {/* Immersive Image Header (45% height) */}
      <div style={{ flex: '0 0 45%', position: 'relative' }}>
          <img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-app) 5%, transparent 60%)' }} />
          <button onClick={onRetake} style={{ 
            position: 'absolute', top: '1.5rem', left: '1.5rem', 
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            padding: '8px 16px', borderRadius: '20px', color: 'white', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            ← Refaire
          </button>
      </div>

      {/* Metrics Area */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <div>
           {/* Primary Metric: PROTEIN */}
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{data.aliment}</span>
                <span className="text-accent" style={{ fontSize: '0.875rem', fontWeight: 700 }}>±{data.marge_erreur}%</span>
              </div>
              
              <div style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 0.9, color: 'white', letterSpacing: '-2px' }}>
                 {data.proteines_calculees}<span style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginLeft: '4px' }}>g</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px' }}>de Protéines</p>
           </motion.div>

           {/* Secondary Metrics */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>VOLUME</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{data.volume_estime_cm3}<small>cm³</small></span>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>POIDS</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{data.poids_estime}<small>g</small></span>
              </div>
           </div>
        </div>

        {/* Swipe to Confirm */}
        <div style={{ position: 'relative', marginTop: 'auto', marginBottom: '1rem' }}>
           <motion.div 
             className="swipe-track"
             style={{ background }}
           >
              <motion.span 
                 className="swipe-text"
                 style={{ opacity: useTransform(x, [0, 100], [1, 0]) }}
              >
                 SWIPE POUR VALIDER
              </motion.span>
              
              <motion.div 
                 className="swipe-handle"
                 style={{ x }}
                 drag="x"
                 dragConstraints={{ left: 0, right: 280 }} // Constraints relative to parent
                 dragElastic={0.1}
                 onDragEnd={handleDragEnd}
              >
                  <ChevronRight color="black" strokeWidth={3} />
              </motion.div>
           </motion.div>
        </div>

      </div>
    </div>
  );
};
