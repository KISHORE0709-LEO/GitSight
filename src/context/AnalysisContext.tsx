import { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisContextType {
  analyzedUsername: string | null;
  setAnalyzedUsername: (username: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analyzedUsername, setAnalyzedUsername] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider value={{ analyzedUsername, setAnalyzedUsername }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
