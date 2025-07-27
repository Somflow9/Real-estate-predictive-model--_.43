import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Star, 
  Building, 
  TrendingUp, 
  Eye, 
  BarChart3, 
  Phone, 
  Share2, 
  Calendar,
  Home,
  DollarSign,
  Award,
  Shield,
  Zap,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingDown
} from 'lucide-react';

interface EnhancedDiversePropertyCardProps {
  property: {
    id: string;
    title: string;
    city: string;
    zone: string;
    locality: string;
    microMarket: string;
    price: number;
    pricePerSqft: number;
    area: number;
    bhk: string;
    builderName: string;
    builderType: 'National' | 'Regional' | 'Local' | 'Boutique';
    builderCredibility: {
      score: number;
      badge: 'Excellent' | 'Good' | 'Average' | 'New';
      completedProjects: number;
      onTimeDelivery: number;
    };
    listingType: 'Owner' | 'Broker' | 'Builder' | 'Platform';
    propertyAge: number;
    status: 'Ready' | 'Under Construction' | 'New Launch' | 'Resale';
    segment: 'Affordable' | 'Mid-Range' | 'Premium' | 'Ultra-Premium';
    reraStatus: {
      approved: boolean;
      registrationNumber: string;
      validTill?: string;
    };
    priceHistory: Array<{
      month: string;
      price: number;
    }>;
    metadata: {
      viewCount: number;
      popularityTag?: 'Trending' | 'Hot' | 'Most Viewed';
      verifiedTag: boolean;
      lastUpdated: string;
    };
    amenities: string[];
    images: string[];
    possessionDate?: string;
    isNearbyAlternative?: boolean;
    alternativeReason?: string;
  };
  rank: number;
  onViewDetails: (id: string) => void;
  onCompare: (id: string) => void;
  onContact: (id: string) => void;
  isInComparison?: boolean;
  className?: string;
}

const EnhancedDiversePropertyCard: React.FC<EnhancedDiversePropertyCardProps> = ({
  property,
  rank,
  onViewDetails,
  onCompare,
  onContact,
  isInComparison = false,
  className = ""
}) => {
  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Affordable': return 'bg-green-600 text-white';
      case 'Mid-Range': return 'bg-blue-600 text-white';
      case 'Premium': return 'bg-purple-600 text-white';
      case 'Ultra-Premium': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getBuilderTypeColor = (type: string) => {
    switch (type) {
      case 'National': return 'bg-red-600 text-white';
      case 'Regional': return 'bg-blue-600 text-white';
      case 'Local': return 'bg-green-600 text-white';
      case 'Boutique': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getCredibilityColor = (badge: string) => {
    switch (badge) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Average': return 'text-yellow-400';
      case 'New': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getListingTypeIcon = (type: string) => {
    switch (type) {
      case 'Owner': return <Users className="w-3 h-3" />;
      case 'Broker': return <Building className="w-3 h-3" />;
      case 'Builder': return <Award className="w-3 h-3" />;
      case 'Platform': return <Star className="w-3 h-3" />;
      default: return <Building className="w-3 h-3" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getPriceChange = () => {
    if (property.priceHistory.length < 2) return null;
    const latest = property.priceHistory[property.priceHistory.length - 1].price;
    const previous = property.priceHistory[property.priceHistory.length - 2].price;
    const change = ((latest - previous) / previous) * 100;
    return change;
  };

  const priceChange = getPriceChange();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card className="group bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-purple-600 text-white font-bold">
            #{rank}
          </Badge>
        </div>

        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={property.images[0] || '/placeholder.svg'} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <Badge className={getSegmentColor(property.segment)}>
              {property.segment}
            </Badge>
            {property.metadata.popularityTag && (
              <Badge className="bg-red-600 text-white animate-pulse">
                {property.metadata.popularityTag}
              </Badge>
            )}
            {property.isNearbyAlternative && (
              <Badge className="bg-orange-600 text-white">
                Nearby
              </Badge>
            )}
          </div>

          {/* Bottom badges */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <Badge className={getBuilderTypeColor(property.builderType)}>
              {property.builderType}
            </Badge>
            <Badge className="bg-background/80 backdrop-blur-sm flex items-center gap-1">
              {getListingTypeIcon(property.listingType)}
              {property.listingType}
            </Badge>
          </div>

          {/* Price trend indicator */}
          {priceChange !== null && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
              {priceChange > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(priceChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-purple-100 group-hover:text-white transition-colors line-clamp-2">
              {property.title}
            </h3>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-purple-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{property.locality}, {property.city}</span>
              </div>
              {property.microMarket && (
                <div className="text-purple-400 text-xs ml-6">
                  {property.microMarket}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-400 text-sm">
                <Building className="h-4 w-4" />
                <span>{property.builderName}</span>
              </div>
              <div className={`flex items-center space-x-1 ${getCredibilityColor(property.builderCredibility.badge)}`}>
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">{property.builderCredibility.badge}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price Information */}
          <div className="bg-purple-900/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-300 text-sm">Total Price</span>
              <span className="text-purple-400 text-sm">₹{property.pricePerSqft.toLocaleString()}/sq ft</span>
            </div>
            <div className="text-2xl font-bold text-purple-100">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-purple-300 mt-1">
              {property.area} sq ft • {property.bhk}
            </div>
          </div>

          {/* Builder Credibility */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Builder Score</span>
              <span className="text-purple-200">{property.builderCredibility.score}/10</span>
            </div>
            <Progress 
              value={property.builderCredibility.score * 10} 
              className="h-2 bg-purple-900/50"
            />
            <div className="flex justify-between text-xs text-purple-400">
              <span>{property.builderCredibility.completedProjects} projects</span>
              <span>{property.builderCredibility.onTimeDelivery}% on-time</span>
            </div>
          </div>

          {/* Status and Age */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-purple-300 text-sm">Status:</span>
              <Badge variant="outline" className="border-purple-600 text-purple-300">
                {property.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-1 text-sm text-purple-400">
              <Clock className="h-3 w-3" />
              <span>{property.propertyAge === 0 ? 'New' : `${property.propertyAge}Y old`}</span>
            </div>
          </div>

          {/* RERA Status */}
          <div className="flex items-center justify-between p-3 bg-purple-800/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-purple-200 text-sm font-medium">RERA Status</span>
            </div>
            <div className="flex items-center space-x-2">
              {property.reraStatus.approved ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <span className="text-xs font-mono text-purple-300">
                {property.reraStatus.registrationNumber || 'Not Approved'}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-purple-400">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{property.metadata.viewCount.toLocaleString()} views</span>
              {property.metadata.verifiedTag && (
                <Badge className="bg-blue-600 text-white text-xs ml-1">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Updated {new Date(property.metadata.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Amenities Preview */}
          <div className="space-y-2">
            <h4 className="text-purple-200 text-sm font-medium flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>Amenities ({property.amenities.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 4).map((amenity, idx) => (
                <Badge key={idx} variant="outline" className="border-purple-600/50 text-purple-300 text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 4 && (
                <Badge variant="outline" className="border-purple-600/50 text-purple-300 text-xs">
                  +{property.amenities.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Possession Date */}
          {property.possessionDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-300">Possession:</span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-purple-400" />
                <span className="text-purple-200">{new Date(property.possessionDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Alternative Reason */}
          {property.isNearbyAlternative && property.alternativeReason && (
            <div className="p-2 bg-orange-900/20 border border-orange-600/30 rounded-lg">
              <p className="text-orange-300 text-xs">{property.alternativeReason}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={() => onViewDetails(property.id)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button 
              onClick={() => onCompare(property.id)}
              variant={isInComparison ? "default" : "outline"}
              className={isInComparison 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
              }
            >
              <BarChart3 className="h-4 w-4" />
              {isInComparison && <span className="ml-1 text-xs">✓</span>}
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="flex space-x-2">
            <Button
              onClick={() => onContact(property.id)}
              variant="outline"
              className="flex-1 border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedDiversePropertyCard;