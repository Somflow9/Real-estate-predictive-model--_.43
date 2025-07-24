
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Newspaper, Search, RefreshCw, ExternalLink, Calendar, BarChart3, Activity, AlertTriangle, Target, Zap, DollarSign } from 'lucide-react';
import { marketPulseEnhancedService } from '@/services/marketPulseEnhancedService';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import AnimatedChart from '@/components/AnimatedChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketPulse = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('3M');
  const [selectedCity, setSelectedCity] = useState('All Tier 1 Cities');
  const [marketInsightFilter, setMarketInsightFilter] = useState('All');

  // Tier 1 cities only
  const tier1Cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];

  const { data: liveMarketPulse, isLoading: pulseLoading, refetch: refetchPulse } = useQuery({
    queryKey: ['live-market-pulse-tier1'],
    queryFn: () => marketPulseEnhancedService.fetchLiveMarketPulse(),
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  const { data: news, isLoading: newsLoading, refetch: refetchNews } = useQuery({
    queryKey: ['market-news-tier1'],
    queryFn: () => marketPulseEnhancedService.fetchMarketNews(),
    refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
  });

  const { data: cityComparison, isLoading: cityLoading, refetch: refetchCities } = useQuery({
    queryKey: ['city-market-comparison-tier1'],
    queryFn: () => marketPulseEnhancedService.fetchCityMarketComparison(),
    refetchInterval: 15 * 60 * 1000, // Auto-refresh every 15 minutes
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchPulse(), refetchNews(), refetchCities()]);
      toast({
        title: "Market Data Refreshed",
        description: "Latest Tier 1 market data and insights have been loaded.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to fetch latest market data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredNews = news?.filter(article =>
    searchQuery === '' ||
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return 'bg-blue-600 text-white';
      case 'policy': return 'bg-green-600 text-white';
      case 'launch': return 'bg-purple-600 text-white';
      case 'builder': return 'bg-orange-600 text-white';
      case 'finance': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Enhanced chart data for Tier 1 cities
  const tier1TrendChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tier 1 Avg Price Index',
        data: [485, 492, 498, 505, 501, 512],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
      },
      {
        label: 'Absorption Rate',
        data: [75, 78, 72, 82, 79, 85],
        borderColor: 'hsl(var(--accent))',
        backgroundColor: 'hsl(var(--accent) / 0.1)',
        tension: 0.4,
      },
    ],
  };

  const tier1PerformanceData = {
    labels: tier1Cities,
    datasets: [
      {
        label: 'Price Growth %',
        data: [15.8, 12.3, 18.5, 14.2, 16.7, 13.9, 11.2, 14.8],
        backgroundColor: tier1Cities.map((_, i) => `hsl(var(--primary) / ${0.8 - i * 0.1})`),
      },
    ],
  };

  const tier1MarketShareData = {
    labels: ['Residential', 'Commercial', 'Luxury'],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--accent))',
          'hsl(var(--secondary))',
        ],
      },
    ],
  };

  if (newsLoading || cityLoading || pulseLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading Tier 1 market intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-purple-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent flex items-center justify-center space-x-2">
          <Activity className="h-10 w-10 text-purple-400" />
          <span>Market Pulse - Tier 1 Intelligence</span>
        </h1>
        <p className="text-purple-200 text-lg">
          Live market intelligence • Real-time data feeds • BrickMatrix™ Engine insights • Tier 1 cities only
        </p>
      </motion.div>

      {/* Live Market Pulse Dashboard */}
      {liveMarketPulse && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-100 flex items-center space-x-2">
                <Zap className="h-6 w-6 text-purple-400" />
                <span>Live Market Pulse</span>
                <Badge className="bg-red-600 text-white animate-pulse ml-2">LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Housing Price Index</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-100">
                    {liveMarketPulse.housingPriceIndex.current}
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    liveMarketPulse.housingPriceIndex.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {liveMarketPulse.housingPriceIndex.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">{liveMarketPulse.housingPriceIndex.change > 0 ? '+' : ''}{liveMarketPulse.housingPriceIndex.change}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Market Sentiment</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-100 capitalize">
                    {liveMarketPulse.cityLevelSentiment.marketType}
                  </div>
                  <div className="text-purple-300 text-sm">
                    Score: {liveMarketPulse.cityLevelSentiment.sentimentScore}/100
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Inventory Levels</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-100">
                    {liveMarketPulse.inventoryData.monthsToSell.toFixed(1)} months
                  </div>
                  <div className="text-purple-300 text-sm">
                    Absorption: {liveMarketPulse.inventoryData.absorptionRate}%
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Loan Rates</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-100">
                    {Object.values(liveMarketPulse.loanTrends.currentRates)[0]?.toFixed(2)}%
                  </div>
                  <div className="text-purple-300 text-sm capitalize">
                    Trend: {liveMarketPulse.loanTrends.rateDirection}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Filters for Tier 1 Cities */}
      <motion.div 
        className="flex flex-wrap gap-4 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-48 bg-purple-900/50 border-purple-600/50 text-purple-200">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent className="bg-purple-900 border-purple-600">
            <SelectItem value="All Tier 1 Cities">All Tier 1 Cities</SelectItem>
            {tier1Cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={marketInsightFilter} onValueChange={setMarketInsightFilter}>
          <SelectTrigger className="w-48 bg-purple-900/50 border-purple-600/50 text-purple-200">
            <SelectValue placeholder="Market Insights" />
          </SelectTrigger>
          <SelectContent className="bg-purple-900 border-purple-600">
            <SelectItem value="All">All Insights</SelectItem>
            <SelectItem value="Price">Price Trends</SelectItem>
            <SelectItem value="Inventory">Inventory Levels</SelectItem>
            <SelectItem value="Launch">New Launches</SelectItem>
            <SelectItem value="Builder">Builder Activity</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex space-x-2">
          <Badge className="bg-green-600 text-white animate-pulse">🔥 Tier 1 Hot</Badge>
          <Badge className="bg-blue-600 text-white">📈 Premium Focus</Badge>
          <Badge className="bg-purple-600 text-white">⚡ BrickMatrix™ Active</Badge>
        </div>
      </motion.div>

      {/* Tier 1 Cities Performance Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {cityComparison?.slice(0, 8).map((cityData, index) => (
          <motion.div
            key={cityData.city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-purple-400 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  <div className={`flex items-center space-x-1 ${
                    cityData.sentimentScore > 75 ? 'text-green-400' : 
                    cityData.sentimentScore < 60 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {cityData.sentimentScore > 75 ? <TrendingUp className="h-4 w-4" /> : 
                     cityData.sentimentScore < 60 ? <TrendingDown className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                    <span className="text-sm font-medium">{cityData.sentimentScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-purple-100">{cityData.city}</h3>
                  <p className="text-sm font-medium text-purple-300">₹{cityData.priceIndex}/sq ft</p>
                  <p className="text-xs text-purple-400">{cityData.newLaunches} new launches • {cityData.inventoryMonths.toFixed(1)} months inventory</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Predictive Analysis Section */}
      {liveMarketPulse?.predictiveAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-100 flex items-center space-x-2">
                <Target className="h-6 w-6 text-purple-400" />
                <span>BrickMatrix™ Predictive Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-purple-200 font-semibold">3-Month Forecast</h4>
                  <div className="text-3xl font-bold text-purple-100">
                    {liveMarketPulse.predictiveAnalysis.priceMovement3Month > 0 ? '+' : ''}
                    {liveMarketPulse.predictiveAnalysis.priceMovement3Month.toFixed(1)}%
                  </div>
                  <div className="text-purple-300 text-sm">Price movement prediction</div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-purple-200 font-semibold">6-Month Forecast</h4>
                  <div className="text-3xl font-bold text-purple-100">
                    {liveMarketPulse.predictiveAnalysis.priceMovement6Month > 0 ? '+' : ''}
                    {liveMarketPulse.predictiveAnalysis.priceMovement6Month.toFixed(1)}%
                  </div>
                  <div className="text-purple-300 text-sm">Extended outlook</div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-purple-200 font-semibold">Confidence Level</h4>
                  <div className="text-3xl font-bold text-purple-100">
                    {liveMarketPulse.predictiveAnalysis.confidenceLevel.toFixed(1)}%
                  </div>
                  <div className="text-purple-300 text-sm">BrickMatrix™ confidence</div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-purple-200 font-semibold mb-3">Key Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {liveMarketPulse.predictiveAnalysis.keyFactors.map((factor, index) => (
                    <Badge key={index} className="bg-purple-600 text-white">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Market Analysis with Tier 1 Charts */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:shadow-2xl transition-all duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-purple-100 flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span>Tier 1 Market Trends Analysis</span>
              </CardTitle>
              <div className="flex space-x-2">
                {['3M', '6M', '1Y'].map((filter) => (
                  <Button
                    key={filter}
                    variant={timeFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeFilter(filter)}
                    className="hover:scale-105 transition-transform bg-purple-900/50 border-purple-600/50 text-purple-200"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-purple-900/30 border border-purple-600/30 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-100">Tier 1 Price Index & Absorption</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedChart type="line" data={tier1TrendChartData} />
                </CardContent>
              </Card>
              
              <Card className="bg-purple-900/30 border border-purple-600/30 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-100">Tier 1 Cities Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedChart type="bar" data={tier1PerformanceData} />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-purple-900/30 border border-purple-600/30 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-100">Tier 1 Market Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedChart type="doughnut" data={tier1MarketShareData} />
                </CardContent>
              </Card>
              
              <Card className="bg-purple-900/30 border border-purple-600/30 lg:col-span-2 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-100">Tier 1 Market Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 text-sm animate-pulse">
                      🔥 Tier 1 Hot Market
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 text-sm">
                      📈 Premium Investor Focus
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 text-sm">
                      ⚡ BrickMatrix™ Active
                    </Badge>
                    <Badge className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 text-sm">
                      🏗️ Infrastructure Boom
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="news" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-purple-900/50 border border-purple-600/30">
            <TabsTrigger value="news" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Tier 1 News
            </TabsTrigger>
            <TabsTrigger value="launches" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Builder Launches
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              City Analysis
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="bg-purple-900/50 border-purple-600/50 text-purple-200 hover:bg-purple-600 hover:text-white hover:scale-105 transition-transform"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <TabsContent value="news" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search Tier 1 market news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-purple-900/50 border-purple-600/50 text-purple-200"
            />
          </div>

          {/* Tier 1 News Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews?.map((article) => (
              <Card key={article.id} className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between space-x-4">
                    <div className="space-y-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category.toUpperCase()}
                      </Badge>
                      <CardTitle className="text-lg leading-tight text-purple-100">{article.title}</CardTitle>
                      {article.citySpecific && (
                        <Badge variant="outline" className="border-purple-600 text-purple-300">
                          {article.citySpecific}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <ExternalLink className="h-4 w-4 text-purple-400 flex-shrink-0" />
                      <Badge className={`text-xs ${getImpactColor(article.impact)}`}>
                        {article.impact} impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-300 text-sm leading-relaxed">{article.summary}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2 text-xs text-purple-400">
                      <Newspaper className="h-3 w-3" />
                      <span>{article.source}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-purple-400">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="launches" className="space-y-4">
          {/* Builder Launch Timeline */}
          {liveMarketPulse?.builderLaunchTimelines && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-100">Upcoming Launches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {liveMarketPulse.builderLaunchTimelines.upcoming.map((launch, index) => (
                    <div key={index} className="p-3 bg-purple-900/30 rounded-lg">
                      <h4 className="font-medium text-purple-200">{launch.projectName}</h4>
                      <p className="text-sm text-purple-300">{launch.builder} • {launch.city}</p>
                      <p className="text-xs text-purple-400">Launch: {launch.launchDate}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-100">Pre-Launch Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {liveMarketPulse.builderLaunchTimelines.preLaunchAlerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-orange-900/30 rounded-lg border border-orange-600/30">
                      <h4 className="font-medium text-orange-200">{alert.project}</h4>
                      <p className="text-sm text-orange-300">{alert.builder} • {alert.city}</p>
                      <p className="text-xs text-orange-400">Expected: {alert.expectedDiscount} discount</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-100">Recent Launches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {liveMarketPulse.builderLaunchTimelines.recentLaunches.map((recent, index) => (
                    <div key={index} className="p-3 bg-green-900/30 rounded-lg border border-green-600/30">
                      <h4 className="font-medium text-green-200">{recent.project}</h4>
                      <p className="text-sm text-green-300">{recent.builder} • {recent.city}</p>
                      <p className="text-xs text-green-400">Response: {recent.responseRate} • {recent.soldUnits}/{recent.totalUnits} sold</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-100 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>Tier 1 Market Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-900/30 rounded-lg">
                    <span className="text-sm font-medium text-green-200">Premium Residential Demand</span>
                    <Badge className="bg-green-600 text-white">+18.5%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-900/30 rounded-lg">
                    <span className="text-sm font-medium text-blue-200">Luxury Segment Growth</span>
                    <Badge className="bg-blue-600 text-white">+22.3%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg">
                    <span className="text-sm font-medium text-purple-200">Metro Connectivity Impact</span>
                    <Badge className="bg-purple-600 text-white">+25%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-100 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <span>Top Performing Localities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cityComparison?.slice(0, 5).map((cityData) => (
                    <div key={cityData.city} className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-purple-200">{cityData.city}</span>
                        <p className="text-xs text-purple-400">{cityData.topLocalities[0]}</p>
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        cityData.absorptionRate > 80 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {cityData.absorptionRate > 80 ? 
                          <TrendingUp className="h-3 w-3" /> : 
                          <Activity className="h-3 w-3" />
                        }
                        <span className="text-sm font-medium">{cityData.absorptionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Data Sources for Tier 1 */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-600/30 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">Tier 1 Intelligence Sources:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['MoneyControl Realty', 'ET Realty', 'CREDAI Reports', 'PropIndex', 'Government RERA', 'BrickMatrix™ Engine'].map(source => (
                <Badge key={source} variant="outline" className="text-xs border-purple-600 text-purple-300">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default MarketPulse;
