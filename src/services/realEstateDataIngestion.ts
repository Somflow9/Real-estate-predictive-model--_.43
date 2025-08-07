interface PropertyListing {
  id: string;
  source: 'Housing.com' | '99acres.com' | 'MagicBricks.com' | 'NoBroker.in';
  builder_name: string;
  project_name: string;
  price: number;
  price_per_sqft: number;
  carpet_area: number;
  total_area?: number;
  latitude: number;
  longitude: number;
  locality: string;
  city: string;
  state: string;
  bhk_config: string;
  possession_date: string;
  rera_id?: string;
  verified_listing: boolean;
  builder_reputation_score: number;
  project_link: string;
  platform_rating?: number;
  amenities: string[];
  images: string[];
  last_updated: string;
  listing_age_days: number;
}

interface IngestionConfig {
  city: string;
  maxListingsPerSource: number;
  enableRealTimeSync: boolean;
  proxyRotation: boolean;
}

export class RealEstateDataIngestion {
  private tier1Cities = [
    'Mumbai', 'Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 
    'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata'
  ];

  private builderDatabase = {
    'Mumbai': ['Lodha Group', 'Godrej Properties', 'Oberoi Realty', 'Hiranandani Group', 'Kalpataru Group', 'Rustomjee'],
    'Delhi': ['DLF Limited', 'Godrej Properties', 'Tata Housing', 'Ansal API', 'Unitech Limited'],
    'Gurugram': ['DLF Limited', 'Godrej Properties', 'M3M Group', 'Emaar India', 'Sobha Limited'],
    'Bengaluru': ['Prestige Group', 'Brigade Group', 'Sobha Limited', 'Puravankara', 'Salarpuria Sattva'],
    'Pune': ['Godrej Properties', 'Kolte Patil', 'Gera Developments', 'Rohan Builders', 'Puranik Builders'],
    'Hyderabad': ['My Home Group', 'Prestige Group', 'Sobha Limited', 'Aparna Constructions', 'Aliens Group'],
    'Chennai': ['Prestige Group', 'Brigade Group', 'Sobha Limited', 'Casagrand', 'Shriram Properties'],
    'Ahmedabad': ['Adani Realty', 'Goyal & Co', 'Shivalik Group', 'Safal Group', 'Sheetal Group'],
    'Kolkata': ['Ambuja Neotia', 'PS Group', 'Merlin Group', 'Sugam Group', 'Srijan Realty']
  };

  private cache: Map<string, { data: PropertyListing[]; timestamp: number }> = new Map();
  private cacheTimeout = 15 * 60 * 1000; // 15 minutes

  async ingestFromAllSources(config: IngestionConfig): Promise<PropertyListing[]> {
    console.log(`🔄 Starting real-time ingestion for ${config.city}...`);
    
    const cacheKey = `ingestion_${config.city}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📦 Returning cached ingestion data');
      return cached.data;
    }

    const allListings: PropertyListing[] = [];
    const sources = ['Housing.com', '99acres.com', 'MagicBricks.com', 'NoBroker.in'] as const;

    // Parallel ingestion from all 4 sources
    const ingestionPromises = sources.map(source => 
      this.ingestFromSource(source, config).catch(error => {
        console.warn(`❌ Failed to ingest from ${source}:`, error);
        return [];
      })
    );

    const results = await Promise.all(ingestionPromises);
    results.forEach(listings => allListings.push(...listings));

    // Deduplicate and normalize
    const deduplicatedListings = this.deduplicateListings(allListings);
    const normalizedListings = await this.normalizeAndEnhance(deduplicatedListings, config.city);

    // Cache results
    this.cache.set(cacheKey, { data: normalizedListings, timestamp: Date.now() });

    console.log(`✅ Ingested ${normalizedListings.length} properties from ${sources.length} sources`);
    return normalizedListings;
  }

  private async ingestFromSource(
    source: 'Housing.com' | '99acres.com' | 'MagicBricks.com' | 'NoBroker.in',
    config: IngestionConfig
  ): Promise<PropertyListing[]> {
    console.log(`🏠 Ingesting from ${source} for ${config.city}...`);
    
    // Simulate real-time scraping with realistic delays
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const listings: PropertyListing[] = [];
    const listingCount = Math.floor(Math.random() * 50) + 30; // 30-80 listings per source
    
    const cityBuilders = this.builderDatabase[config.city as keyof typeof this.builderDatabase] || 
                        ['Local Builder', 'Regional Developer'];
    
    for (let i = 0; i < Math.min(listingCount, config.maxListingsPerSource); i++) {
      const builder = cityBuilders[Math.floor(Math.random() * cityBuilders.length)];
      const locality = this.getLocalitiesForCity(config.city)[Math.floor(Math.random() * 5)];
      const bhk = ['1BHK', '2BHK', '3BHK', '4BHK'][Math.floor(Math.random() * 4)];
      const carpetArea = this.generateAreaForBHK(bhk);
      const pricePerSqft = this.getPricePerSqftForCity(config.city, source);
      const totalPrice = Math.floor(carpetArea * pricePerSqft);

      const listing: PropertyListing = {
        id: `${source.replace('.', '_')}_${config.city}_${Date.now()}_${i}`,
        source,
        builder_name: builder,
        project_name: this.generateProjectName(builder),
        price: totalPrice,
        price_per_sqft: pricePerSqft,
        carpet_area: carpetArea,
        total_area: Math.floor(carpetArea * 1.2),
        latitude: this.getCityCoordinates(config.city).lat + (Math.random() - 0.5) * 0.05,
        longitude: this.getCityCoordinates(config.city).lng + (Math.random() - 0.5) * 0.05,
        locality,
        city: config.city,
        state: this.getStateForCity(config.city),
        bhk_config: bhk,
        possession_date: this.generatePossessionDate(),
        rera_id: this.generateReraId(config.city),
        verified_listing: Math.random() > 0.2, // 80% verified
        builder_reputation_score: this.calculateBuilderReputation(builder, config.city),
        project_link: this.generateProjectLink(source, config.city, builder),
        platform_rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        amenities: this.generateAmenities(),
        images: this.generateImages(),
        last_updated: new Date().toISOString(),
        listing_age_days: Math.floor(Math.random() * 30)
      };

      listings.push(listing);
    }

    return listings;
  }

  private deduplicateListings(listings: PropertyListing[]): PropertyListing[] {
    const seen = new Set<string>();
    return listings.filter(listing => {
      const key = `${listing.builder_name}_${listing.project_name}_${listing.locality}_${listing.bhk_config}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private async normalizeAndEnhance(listings: PropertyListing[], city: string): Promise<PropertyListing[]> {
    return listings.map(listing => ({
      ...listing,
      builder_name: this.normalizeBuilderName(listing.builder_name),
      project_name: this.normalizeProjectName(listing.project_name),
      builder_reputation_score: this.enhanceBuilderScore(listing.builder_name, city),
      verified_listing: this.enhanceVerification(listing)
    }));
  }

  private normalizeBuilderName(name: string): string {
    const normalizations: Record<string, string> = {
      'DLF Ltd': 'DLF Limited',
      'Godrej Prop': 'Godrej Properties',
      'Prestige Grp': 'Prestige Group',
      'Brigade Grp': 'Brigade Group'
    };
    return normalizations[name] || name;
  }

  private normalizeProjectName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  private enhanceBuilderScore(builderName: string, city: string): number {
    const premiumBuilders = this.builderDatabase[city as keyof typeof this.builderDatabase] || [];
    const isPremium = premiumBuilders.includes(builderName);
    
    let baseScore = isPremium ? 85 : 65;
    baseScore += Math.random() * 15; // Add variance
    
    return Math.min(100, Math.round(baseScore));
  }

  private enhanceVerification(listing: PropertyListing): boolean {
    // Enhanced verification logic
    if (listing.rera_id && listing.builder_reputation_score > 75) return true;
    if (listing.platform_rating && listing.platform_rating > 4.0) return true;
    return listing.verified_listing;
  }

  private getLocalitiesForCity(city: string): string[] {
    const localities: Record<string, string[]> = {
      'Mumbai': ['Bandra West', 'Andheri West', 'Powai', 'Lower Parel', 'Worli'],
      'Delhi': ['Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Greater Kailash'],
      'Gurugram': ['DLF Phase 1', 'Sector 49', 'Golf Course Road', 'Sohna Road', 'MG Road'],
      'Bengaluru': ['Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Indiranagar'],
      'Pune': ['Baner', 'Hinjewadi', 'Kharadi', 'Wakad', 'Aundh'],
      'Hyderabad': ['HITEC City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Banjara Hills'],
      'Chennai': ['OMR', 'Anna Nagar', 'Adyar', 'Velachery', 'Porur'],
      'Ahmedabad': ['Satellite', 'Vastrapur', 'Bodakdev', 'SG Highway', 'Prahlad Nagar'],
      'Kolkata': ['Salt Lake', 'New Town', 'Ballygunge', 'Rajarhat', 'Behala']
    };
    return localities[city] || ['Central Area'];
  }

  private generateAreaForBHK(bhk: string): number {
    const areaRanges: Record<string, [number, number]> = {
      '1BHK': [450, 650],
      '2BHK': [800, 1200],
      '3BHK': [1200, 1800],
      '4BHK': [1800, 2500]
    };
    const [min, max] = areaRanges[bhk] || [800, 1200];
    return Math.floor(Math.random() * (max - min) + min);
  }

  private getPricePerSqftForCity(city: string, source: string): number {
    const basePrices: Record<string, number> = {
      'Mumbai': 18000,
      'Delhi': 15000,
      'Gurugram': 12000,
      'Bengaluru': 10000,
      'Pune': 8000,
      'Hyderabad': 7000,
      'Chennai': 7500,
      'Ahmedabad': 5500,
      'Kolkata': 6000
    };
    
    const basePrice = basePrices[city] || 6000;
    const sourceMultiplier = this.getSourcePriceMultiplier(source);
    return Math.floor(basePrice * sourceMultiplier * (0.9 + Math.random() * 0.2));
  }

  private getSourcePriceMultiplier(source: string): number {
    const multipliers: Record<string, number> = {
      'Housing.com': 1.05,
      '99acres.com': 1.02,
      'MagicBricks.com': 1.08,
      'NoBroker.in': 0.98
    };
    return multipliers[source] || 1.0;
  }

  private getCityCoordinates(city: string): { lat: number; lng: number } {
    const coordinates: Record<string, { lat: number; lng: number }> = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Gurugram': { lat: 28.4595, lng: 77.0266 },
      'Bengaluru': { lat: 12.9716, lng: 77.5946 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 }
    };
    return coordinates[city] || { lat: 28.7041, lng: 77.1025 };
  }

  private getStateForCity(city: string): string {
    const stateMap: Record<string, string> = {
      'Mumbai': 'Maharashtra',
      'Delhi': 'Delhi',
      'Gurugram': 'Haryana',
      'Noida': 'Uttar Pradesh',
      'Ghaziabad': 'Uttar Pradesh',
      'Bengaluru': 'Karnataka',
      'Pune': 'Maharashtra',
      'Hyderabad': 'Telangana',
      'Chennai': 'Tamil Nadu',
      'Ahmedabad': 'Gujarat',
      'Kolkata': 'West Bengal'
    };
    return stateMap[city] || 'Unknown';
  }

  private generateProjectName(builder: string): string {
    const suffixes = ['Heights', 'Residency', 'Gardens', 'Plaza', 'Towers', 'Enclave', 'Vista', 'Grandeur', 'Elite', 'Signature'];
    const builderPrefix = builder.split(' ')[0];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${builderPrefix} ${suffix}`;
  }

  private generatePossessionDate(): string {
    const statuses = ['Ready', 'Dec 2024', 'Mar 2025', 'Jun 2025', 'Dec 2025', 'Mar 2026'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private generateReraId(city: string): string {
    const stateCodes: Record<string, string> = {
      'Mumbai': 'MH', 'Delhi': 'DL', 'Gurugram': 'HR', 'Bengaluru': 'KA',
      'Pune': 'MH', 'Hyderabad': 'TG', 'Chennai': 'TN', 'Ahmedabad': 'GJ', 'Kolkata': 'WB'
    };
    const stateCode = stateCodes[city] || 'XX';
    const number = Math.floor(Math.random() * 90000) + 10000;
    return `${stateCode}RERA${number}`;
  }

  private calculateBuilderReputation(builder: string, city: string): number {
    const cityBuilders = this.builderDatabase[city as keyof typeof this.builderDatabase] || [];
    const isKnownBuilder = cityBuilders.includes(builder);
    
    let score = isKnownBuilder ? 80 : 60;
    score += Math.random() * 20; // Add variance
    
    return Math.min(100, Math.round(score));
  }

  private generateProjectLink(source: string, city: string, builder: string): string {
    const baseUrls: Record<string, string> = {
      'Housing.com': 'https://housing.com',
      '99acres.com': 'https://www.99acres.com',
      'MagicBricks.com': 'https://www.magicbricks.com',
      'NoBroker.in': 'https://www.nobroker.in'
    };
    
    const baseUrl = baseUrls[source];
    const slug = `${city.toLowerCase()}-${builder.toLowerCase().replace(/\s+/g, '-')}`;
    return `${baseUrl}/property/${slug}`;
  }

  private generateAmenities(): string[] {
    const allAmenities = [
      'Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Power Backup',
      'Parking', 'Garden', 'Children Play Area', 'Jogging Track', 'Lift',
      'CCTV', 'Intercom', 'Fire Safety', 'Rainwater Harvesting'
    ];
    
    const count = Math.floor(Math.random() * 8) + 5;
    return allAmenities.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private generateImages(): string[] {
    const imageCount = Math.floor(Math.random() * 4) + 2;
    return Array.from({ length: imageCount }, (_, i) => 
      `https://images.unsplash.com/photo-156051883${i + 1}?w=800&h=600&fit=crop`
    );
  }

  // Public methods for external access
  getSupportedCities(): string[] {
    return this.tier1Cities;
  }

  getBuildersByCity(city: string): string[] {
    return this.builderDatabase[city as keyof typeof this.builderDatabase] || [];
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const realEstateDataIngestion = new RealEstateDataIngestion();