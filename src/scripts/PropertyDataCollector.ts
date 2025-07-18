
import { openaiService } from '@/services/openaiService';
import { indianCities, indianProperties, type IndianCity, type IndianProperty } from '@/data/indianCitiesData';

interface ScrapingConfig {
  city: string;
  state: string;
  propertyType: 'apartment' | 'villa' | 'house' | 'plot' | 'commercial';
  minPrice: number;
  maxPrice: number;
  sources: string[];
}

interface AIPropertyAnalysis {
  marketTrend: string;
  priceAnalysis: string;
  investmentAdvice: string;
  demographicInsights: string;
  futureProjections: string;
}

export class PropertyDataCollector {
  private static instance: PropertyDataCollector;
  private collectedData: IndianProperty[] = [];
  private analysisCache: Map<string, AIPropertyAnalysis> = new Map();

  static getInstance(): PropertyDataCollector {
    if (!PropertyDataCollector.instance) {
      PropertyDataCollector.instance = new PropertyDataCollector();
    }
    return PropertyDataCollector.instance;
  }

  // Main function to collect and analyze property data across India
  async collectNationwidePropertyData(): Promise<{
    properties: IndianProperty[];
    cityAnalysis: Map<string, AIPropertyAnalysis>;
    summary: string;
  }> {
    console.log('Starting nationwide property data collection...');
    
    const tier1Cities = indianCities.filter(city => city.tier === 1);
    const tier2Cities = indianCities.filter(city => city.tier === 2);
    
    // Collect data from Tier 1 cities first
    for (const city of tier1Cities) {
      await this.collectCityData(city);
      await this.analyzeMarketWithAI(city);
    }
    
    // Then collect data from Tier 2 cities
    for (const city of tier2Cities.slice(0, 10)) { // Limit to first 10 to avoid overwhelming
      await this.collectCityData(city);
      await this.analyzeMarketWithAI(city);
    }
    
    const summary = await this.generateNationalSummary();
    
    return {
      properties: this.collectedData,
      cityAnalysis: this.analysisCache,
      summary
    };
  }

  // Scrape property data for a specific city
  private async collectCityData(city: IndianCity): Promise<void> {
    console.log(`Collecting data for ${city.name}, ${city.state}...`);
    
    const scrapingConfigs: ScrapingConfig[] = [
      {
        city: city.name,
        state: city.state,
        propertyType: 'apartment',
        minPrice: city.averagePrice * 0.5,
        maxPrice: city.averagePrice * 2,
        sources: ['99acres', 'magicbricks', 'housing', 'nobroker']
      },
      {
        city: city.name,
        state: city.state,
        propertyType: 'villa',
        minPrice: city.averagePrice * 1.5,
        maxPrice: city.averagePrice * 3,
        sources: ['99acres', 'magicbricks']
      }
    ];

    for (const config of scrapingConfigs) {
      const properties = await this.scrapePropertyData(config);
      this.collectedData.push(...properties);
    }
  }

  // Simulate property scraping (in real implementation, this would use actual scraping)
  private async scrapePropertyData(config: ScrapingConfig): Promise<IndianProperty[]> {
    console.log(`Scraping ${config.propertyType} properties in ${config.city}...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data based on real patterns
    const mockProperties: IndianProperty[] = [];
    const baseCount = config.city === 'Mumbai' || config.city === 'Delhi' ? 15 : 8;
    
    for (let i = 0; i < baseCount; i++) {
      const property: IndianProperty = {
        id: `${config.city.slice(0, 3).toUpperCase()}${Date.now()}${i}`,
        title: this.generatePropertyTitle(config),
        price: this.generatePrice(config),
        location: this.generateLocation(config.city),
        city: config.city,
        state: config.state,
        type: config.propertyType,
        bedrooms: config.propertyType === 'plot' ? 0 : Math.floor(Math.random() * 4) + 1,
        bathrooms: config.propertyType === 'plot' ? 0 : Math.floor(Math.random() * 3) + 1,
        area: this.generateArea(config.propertyType),
        amenities: this.generateAmenities(config.propertyType),
        description: `Premium ${config.propertyType} in ${config.city} with modern amenities`,
        imageUrl: '/placeholder.svg',
        isNew: Math.random() > 0.7,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        developer: this.generateDeveloper(config.city)
      };
      mockProperties.push(property);
    }
    
    return mockProperties;
  }

  // Use AI to analyze market trends and provide insights
  private async analyzeMarketWithAI(city: IndianCity): Promise<void> {
    const cacheKey = `${city.name}-${city.state}`;
    if (this.analysisCache.has(cacheKey)) return;

    console.log(`Analyzing market trends for ${city.name} with AI...`);
    
    const cityProperties = this.collectedData.filter(p => p.city === city.name);
    const prompt = `
    Analyze the real estate market for ${city.name}, ${city.state}, India based on the following data:
    - Average property price: ₹${city.averagePrice} per sq ft
    - Population: ${city.population.toLocaleString()}
    - Market growth: ${city.growth}%
    - Tier: ${city.tier}
    - Available properties: ${cityProperties.length}
    
    Provide insights in the following format:
    1. Market Trend Analysis
    2. Price Analysis and Predictions
    3. Investment Advice
    4. Demographic Insights
    5. Future Market Projections
    
    Keep each section concise but informative.
    `;

    try {
      const apiKey = openaiService.getApiKey();
      if (!apiKey) {
        console.warn('OpenAI API key not available, using mock analysis');
        this.analysisCache.set(cacheKey, this.generateMockAnalysis(city));
        return;
      }

      const response = await openaiService.sendMessage([
        { role: 'system', content: 'You are a real estate market analyst specializing in Indian property markets.' },
        { role: 'user', content: prompt }
      ]);

      const analysis: AIPropertyAnalysis = {
        marketTrend: this.extractSection(response, '1. Market Trend Analysis'),
        priceAnalysis: this.extractSection(response, '2. Price Analysis and Predictions'),
        investmentAdvice: this.extractSection(response, '3. Investment Advice'),
        demographicInsights: this.extractSection(response, '4. Demographic Insights'),
        futureProjections: this.extractSection(response, '5. Future Market Projections')
      };

      this.analysisCache.set(cacheKey, analysis);
    } catch (error) {
      console.error(`Error analyzing market for ${city.name}:`, error);
      this.analysisCache.set(cacheKey, this.generateMockAnalysis(city));
    }
  }

  // Generate comprehensive national summary using AI
  private async generateNationalSummary(): Promise<string> {
    const tier1Data = this.collectedData.filter(p => indianCities.find(c => c.name === p.city)?.tier === 1);
    const tier2Data = this.collectedData.filter(p => indianCities.find(c => c.name === p.city)?.tier === 2);
    
    const prompt = `
    Generate a comprehensive summary of the Indian real estate market based on:
    - Total properties analyzed: ${this.collectedData.length}
    - Tier 1 city properties: ${tier1Data.length}
    - Tier 2 city properties: ${tier2Data.length}
    - Cities covered: ${Array.from(new Set(this.collectedData.map(p => p.city))).join(', ')}
    
    Provide a national market overview, key trends, and investment recommendations.
    `;

    try {
      const apiKey = openaiService.getApiKey();
      if (!apiKey) {
        return this.generateMockSummary();
      }

      return await openaiService.sendMessage([
        { role: 'system', content: 'You are a senior real estate market analyst providing national market insights for India.' },
        { role: 'user', content: prompt }
      ]);
    } catch (error) {
      console.error('Error generating national summary:', error);
      return this.generateMockSummary();
    }
  }

  // Export collected data to various formats
  exportData(): {
    csv: string;
    json: string;
    summary: string;
  } {
    const csvHeaders = ['ID', 'Title', 'Price', 'City', 'State', 'Type', 'Bedrooms', 'Area', 'Rating'];
    const csvRows = this.collectedData.map(property => [
      property.id,
      property.title,
      property.price,
      property.city,
      property.state,
      property.type,
      property.bedrooms,
      property.area,
      property.rating
    ]);
    
    const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    const json = JSON.stringify(this.collectedData, null, 2);
    
    const summary = `
Property Data Collection Summary:
- Total Properties: ${this.collectedData.length}
- Cities Covered: ${Array.from(new Set(this.collectedData.map(p => p.city))).length}
- States Covered: ${Array.from(new Set(this.collectedData.map(p => p.state))).length}
- Property Types: ${Array.from(new Set(this.collectedData.map(p => p.type))).join(', ')}
- Price Range: ₹${Math.min(...this.collectedData.map(p => p.price))} - ₹${Math.max(...this.collectedData.map(p => p.price))}
- Average Rating: ${(this.collectedData.reduce((sum, p) => sum + p.rating, 0) / this.collectedData.length).toFixed(1)}
    `;
    
    return { csv, json, summary };
  }

  // Utility methods for data generation
  private generatePropertyTitle(config: ScrapingConfig): string {
    const types = {
      apartment: [`${Math.floor(Math.random() * 4) + 1}BHK Apartment`, 'Luxury Flat', 'Premium Apartment'],
      villa: ['Independent Villa', 'Luxury Villa', 'Gated Community Villa'],
      house: ['Independent House', 'Row House', 'Duplex House'],
      plot: ['Residential Plot', 'Commercial Plot', 'Premium Plot'],
      commercial: ['Office Space', 'Retail Shop', 'Commercial Complex']
    };
    
    const areas = ['Sector', 'Phase', 'Block', 'Extension', 'Colony'];
    const areaName = `${areas[Math.floor(Math.random() * areas.length)]} ${Math.floor(Math.random() * 50) + 1}`;
    
    return `${types[config.propertyType][Math.floor(Math.random() * types[config.propertyType].length)]} in ${areaName}, ${config.city}`;
  }

  private generatePrice(config: ScrapingConfig): number {
    const basePrice = config.minPrice + Math.random() * (config.maxPrice - config.minPrice);
    return Math.round(basePrice * 100000); // Convert to actual rupees
  }

  private generateLocation(city: string): string {
    const commonAreas: { [key: string]: string[] } = {
      'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Thane', 'Navi Mumbai'],
      'Delhi': ['Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad', 'Dwarka'],
      'Bengaluru': ['Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Marathahalli'],
      'default': ['Central Area', 'New Town', 'City Center', 'IT Hub', 'Business District']
    };
    
    const areas = commonAreas[city] || commonAreas['default'];
    return areas[Math.floor(Math.random() * areas.length)];
  }

  private generateArea(type: string): number {
    const ranges = {
      apartment: [500, 2000],
      villa: [1500, 4000],
      house: [800, 2500],
      plot: [1000, 5000],
      commercial: [300, 1500]
    };
    
    const [min, max] = ranges[type as keyof typeof ranges] || [500, 2000];
    return Math.floor(Math.random() * (max - min) + min);
  }

  private generateAmenities(type: string): string[] {
    const commonAmenities = ['Security', 'Parking', 'Power Backup'];
    const typeSpecific = {
      apartment: ['Swimming Pool', 'Gym', 'Clubhouse', 'Garden'],
      villa: ['Private Garden', 'Swimming Pool', 'Servant Quarters'],
      house: ['Garden', 'Terrace', 'Garage'],
      plot: ['Boundary Wall', 'Water Connection', 'Electricity'],
      commercial: ['Elevator', 'AC', 'Conference Room', '24/7 Access']
    };
    
    const specific = typeSpecific[type as keyof typeof typeSpecific] || [];
    const selected = [...commonAmenities];
    specific.forEach(amenity => {
      if (Math.random() > 0.5) selected.push(amenity);
    });
    
    return selected;
  }

  private generateDeveloper(city: string): string | undefined {
    const developers = [
      'DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group',
      'Sobha Limited', 'Lodha Group', 'Hiranandani Group', 'Mahindra Lifespace'
    ];
    
    return Math.random() > 0.3 ? developers[Math.floor(Math.random() * developers.length)] : undefined;
  }

  private extractSection(text: string, sectionTitle: string): string {
    const lines = text.split('\n');
    const startIndex = lines.findIndex(line => line.includes(sectionTitle));
    if (startIndex === -1) return 'Analysis not available';
    
    const endIndex = lines.findIndex((line, index) => 
      index > startIndex && line.match(/^\d+\./) && !line.includes(sectionTitle)
    );
    
    const sectionLines = lines.slice(startIndex + 1, endIndex === -1 ? undefined : endIndex);
    return sectionLines.join('\n').trim() || 'Analysis not available';
  }

  private generateMockAnalysis(city: IndianCity): AIPropertyAnalysis {
    return {
      marketTrend: `${city.name} shows ${city.growth > 8 ? 'strong' : 'moderate'} growth with ${city.tier === 1 ? 'high' : 'steady'} demand.`,
      priceAnalysis: `Average price of ₹${city.averagePrice}/sq ft is ${city.tier === 1 ? 'premium' : 'competitive'} for the region.`,
      investmentAdvice: `${city.tier === 1 ? 'Excellent' : 'Good'} investment opportunity with projected returns of ${city.growth}% annually.`,
      demographicInsights: `Population of ${city.population.toLocaleString()} creates ${city.tier === 1 ? 'high' : 'steady'} housing demand.`,
      futureProjections: `Expected ${city.growth}% growth over next 5 years with infrastructure development driving demand.`
    };
  }

  private generateMockSummary(): string {
    return `
National Real Estate Market Summary:

The Indian real estate market shows robust growth across tier 1 and tier 2 cities. 
With ${this.collectedData.length} properties analyzed across major cities, the market 
demonstrates strong fundamentals with average growth rates of 8-12% annually.

Key highlights:
- Tier 1 cities leading in premium segments
- Tier 2 cities showing emerging opportunities  
- Strong demand in residential and commercial sectors
- Technology hubs driving property appreciation

Investment recommendation: Diversified portfolio across tier 1 and tier 2 cities 
for optimal risk-return balance.
    `;
  }

  // Get collected data
  getCollectedData(): IndianProperty[] {
    return this.collectedData;
  }

  // Get city analysis
  getCityAnalysis(): Map<string, AIPropertyAnalysis> {
    return this.analysisCache;
  }
}

// Export singleton instance
export const propertyDataCollector = PropertyDataCollector.getInstance();

// Utility functions for integration with existing components
export const integrateWithScraper = async () => {
  console.log('Starting integrated property data collection...');
  const collector = PropertyDataCollector.getInstance();
  const result = await collector.collectNationwidePropertyData();
  
  console.log('Data collection completed!');
  console.log(`Properties collected: ${result.properties.length}`);
  console.log(`Cities analyzed: ${result.cityAnalysis.size}`);
  
  return result;
};

export const exportCollectedData = () => {
  const collector = PropertyDataCollector.getInstance();
  return collector.exportData();
};
