
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, MapPin, Building2 } from 'lucide-react';
import { promptSuggestionsService } from '@/services/promptSuggestionsService';

interface PromptBubblesProps {
  messageCount: number;
  lastQuery?: string;
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

const PromptBubbles = ({ messageCount, lastQuery, onSuggestionClick, className = '' }: PromptBubblesProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const newSuggestions = promptSuggestionsService.getDynamicSuggestions(
      messageCount,
      lastQuery
    );
    setSuggestions(newSuggestions);
    
    // Animate suggestions in one by one
    setVisibleSuggestions([]);
    newSuggestions.forEach((suggestion, index) => {
      setTimeout(() => {
        setVisibleSuggestions(prev => [...prev, suggestion]);
      }, index * 200);
    });
  }, [messageCount, lastQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend': return TrendingUp;
      case 'location': return MapPin;
      case 'builder': return Building2;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trend': return 'from-green-400 to-emerald-500';
      case 'location': return 'from-blue-400 to-cyan-500';
      case 'builder': return 'from-purple-400 to-violet-500';
      case 'investment': return 'from-orange-400 to-amber-500';
      default: return 'from-primary to-accent';
    }
  };

  if (visibleSuggestions.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
        <Sparkles className="h-3 w-3" />
        Try asking about:
      </div>
      
      <div className="flex flex-wrap gap-2">
        {visibleSuggestions.map((suggestion, index) => {
          const Icon = getCategoryIcon(suggestion.category);
          const colorClass = getCategoryColor(suggestion.category);
          
          return (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion.text)}
              className={`
                glassmorphism border-primary/30 hover:border-primary/60 
                text-foreground hover:text-background
                bg-gradient-to-r ${colorClass} hover:shadow-lg
                hover:scale-105 transition-all duration-300
                animate-fade-in rounded-2xl
              `}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <Icon className="h-3 w-3 mr-2" />
              <span className="text-xs font-medium">{suggestion.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PromptBubbles;
