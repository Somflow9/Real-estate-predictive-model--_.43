import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  Plus, 
  Minus,
  Star,
  MapPin,
  Building,
  Home,
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  Users,
  Award,
  Clock,
  Eye,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ComparisonProperty {
  id: string;
  title: string;
  city: string;
  locality: string;
  microMarket?: string;
  price: number;
  pricePerSqft: number;
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
  amenities?: string[];
  possessionDate?: string;
  images?: string[];
}

interface FunctionalCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProperties?: ComparisonProperty[];
}

const FunctionalCompareModal: React.FC<FunctionalCompareModalProps> = ({
  isOpen,
  onClose,
  initialProperties = []
}) => {
  const { toast } = useToast();
  const [comparisonProperties, setComparisonProperties] = useState<ComparisonProperty[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && initialProperties.length > 0) {
      setComparisonProperties(initialProperties.slice(0, 4)); // Max 4 properties
    }
  }, [isOpen, initialProperties]);

  const addProperty = (property: ComparisonProperty) => {
    if (comparisonProperties.length >= 4) {
      toast({
        title: "Maximum Limit Reached",
        description: "You can compare up to 4 properties at once",
        variant: "destructive"
      });
      return;
    }

    if (comparisonProperties.find(p => p.id === property.id)) {
      toast({
        title: "Property Already Added",
        description: "This property is already in comparison",
        variant: "destructive"
      });
      return;
    }

    setComparisonProperties(prev => [...prev, property]);
    toast({
      title: "Property Added",
      description: "Property added to comparison",
    });
  };

  const removeProperty = (propertyId: string) => {
    setComparisonProperties(prev => prev.filter(p => p.id !== propertyId));
    toast({
      title: "Property Removed",
      description: "Property removed from comparison",
    });
  };

  const clearAllProperties = () => {
    setComparisonProperties([]);
    toast({
      title: "Comparison Cleared",
      description: "All properties removed from comparison",
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getComparisonMetrics = () => {
    if (comparisonProperties.length === 0) return null;

    const prices = comparisonProperties.map(p => p.price);
    const areas = comparisonProperties.map(p => p.area);
    const pricePerSqft = comparisonProperties.map(p => p.pricePerSqft);

    return {
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      lowestPricePerSqft: Math.min(...pricePerSqft),
      highestPricePerSqft: Math.max(...pricePerSqft),
      largestArea: Math.max(...areas),
      smallestArea: Math.min(...areas)
    };
  };

  const getBestValue = (values: any[], type: 'price' | 'rating' | 'percentage' | 'count' | 'boolean') => {
    if (values.length === 0) return null;
    
    switch (type) {
      case 'price':
        const minPrice = Math.min(...values);
        return values.findIndex(v => v === minPrice);
      
      case 'rating':
      case 'percentage':
      case 'count':
        const maxValue = Math.max(...values);
        return values.findIndex(v => v === maxValue);
      
      case 'boolean':
        return values.findIndex(v => v === true);
      
      default:
        return null;
    }
  };

  const metrics = getComparisonMetrics();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden bg-black border border-purple-600/30 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                  Property Comparison Center
                </DialogTitle>
                <p className="text-purple-300 mt-1">
                  Compare up to 4 properties side by side with detailed analysis
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600 text-white">
                  {comparisonProperties.length}/4 Properties
                </Badge>
                {comparisonProperties.length > 0 && (
                  <Button
                    onClick={clearAllProperties}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    Clear All
                  </Button>
                )}
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
          <div className="flex-1 overflow-y-auto">
            {comparisonProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">No Properties to Compare</h3>
                  <p className="text-purple-400 max-w-md mx-auto">
                    Add properties from the recommendations to start comparing features, prices, and amenities.
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
                  >
                    Browse Properties
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Comparison Metrics */}
                {metrics && (
                  <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-purple-100 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        Comparison Insights
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{formatPrice(metrics.lowestPrice)}</div>
                          <div className="text-xs text-purple-300">Lowest Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{formatPrice(metrics.highestPrice)}</div>
                          <div className="text-xs text-purple-300">Highest Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">₹{metrics.lowestPricePerSqft.toLocaleString()}</div>
                          <div className="text-xs text-purple-300">Best Value/sq ft</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{metrics.largestArea.toLocaleString()}</div>
                          <div className="text-xs text-purple-300">Largest Area</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="bg-purple-900/50 border border-purple-600/30">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Pricing
                    </TabsTrigger>
                    <TabsTrigger value="builder" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Builder
                    </TabsTrigger>
                    <TabsTrigger value="amenities" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Amenities
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Legal
                    </TabsTrigger>
                  </TabsList>

                  {/* Property Headers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                    {comparisonProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-900/50 border border-purple-600/30 relative">
                          <Button
                            onClick={() => removeProperty(property.id)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-red-400 hover:text-white hover:bg-red-600/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <img 
                                src={property.images?.[0] || '/placeholder.svg'} 
                                alt={property.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="font-bold text-purple-200 text-sm line-clamp-2">{property.title}</h4>
                                <p className="text-purple-300 text-xs">{property.locality}, {property.city}</p>
                                {property.microMarket && (
                                  <p className="text-purple-400 text-xs">{property.microMarket}</p>
                                )}
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-purple-400">
                                  {formatPrice(property.price)}
                                </div>
                                <div className="text-xs text-purple-300">
                                  ₹{property.pricePerSqft.toLocaleString()}/sq ft
                                </div>
                              </div>
                              {property.segment && (
                                <Badge className={`w-full justify-center ${
                                  property.segment === 'Affordable' ? 'bg-green-600' :
                                  property.segment === 'Mid-Range' ? 'bg-blue-600' :
                                  property.segment === 'Premium' ? 'bg-purple-600' :
                                  'bg-yellow-600'
                                } text-white`}>
                                  {property.segment}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    
                    {/* Add Property Slot */}
                    {comparisonProperties.length < 4 && (
                      <Card className="bg-gray-900/30 border border-purple-600/30 border-dashed">
                        <CardContent className="p-4 h-full flex items-center justify-center">
                          <div className="text-center">
                            <Plus className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                            <p className="text-purple-300 text-sm">Add Property</p>
                            <Button
                              onClick={onClose}
                              variant="outline"
                              size="sm"
                              className="mt-2 border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
                            >
                              Browse
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <TabsContent value="overview" className="space-y-4">
                    <ComparisonRow
                      title="Configuration"
                      icon={<Home className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.bhk)}
                    />
                    
                    <ComparisonRow
                      title="Area"
                      icon={<Home className="h-4 w-4" />}
                      values={comparisonProperties.map(p => `${p.area} sq ft`)}
                      highlight="count"
                    />
                    
                    <ComparisonRow
                      title="Status"
                      icon={<CheckCircle className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.status || 'Unknown')}
                    />
                    
                    <ComparisonRow
                      title="Property Age"
                      icon={<Clock className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.propertyAge !== undefined ? `${p.propertyAge} years` : 'Unknown')}
                    />

                    <ComparisonRow
                      title="Listing Type"
                      icon={<Users className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.listingType || 'Unknown')}
                    />

                    <ComparisonRow
                      title="View Count"
                      icon={<Eye className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.metadata?.viewCount?.toLocaleString() || '0')}
                      highlight="count"
                    />
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4">
                    <ComparisonRow
                      title="Total Price"
                      icon={<DollarSign className="h-4 w-4" />}
                      values={comparisonProperties.map(p => formatPrice(p.price))}
                      highlight="price"
                    />
                    
                    <ComparisonRow
                      title="Price per sq ft"
                      icon={<DollarSign className="h-4 w-4" />}
                      values={comparisonProperties.map(p => `₹${p.pricePerSqft.toLocaleString()}`)}
                      highlight="price"
                    />

                    <ComparisonRow
                      title="Segment"
                      icon={<Award className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.segment || 'Unknown')}
                    />
                  </TabsContent>

                  <TabsContent value="builder" className="space-y-4">
                    <ComparisonRow
                      title="Builder"
                      icon={<Building className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.builderName)}
                    />
                    
                    <ComparisonRow
                      title="Builder Type"
                      icon={<Building className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.builderType || 'Unknown')}
                    />
                    
                    <ComparisonRow
                      title="Credibility Score"
                      icon={<Star className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.builderCredibility?.score?.toString() || 'N/A')}
                      highlight="rating"
                    />

                    <ComparisonRow
                      title="Credibility Badge"
                      icon={<Award className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.builderCredibility?.badge || 'Unknown')}
                    />
                    
                    <ComparisonRow
                      title="On-Time Delivery"
                      icon={<CheckCircle className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.builderCredibility?.onTimeDelivery ? `${p.builderCredibility.onTimeDelivery}%` : 'N/A')}
                      highlight="percentage"
                    />

                    <ComparisonRow
                      title="Completed Projects"
                      icon={<Building className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.builderCredibility?.completedProjects?.toString() || 'N/A')}
                      highlight="count"
                    />
                  </TabsContent>

                  <TabsContent value="amenities" className="space-y-4">
                    <ComparisonRow
                      title="Total Amenities"
                      icon={<Zap className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.amenities?.length?.toString() || '0')}
                      highlight="count"
                    />

                    {/* Amenities comparison */}
                    <div className="bg-gray-900/30 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-200 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-400" />
                        Amenities Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {comparisonProperties.map((property, index) => (
                          <div key={property.id} className="space-y-2">
                            <h5 className="font-medium text-purple-300 text-sm">Property {index + 1}</h5>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {property.amenities?.map((amenity, amenityIndex) => (
                                <div key={amenityIndex} className="flex items-center space-x-2">
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                  <span className="text-xs text-purple-300">{amenity}</span>
                                </div>
                              )) || <span className="text-xs text-gray-500">No amenities listed</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="legal" className="space-y-4">
                    <ComparisonRow
                      title="RERA Approved"
                      icon={<Shield className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.reraStatus?.approved ? 'Yes' : 'No')}
                      highlight="boolean"
                    />

                    <ComparisonRow
                      title="RERA Registration"
                      icon={<Shield className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.reraStatus?.registrationNumber || 'Not Available')}
                    />

                    <ComparisonRow
                      title="RERA Valid Till"
                      icon={<Calendar className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.reraStatus?.validTill ? new Date(p.reraStatus.validTill).toLocaleDateString() : 'N/A')}
                    />

                    <ComparisonRow
                      title="Possession Date"
                      icon={<Calendar className="h-4 w-4" />}
                      values={comparisonProperties.map(p => p.possessionDate ? new Date(p.possessionDate).toLocaleDateString() : 'Ready')}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Comparison Row Component
const ComparisonRow: React.FC<{
  title: string;
  icon: React.ReactNode;
  values: string[];
  highlight?: 'price' | 'rating' | 'percentage' | 'count' | 'boolean';
}> = ({ title, icon, values, highlight }) => {
  const getBestValue = () => {
    if (!highlight || values.length === 0) return null;
    
    switch (highlight) {
      case 'price':
        const prices = values.map(v => {
          const numStr = v.replace(/[₹,Cr L]/g, '');
          return parseFloat(numStr) || 0;
        });
        const minPrice = Math.min(...prices);
        return values.findIndex(v => {
          const numStr = v.replace(/[₹,Cr L]/g, '');
          return (parseFloat(numStr) || 0) === minPrice;
        });
      
      case 'rating':
      case 'percentage':
      case 'count':
        const numbers = values.map(v => {
          const numStr = v.replace(/[%/5]/g, '');
          return parseFloat(numStr) || 0;
        });
        const maxNumber = Math.max(...numbers);
        return values.findIndex(v => {
          const numStr = v.replace(/[%/5]/g, '');
          return (parseFloat(numStr) || 0) === maxNumber;
        });
      
      case 'boolean':
        return values.findIndex(v => v.toLowerCase() === 'yes');
      
      default:
        return null;
    }
  };

  const bestIndex = getBestValue();

  return (
    <div className="bg-gray-900/30 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div className="flex items-center space-x-2 text-purple-300 font-medium">
          {icon}
          <span>{title}</span>
        </div>
        
        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {values.map((value, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center ${
                bestIndex === index 
                  ? 'bg-green-600/20 border border-green-600/50 text-green-400' 
                  : 'bg-purple-900/30 text-purple-200'
              }`}
            >
              <span className="font-medium">{value}</span>
              {bestIndex === index && (
                <div className="text-xs text-green-400 mt-1">Best Value</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionalCompareModal;