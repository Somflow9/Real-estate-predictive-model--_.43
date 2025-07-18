
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, TrendingUp, Search, Star, MapPin, Shield, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
      description: "Chat with PropGyan for personalized advice and recommendations",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Tired of Guessing Property Prices?{' '}
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Ask PropGyan.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-medium italic max-w-4xl mx-auto">
              "Home isn't just a place, it's a decision — let's make it a smart one."
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              PropGyan is your AI-powered real estate guide — here to help you make smarter property decisions without the confusion.
            </p>
            <p>
              Whether you're exploring a new city, checking a builder's credibility, or comparing prices, PropGyan gives you:
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
              <Link to="/chat">Start Conversation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-orange-200 hover:border-orange-300 px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200">
              <Link to="/recommendations">Get Recommendations</Link>
            </Button>
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            No fluff. No sales pitch. Just clean, data-backed property guidance in one smart conversation.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl border-2 border-orange-100 hover:border-orange-200 bg-gradient-to-br from-white to-gray-50 ${
                  visibleCards > index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:animate-pulse`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
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
                  className="group px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-orange-300 hover:bg-white transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md animate-bounce"
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
          <Card className="bg-gradient-to-r from-blue-500 to-orange-500 text-white border-0 shadow-2xl">
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
            "Where you live is your story — make sure the first chapter isn't a mistake."
          </blockquote>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
              <Link to="/chat">Start Your Story with PropGyan</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
