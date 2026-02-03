import React from 'react';
import { Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem 0',
      marginBottom: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Dumbbell color="var(--accent-primary)" size={32} />
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          letterSpacing: '-1px',
          textTransform: 'uppercase'
        }}>
          Muscle<span className="text-accent">AI</span>
        </h1>
      </motion.div>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-primary)' }} />
      </div>
    </header>
  );
};
