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
    if (city && preferences) {
      fetchEnhancedProperties();
    }
  }, [city, preferences]);

  const fetchEnhancedProperties = async () => {
    if (!city || !preferences) return;
    
    setLoading(true);
    
    try {
      // Simulate enhanced API call to multiple sources
      await new Promise(resolve => setTimeout(resolve, 1500));
    
      const mockProperties: EnhancedProperty[] = [];
      const propertyCount = Math.floor(Math.random() * 4) + 2; // 2-6 properties
      
      const builders = tier === 1 
        ? ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Sobha Limited']
        : tier === 2 
        ? ['Brigade Group', 'Puravankara', 'Kolte Patil', 'Shriram Properties']
        : ['Local Builder', 'Regional Developer', 'City Builder'];
      
      for (let i = 0; i < propertyCount; i++) {
        const builder = builders[Math.floor(Math.random() * builders.length)];
        const priceVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        const basePrice = preferences.budget * priceVariation;
        const area = Math.floor(Math.random() * 800) + 800; // 800-1600 sq ft
        
        mockProperties.push({
          id: `enhanced_${i}`,
          title: `Premium ${preferences.bedrooms}BHK in ${city}`,
          price: basePrice,
          carpetArea: area,
          configuration: `${preferences.bedrooms}BHK`,
          builderName: builder,
          reraId: `RERA${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          possessionStatus: ['Ready to Move', 'Under Construction', 'New Launch'][Math.floor(Math.random() * 3)],
          location: `Prime Area, ${city}`,
          pricePerSqft: Math.floor((basePrice * 100000) / area),
          valuation: getValuation(priceVariation),
          builderRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          source: ['99acres', 'MagicBricks', 'Housing.com', 'NoBroker'][Math.floor(Math.random() * 4)],
          alternatives: generateAlternatives(preferences, city),
          nearbyProjects: generateNearbyProjects()
        });
      }

      setProperties(mockProperties);
    } catch (error) {
      console.error('Error fetching enhanced properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getValuation = (priceVariation: number): 'Under Market' | 'Overpriced' | 'Fair Deal' => {
    if (priceVariation < 0.9) return 'Under Market';
    if (priceVariation > 1.1) return 'Overpriced';
    return 'Fair Deal';
  };

  const generateAlternatives = (prefs: any, city: string) => {
    return [
      {
        id: 'alt1',
        reason: 'Better Builder Reputation',
        title: 'Premium Complex by Godrej',
        price: prefs.budget * 1.1,
        builderName: 'Godrej Properties',
        pricePerSqft: Math.floor((prefs.budget * 1.1 * 100000) / 1200)
      },
      {
        id: 'alt2',
        reason: 'Better Value',
        title: 'Smart Investment Option',
        price: prefs.budget * 0.85,
        builderName: 'Brigade Group',
        pricePerSqft: Math.floor((prefs.budget * 0.85 * 100000) / 1200)
      }
    ];
  };

  const generateNearbyProjects = () => {
    const projects = [
      'Green Valley Phase 2', 'Tech Park Residency', 'Urban Heights', 'City Center Plaza',
      'Metro View Apartments', 'Garden City Homes', 'Skyline Towers', 'Riverside Enclave'
    ];
    
    return projects.slice(0, Math.floor(Math.random() * 3) + 2).map(name => ({
      name,
      builder: ['Sobha Limited', 'Brigade Group', 'Prestige Group'][Math.floor(Math.random() * 3)],
      distance: Math.round(Math.random() * 3 * 10) / 10,
      status: ['Under Construction', 'New Launch', 'Ready'][Math.floor(Math.random() * 3)]
    }));
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