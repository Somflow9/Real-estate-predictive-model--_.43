import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Car, 
  Train, 
  Plane, 
  GraduationCap, 
  Hospital, 
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
import { propertyDetailsService } from '@/services/propertyDetailsService';
import { builderContactService } from '@/services/builderContactService';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  propertyId
}) => {
  const { toast } = useToast();
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [contactLoading, setContactLoading] = useState(false);
  const [neighborhoodData, setNeighborhoodData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && propertyId) {
      loadPropertyDetails();
    }
  }, [isOpen, propertyId]);

  const loadPropertyDetails = async () => {
    setLoading(true);
    try {
      const details = await propertyDetailsService.getPropertyDetails(propertyId);
      setPropertyDetails(details);
      
      // Load neighborhood analysis
      const neighborhood = await propertyDetailsService.getNeighborhoodAnalysis(
        details.location.locality,
        details.location.city
      );
      setNeighborhoodData(neighborhood);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactBuilder = async () => {
    if (!propertyDetails) return;
    
    setContactLoading(true);
    try {
      const result = await builderContactService.contactBuilder({
        propertyId: propertyDetails.id,
        builderName: propertyDetails.builder.name,
        userInfo: {
          name: 'Interested Buyer',
          email: 'buyer@example.com',
          phone: '+91 98765 43210',
          message: `I am interested in ${propertyDetails.basicInfo.title}. Please provide more details.`
        },
        requestType: 'General Inquiry'
      });

      if (result.success) {
        toast({
          title: "Contact Request Sent",
          description: result.message,
        });
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
        description: "Failed to contact builder",
        variant: "destructive"
      });
    } finally {
      setContactLoading(false);
    }
  };

  const handleShare = () => {
    if (!propertyDetails) return;
    
    const shareData = {
      title: propertyDetails.basicInfo.title,
      text: `Check out this property: ${propertyDetails.basicInfo.title} in ${propertyDetails.location.locality}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: "Link Copied",
        description: "Property details copied to clipboard",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInvestmentGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-600 text-white';
      case 'A': return 'bg-green-500 text-white';
      case 'B+': return 'bg-yellow-600 text-white';
      case 'B': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-black border border-purple-600/30 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {propertyDetails?.basicInfo?.title || 'Property Details'}
                </DialogTitle>
                {propertyDetails && (
                  <p className="text-purple-300 mt-1">
                    {propertyDetails.location.locality}, {propertyDetails.location.city}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
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

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-purple-300">Loading property details...</p>
                </div>
              </div>
            ) : propertyDetails ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="mx-6 mt-4 bg-purple-900/50 border border-purple-600/30">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="location" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Location
                  </TabsTrigger>
                  <TabsTrigger value="builder" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Builder
                  </TabsTrigger>
                  <TabsTrigger value="investment" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Investment
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Legal
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="overview" className="p-6 space-y-6 m-0">
                    {/* Price and Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                        <CardHeader>
                          <CardTitle className="text-purple-100 flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-purple-400" />
                            <span>Pricing Details</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-purple-100 mb-2">
                              {formatPrice(propertyDetails.pricing.totalPrice)}
                            </div>
                            <div className="text-purple-300">
                              ₹{propertyDetails.pricing.pricePerSqft.toLocaleString()}/sq ft
                            </div>
                          </div>
                          
                          <Separator className="bg-purple-600/30" />
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-purple-300">Base Price</span>
                              <span className="text-purple-100">{formatPrice(propertyDetails.pricing.priceBreakdown.basePrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">GST (5%)</span>
                              <span className="text-purple-100">{formatPrice(propertyDetails.pricing.priceBreakdown.gst)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Registration</span>
                              <span className="text-purple-100">{formatPrice(propertyDetails.pricing.priceBreakdown.registrationCharges)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                        <CardHeader>
                          <CardTitle className="text-purple-100 flex items-center space-x-2">
                            <Home className="h-5 w-5 text-purple-400" />
                            <span>Property Specifications</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-2xl font-bold text-purple-100">{propertyDetails.basicInfo.bhk}</div>
                              <div className="text-xs text-purple-400">Configuration</div>
                            </div>
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-2xl font-bold text-purple-100">{propertyDetails.basicInfo.area}</div>
                              <div className="text-xs text-purple-400">Sq Ft</div>
                            </div>
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-lg font-bold text-purple-100">{propertyDetails.basicInfo.status}</div>
                              <div className="text-xs text-purple-400">Status</div>
                            </div>
                            <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                              <div className="text-lg font-bold text-purple-100">{propertyDetails.basicInfo.possession}</div>
                              <div className="text-xs text-purple-400">Possession</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* EMI Calculator */}
                    <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-purple-400" />
                          <span>EMI Calculator</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-100">₹{propertyDetails.pricing.emiCalculation.monthlyEmi.toLocaleString()}</div>
                            <div className="text-sm text-purple-300">Monthly EMI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-100">{propertyDetails.pricing.emiCalculation.interestRate}%</div>
                            <div className="text-sm text-purple-300">Interest Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-100">{propertyDetails.pricing.emiCalculation.tenure} Years</div>
                            <div className="text-sm text-purple-300">Tenure</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-100">{formatPrice(propertyDetails.pricing.emiCalculation.downPayment)}</div>
                            <div className="text-sm text-purple-300">Down Payment</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amenities */}
                    <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-purple-400" />
                          <span>Amenities</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {Object.entries(propertyDetails.amenities).map(([category, amenities]) => (
                            <div key={category} className="space-y-2">
                              <h4 className="font-semibold text-purple-200 capitalize">{category}</h4>
                              <div className="space-y-1">
                                {(amenities as string[]).map((amenity, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="h-3 w-3 text-green-400" />
                                    <span className="text-sm text-purple-300">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="location" className="p-6 space-y-6 m-0">
                    {/* Location Details */}
                    <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-purple-400" />
                          <span>Location Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-purple-900/30 rounded-lg">
                          <p className="text-purple-200">{propertyDetails.location.address}</p>
                        </div>
                        
                        {/* Nearby Landmarks */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-purple-200">Nearby Landmarks</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {propertyDetails.location.nearbyLandmarks.map((landmark: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  {landmark.type === 'Railway' && <Train className="h-4 w-4 text-purple-400" />}
                                  {landmark.type === 'Shopping' && <Users className="h-4 w-4 text-purple-400" />}
                                  {landmark.type === 'Hospital' && <Hospital className="h-4 w-4 text-purple-400" />}
                                  {landmark.type === 'School' && <GraduationCap className="h-4 w-4 text-purple-400" />}
                                  <span className="text-purple-200 text-sm">{landmark.name}</span>
                                </div>
                                <span className="text-purple-300 text-sm">{landmark.distance} km</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Neighborhood Analysis */}
                    {neighborhoodData && (
                      <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                        <CardHeader>
                          <CardTitle className="text-purple-100">Neighborhood Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-100">{neighborhoodData.walkabilityScore}</div>
                              <div className="text-xs text-purple-400">Walkability</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-100">{neighborhoodData.safetyRating}</div>
                              <div className="text-xs text-purple-400">Safety</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-100">{neighborhoodData.connectivityScore}</div>
                              <div className="text-xs text-purple-400">Connectivity</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-100">{neighborhoodData.amenitiesScore}</div>
                              <div className="text-xs text-purple-400">Amenities</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-100">{neighborhoodData.futureGrowth}</div>
                              <div className="text-xs text-purple-400">Growth</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="builder" className="p-6 space-y-6 m-0">
                    <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <Building className="h-5 w-5 text-purple-400" />
                          <span>{propertyDetails.builder.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className={`text-2xl font-bold ${getScoreColor(propertyDetails.builder.rating)}`}>
                              {propertyDetails.builder.rating}
                            </div>
                            <div className="text-xs text-purple-400">Overall Rating</div>
                          </div>
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-100">{propertyDetails.builder.onTimeDelivery}%</div>
                            <div className="text-xs text-purple-400">On-Time Delivery</div>
                          </div>
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-100">{propertyDetails.builder.totalProjects}</div>
                            <div className="text-xs text-purple-400">Total Projects</div>
                          </div>
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-100">{propertyDetails.builder.experience}</div>
                            <div className="text-xs text-purple-400">Years Experience</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="investment" className="p-6 space-y-6 m-0">
                    <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-purple-400" />
                          <span>Investment Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">{propertyDetails.investment.roi}%</div>
                            <div className="text-xs text-purple-400">Expected ROI</div>
                          </div>
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{propertyDetails.investment.rentalYield}%</div>
                            <div className="text-xs text-purple-400">Rental Yield</div>
                          </div>
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-100">{propertyDetails.investment.appreciationRate}%</div>
                            <div className="text-xs text-purple-400">Appreciation Rate</div>
                          </div>
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <Badge className={getInvestmentGradeColor(propertyDetails.investment.investmentGrade)}>
                              {propertyDetails.investment.investmentGrade}
                            </Badge>
                            <div className="text-xs text-purple-400 mt-2">Investment Grade</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="legal" className="p-6 space-y-6 m-0">
                    <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                      <CardHeader>
                        <CardTitle className="text-purple-100 flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-purple-400" />
                          <span>Legal Information</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="text-purple-200">RERA Status: {propertyDetails.legal.reraStatus}</span>
                            </div>
                            <div className="p-3 bg-purple-900/30 rounded-lg">
                              <span className="text-purple-300 text-sm">RERA ID: </span>
                              <span className="text-purple-100 font-mono">{propertyDetails.legal.reraId}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-purple-200">Approvals & Clearances</h4>
                            <div className="space-y-2">
                              {[...propertyDetails.legal.approvals, ...propertyDetails.legal.clearances].map((item: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                  <span className="text-sm text-purple-300">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-purple-600/30 bg-gray-900/30">
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleContactBuilder}
                      disabled={contactLoading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contactLoading ? 'Contacting...' : 'Contact Builder'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Brochure
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Schedule Visit
                    </Button>
                  </div>
                </div>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-purple-400 mx-auto" />
                  <p className="text-purple-300">Property details not found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;