import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Search, Filter, MapPin, Home, TrendingUp } from 'lucide-react';
import { RecommendationFilters } from '../components/RecommendationFilters';
import { PremiumRecommendationCard } from '../components/PremiumRecommendationCard';
import { realTimePropertyService } from '../services/realTimePropertyService';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  features: string[];
  score: number;
}

export default function Recommendations() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000000],
    propertyType: '',
    bedrooms: '',
    location: ''
  });

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Modern 3BHK Apartment',
          location: 'Whitefield, Bangalore',
          price: 8500000,
          type: 'Apartment',
          bedrooms: 3,
          bathrooms: 2,
          area: 1450,
          image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
          features: ['Swimming Pool', 'Gym', 'Parking', 'Security'],
          score: 9.2
        },
        {
          id: '2',
          title: 'Luxury Villa with Garden',
          location: 'Koramangala, Bangalore',
          price: 15000000,
          type: 'Villa',
          bedrooms: 4,
          bathrooms: 3,
          area: 2200,
          image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
          features: ['Garden', 'Parking', 'Security', 'Power Backup'],
          score: 9.5
        },
        {
          id: '3',
          title: 'Cozy 2BHK Near IT Hub',
          location: 'Electronic City, Bangalore',
          price: 6200000,
          type: 'Apartment',
          bedrooms: 2,
          bathrooms: 2,
          area: 1100,
          image: 'https://images.pexels.com/photos/1396125/pexels-photo-1396125.jpeg?auto=compress&cs=tinysrgb&w=800',
          features: ['Gym', 'Parking', 'Lift', 'Security'],
          score: 8.8
        }
      ];
      
      setProperties(mockProperties);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const matchesType = !filters.propertyType || property.type === filters.propertyType;
    const matchesBedrooms = !filters.bedrooms || property.bedrooms.toString() === filters.bedrooms;
    const matchesLocation = !filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Property Recommendations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover properties tailored to your preferences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by location or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <RecommendationFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {loading ? 'Loading...' : `${filteredProperties.length} properties found`}
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PremiumRecommendationCard
                key={property.id}
                property={property}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!loading && filteredProperties.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}