import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  MapPin, 
  Building, 
  Star, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Clock,
  Car,
  Train,
  Plane,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Camera,
  FileText,
  DollarSign,
  BarChart3,
  Award,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Share2,
  Heart,
  Eye,
  Users,
  Home,
  Zap,
  Leaf,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyDetailsService } from '@/services/propertyDetailsService';
import { wishlistService } from '@/services/wishlistService';
import { builderContactService } from '@/services/builderContactService';
import { useToast } from '@/hooks/use-toast';
import LoadingScreen from './LoadingScreen';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle?: string;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle
}) => {
  const { toast } = useToast();
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    if (isOpen && propertyId) {
      loadPropertyDetails();
      setIsInWishlist(wishlistService.isInWishlist(propertyId));
    }
  }, [isOpen, propertyId]);

  const loadPropertyDetails = async () => {
    setLoading(true);
    try {
      const details = await propertyDetailsService.fetchPropertyDetails(propertyId);
      setPropertyDetails(details);
    } catch (error) {
      toast({
        title: "Error Loading Details",
        description: "Failed to load property details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!propertyDetails) return;

    const success = wishlistService.addToWishlist({
      id: propertyId,
      title: propertyDetails.basicInfo.title,
      price: propertyDetails.basicInfo.price,
      location: propertyDetails.location.locality,
      image: propertyDetails.images.exterior[0]
    });

    if (success) {
      setIsInWishlist(true);
      toast({
        title: "Added to Wishlist",
        description: "Property has been added to your wishlist",
      });
    } else {
      toast({
        title: "Already in Wishlist",
        description: "This property is already in your wishlist",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromWishlist = () => {
    const success = wishlistService.removeFromWishlist(propertyId);
    if (success) {
      setIsInWishlist(false);
      toast({
        title: "Removed from Wishlist",
        description: "Property has been removed from your wishlist",
      });
    }
  };

  const handleContactBuilder = async (contactInfo: any) => {
    setContactLoading(true);
    try {
      const result = await builderContactService.contactBuilder({
        propertyId,
        builderName: propertyDetails.builder.name,
        userInfo: contactInfo,
        requestType: 'General Inquiry'
      });

      if (result.success) {
        toast({
          title: "Contact Request Sent",
          description: result.message,
        });
        setShowContactForm(false);
      } else {
        toast({
          title: "Contact Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send contact request",
        variant: "destructive"
      });
    } finally {
      setContactLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready to move':
      case 'completed':
        return 'bg-green-600';
      case 'under construction':
        return 'bg-yellow-600';
      case 'new launch':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-black border border-purple-600/30">
          <LoadingScreen message="Loading detailed property information..." />
        </DialogContent>
      </Dialog>
    );
  }

  if (!propertyDetails) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-black border border-purple-600/30 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-bold text-white">
                  {propertyDetails.basicInfo.title}
                </DialogTitle>
                <div className="flex items-center space-x-2 text-purple-300">
                  <MapPin className="h-4 w-4" />
                  <span>{propertyDetails.location.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(propertyDetails.basicInfo.status)} text-white`}>
                    {propertyDetails.basicInfo.status}
                  </Badge>
                  <Badge variant="outline" className="border-purple-600 text-purple-300">
                    {propertyDetails.basicInfo.bhk}
                  </Badge>
                  <Badge variant="outline" className="border-purple-600 text-purple-300">
                    {propertyDetails.basicInfo.area} sq ft
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-400">
                    {formatPrice(propertyDetails.basicInfo.price)}
                  </div>
                  <div className="text-sm text-purple-300">
                    ₹{propertyDetails.pricing.pricePerSqft.toLocaleString()}/sq ft
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-purple-400 hover:text-white hover:bg-purple-600/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-b border-purple-600/30">
            <div className="flex items-center space-x-3">
              <Button
                onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                className={`${isInWishlist ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              
              <Button
                onClick={() => setShowContactForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Builder
              </Button>
              
              <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Download Brochure
              </Button>
              
              <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Source
              </Button>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mx-6 mt-4 bg-purple-900/50 border border-purple-600/30">
                <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="amenities" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Amenities
                </TabsTrigger>
                <TabsTrigger value="location" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Location
                </TabsTrigger>
                <TabsTrigger value="builder" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Builder
                </TabsTrigger>
                <TabsTrigger value="legal" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Legal
                </TabsTrigger>
                <TabsTrigger value="investment" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Investment
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  {/* Property Images */}
                  <Card className="bg-gray-900/50 border border-purple-600/30">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {propertyDetails.images.exterior.map((image: string, index: number) => (
                          <div key={index} className="relative group cursor-pointer">
                            <img 
                              src={image} 
                              alt={`Property view ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <Home className="h-5 w-5 text-purple-400" />
                          <span>Property Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-purple-300 text-sm">Type</span>
                            <p className="text-white font-medium">{propertyDetails.basicInfo.propertyType}</p>
                          </div>
                          <div>
                            <span className="text-purple-300 text-sm">Configuration</span>
                            <p className="text-white font-medium">{propertyDetails.basicInfo.bhk}</p>
                          </div>
                          <div>
                            <span className="text-purple-300 text-sm">Carpet Area</span>
                            <p className="text-white font-medium">{propertyDetails.basicInfo.area} sq ft</p>
                          </div>
                          <div>
                            <span className="text-purple-300 text-sm">Facing</span>
                            <p className="text-white font-medium">{propertyDetails.basicInfo.facing}</p>
                          </div>
                          <div>
                            <span className="text-purple-300 text-sm">Floor</span>
                            <p className="text-white font-medium">{propertyDetails.basicInfo.floor}</p>
                          </div>
                          <div>
                            <span className="text-purple-300 text-sm">Furnishing</span>
                            <p className="text-white font-medium">{propertyDetails.basicInfo.furnishing}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-purple-400" />
                          <span>Investment Highlights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300 text-sm">ROI Potential</span>
                            <span className="text-green-400 font-bold">{propertyDetails.investment.roi}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300 text-sm">Rental Yield</span>
                            <span className="text-blue-400 font-bold">{propertyDetails.investment.rentalYield}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300 text-sm">Investment Grade</span>
                            <Badge className="bg-purple-600 text-white">{propertyDetails.investment.investmentGrade}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300 text-sm">Market Trend</span>
                            <div className="flex items-center space-x-1">
                              {propertyDetails.investment.marketTrend === 'Rising' ? (
                                <TrendingUp className="h-4 w-4 text-green-400" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-400" />
                              )}
                              <span className={`font-medium ${
                                propertyDetails.investment.marketTrend === 'Rising' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {propertyDetails.investment.marketTrend}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Reviews Summary */}
                  <Card className="bg-gray-900/50 border border-purple-600/30">
                    <CardHeader>
                      <CardTitle className="text-purple-100 flex items-center space-x-2">
                        <Star className="h-5 w-5 text-purple-400" />
                        <span>Reviews & Ratings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl font-bold text-purple-400">
                              {propertyDetails.reviews.overall}
                            </div>
                            <div>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-5 w-5 ${
                                      star <= propertyDetails.reviews.overall 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-600'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <p className="text-purple-300 text-sm">{propertyDetails.reviews.count} reviews</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {Object.entries(propertyDetails.reviews.breakdown).map(([category, rating]) => (
                              <div key={category} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-purple-300 capitalize">{category}</span>
                                  <span className="text-purple-200">{rating}/5</span>
                                </div>
                                <Progress value={(rating as number) * 20} className="h-2 bg-gray-800" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-purple-200 font-semibold">Recent Reviews</h4>
                          {propertyDetails.reviews.recent.map((review: any) => (
                            <div key={review.id} className="p-3 bg-purple-900/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-purple-200 font-medium">{review.user}</span>
                                  {review.verified && (
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-3 w-3 ${
                                        star <= review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-600'
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-purple-300 text-sm">{review.comment}</p>
                              <div className="flex items-center justify-between mt-2 text-xs text-purple-400">
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                                <span>{review.helpful} helpful</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6 mt-0">
                  {/* Price Breakdown */}
                  <Card className="bg-gray-900/50 border border-purple-600/30">
                    <CardHeader>
                      <CardTitle className="text-purple-100 flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-purple-400" />
                        <span>Price Breakdown</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Base Price</span>
                              <span className="text-white font-bold">{formatPrice(propertyDetails.pricing.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Maintenance Charges</span>
                              <span className="text-white">₹{propertyDetails.pricing.maintenanceCharges.toLocaleString()}/month</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Parking Charges</span>
                              <span className="text-white">{formatPrice(propertyDetails.pricing.parkingCharges)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Registration</span>
                              <span className="text-white">{formatPrice(propertyDetails.pricing.registrationCharges)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Stamp Duty</span>
                              <span className="text-white">{formatPrice(propertyDetails.pricing.stampDuty)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">GST</span>
                              <span className="text-white">{formatPrice(propertyDetails.pricing.gst)}</span>
                            </div>
                            <Separator className="bg-purple-600/30" />
                            <div className="flex justify-between items-center text-lg">
                              <span className="text-purple-200 font-bold">Total Cost</span>
                              <span className="text-purple-400 font-bold">{formatPrice(propertyDetails.pricing.totalCost)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-purple-200 font-semibold">EMI Calculator</h4>
                          <div className="p-4 bg-purple-900/30 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Monthly EMI</span>
                              <span className="text-green-400 font-bold text-xl">₹{propertyDetails.pricing.emiCalculation.monthlyEmi.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Interest Rate</span>
                              <span className="text-white">{propertyDetails.pricing.emiCalculation.interestRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Tenure</span>
                              <span className="text-white">{propertyDetails.pricing.emiCalculation.tenure} years</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-300">Total Interest</span>
                              <span className="text-white">{formatPrice(propertyDetails.pricing.emiCalculation.totalInterest)}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h5 className="text-purple-200 font-medium">Market Comparison</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-purple-300 text-sm">Locality Average</span>
                                <span className="text-white">₹{propertyDetails.pricing.marketComparison.localityAverage.toLocaleString()}/sq ft</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-purple-300 text-sm">City Average</span>
                                <span className="text-white">₹{propertyDetails.pricing.marketComparison.cityAverage.toLocaleString()}/sq ft</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-purple-300 text-sm">Price Appreciation</span>
                                <span className="text-green-400">+{propertyDetails.pricing.marketComparison.priceAppreciation}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(propertyDetails.amenities).filter(([key]) => key !== 'nearby').map(([category, amenities]) => (
                      <Card key={category} className="bg-gray-900/50 border border-purple-600/30">
                        <CardHeader>
                          <CardTitle className="text-purple-100 flex items-center space-x-2 capitalize">
                            {category === 'basic' && <Home className="h-5 w-5 text-purple-400" />}
                            {category === 'recreational' && <Users className="h-5 w-5 text-purple-400" />}
                            {category === 'security' && <Shield className="h-5 w-5 text-purple-400" />}
                            {category === 'convenience' && <Zap className="h-5 w-5 text-purple-400" />}
                            {category === 'green' && <Leaf className="h-5 w-5 text-green-400" />}
                            {category === 'premium' && <Crown className="h-5 w-5 text-yellow-400" />}
                            <span>{category} Amenities</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-2">
                            {(amenities as string[]).map((amenity, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-purple-200">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6 mt-0">
                  {/* Connectivity */}
                  <Card className="bg-gray-900/50 border border-purple-600/30">
                    <CardHeader>
                      <CardTitle className="text-purple-100 flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-purple-400" />
                        <span>Connectivity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Metro */}
                        <div className="space-y-3">
                          <h4 className="text-purple-200 font-semibold flex items-center space-x-2">
                            <Train className="h-4 w-4" />
                            <span>Metro Stations</span>
                          </h4>
                          {propertyDetails.infrastructure.connectivity.metro.map((metro: any, index: number) => (
                            <div key={index} className="p-3 bg-purple-900/30 rounded-lg">
                              <div className="font-medium text-purple-200">{metro.station}</div>
                              <div className="text-sm text-purple-300">{metro.line}</div>
                              <div className="text-xs text-purple-400">{metro.distance} km • {metro.walkingTime} min walk</div>
                            </div>
                          ))}
                        </div>

                        {/* Airport */}
                        <div className="space-y-3">
                          <h4 className="text-purple-200 font-semibold flex items-center space-x-2">
                            <Plane className="h-4 w-4" />
                            <span>Airport</span>
                          </h4>
                          <div className="p-3 bg-purple-900/30 rounded-lg">
                            <div className="font-medium text-purple-200">{propertyDetails.infrastructure.connectivity.airport.name}</div>
                            <div className="text-sm text-purple-300">{propertyDetails.infrastructure.connectivity.airport.distance} km</div>
                            <div className="text-xs text-purple-400">{propertyDetails.infrastructure.connectivity.airport.travelTime} min drive</div>
                          </div>
                        </div>

                        {/* Highways */}
                        <div className="space-y-3">
                          <h4 className="text-purple-200 font-semibold flex items-center space-x-2">
                            <Car className="h-4 w-4" />
                            <span>Highways</span>
                          </h4>
                          {propertyDetails.infrastructure.connectivity.highways.map((highway: any, index: number) => (
                            <div key={index} className="p-3 bg-purple-900/30 rounded-lg">
                              <div className="font-medium text-purple-200">{highway.name}</div>
                              <div className="text-sm text-purple-300">{highway.distance} km</div>
                              <div className="text-xs text-purple-400">{highway.connectivity.join(', ')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Infrastructure */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Schools */}
                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <GraduationCap className="h-5 w-5 text-purple-400" />
                          <span>Schools</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {propertyDetails.infrastructure.social.schools.map((school: any, index: number) => (
                          <div key={index} className="p-3 bg-purple-900/30 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-purple-200">{school.name}</div>
                                <div className="text-sm text-purple-300">{school.board} • {school.distance} km</div>
                                <div className="text-xs text-purple-400">{school.fees}</div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-purple-200">{school.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Hospitals */}
                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <Hospital className="h-5 w-5 text-purple-400" />
                          <span>Healthcare</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {propertyDetails.infrastructure.social.hospitals.map((hospital: any, index: number) => (
                          <div key={index} className="p-3 bg-purple-900/30 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-purple-200">{hospital.name}</div>
                                <div className="text-sm text-purple-300">{hospital.type} • {hospital.distance} km</div>
                                <div className="text-xs text-purple-400">{hospital.specialties.join(', ')}</div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-purple-200">{hospital.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="builder" className="space-y-6 mt-0">
                  <Card className="bg-gray-900/50 border border-purple-600/30">
                    <CardHeader>
                      <CardTitle className="text-purple-100 flex items-center space-x-2">
                        <Building className="h-5 w-5 text-purple-400" />
                        <span>Builder Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-purple-200">{propertyDetails.builder.name}</h3>
                            <p className="text-purple-300">Established {propertyDetails.builder.established}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-2xl font-bold text-purple-400">{propertyDetails.builder.rating}</div>
                              <div className="text-xs text-purple-300">Overall Rating</div>
                            </div>
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-2xl font-bold text-purple-400">{propertyDetails.builder.completedProjects}</div>
                              <div className="text-xs text-purple-300">Completed Projects</div>
                            </div>
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-2xl font-bold text-purple-400">{propertyDetails.builder.onTimeDelivery}%</div>
                              <div className="text-xs text-purple-300">On-Time Delivery</div>
                            </div>
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-2xl font-bold text-purple-400">{propertyDetails.builder.customerRating}</div>
                              <div className="text-xs text-purple-300">Customer Rating</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-purple-200 font-semibold">Contact Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-purple-400" />
                                <span className="text-purple-200">{propertyDetails.builder.contactInfo.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-purple-400" />
                                <span className="text-purple-200">{propertyDetails.builder.contactInfo.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-purple-400" />
                                <span className="text-purple-200">{propertyDetails.builder.contactInfo.website}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-purple-200 font-semibold mb-3">Awards & Certifications</h4>
                            <div className="space-y-2">
                              {propertyDetails.builder.awards.map((award: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Award className="h-4 w-4 text-yellow-400" />
                                  <span className="text-purple-200 text-sm">{award}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-purple-200 font-semibold mb-3">Recent Projects</h4>
                            <div className="space-y-3">
                              {propertyDetails.builder.projectHistory.map((project: any, index: number) => (
                                <div key={index} className="p-3 bg-purple-900/30 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium text-purple-200">{project.name}</div>
                                      <div className="text-sm text-purple-300">{project.location} • {project.year}</div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="text-purple-200">{project.rating}</span>
                                    </div>
                                  </div>
                                  <Badge className={`mt-2 ${project.status === 'Completed' ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                                    {project.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="legal" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* RERA Information */}
                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-purple-400" />
                          <span>RERA Information</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300">RERA ID</span>
                          <Badge className="bg-green-600 text-white">{propertyDetails.legal.reraId}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300">Status</span>
                          <Badge className={`${
                            propertyDetails.legal.reraStatus === 'Approved' ? 'bg-green-600' : 'bg-yellow-600'
                          } text-white`}>
                            {propertyDetails.legal.reraStatus}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Clearances */}
                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-purple-400" />
                          <span>Clearances</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(propertyDetails.legal.clearances).map(([clearance, status]) => (
                          <div key={clearance} className="flex items-center justify-between">
                            <span className="text-purple-300 capitalize">{clearance.replace(/([A-Z])/g, ' $1').trim()}</span>
                            {status ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Approvals */}
                  <Card className="bg-gray-900/50 border border-purple-600/30">
                    <CardHeader>
                      <CardTitle className="text-purple-100 flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-purple-400" />
                        <span>Government Approvals</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {propertyDetails.legal.approvals.map((approval: any, index: number) => (
                          <div key={index} className="p-4 bg-purple-900/30 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-purple-200">{approval.authority}</div>
                                <div className="text-sm text-purple-300">Approval No: {approval.approvalNumber}</div>
                                <div className="text-xs text-purple-400">Valid till: {approval.validTill}</div>
                              </div>
                              <Badge className="bg-green-600 text-white">{approval.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="investment" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-purple-400" />
                          <span>Investment Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">{propertyDetails.investment.roi}%</div>
                            <div className="text-xs text-purple-300">Expected ROI</div>
                          </div>
                          <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{propertyDetails.investment.rentalYield}%</div>
                            <div className="text-xs text-purple-300">Rental Yield</div>
                          </div>
                          <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">{propertyDetails.investment.appreciation}%</div>
                            <div className="text-xs text-purple-300">Appreciation</div>
                          </div>
                          <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">{propertyDetails.investment.liquidityScore}</div>
                            <div className="text-xs text-purple-300">Liquidity Score</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Investment Grade</span>
                            <Badge className="bg-purple-600 text-white">{propertyDetails.investment.investmentGrade}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Risk Factor</span>
                            <Badge className={`${
                              propertyDetails.investment.riskFactor === 'Low' ? 'bg-green-600' :
                              propertyDetails.investment.riskFactor === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                            } text-white`}>
                              {propertyDetails.investment.riskFactor}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Market Trend</span>
                            <div className="flex items-center space-x-1">
                              {propertyDetails.investment.marketTrend === 'Rising' ? (
                                <TrendingUp className="h-4 w-4 text-green-400" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-400" />
                              )}
                              <span className={`${
                                propertyDetails.investment.marketTrend === 'Rising' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {propertyDetails.investment.marketTrend}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-purple-400" />
                          <span>Price History</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-48 bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="h-12 w-12 mx-auto text-purple-400 mb-2" />
                              <p className="text-purple-300">Price trend chart</p>
                              <p className="text-purple-400 text-sm">Interactive chart would be displayed here</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h5 className="text-purple-200 font-medium">Recent Price Points</h5>
                            {propertyDetails.pricing.priceHistory.slice(-5).map((point: any, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-purple-300">{new Date(point.date).toLocaleDateString()}</span>
                                <span className="text-purple-200">{formatPrice(point.price)}</span>
                                <span className="text-purple-400">{point.source}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <ContactBuilderForm
            isOpen={showContactForm}
            onClose={() => setShowContactForm(false)}
            builderName={propertyDetails.builder.name}
            propertyTitle={propertyDetails.basicInfo.title}
            onSubmit={handleContactBuilder}
            loading={contactLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// Contact Builder Form Component
const ContactBuilderForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  builderName: string;
  propertyTitle: string;
  onSubmit: (contactInfo: any) => void;
  loading: boolean;
}> = ({ isOpen, onClose, builderName, propertyTitle, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in ${propertyTitle}. Please provide more details and arrange a site visit.`,
    requestType: 'General Inquiry'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black border border-purple-600/30">
        <DialogHeader>
          <DialogTitle className="text-white">Contact {builderName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-purple-300 text-sm">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 bg-gray-900 border border-purple-600/50 rounded-lg text-white"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="text-purple-300 text-sm">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 bg-gray-900 border border-purple-600/50 rounded-lg text-white"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label className="text-purple-300 text-sm">Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 bg-gray-900 border border-purple-600/50 rounded-lg text-white"
              placeholder="+91 98765 43210"
            />
          </div>
          
          <div>
            <label className="text-purple-300 text-sm">Message *</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-3 bg-gray-900 border border-purple-600/50 rounded-lg text-white resize-none"
              placeholder="Your message to the builder..."
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;