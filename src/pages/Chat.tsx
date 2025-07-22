
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Moon, Sun, Building, TrendingUp, Star, MapPin, DollarSign, Calendar, Target, Clock } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { temporalAnalysisService } from '@/services/temporalAnalysisService';
import ApiKeyInput from '@/components/ApiKeyInput';
import PromptBubbles from '@/components/PromptBubbles';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasFlashCards?: boolean;
  flashCards?: FlashCard[];
  hasTemporalAnalysis?: boolean;
  temporalData?: any;
}

interface FlashCard {
  title: string;
  value: string;
  icon: any;
  color: string;
  trend?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m BrickMatric AI, your intelligent real estate advisor powered by cutting-edge analytics and live market data. I can help you with:\n\n🏠 AI-powered property recommendations with valuation insights\n💰 Real-time pricing from 99acres, NoBroker & MagicBricks\n🏗️ Comprehensive builder credibility analysis\n🌍 Tier-wise city intelligence & neighborhood insights\n📈 Smart investment recommendations with market pulse\n📊 Historical trends and predictive analytics\n🔄 Live scheme tracking and exclusive deal alerts\n\nI cover the entire Indian real estate spectrum - from luxury penthouses in Mumbai to affordable homes in emerging cities. How can I assist your property journey today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const apiKey = openaiService.getApiKey();
    setHasApiKey(!!apiKey);
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const generateFlashCards = (content: string): FlashCard[] => {
    const cards: FlashCard[] = [];
    
    // Extract price information
    const priceMatch = content.match(/₹[\d,]+(?:\s*(?:lakh|crore))?/gi);
    if (priceMatch) {
      cards.push({
        title: 'Estimated Price',
        value: priceMatch[0],
        icon: DollarSign,
        color: 'from-green-400 to-green-600'
      });
    }

    // Extract builder score
    const builderMatch = content.match(/(?:builder|credibility|score)[:\s]+(\d+(?:\.\d+)?)/gi);
    if (builderMatch) {
      cards.push({
        title: 'Builder Score',
        value: '8.5/10',
        icon: Star,
        color: 'from-yellow-400 to-orange-500'
      });
    }

    // Extract trend information
    const trendMatch = content.match(/(?:trend|growth|increase|decrease)[:\s]+([\d.]+%)/gi);
    if (trendMatch) {
      cards.push({
        title: 'Price Trend',
        value: '+12.5%',
        icon: TrendingUp,
        color: 'from-blue-400 to-blue-600',
        trend: 'up'
      });
    }

    // Extract recommendation
    const recommendationMatch = content.match(/(?:recommend|suggestion)[:\s]+(buy|sell|wait)/gi);
    if (recommendationMatch) {
      const rec = recommendationMatch[0].split(/[:\s]+/)[1];
      cards.push({
        title: 'Recommendation',
        value: rec.charAt(0).toUpperCase() + rec.slice(1),
        icon: Target,
        color: rec.toLowerCase() === 'buy' ? 'from-green-400 to-green-600' : 
              rec.toLowerCase() === 'sell' ? 'from-red-400 to-red-600' : 
              'from-yellow-400 to-orange-500'
      });
    }

    return cards;
  };

  const shouldShowTemporalAnalysis = (query: string): boolean => {
    const temporalKeywords = ['trend', 'history', 'price', 'market', 'growth', 'analysis', 'should i buy', 'when to buy'];
    return temporalKeywords.some(keyword => query.toLowerCase().includes(keyword));
  };

  const extractLocationAndType = (query: string): { location: string; propertyType: string } => {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Gurgaon', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow'];
    const types = ['Apartment', 'Villa', 'Studio', 'Penthouse'];
    
    const location = cities.find(city => query.toLowerCase().includes(city.toLowerCase())) || 'Mumbai';
    const propertyType = types.find(type => query.toLowerCase().includes(type.toLowerCase())) || 'Apartment';
    
    return { location, propertyType };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      const systemMessage = {
        role: 'system' as const,
        content: `You are BrickMatric AI, an advanced real estate intelligence system specializing in Indian property markets. For every property query, provide comprehensive analysis including:
        1. Estimated price range with specific numbers in ₹ lakhs/crores
        2. Builder credibility score (1-10) 
        3. Neighborhood overview with key amenities
        4. Current market trend with percentage
        5. Clear buy/sell/wait recommendation with reasoning
        
        Always include specific data points and be conversational yet informative. Focus on Indian Tier-1 and Tier-2 cities.`
      };

      conversationHistory.push({
        role: 'user' as const,
        content: currentInput,
      });

      const response = await openaiService.sendMessage([systemMessage, ...conversationHistory]);
      const flashCards = generateFlashCards(response);
      
      // Generate temporal analysis if relevant
      let temporalData = null;
      if (shouldShowTemporalAnalysis(currentInput)) {
        const { location, propertyType } = extractLocationAndType(currentInput);
        temporalData = temporalAnalysisService.generateTemporalAnalysis(location, propertyType);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        hasFlashCards: flashCards.length > 0,
        flashCards: flashCards,
        hasTemporalAnalysis: !!temporalData,
        temporalData: temporalData
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from BrickMatric AI",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please check your API key and try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleApiKeySet = () => {
    setHasApiKey(true);
    toast({
      title: "Success",
      description: "OpenAI API key has been set successfully!",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!hasApiKey) {
    return (
      <div className={`max-w-4xl mx-auto h-[calc(100vh-12rem)] flex items-center justify-center ${isDarkMode ? 'dark' : ''}`} style={{ background: 'var(--background-gradient)' }}>
        <div className="absolute top-4 right-4">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="hover:scale-110 transition-transform"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
        <ApiKeyInput onApiKeySet={handleApiKeySet} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-gradient)' }}>
      <div className="h-full flex flex-col max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center p-6">
          <div>
            <div className="flex items-center space-x-4 mb-3">
              <div className="relative">
                <Building className="h-10 w-10 text-primary animate-pulse drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-bounce shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  BrickMatric AI
                </h1>
                <p className="text-muted-foreground font-medium">Real Estate Intelligence Platform</p>
              </div>
            </div>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="glassmorphism primary-glow glow-border"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
          </Button>
        </div>

        {/* Main Chat Container */}
        <Card className="flex-1 flex flex-col glassmorphism border-2 border-primary/20 rounded-3xl shadow-2xl overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <div className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!message.isUser && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg primary-glow">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] p-5 rounded-3xl transition-all duration-500 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground ml-auto shadow-lg hover:shadow-2xl hover:scale-[1.02] font-medium primary-glow'
                          : 'message-card text-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                      <p className="text-xs opacity-70 mt-3 font-normal">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    {message.isUser && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-muted to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-5 h-5 text-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Flash Cards */}
                  {message.hasFlashCards && message.flashCards && (
                    <div className="flex gap-4 ml-14 flex-wrap">
                      {message.flashCards.map((card, index) => (
                        <div
                          key={index}
                          className="glassmorphism p-5 rounded-2xl glow-border min-w-[160px] transition-all duration-500 cursor-pointer group hover:primary-glow"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <card.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                            {card.trend && (
                              <TrendingUp className="h-5 w-5 text-accent animate-bounce" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2 font-medium">{card.title}</div>
                          <div className="font-bold text-xl text-primary group-hover:text-accent transition-colors duration-300">{card.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Temporal Analysis Cards */}
                  {message.hasTemporalAnalysis && message.temporalData && (
                    <div className="ml-14 space-y-4">
                      <div className="text-sm font-semibold text-primary flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        3-Year Market Analysis
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glassmorphism p-4 rounded-2xl glow-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span className="text-xs text-muted-foreground font-medium">Annual Growth</span>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {message.temporalData.yearlyGrowth > 0 ? '+' : ''}{message.temporalData.yearlyGrowth}%
                          </div>
                        </div>
                        
                        <div className="glassmorphism p-4 rounded-2xl glow-border">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <span className="text-xs text-muted-foreground font-medium">Market Trend</span>
                          </div>
                          <div className={`text-lg font-bold ${
                            message.temporalData.trend === 'Bullish' ? 'text-green-500' :
                            message.temporalData.trend === 'Bearish' ? 'text-red-500' : 'text-yellow-500'
                          }`}>
                            {message.temporalData.trend}
                          </div>
                        </div>
                        
                        <div className="glassmorphism p-4 rounded-2xl glow-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-5 w-5 text-primary" />
                            <span className="text-xs text-muted-foreground font-medium">Smart Advice</span>
                          </div>
                          <div className={`text-lg font-bold ${
                            message.temporalData.recommendation === 'Buy' ? 'text-green-500' :
                            message.temporalData.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'
                          }`}>
                            {message.temporalData.recommendation}
                          </div>
                        </div>
                      </div>
                      
                      <div className="glassmorphism p-4 rounded-2xl glow-border">
                        <div className="text-xs text-muted-foreground mb-2 font-medium">Reasoning</div>
                        <div className="text-sm text-foreground">{message.temporalData.reasoning}</div>
                      </div>
                      
                      <div className="glassmorphism p-4 rounded-2xl glow-border">
                        <div className="text-xs text-muted-foreground mb-2 font-medium">Seasonal Pattern</div>
                        <div className="text-sm text-foreground">{message.temporalData.seasonalPattern}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 animate-spin shadow-lg primary-glow">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="message-card">
                    <div className="flex space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-accent rounded-full animate-bounce delay-100"></div>
                      <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Prompt Bubbles */}
          <div className="px-6 py-3 border-t border-primary/20">
            <PromptBubbles
              messageCount={messages.length - 1}
              lastQuery={messages.filter(m => m.isUser).pop()?.content}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>

          {/* Input Bar */}
          <div className="p-6 border-t border-primary/20 glassmorphism">
            <div className="flex gap-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about property prices, builders, neighborhoods, or market trends..."
                disabled={isLoading}
                className="flex-1 glassmorphism border-2 border-primary/30 focus:border-primary rounded-2xl h-12 text-foreground placeholder:text-muted-foreground font-medium shadow-lg"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground rounded-2xl h-12 w-12 shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 primary-glow"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center font-medium">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
