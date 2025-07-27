
import { Link, useLocation } from 'react-router-dom';
import { Home, Star, MessageCircle, Building, BarChart3, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePropertyActions } from '@/hooks/usePropertyActions';

const Navbar = () => {
  const location = useLocation();
  const { openComparison, getComparisonCount } = usePropertyActions();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/recommendations', label: 'BrickMatrix™', icon: Star },
    { path: '/unified', label: 'Unified API', icon: Database },
    { path: '/chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-b-2 border-purple-600/30 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <Building className="h-12 w-12 text-purple-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Recommendation Center
              </h1>
              <p className="text-xs text-purple-300">Premium Intelligence</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105",
                    location.pathname === path
                      ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-xl"
                      : "text-purple-300 hover:text-white bg-purple-900/30 border border-purple-600/30 hover:border-purple-400/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {/* Comparison Button */}
              <button
                onClick={openComparison}
                className="flex items-center space-x-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 text-purple-300 hover:text-white bg-purple-900/30 border border-purple-600/30 hover:border-purple-400/50 relative"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Compare</span>
                {getComparisonCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getComparisonCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
