
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import MarketPulse from './pages/MarketPulse';
import Chat from './pages/Chat';
import { PropertyProvider } from './contexts/PropertyContext';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize with light theme by default
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
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
                <Route path="/market-pulse" element={<MarketPulse />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </PropertyProvider>
    </QueryClientProvider>
  );
}

export default App;
