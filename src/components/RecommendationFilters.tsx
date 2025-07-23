import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Filter, 
  MapPin, 
  Home, 
  DollarSign, 
  Building, 
  Star,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationFiltersProps {
  onFiltersChange: (filters: any) => void;
  onRefresh: () => void;
  isLoading: boolean;
  cityTier: 1 | 2 | 3;
}

const RecommendationFilters = ({ 
  onFiltersChange, 
  onRefresh, 
  isLoading, 
  cityTier 
}: RecommendationFiltersProps) => {
  const [filters, setFilters] = useState({
    budget: { min: 20, max: 200 },
    city: 'Mumbai',
    locality: '',
    bhk: 'Any',
    propertyType: 'Any',
    builderType: 'Any',
    amenities: [] as string[],
    readyToMove: false,
    reraApproved: true,
    newLaunch: false,
    priceRange: 'Any',
    sortBy: 'ai_score'
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const tier1Cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Gurgaon'];
  const tier2Cities = ['Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane'];
  const tier3Cities = ['Dehradun', 'Nashik', 'Kochi', 'Trichy', 'Mysore', 'Coimbatore', 'Vijayawada'];

  const bhkOptions = ['Any', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'];
  const propertyTypes = {
    1: ['Any', 'Apartment', 'Studio', 'Penthouse', 'Serviced Apartment'],
    2: ['Any', 'Apartment', 'Villa', 'Independent House', 'Row House'],
    3: ['Any', 'Villa', 'Independent House', 'Plot', 'Farm House', 'Bungalow']
  };

  const builderTypes = ['Any', 'Premium (DLF, Godrej)', 'Mid-Segment', 'Local Builders', 'Government'];
  const amenitiesList = [
    'Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Power Backup',
    'Parking', 'Garden', 'Children Play Area', 'Lift', 'CCTV'
  ];

  const sortOptions = [
    { value: 'ai_score', label: 'AI Recommendation Score' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'area_large', label: 'Area: Largest First' },
    { value: 'newest', label: 'Newest Listings' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);

    // Track active filters for display
    updateActiveFilters(newFilters);
  };

  const handleBudgetChange = (values: number[]) => {
    const newFilters = { ...filters, budget: { min: values[0], max: values[1] } };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const updateActiveFilters = (currentFilters: any) => {
    const active: string[] = [];
    
    if (currentFilters.bhk !== 'Any') active.push(`${currentFilters.bhk}`);
    if (currentFilters.propertyType !== 'Any') active.push(currentFilters.propertyType);
    if (currentFilters.builderType !== 'Any') active.push(currentFilters.builderType);
    if (currentFilters.readyToMove) active.push('Ready to Move');
    if (currentFilters.newLaunch) active.push('New Launch');
    if (currentFilters.amenities.length > 0) active.push(`${currentFilters.amenities.length} Amenities`);
    
    setActiveFilters(active);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      budget: { min: 20, max: 200 },
      city: filters.city,
      locality: '',
      bhk: 'Any',
      propertyType: 'Any',
      builderType: 'Any',
      amenities: [],
      readyToMove: false,
      reraApproved: true,
      newLaunch: false,
      priceRange: 'Any',
      sortBy: 'ai_score'
    };
    setFilters(defaultFilters);
    setActiveFilters([]);
    onFiltersChange(defaultFilters);
  };

  const getCitiesForTier = () => {
    switch (cityTier) {
      case 1: return tier1Cities;
      case 2: return tier2Cities;
      case 3: return tier3Cities;
      default: return tier1Cities;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glassmorphism glow-border shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <span>Smart Filters</span>
              <Badge variant="outline" className="ml-2">
                Tier {cityTier} Cities
              </Badge>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={onRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              {activeFilters.length > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="animate-fade-in">
                  {filter}
                </Badge>
              ))}
            </div>
          )}

          {/* Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>Budget (₹ Lakhs)</span>
              </Label>
              <div className="px-3">
                <Slider
                  value={[filters.budget.min, filters.budget.max]}
                  onValueChange={handleBudgetChange}
                  max={500}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹{filters.budget.min}L</span>
                  <span>₹{filters.budget.max}L</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>City</span>
              </Label>
              <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getCitiesForTier().map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>BHK</span>
              </Label>
              <Select value={filters.bhk} onValueChange={(value) => handleFilterChange('bhk', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bhkOptions.map(bhk => (
                    <SelectItem key={bhk} value={bhk}>{bhk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>Property Type</span>
              </Label>
              <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes[cityTier].map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Locality (Optional)</Label>
              <Input
                placeholder="e.g., Bandra, Koramangala"
                value={filters.locality}
                onChange={(e) => handleFilterChange('locality', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Builder Type</span>
              </Label>
              <Select value={filters.builderType} onValueChange={(value) => handleFilterChange('builderType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {builderTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Sort By</span>
              </Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.readyToMove}
                onCheckedChange={(checked) => handleFilterChange('readyToMove', checked)}
              />
              <Label className="text-sm">Ready to Move</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.reraApproved}
                onCheckedChange={(checked) => handleFilterChange('reraApproved', checked)}
              />
              <Label className="text-sm">RERA Approved</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.newLaunch}
                onCheckedChange={(checked) => handleFilterChange('newLaunch', checked)}
              />
              <Label className="text-sm">New Launch</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-accent" />
              <Label className="text-sm font-medium">AI Powered</Label>
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preferred Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">AI Recommendation Engine</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Our AI analyzes 50+ factors including location intelligence, builder credibility, 
              price trends, and market dynamics to provide personalized recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationFilters;