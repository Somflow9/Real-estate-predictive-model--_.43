
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Tired of Guessing Property Prices?{' '}
              <motion.span 
                className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Ask BrickMatric.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground font-medium italic max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              "Smart properties. Smarter decisions. Backed by data, driven by intelligence."
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>
              BrickMatric is India's most advanced AI-powered real estate intelligence platform — transforming how you discover, analyze, and invest in properties.
            </p>
            <p>
              From Tier-1 metros to emerging Tier-3 cities, from luxury penthouses to affordable homes, BrickMatric delivers:
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200 primary-glow">
              <Link to="/chat">Start Conversation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="glow-border px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200">
              <Link to="/recommendations">Get Recommendations</Link>
            </Button>
          </motion.div>

          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Real-time market data • AI-powered valuations • Builder analytics • Live property feeds from 99acres, NoBroker & MagicBricks
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index}>
                <Card 
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 card-shadow glassmorphism glow-border ${
                    visibleCards > index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center group-hover:animate-pulse primary-glow`}>
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
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
                <Link
                  key={index}
                  to="/chat"
                  className="group px-4 py-2 glassmorphism glow-border rounded-full text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md animate-bounce"
                  style={{ animationDelay: `${index * 200}ms`, animationDuration: '2s' }}
                >
                  💭 {prompt}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-2xl primary-glow">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="group cursor-pointer hover:scale-110 transition-transform duration-200">
                  <div className="text-3xl font-bold mb-1">500+</div>
                  <div className="text-sm opacity-90">Properties Listed</div>
                </div>
                <div className="group cursor-pointer hover:scale-110 transition-transform duration-200">
                  <div className="text-3xl font-bold mb-1">95%</div>
                  <div className="text-sm opacity-90">Prediction Accuracy</div>
                </div>
                <div className="group cursor-pointer hover:scale-110 transition-transform duration-200">
                  <div className="text-3xl font-bold mb-1">₹45L</div>
                  <div className="text-sm opacity-90">Average Price</div>
                </div>
                <div className="group cursor-pointer hover:scale-110 transition-transform duration-200">
                  <div className="text-3xl font-bold mb-1">1200</div>
                  <div className="text-sm opacity-90">Avg. Sq. Ft.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-bold text-foreground italic leading-relaxed">
            "Every brick tells a story. Every decision shapes your future. Choose wisely with BrickMatric."
          </blockquote>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200 primary-glow">
              <Link to="/chat">Start Your Journey with BrickMatric</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
