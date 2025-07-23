import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RefreshCw, Filter, MapPin, Home, IndianRupee, Bed } from 'lucide-react';

interface FilterState {
  city: string;
  budget: string;
  propertyType: string;
  bhk: string;
  locality: string;
}

interface RecommendationFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onRefresh: () => void;
  isLoading: boolean;
  cityTier: string;
}

const RecommendationFilters: React.FC<RecommendationFiltersProps> = ({
  onFiltersChange,
  onRefresh,
  isLoading,
  cityTier
}) => {
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    budget: '',
    propertyType: '',
    bhk: '',
    locality: ''
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      city: '',
      budget: '',
      propertyType: '',
      bhk: '',
      locality: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Property Filters</CardTitle>
            {cityTier && (
              <Badge variant="secondary" className="ml-2">
                {cityTier} City
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              City
            </label>
            <Input
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Budget Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <IndianRupee className="w-3 h-3" />
              Budget
            </label>
            <Select
              value={filters.budget}
              onValueChange={(value) => handleFilterChange('budget', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-25">Under ₹25L</SelectItem>
                <SelectItem value="25-50">₹25L - ₹50L</SelectItem>
                <SelectItem value="50-75">₹50L - ₹75L</SelectItem>
                <SelectItem value="75-100">₹75L - ₹1Cr</SelectItem>
                <SelectItem value="100-150">₹1Cr - ₹1.5Cr</SelectItem>
                <SelectItem value="150+">Above ₹1.5Cr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Home className="w-3 h-3" />
              Type
            </label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => handleFilterChange('propertyType', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* BHK Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Bed className="w-3 h-3" />
              BHK
            </label>
            <Select
              value={filters.bhk}
              onValueChange={(value) => handleFilterChange('bhk', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select BHK" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 BHK</SelectItem>
                <SelectItem value="2">2 BHK</SelectItem>
                <SelectItem value="3">3 BHK</SelectItem>
                <SelectItem value="4">4 BHK</SelectItem>
                <SelectItem value="5+">5+ BHK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Locality Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Locality</label>
            <Input
              placeholder="Enter locality"
              value={filters.locality}
              onChange={(e) => handleFilterChange('locality', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationFilters;