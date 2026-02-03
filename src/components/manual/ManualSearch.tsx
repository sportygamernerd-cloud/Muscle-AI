import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ManualSearchProps {
  onSelect: (food: { name: string, protein: number, weight: number }) => void;
  onCancel: () => void;
}

const MOCK_RESULTS = [
  { name: "Blanc de Poulet", protein: 31 },
  { name: "Oeuf Dur", protein: 13 },
  { name: "Fromage Blanc 0%", protein: 8 },
  { name: "Steak Haché 5%", protein: 25 },
  { name: "Thon en conserve", protein: 28 },
];

export const ManualSearch: React.FC<ManualSearchProps> = ({ onSelect, onCancel }) => {
  const [query, setQuery] = useState('');
  const [weight, setWeight] = useState(100);

  const filtered = MOCK_RESULTS.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (item: typeof MOCK_RESULTS[0]) => {
    const calculatedProtein = Math.round((item.protein * weight) / 100);
    onSelect({
      name: item.name,
      protein: calculatedProtein,
      weight: weight
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
       <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>RECHERCHE <span className="text-accent">MANUELLE</span></h2>
       
       <div style={{ position: 'relative', marginBottom: '2rem' }}>
         <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
         <input 
            autoFocus
            type="text"
            placeholder="Ex: Poulet, Riz..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              padding: '1rem 1rem 1rem 3rem', 
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none'
            }}
         />
       </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 700 }}>POIDS ESTIMÉ (g)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input 
            type="range" 
            min="50" 
            max="500" 
            step="10" 
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
          />
          <span style={{ fontWeight: 800, minWidth: '60px', textAlign: 'right' }}>{weight}g</span>
        </div>
      </div>

       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(item => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleSelect(item)}
              style={{ 
                background: 'var(--bg-card)', 
                padding: '1rem', 
                borderRadius: '12px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                border: '1px solid transparent',
                textAlign: 'left'
              }}
              whileHover={{ borderColor: 'var(--accent-primary)' }}
            >
               <div>
                 <div style={{ fontWeight: 700 }}>{item.name}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{Math.round((item.protein * weight)/100)}g Protéines</div>
               </div>
               <Plus className="text-accent" />
            </motion.button>
          ))}
       </div>

       <button onClick={onCancel} style={{ marginTop: 'auto', marginBottom: '2rem', color: 'var(--text-muted)', fontWeight: 600 }}>Annuler</button>
    </div>
  );
};
