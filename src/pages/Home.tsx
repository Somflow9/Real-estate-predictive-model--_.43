
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, TrendingUp, Search, Star, MapPin, Shield, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  const [visibleCards, setVisibleCards] = useState(0);
  const [showPrompts, setShowPrompts] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCards(prev => prev < features.length ? prev + 1 : prev);
    }, 200);

    setTimeout(() => setShowPrompts(true), 2000);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-gradient)' }}>
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            >
              Tired of Guessing Property Prices?{' '}
              <motion.span 
                className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Ask BrickMatric.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground font-medium italic max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              "Smart properties. Smarter decisions. Backed by data, driven by intelligence."
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p>
              BrickMatric is India's most advanced AI-powered real estate intelligence platform — transforming how you discover, analyze, and invest in properties.
            </p>
            <p>
              From Tier-1 metros to emerging Tier-3 cities, from luxury penthouses to affordable plots, BrickMatric delivers:
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
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg px-8 py-3 rounded-xl transition-all duration-300 primary-glow">
                <Link to="/chat">Start Conversation</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg" className="glow-border px-8 py-3 rounded-xl transition-all duration-300">
                <Link to="/recommendations">Get Recommendations</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Real-time market data • AI-powered valuations • Builder analytics • Tier 1-3 city coverage • Live feeds from 99acres, NoBroker & MagicBricks
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ 
                  opacity: visibleCards > index ? 1 : 0, 
                  y: visibleCards > index ? 0 : 50,
                  rotateY: visibleCards > index ? 0 : -15
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <Card 
                  className="group cursor-pointer transition-all duration-500 card-shadow glassmorphism glow-border hover:shadow-2xl"
                >
                <CardHeader className="text-center pb-2">
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center primary-glow"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1,
                      transition: { duration: 0.6 }
                    }}
                  >
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </motion.div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prompt Suggestion Bubbles */}
      {showPrompts && (
        <section className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {promptSuggestions.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
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
                    className="group px-4 py-2 glassmorphism glow-border rounded-full text-sm text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  💭 {prompt}
                </Link>
                </motion.div>
              ))}
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
            <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-2xl primary-glow">
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
            "Every brick tells a story. Every decision shapes your future. Choose wisely with BrickMatric."
          </motion.blockquote>
          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent px-8 py-3 rounded-xl transition-all duration-300 primary-glow">
                <Link to="/chat">Start Your Journey with BrickMatric</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
