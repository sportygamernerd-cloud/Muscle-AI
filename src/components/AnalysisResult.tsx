import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Droplet, TrendingUp } from 'lucide-react';

interface AnalysisResultProps {
  imageSrc: string;
  macros: {
    protein: { min: number; max: number };
    carbs: { min: number; max: number };
    fats: { min: number; max: number };
  };
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ imageSrc, macros }) => {
  const avgProtein = Math.round((macros.protein.min + macros.protein.max) / 2);
  const avgCarbs = Math.round((macros.carbs.min + macros.carbs.max) / 2);
  const ratio = (avgProtein / avgCarbs).toFixed(2);
  
  // Logic for feedback based on ratio
  let feedback = "Ratio équilibré pour le maintien.";
  let tone = "neutral";
  if (Number(ratio) > 0.8) {
    feedback = "ANABOLISME MAXIMAL. Ratio Protéines/Glucides optimal pour l'hypertrophie.";
    tone = "good";
  } else if (Number(ratio) < 0.3) {
    feedback = "Attention : Charge glycémique élevée. Risque de stockage adipeux si hors fenêtre métabolique.";
    tone = "warning";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ overflow: 'hidden' }}
    >
      <div style={{ position: 'relative', height: '200px', width: '100%', background: '#000' }}>
        <img 
          src={imageSrc} 
          alt="Scan" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
        />
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: '100px', 
          background: 'linear-gradient(to top, var(--bg-card), transparent)' 
        }} />
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(0,0,0,0.6)',
          color: 'var(--accent-primary)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          border: '1px solid var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div className="animate-pulse-glow" style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%' }} />
          SCAN REUSSI
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem' 
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>MACROS</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Estimation IA</span>
        </div>

        {/* Macros Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          
          {/* Protein */}
          <div className="bg-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '2px solid var(--accent-primary)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Zap size={14} /> PROTÉINES
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{avgProtein}g</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{macros.protein.min}-{macros.protein.max}g</div>
          </div>

          {/* Carbs */}
          <div className="bg-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '2px solid #3b82f6' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Activity size={14} /> GLUCIDES
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{avgCarbs}g</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{macros.carbs.min}-{macros.carbs.max}g</div>
          </div>

          {/* Fats */}
          <div className="bg-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '2px solid #eab308' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Droplet size={14} /> LIPIDES
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {Math.round((macros.fats.min + macros.fats.max) / 2)}g
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{macros.fats.min}-{macros.fats.max}g</div>
          </div>
        </div>

        {/* Ratio & Analysis */}
        <div className="bg-card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            bottom: 0, 
            width: '4px', 
            background: tone === 'good' ? 'var(--accent-primary)' : tone === 'warning' ? '#ef4444' : '#a3a3a3' 
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <TrendingUp size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Ratio P/G: {ratio}
            </span>
          </div>
          
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
            "{feedback}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};
