import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Building, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PropertySource {
  name: string;
  logo?: string;
  verified: boolean;
}

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    area: number;
    location: string;
    builder: string;
    builderRating?: number;
    reraApproved?: boolean;
    possessionStatus?: string;
    image?: string;
    pricePerSqft: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    source: PropertySource;
    valuation?: 'Under Market' | 'Overpriced' | 'Fair Deal';
    priceChange?: number; // percentage change
    lastUpdated?: string;
  };
  onViewDetails?: (id: string) => void;
  onCompare?: (id: string) => void;
  className?: string;
}

const EnhancedPropertyCard = ({ property, onViewDetails, onCompare, className = "" }: PropertyCardProps) => {
  const getValuationColor = (valuation?: string) => {
    switch (valuation) {
      case 'Under Market': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Overpriced': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'Fair Deal': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriceChangeIcon = (change?: number) => {
    if (!change) return <Minus className="w-3 h-3" />;
    return change > 0 ? <TrendingUp className="w-3 h-3 text-green-600" /> : <TrendingDown className="w-3 h-3 text-red-600" />;
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
      <Card className="group cursor-pointer glassmorphism glow-border hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={property.image || '/placeholder.svg'} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.valuation && (
              <Badge className={`${getValuationColor(property.valuation)} font-semibold`}>
                {property.valuation}
              </Badge>
            )}
            {property.reraApproved && (
              <Badge className="bg-green-600 text-white">
                RERA Approved
              </Badge>
            )}
          </div>

          {/* Source badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {property.source.name}
            </Badge>
          </div>

          {/* Price change indicator */}
          {property.priceChange && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
              {getPriceChangeIcon(property.priceChange)}
              <span className={`text-xs font-medium ${property.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(property.priceChange)}%
              </span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(property.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ₹{property.pricePerSqft.toLocaleString()}/sq.ft
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {property.area.toLocaleString()} sq.ft
                </p>
                {property.bedrooms && (
                  <p className="text-sm text-muted-foreground">
                    {property.bedrooms}BHK
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Builder info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{property.builder}</span>
            </div>
            
            {property.builderRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{property.builderRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Status */}
          {property.possessionStatus && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Possession:</span>
              <Badge variant="outline">{property.possessionStatus}</Badge>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onViewDetails?.(property.id)}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg"
              size="sm"
            >
              View Details
            </Button>
            <Button 
              onClick={() => onCompare?.(property.id)}
              variant="outline"
              size="sm"
              className="hover:bg-primary/10"
            >
              Compare
            </Button>
          </div>

          {/* Last updated */}
          {property.lastUpdated && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              Updated {property.lastUpdated}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedPropertyCard;