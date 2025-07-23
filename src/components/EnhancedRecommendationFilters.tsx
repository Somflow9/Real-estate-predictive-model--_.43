import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  MapPin, 
  IndianRupee, 
  Home, 
  Star, 
  Shield,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Calculator,
  Zap,
  Leaf,
  Users,
  Crown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface EnhancedRecommendationFiltersProps {
  filters: EnhancedFilters;
  onFiltersChange: (filters: EnhancedFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const EnhancedRecommendationFilters: React.FC<EnhancedRecommendationFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: true,
    financial: false,
    propertyType: false,
    amenities: false,
    ratings: false,
    neighborhood: false
  });

  const [searchAmenity, setSearchAmenity] = useState('');

  const tier1Cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];

  const amenityOptions = {
    lifestyle: [
      'Swimming Pool', 'Gym', 'Clubhouse', 'Jogging Track', 'Children Play Area',
      'Indoor Games', 'Library', 'Banquet Hall', 'Multipurpose Hall', 'Yoga Deck'
    ],
    eco: [
      'Solar Panels', 'Rainwater Harvesting', 'Waste Management', 'Green Building',
      'EV Charging', 'Organic Garden', 'Energy Efficient', 'Water Treatment', 'LED Lighting'
    ],
    security: [
      '24x7 Security', 'CCTV Surveillance', 'Intercom', 'Access Control', 'Fire Safety',
      'Emergency Response', 'Visitor Management', 'Perimeter Security', 'Panic Buttons'
    ],
    premium: [
      'Concierge Service', 'Valet Parking', 'Smart Home', 'Private Elevator', 'Butler Service',
      'Wine Cellar', 'Private Garden', 'Rooftop Access', 'Home Theater', 'Spa'
    ]
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (section: keyof EnhancedFilters, updates: any) => {
    onFiltersChange({
      ...filters,
      [section]: { ...filters[section], ...updates }
    });
  };

  const toggleAmenity = (category: keyof typeof amenityOptions, amenity: string) => {
    const currentAmenities = filters.amenityFilters[category];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    updateFilters('amenityFilters', { [category]: updatedAmenities });
  };

  const filteredAmenities = (category: keyof typeof amenityOptions) => {
    return amenityOptions[category].filter(amenity =>
      amenity.toLowerCase().includes(searchAmenity.toLowerCase())
    );
  };

  const getSelectedAmenitiesCount = () => {
    return Object.values(filters.amenityFilters).flat().length;
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-purple-100 flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-400" />
              <span>BrickMatrix™ Advanced Filters</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={onApplyFilters}
                className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white"
              >
                Apply Filters
              </Button>
              <Button
                onClick={onResetFilters}
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
              >
                Reset All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Location Filters */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
        <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-800/20 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-100 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span>Location Intelligence</span>
                </CardTitle>
                {openSections.location ? <ChevronUp className="h-5 w-5 text-purple-400" /> : <ChevronDown className="h-5 w-5 text-purple-400" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">Pincode</Label>
                  <Input
                    placeholder="Enter pincode"
                    value={filters.locationFilters.pincode}
                    onChange={(e) => updateFilters('locationFilters', { pincode: e.target.value })}
                    className="bg-purple-900/50 border-purple-600/50 text-purple-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Neighborhood</Label>
                  <Select
                    value={filters.locationFilters.neighborhood}
                    onValueChange={(value) => updateFilters('locationFilters', { neighborhood: value })}
                  >
                    <SelectTrigger className="bg-purple-900/50 border-purple-600/50 text-purple-200">
                      <SelectValue placeholder="Select neighborhood" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 border-purple-600">
                      {tier1Cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Walk Score: {filters.locationFilters.walkScore}</Label>
                    <Slider
                      value={[filters.locationFilters.walkScore]}
                      onValueChange={([value]) => updateFilters('locationFilters', { walkScore: value })}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Transit Score: {filters.locationFilters.transitScore}</Label>
                    <Slider
                      value={[filters.locationFilters.transitScore]}
                      onValueChange={([value]) => updateFilters('locationFilters', { transitScore: value })}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Distance from Work (km): {filters.locationFilters.distanceFromWork}</Label>
                    <Slider
                      value={[filters.locationFilters.distanceFromWork]}
                      onValueChange={([value]) => updateFilters('locationFilters', { distanceFromWork: value })}
                      min={0}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Proximity Radius (km): {filters.locationFilters.proximityRadius}</Label>
                    <Slider
                      value={[filters.locationFilters.proximityRadius]}
                      onValueChange={([value]) => updateFilters('locationFilters', { proximityRadius: value })}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filters.locationFilters.floodProneZone}
                    onCheckedChange={(checked) => updateFilters('locationFilters', { floodProneZone: checked })}
                  />
                  <Label className="text-purple-300">Exclude Flood-Prone Zones</Label>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Financial Filters */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
        <Collapsible open={openSections.financial} onOpenChange={() => toggleSection('financial')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-800/20 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-100 flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5 text-purple-400" />
                  <span>Financial Parameters</span>
                </CardTitle>
                {openSections.financial ? <ChevronUp className="h-5 w-5 text-purple-400" /> : <ChevronDown className="h-5 w-5 text-purple-400" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">
                    Price Range: {formatPrice(filters.financialFilters.priceRange.min)} - {formatPrice(filters.financialFilters.priceRange.max)}
                  </Label>
                  <Slider
                    value={[filters.financialFilters.priceRange.min / 1000000, filters.financialFilters.priceRange.max / 1000000]}
                    onValueChange={([min, max]) => updateFilters('financialFilters', { 
                      priceRange: { min: min * 1000000, max: max * 1000000 } 
                    })}
                    min={10}
                    max={1000}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.financialFilters.areaAvgComparison}
                      onCheckedChange={(checked) => updateFilters('financialFilters', { areaAvgComparison: checked })}
                    />
                    <Label className="text-purple-300">Compare with Area Average</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.financialFilters.rentVsBuy}
                      onCheckedChange={(checked) => updateFilters('financialFilters', { rentVsBuy: checked })}
                    />
                    <Label className="text-purple-300">Show Rent vs Buy Analysis</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.financialFilters.subsidyAvailable}
                      onCheckedChange={(checked) => updateFilters('financialFilters', { subsidyAvailable: checked })}
                    />
                    <Label className="text-purple-300">Subsidy Available (PMAY/NRI)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.financialFilters.emiCalculator.enabled}
                      onCheckedChange={(checked) => updateFilters('financialFilters', { 
                        emiCalculator: { ...filters.financialFilters.emiCalculator, enabled: checked } 
                      })}
                    />
                    <Label className="text-purple-300 flex items-center space-x-1">
                      <Calculator className="h-4 w-4" />
                      <span>EMI Calculator</span>
                    </Label>
                  </div>
                </div>
              </div>

              {filters.financialFilters.emiCalculator.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-900/30 rounded-lg"
                >
                  <div className="space-y-2">
                    <Label className="text-purple-300">Interest Rate (%): {filters.financialFilters.emiCalculator.interestRate}</Label>
                    <Slider
                      value={[filters.financialFilters.emiCalculator.interestRate]}
                      onValueChange={([value]) => updateFilters('financialFilters', { 
                        emiCalculator: { ...filters.financialFilters.emiCalculator, interestRate: value } 
                      })}
                      min={6}
                      max={15}
                      step={0.25}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Tenure (years): {filters.financialFilters.emiCalculator.tenure}</Label>
                    <Slider
                      value={[filters.financialFilters.emiCalculator.tenure]}
                      onValueChange={([value]) => updateFilters('financialFilters', { 
                        emiCalculator: { ...filters.financialFilters.emiCalculator, tenure: value } 
                      })}
                      min={5}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Property Type Filters */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
        <Collapsible open={openSections.propertyType} onOpenChange={() => toggleSection('propertyType')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-800/20 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-100 flex items-center space-x-2">
                  <Home className="h-5 w-5 text-purple-400" />
                  <span>Property Specifications</span>
                </CardTitle>
                {openSections.propertyType ? <ChevronUp className="h-5 w-5 text-purple-400" /> : <ChevronDown className="h-5 w-5 text-purple-400" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">BHK Configuration</Label>
                    <div className="flex flex-wrap gap-2">
                      {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'].map(bhk => (
                        <Badge
                          key={bhk}
                          variant={filters.propertyTypeFilters.bhkRange.includes(bhk) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${
                            filters.propertyTypeFilters.bhkRange.includes(bhk) 
                              ? 'bg-purple-600 text-white' 
                              : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                          }`}
                          onClick={() => {
                            const updated = filters.propertyTypeFilters.bhkRange.includes(bhk)
                              ? filters.propertyTypeFilters.bhkRange.filter(b => b !== bhk)
                              : [...filters.propertyTypeFilters.bhkRange, bhk];
                            updateFilters('propertyTypeFilters', { bhkRange: updated });
                          }}
                        >
                          {bhk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Property Type</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Apartment', 'Villa', 'Penthouse', 'Studio', 'Plot'].map(type => (
                        <Badge
                          key={type}
                          variant={filters.propertyTypeFilters.propertyType.includes(type) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${
                            filters.propertyTypeFilters.propertyType.includes(type) 
                              ? 'bg-purple-600 text-white' 
                              : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                          }`}
                          onClick={() => {
                            const updated = filters.propertyTypeFilters.propertyType.includes(type)
                              ? filters.propertyTypeFilters.propertyType.filter(t => t !== type)
                              : [...filters.propertyTypeFilters.propertyType, type];
                            updateFilters('propertyTypeFilters', { propertyType: updated });
                          }}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Listing Type</Label>
                    <Select
                      value={filters.propertyTypeFilters.listingType}
                      onValueChange={(value: 'builder' | 'owner' | 'both') => updateFilters('propertyTypeFilters', { listingType: value })}
                    >
                      <SelectTrigger className="bg-purple-900/50 border-purple-600/50 text-purple-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-900 border-purple-600">
                        <SelectItem value="both">Both Builder & Owner</SelectItem>
                        <SelectItem value="builder">Builder Only</SelectItem>
                        <SelectItem value="owner">Owner Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.propertyTypeFilters.reraApproved}
                        onCheckedChange={(checked) => updateFilters('propertyTypeFilters', { reraApproved: checked })}
                      />
                      <Label className="text-purple-300">RERA Approved Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.propertyTypeFilters.greenCertified}
                        onCheckedChange={(checked) => updateFilters('propertyTypeFilters', { greenCertified: checked })}
                      />
                      <Label className="text-purple-300 flex items-center space-x-1">
                        <Leaf className="h-4 w-4" />
                        <span>Green Certified</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">
                    Carpet Area: {filters.propertyTypeFilters.carpetAreaRange.min} - {filters.propertyTypeFilters.carpetAreaRange.max} sq ft
                  </Label>
                  <Slider
                    value={[filters.propertyTypeFilters.carpetAreaRange.min, filters.propertyTypeFilters.carpetAreaRange.max]}
                    onValueChange={([min, max]) => updateFilters('propertyTypeFilters', { 
                      carpetAreaRange: { min, max } 
                    })}
                    min={300}
                    max={5000}
                    step={50}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">
                    Built-up Area: {filters.propertyTypeFilters.builtUpAreaRange.min} - {filters.propertyTypeFilters.builtUpAreaRange.max} sq ft
                  </Label>
                  <Slider
                    value={[filters.propertyTypeFilters.builtUpAreaRange.min, filters.propertyTypeFilters.builtUpAreaRange.max]}
                    onValueChange={([min, max]) => updateFilters('propertyTypeFilters', { 
                      builtUpAreaRange: { min, max } 
                    })}
                    min={400}
                    max={6000}
                    step={50}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Amenities Filters */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
        <Collapsible open={openSections.amenities} onOpenChange={() => toggleSection('amenities')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-800/20 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-100 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <span>Amenities & Features</span>
                  {getSelectedAmenitiesCount() > 0 && (
                    <Badge className="bg-purple-600 text-white ml-2">
                      {getSelectedAmenitiesCount()} selected
                    </Badge>
                  )}
                </CardTitle>
                {openSections.amenities ? <ChevronUp className="h-5 w-5 text-purple-400" /> : <ChevronDown className="h-5 w-5 text-purple-400" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input
                  placeholder="Search amenities..."
                  value={searchAmenity}
                  onChange={(e) => setSearchAmenity(e.target.value)}
                  className="pl-10 bg-purple-900/50 border-purple-600/50 text-purple-200"
                />
              </div>

              {Object.entries(amenityOptions).map(([category, amenities]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {category === 'lifestyle' && <Users className="h-4 w-4 text-purple-400" />}
                    {category === 'eco' && <Leaf className="h-4 w-4 text-green-400" />}
                    {category === 'security' && <Shield className="h-4 w-4 text-blue-400" />}
                    {category === 'premium' && <Crown className="h-4 w-4 text-yellow-400" />}
                    <Label className="text-purple-300 capitalize font-semibold">{category}</Label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {filteredAmenities(category as keyof typeof amenityOptions).map(amenity => (
                      <Badge
                        key={amenity}
                        variant={filters.amenityFilters[category as keyof typeof amenityOptions].includes(amenity) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs ${
                          filters.amenityFilters[category as keyof typeof amenityOptions].includes(amenity)
                            ? 'bg-purple-600 text-white' 
                            : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                        }`}
                        onClick={() => toggleAmenity(category as keyof typeof amenityOptions, amenity)}
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Ratings & Reviews Filters */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
        <Collapsible open={openSections.ratings} onOpenChange={() => toggleSection('ratings')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-800/20 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-100 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  <span>Ratings & Reviews</span>
                </CardTitle>
                {openSections.ratings ? <ChevronUp className="h-5 w-5 text-purple-400" /> : <ChevronDown className="h-5 w-5 text-purple-400" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Property Score: {filters.ratingsFilters.propertyScore}/10</Label>
                    <Slider
                      value={[filters.ratingsFilters.propertyScore]}
                      onValueChange={([value]) => updateFilters('ratingsFilters', { propertyScore: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Builder Reputation: {filters.ratingsFilters.builderReputation}/10</Label>
                    <Slider
                      value={[filters.ratingsFilters.builderReputation]}
                      onValueChange={([value]) => updateFilters('ratingsFilters', { builderReputation: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Project Ratings: {filters.ratingsFilters.projectRatings}/10</Label>
                    <Slider
                      value={[filters.ratingsFilters.projectRatings]}
                      onValueChange={([value]) => updateFilters('ratingsFilters', { projectRatings: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Locality Livability: {filters.ratingsFilters.localityLivability}/10</Label>
                    <Slider
                      value={[filters.ratingsFilters.localityLivability]}
                      onValueChange={([value]) => updateFilters('ratingsFilters', { localityLivability: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={filters.ratingsFilters.verifiedReviews}
                  onCheckedChange={(checked) => updateFilters('ratingsFilters', { verifiedReviews: checked })}
                />
                <Label className="text-purple-300">Verified Reviews Only</Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Neighborhood Filters */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
        <Collapsible open={openSections.neighborhood} onOpenChange={() => toggleSection('neighborhood')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-800/20 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-100 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span>Neighborhood Intelligence</span>
                </CardTitle>
                {openSections.neighborhood ? <ChevronUp className="h-5 w-5 text-purple-400" /> : <ChevronDown className="h-5 w-5 text-purple-400" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Shopping Distance (km): {filters.neighborhoodFilters.shoppingDistance}</Label>
                    <Slider
                      value={[filters.neighborhoodFilters.shoppingDistance]}
                      onValueChange={([value]) => updateFilters('neighborhoodFilters', { shoppingDistance: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">School Distance (km): {filters.neighborhoodFilters.schoolDistance}</Label>
                    <Slider
                      value={[filters.neighborhoodFilters.schoolDistance]}
                      onValueChange={([value]) => updateFilters('neighborhoodFilters', { schoolDistance: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Hospital Distance (km): {filters.neighborhoodFilters.hospitalDistance}</Label>
                    <Slider
                      value={[filters.neighborhoodFilters.hospitalDistance]}
                      onValueChange={([value]) => updateFilters('neighborhoodFilters', { hospitalDistance: value })}
                      min={0}
                      max={15}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Transport Distance (km): {filters.neighborhoodFilters.transportDistance}</Label>
                    <Slider
                      value={[filters.neighborhoodFilters.transportDistance]}
                      onValueChange={([value]) => updateFilters('neighborhoodFilters', { transportDistance: value })}
                      min={0}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={filters.neighborhoodFilters.crimeZoneOverlay}
                  onCheckedChange={(checked) => updateFilters('neighborhoodFilters', { crimeZoneOverlay: checked })}
                />
                <Label className="text-purple-300">Show Crime Zone Overlay</Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Active Filters Summary */}
      <AnimatePresence>
        {(getSelectedAmenitiesCount() > 0 || filters.propertyTypeFilters.bhkRange.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-purple-300 font-semibold">Active Filters</Label>
                  <Button
                    onClick={onResetFilters}
                    variant="ghost"
                    size="sm"
                    className="text-purple-400 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.propertyTypeFilters.bhkRange.map(bhk => (
                    <Badge key={bhk} className="bg-purple-600 text-white">
                      {bhk}
                    </Badge>
                  ))}
                  {Object.values(filters.amenityFilters).flat().slice(0, 5).map(amenity => (
                    <Badge key={amenity} className="bg-purple-600 text-white">
                      {amenity}
                    </Badge>
                  ))}
                  {Object.values(filters.amenityFilters).flat().length > 5 && (
                    <Badge className="bg-purple-600 text-white">
                      +{Object.values(filters.amenityFilters).flat().length - 5} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedRecommendationFilters;