import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Building, TrendingUp, TrendingDown, Minus, Eye, BarChart3, Phone, Share2, Calendar, Shield, Clock, Users, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { usePropertyActions } from '@/hooks/usePropertyActions';

interface PropertySource {
  name: string;
  logo?: string;
  verified: boolean;
}

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    city: string;
    zone?: string;
    locality: string;
    microMarket?: string;
    price: number;
    area: number;
    bhk: string;
    builderName: string;
    builderType?: 'National' | 'Regional' | 'Local' | 'Boutique';
    builderCredibility?: {
      score: number;
      badge: 'Excellent' | 'Good' | 'Average' | 'New';
      completedProjects: number;
      onTimeDelivery: number;
    };
    listingType?: 'Owner' | 'Broker' | 'Builder' | 'Platform';
    propertyAge?: number;
    status?: 'Ready' | 'Under Construction' | 'New Launch' | 'Resale';
    segment?: 'Affordable' | 'Mid-Range' | 'Premium' | 'Ultra-Premium';
    reraStatus?: {
      approved: boolean;
      registrationNumber: string;
      validTill?: string;
    };
    metadata?: {
      viewCount: number;
      popularityTag?: 'Trending' | 'Hot' | 'Most Viewed';
      verifiedTag: boolean;
      lastUpdated: string;
    };
    possessionDate?: string;
    isNearbyAlternative?: boolean;
    alternativeReason?: string;
    builderRating?: number;
    image?: string;
    pricePerSqft: number;
    amenities?: string[];
    source?: PropertySource;
  };
  onViewDetails?: (id: string) => void;
  onCompare?: (id: string) => void;
  className?: string;
}

const EnhancedPropertyCard = ({ property, className = "" }: PropertyCardProps) => {
  const {
    handleViewDetails,
    handleCompare,
    handleContactBuilder,
    handleShare,
    isInComparison,
    isActionLoading
  } = usePropertyActions();

  const propertyData = {
    id: property.id,
    title: property.title,
    price: property.price,
    location: `${property.locality}, ${property.city}`,
    image: property.image,
    builderName: property.builderName || 'Unknown Builder'
  };

  const inComparison = isInComparison(property.id);

  const getBuilderCredibilityColor = (badge?: string) => {
    switch (badge) {
      case 'Excellent': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Good': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'Average': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'New': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSegmentColor = (segment?: string) => {
    switch (segment) {
      case 'Affordable': return 'bg-green-600 text-white';
      case 'Mid-Range': return 'bg-blue-600 text-white';
      case 'Premium': return 'bg-purple-600 text-white';
      case 'Ultra-Premium': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getListingTypeIcon = (type?: string) => {
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
            {property.segment && (
              <Badge className={`${getSegmentColor(property.segment)} font-semibold`}>
                {property.segment}
              </Badge>
            )}
            {property.reraStatus?.approved && (
              <Badge className="bg-green-600 text-white">
                RERA Approved
              </Badge>
            )}
            {property.isNearbyAlternative && (
              <Badge className="bg-orange-600 text-white">
                Nearby Alternative
              </Badge>
            )}
          </div>

          {/* Listing type and source badges */}
          <div className="absolute top-3 right-3">
            <div className="flex flex-col gap-1">
              {property.listingType && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm flex items-center gap-1">
                  {getListingTypeIcon(property.listingType)}
                  {property.listingType}
                </Badge>
              )}
              {property.source && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {property.source.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata indicators */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
            {property.metadata?.popularityTag && (
              <Badge className="bg-red-600 text-white text-xs">
                {property.metadata.popularityTag}
              </Badge>
            )}
            {property.metadata?.verifiedTag && (
              <Badge className="bg-blue-600 text-white text-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Property age indicator */}
          {property.propertyAge !== undefined && (
            <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-xs font-medium">
                {property.propertyAge === 0 ? 'New' : `${property.propertyAge}Y old`}
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
            <div className="truncate">
              <span>{property.locality}, {property.city}</span>
              {property.microMarket && (
                <div className="text-xs text-muted-foreground">{property.microMarket}</div>
              )}
            </div>
          </div>

          {/* Builder info with credibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium truncate">{property.builderName}</span>
                {property.builderType && (
                  <div className="text-xs text-muted-foreground">{property.builderType}</div>
                )}
              </div>
            </div>
            
            {property.builderCredibility ? (
              <div className="flex items-center gap-1">
                <Badge className={`text-xs ${getBuilderCredibilityColor(property.builderCredibility.badge)}`}>
                  {property.builderCredibility.badge}
                </Badge>
                <span className="text-sm font-medium">{property.builderCredibility.score}</span>
              </div>
            ) : property.builderRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{property.builderRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Status and possession */}
          <div className="flex items-center justify-between text-sm">
            {property.status && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline">{property.status}</Badge>
              </div>
            )}
            {property.possessionDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{new Date(property.possessionDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* RERA Status */}
          {property.reraStatus && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">RERA:</span>
              </div>
              <div className="flex items-center gap-1">
                {property.reraStatus.approved ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs font-mono">{property.reraStatus.registrationNumber || 'Not Approved'}</span>
              </div>
            </div>
          )}

          {/* View count and last updated */}
          {property.metadata && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{property.metadata.viewCount.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Updated {new Date(property.metadata.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => handleViewDetails(property.id, property.title)}
              disabled={isActionLoading('details', property.id)}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button 
              onClick={() => handleCompare(property.id, propertyData)}
              disabled={isActionLoading('compare', property.id)}
              variant="outline"
              size="sm"
              className={`hover:bg-primary/10 ${inComparison ? 'bg-primary/20 border-primary' : ''}`}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              {inComparison ? 'Added' : 'Compare'}
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleContactBuilder(
                { id: property.id, builderName: property.builderName || 'Builder', title: property.title },
                {
                  name: 'User',
                  email: 'user@example.com',
                  phone: '+91 98765 43210',
                  message: `I am interested in ${property.title}. Please provide more details.`,
                  requestType: 'General Inquiry'
                }
              )}
              disabled={isActionLoading('contact', property.id)}
              variant="outline"
              className="flex-1"
              className="hover:bg-green-600/10 border-green-600 text-green-400"
            >
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
            
            <Button
              onClick={() => handleShare(propertyData)}
              variant="outline"
              size="sm"
              className="hover:bg-blue-600/10 border-blue-600 text-blue-400"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Last updated */}
          {property.metadata?.lastUpdated && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              Updated {new Date(property.metadata.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedPropertyCard;