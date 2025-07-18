
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Car, Train, Calendar, TrendingUp } from 'lucide-react';
import { getFilteredProperties } from '@/data/mockProperties';
import { Property } from '@/types/property';

const Properties = () => {
  const [filters, setFilters] = useState({
    maxPrice: 200,
    location: 'All',
    propertyType: 'All',
    searchTerm: ''
  });

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => getFilteredProperties(filters),
  });

  const locations = ['All', 'Gurgaon', 'Noida', 'Delhi', 'Bangalore', 'Mumbai'];
  const propertyTypes = ['All', 'Apartment', 'Villa', 'Studio'];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Property Listings</h1>
        <p className="text-muted-foreground">
          Browse through our curated collection of properties
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Max Price (₹ Lakhs)</label>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={(value) => handleFilterChange('maxPrice', value[0])}
                max={200}
                min={20}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">₹{filters.maxPrice}L</div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
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
              <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
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
            
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search by location, builder..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {properties?.length || 0} Properties Found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property: Property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">₹{property.price}L</CardTitle>
            <p className="text-sm text-muted-foreground">₹{property.price_per_sqft}/sq ft</p>
          </div>
          <Badge variant="secondary">{property.property_type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>{property.bedrooms} BHK</span>
          </div>
          <div>{property.area_sqft} sq ft</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Builder:</span>
          <span className="text-sm text-muted-foreground">{property.builder}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {property.parking && <Car className="h-4 w-4 text-green-600" />}
            {property.metro_nearby && <Train className="h-4 w-4 text-blue-600" />}
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{property.days_since_listed} days ago</span>
          </div>
        </div>
        
        {property.predicted_price && (
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Predicted: ₹{property.predicted_price}L</span>
            <Badge variant={property.price <= property.predicted_price ? "default" : "destructive"}>
              {property.price <= property.predicted_price ? "Good Deal" : "Overpriced"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Properties;
