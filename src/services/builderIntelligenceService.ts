interface BuilderProfile {
  name: string;
  city: string;
  reputation_score: number;
  track_record: {
    total_projects: number;
    completed_projects: number;
    on_time_delivery_rate: number;
    average_delay_months: number;
    quality_rating: number;
    customer_satisfaction: number;
  };
  financial_stability: {
    credit_rating: string;
    financial_strength: 'Excellent' | 'Good' | 'Average' | 'Poor';
    debt_to_equity_ratio: number;
  };
  certifications: {
    rera_registered: boolean;
    iso_certified: boolean;
    green_building_certified: boolean;
  };
  market_presence: {
    active_cities: string[];
    market_share_percentage: number;
    brand_recognition: number;
  };
  recent_performance: {
    last_12_months_sales: number;
    price_appreciation: number;
    customer_complaints: number;
  };
}

export class BuilderIntelligenceService {
  private builderProfiles: Map<string, BuilderProfile> = new Map();
  private tier1Builders = {
    'Mumbai': [
      { name: 'Lodha Group', tier: 'National', reputation: 92 },
      { name: 'Godrej Properties', tier: 'National', reputation: 89 },
      { name: 'Oberoi Realty', tier: 'National', reputation: 94 },
      { name: 'Hiranandani Group', tier: 'Regional', reputation: 87 },
      { name: 'Kalpataru Group', tier: 'Regional', reputation: 85 },
      { name: 'Rustomjee', tier: 'Regional', reputation: 83 }
    ],
    'Delhi': [
      { name: 'DLF Limited', tier: 'National', reputation: 91 },
      { name: 'Godrej Properties', tier: 'National', reputation: 89 },
      { name: 'Tata Housing', tier: 'National', reputation: 88 },
      { name: 'Ansal API', tier: 'Regional', reputation: 78 },
      { name: 'Unitech Limited', tier: 'Regional', reputation: 72 }
    ],
    'Bengaluru': [
      { name: 'Prestige Group', tier: 'National', reputation: 93 },
      { name: 'Brigade Group', tier: 'National', reputation: 90 },
      { name: 'Sobha Limited', tier: 'National', reputation: 92 },
      { name: 'Puravankara', tier: 'Regional', reputation: 86 },
      { name: 'Salarpuria Sattva', tier: 'Regional', reputation: 84 }
    ],
    'Pune': [
      { name: 'Godrej Properties', tier: 'National', reputation: 89 },
      { name: 'Kolte Patil', tier: 'Regional', reputation: 87 },
      { name: 'Gera Developments', tier: 'Regional', reputation: 85 },
      { name: 'Rohan Builders', tier: 'Local', reputation: 82 },
      { name: 'Puranik Builders', tier: 'Local', reputation: 80 }
    ]
  };

  async analyzeBuilder(builderName: string, city: string): Promise<BuilderProfile> {
    const cacheKey = `${builderName}_${city}`;
    
    if (this.builderProfiles.has(cacheKey)) {
      return this.builderProfiles.get(cacheKey)!;
    }

    console.log(`🏗️ Analyzing builder: ${builderName} in ${city}...`);
    
    // Simulate comprehensive builder analysis
    await new Promise(resolve => setTimeout(resolve, 500));

    const cityBuilders = this.tier1Builders[city as keyof typeof this.tier1Builders] || [];
    const builderData = cityBuilders.find(b => b.name === builderName);
    
    const profile: BuilderProfile = {
      name: builderName,
      city: city,
      reputation_score: builderData?.reputation || Math.floor(Math.random() * 30) + 60,
      track_record: {
        total_projects: Math.floor(Math.random() * 50) + (builderData?.tier === 'National' ? 30 : 10),
        completed_projects: Math.floor(Math.random() * 40) + (builderData?.tier === 'National' ? 25 : 8),
        on_time_delivery_rate: Math.floor(Math.random() * 30) + (builderData?.tier === 'National' ? 70 : 60),
        average_delay_months: Math.floor(Math.random() * 8) + 2,
        quality_rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
        customer_satisfaction: Math.floor(Math.random() * 25) + (builderData?.tier === 'National' ? 75 : 65)
      },
      financial_stability: {
        credit_rating: builderData?.tier === 'National' ? 'AAA' : ['AA+', 'AA', 'A+'][Math.floor(Math.random() * 3)],
        financial_strength: builderData?.tier === 'National' ? 'Excellent' : 'Good',
        debt_to_equity_ratio: Math.round((Math.random() * 0.5 + 0.3) * 100) / 100
      },
      certifications: {
        rera_registered: true,
        iso_certified: builderData?.tier === 'National' || Math.random() > 0.3,
        green_building_certified: Math.random() > 0.4
      },
      market_presence: {
        active_cities: builderData?.tier === 'National' ? 
          ['Mumbai', 'Delhi', 'Bengaluru', 'Pune'] : 
          [city],
        market_share_percentage: Math.round((Math.random() * 15 + 5) * 10) / 10,
        brand_recognition: builderData?.reputation || Math.floor(Math.random() * 30) + 60
      },
      recent_performance: {
        last_12_months_sales: Math.floor(Math.random() * 1000) + 500,
        price_appreciation: Math.round((Math.random() * 20 + 5) * 10) / 10,
        customer_complaints: Math.floor(Math.random() * 20) + 2
      }
    };

    this.builderProfiles.set(cacheKey, profile);
    return profile;
  }

  async getBuildersInCity(city: string): Promise<string[]> {
    const cityBuilders = this.tier1Builders[city as keyof typeof this.tier1Builders] || [];
    return cityBuilders.map(b => b.name);
  }

  async getBuilderComparison(builderNames: string[], city: string): Promise<BuilderProfile[]> {
    const profiles = await Promise.all(
      builderNames.map(name => this.analyzeBuilder(name, city))
    );
    
    return profiles.sort((a, b) => b.reputation_score - a.reputation_score);
  }

  async getTopBuildersInCity(city: string, limit: number = 10): Promise<BuilderProfile[]> {
    const cityBuilders = this.tier1Builders[city as keyof typeof this.tier1Builders] || [];
    const builderNames = cityBuilders.slice(0, limit).map(b => b.name);
    
    return this.getBuilderComparison(builderNames, city);
  }

  calculateBuilderTrustScore(profile: BuilderProfile): number {
    const weights = {
      reputation: 0.25,
      onTimeDelivery: 0.20,
      qualityRating: 0.20,
      customerSatisfaction: 0.15,
      financialStability: 0.10,
      certifications: 0.10
    };

    let score = 0;
    score += (profile.reputation_score / 100) * weights.reputation * 10;
    score += (profile.track_record.on_time_delivery_rate / 100) * weights.onTimeDelivery * 10;
    score += (profile.track_record.quality_rating / 5) * weights.qualityRating * 10;
    score += (profile.track_record.customer_satisfaction / 100) * weights.customerSatisfaction * 10;
    
    // Financial stability score
    const financialScore = profile.financial_stability.financial_strength === 'Excellent' ? 10 : 
                          profile.financial_stability.financial_strength === 'Good' ? 8 : 6;
    score += (financialScore / 10) * weights.financialStability * 10;
    
    // Certifications score
    const certScore = (
      (profile.certifications.rera_registered ? 1 : 0) +
      (profile.certifications.iso_certified ? 1 : 0) +
      (profile.certifications.green_building_certified ? 1 : 0)
    ) / 3;
    score += certScore * weights.certifications * 10;

    return Math.round(score * 10) / 10;
  }

  clearCache(): void {
    this.builderProfiles.clear();
  }
}

export const builderIntelligenceService = new BuilderIntelligenceService();