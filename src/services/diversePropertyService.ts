interface DiverseProperty {
  id: string;
  title: string;
  city: string;
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
  propertyAge: number; // in years
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
}

interface GeographicalData {
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

export class DiversePropertyService {
  private geographicalData: GeographicalData[] = [
    {
      city: 'Mumbai',
      zones: [
        {
          name: 'Western Suburbs',
          localities: [
            {
              name: 'Bandra West',
              microMarkets: ['Linking Road', 'Carter Road', 'Hill Road', 'SV Road'],
              coordinates: { lat: 19.0596, lng: 72.8295 }
            },
            {
              name: 'Andheri West',
              microMarkets: ['Lokhandwala', 'Versova', 'JP Road', 'DN Nagar'],
              coordinates: { lat: 19.1136, lng: 72.8697 }
            },
            {
              name: 'Malad West',
              microMarkets: ['Mindspace', 'Infinity Mall Area', 'Link Road', 'Marve Road'],
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
              microMarkets: ['ITPL Main Road', 'Varthur Road', 'Brookefield', 'Kadugodi'],
              coordinates: { lat: 12.9698, lng: 77.7500 }
            },
            {
              name: 'Electronic City',
              microMarkets: ['Phase 1', 'Phase 2', 'Bommasandra', 'Hebbagodi'],
              coordinates: { lat: 12.8456, lng: 77.6603 }
            }
          ]
        },
        {
          name: 'South Bangalore',
          localities: [
            {
              name: 'Koramangala',
              microMarkets: ['5th Block', '6th Block', '8th Block', 'Forum Mall Area'],
              coordinates: { lat: 12.9279, lng: 77.6271 }
            }
          ]
        }
      ]
    }
  ];

  private diverseBuilders = {
    National: ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group', 'Sobha Limited', 'Oberoi Realty', 'Lodha Group'],
    Regional: ['Kolte Patil', 'Puravankara', 'Shriram Properties', 'Phoenix Mills', 'Mahindra Lifespace', 'Tata Housing'],
    Local: ['Rohan Builders', 'Goel Ganga', 'Kalpataru Group', 'Rustomjee', 'Runwal Group', 'Piramal Realty'],
    Boutique: ['Ashwin Architects', 'Studio Lotus', 'Morphogenesis', 'CP Kukreja', 'Hafeez Contractor']
  };

  async fetchDiverseProperties(filters: any): Promise<DiverseProperty[]> {
    console.log('🌍 Fetching diverse property listings...');
    
    const targetCity = filters.locationProximity?.city || 'Mumbai';
    const cityData = this.geographicalData.find(c => c.city === targetCity);
    
    if (!cityData) {
      return this.generateFallbackProperties(targetCity, filters);
    }

    const properties: DiverseProperty[] = [];
    
    // Generate diverse properties for each locality
    for (const zone of cityData.zones) {
      for (const locality of zone.localities) {
        const localProperties = await this.generateLocalityProperties(
          targetCity, 
          zone.name, 
          locality, 
          filters
        );
        properties.push(...localProperties);
      }
    }

    // Add nearby alternatives if needed
    if (properties.length < 15) {
      const nearbyProperties = await this.generateNearbyAlternatives(targetCity, filters);
      properties.push(...nearbyProperties);
    }

    return this.shuffleAndDiversify(properties);
  }

  private async generateLocalityProperties(
    city: string,
    zone: string,
    locality: any,
    filters: any
  ): Promise<DiverseProperty[]> {
    const properties: DiverseProperty[] = [];
    const propertyCount = Math.floor(Math.random() * 4) + 2; // 2-6 per locality

    for (let i = 0; i < propertyCount; i++) {
      const microMarket = locality.microMarkets[Math.floor(Math.random() * locality.microMarkets.length)];
      const builderType = this.getRandomBuilderType();
      const builder = this.getBuilderByType(builderType);
      const segment = this.getRandomSegment();
      const listingType = this.getRandomListingType();
      const status = this.getRandomStatus();
      
      const property: DiverseProperty = {
        id: `diverse_${city}_${Date.now()}_${i}`,
        title: this.generateDiverseTitle(city, locality.name, microMarket, segment),
        city,
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

  private async generateNearbyAlternatives(city: string, filters: any): Promise<DiverseProperty[]> {
    const alternatives: DiverseProperty[] = [];
    const nearbyCount = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < nearbyCount; i++) {
      const alternative: DiverseProperty = {
        id: `nearby_${city}_${Date.now()}_${i}`,
        title: `Nearby Alternative in ${city}`,
        city,
        locality: 'Adjacent Area',
        microMarket: 'Nearby Location',
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
          viewCount: Math.floor(Math.random() * 500) + 100,
          verifiedTag: Math.random() > 0.3,
          lastUpdated: new Date().toISOString()
        },
        amenities: this.generateDiverseAmenities('Mid-Range'),
        images: this.generatePropertyImages(),
        coordinates: { lat: 0, lng: 0 }
      };

      alternatives.push(alternative);
    }

    return alternatives;
  }

  private generateFallbackProperties(city: string, filters: any): DiverseProperty[] {
    const fallbackProperties: DiverseProperty[] = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const segment = this.getRandomSegment();
      const builderType = this.getRandomBuilderType();
      
      fallbackProperties.push({
        id: `fallback_${city}_${Date.now()}_${i}`,
        title: `Property in ${city}`,
        city,
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
    const weights = [0.3, 0.35, 0.25, 0.1]; // More regional and local builders
    
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
    const weights = [0.4, 0.35, 0.2, 0.05]; // More affordable and mid-range
    
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
    const weights = [0.25, 0.4, 0.25, 0.1];
    
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
    const weights = [0.4, 0.3, 0.15, 0.15];
    
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
      'Bangalore': { Affordable: 4000000, 'Mid-Range': 10000000, Premium: 20000000, 'Ultra-Premium': 50000000 }
    };
    
    const cityPrices = basePrices[city as keyof typeof basePrices] || basePrices['Bangalore'];
    const basePrice = cityPrices[segment as keyof typeof cityPrices];
    
    return Math.floor(basePrice * (0.8 + Math.random() * 0.4));
  }

  private generatePricePerSqft(city: string, locality: string, segment: string): number {
    const basePrices = {
      'Mumbai': { Affordable: 12000, 'Mid-Range': 18000, Premium: 25000, 'Ultra-Premium': 40000 },
      'Delhi': { Affordable: 8000, 'Mid-Range': 15000, Premium: 22000, 'Ultra-Premium': 35000 },
      'Bangalore': { Affordable: 6000, 'Mid-Range': 10000, Premium: 16000, 'Ultra-Premium': 25000 }
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

  private generateBuilderCredibility(builderType: string): DiverseProperty['builderCredibility'] {
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

  private generateReraStatus(): DiverseProperty['reraStatus'] {
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

  private generateMetadata(): DiverseProperty['metadata'] {
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
      'Affordable': ['Garden', 'Children Play Area', 'Water Supply'],
      'Mid-Range': ['Gym', 'Swimming Pool', 'Clubhouse', 'Jogging Track'],
      'Premium': ['Spa', 'Tennis Court', 'Concierge', 'Private Garden', 'Home Theater'],
      'Ultra-Premium': ['Helipad', 'Wine Cellar', 'Private Elevator', 'Butler Service', 'Infinity Pool']
    };
    
    const amenities = [...baseAmenities];
    const segmentSpecific = segmentAmenities[segment as keyof typeof segmentAmenities] || [];
    
    segmentSpecific.forEach(amenity => {
      if (Math.random() > 0.3) amenities.push(amenity);
    });
    
    return amenities;
  }

  private generateDiverseTitle(city: string, locality: string, microMarket: string, segment: string): string {
    const adjectives = {
      'Affordable': ['Comfortable', 'Cozy', 'Smart', 'Value'],
      'Mid-Range': ['Modern', 'Elegant', 'Spacious', 'Contemporary'],
      'Premium': ['Luxury', 'Premium', 'Elite', 'Exclusive'],
      'Ultra-Premium': ['Ultra-Luxury', 'Signature', 'Platinum', 'Royal']
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
    const imageIds = ['560518', '560519', '560520', '560521', '560522'];
    return imageIds.slice(0, Math.floor(Math.random() * 3) + 2).map(id => 
      `https://images.unsplash.com/photo-15605181${id}?w=800&h=600&fit=crop`
    );
  }

  private shuffleAndDiversify(properties: DiverseProperty[]): DiverseProperty[] {
    // Ensure diversity in results
    const diversified: DiverseProperty[] = [];
    const builderCounts: Record<string, number> = {};
    const segmentCounts: Record<string, number> = {};
    
    // Shuffle properties
    const shuffled = properties.sort(() => Math.random() - 0.5);
    
    for (const property of shuffled) {
      const builderCount = builderCounts[property.builderName] || 0;
      const segmentCount = segmentCounts[property.segment] || 0;
      
      // Limit repetition
      if (builderCount < 2 && segmentCount < 8) {
        diversified.push(property);
        builderCounts[property.builderName] = builderCount + 1;
        segmentCounts[property.segment] = segmentCount + 1;
      }
      
      if (diversified.length >= 30) break;
    }
    
    return diversified;
  }

  getSupportedCities(): string[] {
    return this.geographicalData.map(city => city.city);
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

export const diversePropertyService = new DiversePropertyService();