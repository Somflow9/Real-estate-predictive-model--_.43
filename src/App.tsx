
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import Chat from './pages/Chat';
import { PropertyProvider } from './contexts/PropertyContext';
import PropertyDetailsModal from './components/PropertyDetailsModal';
import ComparisonModal from './components/ComparisonModal';
import { usePropertyActions } from './hooks/usePropertyActions';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  const {
    isDetailsModalOpen,
    isComparisonModalOpen,
    selectedPropertyId,
    setIsDetailsModalOpen,
    setIsComparisonModalOpen,
    handleViewDetails,
    handleCompare
  } = usePropertyActions();

  useEffect(() => {
    // Initialize with dark theme by default
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PropertyProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </main>
            <Toaster />
            
            {/* Global Modals */}
            <PropertyDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              propertyId={selectedPropertyId || ''}
            />
            
            <ComparisonModal
              isOpen={isComparisonModalOpen}
              onClose={() => setIsComparisonModalOpen(false)}
              onViewDetails={handleViewDetails}
              onCompare={handleCompare}
            />
          </div>
        </Router>
      </PropertyProvider>
    </QueryClientProvider>
  );
}

export default App;
