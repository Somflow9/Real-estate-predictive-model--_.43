
import { Link, useLocation } from 'react-router-dom';
import { Home, Star, TrendingUp, MessageCircle, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

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
              <Building className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse shadow-lg"></div>
            </div>
            <div>
              <span className="text-3xl font-bold font-poppins bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PropGyan
              </span>
              <div className="text-xs text-muted-foreground -mt-1 font-medium">Premium Property Intelligence</div>
            </div>
          </Link>
          
          <div className="flex space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105",
                  location.pathname === path
                    ? "bg-gradient-to-r from-primary to-accent text-background shadow-xl gold-glow"
                    : "text-muted-foreground hover:text-foreground glassmorphism border border-primary/20 hover:border-primary/40"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
