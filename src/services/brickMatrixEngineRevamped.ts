interface SmartFilters {
  priceFinance: {
    priceRange: { min: number; max: number };
    emiPreview: boolean;
    roiEstimator: boolean;
    rentalYield: { min: number; max: number };
    taxBenefits: boolean;
  };
  locationProximity: {
    city: string;
    searchRadius: number;
    metroDistance: number;
    shoppingDistance: number;
    schoolDistance: number;
    hospitalDistance: number;
    businessDistrictDistance: number;
    pollutionFilter: boolean;
    safetyFilter: boolean;
  };
  propertySpecs: {
    bhkRange: string[];
    propertyTypes: string[];
    possessionStatus: string[];
    furnishing: string[];
    floorPreference: 'Low' | 'Mid' | 'High' | 'Any';
    facing: string[];
    smartHome: boolean;
    vaastuCompliant: boolean;
    igbcCertified: boolean;
  };
  builderProject: {
    builderSearch: string;
    builderCategory: 'National' | 'Local' | 'Foreign MNC' | 'Any';
    minDeliveryRate: number;
    maxAvgDelay: number;
    minBuilderRating: number;
    verifiedOnly: boolean;
  };
  amenities: {
    lifestyle: string[];
    eco: string[];
    security: string[];
    premium: string[];
  };
}

interface SmartRecommendation {
  id: string;
  title: string;
  city: string;
  locality: string;
  price: number;
  pricePerSqft: number;
  area: number;
  bhk: string;
  builderName: string;
  brickMatrixScore: number;
  recommendation: {
    action: string;
    confidence: number;
    reasoning: string;
  };
  badges: string[];
  segment: {
    type: string;
    color: string;
  };
  detailedScoring?: {
    locationScore: number;
    builderScore: number;
    priceScore: number;
    userAlignmentScore: number;
    futureProspectScore: number;
  };
  images?: string[];
  status?: string;
  amenities?: string[];
}

export class BrickMatrixEngineRevamped {
  private tier1Cities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  async fetchSmartRecommendations(filters: SmartFilters): Promise<SmartRecommendation[]> {
    console.log('🔮 BrickMatrix™ Engine Revamped: Smart recommendation fetch initiated...');
    
    const cacheKey = `smart_recommendations_${JSON.stringify(filters)}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('📦 BrickMatrix™ Engine: Returning cached smart data');
      return cached;
    }

    try {
      // Generate smart recommendations with enhanced filtering
      const recommendations = await this.generateSmartRecommendations(filters);
      
      // Apply BrickMatrix™ Engine scoring
      const scoredRecommendations = await this.applySmartScoring(recommendations, filters);
      
      this.setCachedData(cacheKey, scoredRecommendations, 900000); // 15 minutes TTL
      
      console.log(`✨ BrickMatrix™ Engine: Generated ${scoredRecommendations.length} smart recommendations`);
      return scoredRecommendations;

    } catch (error) {
      console.error('❌ BrickMatrix™ Engine Revamped Error:', error);
      throw new Error('Failed to fetch smart recommendations');
    }
  }

  private async generateSmartRecommendations(filters: SmartFilters): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];
    const count = Math.floor(Math.random() * 20) + 25; // 25-45 recommendations
    
    const builders = ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group', 'Sobha Limited', 'Oberoi Realty', 'Lodha Group', 'Hiranandani Group'];
    const segments = [
      { type: 'Budget', color: '#10B981' },
      { type: 'Mid-Range', color: '#8B5CF6' },
      { type: 'Premium', color: '#F59E0B' }
    ];

    for (let i = 0; i < count; i++) {
      const city = this.getFilteredCity(filters.locationProximity.city);
      const locality = this.getLocalityForCity(city);
      const builder = builders[Math.floor(Math.random() * builders.length)];
      const segment = segments[Math.floor(Math.random() * segments.length)];

      // Safe string operations with proper validation
      const builderPrefix = this.safeGetBuilderPrefix(builder);
      const projectSuffix = this.safeGetProjectSuffix();
      
      recommendations.push({
        id: `smart_${Date.now()}_${i}`,
        title: `${builderPrefix} ${projectSuffix}`,
        city,
        locality,
        price: this.generatePriceInRange(filters.priceFinance.priceRange),
        pricePerSqft: Math.floor(Math.random() * 15000) + 8000,
        area: Math.floor(Math.random() * 1500) + 800,
        bhk: this.getRandomBHK(filters.propertySpecs.bhkRange),
        builderName: builder,
        brickMatrixScore: 0, // Will be calculated
        recommendation: {
          action: 'buy',
          confidence: 80,
          reasoning: 'Smart analysis pending'
        },
        badges: this.generateSmartBadges(),
        segment,
        amenities: this.generateFilteredAmenities(filters.amenities),
        status: this.getRandomStatus(filters.propertySpecs.possessionStatus),
        images: this.generatePropertyImages()
      });
    }

    return recommendations;
  }

  private safeGetBuilderPrefix(builder: string): string {
    // Safe indexOf operation with proper validation
    if (typeof builder !== "string" || !builder) {
      return "Premium";
    }
    
    const spaceIndex = builder.indexOf(' ');
    if (spaceIndex !== -1) {
      return builder.slice(0, spaceIndex);
    }
    
    return builder;
  }

  private safeGetProjectSuffix(): string {
    const suffixes = ['Heights', 'Residency', 'Gardens', 'Plaza', 'Towers', 'Enclave', 'Vista', 'Grandeur'];
    return suffixes[Math.floor(Math.random() * suffixes.length)] ?? 'Heights';
  }

  private getFilteredCity(filterCity: string): string {
    // Safe string validation before indexOf
    if (typeof filterCity === "string" && filterCity && this.tier1Cities.indexOf(filterCity || '') !== -1) { // fixed unsafe indexOf call
      return filterCity;
    }
    return this.tier1Cities[Math.floor(Math.random() * this.tier1Cities.length)] ?? 'Mumbai';
  }

  private getLocalityForCity(city: string): string {
    const localities: Record<string, string[]> = {
      'Mumbai': ['Bandra West', 'Powai', 'Lower Parel', 'Worli', 'Andheri West'],
      'Delhi NCR': ['Gurgaon', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj'],
      'Bengaluru': ['Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Indiranagar'],
      'Hyderabad': ['HITEC City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Banjara Hills'],
      'Chennai': ['OMR', 'Anna Nagar', 'T.Nagar', 'Velachery', 'Adyar'],
      'Pune': ['Baner', 'Wakad', 'Hinjewadi', 'Kharadi', 'Viman Nagar'],
      'Kolkata': ['Salt Lake', 'New Town', 'Ballygunge', 'Park Street', 'Rajarhat'],
      'Ahmedabad': ['Satellite', 'Vastrapur', 'Bodakdev', 'Prahlad Nagar', 'SG Highway']
    };
    
    // Safe access with fallback
    const cityLocalities = localities[city] ?? ['Central Area'];
    return cityLocalities[Math.floor(Math.random() * cityLocalities.length)] ?? 'Central Area';
  }

  private generatePriceInRange(priceRange: { min: number; max: number }): number {
    const min = typeof priceRange?.min === 'number' ? priceRange.min : 10000000;
    const max = typeof priceRange?.max === 'number' ? priceRange.max : 50000000;
    return Math.floor(Math.random() * (max - min) + min);
  }

  private getRandomBHK(bhkRange: string[]): string {
    // Safe array validation before accessing
    if (Array.isArray(bhkRange) && bhkRange.length > 0) {
      return bhkRange[Math.floor(Math.random() * bhkRange.length)] ?? '3BHK';
    }
    return ['2BHK', '3BHK', '4BHK'][Math.floor(Math.random() * 3)] ?? '3BHK';
  }

  private getRandomStatus(possessionStatus: string[]): string {
    // Safe array validation
    if (Array.isArray(possessionStatus) && possessionStatus.length > 0) {
      return possessionStatus[Math.floor(Math.random() * possessionStatus.length)] ?? 'Ready';
    }
    return ['Ready', 'Under Construction', 'New Launch'][Math.floor(Math.random() * 3)] ?? 'Ready';
  }

  private generateFilteredAmenities(amenityFilters: SmartFilters['amenities']): string[] {
    const allAmenities: string[] = [];
    
    // Safe array concatenation with validation
    if (Array.isArray(amenityFilters?.lifestyle)) {
      allAmenities.push(...amenityFilters.lifestyle);
    }
    if (Array.isArray(amenityFilters?.eco)) {
      allAmenities.push(...amenityFilters.eco);
    }
    if (Array.isArray(amenityFilters?.security)) {
      allAmenities.push(...amenityFilters.security);
    }
    if (Array.isArray(amenityFilters?.premium)) {
      allAmenities.push(...amenityFilters.premium);
    }

    // Fallback amenities if no filters provided
    if (allAmenities.length === 0) {
      return ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden'];
    }

    return allAmenities.slice(0, Math.min(8, allAmenities.length));
  }

  private generateSmartBadges(): string[] {
    const badges = ['Smart Choice', 'AI Recommended', 'Value Pick', 'Trending', 'Premium Location'];
    const count = Math.floor(Math.random() * 3) + 1;
    return badges.slice(0, count);
  }

  private generatePropertyImages(): string[] {
    return [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
    ];
  }

  private async applySmartScoring(recommendations: SmartRecommendation[], filters: SmartFilters): Promise<SmartRecommendation[]> {
    console.log('🧠 Applying BrickMatrix™ Smart Scoring...');
    
    return recommendations.map(property => {
      const locationScore = this.calculateLocationScore(property, filters);
      const builderScore = this.calculateBuilderScore(property);
      const priceScore = this.calculatePriceScore(property, filters);
      const userAlignmentScore = this.calculateUserAlignment(property, filters);
      const futureProspectScore = this.calculateFutureProspects(property);

      const brickMatrixScore = Math.round(
        (locationScore * 0.30 + 
         builderScore * 0.25 + 
         priceScore * 0.20 + 
         userAlignmentScore * 0.15 + 
         futureProspectScore * 0.10) * 10
      ) / 10;

      const recommendation = this.generateSmartRecommendation(brickMatrixScore);

      return {
        ...property,
        brickMatrixScore,
        recommendation,
        detailedScoring: {
          locationScore,
          builderScore,
          priceScore,
          userAlignmentScore,
          futureProspectScore
        }
      };
    }).sort((a, b) => b.brickMatrixScore - a.brickMatrixScore);
  }

  private calculateLocationScore(property: SmartRecommendation, filters: SmartFilters): number {
    let score = 7.0;
    
    // Safe string comparison with validation
    const targetCity = filters?.locationProximity?.city ?? '';
    if (typeof property.city === "string" && typeof targetCity === "string" && 
        (property.city || '').indexOf(targetCity || '') !== -1) { // fixed unsafe indexOf call
      score += 1.0;
    }
    
    // Safe tier1 city check
    if (typeof property.city === "string" && this.tier1Cities.indexOf(property.city || '') !== -1) { // fixed unsafe indexOf call
      score += 0.5;
    }
    
    return Math.min(10, score);
  }

  private calculateBuilderScore(property: SmartRecommendation): number {
    const premiumBuilders = ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group', 'Sobha Limited'];
    let score = 7.0;
    
    // Safe builder validation with indexOf
    if (typeof property.builderName === "string") {
      const isPremium = premiumBuilders.some(builder => 
        typeof builder === "string" && (property.builderName || '').indexOf(builder || '') !== -1 // fixed unsafe indexOf call
      );
      if (isPremium) {
        score += 1.5;
      }
    }
    
    return Math.min(10, score);
  }

  private calculatePriceScore(property: SmartRecommendation, filters: SmartFilters): number {
    const priceRange = filters?.priceFinance?.priceRange;
    if (!priceRange || typeof property.price !== 'number') {
      return 6.0;
    }
    
    const { min, max } = priceRange;
    if (property.price >= min && property.price <= max) {
      return 9.0;
    }
    
    return 5.0;
  }

  private calculateUserAlignment(property: SmartRecommendation, filters: SmartFilters): number {
    let score = 7.0;
    
    // Safe BHK alignment check
    const bhkRange = filters?.propertySpecs?.bhkRange;
    if (Array.isArray(bhkRange) && typeof property.bhk === "string") {
      const hasMatch = bhkRange.some(bhk => 
        typeof bhk === "string" && (property.bhk || '').indexOf(bhk || '') !== -1 // fixed unsafe indexOf call
      );
      if (hasMatch) {
        score += 1.0;
      }
    }
    
    return Math.min(10, score);
  }

  private calculateFutureProspects(property: SmartRecommendation): number {
    let score = 7.0;
    
    // Safe status check with indexOf
    if (typeof property.status === "string" && (property.status || '').indexOf('New Launch') !== -1) { // fixed unsafe indexOf call
      score += 0.5;
    }
    
    // Safe tier1 city future prospects
    if (typeof property.city === "string" && this.tier1Cities.indexOf(property.city || '') !== -1) { // fixed unsafe indexOf call
      score += 1.0;
    }
    
    return Math.min(10, score);
  }

  private generateSmartRecommendation(score: number) {
    let action: string;
    let confidence: number;
    let reasoning: string;

    if (score >= 9.0) {
      action = 'strong_buy';
      confidence = Math.floor(Math.random() * 10) + 90;
      reasoning = 'Exceptional smart analysis with outstanding metrics across all parameters';
    } else if (score >= 8.0) {
      action = 'buy';
      confidence = Math.floor(Math.random() * 15) + 80;
      reasoning = 'Strong smart recommendation with excellent fundamentals and growth potential';
    } else if (score >= 7.0) {
      action = 'consider';
      confidence = Math.floor(Math.random() * 15) + 70;
      reasoning = 'Good smart metrics but evaluate against other options in your portfolio';
    } else {
      action = 'wait';
      confidence = Math.floor(Math.random() * 20) + 50;
      reasoning = 'Below average smart score suggests waiting for better opportunities';
    }

    return { action, confidence, reasoning };
  }

  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const brickMatrixEngineRevamped = new BrickMatrixEngineRevamped();