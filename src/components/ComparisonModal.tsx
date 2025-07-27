import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPropertyId?: string;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  initialPropertyId
}) => {
  const { toast } = useToast();
  const [comparisonProperties, setComparisonProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComparisonData();
      if (initialPropertyId) {
        addPropertyToComparison(initialPropertyId);
      }
    }
  }, [isOpen, initialPropertyId]);

  const loadComparisonData = () => {
    // Comparison functionality simplified - no wishlist integration
    setComparisonProperties([]);
  };

  const addPropertyToComparison = async (propertyId: string) => {
    // Simplified comparison without wishlist
    toast({
      title: "Feature Unavailable",
      description: "Comparison feature is being updated",
      variant: "destructive"
    });
  };

  const removePropertyFromComparison = (propertyId: string) => {
    setComparisonProperties(prev => prev.filter(p => p.id !== propertyId));
    toast({
      title: "Removed from Comparison",
      description: "Property removed from comparison",
    });
  };

  const clearAllComparison = () => {
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

    const prices = comparisonProperties.map(p => p.basicInfo.price);
    const areas = comparisonProperties.map(p => p.basicInfo.area);
    const pricePerSqft = comparisonProperties.map(p => p.pricing.pricePerSqft);

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

  const metrics = getComparisonMetrics();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden bg-black border border-purple-600/30 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Property Comparison
                </DialogTitle>
                <p className="text-purple-300 mt-1">
                  Compare up to 4 properties side by side
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600 text-white">
                  {comparisonProperties.length}/4 Properties
                </Badge>
                {comparisonProperties.length > 0 && (
                  <Button
                    onClick={clearAllComparison}
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
          <div className="flex-1 overflow-y-auto p-6">
            {comparisonProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">No Properties to Compare</h3>
                  <p className="text-purple-400 max-w-md mx-auto">
                    Add properties from your wishlist or search results to start comparing features, prices, and amenities.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Comparison Metrics */}
                {metrics && (
                  <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-purple-100 mb-4">Comparison Insights</h3>
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

                {/* Property Comparison Table */}
                <div className="overflow-x-auto">
                  <div className="min-w-full">
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
                              onClick={() => removePropertyFromComparison(property.id)}
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 text-red-400 hover:text-white hover:bg-red-600/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <img 
                                  src={property.images.exterior[0]} 
                                  alt={property.basicInfo.title}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <div>
                                  <h4 className="font-bold text-purple-200 text-sm">{property.basicInfo.title}</h4>
                                  <p className="text-purple-300 text-xs">{property.location.locality}</p>
                                </div>
                                <div className="text-center">
                                  <div className="text-xl font-bold text-purple-400">
                                    {formatPrice(property.basicInfo.price)}
                                  </div>
                                  <div className="text-xs text-purple-300">
                                    ₹{property.pricing.pricePerSqft.toLocaleString()}/sq ft
                                  </div>
                                </div>
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
                                onClick={() => {/* Open property selector */}}
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

                    {/* Comparison Rows */}
                    <div className="space-y-4">
                      {/* Basic Details */}
                      <ComparisonRow
                        title="Configuration"
                        icon={<Home className="h-4 w-4" />}
                        values={comparisonProperties.map(p => p.basicInfo.bhk)}
                      />
                      
                      <ComparisonRow
                        title="Carpet Area"
                        icon={<Home className="h-4 w-4" />}
                        values={comparisonProperties.map(p => `${p.basicInfo.area} sq ft`)}
                      />
                      
                      <ComparisonRow
                        title="Status"
                        icon={<CheckCircle className="h-4 w-4" />}
                        values={comparisonProperties.map(p => p.basicInfo.status)}
                      />
                      
                      <ComparisonRow
                        title="Possession"
                        icon={<Calendar className="h-4 w-4" />}
                        values={comparisonProperties.map(p => p.basicInfo.possession)}
                      />

                      {/* Pricing */}
                      <ComparisonRow
                        title="Total Price"
                        icon={<DollarSign className="h-4 w-4" />}
                        values={comparisonProperties.map(p => formatPrice(p.basicInfo.price))}
                        highlight="price"
                      />
                      
                      <ComparisonRow
                        title="Price per sq ft"
                        icon={<DollarSign className="h-4 w-4" />}
                        values={comparisonProperties.map(p => `₹${p.pricing.pricePerSqft.toLocaleString()}`)}
                        highlight="price"
                      />
                      
                      <ComparisonRow
                        title="Monthly EMI"
                        icon={<DollarSign className="h-4 w-4" />}
                        values={comparisonProperties.map(p => `₹${p.pricing.emiCalculation.monthlyEmi.toLocaleString()}`)}
                      />

                      {/* Builder */}
                      <ComparisonRow
                        title="Builder"
                        icon={<Building className="h-4 w-4" />}
                        values={comparisonProperties.map(p => p.builder.name)}
                      />
                      
                      <ComparisonRow
                        title="Builder Rating"
                        icon={<Star className="h-4 w-4" />}
                        values={comparisonProperties.map(p => `${p.builder.rating}/5`)}
                        highlight="rating"
                      />
                      
                      <ComparisonRow
                        title="On-Time Delivery"
                        icon={<CheckCircle className="h-4 w-4" />}
                        values={comparisonProperties.map(p => `${p.builder.onTimeDelivery}%`)}
                        highlight="percentage"
                      />

                      {/* Investment */}
                      <ComparisonRow
                        title="ROI Potential"
                        icon={<TrendingUp className="h-4 w-4" />}
                        values={comparisonProperties.map(p => `${p.investment.roi}%`)}
                        highlight="percentage"
                      />
                      
                      <ComparisonRow
                        title="Rental Yield"
                        icon={<TrendingUp className="h-4 w-4" />}
                        values={comparisonProperties.map(p => `${p.investment.rentalYield}%`)}
                        highlight="percentage"
                      />
                      
                      <ComparisonRow
                        title="Investment Grade"
                        icon={<Award className="h-4 w-4" />}
                        values={comparisonProperties.map(p => p.investment.investmentGrade)}
                        highlight="grade"
                      />

                      {/* Legal */}
                      <ComparisonRow
                        title="RERA Approved"
                        icon={<Shield className="h-4 w-4" />}
                        values={comparisonProperties.map(p => p.legal.reraStatus === 'Approved' ? 'Yes' : 'No')}
                        highlight="boolean"
                      />

                      {/* Amenities Count */}
                      <ComparisonRow
                        title="Total Amenities"
                        icon={<Zap className="h-4 w-4" />}
                        values={comparisonProperties.map(p => 
                          Object.values(p.amenities).filter(arr => Array.isArray(arr)).flat().length.toString()
                        )}
                        highlight="count"
                      />
                    </div>
                  </div>
                </div>
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
  highlight?: 'price' | 'rating' | 'percentage' | 'grade' | 'boolean' | 'count';
}> = ({ title, icon, values, highlight }) => {
  const getBestValue = () => {
    if (!highlight || values.length === 0) return null;
    
    switch (highlight) {
      case 'price':
        const prices = values.map(v => parseFloat(v.replace(/[₹,Cr L]/g, '')));
        const minPrice = Math.min(...prices);
        return values.findIndex(v => parseFloat(v.replace(/[₹,Cr L]/g, '')) === minPrice);
      
      case 'rating':
      case 'percentage':
      case 'count':
        const numbers = values.map(v => parseFloat(v.replace(/[%/5]/g, '')));
        const maxNumber = Math.max(...numbers);
        return values.findIndex(v => parseFloat(v.replace(/[%/5]/g, '')) === maxNumber);
      
      case 'grade':
        const gradeOrder = { 'A+': 4, 'A': 3, 'B+': 2, 'B': 1, 'C': 0 };
        const grades = values.map(v => gradeOrder[v as keyof typeof gradeOrder] || 0);
        const maxGrade = Math.max(...grades);
        return values.findIndex(v => (gradeOrder[v as keyof typeof gradeOrder] || 0) === maxGrade);
      
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

export default ComparisonModal;