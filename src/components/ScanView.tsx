import React, { useRef } from 'react';
import { Camera, Flame, Zap, History } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScanViewProps {
  onScan: (file: File) => void;
  streak: number;
  onHistory?: () => void;
}

export const ScanView: React.FC<ScanViewProps> = ({ onScan, streak, onHistory }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      try { if (navigator.vibrate) navigator.vibrate(50); } catch (_) {}
      onScan(e.target.files[0]);
    }
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <div className="fullscreen-center" style={{ position: 'relative' }}>
      
      {/* Top Bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
         {/* Streak Badge */}
         <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="streak-badge"
            style={{ position: 'static' }} // Override absolute
          >
            <Flame size={16} className="text-accent" fill="currentColor" />
            <span>{streak} Jours</span>
         </motion.div>

         {/* History Button */}
         {onHistory && (
           <motion.button
             whileTap={{ scale: 0.9 }}
             onClick={onHistory}
             style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
           >
              <History size={20} />
           </motion.button>
         )}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <Zap size={18} className="text-accent" fill="currentColor" />
          <span style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '0.75rem' }}>MUSCLE.AI</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>ANABOLISME<br /><span className="text-accent">INSTANTANÉ</span></h1>
      </motion.div>

      <div style={{ position: 'relative' }}>
        <div style={{ 
            position: 'absolute', 
            inset: '-20px', 
            borderRadius: '50%', 
            border: '1px dashed var(--accent-primary)', 
            opacity: 0.2,
            pointerEvents: 'none'
        }} className="animate-spin-slow" />
        
        <motion.button 
          className="btn-main-action"
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          style={{ position: 'relative', zIndex: 10 }}
        >
          <Camera size={56} color="white" strokeWidth={1.5} />
          <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>SCANNER</span>
        </motion.button>
      </div>
      
      <input 
        type="file" 
        accept="image/*"
        capture="environment"
        ref={inputRef} 
        style={{ display: 'none' }} 
        onChange={handleFile}
        onClick={(e) => (e.target as HTMLInputElement).value = ''}
      />

      <p style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Taper pour capturer. Glisser pour valider.
      </p>
    </div>
  );
};
