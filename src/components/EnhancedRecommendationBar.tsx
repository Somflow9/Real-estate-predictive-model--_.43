import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Building, TrendingUp, TrendingDown, ExternalLink, Shield, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedProperty {
  id: string;
  title: string;
  price: number;
  carpetArea: number;
  configuration: string;
  builderName: string;
  reraId: string;
  possessionStatus: string;
  location: string;
  pricePerSqft: number;
  valuation: 'Fair Deal' | 'Overpriced' | 'Under Market';
  builderRating: number;
  source: '99acres' | 'NoBroker' | 'MagicBricks';
  alternatives: Array<{
    id: string;
    reason: string;
    title: string;
    price: number;
    builderName: string;
    pricePerSqft: number;
  }>;
  nearbyProjects: Array<{
    name: string;
    builder: string;
    distance: number;
    status: string;
  }>;
}

interface EnhancedRecommendationBarProps {
  city: string;
  tier: 1 | 2 | 3;
  preferences: {
    budget: number;
    propertyType: string;
    bedrooms: number;
  };
}

const EnhancedRecommendationBar = ({ city, tier, preferences }: EnhancedRecommendationBarProps) => {
  const [properties, setProperties] = useState<EnhancedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnhancedProperties();
  }, [city, preferences]);

  const fetchEnhancedProperties = async () => {
    setLoading(true);
    // Simulate API call to multiple sources
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockProperties: EnhancedProperty[] = [
      {
        id: '1',
        title: `Premium ${preferences.bedrooms}BHK in ${city}`,
        price: preferences.budget * 0.9,
        carpetArea: 1200,
        configuration: `${preferences.bedrooms}BHK`,
        builderName: tier === 1 ? 'DLF Limited' : tier === 2 ? 'Prestige Group' : 'Local Builder',
        reraId: `RERA${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        possessionStatus: 'Ready to Move',
        location: `Prime Area, ${city}`,
        pricePerSqft: Math.floor((preferences.budget * 0.9 * 100000) / 1200),
        valuation: 'Fair Deal',
        builderRating: 4.2,
        source: '99acres',
        alternatives: [
          {
            id: 'alt1',
            reason: 'Better Builder Reputation',
            title: 'Premium Complex by Godrej',
            price: preferences.budget * 1.1,
            builderName: 'Godrej Properties',
            pricePerSqft: Math.floor((preferences.budget * 1.1 * 100000) / 1200)
          },
          {
            id: 'alt2',
            reason: 'Cheaper per sq.ft.',
            title: 'Value Housing Project',
            price: preferences.budget * 0.75,
            builderName: 'Brigade Group',
            pricePerSqft: Math.floor((preferences.budget * 0.75 * 100000) / 1200)
          }
        ],
        nearbyProjects: [
          {
            name: 'Green Valley Phase 2',
            builder: 'Sobha Limited',
            distance: 1.2,
            status: 'Under Construction'
          },
          {
            name: 'Tech Park Residency',
            builder: 'Brigade Group',
            distance: 2.1,
            status: 'New Launch'
          }
        ]
      }
    ];

    setProperties(mockProperties);
    setLoading(false);
  };

  const getValuationColor = (valuation: string) => {
    switch (valuation) {
      case 'Under Market': return 'bg-green-100 text-green-800 border-green-200';
      case 'Overpriced': return 'bg-red-100 text-red-800 border-red-200';
      case 'Fair Deal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceLogo = (source: string) => {
    const logos = {
      '99acres': '🏠',
      'NoBroker': '🏡',
      'MagicBricks': '🧱'
    };
    return logos[source as keyof typeof logos] || '🏢';
  };

  if (loading) {
    return (
      <Card className="glassmorphism glow-border">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div>
              <p className="font-medium">Fetching live property data...</p>
              <p className="text-sm text-muted-foreground">Scanning 99acres, NoBroker & MagicBricks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="glassmorphism glow-border hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getSourceLogo(property.source)}</span>
                    <Badge variant="outline" className="text-xs">
                      {property.source}
                    </Badge>
                    <Badge className={`${getValuationColor(property.valuation)} border`}>
                      {property.valuation}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{property.builderName}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₹{(property.price / 10).toFixed(1)}Cr</div>
                  <div className="text-sm text-muted-foreground">₹{property.pricePerSqft.toLocaleString()}/sq ft</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-accent/20 p-3 rounded-lg text-center">
                  <div className="font-semibold">{property.carpetArea} sq ft</div>
                  <div className="text-xs text-muted-foreground">Carpet Area</div>
                </div>
                <div className="bg-accent/20 p-3 rounded-lg text-center">
                  <div className="font-semibold">{property.configuration}</div>
                  <div className="text-xs text-muted-foreground">Configuration</div>
                </div>
                <div className="bg-accent/20 p-3 rounded-lg text-center">
                  <div className="font-semibold flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{property.builderRating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Builder Rating</div>
                </div>
                <div className="bg-accent/20 p-3 rounded-lg text-center">
                  <div className="font-semibold">{property.possessionStatus}</div>
                  <div className="text-xs text-muted-foreground">Possession</div>
                </div>
              </div>

              {/* RERA Information */}
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">RERA Approved</span>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  {property.reraId}
                </Badge>
              </div>

              {/* Alternatives */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Alternative Suggestions</span>
                </h4>
                <div className="grid gap-3">
                  {property.alternatives.map((alt) => (
                    <div key={alt.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{alt.title}</div>
                        <div className="text-xs text-muted-foreground">{alt.reason} • {alt.builderName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(alt.price / 10).toFixed(1)}Cr</div>
                        <div className="text-xs text-muted-foreground">₹{alt.pricePerSqft.toLocaleString()}/sq ft</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Projects */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Nearby Projects</span>
                </h4>
                <div className="grid gap-2">
                  {property.nearbyProjects.map((project, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-accent/10 rounded">
                      <div>
                        <div className="font-medium text-sm">{project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.builder}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{project.distance} km</div>
                        <Badge variant="outline" className="text-xs">{project.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                  View Details
                </Button>
                <Button variant="outline" className="flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>Visit {property.source}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedRecommendationBar;