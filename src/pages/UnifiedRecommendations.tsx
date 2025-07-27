import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Database, 
  Globe, 
  TrendingUp, 
  MapPin,
  Building,
  DollarSign,
  Home,
  Calendar,
  Zap,
  BarChart3,
  Settings,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { unifiedRecommendationService } from '@/services/unifiedRecommendationService';
import UnifiedPropertyCard from '@/components/UnifiedPropertyCard';
import PropertyDetailsModal from '@/components/PropertyDetailsModal';
import ComparisonModal from '@/components/ComparisonModal';
import { usePropertyActions } from '@/hooks/usePropertyActions';

const UnifiedRecommendations: React.FC = () => {
  const { toast } = useToast();
  const {
    isDetailsModalOpen,
    isComparisonModalOpen,
    selectedPropertyId,
    setIsDetailsModalOpen,
    setIsComparisonModalOpen,
    handleViewDetails,
    handleCompare
  } = usePropertyActions();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    city: 'Mumbai',
    budget: { min: 1000000, max: 100000000 },
    bhk: [] as string[],
    property_type: '',
    builder_name: '',
    locality: '',
    project_status: '',
    sortBy: 'smart_score',
    includeApiData: true,
    includeLocalData: true
  });

  const tier1Cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
  const bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];
  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Studio'];
  const statusOptions = ['Ready', 'Under Construction', 'New Launch', 'Planning'];

  useEffect(() => {
    loadUnifiedRecommendations();
  }, []);

  const loadUnifiedRecommendations = async () => {
    setLoading(true);
    try {
      toast({
        title: "🔄 Loading Unified Recommendations",
        description: "Fetching from APIs and local database...",
      });

      const result = await unifiedRecommendationService.getUnifiedRecommendations(filters);
      setProperties(result.properties);
      setMetadata(result.metadata);
      
      toast({
        title: "✅ Unified Data Loaded",
        description: `${result.properties.length} properties from ${result.metadata.sources_used.join(', ')}`,
      });
    } catch (error) {
      toast({
        title: "❌ Loading Failed",
        description: "Failed to load unified recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUnifiedRecommendations();
      return;
    }

    setLoading(true);
    try {
      const searchResults = await unifiedRecommendationService.searchProperties(searchQuery, filters);
      setProperties(searchResults);
      
      toast({
        title: "🔍 Search Complete",
        description: `Found ${searchResults.length} properties matching "${searchQuery}"`,
      });
    } catch (error) {
      toast({
        title: "❌ Search Failed",
        description: "Search failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBHKToggle = (bhk: string) => {
    setFilters(prev => ({
      ...prev,
      bhk: prev.bhk.includes(bhk) 
        ? prev.bhk.filter(b => b !== bhk)
        : [...prev.bhk, bhk]
    }));
  };

  const applyFilters = () => {
    loadUnifiedRecommendations();
  };

  const resetFilters = () => {
    setFilters({
      city: 'Mumbai',
      budget: { min: 1000000, max: 100000000 },
      bhk: [],
      property_type: '',
      builder_name: '',
      locality: '',
      project_status: '',
      sortBy: 'smart_score',
      includeApiData: true,
      includeLocalData: true
    });
    setSearchQuery('');
  };

  const exportData = () => {
    const csvData = properties.map(p => ({
      Title: p.title,
      City: p.city,
      Locality: p.locality,
      Price: p.price,
      BHK: p.bhk,
      Builder: p.builderName,
      Status: p.status,
      Source: p.source,
      'API Source': p.apiSource || 'N/A',
      'BrickMatrix Score': p.brickMatrixScore || 'N/A'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unified_properties_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "📊 Data Exported",
      description: "Property data exported to CSV file",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-white">
            Unified Recommendations
          </h1>
          <p className="text-purple-400">
            Fetching from APIs and local database...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center space-x-2">
            <Database className="h-10 w-10 text-purple-400" />
            <span>Unified Recommendations</span>
          </h1>
          <p className="text-purple-200 text-lg">
            Live API data + Local intelligence • Housing.com • SquareYards • NoBroker • BrickMatrix™
          </p>
        </motion.div>

        {/* Metadata Dashboard */}
        {metadata && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  <span>Data Sources Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-purple-100">{metadata.total_count}</div>
                    <div className="text-sm text-purple-400">Total Properties</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-400">{metadata.api_count}</div>
                    <div className="text-sm text-purple-400">API Sources</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-purple-400">{metadata.local_count}</div>
                    <div className="text-sm text-purple-400">Local Database</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-400">{metadata.sources_used.length}</div>
                    <div className="text-sm text-purple-400">Sources Used</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-yellow-400">{metadata.processing_time_ms}ms</div>
                    <div className="text-sm text-purple-400">Processing Time</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center space-x-2">
                  {metadata.sources_used.map((source: string) => (
                    <Badge key={source} className="bg-purple-600 text-white">
                      {source}
                    </Badge>
                  ))}
                  {metadata.cache_hit && (
                    <Badge className="bg-green-600 text-white">Cached</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search and Filters */}
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="bg-purple-900/50 border border-purple-600/30">
            <TabsTrigger value="search" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="filters" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Data Sources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      placeholder="Search by project, locality, or builder..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 bg-purple-900/50 border-purple-600/50 text-white placeholder:text-purple-400"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                  >
                    Search
                  </Button>
                  <Button
                    onClick={loadUnifiedRecommendations}
                    variant="outline"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Advanced Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">City</Label>
                    <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                      <SelectTrigger className="bg-purple-900/50 border-purple-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-purple-600">
                        {tier1Cities.map(city => (
                          <SelectItem key={city} value={city} className="text-white hover:bg-purple-600/20">
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300">Property Type</Label>
                    <Select value={filters.property_type} onValueChange={(value) => handleFilterChange('property_type', value)}>
                      <SelectTrigger className="bg-purple-900/50 border-purple-600/50 text-white">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-purple-600">
                        <SelectItem value="" className="text-white hover:bg-purple-600/20">All Types</SelectItem>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-purple-600/20">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300">Sort By</Label>
                    <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                      <SelectTrigger className="bg-purple-900/50 border-purple-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-purple-600">
                        <SelectItem value="smart_score" className="text-white hover:bg-purple-600/20">Smart Score</SelectItem>
                        <SelectItem value="price" className="text-white hover:bg-purple-600/20">Price</SelectItem>
                        <SelectItem value="area" className="text-white hover:bg-purple-600/20">Area</SelectItem>
                        <SelectItem value="possession_date" className="text-white hover:bg-purple-600/20">Possession Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">BHK Configuration</Label>
                    <div className="flex flex-wrap gap-2">
                      {bhkOptions.map(bhk => (
                        <Badge
                          key={bhk}
                          variant={filters.bhk.includes(bhk) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${
                            filters.bhk.includes(bhk) 
                              ? 'bg-purple-600 text-white' 
                              : 'border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white'
                          }`}
                          onClick={() => handleBHKToggle(bhk)}
                        >
                          {bhk}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-purple-300">Builder Name</Label>
                      <Input
                        placeholder="Enter builder name"
                        value={filters.builder_name}
                        onChange={(e) => handleFilterChange('builder_name', e.target.value)}
                        className="bg-purple-900/50 border-purple-600/50 text-white placeholder:text-purple-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-purple-300">Locality</Label>
                      <Input
                        placeholder="Enter locality"
                        value={filters.locality}
                        onChange={(e) => handleFilterChange('locality', e.target.value)}
                        className="bg-purple-900/50 border-purple-600/50 text-white placeholder:text-purple-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={applyFilters}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Data Source Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-400" />
                        <Label className="text-purple-300">Include API Data</Label>
                      </div>
                      <Switch
                        checked={filters.includeApiData}
                        onCheckedChange={(checked) => handleFilterChange('includeApiData', checked)}
                      />
                    </div>
                    <p className="text-sm text-purple-400">
                      Fetch live data from Housing.com, SquareYards, and NoBroker APIs
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-purple-400" />
                        <Label className="text-purple-300">Include Local Data</Label>
                      </div>
                      <Switch
                        checked={filters.includeLocalData}
                        onCheckedChange={(checked) => handleFilterChange('includeLocalData', checked)}
                      />
                    </div>
                    <p className="text-sm text-purple-400">
                      Include properties from BrickMatrix™ local database and enhanced services
                    </p>
                  </div>
                </div>

                <div className="border-t border-purple-600/30 pt-4">
                  <h4 className="text-purple-200 font-semibold mb-3">API Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-purple-900/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300">Housing.com</span>
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-900/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300">SquareYards</span>
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-900/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300">NoBroker</span>
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Unified Property Listings
            </h2>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-600 text-white">
                {properties.length} properties
              </Badge>
              <Badge variant="outline" className="border-purple-600/50 text-purple-300">
                {filters.city}
              </Badge>
            </div>
          </div>

          {properties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">No Properties Found</h3>
                <p className="text-purple-400 max-w-md mx-auto">
                  Try adjusting your filters or search criteria. We'll help you find the perfect property.
                </p>
                <Button
                  onClick={resetFilters}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                >
                  Reset Filters
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {properties.map((property, index) => (
                  <UnifiedPropertyCard
                    key={property.id}
                    property={property}
                    rank={index + 1}
                    onViewDetails={handleViewDetails}
                    onCompare={handleCompare}
                    onContact={(id) => console.log('Contact:', id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-purple-300 text-sm">
                Powered by Unified Recommendation Engine • Live API Integration • BrickMatrix™ Intelligence
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <span>•</span>
                <span>Cache TTL: 15 minutes</span>
                <span>•</span>
                <span>API timeout: 10 seconds</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        propertyId={selectedPropertyId || ''}
      />
      
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        onViewDetails={handleViewDetails}
        onCompare={handleCompare}
      />
    </div>
  );
};

export default UnifiedRecommendations;