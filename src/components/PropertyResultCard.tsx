import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Star, 
  Building, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  BarChart3, 
  Phone, 
  Share2, 
  Calendar,
  Home,
  DollarSign
} from 'lucide-react';

interface PropertyResultCardProps {
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
    brickMatrixScore: number;
    recommendation: {
      action: string;
      confidence: number;
      reasoning: string;
    };
    badges: string[];
    segment: {
      type: string;
      color: string;
    };
    images?: string[];
  };
  rank: number;
  onViewDetails: (id: string) => void;
  onCompare: (id: string) => void;
  onSaveProperty: (id: string) => void;
}

const PropertyResultCard: React.FC<PropertyResultCardProps> = ({
  property,
  rank,
  onViewDetails,
  onCompare,
  onSaveProperty
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-green-400';
    if (score >= 8.0) return 'text-purple-400';
    if (score >= 7.0) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'strong_buy': return 'bg-gradient-to-r from-green-600 to-green-400';
      case 'buy': return 'bg-gradient-to-r from-purple-600 to-purple-400';
      case 'consider': return 'bg-gradient-to-r from-blue-600 to-blue-400';
      case 'wait': return 'bg-gradient-to-r from-orange-600 to-orange-400';
      default: return 'bg-gradient-to-r from-purple-600 to-purple-400';
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
            src={property.images?.[0] || '/placeholder.svg'} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Score Overlay */}
          <div className="absolute top-3 right-3">
            <div className={`text-2xl font-bold ${getScoreColor(property.brickMatrixScore)} bg-black/70 rounded-lg px-2 py-1`}>
              {property.brickMatrixScore}
            </div>
          </div>

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            {property.badges.slice(0, 2).map((badge, idx) => (
              <Badge key={idx} className="bg-purple-600/80 text-white text-xs">
                {badge}
              </Badge>
            ))}
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

          {/* Recommendation */}
          <div className={`p-4 rounded-lg ${getActionColor(property.recommendation.action)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm uppercase">
                {property.recommendation.action.replace('_', ' ')}
              </span>
              <span className="text-white text-sm">
                {property.recommendation.confidence}% Confidence
              </span>
            </div>
            <p className="text-white/90 text-xs">
              {property.recommendation.reasoning}
            </p>
          </div>

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
              onClick={() => onSaveProperty(property.id)}
              variant="outline"
              className="flex-1 border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
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

export default PropertyResultCard;