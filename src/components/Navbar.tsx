
import { Link, useLocation } from 'react-router-dom';
import { Home, Star, TrendingUp, MessageCircle, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/recommendations', label: 'Recommendations', icon: Star },
    { path: '/market-pulse', label: 'Market Pulse', icon: TrendingUp },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle },
  ];

  return (
    <nav className="glassmorphism shadow-2xl border-b-2 border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <img 
                src={logoLight} 
                alt="PropGyan Logo Light" 
                className="h-12 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-lg dark:hidden" 
              />
              <img 
                src={logoDark} 
                alt="PropGyan Logo Dark" 
                className="h-12 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-lg hidden dark:block" 
              />
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
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl primary-glow"
                      : "text-muted-foreground hover:text-foreground glassmorphism border border-primary/20 hover:border-primary/40"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
