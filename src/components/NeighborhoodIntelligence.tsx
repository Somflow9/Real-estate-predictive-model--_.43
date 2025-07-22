import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Shield, 
  Volume2, 
  Leaf, 
  GraduationCap, 
  Hospital, 
  ShoppingCart, 
  Train,
  Car,
  Clock,
  TrendingUp,
  Construction
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NeighborhoodData {
  walkabilityScore: number;
  safetyRating: number;
  noiseLevel: number;
  pollutionIndex: number;
  nearbyFacilities: {
    schools: Array<{ name: string; distance: number; rating: number }>;
    hospitals: Array<{ name: string; distance: number; type: string }>;
    markets: Array<{ name: string; distance: number; type: string }>;
    transport: Array<{ name: string; distance: number; type: string }>;
  };
  futureInfrastructure: Array<{
    name: string;
    type: 'metro' | 'expressway' | 'mall' | 'airport';
    status: 'Planned' | 'Under Construction' | 'Approved';
    expectedCompletion: string;
    impactOnPrices: number;
  }>;
}

interface NeighborhoodIntelligenceProps {
  location: string;
  coordinates?: { lat: number; lng: number };
}

const NeighborhoodIntelligence = ({ location, coordinates }: NeighborhoodIntelligenceProps) => {
  const [data, setData] = useState<NeighborhoodData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNeighborhoodData();
  }, [location]);

  const fetchNeighborhoodData = async () => {
    setLoading(true);
    // Simulate API call to neighborhood intelligence service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData: NeighborhoodData = {
      walkabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      safetyRating: Math.floor(Math.random() * 30) + 70, // 70-100
      noiseLevel: Math.floor(Math.random() * 40) + 30, // 30-70 (lower is better)
      pollutionIndex: Math.floor(Math.random() * 50) + 25, // 25-75 (lower is better)
      nearbyFacilities: {
        schools: [
          { name: 'Delhi Public School', distance: 0.8, rating: 4.5 },
          { name: 'Ryan International', distance: 1.2, rating: 4.2 },
          { name: 'Kendriya Vidyalaya', distance: 2.1, rating: 4.0 }
        ],
        hospitals: [
          { name: 'Max Hospital', distance: 1.5, type: 'Multi-specialty' },
          { name: 'Apollo Clinic', distance: 0.9, type: 'Clinic' },
          { name: 'Fortis Healthcare', distance: 2.8, type: 'Super-specialty' }
        ],
        markets: [
          { name: 'City Mall', distance: 1.1, type: 'Shopping Mall' },
          { name: 'Local Market', distance: 0.5, type: 'Grocery' },
          { name: 'Sector Market', distance: 0.7, type: 'Daily Needs' }
        ],
        transport: [
          { name: 'Metro Station', distance: 0.6, type: 'Metro' },
          { name: 'Bus Stop', distance: 0.2, type: 'Bus' },
          { name: 'Auto Stand', distance: 0.3, type: 'Auto' }
        ]
      },
      futureInfrastructure: [
        {
          name: 'Metro Line Extension',
          type: 'metro',
          status: 'Under Construction',
          expectedCompletion: '2025-12',
          impactOnPrices: 15
        },
        {
          name: 'New Expressway',
          type: 'expressway',
          status: 'Approved',
          expectedCompletion: '2026-06',
          impactOnPrices: 20
        },
        {
          name: 'Premium Mall',
          type: 'mall',
          status: 'Planned',
          expectedCompletion: '2025-08',
          impactOnPrices: 8
        }
      ]
    };

    setData(mockData);
    setLoading(false);
  };

  const getScoreColor = (score: number, reverse: boolean = false) => {
    if (reverse) {
      // For noise and pollution (lower is better)
      if (score <= 40) return 'text-green-600';
      if (score <= 60) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      // For walkability and safety (higher is better)
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getProgressColor = (score: number, reverse: boolean = false) => {
    if (reverse) {
      if (score <= 40) return 'bg-green-500';
      if (score <= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const getInfrastructureIcon = (type: string) => {
    switch (type) {
      case 'metro': return <Train className="h-4 w-4" />;
      case 'expressway': return <Car className="h-4 w-4" />;
      case 'mall': return <ShoppingCart className="h-4 w-4" />;
      case 'airport': return <MapPin className="h-4 w-4" />;
      default: return <Construction className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="glassmorphism glow-border">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div>
              <p className="font-medium">Analyzing neighborhood intelligence...</p>
              <p className="text-sm text-muted-foreground">Gathering walkability, safety & infrastructure data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glassmorphism glow-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Neighborhood Intelligence - {location}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-accent/20 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(data.walkabilityScore)}`}>
                  {data.walkabilityScore}
                </div>
                <div className="text-xs text-muted-foreground">Walkability Score</div>
                <Progress 
                  value={data.walkabilityScore} 
                  className="mt-2 h-2"
                />
              </div>

              <div className="bg-accent/20 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(data.safetyRating)}`}>
                  {data.safetyRating}
                </div>
                <div className="text-xs text-muted-foreground">Safety Rating</div>
                <Progress 
                  value={data.safetyRating} 
                  className="mt-2 h-2"
                />
              </div>

              <div className="bg-accent/20 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(data.noiseLevel, true)}`}>
                  {data.noiseLevel}
                </div>
                <div className="text-xs text-muted-foreground">Noise Level</div>
                <Progress 
                  value={100 - data.noiseLevel} 
                  className="mt-2 h-2"
                />
              </div>

              <div className="bg-accent/20 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(data.pollutionIndex, true)}`}>
                  {data.pollutionIndex}
                </div>
                <div className="text-xs text-muted-foreground">Pollution Index</div>
                <Progress 
                  value={100 - data.pollutionIndex} 
                  className="mt-2 h-2"
                />
              </div>
            </div>

            {/* Nearby Facilities */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>Schools & Education</span>
                </h4>
                <div className="space-y-2">
                  {data.nearbyFacilities.schools.map((school, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium text-sm">{school.name}</div>
                        <div className="text-xs text-muted-foreground">{school.distance} km away</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ⭐ {school.rating}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Hospital className="h-4 w-4 text-primary" />
                  <span>Healthcare</span>
                </h4>
                <div className="space-y-2">
                  {data.nearbyFacilities.hospitals.map((hospital, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium text-sm">{hospital.name}</div>
                        <div className="text-xs text-muted-foreground">{hospital.distance} km away</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {hospital.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transport & Markets */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Train className="h-4 w-4 text-primary" />
                  <span>Public Transport</span>
                </h4>
                <div className="space-y-2">
                  {data.nearbyFacilities.transport.map((transport, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium text-sm">{transport.name}</div>
                        <div className="text-xs text-muted-foreground">{transport.distance} km away</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {transport.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  <span>Shopping & Markets</span>
                </h4>
                <div className="space-y-2">
                  {data.nearbyFacilities.markets.map((market, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium text-sm">{market.name}</div>
                        <div className="text-xs text-muted-foreground">{market.distance} km away</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {market.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Future Infrastructure */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center space-x-2">
                <Construction className="h-4 w-4 text-primary" />
                <span>Future Infrastructure</span>
              </h4>
              <div className="space-y-3">
                {data.futureInfrastructure.map((infra, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getInfrastructureIcon(infra.type)}
                          <span className="font-medium">{infra.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {infra.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Expected: {infra.expectedCompletion}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Price Impact: +{infra.impactOnPrices}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NeighborhoodIntelligence;