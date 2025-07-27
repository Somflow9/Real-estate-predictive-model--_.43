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
  ChevronDown,
  ChevronUp,
  IndianRupee,
  MapPin,
  Home,
  Building,
  Zap,
  Calculator,
  TrendingUp,
  Shield,
  Search,
  X,
  Filter,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface SmartFilterPanelProps {
  filters: SmartFilters;
  onFiltersChange: (filters: SmartFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SmartFilterPanel: React.FC<SmartFilterPanelProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  isCollapsed,
  onToggleCollapse
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceFinance: true,
    locationProximity: false,
    propertySpecs: false,
    builderProject: false,
    amenities: false
  });

  const [amenitySearch, setAmenitySearch] = useState('');

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

  const amenityCategories = {
    lifestyle: [
      'Swimming Pool', 'Clubhouse', 'Gym', 'Jogging Track', 'Children Play Area',
      'Indoor Games', 'Library', 'Banquet Hall', 'Amphitheatre', 'Cinema Room'
    ],
    eco: [
      'EV Charging', 'Solar Panels', 'Rainwater Harvesting', 'Waste Management',
      'Green Building', 'Organic Garden', 'Energy Efficient', 'LED Lighting'
    ],
    security: [
      '24x7 Security', 'CCTV Surveillance', 'Access Control', 'Fire Safety',
      'Emergency Response', 'Visitor Management', 'Perimeter Security'
    ],
    premium: [
      'Concierge', 'Valet Parking', 'Private Garden', 'Rooftop Access',
      'Coworking Space', 'Meditation Deck', 'Daycare', 'Pet Area'
    ]
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (section: keyof SmartFilters, updates: any) => {
    onFiltersChange({
      ...filters,
      [section]: { ...filters[section], ...updates }
    });
  };

  const toggleAmenity = (category: keyof typeof amenityCategories, amenity: string) => {
    const currentAmenities = filters.amenities[category];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    updateFilters('amenities', { [category]: updatedAmenities });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceFinance.emiPreview) count++;
    if (filters.priceFinance.roiEstimator) count++;
    if (filters.priceFinance.taxBenefits) count++;
    if (filters.locationProximity.pollutionFilter) count++;
    if (filters.locationProximity.safetyFilter) count++;
    if (filters.propertySpecs.smartHome) count++;
    if (filters.propertySpecs.vaastuCompliant) count++;
    if (filters.propertySpecs.igbcCertified) count++;
    if (filters.builderProject.verifiedOnly) count++;
    count += filters.propertySpecs.bhkRange.length;
    count += filters.propertySpecs.propertyTypes.length;
    count += Object.values(filters.amenities).flat().length;
    return count;
  };

  const filteredAmenities = (category: keyof typeof amenityCategories) => {
    return amenityCategories[category].filter(amenity =>
      amenity.toLowerCase().includes(amenitySearch.toLowerCase())
    );
  };

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 'auto', opacity: 1 }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50"
      >
        <Button
          onClick={onToggleCollapse}
          className="bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white p-3 rounded-r-2xl shadow-2xl"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 h-screen overflow-y-auto bg-black border-r border-purple-600/30 sticky top-0"
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Smart Filters</h2>
            {getActiveFiltersCount() > 0 && (
              <Badge className="bg-purple-600 text-white">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="text-purple-400 hover:text-white hover:bg-purple-600/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={onApplyFilters}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
          >
            Apply Filters
          </Button>
          <Button
            onClick={onResetFilters}
            variant="outline"
            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
          >
            Reset
          </Button>
        </div>

        {/* Price & Finance */}
        <Card className="bg-gray-900/50 border border-purple-600/30">
          <Collapsible open={openSections.priceFinance} onOpenChange={() => toggleSection('priceFinance')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-purple-600/10 transition-colors pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm">
                    <IndianRupee className="h-4 w-4 text-purple-400" />
                    <span>Price & Finance</span>
                  </CardTitle>
                  {openSections.priceFinance ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">
                    Price Range: {formatPrice(filters.priceFinance.priceRange.min)} - {formatPrice(filters.priceFinance.priceRange.max)}
                  </Label>
                  <Slider
                    value={[filters.priceFinance.priceRange.min / 1000000, filters.priceFinance.priceRange.max / 1000000]}
                    onValueChange={([min, max]) => updateFilters('priceFinance', { 
                      priceRange: { min: min * 1000000, max: max * 1000000 } 
                    })}
                    min={10}
                    max={2000}
                    step={5}
                    className="w-full [&_.slider-track]:bg-purple-600 [&_.slider-range]:bg-purple-400"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">EMI Preview Tool</Label>
                    <Switch
                      checked={filters.priceFinance.emiPreview}
                      onCheckedChange={(checked) => updateFilters('priceFinance', { emiPreview: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">ROI Estimator</Label>
                    <Switch
                      checked={filters.priceFinance.roiEstimator}
                      onCheckedChange={(checked) => updateFilters('priceFinance', { roiEstimator: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">Tax Benefits</Label>
                    <Switch
                      checked={filters.priceFinance.taxBenefits}
                      onCheckedChange={(checked) => updateFilters('priceFinance', { taxBenefits: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">
                    Rental Yield: {filters.priceFinance.rentalYield.min}% - {filters.priceFinance.rentalYield.max}%
                  </Label>
                  <Slider
                    value={[filters.priceFinance.rentalYield.min, filters.priceFinance.rentalYield.max]}
                    onValueChange={([min, max]) => updateFilters('priceFinance', { 
                      rentalYield: { min, max } 
                    })}
                    min={2}
                    max={8}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Location & Proximity */}
        <Card className="bg-gray-900/50 border border-purple-600/30">
          <Collapsible open={openSections.locationProximity} onOpenChange={() => toggleSection('locationProximity')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-purple-600/10 transition-colors pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span>Location & Proximity</span>
                  </CardTitle>
                  {openSections.locationProximity ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Tier-1 City</Label>
                  <Select
                    value={filters.locationProximity.city}
                    onValueChange={(value) => updateFilters('locationProximity', { city: value })}
                  >
                    <SelectTrigger className="bg-black border-purple-600/50 text-white">
                      <SelectValue placeholder="Select city" />
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

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-purple-300 text-xs">Search Radius: {filters.locationProximity.searchRadius}km</Label>
                    <Slider
                      value={[filters.locationProximity.searchRadius]}
                      onValueChange={([value]) => updateFilters('locationProximity', { searchRadius: value })}
                      min={1}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300 text-xs">Metro Distance: {filters.locationProximity.metroDistance}km</Label>
                    <Slider
                      value={[filters.locationProximity.metroDistance]}
                      onValueChange={([value]) => updateFilters('locationProximity', { metroDistance: value })}
                      min={0}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300 text-xs">Shopping: {filters.locationProximity.shoppingDistance}km</Label>
                    <Slider
                      value={[filters.locationProximity.shoppingDistance]}
                      onValueChange={([value]) => updateFilters('locationProximity', { shoppingDistance: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300 text-xs">Schools: {filters.locationProximity.schoolDistance}km</Label>
                    <Slider
                      value={[filters.locationProximity.schoolDistance]}
                      onValueChange={([value]) => updateFilters('locationProximity', { schoolDistance: value })}
                      min={0}
                      max={8}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">Low Pollution Areas</Label>
                    <Switch
                      checked={filters.locationProximity.pollutionFilter}
                      onCheckedChange={(checked) => updateFilters('locationProximity', { pollutionFilter: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">High Safety Areas</Label>
                    <Switch
                      checked={filters.locationProximity.safetyFilter}
                      onCheckedChange={(checked) => updateFilters('locationProximity', { safetyFilter: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Property Specifications */}
        <Card className="bg-gray-900/50 border border-purple-600/30">
          <Collapsible open={openSections.propertySpecs} onOpenChange={() => toggleSection('propertySpecs')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-purple-600/10 transition-colors pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm">
                    <Home className="h-4 w-4 text-purple-400" />
                    <span>Property Specifications</span>
                  </CardTitle>
                  {openSections.propertySpecs ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">BHK Configuration</Label>
                  <div className="flex flex-wrap gap-1">
                    {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK+'].map(bhk => (
                      <Badge
                        key={bhk}
                        variant={filters.propertySpecs.bhkRange.includes(bhk) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs ${
                          filters.propertySpecs.bhkRange.includes(bhk) 
                            ? 'bg-purple-600 text-white' 
                            : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                        }`}
                        onClick={() => {
                          const updated = filters.propertySpecs.bhkRange.includes(bhk)
                            ? filters.propertySpecs.bhkRange.filter(b => b !== bhk)
                            : [...filters.propertySpecs.bhkRange, bhk];
                          updateFilters('propertySpecs', { bhkRange: updated });
                        }}
                      >
                        {bhk}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Property Type</Label>
                  <div className="flex flex-wrap gap-1">
                    {['Apartment', 'Studio', 'Villa', 'Penthouse', 'Builder Floor', 'Independent House', 'Row House', 'Duplex'].map(type => (
                      <Badge
                        key={type}
                        variant={filters.propertySpecs.propertyTypes.includes(type) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs ${
                          filters.propertySpecs.propertyTypes.includes(type) 
                            ? 'bg-purple-600 text-white' 
                            : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                        }`}
                        onClick={() => {
                          const updated = filters.propertySpecs.propertyTypes.includes(type)
                            ? filters.propertySpecs.propertyTypes.filter(t => t !== type)
                            : [...filters.propertySpecs.propertyTypes, type];
                          updateFilters('propertySpecs', { propertyTypes: updated });
                        }}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Possession Status</Label>
                  <div className="flex flex-wrap gap-1">
                    {['Ready', 'Under Construction', 'Pre-launch', 'Resale', 'Immediate'].map(status => (
                      <Badge
                        key={status}
                        variant={filters.propertySpecs.possessionStatus.includes(status) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs ${
                          filters.propertySpecs.possessionStatus.includes(status) 
                            ? 'bg-purple-600 text-white' 
                            : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                        }`}
                        onClick={() => {
                          const updated = filters.propertySpecs.possessionStatus.includes(status)
                            ? filters.propertySpecs.possessionStatus.filter(s => s !== status)
                            : [...filters.propertySpecs.possessionStatus, status];
                          updateFilters('propertySpecs', { possessionStatus: updated });
                        }}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Floor Preference</Label>
                  <Select
                    value={filters.propertySpecs.floorPreference}
                    onValueChange={(value: 'Low' | 'Mid' | 'High' | 'Any') => updateFilters('propertySpecs', { floorPreference: value })}
                  >
                    <SelectTrigger className="bg-black border-purple-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-600">
                      <SelectItem value="Any" className="text-white hover:bg-purple-600/20">Any Floor</SelectItem>
                      <SelectItem value="Low" className="text-white hover:bg-purple-600/20">Low (1-5)</SelectItem>
                      <SelectItem value="Mid" className="text-white hover:bg-purple-600/20">Mid (6-15)</SelectItem>
                      <SelectItem value="High" className="text-white hover:bg-purple-600/20">High (16+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">Smart Home Ready</Label>
                    <Switch
                      checked={filters.propertySpecs.smartHome}
                      onCheckedChange={(checked) => updateFilters('propertySpecs', { smartHome: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">Vaastu Compliant</Label>
                    <Switch
                      checked={filters.propertySpecs.vaastuCompliant}
                      onCheckedChange={(checked) => updateFilters('propertySpecs', { vaastuCompliant: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 text-xs">IGBC Certified</Label>
                    <Switch
                      checked={filters.propertySpecs.igbcCertified}
                      onCheckedChange={(checked) => updateFilters('propertySpecs', { igbcCertified: checked })}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Builder & Project Data */}
        <Card className="bg-gray-900/50 border border-purple-600/30">
          <Collapsible open={openSections.builderProject} onOpenChange={() => toggleSection('builderProject')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-purple-600/10 transition-colors pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-purple-400" />
                    <span>Builder & Project</span>
                  </CardTitle>
                  {openSections.builderProject ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Builder Search</Label>
                  <Input
                    placeholder="Search builder..."
                    value={filters.builderProject.builderSearch}
                    onChange={(e) => updateFilters('builderProject', { builderSearch: e.target.value })}
                    className="bg-black border-purple-600/50 text-white placeholder:text-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Builder Category</Label>
                  <Select
                    value={filters.builderProject.builderCategory}
                    onValueChange={(value: 'National' | 'Local' | 'Foreign MNC' | 'Any') => updateFilters('builderProject', { builderCategory: value })}
                  >
                    <SelectTrigger className="bg-black border-purple-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-600">
                      <SelectItem value="Any" className="text-white hover:bg-purple-600/20">Any Category</SelectItem>
                      <SelectItem value="National" className="text-white hover:bg-purple-600/20">National</SelectItem>
                      <SelectItem value="Local" className="text-white hover:bg-purple-600/20">Local</SelectItem>
                      <SelectItem value="Foreign MNC" className="text-white hover:bg-purple-600/20">Foreign MNC</SelectItem>
                      <SelectItem value="Mid-Sized" className="text-white hover:bg-purple-600/20">Mid-Sized</SelectItem>
                      <SelectItem value="Regional" className="text-white hover:bg-purple-600/20">Regional</SelectItem>
                      <SelectItem value="Owner/Broker" className="text-white hover:bg-purple-600/20">Owner/Broker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Min Delivery Rate: {filters.builderProject.minDeliveryRate}%</Label>
                  <Slider
                    value={[filters.builderProject.minDeliveryRate]}
                    onValueChange={([value]) => updateFilters('builderProject', { minDeliveryRate: value })}
                    min={60}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Max Avg Delay: {filters.builderProject.maxAvgDelay} months</Label>
                  <Slider
                    value={[filters.builderProject.maxAvgDelay]}
                    onValueChange={([value]) => updateFilters('builderProject', { maxAvgDelay: value })}
                    min={0}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-300 text-xs">Min Builder Rating: {filters.builderProject.minBuilderRating}/5</Label>
                  <Slider
                    value={[filters.builderProject.minBuilderRating]}
                    onValueChange={([value]) => updateFilters('builderProject', { minBuilderRating: value })}
                    min={1}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-purple-300 text-xs">Verified Builders Only</Label>
                  <Switch
                    checked={filters.builderProject.verifiedOnly}
                    onCheckedChange={(checked) => updateFilters('builderProject', { verifiedOnly: checked })}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Amenities */}
        <Card className="bg-gray-900/50 border border-purple-600/30">
          <Collapsible open={openSections.amenities} onOpenChange={() => toggleSection('amenities')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-purple-600/10 transition-colors pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span>Amenities</span>
                    {Object.values(filters.amenities).flat().length > 0 && (
                      <Badge className="bg-purple-600 text-white text-xs">
                        {Object.values(filters.amenities).flat().length}
                      </Badge>
                    )}
                  </CardTitle>
                  {openSections.amenities ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-purple-400" />
                  <Input
                    placeholder="Search amenities..."
                    value={amenitySearch}
                    onChange={(e) => setAmenitySearch(e.target.value)}
                    className="pl-8 bg-black border-purple-600/50 text-white placeholder:text-purple-400 text-xs"
                  />
                </div>

                {Object.entries(amenityCategories).map(([category, amenities]) => (
                  <div key={category} className="space-y-2">
                    <Label className="text-purple-300 text-xs capitalize font-semibold">{category}</Label>
                    <div className="grid grid-cols-2 gap-1">
                      {filteredAmenities(category as keyof typeof amenityCategories).map(amenity => (
                        <Badge
                          key={amenity}
                          variant={filters.amenities[category as keyof typeof amenityCategories].includes(amenity) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors text-xs p-1 ${
                            filters.amenities[category as keyof typeof amenityCategories].includes(amenity)
                              ? 'bg-purple-600 text-white' 
                              : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                          }`}
                          onClick={() => toggleAmenity(category as keyof typeof amenityCategories, amenity)}
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

        {/* Active Filters Summary */}
        <AnimatePresence>
          {getActiveFiltersCount() > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-purple-900/20 border border-purple-600/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-purple-300 text-xs font-semibold">Active Filters</Label>
                    <Button
                      onClick={onResetFilters}
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-white text-xs p-1"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="text-xs text-purple-400">
                    {getActiveFiltersCount()} filters applied
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SmartFilterPanel;