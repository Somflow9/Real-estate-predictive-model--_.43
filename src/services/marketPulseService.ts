
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: 'market-trends' | 'policy-updates' | 'investment-insights' | 'city-spotlight';
  url: string;
  imageUrl?: string;
}

interface MarketInsight {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  description: string;
  city?: string;
}

export class MarketPulseService {
  private newsSources = [
    'Economic Times Real Estate',
    'MagicBricks News',
    'Realty Plus',
    'PropTiger',
    'Housing.com News',
    'Money Control Real Estate'
  ];

  async getLatestNews(): Promise<NewsArticle[]> {
    // Simulate API call to news aggregation service
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.generateRealisticNews();
  }

  async getMarketInsights(): Promise<MarketInsight[]> {
    // Simulate API call to market data service
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.generateMarketInsights();
  }

  private generateRealisticNews(): NewsArticle[] {
    const newsTemplates = [
      {
        title: "Mumbai Property Prices Show 12% Growth in Q4 2024",
        summary: "Residential property prices in Mumbai witnessed significant growth, driven by improved infrastructure and increased demand in suburban areas.",
        category: 'market-trends' as const
      },
      {
        title: "New RERA Guidelines Impact Property Registrations",
        summary: "Updated RERA regulations are expected to streamline property transactions and enhance buyer protection across major cities.",
        category: 'policy-updates' as const
      },
      {
        title: "Institutional Investors Increase Real Estate Allocation",
        summary: "Major pension funds and insurance companies are boosting their real estate investments, indicating strong market confidence.",
        category: 'investment-insights' as const
      },
      {
        title: "Bangalore Emerges as Top Choice for IT Professionals",
        summary: "The city's tech-friendly ecosystem and infrastructure development make it the preferred destination for property investments.",
        category: 'city-spotlight' as const
      },
      {
        title: "Green Building Certifications Drive Premium Pricing",
        summary: "Properties with sustainable features are commanding 15-20% premium in major metropolitan areas.",
        category: 'market-trends' as const
      },
      {
        title: "Government Announces New Housing Scheme for Middle Class",
        summary: "The latest affordable housing initiative aims to support middle-income families with subsidized home loans.",
        category: 'policy-updates' as const
      }
    ];

    return newsTemplates.map((template, index) => ({
      id: `news_${Date.now()}_${index}`,
      title: template.title,
      summary: template.summary,
      source: this.newsSources[Math.floor(Math.random() * this.newsSources.length)],
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: template.category,
      url: '#',
      imageUrl: `https://images.unsplash.com/photo-1560518183-8b3b2c6ac${Math.floor(Math.random() * 100).toString().padStart(2, '0')}?w=400&h=200&fit=crop`
    }));
  }

  private generateMarketInsights(): MarketInsight[] {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];
    
    return [
      {
        id: 'avg_price_india',
        title: 'Average Property Price (India)',
        value: '₹4,250/sq ft',
        change: 8.5,
        changeType: 'positive',
        description: 'National average price per square foot'
      },
      {
        id: 'inventory_levels',
        title: 'Inventory Levels',
        value: '24 months',
        change: -12.3,
        changeType: 'positive',
        description: 'Time to sell existing inventory'
      },
      {
        id: 'new_launches',
        title: 'New Launches (Q4)',
        value: '1,45,000 units',
        change: 18.7,
        changeType: 'positive',
        description: 'New residential units launched'
      },
      ...cities.slice(0, 3).map((city, index) => ({
        id: `price_${city.toLowerCase()}`,
        title: `${city} Price Index`,
        value: `₹${(5000 + Math.random() * 10000).toFixed(0)}/sq ft`,
        change: Math.round((Math.random() * 20 - 10) * 10) / 10,
        changeType: Math.random() > 0.4 ? 'positive' as const : 'negative' as const,
        description: `Average price per square foot in ${city}`,
        city: city
      }))
    ];
  }

  async searchNews(query: string): Promise<NewsArticle[]> {
    const allNews = await this.getLatestNews();
    return allNews.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.summary.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const marketPulseService = new MarketPulseService();
