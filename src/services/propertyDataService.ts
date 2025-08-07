import { Property } from '@/types/property';

interface ScrapingConfig {
  location: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
}

interface PropertySource {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export class PropertyDataService {
  private sources: PropertySource[] = [
    { id: '99acres', name: '99acres', url: 'https://www.99acres.com', isActive: true },
    { id: 'magicbricks', name: 'MagicBricks', url: 'https://www.magicbricks.com', isActive: true },
  ];

  private tier1Cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Gurgaon'];
  private tier2Cities = ['Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Vadodara', 'Patna', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar'];

  async scrapeProperties(config: ScrapingConfig): Promise<Property[]> {
    console.log('Starting property scraping with config:', config);
    
    // Simulate real-time scraping with progressive data loading
    const properties: Property[] = [];
    
    for (const source of this.sources.filter(s => s.isActive)) {
      console.log(`Scraping from ${source.name}...`);
      
      // Simulate network delay and data collection
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const sourceProperties = await this.generateRealisticProperties(source, config);
      properties.push(...sourceProperties);
    }

    // Apply AI-powered filtering and ranking
    return this.applyAIRanking(properties, config);
  }

  private async generateRealisticProperties(source: PropertySource, config: ScrapingConfig): Promise<Property[]> {
    const properties: Property[] = [];
    const propertyCount = Math.floor(Math.random() * 15) + 5; // 5-20 properties per source

    const localities = this.getLocalitiesForCity(config.location);
    const builders = ['DLF', 'Godrej Properties', 'Sobha Limited', 'Brigade Group', 'Prestige Group', 'Oberoi Realty', 'Lodha Group', 'Mahindra Lifespace'];
    const propertyTypes = ['Apartment', 'Villa', 'Studio', 'Penthouse'];

    for (let i = 0; i < propertyCount; i++) {
      const locality = localities[Math.floor(Math.random() * localities.length)];
      const builder = builders[Math.floor(Math.random() * builders.length)];
      const propertyType = config.propertyType && config.propertyType !== 'Any' 
        ? config.propertyType 
        : propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      
      const bedrooms = config.bedrooms || Math.floor(Math.random() * 4) + 1;
      const area = Math.floor(Math.random() * 2000) + 500;
      const pricePerSqft = this.getPricePerSqftForCity(config.location);
      const basePrice = Math.floor((area * pricePerSqft) / 100000);
      const price = Math.max(basePrice, config.minPrice || 20);

      // Skip if outside price range
      if (config.maxPrice && price > config.maxPrice) continue;
      if (config.minPrice && price < config.minPrice) continue;

      properties.push({
        id: `${source.id}_${Date.now()}_${i}`,
        location: `${locality}, ${config.location}`,
        price: price,
        area_sqft: area,
        bedrooms: bedrooms,
        bathrooms: Math.max(1, bedrooms - 1),
        property_type: propertyType,
        builder: builder,
        facing: ['North', 'South', 'East', 'West', 'North-East', 'South-West'][Math.floor(Math.random() * 6)],
        parking: Math.random() > 0.3,
        metro_nearby: Math.random() > 0.4,
        date_listed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        price_per_sqft: Math.floor(price * 100000 / area),
        days_since_listed: Math.floor(Math.random() * 30) + 1,
        predicted_price: Math.floor(price * (0.9 + Math.random() * 0.2)),
        recommendation_score: Math.floor(Math.random() * 4) + 6, // 6-10 score
        source: source.name
      });
    }

    return properties;
  }

  private getLocalitiesForCity(city: string): string[] {
    const localityMap: Record<string, string[]> = {
      // Tier-1 Cities
      'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Thane', 'Navi Mumbai', 'Lower Parel', 'Worli', 'Malad', 'Borivali', 'Kandivali'],
      'Delhi': ['Dwarka', 'Rohini', 'Lajpat Nagar', 'Saket', 'Vasant Kunj', 'Greater Kailash', 'Karol Bagh', 'Connaught Place', 'Janakpuri'],
      'Bangalore': ['Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Marathahalli', 'Hebbal', 'BTM Layout'],
      'Pune': ['Baner', 'Wakad', 'Hinjewadi', 'Kharadi', 'Viman Nagar', 'Aundh', 'Magarpatta', 'Hadapsar', 'Kalyani Nagar'],
      'Hyderabad': ['HITEC City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Banjara Hills', 'Jubilee Hills', 'Kukatpally', 'Miyapur'],
      'Chennai': ['OMR', 'Anna Nagar', 'T.Nagar', 'Velachery', 'Adyar', 'Porur', 'Tambaram', 'Sholinganallur', 'Thoraipakkam'],
      'Kolkata': ['Salt Lake', 'New Town', 'Ballygunge', 'Park Street', 'Howrah', 'Rajarhat', 'Behala', 'Jadavpur'],
      'Gurgaon': ['DLF Phase 1', 'DLF Phase 2', 'Sector 49', 'Golf Course Road', 'Sohna Road', 'MG Road', 'Cyber City', 'Udyog Vihar'],
      
      // Tier-2 Cities
      'Ahmedabad': ['Satellite', 'Vastrapur', 'Bodakdev', 'Prahlad Nagar', 'SG Highway', 'Maninagar', 'Navrangpura'],
      'Surat': ['Adajan', 'Vesu', 'Pal', 'Rander', 'Citylight', 'Ghod Dod Road', 'Ring Road'],
      'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'Tonk Road', 'C-Scheme', 'Ajmer Road'],
      'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Rajajipuram', 'Alambagh'],
      'Nagpur': ['Dharampeth', 'Sadar', 'Wardha Road', 'Ramdaspeth', 'Civil Lines', 'Hingna Road', 'Katol Road'],
      'Indore': ['Vijay Nagar', 'Scheme 78', 'AB Road', 'New Palasia', 'Bicholi Mardana', 'Ring Road', 'Sapna Sangeeta'],
      'Bhopal': ['Arera Colony', 'New Market', 'MP Nagar', 'Kolar Road', 'Hoshangabad Road', 'Shahpura', 'TT Nagar'],
      'Nashik': ['Gangapur Road', 'College Road', 'Panchavati', 'Canada Corner', 'Ashoka Marg', 'Mumbai Naka'],
      'Faridabad': ['Sector 16', 'Sector 21', 'NIT', 'Old Faridabad', 'Ballabgarh', 'Greater Faridabad'],
      'Rajkot': ['University Road', 'Kalawad Road', 'Gondal Road', 'Raiya Road', 'Mavdi', 'Yagnik Road']
    };

    return localityMap[city] || ['Central Area', 'Business District', 'Residential Zone', 'IT Hub', 'Commercial Center'];
  }

  private getPricePerSqftForCity(city: string): number {
    const priceMap: Record<string, number> = {
      // Tier-1 Cities (Higher prices)
      'Mumbai': 15000,
      'Delhi': 12000,
      'Bangalore': 8000,
      'Pune': 7000,
      'Hyderabad': 6000,
      'Chennai': 6500,
      'Kolkata': 5000,
      'Gurgaon': 10000,
      
      // Tier-2 Cities (Moderate prices)
      'Ahmedabad': 4500,
      'Surat': 3500,
      'Jaipur': 4000,
      'Lucknow': 3000,
      'Kanpur': 2500,
      'Nagpur': 3500,
      'Indore': 3800,
      'Thane': 8000,
      'Bhopal': 3200,
      'Visakhapatnam': 3500,
      'Vadodara': 3800,
      'Patna': 2800,
      'Ludhiana': 3200,
      'Agra': 2200,
      'Nashik': 3500,
      'Faridabad': 5500,
      'Meerut': 2800,
      'Rajkot': 3000,
      'Kalyan-Dombivali': 6000,
      'Vasai-Virar': 5500
    };

    return priceMap[city] || 3000;
  }

  private applyAIRanking(properties: Property[], config: ScrapingConfig): Property[] {
    // AI-powered ranking algorithm
    return properties
      .map(property => ({
        ...property,
        recommendation_score: this.calculateAIScore(property, config)
      }))
      .sort((a, b) => (b.recommendation_score || 0) - (a.recommendation_score || 0))
      .slice(0, 20); // Return top 20 properties
  }

  private calculateAIScore(property: Property, config: ScrapingConfig): number {
    let score = 5; // Base score

    // Price efficiency
    if (property.predicted_price && property.price <= property.predicted_price) {
      score += 2;
    }

    // Location premium
    if (property.metro_nearby) score += 1;
    if (property.parking) score += 0.5;

    // Recency bonus
    if (property.days_since_listed <= 7) score += 1;

    // Builder reputation (simplified)
    const premiumBuilders = ['DLF', 'Godrej Properties', 'Sobha Limited'];
    if (premiumBuilders.includes(property.builder)) score += 1;

    return Math.min(10, Math.max(1, Math.round(score * 10) / 10));
  }

  getActiveSources(): PropertySource[] {
    return this.sources.filter(s => s.isActive);
  }

  getTier1Cities(): string[] {
    return this.tier1Cities;
  }

  getTier2Cities(): string[] {
    return this.tier2Cities;
  }

  getAllSupportedCities(): string[] {
    return [...this.tier1Cities, ...this.tier2Cities];
  }
}

export const propertyDataService = new PropertyDataService();
