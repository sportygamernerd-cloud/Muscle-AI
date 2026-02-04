import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { HistoryService } from '../services/storage/history.service';
import { format, subDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryViewProps {
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  const logs = HistoryService.getLogs();
  
  // Calculate Weekly Stats
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const total = logs
        .filter(l => isSameDay(new Date(l.timestamp), date))
        .reduce((sum, curr) => sum + curr.protein, 0);
      days.push({ 
        date, 
        total, 
        label: format(date, 'EEE', { locale: fr }),
        isToday: isSameDay(date, new Date())
      });
    }
    return days;
  }, [logs]);

  const maxVal = Math.max(...weeklyData.map(d => d.total), 160); // Scale based on max or goal

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ padding: '8px', color: 'white' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>HISTORIQUE</h2>
      </div>

      {/* Chart */}
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            <TrendingUp size={16} className="text-accent" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>7 Derniers Jours</span>
         </div>

         <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '8px' }}>
            {weeklyData.map((day, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                 {/* Bar */}
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${(day.total / maxVal) * 100}%` }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   style={{ 
                     width: '100%', 
                     minWidth: '8px',
                     maxWidth: '24px',
                     background: day.isToday ? 'var(--accent-primary)' : '#333',
                     borderRadius: '4px',
                     marginBottom: '8px',
                     position: 'relative',
                     minHeight: '4px'
                   }}
                 />
                 {/* Label */}
                 <span style={{ fontSize: '0.7rem', color: day.isToday ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                   {day.label.replace('.', '')}
                 </span>
              </div>
            ))}
         </div>
      </div>

      {/* Recent Logs List */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>RÉCEMMENT</h3>
      <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '2rem' }}>
         {[...logs].reverse().slice(0, 20).map(log => (
           <div key={log.id} style={{ 
             display: 'flex', justifyContent: 'space-between', alignItems: 'center',
             padding: '1rem', borderBottom: '1px solid var(--border-color)'
           }}>
              <div>
                <div style={{ fontWeight: 600 }}>{log.foodName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {format(new Date(log.timestamp), 'dd MMM HH:mm', { locale: fr })}
                </div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>
                {log.protein}g
              </div>
           </div>
         ))}
         {logs.length === 0 && (
           <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
             Aucun historique. Mangez.
           </div>
         )}
      </div>

    </div>
  );
};
