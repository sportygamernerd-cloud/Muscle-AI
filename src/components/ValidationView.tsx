import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ValidationViewProps {
  onComplete: () => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fullscreen-center" style={{ background: 'var(--accent-primary)', color: 'black' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        style={{ 
          width: '120px', 
          height: '120px', 
          background: 'black', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <Check size={64} className="text-accent" strokeWidth={4} />
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}
      >
        Repas<br/>Enregistré
      </motion.h2>
      
      <p style={{ marginTop: '1rem', fontWeight: 600 }}>Le muscle se construit maintenant.</p>
    </div>
  );
};
