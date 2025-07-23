import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Crown,
  Award,
  Clock,
  DollarSign,
  BarChart3,
  TrendingDown,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { brickMatrixEngineService } from '@/services/brickMatrixEngineService';
import EnhancedRecommendationFilters from './EnhancedRecommendationFilters';

interface EnhancedBrickMatrixProperty {
  id: string;
  city: string;
  locality: string;
  builder: string;
  projectName: string;
  price: number;
  pricePerSqft: number;
  area: number;
  bhk: string;
  status: string;
  amenities: string[];
  locationIntelligence: any;
  builderCredibility: any;
  priceTrends: any;
  userAlignment: number;
  enhancedFeatures: {
    virtualTour: boolean;
    droneView: boolean;
    aiFloorPlan: boolean;
    smartHomeReady: boolean;
  };
  brickMatrixScore: number;
  recommendation: {
    action: string;
    confidence: number;
    reasoning: string;
  };
  badges: string[];
  detailedScoring: {
    locationScore: number;
    builderScore: number;
    priceScore: number;
    userAlignmentScore: number;
    futureProspectScore: number;
  };
}

interface LegacyBrickMatrixProperty {
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

interface EnhancedFilters {
  locationFilters: {
    pincode: string;
    neighborhood: string;
    walkScore: number;
    transitScore: number;
    distanceFromWork: number;
    proximityRadius: number;
    noiseLevel: number;
    floodProneZone: boolean;
  };
  financialFilters: {
    priceRange: { min: number; max: number };
    areaAvgComparison: boolean;
    emiCalculator: {
      enabled: boolean;
      interestRate: number;
      tenure: number;
    };
    rentVsBuy: boolean;
    subsidyAvailable: boolean;
  };
  propertyTypeFilters: {
    bhkRange: string[];
    propertyType: string[];
    listingType: 'builder' | 'owner' | 'both';
    reraApproved: boolean;
    greenCertified: boolean;
    carpetAreaRange: { min: number; max: number };
    builtUpAreaRange: { min: number; max: number };
  };
  amenityFilters: {
    lifestyle: string[];
    eco: string[];
    security: string[];
    premium: string[];
  };
  ratingsFilters: {
    propertyScore: number;
    builderReputation: number;
    projectRatings: number;
    localityLivability: number;
    verifiedReviews: boolean;
  };
  neighborhoodFilters: {
    shoppingDistance: number;
    schoolDistance: number;
    hospitalDistance: number;
    transportDistance: number;
    crimeZoneOverlay: boolean;
  };
}

const BrickMatrixRecommendations = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<EnhancedBrickMatrixProperty[]>([]);
  const [legacyProperties, setLegacyProperties] = useState<LegacyBrickMatrixProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('recommendations');
  const [enhancedMode, setEnhancedMode] = useState(true);
  
  const [enhancedFilters, setEnhancedFilters] = useState<EnhancedFilters>({
    locationFilters: {
      pincode: '',
      neighborhood: 'Mumbai',
      walkScore: 70,
      transitScore: 70,
      distanceFromWork: 10,
      proximityRadius: 5,
      noiseLevel: 50,
      floodProneZone: false
    },
    financialFilters: {
      priceRange: { min: 5000000, max: 100000000 },
      areaAvgComparison: false,
      emiCalculator: {
        enabled: false,
        interestRate: 8.75,
        tenure: 20
      },
      rentVsBuy: false,
      subsidyAvailable: false
    },
    propertyTypeFilters: {
      bhkRange: [],
      propertyType: [],
      listingType: 'both',
      reraApproved: false,
      greenCertified: false,
      carpetAreaRange: { min: 500, max: 3000 },
      builtUpAreaRange: { min: 600, max: 4000 }
    },
    amenityFilters: {
      lifestyle: [],
      eco: [],
      security: [],
      premium: []
    },
    ratingsFilters: {
      propertyScore: 7,
      builderReputation: 7,
      projectRatings: 7,
      localityLivability: 7,
      verifiedReviews: false
    },
    neighborhoodFilters: {
      shoppingDistance: 5,
      schoolDistance: 3,
      hospitalDistance: 5,
      transportDistance: 2,
      crimeZoneOverlay: false
    }
  });

  const [marketPulse, setMarketPulse] = useState({
    sentiment: 'bullish',
    nifty_realty: 485.60,
    interest_rate: 8.75,
    trending_news: [],
    tier1_performance: {} as Record<string, number>
  });

  const tier1Cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];

  useEffect(() => {
    if (enhancedMode) {
      loadEnhancedBrickMatrixRecommendations();
    } else {
      loadLegacyBrickMatrixRecommendations();
    }
    const interval = setInterval(refreshMarketPulse, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [enhancedFilters, enhancedMode]);

  const loadEnhancedBrickMatrixRecommendations = async () => {
    setLoading(true);
    try {
      toast({
        title: "🔮 BrickMatrix™ Engine Activated",
        description: "Enhanced scanning with real-time intelligence across Tier 1 cities...",
      });

      const enhancedProperties = await brickMatrixEngineService.fetchEnhancedRecommendations(enhancedFilters);
      
      setProperties(enhancedProperties);
      setLastUpdated(new Date());
      
      toast({
        title: "✨ BrickMatrix™ Analysis Complete",
        description: `Found ${enhancedProperties.length} premium properties with enhanced intelligence`,
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

  const loadLegacyBrickMatrixRecommendations = async () => {
    setLoading(true);
    try {
      toast({
        title: "🔮 BrickMatrix™ Engine Activated",
        description: "Loading legacy recommendations...",
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockProperties = generateLegacyMockProperties();
      setLegacyProperties(mockProperties);
      setLastUpdated(new Date());
      
      toast({
        title: "✨ BrickMatrix™ Analysis Complete",
        description: `Found ${mockProperties.length} properties with legacy scoring`,
      });
    } catch (error) {
      toast({
        title: "❌ BrickMatrix™ Error",
        description: "Failed to load legacy recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMarketPulse = async () => {
    // Enhanced market pulse refresh for Tier 1 cities
    setMarketPulse(prev => ({
      ...prev,
      nifty_realty: prev.nifty_realty + (Math.random() - 0.5) * 10,
      interest_rate: 8.75 + (Math.random() - 0.5) * 0.5,
      tier1_performance: tier1Cities.reduce((acc, city) => {
        acc[city] = Math.round((Math.random() * 20 + 80) * 10) / 10;
        return acc;
      }, {} as Record<string, number>)
    }));
  };

  const generateLegacyMockProperties = (): LegacyBrickMatrixProperty[] => {
    const builders = ['Lodha Group', 'DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group'];
    const localities = {
      Mumbai: ['Bandra West', 'Powai', 'Lower Parel', 'Worli', 'Andheri West'],
      Delhi: ['Gurgaon', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj'],
      Bangalore: ['Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Indiranagar']
    };

    return Array.from({ length: 12 }, (_, i) => {
      const city = tier1Cities[Math.floor(Math.random() * tier1Cities.length)];
      const builder = builders[Math.floor(Math.random() * builders.length)];
      const locality = localities[city as keyof typeof localities]?.[Math.floor(Math.random() * 5)] || 'Central Area';
      
      return {
        id: `bm_legacy_${Date.now()}_${i}`,
        location_intelligence: {
          city,
          tier: 1,
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
        buyer_preferences: {}
      };
    });
  };

  const handleEnhancedFiltersChange = (newFilters: EnhancedFilters) => {
    setEnhancedFilters(newFilters);
  };

  const handleApplyFilters = () => {
    if (enhancedMode) {
      loadEnhancedBrickMatrixRecommendations();
    } else {
      loadLegacyBrickMatrixRecommendations();
    }
  };

  const handleResetFilters = () => {
    setEnhancedFilters({
      locationFilters: {
        pincode: '',
        neighborhood: 'Mumbai',
        walkScore: 70,
        transitScore: 70,
        distanceFromWork: 10,
        proximityRadius: 5,
        noiseLevel: 50,
        floodProneZone: false
      },
      financialFilters: {
        priceRange: { min: 5000000, max: 100000000 },
        areaAvgComparison: false,
        emiCalculator: {
          enabled: false,
          interestRate: 8.75,
          tenure: 20
        },
        rentVsBuy: false,
        subsidyAvailable: false
      },
      propertyTypeFilters: {
        bhkRange: [],
        propertyType: [],
        listingType: 'both',
        reraApproved: false,
        greenCertified: false,
        carpetAreaRange: { min: 500, max: 3000 },
        builtUpAreaRange: { min: 600, max: 4000 }
      },
      amenityFilters: {
        lifestyle: [],
        eco: [],
        security: [],
        premium: []
      },
      ratingsFilters: {
        propertyScore: 7,
        builderReputation: 7,
        projectRatings: 7,
        localityLivability: 7,
        verifiedReviews: false
      },
      neighborhoodFilters: {
        shoppingDistance: 5,
        schoolDistance: 3,
        hospitalDistance: 5,
        transportDistance: 2,
        crimeZoneOverlay: false
      }
    });
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
      case 'consider': return 'bg-gradient-to-r from-blue-600 to-blue-400';
      case 'hold': return 'bg-gradient-to-r from-gray-600 to-gray-400';
      case 'wait': return 'bg-gradient-to-r from-orange-600 to-orange-400';
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
          <p className="text-purple-200">
            {enhancedMode ? 'Enhanced intelligence analysis for Tier 1 cities...' : 'Analyzing premium properties with legacy intelligence...'}
          </p>
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
                {enhancedMode ? 'Enhanced Intelligence • Tier 1 Cities • Real-time Analytics' : 'Premium Intelligence • Live Market Data • Legacy Scoring'}
              </p>
            </div>
          </div>

          {/* Enhanced Market Pulse for Tier 1 Cities */}
          <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
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
                  <BarChart3 className="h-6 w-6 mx-auto text-purple-400" />
                  <div className="text-sm text-purple-300">Tier 1 Performance</div>
                  <div className="text-2xl font-bold text-purple-100">
                    {Object.keys(marketPulse.tier1_performance).length || 8}
                  </div>
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
                {enhancedMode ? 'Enhanced Filters' : 'Smart Filters'}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Activity className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setEnhancedMode(!enhancedMode)}
                variant="outline"
                size="sm"
                className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
              >
                {enhancedMode ? 'Enhanced Mode' : 'Legacy Mode'}
              </Button>
              <Badge className="bg-purple-600 text-white animate-pulse">
                🔴 LIVE
              </Badge>
              <Button
                onClick={enhancedMode ? loadEnhancedBrickMatrixRecommendations : loadLegacyBrickMatrixRecommendations}
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
            {/* Enhanced Properties Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {(enhancedMode ? properties : legacyProperties).map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {enhancedMode ? (
                      <EnhancedPropertyCard property={property as EnhancedBrickMatrixProperty} />
                    ) : (
                      <LegacyPropertyCard property={property as LegacyBrickMatrixProperty} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            {enhancedMode ? (
              <EnhancedRecommendationFilters
                filters={enhancedFilters}
                onFiltersChange={handleEnhancedFiltersChange}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <LegacyFiltersCard />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tier 1 Cities Performance */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    <span>Tier 1 Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {tier1Cities.map((city, index) => (
                      <div key={city} className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg">
                        <span className="text-purple-300">{city}</span>
                        <div className="text-right">
                          <div className="text-purple-100 font-bold">
                            {marketPulse.tier1_performance[city]?.toFixed(1) || (85 + index * 2).toFixed(1)}
                          </div>
                          <div className={`text-sm ${Math.random() > 0.3 ? 'text-green-400' : 'text-red-400'}`}>
                            {Math.random() > 0.3 ? '+' : '-'}{(Math.random() * 5).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Analytics */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <span>BrickMatrix™ Analytics Dashboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="text-purple-200 font-semibold">Market Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">Avg. BrickMatrix™ Score</span>
                          <span className="text-purple-100 font-bold">8.4/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">Properties Analyzed</span>
                          <span className="text-purple-100 font-bold">{enhancedMode ? properties.length : legacyProperties.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">Strong Buy Recommendations</span>
                          <span className="text-green-400 font-bold">
                            {enhancedMode 
                              ? properties.filter(p => p.recommendation.action === 'strong_buy').length
                              : legacyProperties.filter(p => p.brickmatrix_scoring.ai_recommendation.action === 'strong_buy').length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-purple-200 font-semibold">Filter Analytics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">Active Filters</span>
                          <span className="text-purple-100 font-bold">
                            {enhancedMode 
                              ? Object.values(enhancedFilters.amenityFilters).flat().length + enhancedFilters.propertyTypeFilters.bhkRange.length
                              : 0
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">Price Range</span>
                          <span className="text-purple-100 font-bold text-xs">
                            {enhancedMode 
                              ? `₹${(enhancedFilters.financialFilters.priceRange.min / 10000000).toFixed(1)}Cr - ₹${(enhancedFilters.financialFilters.priceRange.max / 10000000).toFixed(1)}Cr`
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 text-sm">Target City</span>
                          <span className="text-purple-100 font-bold">
                            {enhancedMode ? enhancedFilters.locationFilters.neighborhood : 'All Tier 1'}
                          </span>
                        </div>
                      </div>
                    </div>
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
                Powered by BrickMatrix™ Engine • {enhancedMode ? 'Enhanced Intelligence for Tier 1 Cities' : 'Legacy Intelligence System'} • Updated every 15 minutes
              </p>
              <div className="flex justify-center space-x-4 text-xs text-purple-400">
                <span>Last scan: {lastUpdated.toLocaleString()}</span>
                <span>•</span>
                <span>Properties analyzed: {(enhancedMode ? properties.length : legacyProperties.length) * 47}</span>
                <span>•</span>
                <span>Engine confidence: {enhancedMode ? '97%' : '94%'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Property Card Component
const EnhancedPropertyCard: React.FC<{ property: EnhancedBrickMatrixProperty }> = ({ property }) => {
  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-green-400';
    if (score >= 8.0) return 'text-purple-400';
    if (score >= 7.0) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'strong_buy': return 'bg-gradient-to-r from-green-600 to-green-400';
      case 'buy': return 'bg-gradient-to-r from-purple-600 to-purple-400';
      case 'consider': return 'bg-gradient-to-r from-blue-600 to-blue-400';
      case 'wait': return 'bg-gradient-to-r from-orange-600 to-orange-400';
      default: return 'bg-gradient-to-r from-purple-600 to-purple-400';
    }
  };

  return (
    <Card className="group bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
      {/* Enhanced Header */}
      <div className="relative p-6 pb-0">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-purple-100 group-hover:text-white transition-colors">
              {property.projectName}
            </h3>
            <p className="text-purple-300 text-sm">{property.locality}, {property.city}</p>
            <p className="text-purple-400 text-xs">{property.builder}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(property.brickMatrixScore)}`}>
              {property.brickMatrixScore}
            </div>
            <div className="text-xs text-purple-400">BrickMatrix™ Score</div>
          </div>
        </div>

        {/* Enhanced Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.badges.map((badge, idx) => (
            <Badge key={idx} className="bg-purple-600/80 text-white text-xs">
              {badge}
            </Badge>
          ))}
          {property.enhancedFeatures.smartHomeReady && (
            <Badge className="bg-blue-600/80 text-white text-xs">Smart Home</Badge>
          )}
          {property.enhancedFeatures.virtualTour && (
            <Badge className="bg-green-600/80 text-white text-xs">Virtual Tour</Badge>
          )}
        </div>
      </div>

      <CardContent className="space-y-4">
        {/* Enhanced Price Information */}
        <div className="bg-purple-900/30 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-300 text-sm">Total Price</span>
            <span className="text-purple-400 text-sm">₹{property.pricePerSqft.toLocaleString()}/sq ft</span>
          </div>
          <div className="text-2xl font-bold text-purple-100">
            ₹{(property.price / 10000000).toFixed(1)}Cr
          </div>
          <div className="text-sm text-purple-300 mt-1">
            {property.area} sq ft • {property.bhk} • {property.status}
          </div>
        </div>

        {/* Enhanced Scoring Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Location</span>
              <span className="text-purple-200">{property.detailedScoring.locationScore.toFixed(1)}/10</span>
            </div>
            <Progress 
              value={property.detailedScoring.locationScore * 10} 
              className="h-2 bg-purple-900/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Builder</span>
              <span className="text-purple-200">{property.detailedScoring.builderScore.toFixed(1)}/10</span>
            </div>
            <Progress 
              value={property.detailedScoring.builderScore * 10} 
              className="h-2 bg-purple-900/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Price Value</span>
              <span className="text-purple-200">{property.detailedScoring.priceScore.toFixed(1)}/10</span>
            </div>
            <Progress 
              value={property.detailedScoring.priceScore * 10} 
              className="h-2 bg-purple-900/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Future Prospect</span>
              <span className="text-purple-200">{property.detailedScoring.futureProspectScore.toFixed(1)}/10</span>
            </div>
            <Progress 
              value={property.detailedScoring.futureProspectScore * 10} 
              className="h-2 bg-purple-900/50"
            />
          </div>
        </div>

        {/* Enhanced Recommendation */}
        <div className={`p-4 rounded-lg ${getActionColor(property.recommendation.action)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm uppercase">
              {property.recommendation.action.replace('_', ' ')}
            </span>
            <span className="text-white text-sm">
              {property.recommendation.confidence}% Confidence
            </span>
          </div>
          <p className="text-white/90 text-xs">
            {property.recommendation.reasoning}
          </p>
        </div>

        {/* Enhanced Action Buttons */}
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
  );
};

// Legacy Property Card Component
const LegacyPropertyCard: React.FC<{ property: LegacyBrickMatrixProperty }> = ({ property }) => {
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

  return (
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

        {/* Legacy Recommendation */}
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
  );
};

// Legacy Filters Component
const LegacyFiltersCard = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-purple-100 flex items-center space-x-2">
          <Filter className="h-5 w-5 text-purple-400" />
          <span>BrickMatrix™ Legacy Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-purple-300">
          <p>Legacy filter interface</p>
          <p className="text-sm mt-2">Switch to Enhanced Mode for advanced filtering options</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrickMatrixRecommendations;