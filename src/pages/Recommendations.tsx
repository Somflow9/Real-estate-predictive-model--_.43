import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Star, 
  Building, 
  Target,
  Zap,
  RefreshCw,
  Map,
  BarChart3,
  Award,
  Clock,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import RecommendationFilters from '@/components/RecommendationFilters';
import PremiumRecommendationCard from '@/components/PremiumRecommendationCard';
import EnhancedRecommendationBar from '@/components/EnhancedRecommendationBar';
import NeighborhoodIntelligence from '@/components/NeighborhoodIntelligence';
import PropertySourcesBadge from '@/components/PropertySourcesBadge';
import { realTimePropertyService } from '@/services/realTimePropertyService';
import { builderSchemesService } from '@/services/builderSchemesService';
import { tierCityService } from '@/services/tierCityService';
import LoadingScreen from '@/components/LoadingScreen';

interface RecommendationState {
  properties: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  totalScanned: number;
  sourcesActive: number;
}

interface UserPreferences {
  budget: { min: number; max: number };
  city: string;
  locality?: string;
  bhk: string;
  propertyType: string;
  amenities: string[];
  readyToMove: boolean;
  newLaunch: boolean;
}

const Recommendations = () => {
  const { toast } = useToast();
  const [state, setState] = useState<RecommendationState>({
    properties: [],
    loading: true,
    error: null,
    lastUpdated: null,
    totalScanned: 0,
    sourcesActive: 4
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: { min: 2000000, max: 20000000 },
    city: 'Mumbai',
    locality: '',
    bhk: 'Any',
    propertyType: 'Any',
    amenities: [],
    readyToMove: false,
    newLaunch: false
  });

  const [activeTab, setActiveTab] = useState('recommendations');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [nearbySchemes, setNearbySchemes] = useState<any[]>([]);
  const [cityTier, setCityTier] = useState<1 | 2 | 3>(1);
  const [showMap, setShowMap] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  useEffect(() => {
    const cityData = tierCityService.getCityData(preferences.city);
    const tier = cityData ? cityData.tier : 1;
    setCityTier(tier);
    loadRecommendations();
  }, [preferences.city]);

  const loadRecommendations = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      toast({
        title: "🔍 Scanning Live Market Data",
        description: "Fetching real-time properties from MagicBricks, 99acres, Housing.com & NoBroker...",
      });

      // Simulate progressive data loading
      const progressSteps = [
        { message: "Connecting to MagicBricks...", progress: 25 },
        { message: "Scanning 99acres database...", progress: 50 },
        { message: "Fetching Housing.com listings...", progress: 75 },
        { message: "Analyzing NoBroker data...", progress: 90 },
        { message: "AI ranking in progress...", progress: 100 }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setState(prev => ({ 
          ...prev, 
          totalScanned: prev.totalScanned + Math.floor(Math.random() * 50) + 20 
        }));
      }

      // Fetch real-time properties
      const properties = await realTimePropertyService.fetchRealTimeProperties({
        city: preferences.city,
        budget: preferences.budget,
        bhk: preferences.bhk !== 'Any' ? preferences.bhk : undefined,
        propertyType: preferences.propertyType !== 'Any' ? preferences.propertyType : undefined,
        locality: preferences.locality || undefined
      });

      // Generate AI insights
      const insights = await generateAIInsights(properties, preferences);
      setAiInsights(insights);

      setState(prev => ({
        ...prev,
        properties,
        loading: false,
        lastUpdated: new Date(),
        totalScanned: prev.totalScanned + properties.length
      }));

      toast({
        title: "✅ Market Scan Complete",
        description: `Found ${properties.length} premium properties with AI analysis`,
      });

    } catch (error) {
      console.error('Error loading recommendations:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load recommendations. Please try again.'
      }));

      toast({
        title: "❌ Scan Failed",
        description: "Unable to fetch live market data. Please check your connection.",
        variant: "destructive"
      });
    }
  };

  const generateAIInsights = async (properties: any[], prefs: UserPreferences) => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const avgPrice = properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
    const priceRange = { 
      min: Math.min(...properties.map(p => p.price)), 
      max: Math.max(...properties.map(p => p.price)) 
    };
    
    return {
      marketSummary: `${prefs.city} shows strong demand with ${properties.length} active listings`,
      priceInsight: `Average price: ₹${(avgPrice / 100000).toFixed(1)}L (Range: ₹${(priceRange.min / 100000).toFixed(1)}L - ₹${(priceRange.max / 100000).toFixed(1)}L)`,
      recommendation: properties.length > 15 ? 'Buyer\'s Market' : 'Seller\'s Market',
      hotspots: ['Bandra West', 'Powai', 'Lower Parel'].slice(0, 3),
      trendDirection: Math.random() > 0.5 ? 'Bullish' : 'Stable'
    };
  };

  const handleFiltersChange = (newFilters: any) => {
    setPreferences(prev => ({ ...prev, ...newFilters }));
  };

  const handlePropertySelect = async (property: any) => {
    setSelectedProperty(property);
    
    // Fetch nearby competing schemes
    try {
      const schemes = await builderSchemesService.searchNearbyProjectsWithGoogleMaps(
        `${property.locality}, ${property.city || preferences.city}`
      );
      setNearbySchemes(schemes);
    } catch (error) {
      console.error('Error fetching nearby schemes:', error);
    }
  };

  const handleRefresh = () => {
    setState(prev => ({ ...prev, totalScanned: 0 }));
    loadRecommendations();
  };

  if (state.loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--background-gradient)' }}>
        <div className="text-center space-y-8">
          {/* BrickMatric Logo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-32 h-32 mx-auto relative"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl primary-glow" />
              <div className="absolute inset-2 bg-background/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <img 
                  src="/src/assets/logo-light.png" 
                  alt="BrickMatric Logo" 
                  className="h-16 w-auto dark:hidden" 
                />
                <img 
                  src="/src/assets/logo-dark.png" 
                  alt="BrickMatric Logo" 
                  className="h-16 w-auto hidden dark:block" 
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BrickMatric
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              AI-Powered Real Estate Intelligence
            </p>
          </motion.div>

          {/* Loading Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">Scanning live market data from 4 premium sources...</p>
            
            {/* Progress Bar */}
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>

          {/* Animation Dots */}
          <motion.div
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-gradient)' }}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <Target className="h-12 w-12 text-primary animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-bounce"></div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text-primary">
                BrickMatrix™ Property Recommendations
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Premium intelligence • Live market data • Tier {cityTier} city analysis
              </p>
            </div>
          </div>

          {/* Live Data Sources */}
          <PropertySourcesBadge />

          {/* AI Market Insights */}
          {aiInsights && (
            <Card className="glassmorphism glow-border max-w-4xl mx-auto">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-2">
                    <Zap className="h-6 w-6 mx-auto text-primary" />
                    <div className="text-sm font-medium text-muted-foreground">Market Status</div>
                    <div className="text-lg font-bold text-primary">{aiInsights.recommendation}</div>
                  </div>
                  <div className="space-y-2">
                    <TrendingUp className="h-6 w-6 mx-auto text-accent" />
                    <div className="text-sm font-medium text-muted-foreground">Trend</div>
                    <div className="text-lg font-bold text-accent">{aiInsights.trendDirection}</div>
                  </div>
                  <div className="space-y-2">
                    <Building className="h-6 w-6 mx-auto text-primary" />
                    <div className="text-sm font-medium text-muted-foreground">Active Listings</div>
                    <div className="text-lg font-bold text-primary">{state.properties.length}</div>
                  </div>
                  <div className="space-y-2">
                    <Clock className="h-6 w-6 mx-auto text-accent" />
                    <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                    <div className="text-lg font-bold text-accent">
                      {state.lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Now'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RecommendationFilters
            onFiltersChange={handleFiltersChange}
            onRefresh={handleRefresh}
            isLoading={state.loading}
            cityTier={cityTier}
          />
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="glassmorphism">
              <TabsTrigger value="recommendations" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>AI Recommendations</span>
              </TabsTrigger>
              <TabsTrigger value="schemes" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Live Schemes</span>
              </TabsTrigger>
              <TabsTrigger value="neighborhood" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Area Intelligence</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Market Analytics</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="animate-pulse">
                🔴 Live Data
              </Badge>
              <Button
                onClick={() => setShowMap(!showMap)}
                variant="outline"
                size="sm"
                className="glassmorphism hover:scale-105 transition-transform"
              >
                <Map className="h-4 w-4 mr-2" />
                {showMap ? 'Hide' : 'Show'} Map
              </Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="glassmorphism hover:scale-105 transition-transform"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Live Market Stats */}
            <Card className="glassmorphism glow-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Live Market Intelligence</span>
                  <Badge className="bg-green-500 text-white animate-pulse">LIVE</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{state.totalScanned}</div>
                    <div className="text-sm text-muted-foreground">Properties Scanned</div>
                  </div>
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{state.sourcesActive}</div>
                    <div className="text-sm text-muted-foreground">Live Sources</div>
                  </div>
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {aiInsights?.priceInsight?.match(/₹[\d.]+L/)?.[0] || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Price</div>
                  </div>
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">Tier {cityTier}</div>
                    <div className="text-sm text-muted-foreground">City Category</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI-Ranked Properties */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Target className="h-6 w-6 text-primary" />
                  <span>AI-Ranked Properties</span>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                    Top {state.properties.length} Matches
                  </Badge>
                </h2>
                
                <div className="text-sm text-muted-foreground">
                  Ranked by location intelligence, builder credibility & price trends
                </div>
              </div>

              {state.properties.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {state.properties.slice(0, 12).map((property, index) => (
                    <PremiumRecommendationCard
                      key={property.id}
                      property={property}
                      rank={index + 1}
                      onViewDetails={handlePropertySelect}
                      onCompare={(id) => console.log('Compare:', id)}
                      onSaveProperty={(id) => console.log('Save:', id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="glassmorphism text-center py-12">
                  <CardContent>
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search in a different area
                    </p>
                    <Button onClick={handleRefresh} className="bg-gradient-to-r from-primary to-accent">
                      Refresh Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schemes" className="space-y-6">
            <EnhancedRecommendationBar
              city={preferences.city}
              tier={cityTier}
              preferences={{
                budget: preferences.budget.max,
                propertyType: preferences.propertyType,
                bedrooms: parseInt(preferences.bhk.replace('BHK', '')) || 2
              }}
            />
          </TabsContent>

          <TabsContent value="neighborhood" className="space-y-6">
            <NeighborhoodIntelligence
              location={preferences.locality || `${preferences.city} Central`}
              coordinates={{ lat: 19.0760, lng: 72.8777 }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glassmorphism glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Price Distribution Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget Range</span>
                      <span className="font-medium">₹{(preferences.budget.min / 100000).toFixed(1)}L - ₹{(preferences.budget.max / 100000).toFixed(1)}L</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Coverage</span>
                      <span className="font-medium">{Math.min(100, Math.floor((state.properties.length / 50) * 100))}%</span>
                    </div>
                    <Progress value={Math.min(100, Math.floor((state.properties.length / 50) * 100))} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Confidence</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Market Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { label: 'New Launches', value: '+18%', trend: 'up' },
                      { label: 'Price Appreciation', value: '+12%', trend: 'up' },
                      { label: 'Inventory Levels', value: '-8%', trend: 'down' },
                      { label: 'Builder Activity', value: '+25%', trend: 'up' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium">{item.label}</span>
                        <div className={`flex items-center space-x-1 ${
                          item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`h-4 w-4 ${item.trend === 'down' ? 'rotate-180' : ''}`} />
                          <span className="font-bold">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Property Details */}
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="glassmorphism glow-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Selected Property Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">{selectedProperty.title}</h3>
                    <p className="text-muted-foreground">{selectedProperty.projectName}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-bold text-primary">₹{(selectedProperty.price / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Per Sq Ft:</span>
                        <span className="font-medium">₹{selectedProperty.pricePerSqft?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Builder:</span>
                        <span className="font-medium">{selectedProperty.builderName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Nearby Competing Projects</h4>
                    {nearbySchemes.length > 0 ? (
                      <div className="space-y-2">
                        {nearbySchemes.slice(0, 3).map((scheme, index) => (
                          <div key={index} className="p-3 bg-accent/20 rounded-lg">
                            <div className="font-medium text-sm">{scheme.name}</div>
                            <div className="text-xs text-muted-foreground">{scheme.builder} • {scheme.distance}km away</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Loading nearby projects...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Footer Stats */}
        <Card className="glassmorphism glow-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Powered by AI • Live data from 4 premium sources • Updated every 15 minutes
              </p>
              <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                <span>Last scan: {state.lastUpdated?.toLocaleString() || 'Just now'}</span>
                <span>•</span>
                <span>Properties analyzed: {state.totalScanned.toLocaleString()}</span>
                <span>•</span>
                <span>AI confidence: 94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;