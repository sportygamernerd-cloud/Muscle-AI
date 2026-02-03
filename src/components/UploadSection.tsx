import React, { useRef } from 'react';
import { Scan, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadSectionProps {
  onAnalyze: (file: File) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyze(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel"
      style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div style={{ 
        border: '2px dashed var(--border-color)', 
        borderRadius: '16px',
        padding: '3rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        transition: 'border-color 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
      >
        <div style={{ 
          background: 'rgba(212, 255, 0, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem'
        }}>
          <Scan size={48} color="var(--accent-primary)" />
        </div>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          SCANNER LE REPAS
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '300px' }}>
          Analyse macro-nutritionnelle de précision chirurgicale.
        </p>
        
        <div className="btn-primary" style={{ marginTop: '1rem' }}>
          <Upload size={18} />
          Uploader une photo
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        background: 'var(--accent-primary)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        opacity: 0.05,
        zIndex: -1
      }} />
    </motion.div>
  );
};
