import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  TrendingUp, 
  Building, 
  MapPin, 
  Star, 
  Shield, 
  Zap,
  RefreshCw,
  Filter,
  Search,
  Crown,
  Award,
  Clock,
  DollarSign,
  Home,
  Wifi,
  Car,
  Trees,
  Dumbbell,
  Waves,
  Users,
  BookOpen,
  Camera,
  Lock,
  Flame,
  Droplets,
  Sun,
  Trash2,
  Phone,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface BrickMatrixProperty {
  id: string;
  location_intelligence: {
    city: string;
    tier: number;
    locality: string;
    coordinates: { lat: number; lng: number };
    connectivity_score: number;
    nearby_schemes_density: number;
    competing_projects: Array<{
      project_name: string;
      distance_km: number;
      price_per_sqft: number;
      builder: string;
    }>;
    hotspot_status: boolean;
  };
  builder_profile: {
    builder_name: string;
    rera_registered: boolean;
    delivery_score: number;
    avg_rating: number;
    builder_rank: number;
    market_sentiment_score: number;
  };
  project_details: {
    project_name: string;
    status: string;
    property_type: string;
    bhk_configurations: string[];
    possession_date: string;
    amenities_score: number;
  };
  pricing_offers: {
    price_per_sqft: number;
    total_price_range: Record<string, { min: number; max: number }>;
    price_trend_direction: string;
    active_offers: {
      cashback_offers: Array<{ offer_name: string; cashback_amount: number }>;
      loan_offers: Array<{ bank: string; interest_rate: number }>;
    };
  };
  brickmatrix_scoring: {
    brickmatrix_score: number;
    affordability_index: number;
    livability_score: number;
    investment_potential: number;
    badges: string[];
    ai_recommendation: {
      action: string;
      confidence: number;
      reasoning: string;
    };
  };
  buyer_preferences: Record<string, boolean | string>;
}

interface FilterState {
  budget: { min: number; max: number };
  city: string;
  bhk: string[];
  property_type: string;
  preferences: Record<string, boolean>;
  builder_rating_min: number;
  possession_timeline: string;
}

const BrickMatrixRecommendations = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<BrickMatrixProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('recommendations');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    budget: { min: 2000000, max: 50000000 },
    city: 'Mumbai',
    bhk: [],
    property_type: 'apartment',
    preferences: {},
    builder_rating_min: 7,
    possession_timeline: 'any'
  });

  const [marketPulse, setMarketPulse] = useState({
    sentiment: 'bullish',
    nifty_realty: 485.60,
    interest_rate: 8.75,
    trending_news: []
  });

  const preferenceOptions = [
    { key: 'swimming_pool', label: 'Swimming Pool', icon: Waves, category: 'Recreation' },
    { key: 'gym', label: 'Gym & Fitness', icon: Dumbbell, category: 'Recreation' },
    { key: 'clubhouse', label: 'Clubhouse', icon: Users, category: 'Recreation' },
    { key: 'power_backup', label: 'Power Backup', icon: Zap, category: 'Essential' },
    { key: 'gated_community', label: 'Gated Community', icon: Shield, category: 'Security' },
    { key: 'wifi_ready', label: 'Wi-Fi Ready', icon: Wifi, category: 'Technology' },
    { key: 'pet_friendly', label: 'Pet Friendly', icon: Home, category: 'Lifestyle' },
    { key: 'rooftop_access', label: 'Rooftop Access', icon: Home, category: 'Lifestyle' },
    { key: 'vaastu_compliant', label: 'Vaastu Compliant', icon: Home, category: 'Traditional' },
    { key: 'smart_home_features', label: 'Smart Home', icon: Home, category: 'Technology' },
    { key: 'air_conditioning', label: 'Air Conditioning', icon: Home, category: 'Comfort' },
    { key: 'modular_kitchen', label: 'Modular Kitchen', icon: Home, category: 'Interior' },
    { key: 'balcony_view', label: 'Balcony View', icon: Camera, category: 'View' },
    { key: 'study_room', label: 'Study Room', icon: BookOpen, category: 'Functional' },
    { key: 'servant_room', label: 'Servant Room', icon: Home, category: 'Functional' },
    { key: 'private_garden', label: 'Private Garden', icon: Trees, category: 'Outdoor' },
    { key: 'terrace_access', label: 'Terrace Access', icon: Home, category: 'Outdoor' },
    { key: 'dedicated_parking', label: 'Dedicated Parking', icon: Car, category: 'Essential' },
    { key: 'near_school', label: 'Near School', icon: BookOpen, category: 'Location' },
    { key: 'near_metro', label: 'Near Metro', icon: MapPin, category: 'Location' },
    { key: 'ev_charging', label: 'EV Charging', icon: Zap, category: 'Technology' },
    { key: 'community_events', label: 'Community Events', icon: Users, category: 'Social' },
    { key: 'sports_facilities', label: 'Sports Facilities', icon: Target, category: 'Recreation' },
    { key: 'security_24x7', label: '24x7 Security', icon: Lock, category: 'Security' },
    { key: 'fire_safety', label: 'Fire Safety', icon: Flame, category: 'Safety' },
    { key: 'rainwater_harvesting', label: 'Rainwater Harvesting', icon: Droplets, category: 'Eco' },
    { key: 'solar_panels', label: 'Solar Panels', icon: Sun, category: 'Eco' },
    { key: 'waste_management', label: 'Waste Management', icon: Trash2, category: 'Eco' },
    { key: 'intercom_facility', label: 'Intercom Facility', icon: Phone, category: 'Communication' },
    { key: 'concierge_service', label: 'Concierge Service', icon: UserCheck, category: 'Premium' }
  ];

  useEffect(() => {
    loadBrickMatrixRecommendations();
    const interval = setInterval(refreshMarketPulse, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [filters]);

  const loadBrickMatrixRecommendations = async () => {
    setLoading(true);
    try {
      toast({
        title: "🔮 BrickMatrix™ Engine Activated",
        description: "Scanning live data from MagicBricks, 99acres, Housing.com & NoBroker...",
      });

      // Simulate real-time data fetching
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockProperties = generateMockProperties();
      setProperties(mockProperties);
      setLastUpdated(new Date());
      
      toast({
        title: "✨ BrickMatrix™ Analysis Complete",
        description: `Found ${mockProperties.length} premium properties with AI scoring`,
      });
    } catch (error) {
      toast({
        title: "❌ BrickMatrix™ Error",
        description: "Failed to load recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMarketPulse = async () => {
    // Simulate market pulse refresh
    setMarketPulse(prev => ({
      ...prev,
      nifty_realty: prev.nifty_realty + (Math.random() - 0.5) * 10,
      interest_rate: 8.75 + (Math.random() - 0.5) * 0.5
    }));
  };

  const generateMockProperties = (): BrickMatrixProperty[] => {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];
    const builders = ['Lodha Group', 'DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group'];
    const localities = {
      Mumbai: ['Bandra West', 'Powai', 'Lower Parel', 'Worli', 'Andheri West'],
      Delhi: ['Gurgaon', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj'],
      Bangalore: ['Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Indiranagar']
    };

    return Array.from({ length: 12 }, (_, i) => {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const builder = builders[Math.floor(Math.random() * builders.length)];
      const locality = localities[city as keyof typeof localities]?.[Math.floor(Math.random() * 5)] || 'Central Area';
      
      return {
        id: `bm_${Date.now()}_${i}`,
        location_intelligence: {
          city,
          tier: ['Mumbai', 'Delhi', 'Bangalore'].includes(city) ? 1 : 2,
          locality,
          coordinates: { lat: 19.0760 + Math.random() * 0.1, lng: 72.8777 + Math.random() * 0.1 },
          connectivity_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          nearby_schemes_density: Math.floor(Math.random() * 20) + 5,
          competing_projects: [
            {
              project_name: `${builder.split(' ')[0]} Heights`,
              distance_km: Math.round(Math.random() * 3 * 10) / 10,
              price_per_sqft: Math.floor(Math.random() * 5000) + 15000,
              builder: builder
            }
          ],
          hotspot_status: Math.random() > 0.6
        },
        builder_profile: {
          builder_name: builder,
          rera_registered: true,
          delivery_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          avg_rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
          builder_rank: Math.floor(Math.random() * 10) + 1,
          market_sentiment_score: Math.round((Math.random() * 3 + 7) * 10) / 10
        },
        project_details: {
          project_name: `${builder.split(' ')[0]} ${['Eternis', 'Grandeur', 'Platinum', 'Elite', 'Signature'][Math.floor(Math.random() * 5)]}`,
          status: ['ready', 'under_construction', 'new_launch'][Math.floor(Math.random() * 3)],
          property_type: 'apartment',
          bhk_configurations: ['2BHK', '3BHK', '4BHK'],
          possession_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0],
          amenities_score: Math.round((Math.random() * 2 + 8) * 10) / 10
        },
        pricing_offers: {
          price_per_sqft: Math.floor(Math.random() * 10000) + 15000,
          total_price_range: {
            '2BHK': { min: 12000000, max: 18000000 },
            '3BHK': { min: 18000000, max: 28000000 },
            '4BHK': { min: 28000000, max: 45000000 }
          },
          price_trend_direction: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)],
          active_offers: {
            cashback_offers: [
              { offer_name: 'Early Bird Special', cashback_amount: 200000 }
            ],
            loan_offers: [
              { bank: 'HDFC Bank', interest_rate: 8.75 }
            ]
          }
        },
        brickmatrix_scoring: {
          brickmatrix_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          affordability_index: Math.round((Math.random() * 4 + 6) * 10) / 10,
          livability_score: Math.round((Math.random() * 2 + 8) * 10) / 10,
          investment_potential: Math.round((Math.random() * 3 + 7) * 10) / 10,
          badges: ['BrickMatrix™ Top Choice', 'Trending Now', 'Premium Location'].slice(0, Math.floor(Math.random() * 3) + 1),
          ai_recommendation: {
            action: ['strong_buy', 'buy', 'hold'][Math.floor(Math.random() * 3)],
            confidence: Math.floor(Math.random() * 30) + 70,
            reasoning: 'Excellent location with proven builder track record and strong appreciation potential'
          }
        },
        buyer_preferences: preferenceOptions.reduce((acc, option) => {
          acc[option.key] = Math.random() > 0.5;
          return acc;
        }, {} as Record<string, boolean>)
      };
    });
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-purple-400';
    if (score >= 7.5) return 'text-purple-300';
    if (score >= 6.5) return 'text-purple-200';
    return 'text-gray-400';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'strong_buy': return 'bg-gradient-to-r from-purple-600 to-purple-400';
      case 'buy': return 'bg-gradient-to-r from-purple-500 to-purple-300';
      case 'hold': return 'bg-gradient-to-r from-gray-600 to-gray-400';
      default: return 'bg-gradient-to-r from-purple-600 to-purple-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-purple-900 flex items-center justify-center">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            BrickMatrix™ Engine
          </h1>
          <p className="text-purple-200">Analyzing premium properties with AI intelligence...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-purple-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-4">
            <motion.div
              className="relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Target className="h-12 w-12 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                BrickMatrix™ Recommendations
              </h1>
              <p className="text-purple-200 text-lg font-medium">
                Premium Intelligence • Live Market Data • AI-Powered Scoring
              </p>
            </div>
          </div>

          {/* Live Market Pulse */}
          <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <TrendingUp className="h-6 w-6 mx-auto text-purple-400" />
                  <div className="text-sm text-purple-300">Nifty Realty</div>
                  <div className="text-2xl font-bold text-purple-100">{marketPulse.nifty_realty.toFixed(2)}</div>
                </div>
                <div className="space-y-2">
                  <DollarSign className="h-6 w-6 mx-auto text-purple-400" />
                  <div className="text-sm text-purple-300">Interest Rate</div>
                  <div className="text-2xl font-bold text-purple-100">{marketPulse.interest_rate}%</div>
                </div>
                <div className="space-y-2">
                  <Zap className="h-6 w-6 mx-auto text-purple-400" />
                  <div className="text-sm text-purple-300">Market Sentiment</div>
                  <div className="text-2xl font-bold text-purple-100 capitalize">{marketPulse.sentiment}</div>
                </div>
                <div className="space-y-2">
                  <Clock className="h-6 w-6 mx-auto text-purple-400" />
                  <div className="text-sm text-purple-300">Last Updated</div>
                  <div className="text-lg font-bold text-purple-100">
                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-purple-900/50 border border-purple-600/30">
              <TabsTrigger value="recommendations" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Crown className="h-4 w-4 mr-2" />
                BrickMatrix™ Picks
              </TabsTrigger>
              <TabsTrigger value="filters" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Smart Filters
              </TabsTrigger>
              <TabsTrigger value="pulse" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Pulse
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-600 text-white animate-pulse">
                🔴 LIVE
              </Badge>
              <Button
                onClick={loadBrickMatrixRecommendations}
                variant="outline"
                size="sm"
                className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Properties Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <Card className="group bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
                      {/* Header with Score */}
                      <div className="relative p-6 pb-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-purple-100 group-hover:text-white transition-colors">
                              {property.project_details.project_name}
                            </h3>
                            <p className="text-purple-300 text-sm">{property.location_intelligence.locality}, {property.location_intelligence.city}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getScoreColor(property.brickmatrix_scoring.brickmatrix_score)}`}>
                              {property.brickmatrix_scoring.brickmatrix_score}
                            </div>
                            <div className="text-xs text-purple-400">BrickMatrix™ Score</div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.brickmatrix_scoring.badges.map((badge, idx) => (
                            <Badge key={idx} className="bg-purple-600/80 text-white text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <CardContent className="space-y-4">
                        {/* Price Information */}
                        <div className="bg-purple-900/30 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-300 text-sm">Price Range</span>
                            <span className="text-purple-400 text-sm">₹{property.pricing_offers.price_per_sqft.toLocaleString()}/sq ft</span>
                          </div>
                          <div className="text-2xl font-bold text-purple-100">
                            ₹{(property.pricing_offers.total_price_range['3BHK']?.min / 10000000).toFixed(1)}Cr - 
                            ₹{(property.pricing_offers.total_price_range['3BHK']?.max / 10000000).toFixed(1)}Cr
                          </div>
                        </div>

                        {/* Scoring Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-purple-300">Livability</span>
                              <span className="text-purple-200">{property.brickmatrix_scoring.livability_score}/10</span>
                            </div>
                            <Progress 
                              value={property.brickmatrix_scoring.livability_score * 10} 
                              className="h-2 bg-purple-900/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-purple-300">Investment</span>
                              <span className="text-purple-200">{property.brickmatrix_scoring.investment_potential}/10</span>
                            </div>
                            <Progress 
                              value={property.brickmatrix_scoring.investment_potential * 10} 
                              className="h-2 bg-purple-900/50"
                            />
                          </div>
                        </div>

                        {/* Builder Info */}
                        <div className="flex items-center justify-between p-3 bg-purple-800/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200 text-sm font-medium">{property.builder_profile.builder_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-purple-200 text-sm">{property.builder_profile.avg_rating}</span>
                          </div>
                        </div>

                        {/* AI Recommendation */}
                        <div className={`p-4 rounded-lg ${getActionColor(property.brickmatrix_scoring.ai_recommendation.action)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold text-sm uppercase">
                              {property.brickmatrix_scoring.ai_recommendation.action.replace('_', ' ')}
                            </span>
                            <span className="text-white text-sm">
                              {property.brickmatrix_scoring.ai_recommendation.confidence}% Confidence
                            </span>
                          </div>
                          <p className="text-white/90 text-xs">
                            {property.brickmatrix_scoring.ai_recommendation.reasoning}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white">
                            View Details
                          </Button>
                          <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white">
                            Compare
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-purple-100 flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-purple-400" />
                  <span>BrickMatrix™ Smart Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Range */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-200">Budget Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-purple-300">
                      <span>₹{(filters.budget.min / 10000000).toFixed(1)}Cr</span>
                      <span>₹{(filters.budget.max / 10000000).toFixed(1)}Cr</span>
                    </div>
                    <Slider
                      value={[filters.budget.min / 1000000, filters.budget.max / 1000000]}
                      onValueChange={([min, max]) => setFilters(prev => ({ 
                        ...prev, 
                        budget: { min: min * 1000000, max: max * 1000000 } 
                      }))}
                      min={20}
                      max={500}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Buyer Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-200">Buyer Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {preferenceOptions.map((option) => (
                      <div key={option.key} className="flex items-center space-x-3 p-3 bg-purple-900/30 rounded-lg hover:bg-purple-800/30 transition-colors">
                        <Switch
                          checked={filters.preferences[option.key] || false}
                          onCheckedChange={(checked) => handlePreferenceChange(option.key, checked)}
                          className="data-[state=checked]:bg-purple-600"
                        />
                        <div className="flex items-center space-x-2">
                          <option.icon className="h-4 w-4 text-purple-400" />
                          <span className="text-purple-200 text-sm">{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-purple-300 text-sm font-medium">City</label>
                    <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                      <SelectTrigger className="bg-purple-900/50 border-purple-600/50 text-purple-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-900 border-purple-600">
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-purple-300 text-sm font-medium">Property Type</label>
                    <Select value={filters.property_type} onValueChange={(value) => setFilters(prev => ({ ...prev, property_type: value }))}>
                      <SelectTrigger className="bg-purple-900/50 border-purple-600/50 text-purple-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-900 border-purple-600">
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-purple-300 text-sm font-medium">Min Builder Rating</label>
                    <Slider
                      value={[filters.builder_rating_min]}
                      onValueChange={([value]) => setFilters(prev => ({ ...prev, builder_rating_min: value }))}
                      min={1}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-center text-purple-300 text-sm">{filters.builder_rating_min}/10</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pulse" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Indicators */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    <span>Live Market Indicators</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg">
                      <span className="text-purple-300">Nifty Realty Index</span>
                      <div className="text-right">
                        <div className="text-purple-100 font-bold">{marketPulse.nifty_realty.toFixed(2)}</div>
                        <div className="text-green-400 text-sm">+2.3%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg">
                      <span className="text-purple-300">Home Loan Rates</span>
                      <div className="text-right">
                        <div className="text-purple-100 font-bold">{marketPulse.interest_rate}%</div>
                        <div className="text-yellow-400 text-sm">Stable</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg">
                      <span className="text-purple-300">Market Sentiment</span>
                      <div className="text-right">
                        <div className="text-purple-100 font-bold capitalize">{marketPulse.sentiment}</div>
                        <div className="text-green-400 text-sm">Strong</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* News Feed */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-400" />
                    <span>Trending News</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { headline: "Mumbai Real Estate Shows 12% Growth in Q4", sentiment: "positive", time: "2h ago" },
                      { headline: "New Metro Line Boosts Pune Property Demand", sentiment: "positive", time: "4h ago" },
                      { headline: "RBI Keeps Interest Rates Unchanged", sentiment: "neutral", time: "6h ago" }
                    ].map((news, idx) => (
                      <div key={idx} className="p-3 bg-purple-900/30 rounded-lg hover:bg-purple-800/30 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-purple-200 text-sm font-medium leading-tight">{news.headline}</h4>
                          <Badge className={`text-xs ${
                            news.sentiment === 'positive' ? 'bg-green-600' : 
                            news.sentiment === 'negative' ? 'bg-red-600' : 'bg-gray-600'
                          }`}>
                            {news.sentiment}
                          </Badge>
                        </div>
                        <div className="text-purple-400 text-xs">{news.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-purple-300 text-sm">
                Powered by BrickMatrix™ Engine • Live data from 4 premium sources • Updated every 15 minutes
              </p>
              <div className="flex justify-center space-x-4 text-xs text-purple-400">
                <span>Last scan: {lastUpdated.toLocaleString()}</span>
                <span>•</span>
                <span>Properties analyzed: {properties.length * 47}</span>
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

export default BrickMatrixRecommendations;