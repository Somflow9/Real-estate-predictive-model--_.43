import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  MapPin, 
  Building, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart,
  Share2,
  ExternalLink,
  Shield,
  Calendar,
  Home,
  Award,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { realTimePropertyService } from '@/services/realTimePropertyService';

interface PremiumRecommendationCardProps {
  property: any;
  rank: number;
  onViewDetails?: (id: string) => void;
  onCompare?: (id: string) => void;
  onSaveProperty?: (id: string) => void;
}

const PremiumRecommendationCard = ({ 
  property, 
  rank, 
  onViewDetails, 
  onCompare, 
  onSaveProperty 
}: PremiumRecommendationCardProps) => {
  const [locationIntel, setLocationIntel] = useState<any>(null);
  const [builderCred, setBuilderCred] = useState<any>(null);
  const [competingSchemes, setCompetingSchemes] = useState<any[]>([]);
  const [recommendationScore, setRecommendationScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (property) {
      loadEnhancedData();
    }
  }, [property]);

  const loadEnhancedData = async () => {
    if (!property) return;
    
    setLoading(true);
    try {
      const [intel, cred, schemes] = await Promise.all([
        realTimePropertyService.getLocationIntelligence(property.locality || property.location, property.city || 'Mumbai'),
        realTimePropertyService.getBuilderCredibility(property.builderName),
        realTimePropertyService.fetchCompetingSchemes(property)
      ]);

      setLocationIntel(intel);
      setBuilderCred(cred);
      setCompetingSchemes(schemes);

      // Calculate AI recommendation score
      const score = realTimePropertyService.calculateRecommendationScore(
        property,
        intel,
        cred,
        { budget: property.price || 0, preferences: [] }
      );
      setRecommendationScore(score);
    } catch (error) {
      console.error('Error loading enhanced data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🏆', text: 'Best Match', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' };
    if (rank === 2) return { icon: '🥈', text: 'Great Choice', color: 'bg-gradient-to-r from-gray-400 to-gray-600' };
    if (rank === 3) return { icon: '🥉', text: 'Good Option', color: 'bg-gradient-to-r from-orange-400 to-orange-600' };
    return { icon: '⭐', text: `#${rank}`, color: 'bg-gradient-to-r from-primary to-accent' };
  };

  const getValuationColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getValuationText = (score: number) => {
    if (score >= 85) return 'Excellent Value';
    if (score >= 70) return 'Good Value';
    if (score >= 55) return 'Fair Deal';
    return 'Overpriced';
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const rankBadge = getRankBadge(rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden glassmorphism glow-border hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        {/* Header with Rank and Source */}
        <div className="relative">
          <div className="absolute top-4 left-4 z-10">
            <Badge className={`${rankBadge.color} text-white px-3 py-1 text-sm font-bold animate-pulse`}>
              {rankBadge.icon} {rankBadge.text}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {property.source}
            </Badge>
          </div>
          
          {/* Property Image */}
          <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
            <img 
              src={property.images?.[0] || property.image || '/placeholder.svg'} 
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Quick Actions */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                  {property.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">{property.projectName}</p>
              </div>
              {recommendationScore && (
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getValuationColor(recommendationScore.score)}`}>
                    {getValuationText(recommendationScore.score)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">AI Score: {recommendationScore.score}/100</div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price || 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ₹{(property.pricePerSqft || property.price_per_sqft || 0).toLocaleString()}/sq ft
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-lg font-semibold">
                  {(property.carpetArea || property.area_sqft || property.area || 0).toLocaleString()} sq ft
                </div>
                {(property.bhk || property.bedrooms) && (
                  <div className="text-sm text-muted-foreground">
                    {property.bhk || `${property.bedrooms}BHK`} • {property.status || 'Available'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Location & Builder Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{property.locality || property.location}</span>
              </div>
              {locationIntel && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Connectivity</span>
                    <span className="font-medium">{locationIntel.connectivityScore}/100</span>
                  </div>
                  <Progress value={locationIntel.connectivityScore} className="h-1" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Building className="h-4 w-4 text-primary" />
                <span className="font-medium truncate">{property.builderName || property.builder}</span>
              </div>
              {builderCred && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credibility</span>
                    <span className="font-medium">{builderCred.overallRating}/5</span>
                  </div>
                  <Progress value={builderCred.overallRating * 20} className="h-1" />
                </div>
              )}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-accent/20 p-3 rounded-lg text-center">
              <Shield className="h-5 w-5 mx-auto text-primary mb-1" />
              <div className="text-xs font-medium">RERA</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
            <div className="bg-accent/20 p-3 rounded-lg text-center">
              <Calendar className="h-5 w-5 mx-auto text-primary mb-1" />
              <div className="text-xs font-medium">{property.status || 'Available'}</div>
              <div className="text-xs text-muted-foreground">Status</div>
            </div>
            <div className="bg-accent/20 p-3 rounded-lg text-center">
              <Star className="h-5 w-5 mx-auto text-yellow-500 mb-1 fill-current" />
              <div className="text-xs font-medium">{property.reviews?.rating || 4.2}</div>
              <div className="text-xs text-muted-foreground">{property.reviews?.count || 0} reviews</div>
            </div>
          </div>

          {/* AI Recommendation Explanation */}
          {recommendationScore && !loading && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">AI Recommendation Analysis</span>
              </div>
              <div className="space-y-1">
                {recommendationScore.explanation.slice(0, 2).map((exp: string, idx: number) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
              {!showDetails && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs mt-2"
                  onClick={() => setShowDetails(true)}
                >
                  View detailed analysis →
                </Button>
              )}
            </div>
          )}

          {/* Detailed Analysis (Expandable) */}
          {showDetails && recommendationScore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div className="bg-muted/50 p-3 rounded-lg">
                <h5 className="font-semibold text-sm mb-2">Complete Analysis</h5>
                <div className="space-y-1">
                  {recommendationScore.explanation.map((exp: string, idx: number) => (
                    <div key={idx} className="text-xs text-muted-foreground">{exp}</div>
                  ))}
                </div>
              </div>

              {/* Competing Schemes */}
              {competingSchemes.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-semibold text-sm flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-accent" />
                    <span>Nearby Competing Offers</span>
                  </h5>
                  {competingSchemes.slice(0, 2).map((scheme) => (
                    <div key={scheme.id} className="bg-accent/10 p-2 rounded border border-accent/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{scheme.projectName}</div>
                          <div className="text-xs text-muted-foreground">{scheme.builderName} • {scheme.distance}km away</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {scheme.discount}% off
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={() => onViewDetails?.(property.id)}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button 
              onClick={() => onCompare?.(property.id)}
              variant="outline"
              className="hover:bg-primary/10"
            >
              Compare
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="hover:bg-accent/10"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-center pt-1 border-t">
            Last updated: {property.lastUpdated ? new Date(property.lastUpdated).toLocaleString() : 'Recently'}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PremiumRecommendationCard;