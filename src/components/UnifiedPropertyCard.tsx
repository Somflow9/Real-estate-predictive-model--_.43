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
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface UnifiedPropertyCardProps {
  property: {
    id: string;
    title: string;
    city: string;
    locality: string;
    price: number;
    pricePerSqft: number;
    area: number;
    bhk: string;
    builderName: string;
    status: string;
    possessionDate: string;
    amenities: string[];
    source: 'api' | 'local';
    apiSource?: 'housing' | 'squareyards' | 'nobroker';
    brickMatrixScore?: number;
    recommendation?: {
      action: string;
      confidence: number;
      reasoning: string;
    };
    images?: string[];
    coordinates?: { lat: number; lng: number };
    isDuplicate?: boolean;
    duplicateReason?: string;
  };
  rank: number;
  onViewDetails: (id: string) => void;
  onCompare: (id: string) => void;
  onContact: (id: string) => void;
  className?: string;
}

const UnifiedPropertyCard: React.FC<UnifiedPropertyCardProps> = ({
  property,
  rank,
  onViewDetails,
  onCompare,
  onContact,
  className = ""
}) => {
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'housing': return 'bg-blue-600 text-white';
      case 'squareyards': return 'bg-green-600 text-white';
      case 'nobroker': return 'bg-orange-600 text-white';
      case 'local': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'housing': return '🏠';
      case 'squareyards': return '🏢';
      case 'nobroker': return '🏘️';
      case 'local': return '🔮';
      default: return '📍';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 8.5) return 'text-green-400';
    if (score >= 7.0) return 'text-purple-400';
    if (score >= 6.0) return 'text-blue-400';
    return 'text-yellow-400';
  };

  const getActionColor = (action?: string) => {
    switch (action) {
      case 'strong_buy': return 'bg-gradient-to-r from-green-600 to-green-400';
      case 'buy': return 'bg-gradient-to-r from-purple-600 to-purple-400';
      case 'consider': return 'bg-gradient-to-r from-blue-600 to-blue-400';
      case 'wait': return 'bg-gradient-to-r from-orange-600 to-orange-400';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-400';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card className="group bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
        {/* Rank and Source Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <Badge className="bg-purple-600 text-white font-bold">
            #{rank}
          </Badge>
          <Badge className={getSourceColor(property.apiSource || property.source)}>
            {getSourceIcon(property.apiSource || property.source)} {property.apiSource || property.source}
          </Badge>
        </div>

        {/* Duplicate Warning */}
        {property.isDuplicate && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-yellow-600 text-white text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Duplicate
            </Badge>
          </div>
        )}

        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={property.images?.[0] || '/placeholder.svg'} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Score Overlay */}
          {property.brickMatrixScore && (
            <div className="absolute bottom-3 right-3">
              <div className={`text-2xl font-bold ${getScoreColor(property.brickMatrixScore)} bg-black/70 rounded-lg px-2 py-1`}>
                {property.brickMatrixScore}
              </div>
              <div className="text-xs text-purple-400 text-center mt-1 bg-black/60 rounded px-2 py-1">
                BrickMatrix™
              </div>
            </div>
          )}

          {/* API Source Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm">
              {property.source === 'api' ? 'Live API' : 'Local DB'}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-purple-100 group-hover:text-white transition-colors line-clamp-2">
              {property.title}
            </h3>
            
            <div className="flex items-center space-x-2 text-purple-300 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{property.locality}, {property.city}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-purple-400 text-sm">
              <Building className="h-4 w-4" />
              <span>{property.builderName}</span>
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

          {/* Status and Possession */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-purple-300 text-sm">Status:</span>
              <Badge variant="outline" className="border-purple-600 text-purple-300">
                {property.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-1 text-sm text-purple-400">
              <Calendar className="h-3 w-3" />
              <span>{property.possessionDate}</span>
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

          {/* Recommendation */}
          {property.recommendation && (
            <div className={`p-4 rounded-lg ${getActionColor(property.recommendation.action)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm uppercase flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{property.recommendation.action.replace('_', ' ')}</span>
                </span>
                <span className="text-white text-sm">
                  {property.recommendation.confidence}% Confidence
                </span>
              </div>
              <p className="text-white/90 text-xs leading-relaxed">
                {property.recommendation.reasoning}
              </p>
            </div>
          )}

          {/* Duplicate Warning */}
          {property.isDuplicate && property.duplicateReason && (
            <div className="p-2 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <p className="text-yellow-300 text-xs">{property.duplicateReason}</p>
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
              variant="outline" 
              className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
            >
              <BarChart3 className="h-4 w-4" />
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

            {/* External Link for API properties */}
            {property.source === 'api' && (
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Data Source Info */}
          <div className="text-xs text-purple-400 text-center pt-2 border-t border-purple-600/30">
            {property.source === 'api' ? (
              <span>Live data from {property.apiSource}</span>
            ) : (
              <span>BrickMatrix™ Intelligence</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UnifiedPropertyCard;