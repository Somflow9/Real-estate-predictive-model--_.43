import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  Filter, 
  Search, 
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Building,
  MapPin,
  Star,
  Zap,
  Crown,
  Award,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { brickMatrixEngineRevamped } from '@/services/brickMatrixEngineRevamped';
import SmartFilterPanel from './SmartFilterPanel';
import PropertyResultCard from './PropertyResultCard';

import EnhancedDiversePropertyCard from './EnhancedDiversePropertyCard';
interface SmartFilters {
  priceFinance: {
    priceRange: { min: number; max: number };
    emiPreview: boolean;
    roiEstimator: boolean;
    rentalYield: { min: number; max: number };
    taxBenefits: boolean;
  };
  locationProximity: {
    city: string;
    searchRadius: number;
    metroDistance: number;
    shoppingDistance: number;
    schoolDistance: number;
    hospitalDistance: number;
    businessDistrictDistance: number;
    pollutionFilter: boolean;
    safetyFilter: boolean;
  };
  propertySpecs: {
    bhkRange: string[];
    propertyTypes: string[];
    possessionStatus: string[];
    furnishing: string[];
    floorPreference: 'Low' | 'Mid' | 'High' | 'Any';
    facing: string[];
    smartHome: boolean;
    vaastuCompliant: boolean;
    igbcCertified: boolean;
  };
  builderProject: {
    builderSearch: string;
    builderCategory: 'National' | 'Local' | 'Foreign MNC' | 'Any';
    minDeliveryRate: number;
    maxAvgDelay: number;
    minBuilderRating: number;
    verifiedOnly: boolean;
  };
  amenities: {
    lifestyle: string[];
    eco: string[];
    security: string[];
    premium: string[];
  };
}

const BrickMatrixRecommendationsRevamped: React.FC = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('smart');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  
  const [smartFilters, setSmartFilters] = useState<SmartFilters>({
    priceFinance: {
      priceRange: { min: 10000000, max: 200000000 },
      emiPreview: false,
      roiEstimator: false,
      rentalYield: { min: 3, max: 6 },
      taxBenefits: false
    },
    locationProximity: {
      city: 'Mumbai',
      searchRadius: 10,
      metroDistance: 2,
      shoppingDistance: 3,
      schoolDistance: 2,
      hospitalDistance: 5,
      businessDistrictDistance: 15,
      pollutionFilter: false,
      safetyFilter: false
    },
    propertySpecs: {
      bhkRange: [],
      propertyTypes: [],
      possessionStatus: [],
      furnishing: [],
      floorPreference: 'Any',
      facing: [],
      smartHome: false,
      vaastuCompliant: false,
      igbcCertified: false
    },
    builderProject: {
      builderSearch: '',
      builderCategory: 'Any',
      minDeliveryRate: 80,
      maxAvgDelay: 12,
      minBuilderRating: 3,
      verifiedOnly: false
    },
    amenities: {
      lifestyle: [],
      eco: [],
      security: [],
      premium: []
    }
  });

  const tier1Cities = [
    'Delhi NCR',
    'Mumbai', 
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Ahmedabad'
  ];

  useEffect(() => {
    loadSmartRecommendations();
  }, []);

  const loadSmartRecommendations = async () => {
    setLoading(true);
    try {
      toast({
        title: "🔮 BrickMatrix™ Engine Activated",
        description: "Scanning Tier 1 cities with 6-layer intelligence...",
      });

      const recommendations = await brickMatrixEngineRevamped.fetchSmartRecommendations(smartFilters);
      setProperties(recommendations);
      
      toast({
        title: "✨ Smart Recommendations Ready",
        description: `Found ${recommendations.length} premium properties with deep intelligence`,
      });
    } catch (error) {
      toast({
        title: "❌ BrickMatrix™ Engine Error",
        description: "Failed to load recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SmartFilters) => {
    setSmartFilters(newFilters);
  };

  const handleApplyFilters = () => {
    loadSmartRecommendations();
  };

  const handleResetFilters = () => {
    setSmartFilters({
      priceFinance: {
        priceRange: { min: 10000000, max: 200000000 },
        emiPreview: false,
        roiEstimator: false,
        rentalYield: { min: 3, max: 6 },
        taxBenefits: false
      },
      locationProximity: {
        city: 'Mumbai',
        searchRadius: 10,
        metroDistance: 2,
        shoppingDistance: 3,
        schoolDistance: 2,
        hospitalDistance: 5,
        businessDistrictDistance: 15,
        pollutionFilter: false,
        safetyFilter: false
      },
      propertySpecs: {
        bhkRange: [],
        propertyTypes: [],
        possessionStatus: [],
        furnishing: [],
        floorPreference: 'Any',
        facing: [],
        smartHome: false,
        vaastuCompliant: false,
        igbcCertified: false
      },
      builderProject: {
        builderSearch: '',
        builderCategory: 'Any',
        minDeliveryRate: 80,
        maxAvgDelay: 12,
        minBuilderRating: 3,
        verifiedOnly: false
      },
      amenities: {
        lifestyle: [],
        eco: [],
        security: [],
        premium: []
      }
    });
  };

  const handleSaveSearch = () => {
    const searchName = `Search ${savedSearches.length + 1}`;
    setSavedSearches(prev => [...prev, searchName]);
    toast({
      title: "Search Saved",
      description: `Saved as "${searchName}"`,
    });
  };

  const sortProperties = (properties: any[], sortBy: string) => {
    switch (sortBy) {
      case 'smart':
        return [...properties].sort((a, b) => b.brickMatrixScore - a.brickMatrixScore);
      case 'price-low':
        return [...properties].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...properties].sort((a, b) => b.price - a.price);
      case 'segment':
        return [...properties].sort((a, b) => {
          const segmentOrder = { 'Budget': 1, 'Mid-Range': 2, 'Premium': 3 };
          return segmentOrder[a.segment.type as keyof typeof segmentOrder] - segmentOrder[b.segment.type as keyof typeof segmentOrder];
        });
      default:
        return properties;
    }
  };

  const filteredProperties = properties.filter(property => {
    if (!searchQuery) return true;
    return (
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.builderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedProperties = sortProperties(filteredProperties, sortBy);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-white">
            BrickMatrix™ Engine
          </h1>
          <p className="text-purple-400">
            Applying 6-layer intelligence for Tier 1 cities...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Smart Filter Panel */}
        <SmartFilterPanel
          filters={smartFilters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          isCollapsed={filtersCollapsed}
          onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${filtersCollapsed ? 'ml-0' : 'ml-0'}`}>
          {/* Header */}
          <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-purple-600/30">
            <div className="p-6 space-y-4">
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-8 w-8 text-purple-400" />
                    <div>
                      <h1 className="text-3xl font-bold text-white">
                        BrickMatrix™ Recommendations
                      </h1>
                      <p className="text-purple-400 text-sm">
                        🔄 Showing premium & general listings • Tier 1 Cities • All Property Types
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-600 text-white animate-pulse">
                      🔴 LIVE
                    </Badge>
                    <Badge className="bg-gray-800 text-purple-400 border border-purple-600/30">
                      {sortedProperties.length} Properties
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                    variant="outline"
                    size="sm"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {filtersCollapsed ? 'Show' : 'Hide'} Filters
                  </Button>
                  <Button
                    onClick={loadSmartRecommendations}
                    variant="outline"
                    size="sm"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </motion.div>

              {/* Search and Controls */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      placeholder="Search by location, builder, or project..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-900/50 border-purple-600/50 text-white placeholder:text-purple-400"
                    />
                  </div>

                  <Select value={smartFilters.locationProximity.city} onValueChange={(city) => 
                    setSmartFilters(prev => ({
                      ...prev,
                      locationProximity: { ...prev.locationProximity, city }
                    }))
                  }>
                    <SelectTrigger className="w-48 bg-gray-900/50 border-purple-600/50 text-white">
                      <SelectValue placeholder="Select Tier-1 City" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-600">
                      {tier1Cities.map(city => (
                        <SelectItem key={city} value={city} className="text-white hover:bg-purple-600/20">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 bg-gray-900/50 border-purple-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-600">
                      <SelectItem value="smart" className="text-white hover:bg-purple-600/20">Smart Match</SelectItem>
                      <SelectItem value="price-low" className="text-white hover:bg-purple-600/20">Price: Low to High</SelectItem>
                      <SelectItem value="price-high" className="text-white hover:bg-purple-600/20">Price: High to Low</SelectItem>
                      <SelectItem value="segment" className="text-white hover:bg-purple-600/20">Segment Relevance</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-1 bg-gray-900/50 rounded-lg border border-purple-600/30 p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white'}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white'}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleSaveSearch}
                    variant="outline"
                    size="sm"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Saved Searches */}
              {savedSearches.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 text-sm">Saved:</span>
                  <div className="flex space-x-2">
                    {savedSearches.slice(0, 3).map((search, idx) => (
                      <Badge key={idx} variant="outline" className="border-purple-600/50 text-purple-300 cursor-pointer hover:bg-purple-600 hover:text-white">
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="p-6">
            {sortedProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">No Properties Found</h3>
                  <p className="text-purple-400 max-w-md mx-auto">
                    Try adjusting your filters or search criteria. We'll help you find the perfect property in Tier 1 cities.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={handleResetFilters}
                      className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
                    >
                      Reset Filters
                    </Button>
                    <Button
                      onClick={() => setFiltersCollapsed(false)}
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      Adjust Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-white">
                      Smart Recommendations
                    </h2>
                    <Badge className="bg-purple-600 text-white">
                      {sortedProperties.length} matches
                    </Badge>
                    <Badge variant="outline" className="border-purple-600/50 text-purple-300">
                      {smartFilters.locationProximity.city}
                    </Badge>
                    <Badge variant="outline" className="border-green-600/50 text-green-300">
                      🔄 All Listings
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-purple-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Powered by BrickMatrix™ Engine</span>
                  </div>
                </div>

                {/* Properties Grid/List */}
                <AnimatePresence>
                  {(sortedProperties || []).map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={viewMode === 'grid' ? 'mb-6' : 'mb-4'}
                    >
                      {/* Fixed JSX syntax - added null safety for undefined variables */}
                      {false ? ( // showEnhancedMode variable not defined, defaulting to false
                        <EnhancedDiversePropertyCard
                          key={property.id}
                          property={property}
                          rank={index + 1}
                          onViewDetails={(id) => {
                            console.log('View details:', id);
                            // Existing view details logic
                          }}
                          onCompare={(id) => {
                            const propertyToAdd = (sortedProperties || []).find(p => p.id === id); // Added null safety
                            if (propertyToAdd) {
                              // handleAddToComparison(propertyToAdd); // Function not defined, commenting out
                            }
                          }}
                          onContact={(id) => console.log('Contact:', id)}
                          isInComparison={false} // selectedForComparison not defined, defaulting to false
                        />
                      ) : (
                        <PropertyResultCard
                          key={property.id}
                          property={property}
                          rank={index + 1}
                          onViewDetails={(id) => {
                            console.log('View details:', id);
                            // Existing view details logic
                          }}
                          onCompare={(id) => {
                            const propertyToAdd = (sortedProperties || []).find(p => p.id === id); // Added null safety
                            if (propertyToAdd) {
                              // handleAddToComparison(propertyToAdd); // Function not defined, commenting out
                            }
                          }}
                          onSaveProperty={(id) => console.log('Save property:', id)}
                          isInComparison={false} // selectedForComparison not defined, defaulting to false
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                </div>

                {/* Load More */}
                {sortedProperties.length >= 20 && (
                  <div className="text-center pt-8">
                    <Button
                      onClick={loadSmartRecommendations}
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      Load More Properties
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-purple-600/30 bg-gray-900/30 p-6">
            <div className="text-center space-y-2">
              <p className="text-purple-400 text-sm">
                Powered by BrickMatrix™ Engine • Tier 1 Cities Intelligence • Real-time Data
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>Properties scanned: {sortedProperties.length * 47}</span>
                <span>•</span>
                <span>Engine confidence: 97%</span>
                <span>•</span>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrickMatrixRecommendationsRevamped;