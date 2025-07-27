interface EnhancedPropertyListing {
  id: string;
  title: string;
  city: string;
  zone: string;
  locality: string;
  microMarket: string;
  price: number;
  pricePerSqft: number;
  area: number;
  bhk: string;
  builderName: string;
  builderType: 'National' | 'Regional' | 'Local' | 'Boutique';
  builderCredibility: {
    score: number;
    badge: 'Excellent' | 'Good' | 'Average' | 'New';
    completedProjects: number;
    onTimeDelivery: number;
  };
  listingType: 'Owner' | 'Broker' | 'Builder' | 'Platform';
  propertyAge: number;
  status: 'Ready' | 'Under Construction' | 'New Launch' | 'Resale';
  segment: 'Affordable' | 'Mid-Range' | 'Premium' | 'Ultra-Premium';
  reraStatus: {
    approved: boolean;
    registrationNumber: string;
    validTill?: string;
  };
  priceHistory: Array<{
    month: string;
    price: number;
  }>;
  metadata: {
    viewCount: number;
    popularityTag?: 'Trending' | 'Hot' | 'Most Viewed';
    verifiedTag: boolean;
    lastUpdated: string;
  };
  amenities: string[];
  images: string[];
  possessionDate?: string;
  coordinates: { lat: number; lng: number };
  isNearbyAlternative?: boolean;
  alternativeReason?: string;
}

interface GeographicalMapping {
  city: string;
  zones: Array<{
    name: string;
    localities: Array<{
      name: string;
      microMarkets: string[];
      coordinates: { lat: number; lng: number };
    }>;
  }>;
}

export class EnhancedPropertyService {
  private geographicalData: GeographicalMapping[] = [
    {
      city: 'Mumbai',
      zones: [
        {
          name: 'Western Suburbs',
          localities: [
            {
              name: 'Bandra West',
              microMarkets: ['Linking Road', 'Carter Road', 'Hill Road', 'SV Road', 'Pali Hill'],
              coordinates: { lat: 19.0596, lng: 72.8295 }
            },
            {
              name: 'Andheri West',
              microMarkets: ['Lokhandwala', 'Versova', 'JP Road', 'DN Nagar', 'Four Bungalows'],
              coordinates: { lat: 19.1136, lng: 72.8697 }
            },
            {
              name: 'Malad West',
              microMarkets: ['Mindspace', 'Infinity Mall Area', 'Link Road', 'Marve Road', 'Kurar Village'],
              coordinates: { lat: 19.1875, lng: 72.8489 }
            }
          ]
        },
        {
          name: 'Central Mumbai',
          localities: [
            {
              name: 'Lower Parel',
              microMarkets: ['Phoenix Mills', 'Kamala Mills', 'Senapati Bapat Marg', 'Elphinstone Road'],
              coordinates: { lat: 19.0176, lng: 72.8562 }
            },
            {
              name: 'Worli',
              microMarkets: ['Worli Sea Face', 'Lotus Mills', 'Annie Besant Road', 'Worli Village'],
              coordinates: { lat: 19.0176, lng: 72.8156 }
            }
          ]
        },
        {
          name: 'Eastern Suburbs',
          localities: [
            {
              name: 'Powai',
              microMarkets: ['Hiranandani Gardens', 'Powai Lake', 'IIT Bombay', 'Chandivali'],
              coordinates: { lat: 19.1197, lng: 72.9056 }
            },
            {
              name: 'Ghatkopar East',
              microMarkets: ['R City Mall', 'Ghatkopar Station', 'Rajawadi', 'Asalpha'],
              coordinates: { lat: 19.0864, lng: 72.9081 }
            }
          ]
        }
      ]
    },
    {
      city: 'Delhi',
      zones: [
        {
          name: 'South Delhi',
          localities: [
            {
              name: 'Saket',
              microMarkets: ['Select City Walk', 'Saket Metro', 'Press Enclave', 'Malviya Nagar Border'],
              coordinates: { lat: 28.5245, lng: 77.2066 }
            },
            {
              name: 'Greater Kailash',
              microMarkets: ['GK-1 M Block', 'GK-2 R Block', 'Kailash Colony', 'Nehru Place Border'],
              coordinates: { lat: 28.5494, lng: 77.2425 }
            }
          ]
        },
        {
          name: 'West Delhi',
          localities: [
            {
              name: 'Dwarka',
              microMarkets: ['Sector 12', 'Sector 19', 'Sector 23', 'Dwarka Expressway'],
              coordinates: { lat: 28.5921, lng: 77.0460 }
            }
          ]
        },
        {
          name: 'Gurgaon',
          localities: [
            {
              name: 'DLF Phase 1',
              microMarkets: ['DLF Cyber City', 'Cyber Hub', 'Phase 1 Market', 'Golf Course Road'],
              coordinates: { lat: 28.4817, lng: 77.1025 }
            },
            {
              name: 'Sector 49',
              microMarkets: ['Sohna Road', 'Golf Course Extension', 'Sector 50', 'Nirvana Country'],
              coordinates: { lat: 28.4089, lng: 77.0507 }
            }
          ]
        }
      ]
    },
    {
      city: 'Bangalore',
      zones: [
        {
          name: 'East Bangalore',
          localities: [
            {
              name: 'Whitefield',
              microMarkets: ['ITPL Main Road', 'Varthur Road', 'Brookefield', 'Kadugodi', 'Graphite India'],
              coordinates: { lat: 12.9698, lng: 77.7500 }
            },
            {
              name: 'Electronic City',
              microMarkets: ['Phase 1', 'Phase 2', 'Bommasandra', 'Hebbagodi', 'Anekal Road'],
              coordinates: { lat: 12.8456, lng: 77.6603 }
            }
          ]
        },
        {
          name: 'South Bangalore',
          localities: [
            {
              name: 'Koramangala',
              microMarkets: ['5th Block', '6th Block', '8th Block', 'Forum Mall Area', 'Jyoti Nivas'],
              coordinates: { lat: 12.9279, lng: 77.6271 }
            },
            {
              name: 'HSR Layout',
              microMarkets: ['Sector 1', 'Sector 2', 'Sector 7', 'BDA Complex', '27th Main Road'],
              coordinates: { lat: 12.9082, lng: 77.6476 }
            }
          ]
        }
      ]
    },
    {
      city: 'Pune',
      zones: [
        {
          name: 'West Pune',
          localities: [
            {
              name: 'Baner',
              microMarkets: ['Baner Road', 'Aundh-Baner Link Road', 'Balewadi', 'Sus Road'],
              coordinates: { lat: 18.5593, lng: 73.7785 }
            },
            {
              name: 'Hinjewadi',
              microMarkets: ['Phase 1', 'Phase 2', 'Phase 3', 'Rajiv Gandhi Infotech Park'],
              coordinates: { lat: 18.5912, lng: 73.7389 }
            }
          ]
        },
        {
          name: 'East Pune',
          localities: [
            {
              name: 'Kharadi',
              microMarkets: ['EON IT Park', 'Kharadi Bypass', 'Chandan Nagar', 'World Trade Center'],
              coordinates: { lat: 18.5515, lng: 73.9357 }
            }
          ]
        }
      ]
    },
    {
      city: 'Hyderabad',
      zones: [
        {
          name: 'West Hyderabad',
          localities: [
            {
              name: 'HITEC City',
              microMarkets: ['Cyber Towers', 'Mindspace', 'DLF Cyber City', 'Raheja IT Park'],
              coordinates: { lat: 17.4435, lng: 78.3772 }
            },
            {
              name: 'Gachibowli',
              microMarkets: ['Financial District', 'Nanakramguda', 'Kollur', 'Gopanpally'],
              coordinates: { lat: 17.4399, lng: 78.3487 }
            }
          ]
        }
      ]
    },
    {
      city: 'Chennai',
      zones: [
        {
          name: 'South Chennai',
          localities: [
            {
              name: 'OMR',
              microMarkets: ['Thoraipakkam', 'Sholinganallur', 'Perungudi', 'Karapakkam'],
              coordinates: { lat: 12.8956, lng: 80.2267 }
            },
            {
              name: 'Adyar',
              microMarkets: ['Boat Club Road', 'Lattice Bridge Road', 'Kasturba Nagar', 'Indira Nagar'],
              coordinates: { lat: 13.0067, lng: 80.2206 }
            }
          ]
        }
      ]
    }
  ];

  private diverseBuilders = {
    National: ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group', 'Sobha Limited', 'Oberoi Realty', 'Lodha Group', 'Mahindra Lifespace'],
    Regional: ['Kolte Patil', 'Puravankara', 'Shriram Properties', 'Phoenix Mills', 'Nitesh Estates', 'Salarpuria Sattva', 'Mantri Developers'],
    Local: ['Rohan Builders', 'Goel Ganga', 'Kalpataru Group', 'Rustomjee', 'Runwal Group', 'Piramal Realty', 'Shapoorji Pallonji'],
    Boutique: ['Ashwin Architects', 'Studio Lotus', 'Morphogenesis', 'CP Kukreja', 'Hafeez Contractor', 'Sanjay Puri Architects']
  };

  async fetchEnhancedDiverseProperties(filters: any): Promise<EnhancedPropertyListing[]> {
    console.log('🌍 Fetching enhanced diverse property listings...');
    
    const targetCity = filters.locationProximity?.city || filters.locationFilters?.neighborhood || 'Mumbai';
    const cityData = this.geographicalData.find(c => c.city === targetCity);
    
    if (!cityData) {
      return this.generateFallbackProperties(targetCity, filters);
    }

    const properties: EnhancedPropertyListing[] = [];
    
    // Generate diverse properties for each locality with hyper-local focus
    for (const zone of cityData.zones) {
      for (const locality of zone.localities) {
        const localProperties = await this.generateHyperLocalProperties(
          targetCity, 
          zone.name, 
          locality, 
          filters
        );
        properties.push(...localProperties);
      }
    }

    // Add nearby alternatives if needed
    if (properties.length < 20) {
      const nearbyProperties = await this.generateNearbyAlternatives(targetCity, filters);
      properties.push(...nearbyProperties);
    }

    return this.ensureDiversityAndShuffle(properties);
  }

  private async generateHyperLocalProperties(
    city: string,
    zone: string,
    locality: any,
    filters: any
  ): Promise<EnhancedPropertyListing[]> {
    const properties: EnhancedPropertyListing[] = [];
    const propertyCount = Math.floor(Math.random() * 5) + 3; // 3-8 per locality

    for (let i = 0; i < propertyCount; i++) {
      const microMarket = locality.microMarkets[Math.floor(Math.random() * locality.microMarkets.length)];
      const builderType = this.getRandomBuilderType();
      const builder = this.getBuilderByType(builderType);
      const segment = this.getRandomSegment();
      const listingType = this.getRandomListingType();
      const status = this.getRandomStatus();
      
      const property: EnhancedPropertyListing = {
        id: `enhanced_${city}_${zone}_${locality.name}_${Date.now()}_${i}`,
        title: this.generateHyperLocalTitle(city, locality.name, microMarket, segment),
        city,
        zone,
        locality: locality.name,
        microMarket,
        price: this.generatePriceBySegment(segment, city),
        pricePerSqft: this.generatePricePerSqft(city, locality.name, segment),
        area: this.generateArea(),
        bhk: this.getRandomBHK(),
        builderName: builder,
        builderType,
        builderCredibility: this.generateBuilderCredibility(builderType),
        listingType,
        propertyAge: this.generatePropertyAge(status),
        status,
        segment,
        reraStatus: this.generateReraStatus(),
        priceHistory: this.generatePriceHistory(),
        metadata: this.generateMetadata(),
        amenities: this.generateDiverseAmenities(segment),
        images: this.generatePropertyImages(),
        possessionDate: status === 'Under Construction' ? this.generatePossessionDate() : undefined,
        coordinates: this.generateNearbyCoordinates(locality.coordinates)
      };

      properties.push(property);
    }

    return properties;
  }

  private async generateNearbyAlternatives(city: string, filters: any): Promise<EnhancedPropertyListing[]> {
    const alternatives: EnhancedPropertyListing[] = [];
    const nearbyCount = Math.floor(Math.random() * 6) + 4; // 4-10 alternatives

    for (let i = 0; i < nearbyCount; i++) {
      const alternative: EnhancedPropertyListing = {
        id: `nearby_${city}_${Date.now()}_${i}`,
        title: `Alternative Option in ${city}`,
        city,
        zone: 'Adjacent Area',
        locality: 'Nearby Location',
        microMarket: 'Adjacent Market',
        price: this.generatePriceBySegment('Mid-Range', city),
        pricePerSqft: this.generatePricePerSqft(city, 'Adjacent Area', 'Mid-Range'),
        area: this.generateArea(),
        bhk: this.getRandomBHK(),
        builderName: this.getBuilderByType('Regional'),
        builderType: 'Regional',
        builderCredibility: this.generateBuilderCredibility('Regional'),
        listingType: 'Broker',
        propertyAge: Math.floor(Math.random() * 5),
        status: 'Ready',
        segment: 'Mid-Range',
        reraStatus: this.generateReraStatus(),
        priceHistory: this.generatePriceHistory(),
        metadata: {
          viewCount: Math.floor(Math.random() * 300) + 50,
          verifiedTag: Math.random() > 0.4,
          lastUpdated: new Date().toISOString()
        },
        amenities: this.generateDiverseAmenities('Mid-Range'),
        images: this.generatePropertyImages(),
        coordinates: { lat: 0, lng: 0 },
        isNearbyAlternative: true,
        alternativeReason: 'Similar properties in adjacent areas'
      };

      alternatives.push(alternative);
    }

    return alternatives;
  }

  private generateFallbackProperties(city: string, filters: any): EnhancedPropertyListing[] {
    const fallbackProperties: EnhancedPropertyListing[] = [];
    const count = 25;

    for (let i = 0; i < count; i++) {
      const segment = this.getRandomSegment();
      const builderType = this.getRandomBuilderType();
      
      fallbackProperties.push({
        id: `fallback_${city}_${Date.now()}_${i}`,
        title: `Property in ${city}`,
        city,
        zone: 'Central Zone',
        locality: 'Central Area',
        microMarket: 'Main Market',
        price: this.generatePriceBySegment(segment, city),
        pricePerSqft: this.generatePricePerSqft(city, 'Central Area', segment),
        area: this.generateArea(),
        bhk: this.getRandomBHK(),
        builderName: this.getBuilderByType(builderType),
        builderType,
        builderCredibility: this.generateBuilderCredibility(builderType),
        listingType: this.getRandomListingType(),
        propertyAge: Math.floor(Math.random() * 10),
        status: this.getRandomStatus(),
        segment,
        reraStatus: this.generateReraStatus(),
        priceHistory: this.generatePriceHistory(),
        metadata: this.generateMetadata(),
        amenities: this.generateDiverseAmenities(segment),
        images: this.generatePropertyImages(),
        coordinates: { lat: 0, lng: 0 }
      });
    }

    return fallbackProperties;
  }

  private getRandomBuilderType(): 'National' | 'Regional' | 'Local' | 'Boutique' {
    const types: Array<'National' | 'Regional' | 'Local' | 'Boutique'> = ['National', 'Regional', 'Local', 'Boutique'];
    const weights = [0.25, 0.40, 0.30, 0.05]; // More regional and local builders
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return types[i];
    }
    
    return 'Regional';
  }

  private getBuilderByType(type: 'National' | 'Regional' | 'Local' | 'Boutique'): string {
    const builders = this.diverseBuilders[type];
    return builders[Math.floor(Math.random() * builders.length)];
  }

  private getRandomSegment(): 'Affordable' | 'Mid-Range' | 'Premium' | 'Ultra-Premium' {
    const segments: Array<'Affordable' | 'Mid-Range' | 'Premium' | 'Ultra-Premium'> = 
      ['Affordable', 'Mid-Range', 'Premium', 'Ultra-Premium'];
    const weights = [0.35, 0.40, 0.20, 0.05]; // More affordable and mid-range
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < segments.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return segments[i];
    }
    
    return 'Mid-Range';
  }

  private getRandomListingType(): 'Owner' | 'Broker' | 'Builder' | 'Platform' {
    const types: Array<'Owner' | 'Broker' | 'Builder' | 'Platform'> = ['Owner', 'Broker', 'Builder', 'Platform'];
    const weights = [0.30, 0.35, 0.25, 0.10];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return types[i];
    }
    
    return 'Broker';
  }

  private getRandomStatus(): 'Ready' | 'Under Construction' | 'New Launch' | 'Resale' {
    const statuses: Array<'Ready' | 'Under Construction' | 'New Launch' | 'Resale'> = 
      ['Ready', 'Under Construction', 'New Launch', 'Resale'];
    const weights = [0.35, 0.30, 0.20, 0.15];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return statuses[i];
    }
    
    return 'Ready';
  }

  private generatePriceBySegment(segment: string, city: string): number {
    const basePrices = {
      'Mumbai': { Affordable: 8000000, 'Mid-Range': 18000000, Premium: 35000000, 'Ultra-Premium': 80000000 },
      'Delhi': { Affordable: 6000000, 'Mid-Range': 15000000, Premium: 30000000, 'Ultra-Premium': 70000000 },
      'Bangalore': { Affordable: 4000000, 'Mid-Range': 10000000, Premium: 20000000, 'Ultra-Premium': 50000000 },
      'Pune': { Affordable: 3500000, 'Mid-Range': 8000000, Premium: 16000000, 'Ultra-Premium': 40000000 },
      'Hyderabad': { Affordable: 3000000, 'Mid-Range': 7000000, Premium: 14000000, 'Ultra-Premium': 35000000 },
      'Chennai': { Affordable: 3200000, 'Mid-Range': 7500000, Premium: 15000000, 'Ultra-Premium': 38000000 }
    };
    
    const cityPrices = basePrices[city as keyof typeof basePrices] || basePrices['Bangalore'];
    const basePrice = cityPrices[segment as keyof typeof cityPrices];
    
    return Math.floor(basePrice * (0.8 + Math.random() * 0.4));
  }

  private generatePricePerSqft(city: string, locality: string, segment: string): number {
    const basePrices = {
      'Mumbai': { Affordable: 12000, 'Mid-Range': 18000, Premium: 25000, 'Ultra-Premium': 40000 },
      'Delhi': { Affordable: 8000, 'Mid-Range': 15000, Premium: 22000, 'Ultra-Premium': 35000 },
      'Bangalore': { Affordable: 6000, 'Mid-Range': 10000, Premium: 16000, 'Ultra-Premium': 25000 },
      'Pune': { Affordable: 5000, 'Mid-Range': 8000, Premium: 13000, 'Ultra-Premium': 22000 },
      'Hyderabad': { Affordable: 4500, 'Mid-Range': 7500, Premium: 12000, 'Ultra-Premium': 20000 },
      'Chennai': { Affordable: 4800, 'Mid-Range': 8200, Premium: 13500, 'Ultra-Premium': 23000 }
    };
    
    const cityPrices = basePrices[city as keyof typeof basePrices] || basePrices['Bangalore'];
    const basePrice = cityPrices[segment as keyof typeof cityPrices];
    
    return Math.floor(basePrice * (0.9 + Math.random() * 0.2));
  }

  private generateArea(): number {
    return Math.floor(Math.random() * 1500) + 600; // 600-2100 sq ft
  }

  private getRandomBHK(): string {
    const bhks = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];
    const weights = [0.15, 0.35, 0.35, 0.12, 0.03];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < bhks.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return bhks[i];
    }
    
    return '3BHK';
  }

  private generateBuilderCredibility(builderType: string): EnhancedPropertyListing['builderCredibility'] {
    const scoreRanges = {
      National: [8.5, 9.5],
      Regional: [7.5, 8.8],
      Local: [6.5, 8.0],
      Boutique: [7.0, 9.0]
    };
    
    const [min, max] = scoreRanges[builderType as keyof typeof scoreRanges];
    const score = Math.round((Math.random() * (max - min) + min) * 10) / 10;
    
    let badge: 'Excellent' | 'Good' | 'Average' | 'New';
    if (score >= 9.0) badge = 'Excellent';
    else if (score >= 8.0) badge = 'Good';
    else if (score >= 7.0) badge = 'Average';
    else badge = 'New';
    
    return {
      score,
      badge,
      completedProjects: Math.floor(Math.random() * 50) + (builderType === 'National' ? 20 : 5),
      onTimeDelivery: Math.floor(Math.random() * 30) + (builderType === 'National' ? 70 : 60)
    };
  }

  private generateReraStatus(): EnhancedPropertyListing['reraStatus'] {
    const approved = Math.random() > 0.15; // 85% RERA approved
    
    return {
      approved,
      registrationNumber: approved ? `RERA${Math.random().toString(36).substr(2, 9).toUpperCase()}` : '',
      validTill: approved ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0] : undefined
    };
  }

  private generatePriceHistory(): Array<{ month: string; price: number }> {
    const history = [];
    let basePrice = Math.floor(Math.random() * 5000) + 10000;
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      basePrice *= (1 + (Math.random() * 0.04 - 0.01)); // -1% to +3% monthly
      
      history.push({
        month: date.toISOString().slice(0, 7),
        price: Math.round(basePrice)
      });
    }
    
    return history;
  }

  private generateMetadata(): EnhancedPropertyListing['metadata'] {
    const viewCount = Math.floor(Math.random() * 2000) + 50;
    let popularityTag: 'Trending' | 'Hot' | 'Most Viewed' | undefined;
    
    if (viewCount > 1500) popularityTag = 'Most Viewed';
    else if (viewCount > 1000) popularityTag = 'Hot';
    else if (viewCount > 500) popularityTag = 'Trending';
    
    return {
      viewCount,
      popularityTag,
      verifiedTag: Math.random() > 0.25, // 75% verified
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private generateDiverseAmenities(segment: string): string[] {
    const baseAmenities = ['Security', 'Parking', 'Power Backup', 'Lift'];
    const segmentAmenities = {
      'Affordable': ['Garden', 'Children Play Area', 'Water Supply', 'Community Hall'],
      'Mid-Range': ['Gym', 'Swimming Pool', 'Clubhouse', 'Jogging Track', 'Intercom'],
      'Premium': ['Spa', 'Tennis Court', 'Concierge', 'Private Garden', 'Home Theater', 'Valet Parking'],
      'Ultra-Premium': ['Helipad', 'Wine Cellar', 'Private Elevator', 'Butler Service', 'Infinity Pool', 'Golf Simulator']
    };
    
    const amenities = [...baseAmenities];
    const segmentSpecific = segmentAmenities[segment as keyof typeof segmentAmenities] || [];
    
    segmentSpecific.forEach(amenity => {
      if (Math.random() > 0.3) amenities.push(amenity);
    });
    
    return amenities;
  }

  private generateHyperLocalTitle(city: string, locality: string, microMarket: string, segment: string): string {
    const adjectives = {
      'Affordable': ['Comfortable', 'Cozy', 'Smart', 'Value', 'Budget-Friendly'],
      'Mid-Range': ['Modern', 'Elegant', 'Spacious', 'Contemporary', 'Well-Designed'],
      'Premium': ['Luxury', 'Premium', 'Elite', 'Exclusive', 'Sophisticated'],
      'Ultra-Premium': ['Ultra-Luxury', 'Signature', 'Platinum', 'Royal', 'Opulent']
    };
    
    const adj = adjectives[segment as keyof typeof adjectives];
    const selectedAdj = adj[Math.floor(Math.random() * adj.length)];
    
    return `${selectedAdj} Home in ${microMarket}, ${locality}`;
  }

  private generatePropertyAge(status: string): number {
    switch (status) {
      case 'New Launch': return 0;
      case 'Under Construction': return Math.floor(Math.random() * 2);
      case 'Ready': return Math.floor(Math.random() * 3);
      case 'Resale': return Math.floor(Math.random() * 15) + 2;
      default: return 0;
    }
  }

  private generatePossessionDate(): string {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + Math.floor(Math.random() * 36) + 6);
    return futureDate.toISOString().split('T')[0];
  }

  private generateNearbyCoordinates(base: { lat: number; lng: number }): { lat: number; lng: number } {
    return {
      lat: base.lat + (Math.random() - 0.5) * 0.01,
      lng: base.lng + (Math.random() - 0.5) * 0.01
    };
  }

  private generatePropertyImages(): string[] {
    const imageIds = ['560518', '560519', '560520', '560521', '560522', '560523', '560524'];
    return imageIds.slice(0, Math.floor(Math.random() * 4) + 2).map(id => 
      `https://images.unsplash.com/photo-15605181${id}?w=800&h=600&fit=crop`
    );
  }

  private ensureDiversityAndShuffle(properties: EnhancedPropertyListing[]): EnhancedPropertyListing[] {
    // Ensure diversity in results
    const diversified: EnhancedPropertyListing[] = [];
    const builderCounts: Record<string, number> = {};
    const segmentCounts: Record<string, number> = {};
    const localityCounts: Record<string, number> = {};
    
    // Shuffle properties
    const shuffled = properties.sort(() => Math.random() - 0.5);
    
    for (const property of shuffled) {
      const builderCount = builderCounts[property.builderName] || 0;
      const segmentCount = segmentCounts[property.segment] || 0;
      const localityCount = localityCounts[property.locality] || 0;
      
      // Limit repetition to ensure diversity
      if (builderCount < 3 && segmentCount < 10 && localityCount < 5) {
        diversified.push(property);
        builderCounts[property.builderName] = builderCount + 1;
        segmentCounts[property.segment] = segmentCount + 1;
        localityCounts[property.locality] = localityCount + 1;
      }
      
      if (diversified.length >= 35) break;
    }
    
    return diversified;
  }

  getSupportedCities(): string[] {
    return this.geographicalData.map(city => city.city);
  }

  getZonesForCity(city: string): string[] {
    const cityData = this.geographicalData.find(c => c.city === city);
    return cityData?.zones.map(zone => zone.name) || [];
  }

  getLocalitiesForCity(city: string): string[] {
    const cityData = this.geographicalData.find(c => c.city === city);
    if (!cityData) return [];
    
    return cityData.zones.flatMap(zone => 
      zone.localities.map(locality => locality.name)
    );
  }

  getMicroMarketsForLocality(city: string, locality: string): string[] {
    const cityData = this.geographicalData.find(c => c.city === city);
    if (!cityData) return [];
    
    for (const zone of cityData.zones) {
      const localityData = zone.localities.find(l => l.name === locality);
      if (localityData) return localityData.microMarkets;
    }
    
    return [];
  }
}

export const enhancedPropertyService = new EnhancedPropertyService();