
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Newspaper, Search, RefreshCw, ExternalLink, Calendar, BarChart3 } from 'lucide-react';
import { marketPulseService } from '@/services/marketPulseService';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import AnimatedChart from '@/components/AnimatedChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketPulse = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('3M');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [marketInsightFilter, setMarketInsightFilter] = useState('All');

  const { data: news, isLoading: newsLoading, refetch: refetchNews } = useQuery({
    queryKey: ['market-news'],
    queryFn: () => marketPulseService.getLatestNews(),
    refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
  });

  const { data: insights, isLoading: insightsLoading, refetch: refetchInsights } = useQuery({
    queryKey: ['market-insights'],
    queryFn: () => marketPulseService.getMarketInsights(),
    refetchInterval: 15 * 60 * 1000, // Auto-refresh every 15 minutes
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchNews(), refetchInsights()]);
      toast({
        title: "Market Data Refreshed",
        description: "Latest news and insights have been loaded.",
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
      case 'market-trends': return 'bg-blue-100 text-blue-800';
      case 'policy-updates': return 'bg-green-100 text-green-800';
      case 'investment-insights': return 'bg-purple-100 text-purple-800';
      case 'city-spotlight': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeVariant = (timeFilter: string) => {
    switch (timeFilter) {
      case '3M': return 'default';
      case '6M': return 'secondary';
      case '1Y': return 'outline';
      default: return 'default';
    }
  };

  // Mock chart data for demonstration
  const trendChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Property Prices',
        data: [65, 68, 70, 75, 72, 78],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
      },
      {
        label: 'Market Activity',
        data: [45, 52, 48, 61, 55, 67],
        borderColor: 'hsl(var(--accent))',
        backgroundColor: 'hsl(var(--accent) / 0.1)',
        tension: 0.4,
      },
    ],
  };

  const cityPerformanceData = {
    labels: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'],
    datasets: [
      {
        label: 'Price Growth %',
        data: [15.8, 12.3, 18.5, 14.2, 16.7],
        backgroundColor: [
          'hsl(var(--primary) / 0.8)',
          'hsl(var(--accent) / 0.8)',
          'hsl(var(--primary) / 0.6)',
          'hsl(var(--accent) / 0.6)',
          'hsl(var(--primary) / 0.4)',
        ],
      },
    ],
  };

  const marketShareData = {
    labels: ['Residential', 'Commercial', 'Industrial'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--accent))',
          'hsl(var(--muted))',
        ],
      },
    ],
  };
  // Enhanced market insights with city-specific data
  const getEnhancedInsights = () => {
    if (!insights) return [];
    
    let filteredInsights = [...insights];
    
    if (selectedCity !== 'All Cities') {
      filteredInsights = filteredInsights.filter(insight => 
        insight.city === selectedCity || !insight.city
      );
    }
    
    if (marketInsightFilter !== 'All') {
      // Add filtering logic based on insight type
      filteredInsights = filteredInsights.filter(insight => 
        insight.title.toLowerCase().includes(marketInsightFilter.toLowerCase())
      );
    }
    
    return filteredInsights;
  };

  if (newsLoading || insightsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading market pulse data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold gradient-text-primary flex items-center justify-center space-x-2">
          <TrendingUp className="h-8 w-8" />
          <span>Market Pulse - Live Intelligence</span>
        </h1>
        <p className="text-muted-foreground">
          Interactive market analytics • Real-time data feeds • AI-powered insights • Tier 1-3 city coverage
        </p>
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div 
        className="flex flex-wrap gap-4 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-48 glassmorphism glow-border">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Cities">All Cities</SelectItem>
            <SelectItem value="Mumbai">Mumbai</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Pune">Pune</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={marketInsightFilter} onValueChange={setMarketInsightFilter}>
          <SelectTrigger className="w-48 glassmorphism glow-border">
            <SelectValue placeholder="Market Insights" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Insights</SelectItem>
            <SelectItem value="Price">Price Trends</SelectItem>
            <SelectItem value="Inventory">Inventory Levels</SelectItem>
            <SelectItem value="Launch">New Launches</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex space-x-2">
          <Badge className="bg-green-500 text-white animate-pulse">🔥 Hot Market</Badge>
          <Badge className="bg-blue-500 text-white">📈 Investor Attention</Badge>
          <Badge className="bg-orange-500 text-white">⚡ High Demand</Badge>
        </div>
      </motion.div>
      {/* Market Insights Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {getEnhancedInsights().map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-primary glassmorphism hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <div className={`flex items-center space-x-1 ${
                    insight.changeType === 'positive' ? 'text-green-600' : 
                    insight.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.changeType === 'positive' ? <TrendingUp className="h-4 w-4" /> : 
                     insight.changeType === 'negative' ? <TrendingDown className="h-4 w-4" /> : null}
                    <span className="text-sm font-medium">{insight.change > 0 ? '+' : ''}{insight.change}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{insight.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Market Analysis with Charts */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="glassmorphism glow-border hover:shadow-2xl transition-all duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span>Market Trends Analysis</span>
              </CardTitle>
              <div className="flex space-x-2">
                {['3M', '6M', '1Y'].map((filter) => (
                  <Button
                    key={filter}
                    variant={timeFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeFilter(filter)}
                    className="hover:scale-105 transition-transform glassmorphism"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glassmorphism hover:glow-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Price Trends & Market Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedChart type="line" data={trendChartData} />
                </CardContent>
              </Card>
              
              <Card className="glassmorphism hover:glow-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">City Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedChart type="bar" data={cityPerformanceData} />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glassmorphism hover:glow-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Market Share Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedChart type="doughnut" data={marketShareData} />
                </CardContent>
              </Card>
              
              <Card className="glassmorphism lg:col-span-2 hover:glow-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Market Status Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm animate-pulse">
                      🔥 Hot Market
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm">
                      📈 Investor Attention
                    </Badge>
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 text-sm">
                      ⚡ High Demand
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm">
                      🏗️ Under Development
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
          <TabsList className="glassmorphism">
            <TabsTrigger value="news">Latest News</TabsTrigger>
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          </TabsList>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="glassmorphism glow-border hover:scale-105 transition-transform"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <TabsContent value="news" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glassmorphism glow-border"
            />
          </div>

          {/* News Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews?.map((article) => (
              <Card key={article.id} className="glassmorphism hover:shadow-lg transition-all duration-300 hover:scale-105 glow-border">
                <CardHeader>
                  <div className="flex items-start justify-between space-x-4">
                    <div className="space-y-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{article.summary}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Newspaper className="h-3 w-3" />
                      <span>{article.source}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glassmorphism glow-border hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Market Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Residential Demand</span>
                    <Badge className="bg-green-100 text-green-800">+15.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Commercial Investments</span>
                    <Badge className="bg-blue-100 text-blue-800">+8.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">Infrastructure Development</span>
                    <Badge className="bg-orange-100 text-orange-800">+22%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism glow-border hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>City Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {insights?.filter(i => i.city).map((cityInsight) => (
                    <div key={cityInsight.id} className="flex justify-between items-center p-3 bg-accent rounded-lg">
                      <span className="text-sm font-medium">{cityInsight.city}</span>
                      <div className={`flex items-center space-x-1 ${
                        cityInsight.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {cityInsight.changeType === 'positive' ? 
                          <TrendingUp className="h-3 w-3" /> : 
                          <TrendingDown className="h-3 w-3" />
                        }
                        <span className="text-sm font-medium">{cityInsight.change > 0 ? '+' : ''}{cityInsight.change}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Data Sources */}
      <Card className="glassmorphism glow-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">News sources:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Economic Times Real Estate', 'MagicBricks News', 'Realty Plus', 'PropTiger', 'Housing.com News'].map(source => (
                <Badge key={source} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPulse;
