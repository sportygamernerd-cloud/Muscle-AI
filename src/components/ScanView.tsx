import React, { useRef } from 'react';
import { Camera, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScanViewProps {
  onScan: (file: File) => void;
  streak: number;
}

export const ScanView: React.FC<ScanViewProps> = ({ onScan, streak }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0].name);
      // Safe Haptics
      try { if (navigator.vibrate) navigator.vibrate(50); } catch (_) {}
      onScan(e.target.files[0]);
    }
  };

  const handleClick = () => {
     console.log("Button clicked, triggering input");
     inputRef.current?.click();
  };

  return (
    <div className="fullscreen-center" style={{ position: 'relative' }}>
      
      {/* Streak Badge */}
      <motion.div 
        className="streak-badge"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Flame size={16} className="text-accent" fill="currentColor" />
        <span>{streak} Jours</span>
      </motion.div>

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
        {/* Decorative Ring - Fixed Pointer Events */}
        <div style={{ 
            position: 'absolute', 
            inset: '-20px', 
            borderRadius: '50%', 
            border: '1px dashed var(--accent-primary)', 
            opacity: 0.2,
            pointerEvents: 'none' // CRITICAL FIX
        }} className="animate-spin-slow" />
        
        <motion.button 
          className="btn-main-action"
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          style={{ position: 'relative', zIndex: 10 }} // Ensure clickable
        >
          <Camera size={56} color="white" strokeWidth={1.5} />
          <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>SCANNER</span>
        </motion.button>
      </div>
      
      <input 
        type="file" 
        accept="image/*"
        capture="environment" // Mobile Camera Fix
        ref={inputRef} 
        style={{ display: 'none' }} 
        onChange={handleFile}
        onClick={(e) => (e.target as HTMLInputElement).value = ''} // Logic to allow re-scanning same file
      />

      <p style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Taper pour capturer. Glisser pour valider.
      </p>
    </div>
  );
};
