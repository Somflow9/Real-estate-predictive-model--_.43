import { realEstateDataIngestion } from './realEstateDataIngestion';

interface UserIntent {
  budget: { min: number; max: number };
  preferredLocalities: string[];
  bhkPreference: string[];
  builderPreference: string[];
  possessionTimeline: string;
  investmentHorizon: 'short' | 'medium' | 'long';
  riskTolerance: 'low' | 'medium' | 'high';
}

interface RecommendationScore {
  overall: number;
  builderCredibility: number;
  locationTrend: number;
  priceValue: number;
  userAlignment: number;
  projectPopularity: number;
}

interface EnhancedRecommendation {
  id: string;
  title: string;
  builder_name: string;
  project_name: string;
  city: string;
  locality: string;
  price: number;
  price_per_sqft: number;
  carpet_area: number;
  bhk_config: string;
  possession_date: string;
  rera_id?: string;
  verified_listing: boolean;
  source: string;
  images: string[];
  amenities: string[];
  coordinates: { lat: number; lng: number };
  
  // Enhanced scoring
  recommendation_score: RecommendationScore;
  recommendation_reason: string;
  investment_grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  trending_status: 'Hot' | 'Trending' | 'Stable' | 'Cooling';
  
  // User-specific
  user_match_percentage: number;
  price_comparison: 'Below Market' | 'Market Rate' | 'Above Market';
  
  // Builder intelligence
  builder_track_record: {
    on_time_delivery: number;
    quality_rating: number;
    customer_satisfaction: number;
  };
}

export class IntelligentRecommendationEngine {
  private marketTrends: Map<string, number> = new Map();
  private builderIntelligence: Map<string, any> = new Map();

  async generateRecommendations(
    city: string,
    userIntent: UserIntent,
    smartFilters: any
  ): Promise<EnhancedRecommendation[]> {
    console.log(`🧠 Generating intelligent recommendations for ${city}...`);

    // Step 1: Ingest real-time data
    const rawListings = await realEstateDataIngestion.ingestFromAllSources({
      city,
      maxListingsPerSource: 100,
      enableRealTimeSync: true,
      proxyRotation: true
    });

    // Step 2: Apply smart filters (preserve existing logic)
    const filteredListings = this.applySmartFilters(rawListings, smartFilters);

    // Step 3: Calculate intelligent scores
    const scoredRecommendations = await this.calculateIntelligentScores(filteredListings, userIntent, city);

    // Step 4: Rank and personalize
    const rankedRecommendations = this.rankByUserIntent(scoredRecommendations, userIntent);

    // Step 5: Apply final intelligence layer
    const finalRecommendations = await this.applyFinalIntelligence(rankedRecommendations, city);

    console.log(`✅ Generated ${finalRecommendations.length} intelligent recommendations`);
    return finalRecommendations.slice(0, 50); // Top 50 recommendations
  }

  private applySmartFilters(listings: any[], smartFilters: any): any[] {
    let filtered = [...listings];

    // Price range filter
    if (smartFilters.priceFinance?.priceRange) {
      const { min, max } = smartFilters.priceFinance.priceRange;
      filtered = filtered.filter(listing => 
        listing.price >= min && listing.price <= max
      );
    }

    // Location filter
    if (smartFilters.locationProximity?.city) {
      filtered = filtered.filter(listing => 
        listing.city === smartFilters.locationProximity.city
      );
    }

    // BHK filter
    if (smartFilters.propertySpecs?.bhkRange?.length > 0) {
      filtered = filtered.filter(listing =>
        smartFilters.propertySpecs.bhkRange.includes(listing.bhk_config)
      );
    }

    // Builder filter
    if (smartFilters.builderProject?.builderSearch) {
      const searchTerm = smartFilters.builderProject.builderSearch.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.builder_name.toLowerCase().includes(searchTerm)
      );
    }

    // RERA filter
    if (smartFilters.propertySpecs?.reraApproved) {
      filtered = filtered.filter(listing => listing.rera_id);
    }

    // Verified listings filter
    if (smartFilters.builderProject?.verifiedOnly) {
      filtered = filtered.filter(listing => listing.verified_listing);
    }

    return filtered;
  }

  private async calculateIntelligentScores(
    listings: any[],
    userIntent: UserIntent,
    city: string
  ): Promise<EnhancedRecommendation[]> {
    console.log('🎯 Calculating intelligent scores...');

    return Promise.all(listings.map(async (listing) => {
      const builderCredibility = await this.calculateBuilderCredibilityScore(listing.builder_name, city);
      const locationTrend = await this.calculateLocationTrendScore(listing.locality, city);
      const priceValue = this.calculatePriceValueScore(listing, city);
      const userAlignment = this.calculateUserAlignmentScore(listing, userIntent);
      const projectPopularity = this.calculateProjectPopularityScore(listing);

      const overall = Math.round(
        (builderCredibility * 0.25 +
         locationTrend * 0.25 +
         priceValue * 0.20 +
         userAlignment * 0.20 +
         projectPopularity * 0.10) * 10
      ) / 10;

      const recommendation_score: RecommendationScore = {
        overall,
        builderCredibility,
        locationTrend,
        priceValue,
        userAlignment,
        projectPopularity
      };

      return {
        ...listing,
        recommendation_score,
        recommendation_reason: this.generateRecommendationReason(recommendation_score),
        investment_grade: this.calculateInvestmentGrade(overall),
        trending_status: this.calculateTrendingStatus(locationTrend, projectPopularity),
        user_match_percentage: Math.round(userAlignment * 10),
        price_comparison: this.calculatePriceComparison(listing, city),
        builder_track_record: await this.getBuilderTrackRecord(listing.builder_name),
        coordinates: { lat: listing.latitude, lng: listing.longitude }
      } as EnhancedRecommendation;
    }));
  }

  private async calculateBuilderCredibilityScore(builderName: string, city: string): number {
    const cached = this.builderIntelligence.get(`${builderName}_${city}`);
    if (cached) return cached.score;

    // Simulate builder intelligence analysis
    await new Promise(resolve => setTimeout(resolve, 100));

    const cityBuilders = realEstateDataIngestion.getBuildersByCity(city);
    const isLocalBuilder = cityBuilders.includes(builderName);
    
    let score = isLocalBuilder ? 8.5 : 6.5;
    score += Math.random() * 1.5; // Add variance
    
    const builderData = {
      score: Math.min(10, score),
      onTimeDelivery: Math.floor(Math.random() * 30) + 70,
      qualityRating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
      customerSatisfaction: Math.floor(Math.random() * 25) + 75
    };

    this.builderIntelligence.set(`${builderName}_${city}`, builderData);
    return builderData.score;
  }

  private async calculateLocationTrendScore(locality: string, city: string): number {
    const trendKey = `${locality}_${city}`;
    const cached = this.marketTrends.get(trendKey);
    if (cached) return cached;

    // Simulate location trend analysis
    await new Promise(resolve => setTimeout(resolve, 50));

    const premiumLocalities = {
      'Mumbai': ['Bandra West', 'Lower Parel', 'Worli'],
      'Delhi': ['Saket', 'Greater Kailash', 'Vasant Kunj'],
      'Bengaluru': ['Koramangala', 'Indiranagar', 'Whitefield'],
      'Pune': ['Baner', 'Hinjewadi', 'Kharadi']
    };

    const cityPremium = premiumLocalities[city as keyof typeof premiumLocalities] || [];
    const isPremium = cityPremium.includes(locality);
    
    let score = isPremium ? 8.5 : 7.0;
    score += Math.random() * 1.5;
    
    const finalScore = Math.min(10, score);
    this.marketTrends.set(trendKey, finalScore);
    return finalScore;
  }

  private calculatePriceValueScore(listing: any, city: string): number {
    // Compare with market average for the city
    const marketAverage = this.getMarketAveragePrice(city, listing.bhk_config);
    const deviation = (listing.price_per_sqft - marketAverage) / marketAverage;
    
    if (deviation < -0.15) return 9.5; // Significantly below market
    if (deviation < -0.05) return 8.5; // Below market
    if (deviation < 0.05) return 7.5;  // At market
    if (deviation < 0.15) return 6.0;  // Above market
    return 4.0; // Significantly above market
  }

  private calculateUserAlignmentScore(listing: any, userIntent: UserIntent): number {
    let score = 5.0;

    // Budget alignment
    if (listing.price >= userIntent.budget.min && listing.price <= userIntent.budget.max) {
      score += 2.0;
    } else if (listing.price < userIntent.budget.min) {
      score += 1.0; // Under budget is still good
    }

    // Locality preference
    if (userIntent.preferredLocalities.includes(listing.locality)) {
      score += 1.5;
    }

    // BHK preference
    if (userIntent.bhkPreference.includes(listing.bhk_config)) {
      score += 1.0;
    }

    // Builder preference
    if (userIntent.builderPreference.includes(listing.builder_name)) {
      score += 0.5;
    }

    return Math.min(10, score);
  }

  private calculateProjectPopularityScore(listing: any): number {
    let score = 6.0;

    // Platform rating boost
    if (listing.platform_rating && listing.platform_rating > 4.0) {
      score += 1.5;
    }

    // Verified listing boost
    if (listing.verified_listing) {
      score += 1.0;
    }

    // Recent listing boost
    if (listing.listing_age_days < 7) {
      score += 0.5;
    }

    // RERA boost
    if (listing.rera_id) {
      score += 1.0;
    }

    return Math.min(10, score);
  }

  private rankByUserIntent(recommendations: EnhancedRecommendation[], userIntent: UserIntent): EnhancedRecommendation[] {
    return recommendations.sort((a, b) => {
      // Primary sort by overall score
      if (b.recommendation_score.overall !== a.recommendation_score.overall) {
        return b.recommendation_score.overall - a.recommendation_score.overall;
      }
      
      // Secondary sort by user alignment
      return b.recommendation_score.userAlignment - a.recommendation_score.userAlignment;
    });
  }

  private async applyFinalIntelligence(recommendations: EnhancedRecommendation[], city: string): Promise<EnhancedRecommendation[]> {
    console.log('🎯 Applying final intelligence layer...');

    return recommendations.map(rec => ({
      ...rec,
      title: this.generateIntelligentTitle(rec),
      recommendation_reason: this.enhanceRecommendationReason(rec)
    }));
  }

  private generateIntelligentTitle(rec: EnhancedRecommendation): string {
    const grade = rec.investment_grade;
    const trend = rec.trending_status;
    
    let prefix = '';
    if (grade === 'A+' && trend === 'Hot') prefix = '🔥 Premium ';
    else if (grade === 'A' && trend === 'Trending') prefix = '⭐ Elite ';
    else if (rec.verified_listing) prefix = '✅ Verified ';
    
    return `${prefix}${rec.bhk_config} in ${rec.locality}`;
  }

  private generateRecommendationReason(score: RecommendationScore): string {
    const reasons = [];
    
    if (score.builderCredibility >= 8.5) reasons.push('Excellent builder track record');
    if (score.locationTrend >= 8.0) reasons.push('High-growth locality');
    if (score.priceValue >= 8.0) reasons.push('Great value for money');
    if (score.userAlignment >= 8.0) reasons.push('Perfect match for your preferences');
    
    return reasons.join(' • ') || 'Good overall fundamentals';
  }

  private enhanceRecommendationReason(rec: EnhancedRecommendation): string {
    const baseReason = rec.recommendation_reason;
    const grade = rec.investment_grade;
    const match = rec.user_match_percentage;
    
    return `${baseReason} • ${grade} investment grade • ${match}% user match`;
  }

  private calculateInvestmentGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C' {
    if (score >= 9.0) return 'A+';
    if (score >= 8.0) return 'A';
    if (score >= 7.0) return 'B+';
    if (score >= 6.0) return 'B';
    return 'C';
  }

  private calculateTrendingStatus(locationScore: number, popularityScore: number): 'Hot' | 'Trending' | 'Stable' | 'Cooling' {
    const combined = (locationScore + popularityScore) / 2;
    if (combined >= 8.5) return 'Hot';
    if (combined >= 7.5) return 'Trending';
    if (combined >= 6.0) return 'Stable';
    return 'Cooling';
  }

  private calculatePriceComparison(listing: any, city: string): 'Below Market' | 'Market Rate' | 'Above Market' {
    const marketAverage = this.getMarketAveragePrice(city, listing.bhk_config);
    const deviation = (listing.price_per_sqft - marketAverage) / marketAverage;
    
    if (deviation < -0.05) return 'Below Market';
    if (deviation > 0.05) return 'Above Market';
    return 'Market Rate';
  }

  private async getBuilderTrackRecord(builderName: string): Promise<{
    on_time_delivery: number;
    quality_rating: number;
    customer_satisfaction: number;
  }> {
    // Simulate builder track record analysis
    return {
      on_time_delivery: Math.floor(Math.random() * 30) + 70,
      quality_rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
      customer_satisfaction: Math.floor(Math.random() * 25) + 75
    };
  }

  private getMarketAveragePrice(city: string, bhk: string): number {
    const averages: Record<string, Record<string, number>> = {
      'Mumbai': { '1BHK': 16000, '2BHK': 18000, '3BHK': 20000, '4BHK': 22000 },
      'Delhi': { '1BHK': 12000, '2BHK': 14000, '3BHK': 16000, '4BHK': 18000 },
      'Bengaluru': { '1BHK': 8000, '2BHK': 9500, '3BHK': 11000, '4BHK': 13000 },
      'Pune': { '1BHK': 6500, '2BHK': 7500, '3BHK': 8500, '4BHK': 10000 }
    };
    
    return averages[city]?.[bhk] || 8000;
  }

  // Public methods for categories
  async getTopPicks(city: string, userIntent: UserIntent, smartFilters: any): Promise<EnhancedRecommendation[]> {
    const recommendations = await this.generateRecommendations(city, userIntent, smartFilters);
    return recommendations
      .filter(rec => rec.recommendation_score.overall >= 8.0)
      .slice(0, 10);
  }

  async getVerifiedBuilderListings(city: string, smartFilters: any): Promise<EnhancedRecommendation[]> {
    const recommendations = await this.generateRecommendations(city, this.getDefaultUserIntent(), smartFilters);
    return recommendations
      .filter(rec => rec.verified_listing && rec.recommendation_score.builderCredibility >= 8.0)
      .slice(0, 15);
  }

  async getTrendingInCity(city: string, smartFilters: any): Promise<EnhancedRecommendation[]> {
    const recommendations = await this.generateRecommendations(city, this.getDefaultUserIntent(), smartFilters);
    return recommendations
      .filter(rec => rec.trending_status === 'Hot' || rec.trending_status === 'Trending')
      .slice(0, 12);
  }

  private getDefaultUserIntent(): UserIntent {
    return {
      budget: { min: 5000000, max: 50000000 },
      preferredLocalities: [],
      bhkPreference: ['2BHK', '3BHK'],
      builderPreference: [],
      possessionTimeline: 'Any',
      investmentHorizon: 'medium',
      riskTolerance: 'medium'
    };
  }

  clearCache(): void {
    this.marketTrends.clear();
    this.builderIntelligence.clear();
  }
}

export const intelligentRecommendationEngine = new IntelligentRecommendationEngine();