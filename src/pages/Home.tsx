import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, TrendingUp, Search, Star, MapPin, Shield, Clock, Users, Crown, Home, Zap, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [visibleCards, setVisibleCards] = useState(0);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showBestSegments, setShowBestSegments] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Price Estimates",
      description: "Get accurate, AI-powered property valuations based on current market data",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      title: "Builder Trust Scores", 
      description: "Detailed credibility analysis of developers and construction companies",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: MapPin,
      title: "Local Insights",
      description: "Schools, transport, crime rates, hospitals - everything about your neighborhood",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Clock,
      title: "Area Price Trends",
      description: "Historical data and future projections for informed investment decisions",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Search,
      title: "Smart Property Search",
      description: "Tier-1 and Tier-2 listings with advanced AI-powered filtering",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: Users,
      title: "Expert Consultation",
      description: "Chat with BrickMatric AI for personalized advice and recommendations",
      color: "from-indigo-400 to-indigo-600"
    }
  ];

  const promptSuggestions = [
    "Want to explore prices in Mumbai?",
    "Check builder credibility scores?",
    "Find family-friendly neighborhoods?",
    "Compare investment opportunities?"
  ];

  const bestSegments = [
    {
      icon: Crown,
      title: "Luxury Villas",
      description: "Premium villas with world-class amenities",
      price: "₹2.5Cr+",
      color: "from-yellow-400 to-amber-600",
      bgGradient: "from-yellow-900/20 to-amber-900/20"
    },
    {
      icon: Home,
      title: "Budget Apartments",
      description: "Affordable homes for first-time buyers",
      price: "₹25L+",
      color: "from-green-400 to-emerald-600",
      bgGradient: "from-green-900/20 to-emerald-900/20"
    },
    {
      icon: Zap,
      title: "New Launches",
      description: "Latest projects with early bird offers",
      price: "₹45L+",
      color: "from-blue-400 to-cyan-600",
      bgGradient: "from-blue-900/20 to-cyan-900/20"
    },
    {
      icon: Gift,
      title: "Builder Offers",
      description: "Exclusive deals and limited-time schemes",
      price: "Save 15%",
      color: "from-purple-400 to-violet-600",
      bgGradient: "from-purple-900/20 to-violet-900/20"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCards(prev => {
        const nextValue = prev < features.length ? prev + 1 : prev;
        return nextValue;
      });
    }, 200);

    const promptTimer = setTimeout(() => setShowPrompts(true), 2000);
    const segmentTimer = setTimeout(() => setShowBestSegments(true), 2500);

    return () => {
      clearInterval(timer);
      clearTimeout(promptTimer);
      clearTimeout(segmentTimer);
    };
  }, [features.length]);

  // Safe animation variants with fallback values
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 50, 
      rotateY: -15 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      rotateY: 0
    }
  };

  const heroVariants = {
    initial: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1 
    }
  };

  const titleVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      rotateX: -15 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotateX: 0 
    }
  };

  const promptVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div 
            className="space-y-4"
            variants={heroVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
              variants={titleVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            >
              <span>Tired of Guessing Property Prices? </span>
              <motion.span 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Ask Recommendation Center.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 font-medium italic max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              "Smart properties. Smarter decisions. Backed by data, driven by intelligence."
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto space-y-6 text-lg text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p>
              Recommendation Center is India's most advanced AI-powered real estate intelligence platform — transforming how you discover, analyze, and invest in properties.
            </p>
            <p>
              From Tier-1 metros to emerging Tier-3 cities, from luxury penthouses to affordable plots, Recommendation Center delivers:
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold hover:shadow-2xl hover:shadow-yellow-500/25 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105">
                <Link to="/chat">Start Conversation</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg" className="border-2 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 px-8 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                <Link to="/recommendations">Get Recommendations</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-lg text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Real-time market data • BrickMatrix™ valuations • Builder analytics • Tier 1-3 city coverage • Live feeds from 99acres, NoBroker & MagicBricks
          </motion.p>
        </div>
      </section>

      {/* Best of Each Segment Section */}
      {showBestSegments && (
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Best of Each Segment
              </h2>
              <p className="text-gray-300 text-lg">
                Curated selections powered by BrickMatrix™ intelligence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSegments.map((segment, index) => {
                const segmentKey = `segment-${index}-${segment.title || 'unknown'}`;
                return (
                  <motion.div
                    key={segmentKey}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className={`group cursor-pointer transition-all duration-500 bg-gradient-to-br ${segment.bgGradient || 'from-gray-800/50 to-gray-900/50'} border border-gray-700/50 hover:border-gray-600 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10`}>
                      <CardHeader className="text-center pb-2">
                        <motion.div 
                          className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${segment.color || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}
                          whileHover={{ 
                            rotate: 360,
                            scale: 1.1,
                            transition: { duration: 0.6 }
                          }}
                        >
                          <segment.icon className="h-8 w-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                          {segment.title || 'Unknown'}
                        </CardTitle>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${segment.color || 'from-gray-400 to-gray-600'} bg-clip-text text-transparent`}>
                          {segment.price || 'N/A'}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-center text-sm leading-relaxed">
                          {segment.description || 'No description available'}
                        </p>
                        <motion.div
                          className="mt-4 text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button 
                            size="sm" 
                            className={`bg-gradient-to-r ${segment.color || 'from-gray-400 to-gray-600'} text-white hover:shadow-lg transition-all duration-300 rounded-xl px-6`}
                          >
                            Explore
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const featureKey = `feature-${index}-${feature.title || 'unknown'}`;
              const isVisible = visibleCards > index;
              
              return (
                <motion.div 
                  key={featureKey}
                  variants={cardVariants}
                  initial="initial"
                  animate={isVisible ? "animate" : "initial"}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card 
                    className="group cursor-pointer transition-all duration-500 bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 rounded-2xl"
                  >
                    <CardHeader className="text-center pb-2">
                      <motion.div 
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1,
                          transition: { duration: 0.6 }
                        }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {feature.title || 'Unknown Feature'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-center leading-relaxed">
                        {feature.description || 'No description available'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prompt Suggestion Bubbles */}
      {showPrompts && (
        <section className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {promptSuggestions.map((prompt, index) => {
                const promptKey = `prompt-${index}-${prompt ? prompt.slice(0, 10) : 'unknown'}`;
                return (
                  <motion.div
                    key={promptKey}
                    variants={promptVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Link
                      to="/chat"
                      className="group px-4 py-2 bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                    >
                      💭 {prompt || 'Ask a question'}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-2xl shadow-yellow-500/25 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <motion.div 
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl font-bold mb-1">500+</div>
                    <div className="text-sm opacity-90">Properties Listed</div>
                  </motion.div>
                  <motion.div 
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl font-bold mb-1">95%</div>
                    <div className="text-sm opacity-90">Prediction Accuracy</div>
                  </motion.div>
                  <motion.div 
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl font-bold mb-1">₹45L</div>
                    <div className="text-sm opacity-90">Average Price</div>
                  </motion.div>
                  <motion.div 
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl font-bold mb-1">1200</div>
                    <div className="text-sm opacity-90">Avg. Sq. Ft.</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote 
            className="text-2xl md:text-3xl font-bold text-foreground italic leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            "Every brick tells a story. Every decision shapes your future. Choose wisely with Recommendation Center."
          </motion.blockquote>
          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold hover:shadow-2xl hover:shadow-yellow-500/25 px-8 py-4 rounded-2xl transition-all duration-300">
                <Link to="/chat">Start Your Journey with Recommendation Center</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;