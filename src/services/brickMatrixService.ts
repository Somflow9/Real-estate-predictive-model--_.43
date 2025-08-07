interface BrickMatrixConfig {
  dataSources: {
    magicbricks: { endpoint: string; priority: number };
    acres99: { endpoint: string; priority: number };
  };
}

interface BrickMatrixProperty {
  id: string;
  location_intelligence: {
    city: string;
    tier: number;
    locality: string;
    coordinates: { lat: number; lng: number };
    connectivity_score: number;
    nearby_schemes_density: number;
    competing_projects: Array<{
      project_name: string;
      distance_km: number;
      price_per_sqft: number;
      builder: string;
    }>;
    hotspot_status: boolean;
    metro_connectivity: {
      nearest_station: string;
      distance_km: number;
      lines: string[];
    };
    infrastructure_score: number;
  };
  builder_profile: {
    builder_name: string;
    rera_registered: boolean;
    rera_id: string;
    delivery_score: number;
    avg_rating: number;
    builder_rank: number;
    projects_active: number;
    multi_platform_presence: Record<string, boolean>;
    market_sentiment_score: number;
    financial_stability: string;
    on_time_delivery_percentage: number;
  };
  project_details: {
    project_name: string;
    status: 'ready' | 'under_construction' | 'new_launch' | 'planning';
    property_type: string;
    bhk_configurations: string[];
    launch_year: number;
    possession_date: string;
    total_units: number;
    green_certified: boolean;
    amenities_score: number;
    floor_count: number;
  };
  pricing_offers: {
    price_per_sqft: number;
    total_price_range: Record<string, { min: number; max: number }>;
    gst_included: boolean;
    platform_specific_pricing: Record<string, number>;
    active_offers: {
      cashback_offers: Array<{ offer_name: string; cashback_amount: number; valid_till: string }>;
      loan_offers: Array<{ bank: string; interest_rate: number; processing_fee_waived?: boolean }>;
      payment_plans: Array<{ plan_name: string; description: string }>;
    };
    price_trend_direction: 'rising' | 'stable' | 'falling';
    price_appreciation_3yr: number;
  };
  buyer_preferences: Record<string, boolean | string>;
  brickmatrix_scoring: {
    brickmatrix_score: number;
    affordability_index: number;
    livability_score: number;
    investment_potential: number;
    demand_index: number;
    area_price_volatility: number;
    roi_projection_5yr: number;
    rental_yield: number;
    badges: string[];
    risk_assessment: {
      overall_risk: 'low' | 'medium' | 'high';
      market_risk: number;
      builder_risk: number;
      location_risk: number;
    };
    ai_recommendation: {
      action: 'strong_buy' | 'buy' | 'hold' | 'sell';
      confidence: number;
      reasoning: string;
    };
  };
  user_personalization: {
    user_budget: { min: number; max: number };
    preferred_localities: string[];
    previous_interactions: {
      viewed_properties: number;
      shortlisted_count: number;
      contacted_builders: number;
    };
    intent_score: number;
  };
  market_pulse_data: {
    // Market pulse data removed
  };
}


export class BrickMatrixService {
  private config: BrickMatrixConfig = {
    dataSources: {
      magicbricks: { endpoint: 'https://api.magicbricks.com/v2/properties', priority: 1 },
      acres99: { endpoint: 'https://api.99acres.com/v3/search', priority: 2 },
    }
  };

  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  async fetchBrickMatrixRecommendations(filters: {
    budget: { min: number; max: number };
    city: string;
    bhk?: string[];
    property_type?: string;
    preferences?: Record<string, boolean>;
    builder_rating_min?: number;
  }): Promise<BrickMatrixProperty[]> {
    console.log('🔮 BrickMatrix™ Engine: Fetching recommendations...');
    
    const cacheKey = `recommendations_${JSON.stringify(filters)}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('📦 Returning cached BrickMatrix™ data');
      return cached;
    }

    try {
      // Parallel data fetching from all sources
      const [magicbricksData, acres99Data] = await Promise.allSettled([
        this.fetchFromMagicBricks(filters),
        this.fetchFrom99Acres(filters),
      ]);

      // Combine and deduplicate data
      const allProperties: BrickMatrixProperty[] = [];
      
      if (magicbricksData.status === 'fulfilled') allProperties.push(...magicbricksData.value);
      if (acres99Data.status === 'fulfilled') allProperties.push(...acres99Data.value);

      // Apply BrickMatrix™ AI scoring and ranking
      const scoredProperties = await this.applyBrickMatrixScoring(allProperties, filters);
      
      // Cache the results
      this.setCachedData(cacheKey, scoredProperties, 900000); // 15 minutes TTL
      
      console.log(`✨ BrickMatrix™ Engine: Processed ${scoredProperties.length} properties`);
      return scoredProperties;

    } catch (error) {
      console.error('❌ BrickMatrix™ Engine Error:', error);
      throw new Error('Failed to fetch BrickMatrix™ recommendations');
    }
  }

  async fetchMarketPulseData(): Promise<MarketPulseData> {
    throw new Error('Market Pulse functionality has been removed');
  }

  private async fetchFromMagicBricks(filters: any): Promise<BrickMatrixProperty[]> {
    console.log('🏠 Fetching from MagicBricks...');
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.generateMockProperties('MagicBricks', filters, 15);
  }

  private async fetchFrom99Acres(filters: any): Promise<BrickMatrixProperty[]> {
    console.log('🏘️ Fetching from 99acres...');
    await new Promise(resolve => setTimeout(resolve, 900));
    return this.generateMockProperties('99acres', filters, 12);
  }


  private async applyBrickMatrixScoring(
    properties: BrickMatrixProperty[], 
    filters: any
  ): Promise<BrickMatrixProperty[]> {
    console.log('🧠 Applying BrickMatrix™ AI scoring...');
    
    return properties.map(property => {
      // Calculate comprehensive BrickMatrix™ score
      const locationScore = this.calculateLocationScore(property.location_intelligence);
      const builderScore = this.calculateBuilderScore(property.builder_profile);
      const projectScore = this.calculateProjectScore(property.project_details);
      const pricingScore = this.calculatePricingScore(property.pricing_offers, filters);
      const preferencesScore = this.calculatePreferencesScore(property.buyer_preferences, filters.preferences || {});

      const brickmatrixScore = Math.round(
        (locationScore * 0.25 + 
         builderScore * 0.25 + 
         projectScore * 0.20 + 
         pricingScore * 0.15 + 
         preferencesScore * 0.15) * 10
      ) / 10;

      // Generate AI recommendation
      const aiRecommendation = this.generateAIRecommendation(brickmatrixScore, property);

      // Assign badges based on scores
      const badges = this.generateBadges(property, brickmatrixScore);

      return {
        ...property,
        brickmatrix_scoring: {
          ...property.brickmatrix_scoring,
          brickmatrix_score: brickmatrixScore,
          badges,
          ai_recommendation: aiRecommendation
        }
      };
    }).sort((a, b) => b.brickmatrix_scoring.brickmatrix_score - a.brickmatrix_scoring.brickmatrix_score);
  }

  private calculateLocationScore(location: any): number {
    return Math.min(10, 
      (location.connectivity_score * 0.4 + 
       location.infrastructure_score * 0.3 + 
       (location.hotspot_status ? 2 : 0) + 
       Math.min(2, location.nearby_schemes_density / 5)) 
    );
  }

  private calculateBuilderScore(builder: any): number {
    return Math.min(10,
      (builder.delivery_score * 0.3 +
       builder.avg_rating * 2 * 0.3 +
       (11 - builder.builder_rank) * 0.1 * 0.2 +
       builder.market_sentiment_score * 0.2)
    );
  }

  private calculateProjectScore(project: any): number {
    let score = project.amenities_score;
    if (project.green_certified) score += 1;
    if (project.status === 'ready') score += 0.5;
    return Math.min(10, score);
  }

  private calculatePricingScore(pricing: any, filters: any): number {
    const priceRange = pricing.total_price_range['3BHK'] || pricing.total_price_range['2BHK'];
    if (!priceRange) return 5;

    const avgPrice = (priceRange.min + priceRange.max) / 2;
    const budgetMid = (filters.budget.min + filters.budget.max) / 2;
    
    // Score based on how well price aligns with budget
    const priceAlignment = Math.max(0, 10 - Math.abs(avgPrice - budgetMid) / budgetMid * 10);
    
    // Bonus for rising trend
    const trendBonus = pricing.price_trend_direction === 'rising' ? 1 : 0;
    
    return Math.min(10, priceAlignment + trendBonus);
  }

  private calculatePreferencesScore(propertyPrefs: any, userPrefs: any): number {
    const userPrefKeys = Object.keys(userPrefs).filter(key => userPrefs[key]);
    if (userPrefKeys.length === 0) return 8; // Default score if no preferences

    const matchedPrefs = userPrefKeys.filter(key => propertyPrefs[key]);
    return Math.min(10, (matchedPrefs.length / userPrefKeys.length) * 10);
  }

  private generateAIRecommendation(score: number, property: any) {
    let action: 'strong_buy' | 'buy' | 'hold' | 'sell';
    let confidence: number;
    let reasoning: string;

    if (score >= 8.5) {
      action = 'strong_buy';
      confidence = Math.floor(Math.random() * 15) + 85;
      reasoning = 'Exceptional property with outstanding location, builder credibility, and investment potential';
    } else if (score >= 7.5) {
      action = 'buy';
      confidence = Math.floor(Math.random() * 15) + 75;
      reasoning = 'Strong investment opportunity with good fundamentals and growth potential';
    } else if (score >= 6.0) {
      action = 'hold';
      confidence = Math.floor(Math.random() * 15) + 65;
      reasoning = 'Decent option but consider waiting for better opportunities or price corrections';
    } else {
      action = 'hold';
      confidence = Math.floor(Math.random() * 15) + 50;
      reasoning = 'Below average metrics suggest waiting for market improvements or alternative options';
    }

    return { action, confidence, reasoning };
  }

  private generateBadges(property: any, score: number): string[] {
    const badges: string[] = [];
    
    if (score >= 9.0) badges.push('BrickMatrix™ Top Choice');
    if (score >= 8.5) badges.push('Premium Selection');
    if (property.location_intelligence.hotspot_status) badges.push('Hotspot Location');
    if (property.builder_profile.builder_rank <= 3) badges.push('Elite Builder');
    if (property.project_details.status === 'new_launch') badges.push('New Launch');
    if (property.project_details.green_certified) badges.push('Green Certified');
    if (property.pricing_offers.price_trend_direction === 'rising') badges.push('Trending Up');
    if (property.brickmatrix_scoring.investment_potential >= 8.5) badges.push('High ROI');
    
    return badges.slice(0, 4); // Limit to 4 badges
  }

  private generateMockProperties(source: string, filters: any, count: number): BrickMatrixProperty[] {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];
    const builders = ['Lodha Group', 'DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group', 'Sobha Limited'];
    
    return Array.from({ length: count }, (_, i) => {
      const city = filters.city || cities[Math.floor(Math.random() * cities.length)];
      const builder = builders[Math.floor(Math.random() * builders.length)];
      
      return {
        id: `${source.toLowerCase()}_${Date.now()}_${i}`,
        location_intelligence: {
          city,
          tier: ['Mumbai', 'Delhi', 'Bangalore'].includes(city) ? 1 : 2,
          locality: this.getRandomLocality(city),
          coordinates: { lat: 19.0760 + Math.random() * 0.1, lng: 72.8777 + Math.random() * 0.1 },
          connectivity_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          nearby_schemes_density: Math.floor(Math.random() * 20) + 5,
          competing_projects: [
            {
              project_name: `${builder.split(' ')[0]} Heights`,
              distance_km: Math.round(Math.random() * 3 * 10) / 10,
              price_per_sqft: Math.floor(Math.random() * 5000) + 15000,
              builder: builder
            }
          ],
          hotspot_status: Math.random() > 0.6,
          metro_connectivity: {
            nearest_station: 'Central Station',
            distance_km: Math.round(Math.random() * 2 * 10) / 10,
            lines: ['Line 1', 'Line 2']
          },
          infrastructure_score: Math.round((Math.random() * 2 + 8) * 10) / 10
        },
        builder_profile: {
          builder_name: builder,
          rera_registered: true,
          rera_id: `RERA${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          delivery_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          avg_rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
          builder_rank: Math.floor(Math.random() * 10) + 1,
          projects_active: Math.floor(Math.random() * 20) + 5,
          multi_platform_presence: {
            magicbricks: true,
            acres99: Math.random() > 0.3,
            housing: Math.random() > 0.4,
            nobroker: Math.random() > 0.5
          },
          market_sentiment_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          financial_stability: ['AAA', 'AA+', 'AA'][Math.floor(Math.random() * 3)],
          on_time_delivery_percentage: Math.floor(Math.random() * 20) + 80
        },
        project_details: {
          project_name: `${builder.split(' ')[0]} ${['Eternis', 'Grandeur', 'Platinum', 'Elite', 'Signature'][Math.floor(Math.random() * 5)]}`,
          status: ['ready', 'under_construction', 'new_launch'][Math.floor(Math.random() * 3)] as any,
          property_type: filters.property_type || 'apartment',
          bhk_configurations: ['2BHK', '3BHK', '4BHK'],
          launch_year: 2020 + Math.floor(Math.random() * 4),
          possession_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0],
          total_units: Math.floor(Math.random() * 500) + 100,
          green_certified: Math.random() > 0.6,
          amenities_score: Math.round((Math.random() * 2 + 8) * 10) / 10,
          floor_count: Math.floor(Math.random() * 30) + 10
        },
        pricing_offers: {
          price_per_sqft: Math.floor(Math.random() * 10000) + 15000,
          total_price_range: {
            '2BHK': { min: 12000000, max: 18000000 },
            '3BHK': { min: 18000000, max: 28000000 },
            '4BHK': { min: 28000000, max: 45000000 }
          },
          gst_included: false,
          platform_specific_pricing: {
            [source]: Math.floor(Math.random() * 10000) + 15000
          },
          active_offers: {
            cashback_offers: [
              { offer_name: 'Early Bird Special', cashback_amount: 200000, valid_till: '2024-12-31' }
            ],
            loan_offers: [
              { bank: 'HDFC Bank', interest_rate: 8.75, processing_fee_waived: true }
            ],
            payment_plans: [
              { plan_name: '80:20 Plan', description: '80% on possession, 20% during construction' }
            ]
          },
          price_trend_direction: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)] as any,
          price_appreciation_3yr: Math.round((Math.random() * 20 + 5) * 10) / 10
        },
        buyer_preferences: this.generateRandomPreferences(),
        brickmatrix_scoring: {
          brickmatrix_score: 0, // Will be calculated
          affordability_index: Math.round((Math.random() * 4 + 6) * 10) / 10,
          livability_score: Math.round((Math.random() * 2 + 8) * 10) / 10,
          investment_potential: Math.round((Math.random() * 3 + 7) * 10) / 10,
          demand_index: Math.round((Math.random() * 3 + 7) * 10) / 10,
          area_price_volatility: Math.round((Math.random() * 5 + 2) * 10) / 10,
          roi_projection_5yr: Math.round((Math.random() * 15 + 10) * 10) / 10,
          rental_yield: Math.round((Math.random() * 3 + 2) * 10) / 10,
          badges: [],
          risk_assessment: {
            overall_risk: ['low', 'medium'][Math.floor(Math.random() * 2)] as any,
            market_risk: Math.round((Math.random() * 3 + 1) * 10) / 10,
            builder_risk: Math.round((Math.random() * 2 + 1) * 10) / 10,
            location_risk: Math.round((Math.random() * 2 + 1) * 10) / 10
          },
          ai_recommendation: {
            action: 'buy' as any,
            confidence: 80,
            reasoning: 'Generated by BrickMatrix™ AI'
          }
        },
        user_personalization: {
          user_budget: filters.budget,
          preferred_localities: [],
          previous_interactions: {
            viewed_properties: 0,
            shortlisted_count: 0,
            contacted_builders: 0
          },
          intent_score: Math.round((Math.random() * 4 + 6) * 10) / 10
        },
        market_pulse_data: {}
      };
    });
  }

  private getRandomLocality(city: string): string {
    const localities: Record<string, string[]> = {
      Mumbai: ['Bandra West', 'Powai', 'Lower Parel', 'Worli', 'Andheri West'],
      Delhi: ['Gurgaon', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj'],
      Bangalore: ['Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Indiranagar'],
      Pune: ['Baner', 'Wakad', 'Hinjewadi', 'Kharadi', 'Viman Nagar'],
      Hyderabad: ['HITEC City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Banjara Hills']
    };
    
    const cityLocalities = localities[city] || ['Central Area'];
    return cityLocalities[Math.floor(Math.random() * cityLocalities.length)];
  }

  private generateRandomPreferences(): Record<string, boolean> {
    const preferences = [
      'swimming_pool', 'gym', 'clubhouse', 'power_backup', 'gated_community',
      'wifi_ready', 'pet_friendly', 'rooftop_access', 'vaastu_compliant',
      'smart_home_features', 'dedicated_parking', 'near_metro', 'security_24x7'
    ];
    
    return preferences.reduce((acc, pref) => {
      acc[pref] = Math.random() > 0.4;
      return acc;
    }, {} as Record<string, boolean>);
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

  // Public method to clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Public method to get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const brickMatrixService = new BrickMatrixService();