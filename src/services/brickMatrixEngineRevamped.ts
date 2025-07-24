interface LocationIntelligence {
  commuteScore: number;
  walkabilityScore: number;
  developmentZone: 'Prime' | 'Emerging' | 'Established' | 'Growth';
  connectivityRating: number;
  pollutionIndex: number;
  safetyIndex: number;
  nearbyFacilities: {
    metro: { name: string; distance: number; lines: string[] }[];
    schools: { name: string; distance: number; rating: number }[];
    hospitals: { name: string; distance: number; type: string }[];
    shopping: { name: string; distance: number; type: string }[];
  };
  futureProjects: {
    metro: { name: string; completion: string; impact: number }[];
    expressways: { name: string; completion: string; impact: number }[];
    sez: { name: string; completion: string; impact: number }[];
  };
}

interface BuilderIntelligence {
  reputationScore: number; // 0-5
  completionRate: number;
  avgDelay: number; // months
  litigationFlags: number;
  deliverySuccessRate: number;
  communitySatisfaction: number;
  segment: 'Budget' | 'Mid-Range' | 'Premium';
  reraVerified: boolean;
  crisilRated: boolean;
  icraRated: boolean;
  pastProjects: {
    name: string;
    year: number;
    onTime: boolean;
    delayMonths: number;
    rating: number;
  }[];
}

interface PricingIntelligence {
  pricePerSqft: number;
  localAvgPrice: number;
  priceJustification: 'Undervalued' | 'Fair' | 'Overpriced';
  appreciationEstimate: number;
  nearbyPriceDiff: number;
  marketTrend: 'Rising' | 'Stable' | 'Declining';
}

interface PropertySegment {
  type: 'Budget' | 'Mid-Range' | 'Premium';
  color: string;
  description: string;
  priceRange: { min: number; max: number };
}

interface PopularityMetrics {
  viewVelocity: number;
  shortlistRatio: number;
  trending: boolean;
  demandIndex: number;
  regionalTrend: 'High' | 'Medium' | 'Low';
}

interface BrickMatrixProperty {
  id: string;
  title: string;
  city: string;
  locality: string;
  price: number;
  carpetArea: number;
  builtUpArea: number;
  bhk: string;
  propertyType: 'Apartment' | 'Studio' | 'Villa' | 'Penthouse';
  possessionStatus: 'Ready' | 'Under Construction' | 'Pre-launch';
  furnishing: 'Unfurnished' | 'Semi-furnished' | 'Fully-furnished';
  floor: number;
  totalFloors: number;
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'South-West' | 'North-West' | 'South-East';
  smartHome: boolean;
  vaastuCompliant: boolean;
  igbcCertified: boolean;
  builderName: string;
  projectName: string;
  reraId: string;
  amenities: string[];
  images: string[];
  
  // Intelligence Data
  locationIntelligence: LocationIntelligence;
  builderIntelligence: BuilderIntelligence;
  pricingIntelligence: PricingIntelligence;
  segment: PropertySegment;
  popularityMetrics: PopularityMetrics;
  
  // BrickMatrix™ Scores
  brickMatrixScore: number;
  builderTrust: number;
  localityScore: number;
  amenitiesScore: number;
  roiForecast: number;
  possessionAccuracy: number;
  
  // Explainability
  whySuggested: string[];
  
  lastUpdated: string;
}

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

export class BrickMatrixEngineRevamped {
  private tier1Cities = [
    'Delhi NCR',
    'Mumbai', 
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Ahmedabad'
  ];

  private propertySegments: PropertySegment[] = [
    {
      type: 'Budget',
      color: '#4ade80',
      description: 'Affordable homes under ₹80L',
      priceRange: { min: 0, max: 8000000 }
    },
    {
      type: 'Mid-Range',
      color: '#7f00ff',
      description: 'Quality homes ₹80L - ₹3.5Cr',
      priceRange: { min: 8000000, max: 35000000 }
    },
    {
      type: 'Premium',
      color: '#fbbf24',
      description: 'Luxury properties ₹3.5Cr+',
      priceRange: { min: 35000000, max: 2000000000 }
    }
  ];

  private amenityCategories = {
    lifestyle: [
      'Swimming Pool', 'Clubhouse', 'Gym', 'Jogging Track', 'Children Play Area',
      'Indoor Games', 'Library', 'Banquet Hall', 'Amphitheatre', 'Cinema Room'
    ],
    eco: [
      'EV Charging', 'Solar Panels', 'Rainwater Harvesting', 'Waste Management',
      'Green Building', 'Organic Garden', 'Energy Efficient', 'LED Lighting'
    ],
    security: [
      '24x7 Security', 'CCTV Surveillance', 'Access Control', 'Fire Safety',
      'Emergency Response', 'Visitor Management', 'Perimeter Security'
    ],
    premium: [
      'Concierge', 'Valet Parking', 'Private Garden', 'Rooftop Access',
      'Coworking Space', 'Meditation Deck', 'Daycare', 'Pet Area'
    ]
  };

  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  async fetchSmartRecommendations(filters: SmartFilters): Promise<BrickMatrixProperty[]> {
    console.log('🔮 BrickMatrix™ Engine: Fetching smart recommendations for Tier 1 cities...');
    
    const cacheKey = `smart_recommendations_${JSON.stringify(filters)}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('📦 BrickMatrix™ Engine: Returning cached smart data');
      return cached;
    }

    try {
      // Generate intelligent property recommendations
      const properties = await this.generateIntelligentProperties(filters);
      
      // Apply 6-layer AI logic
      const enhancedProperties = await this.apply6LayerIntelligence(properties, filters);
      
      // Sort by BrickMatrix™ score
      const sortedProperties = enhancedProperties.sort((a, b) => b.brickMatrixScore - a.brickMatrixScore);
      
      this.setCachedData(cacheKey, sortedProperties, 900000); // 15 minutes TTL
      
      console.log(`✨ BrickMatrix™ Engine: Generated ${sortedProperties.length} smart recommendations`);
      return sortedProperties;

    } catch (error) {
      console.error('❌ BrickMatrix™ Engine Error:', error);
      throw new Error('Failed to fetch smart recommendations');
    }
  }

  private async generateIntelligentProperties(filters: SmartFilters): Promise<BrickMatrixProperty[]> {
    const properties: BrickMatrixProperty[] = [];
    const propertyCount = Math.floor(Math.random() * 20) + 15; // 15-35 properties

    const tier1Builders = {
      'National': ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group', 'Sobha Limited'],
      'Local': ['Hiranandani Group', 'Kolte Patil', 'Puravankara', 'Nitesh Estates'],
      'Foreign MNC': ['Oberoi Realty', 'Tata Housing', 'Mahindra Lifespace']
    };

    const tier1Localities = {
      'Mumbai': ['Bandra West', 'Powai', 'Lower Parel', 'Worli', 'Andheri West', 'Malad West'],
      'Delhi NCR': ['Gurgaon Sector 54', 'Dwarka', 'Noida Sector 62', 'Greater Kailash', 'Vasant Kunj'],
      'Bengaluru': ['Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Indiranagar'],
      'Hyderabad': ['HITEC City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Banjara Hills'],
      'Chennai': ['OMR', 'Anna Nagar', 'T.Nagar', 'Velachery', 'Adyar'],
      'Pune': ['Baner', 'Wakad', 'Hinjewadi', 'Kharadi', 'Viman Nagar'],
      'Kolkata': ['Salt Lake', 'New Town', 'Ballygunge', 'Park Street', 'Rajarhat'],
      'Ahmedabad': ['Satellite', 'Vastrapur', 'Bodakdev', 'Prahlad Nagar', 'SG Highway']
    };

    for (let i = 0; i < propertyCount; i++) {
      const city = filters.locationProximity.city || this.tier1Cities[Math.floor(Math.random() * this.tier1Cities.length)];
      const localities = tier1Localities[city as keyof typeof tier1Localities] || ['Central Area'];
      const locality = localities[Math.floor(Math.random() * localities.length)];
      
      const builderCategory = filters.builderProject.builderCategory === 'Any' 
        ? Object.keys(tier1Builders)[Math.floor(Math.random() * 3)] as keyof typeof tier1Builders
        : filters.builderProject.builderCategory as keyof typeof tier1Builders;
      
      const builders = tier1Builders[builderCategory] || tier1Builders.National;
      const builder = builders[Math.floor(Math.random() * builders.length)];

      const bhk = filters.propertySpecs.bhkRange.length > 0 
        ? filters.propertySpecs.bhkRange[Math.floor(Math.random() * filters.propertySpecs.bhkRange.length)]
        : ['2BHK', '3BHK', '4BHK'][Math.floor(Math.random() * 3)];

      const carpetArea = this.generateAreaForBHK(bhk);
      const pricePerSqft = this.getPriceForTier1City(city, locality);
      const totalPrice = Math.floor((carpetArea * pricePerSqft) / 100000) * 100000;

      // Apply price filter
      if (totalPrice < filters.priceFinance.priceRange.min || totalPrice > filters.priceFinance.priceRange.max) {
        continue;
      }

      const segment = this.determineSegment(totalPrice);
      
      properties.push({
        id: `bm_revamped_${Date.now()}_${i}`,
        title: `Premium ${bhk} ${this.getPropertyType()} in ${locality}`,
        city,
        locality,
        price: totalPrice,
        carpetArea,
        builtUpArea: Math.floor(carpetArea * 1.25),
        bhk,
        propertyType: this.getPropertyType(),
        possessionStatus: this.getPossessionStatus(),
        furnishing: this.getFurnishing(),
        floor: Math.floor(Math.random() * 20) + 1,
        totalFloors: Math.floor(Math.random() * 10) + 25,
        facing: this.getFacing(),
        smartHome: Math.random() > 0.6,
        vaastuCompliant: Math.random() > 0.4,
        igbcCertified: Math.random() > 0.7,
        builderName: builder,
        projectName: `${builder.split(' ')[0]} ${this.getProjectSuffix()}`,
        reraId: this.generateReraId(city),
        amenities: this.generateAmenities(segment.type),
        images: this.generateImages(),
        
        locationIntelligence: await this.generateLocationIntelligence(city, locality),
        builderIntelligence: await this.generateBuilderIntelligence(builder, builderCategory),
        pricingIntelligence: await this.generatePricingIntelligence(totalPrice, city, locality),
        segment,
        popularityMetrics: this.generatePopularityMetrics(),
        
        brickMatrixScore: 0, // Will be calculated
        builderTrust: 0,
        localityScore: 0,
        amenitiesScore: 0,
        roiForecast: 0,
        possessionAccuracy: 0,
        
        whySuggested: [],
        lastUpdated: new Date().toISOString()
      });
    }

    return properties;
  }

  private async apply6LayerIntelligence(properties: BrickMatrixProperty[], filters: SmartFilters): Promise<BrickMatrixProperty[]> {
    console.log('🧠 Applying 6-Layer BrickMatrix™ Intelligence...');

    return properties.map(property => {
      // Layer 1: Location Intelligence
      const locationScore = this.calculateLocationScore(property.locationIntelligence);
      
      // Layer 2: Builder Intelligence  
      const builderScore = this.calculateBuilderScore(property.builderIntelligence);
      
      // Layer 3: Pricing Intelligence
      const pricingScore = this.calculatePricingScore(property.pricingIntelligence);
      
      // Layer 4: Personalization (based on filters)
      const personalizationScore = this.calculatePersonalizationScore(property, filters);
      
      // Layer 5: Segmentation Match
      const segmentScore = this.calculateSegmentScore(property, filters);
      
      // Layer 6: Popularity Intelligence
      const popularityScore = this.calculatePopularityScore(property.popularityMetrics);

      // Calculate final BrickMatrix™ score
      const brickMatrixScore = Math.round(
        (locationScore * 0.25 + 
         builderScore * 0.25 + 
         pricingScore * 0.20 + 
         personalizationScore * 0.15 + 
         segmentScore * 0.10 + 
         popularityScore * 0.05) * 10
      ) / 10;

      // Calculate individual scores
      const builderTrust = Math.round(property.builderIntelligence.reputationScore * 10) / 10;
      const localityScore = Math.round(locationScore * 10) / 10;
      const amenitiesScore = Math.round((property.amenities.length / 12) * 5 * 10) / 10;
      const roiForecast = Math.round(property.pricingIntelligence.appreciationEstimate * 10) / 10;
      const possessionAccuracy = Math.round((100 - property.builderIntelligence.avgDelay * 2) / 20 * 10) / 10;

      // Generate explainability
      const whySuggested = this.generateExplainability(property, brickMatrixScore);

      return {
        ...property,
        brickMatrixScore,
        builderTrust,
        localityScore,
        amenitiesScore,
        roiForecast,
        possessionAccuracy,
        whySuggested
      };
    });
  }

  private calculateLocationScore(locationIntel: LocationIntelligence): number {
    return Math.min(10, 
      (locationIntel.commuteScore * 0.3 + 
       locationIntel.connectivityRating * 0.3 + 
       (100 - locationIntel.pollutionIndex) * 0.2 + 
       locationIntel.safetyIndex * 0.2) / 10
    );
  }

  private calculateBuilderScore(builderIntel: BuilderIntelligence): number {
    return Math.min(10,
      (builderIntel.reputationScore * 2 + 
       builderIntel.deliverySuccessRate / 10 + 
       builderIntel.communitySatisfaction / 10 + 
       (builderIntel.reraVerified ? 1 : 0) + 
       (builderIntel.crisilRated ? 0.5 : 0))
    );
  }

  private calculatePricingScore(pricingIntel: PricingIntelligence): number {
    let score = 5;
    if (pricingIntel.priceJustification === 'Undervalued') score += 3;
    else if (pricingIntel.priceJustification === 'Fair') score += 1;
    else score -= 1;
    
    if (pricingIntel.marketTrend === 'Rising') score += 1;
    score += Math.min(2, pricingIntel.appreciationEstimate / 10);
    
    return Math.min(10, score);
  }

  private calculatePersonalizationScore(property: BrickMatrixProperty, filters: SmartFilters): number {
    let score = 5;
    
    // BHK preference match
    if (filters.propertySpecs.bhkRange.includes(property.bhk)) score += 2;
    
    // Property type match
    if (filters.propertySpecs.propertyTypes.includes(property.propertyType)) score += 1;
    
    // Amenity preferences match
    const userAmenities = [...filters.amenities.lifestyle, ...filters.amenities.premium];
    const matchedAmenities = property.amenities.filter(a => userAmenities.includes(a));
    score += Math.min(2, matchedAmenities.length / 3);
    
    return Math.min(10, score);
  }

  private calculateSegmentScore(property: BrickMatrixProperty, filters: SmartFilters): number {
    const budgetMid = (filters.priceFinance.priceRange.min + filters.priceFinance.priceRange.max) / 2;
    const priceDiff = Math.abs(property.price - budgetMid) / budgetMid;
    
    return Math.max(0, Math.min(10, 10 - (priceDiff * 10)));
  }

  private calculatePopularityScore(popularity: PopularityMetrics): number {
    return Math.min(10,
      (popularity.viewVelocity / 10 + 
       popularity.shortlistRatio * 5 + 
       popularity.demandIndex / 20 + 
       (popularity.trending ? 2 : 0))
    );
  }

  private generateExplainability(property: BrickMatrixProperty, score: number): string[] {
    const reasons: string[] = [];
    
    if (property.builderIntelligence.reputationScore >= 4) {
      reasons.push(`Excellent builder reputation (${property.builderIntelligence.reputationScore}/5)`);
    }
    
    if (property.locationIntelligence.connectivityRating >= 8) {
      reasons.push('Outstanding connectivity and infrastructure');
    }
    
    if (property.pricingIntelligence.priceJustification === 'Undervalued') {
      reasons.push('Undervalued property with high appreciation potential');
    }
    
    if (property.popularityMetrics.trending) {
      reasons.push('Trending property with high demand');
    }
    
    if (property.igbcCertified) {
      reasons.push('Green certified building with sustainable features');
    }
    
    if (score >= 8.5) {
      reasons.push('Top 10% properties in BrickMatrix™ scoring');
    }
    
    return reasons.slice(0, 3);
  }

  // Helper methods for data generation
  private async generateLocationIntelligence(city: string, locality: string): Promise<LocationIntelligence> {
    return {
      commuteScore: Math.round((Math.random() * 30 + 70) * 10) / 10,
      walkabilityScore: Math.round((Math.random() * 40 + 60) * 10) / 10,
      developmentZone: ['Prime', 'Emerging', 'Established', 'Growth'][Math.floor(Math.random() * 4)] as any,
      connectivityRating: Math.round((Math.random() * 30 + 70) * 10) / 10,
      pollutionIndex: Math.round((Math.random() * 40 + 30) * 10) / 10,
      safetyIndex: Math.round((Math.random() * 20 + 80) * 10) / 10,
      nearbyFacilities: {
        metro: [
          { name: 'Central Metro Station', distance: Math.round(Math.random() * 2 * 10) / 10, lines: ['Blue Line', 'Red Line'] }
        ],
        schools: [
          { name: 'Delhi Public School', distance: Math.round(Math.random() * 3 * 10) / 10, rating: Math.round((Math.random() * 1 + 4) * 10) / 10 }
        ],
        hospitals: [
          { name: 'Max Hospital', distance: Math.round(Math.random() * 5 * 10) / 10, type: 'Multi-specialty' }
        ],
        shopping: [
          { name: 'City Mall', distance: Math.round(Math.random() * 3 * 10) / 10, type: 'Shopping Mall' }
        ]
      },
      futureProjects: {
        metro: [
          { name: 'Metro Line Extension', completion: '2025-12', impact: Math.round(Math.random() * 20 + 10) }
        ],
        expressways: [
          { name: 'New Expressway', completion: '2026-06', impact: Math.round(Math.random() * 15 + 15) }
        ],
        sez: [
          { name: 'IT SEZ Phase 2', completion: '2025-08', impact: Math.round(Math.random() * 25 + 20) }
        ]
      }
    };
  }

  private async generateBuilderIntelligence(builder: string, category: string): Promise<BuilderIntelligence> {
    const isNational = category === 'National';
    const isForeign = category === 'Foreign MNC';
    
    return {
      reputationScore: isNational ? Math.round((Math.random() * 1.5 + 3.5) * 10) / 10 : Math.round((Math.random() * 2 + 3) * 10) / 10,
      completionRate: isNational ? Math.round((Math.random() * 15 + 85) * 10) / 10 : Math.round((Math.random() * 20 + 75) * 10) / 10,
      avgDelay: isNational ? Math.round((Math.random() * 3 + 1) * 10) / 10 : Math.round((Math.random() * 6 + 2) * 10) / 10,
      litigationFlags: isNational ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8),
      deliverySuccessRate: isNational ? Math.round((Math.random() * 10 + 90) * 10) / 10 : Math.round((Math.random() * 15 + 80) * 10) / 10,
      communitySatisfaction: isNational ? Math.round((Math.random() * 15 + 85) * 10) / 10 : Math.round((Math.random() * 20 + 75) * 10) / 10,
      segment: this.getBuilderSegment(builder),
      reraVerified: Math.random() > 0.1,
      crisilRated: isNational || isForeign,
      icraRated: isNational,
      pastProjects: this.generatePastProjects(builder, isNational)
    };
  }

  private async generatePricingIntelligence(price: number, city: string, locality: string): Promise<PricingIntelligence> {
    const localAvg = this.getPriceForTier1City(city, locality);
    const deviation = (price - localAvg) / localAvg;
    
    return {
      pricePerSqft: Math.floor(price / 1200), // Assuming 1200 sq ft average
      localAvgPrice: localAvg,
      priceJustification: deviation < -0.1 ? 'Undervalued' : deviation > 0.15 ? 'Overpriced' : 'Fair',
      appreciationEstimate: Math.round((Math.random() * 15 + 8) * 10) / 10,
      nearbyPriceDiff: Math.round((Math.random() * 20 - 10) * 10) / 10,
      marketTrend: ['Rising', 'Stable', 'Declining'][Math.floor(Math.random() * 3)] as any
    };
  }

  private determineSegment(price: number): PropertySegment {
    return this.propertySegments.find(segment => 
      price >= segment.priceRange.min && price <= segment.priceRange.max
    ) || this.propertySegments[1];
  }

  private generateAreaForBHK(bhk: string): number {
    const areaMap: Record<string, [number, number]> = {
      '1BHK': [450, 650],
      '2BHK': [800, 1200],
      '3BHK': [1200, 1800],
      '4BHK': [1800, 2500],
      '5BHK': [2500, 3500],
      '6BHK+': [3500, 5000]
    };
    const [min, max] = areaMap[bhk] || [800, 1200];
    return Math.floor(Math.random() * (max - min) + min);
  }

  private getPriceForTier1City(city: string, locality: string): number {
    const basePrices: Record<string, number> = {
      'Mumbai': 18000,
      'Delhi NCR': 12000,
      'Bengaluru': 9000,
      'Hyderabad': 7000,
      'Chennai': 7500,
      'Pune': 8000,
      'Kolkata': 6000,
      'Ahmedabad': 5500
    };
    
    const basePrice = basePrices[city] || 8000;
    const localityMultiplier = Math.random() * 0.6 + 0.7; // 0.7 to 1.3
    return Math.floor(basePrice * localityMultiplier);
  }

  private getPropertyType(): 'Apartment' | 'Studio' | 'Villa' | 'Penthouse' {
    const types: Array<'Apartment' | 'Studio' | 'Villa' | 'Penthouse'> = ['Apartment', 'Studio', 'Villa', 'Penthouse'];
    const weights = [0.6, 0.1, 0.2, 0.1];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return types[i];
    }
    
    return 'Apartment';
  }

  private getPossessionStatus(): 'Ready' | 'Under Construction' | 'Pre-launch' {
    const statuses: Array<'Ready' | 'Under Construction' | 'Pre-launch'> = ['Ready', 'Under Construction', 'Pre-launch'];
    const weights = [0.5, 0.4, 0.1];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return statuses[i];
    }
    
    return 'Ready';
  }

  private getFurnishing(): 'Unfurnished' | 'Semi-furnished' | 'Fully-furnished' {
    const options: Array<'Unfurnished' | 'Semi-furnished' | 'Fully-furnished'> = ['Unfurnished', 'Semi-furnished', 'Fully-furnished'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private getFacing(): 'North' | 'South' | 'East' | 'West' | 'North-East' | 'South-West' | 'North-West' | 'South-East' {
    const directions: Array<'North' | 'South' | 'East' | 'West' | 'North-East' | 'South-West' | 'North-West' | 'South-East'> = 
      ['North', 'South', 'East', 'West', 'North-East', 'South-West', 'North-West', 'South-East'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private getProjectSuffix(): string {
    const suffixes = ['Eternis', 'Grandeur', 'Platinum', 'Elite', 'Signature', 'Pinnacle', 'Heights', 'Residency'];
    return suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  private generateReraId(city: string): string {
    const stateCodes: Record<string, string> = {
      'Mumbai': 'MH',
      'Delhi NCR': 'HR',
      'Bengaluru': 'KA',
      'Hyderabad': 'TG',
      'Chennai': 'TN',
      'Pune': 'MH',
      'Kolkata': 'WB',
      'Ahmedabad': 'GJ'
    };
    
    const code = stateCodes[city] || 'MH';
    const number = Math.floor(Math.random() * 90000) + 10000;
    return `${code}RERA${number}`;
  }

  private generateAmenities(segment: string): string[] {
    const allAmenities = [
      ...this.amenityCategories.lifestyle,
      ...this.amenityCategories.eco,
      ...this.amenityCategories.security,
      ...(segment === 'Premium' ? this.amenityCategories.premium : [])
    ];
    
    const count = segment === 'Premium' ? 12 : segment === 'Mid-Range' ? 8 : 5;
    return allAmenities.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private generateImages(): string[] {
    const imageIds = [560518, 560519, 560520, 560521, 560522];
    return imageIds.map(id => `https://images.unsplash.com/photo-15605181${id}?w=800&h=600&fit=crop`);
  }

  private generatePopularityMetrics(): PopularityMetrics {
    return {
      viewVelocity: Math.round((Math.random() * 50 + 20) * 10) / 10,
      shortlistRatio: Math.round((Math.random() * 0.3 + 0.1) * 100) / 100,
      trending: Math.random() > 0.8,
      demandIndex: Math.round((Math.random() * 40 + 60) * 10) / 10,
      regionalTrend: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any
    };
  }

  private getBuilderSegment(builder: string): 'Budget' | 'Mid-Range' | 'Premium' {
    const premiumBuilders = ['DLF Limited', 'Godrej Properties', 'Oberoi Realty', 'Sobha Limited'];
    const midRangeBuilders = ['Prestige Group', 'Brigade Group', 'Hiranandani Group'];
    
    if (premiumBuilders.includes(builder)) return 'Premium';
    if (midRangeBuilders.includes(builder)) return 'Mid-Range';
    return 'Budget';
  }

  private generatePastProjects(builder: string, isNational: boolean): any[] {
    const count = isNational ? 8 : 4;
    return Array.from({ length: count }, (_, i) => ({
      name: `${builder.split(' ')[0]} Project ${i + 1}`,
      year: 2020 + Math.floor(Math.random() * 4),
      onTime: Math.random() > (isNational ? 0.2 : 0.4),
      delayMonths: Math.floor(Math.random() * (isNational ? 6 : 12)),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10
    }));
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

  // Public methods
  getTier1Cities(): string[] {
    return this.tier1Cities;
  }

  getPropertySegments(): PropertySegment[] {
    return this.propertySegments;
  }

  getAmenityCategories() {
    return this.amenityCategories;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const brickMatrixEngineRevamped = new BrickMatrixEngineRevamped();