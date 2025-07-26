import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Building, 
  Star, 
  Shield, 
  Home, 
  TrendingUp, 
  Clock, 
  Calculator,
  Eye,
  Heart,
  Share2,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePropertyActions } from '@/hooks/usePropertyActions';

interface BrickMatrixProperty {
  id: string;
  title: string;
  city: string;
  locality: string;
  price: number;
  carpetArea: number;
  builtUpArea: number;
  bhk: string;
  propertyType: 'Apartment' | 'Studio' | 'Villa' | 'Penthouse';
  possessionStatus: 'Ready' | 'Under Construction' | 'Pre-launch';
  furnishing: 'Unfurnished' | 'Semi-furnished' | 'Fully-furnished';
  floor: number;
  totalFloors: number;
  facing: string;
  smartHome: boolean;
  vaastuCompliant: boolean;
  igbcCertified: boolean;
  builderName: string;
  projectName: string;
  reraId: string;
  amenities: string[];
  images: string[];
  
  locationIntelligence: any;
  builderIntelligence: any;
  pricingIntelligence: any;
  segment: {
    type: 'Budget' | 'Mid-Range' | 'Premium';
    color: string;
    description: string;
  };
  popularityMetrics: any;
  
  brickMatrixScore: number;
  builderTrust: number;
  localityScore: number;
  amenitiesScore: number;
  roiForecast: number;
  possessionAccuracy: number;
  
  whySuggested: string[];
  lastUpdated: string;
}

interface PropertyResultCardProps {
  property: BrickMatrixProperty;
  rank: number;
}

const PropertyResultCard: React.FC<PropertyResultCardProps> = ({ property, rank }) => {
  const {
    handleViewDetails,
    handleCompare,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    handleContactBuilder,
    handleShare,
    handleScheduleSiteVisit,
    isInWishlist,
    isInComparison,
    isActionLoading
  } = usePropertyActions();

  const propertyData = {
    id: property.id,
    title: property.title,
    price: property.price,
    location: property.locality,
    image: property.images[0],
    builderName: property.builderName
  };

  const inWishlist = isInWishlist(property.id);
  const inComparison = isInComparison(property.id);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const calculateEMI = (price: number) => {
    const principal = price * 0.8; // 80% loan
    const rate = 8.5 / 100 / 12; // 8.5% annual rate
    const tenure = 20 * 12; // 20 years
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Budget': return 'bg-green-600 text-white';
      case 'Mid-Range': return 'bg-purple-600 text-white';
      case 'Premium': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-green-400';
    if (score >= 3.0) return 'text-purple-400';
    if (score >= 2.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPossessionStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'Under Construction': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'Pre-launch': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🏆', text: 'Best Match', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' };
    if (rank === 2) return { icon: '🥈', text: 'Great Choice', color: 'bg-gradient-to-r from-gray-400 to-gray-500' };
    if (rank === 3) return { icon: '🥉', text: 'Good Option', color: 'bg-gradient-to-r from-orange-500 to-orange-600' };
    return { icon: '⭐', text: `#${rank}`, color: 'bg-gradient-to-r from-purple-500 to-purple-600' };
  };

  const rankBadge = getRankBadge(rank);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: rank * 0.05 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="group"
      >
        <Card className="bg-black border border-purple-600/30 hover:border-purple-400/60 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-purple-500/20">
          {/* Header with Rank and Segment */}
          <div className="relative">
            <div className="absolute top-4 left-4 z-10">
              <Badge className={`${rankBadge.color} text-white px-3 py-1 text-sm font-bold`}>
                {rankBadge.icon} {rankBadge.text}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <Badge className={`${getSegmentColor(property.segment.type)} text-xs`}>
                {property.segment.type}
              </Badge>
            </div>
            
            {/* Property Image */}
            <div className="h-48 bg-gradient-to-br from-purple-900/30 to-black relative overflow-hidden">
              <img 
                src={property.images[0] || '/placeholder.svg'} 
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              {/* Trending Badge */}
              {property.popularityMetrics.trending && (
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    🔥 Trending
                  </Badge>
                </div>
              )}

              {/* Quick Actions */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button size="sm" variant="secondary" className="bg-black/60 backdrop-blur-sm border-purple-600/30 hover:bg-purple-600">
                  <Heart 
                    className={`h-4 w-4 ${inWishlist ? 'fill-current text-red-400' : ''}`}
                    onClick={() => inWishlist ? handleRemoveFromWishlist(property.id) : handleAddToWishlist(propertyData)}
                  />
                </Button>
                <Button size="sm" variant="secondary" className="bg-black/60 backdrop-blur-sm border-purple-600/30 hover:bg-purple-600">
                  <Share2 
                    className="h-4 w-4"
                    onClick={() => handleShare(propertyData)}
                  />
                </Button>
              </div>
            </div>
          </div>

          <CardHeader className="pb-2">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">
                    {property.title}
                  </h3>
                  <p className="text-purple-300 text-sm font-medium">{property.projectName}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{property.locality}, {property.city}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-400">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-400">
                    ₹{Math.round(property.price / property.carpetArea).toLocaleString()}/sq ft
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-purple-300 mt-1">
                    <Calculator className="h-3 w-3" />
                    <span>EMI: ₹{calculateEMI(property.price).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Builder Reputation Bar */}
            <div className="bg-gray-900/50 p-4 rounded-xl border border-purple-600/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-medium text-sm">{property.builderName}</span>
                  {property.builderIntelligence.reraVerified && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>
                <div className={`text-lg font-bold ${getScoreColor(property.builderTrust)}`}>
                  {property.builderTrust}/5
                </div>
              </div>
              <Progress 
                value={property.builderTrust * 20} 
                className="h-2 bg-gray-800"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Delivery Rate: {property.builderIntelligence.deliverySuccessRate}%</span>
                <span>Avg Delay: {property.builderIntelligence.avgDelay}mo</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900/50 p-3 rounded-lg text-center border border-purple-600/20">
                <div className="text-lg font-bold text-white">{property.carpetArea}</div>
                <div className="text-xs text-gray-400">Carpet Area</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg text-center border border-purple-600/20">
                <div className="text-lg font-bold text-white">{property.bhk}</div>
                <div className="text-xs text-gray-400">Configuration</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg text-center border border-purple-600/20">
                <div className="text-lg font-bold text-white">{property.floor}/{property.totalFloors}</div>
                <div className="text-xs text-gray-400">Floor</div>
              </div>
            </div>

            {/* Key Ratings */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm flex items-center space-x-2">
                <Star className="h-4 w-4 text-purple-400" />
                <span>Key Ratings</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Builder Trust</span>
                    <span className={`font-bold ${getScoreColor(property.builderTrust)}`}>
                      {property.builderTrust}/5
                    </span>
                  </div>
                  <Progress value={property.builderTrust * 20} className="h-1 bg-gray-800" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Locality</span>
                    <span className={`font-bold ${getScoreColor(property.localityScore)}`}>
                      {property.localityScore}/5
                    </span>
                  </div>
                  <Progress value={property.localityScore * 20} className="h-1 bg-gray-800" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Amenities</span>
                    <span className={`font-bold ${getScoreColor(property.amenitiesScore)}`}>
                      {property.amenitiesScore}/5
                    </span>
                  </div>
                  <Progress value={property.amenitiesScore * 20} className="h-1 bg-gray-800" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">ROI Forecast</span>
                    <span className={`font-bold ${getScoreColor(property.roiForecast / 5)}`}>
                      {property.roiForecast}%
                    </span>
                  </div>
                  <Progress value={property.roiForecast * 2} className="h-1 bg-gray-800" />
                </div>
              </div>
            </div>

            {/* Nearby Commute */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>Nearby Commute</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {property.locationIntelligence.nearbyFacilities.metro.map((metro: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Metro: {metro.distance}km</span>
                  </div>
                ))}
                {property.locationIntelligence.nearbyFacilities.shopping.map((shop: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Mall: {shop.distance}km</span>
                  </div>
                ))}
                {property.locationIntelligence.nearbyFacilities.schools.map((school: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">School: {school.distance}km</span>
                  </div>
                ))}
                {property.locationIntelligence.nearbyFacilities.hospitals.map((hospital: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-gray-300">Hospital: {hospital.distance}km</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenity Chips */}
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-sm flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Amenities</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 6).map((amenity, idx) => (
                  <Badge key={idx} variant="outline" className="border-purple-600/50 text-purple-300 text-xs">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 6 && (
                  <Badge variant="outline" className="border-purple-600/50 text-purple-300 text-xs">
                    +{property.amenities.length - 6} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Why Suggested */}
            <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-600/30">
              <div className="flex items-center space-x-2 mb-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-1">
                      <Info className="h-4 w-4 text-purple-400" />
                      <span className="text-white font-semibold text-sm">Why Suggested?</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-purple-600">
                    <p className="text-xs">BrickMatrix™ Engine explainability</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-1">
                {property.whySuggested.slice(0, 2).map((reason, idx) => (
                  <div key={idx} className="text-xs text-purple-300 flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status and Certifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`${getPossessionStatusColor(property.possessionStatus)} border text-xs`}>
                  {property.possessionStatus}
                </Badge>
                {property.igbcCertified && (
                  <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                    IGBC
                  </Badge>
                )}
                {property.smartHome && (
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                    Smart Home
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Shield className="h-3 w-3" />
                <span>RERA: {property.reraId}</span>
              </div>
            </div>

            {/* Builder Portfolio Link */}
            <div className="bg-gray-900/50 p-3 rounded-lg border border-purple-600/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-white font-medium">Builder Portfolio</div>
                  <div className="text-xs text-gray-400">
                    {property.builderIntelligence.pastProjects.length} completed projects
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                onClick={() => handleViewDetails(property.id, property.title)}
                disabled={isActionLoading('details', property.id)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isActionLoading('details', property.id) ? 'Loading...' : 'View Details'}
              </Button>
              <Button 
                onClick={() => handleCompare(property.id, propertyData)}
                disabled={isActionLoading('compare', property.id)}
                variant="outline"
                className={`border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white ${
                  inComparison ? 'bg-purple-600/20 border-purple-400' : ''
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                {inComparison ? 'Added' : 'Compare'}
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex space-x-2 pt-2">
              <Button
                onClick={() => handleContactBuilder(
                  { id: property.id, builderName: property.builderName, title: property.title },
                  {
                    name: 'User',
                    email: 'user@example.com',
                    phone: '+91 98765 43210',
                    message: `I am interested in ${property.title}. Please provide more details and arrange a site visit.`,
                    requestType: 'Site Visit'
                  }
                )}
                disabled={isActionLoading('contact', property.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                {isActionLoading('contact', property.id) ? 'Contacting...' : 'Contact Builder'}
              </Button>
              
              <Button
                onClick={() => handleScheduleSiteVisit(
                  { id: property.id, builderName: property.builderName, title: property.title },
                  {
                    preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    preferredTime: '11:00 AM',
                    contactInfo: {
                      name: 'User',
                      email: 'user@example.com',
                      phone: '+91 98765 43210'
                    }
                  }
                )}
                disabled={isActionLoading('visit', property.id)}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {isActionLoading('visit', property.id) ? 'Scheduling...' : 'Site Visit'}
              </Button>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-purple-600/20">
              <div className="flex items-center justify-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Updated: {new Date(property.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default PropertyResultCard;