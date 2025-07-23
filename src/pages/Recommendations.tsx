import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Sparkles, RefreshCw, Clock, Building, Zap, Target, Award } from 'lucide-react';
import { Property } from '@/types/property';
import { realTimePropertyService } from '@/services/realTimePropertyService';
import { useToast } from '@/hooks/use-toast';
import { tierCityService } from '@/services/tierCityService';
import PremiumRecommendationCard from '@/components/PremiumRecommendationCard';
import RecommendationFilters from '@/components/RecommendationFilters';
import { motion } from 'framer-motion';

const Recommendations = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    budget: { min: 20, max: 200 },
    location: 'Mumbai',
    bhk: 'Any',
    propertyType: 'Any'
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get city tier information
  const cityData = tierCityService.getCityData(filters.location);
  const cityTier = cityData?.tier || 2;
  
  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['premium-recommendations', filters],
    queryFn: () => realTimePropertyService.fetchRealTimeProperties({
      city: filters.location,
      budget: { min: filters.budget.min * 100000, max: filters.budget.max * 100000 },
      bhk: filters.bhk === 'Any' ? undefined : filters.bhk,
      propertyType: filters.propertyType === 'Any' ? undefined : filters.propertyType
    }),
    refetchInterval: 3 * 60 * 1000, // Auto-refresh every 3 minutes
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Live Data Refreshed",
        description: "Latest property listings from all sources have been loaded.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to fetch latest data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDataSourcesInfo = () => {
    const sources = ['MagicBricks', '99acres', 'Housing.com', 'NoBroker'];
    const totalProperties = recommendations?.length || 0;
    return { sources, totalProperties };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Building className="h-12 w-12 mx-auto text-primary" />
            </motion.div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">AI is analyzing properties...</p>
            <p className="text-muted-foreground">Fetching live data from MagicBricks, 99acres, Housing.com & NoBroker</p>
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <Building className="h-10 w-10 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PropGyan Recommendations
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          AI-powered property insights from 99acres, NoBroker & trusted sources
        </p>
      </div>

      {/* Enhanced Recommendation Bar */}
      <EnhancedRecommendationBar 
        city={preferences.location}
        tier={cityTier}
        preferences={preferences}
      />
      {/* Enhanced Preferences Card */}
      <Card className="glow-border shadow-lg hover:shadow-xl transition-shadow glassmorphism">
        <CardHeader className="glassmorphism">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground">Your Preferences</CardTitle>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform glow-border"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Budget (₹ Lakhs)</label>
              <Slider
                value={[preferences.budget]}
                onValueCommit={(value) => handlePreferenceChange('budget', value[0])}
                onValueChange={(value) => handleSliderChange('budget', value[0])}
                max={500}
                min={20}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">₹{preferences.budget}L</div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Select value={preferences.location} onValueChange={(value) => handlePreferenceChange('location', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select value={preferences.propertyType} onValueChange={(value) => handlePreferenceChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Minimum Bedrooms</label>
            <Slider
              value={[preferences.minBedrooms]}
              onValueCommit={(value) => handlePreferenceChange('minBedrooms', value[0])}
              onValueChange={(value) => handleSliderChange('minBedrooms', value[0])}
              max={4}
              min={1}
              step={1}
              className="w-full max-w-md"
            />
            <div className="text-xs text-muted-foreground mt-1">{preferences.minBedrooms} BHK</div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Real-time Data Sources */}
      <Card className="glow-border glassmorphism">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">Live data from trusted sources:</span>
            </div>
            <div className="flex space-x-2">
              {propertyDataService.getActiveSources().map(source => (
                <Badge key={source.id} variant="secondary" className="text-xs">
                  {source.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recommendations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <Star className="h-6 w-6 text-accent fill-current" />
          <span>Top AI Recommendations ({recommendations?.length || 0})</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations?.map((property: Property, index: number) => (
            <RecommendationCard key={property.id} property={property} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RecommendationCard = ({ property, rank }: { property: Property; rank: number }) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground animate-pulse">🥇 Best Match</Badge>;
    if (rank === 2) return <Badge className="bg-gradient-to-r from-muted to-muted-foreground text-primary-foreground">🥈 Great Option</Badge>;
    if (rank === 3) return <Badge className="bg-gradient-to-r from-accent to-primary text-primary-foreground">🥉 Good Choice</Badge>;
    return <Badge variant="outline" className="glow-border">#{rank}</Badge>;
  };

  const dataInfo = getDataSourcesInfo();

  return (
    <Card className="hover:shadow-xl transition-all duration-300 glow-border hover:scale-[1.02] glassmorphism">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-primary">₹{property.price}L</CardTitle>
            <p className="text-sm text-muted-foreground">₹{property.price_per_sqft}/sq ft</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getRankBadge(rank)}
            <div className="flex items-center space-x-1 bg-accent/20 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-accent fill-current" />
              <span className="text-sm font-bold text-accent">{property.recommendation_score}/10</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary" />
      {/* Property Sources Badge */}
      <PropertySourcesBadge />
        onFiltersChange={handleFiltersChange}
      {/* Comparison Bar */}
      {selectedProperties.length > 0 && (
        <motion.div
export default Recommendations;
