import { useState, useEffect } from 'react';
import { ScanView } from './components/ScanView';
import { ResultView } from './components/ResultView';
import { ValidationView } from './components/ValidationView';
import { ManualSearch } from './components/manual/ManualSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { VisionService } from './services/ai/vision.service';
import { HistoryService } from './services/storage/history.service';
import { type AnalysisPayload } from './types/nutrition';
import { AlertCircle } from 'lucide-react';
import { type AnalysisResult } from './engine/AnalysisEngine';

function App() {
  const [step, setStep] = useState<'scan' | 'processing' | 'result' | 'validated' | 'manual' | 'error'>('scan');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisPayload | null>(null);
  const [streak, setStreak] = useState(12);
  // errorMsg removed as strictly unused currently, handled by UI state

  // Hydrate Streak (Mocking persistent streak logic)
  useEffect(() => {
     // Check last log date in real app
  }, []);

  const handleScan = async (file: File) => {
    if (navigator.vibrate) navigator.vibrate(20);
    
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setStep('processing');

    try {
      // Use Scalable Service
      const result = await VisionService.getInstance().analyzeImage(file);
      
      if (navigator.vibrate) navigator.vibrate(50);
      setAnalysisData(result);
      setStep('result');
    } catch (e) {
      console.warn("AI Failure, fallback needed", e);
      setStep('error');
    }
  };

  const handleManualSelect = (food: {name: string, protein: number, weight: number}) => {
    // Convert manual selection to AnalysisPayload format
    setAnalysisData({
      aliment: food.name,
      confiance_score: 1.0,
      poids_estime: food.weight,
      volume_estime_cm3: food.weight, // approx
      proteines_calculees: food.protein,
      marge_erreur: 0,
      details_analyse: { reference_detectee: "Saisie Manuelle", methode_calcul: "User Input" }
    });
    // Use a placeholder image or keep the scanned one if available
    if (!imageSrc) setImageSrc('https://via.placeholder.com/400x300/000000/FFFFFF?text=MANUAL'); 
    setStep('result');
  };

  const handleValidate = async () => {
    if (analysisData) {
      // Secure Storage
      await HistoryService.logEntry({
         foodName: analysisData.aliment,
         protein: analysisData.proteines_calculees,
         weight: analysisData.poids_estime,
         method: step === 'manual' ? 'MANUAL_SEARCH' : 'AI_SCAN'
      });
      
      setStreak(s => s + 1);
      setStep('validated');
    }
  };
  
  const reset = () => {
    setStep('scan');
    setImageSrc(null);
    setAnalysisData(null);
  };

  // Adapter for Legacy ResultView Props
  const legacyData: AnalysisResult | null = analysisData ? {
      ...analysisData,
      // Ensure type compatibility if any mismatch
  } : null;

  return (
    <>
      <div style={{ background: 'var(--bg-app)', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          
          {step === 'scan' && (
            <motion.div 
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ScanView onScan={handleScan} streak={streak} />
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fullscreen-center"
              style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', zIndex: 10, background: 'rgba(5,5,5,0.9)' }}
            >
              <div className="animate-pulse-glow" style={{ 
                width: '60px', height: '60px', borderRadius: '50%', 
                border: '4px solid var(--accent-primary)', borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }} />
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fullscreen-center"
              style={{ textAlign: 'center', padding: '2rem' }}
            >
               <AlertCircle size={64} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
               <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>OUPS.</h2>
               <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>L'IA n'a pas pu identifier l'aliment avec certitude.</p>
               
               <button 
                  className="btn-cta" 
                  onClick={() => setStep('manual')}
               >
                 RECHERCHE MANUELLE
               </button>
               <button onClick={reset} style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>Réessayer le scan</button>
            </motion.div>
          )}

          {step === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              style={{ width: '100%', height: '100%' }}
            >
               <ManualSearch onSelect={handleManualSelect} onCancel={reset} />
            </motion.div>
          )}

          {step === 'result' && imageSrc && legacyData && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ResultView 
                imageSrc={imageSrc!} 
                data={legacyData} 
                onValidate={handleValidate} 
                onRetake={reset}
              />
            </motion.div>
          )}

          {step === 'validated' && (
            <motion.div 
              key="validated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ValidationView onComplete={reset} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
