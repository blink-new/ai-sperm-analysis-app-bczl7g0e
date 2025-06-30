import { useState } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { MainLayout } from './components/layout/MainLayout';
import { UploadPage } from './components/pages/UploadPage';
import { ResultsPage } from './components/pages/ResultsPage';
import { AnalysisHistory } from './components/pages/AnalysisHistory';
import { AnalysisResult } from './types/analysis';
import './styles/rtl.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'results' | 'history'>('upload');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentResult(result);
    setAnalysisHistory(prev => [result, ...prev]);
    setCurrentPage('results');
  };

  const handleNavigate = (page: 'upload' | 'results' | 'history') => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'upload':
        return <UploadPage onAnalysisComplete={handleAnalysisComplete} />;
      case 'results':
        return currentResult ? (
          <ResultsPage 
            result={currentResult} 
            onNewAnalysis={() => handleNavigate('upload')}
            onViewHistory={() => handleNavigate('history')}
          />
        ) : (
          <UploadPage onAnalysisComplete={handleAnalysisComplete} />
        );
      case 'history':
        return (
          <AnalysisHistory 
            history={analysisHistory}
            onNewAnalysis={() => handleNavigate('upload')}
            onViewResult={(result) => {
              setCurrentResult(result);
              setCurrentPage('results');
            }}
          />
        );
      default:
        return <UploadPage onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <MainLayout 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          hasResults={analysisHistory.length > 0}
        >
          {renderCurrentPage()}
        </MainLayout>
        <Toaster position="top-center" richColors />
      </div>
    </ThemeProvider>
  );
}

export default App;