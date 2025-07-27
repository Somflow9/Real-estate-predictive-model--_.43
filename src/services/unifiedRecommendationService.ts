import { realEstateApiService } from './realEstateApiService';
import { brickMatrixService } from './brickMatrixService';
import { enhancedPropertyService } from './enhancedPropertyService';

interface UnifiedRecommendationFilters {
  city?: string;
  budget?: { min: number; max: number };
  bhk?: string[];
  property_type?: string;
  builder_name?: string;
  possession_date?: string;
  amenities?: string[];
  project_status?: string;
  locality?: string;
  sortBy?: 'price' | 'area' | 'possession_date' | 'smart_score';
  includeApiData?: boolean;
  includeLocalData?: boolean;
}

interface UnifiedProperty {
  id: string;
  title: string;
  city: string;
  locality: string;
  price: number;
  pricePerSqft: number;
  area: number;
  bhk: string;
  builderName: string;
  status: string;
  possessionDate: string;
  amenities: string[];
  source: 'api' | 'local';
  apiSource?: 'housing' | 'squareyards' | 'nobroker';
  brickMatrixScore?: number;
  recommendation?: {
    action: string;
    confidence: number;
    reasoning: string;
  };
  images?: string[];
  coordinates?: { lat: number; lng: number };
  isDuplicate?: boolean;
  duplicateReason?: string;
}

export class UnifiedRecommendationService {
  private cache: Map<string, { data: UnifiedProperty[]; timestamp: number; ttl: number }> = new Map();

  async getUnifiedRecommendations(filters: UnifiedRecommendationFilters): Promise<{
    properties: UnifiedProperty[];
    metadata: {
      total_count: number;
      api_count: number;
      local_count: number;
      sources_used: string[];
      processing_time_ms: number;
      cache_hit: boolean;
    };
  }> {
    const startTime = Date.now();
    console.log('🔮 Starting unified recommendation fetch...');

    // Check cache
    const cacheKey = this.generateCacheKey(filters);
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return {
        properties: cached,
        metadata: {
          total_count: cached.length,
          api_count: cached.filter(p => p.source === 'api').length,
          local_count: cached.filter(p => p.source === 'local').length,
          sources_used: ['cache'],
          processing_time_ms: Date.now() - startTime,
          cache_hit: true
        }
      };
    }

    const allProperties: UnifiedProperty[] = [];
    const sourcesUsed: string[] = [];
    let apiCount = 0;
    let localCount = 0;

    // Fetch from APIs if enabled
    if (filters.includeApiData !== false) {
      try {
        const apiParams = this.convertFiltersToApiParams(filters);
        const apiResult = await realEstateApiService.fetchUnifiedListings(apiParams);
        
        const apiProperties = apiResult.listings.map(listing => this.transformApiToUnified(listing));
        allProperties.push(...apiProperties);
        apiCount = apiProperties.length;
        sourcesUsed.push(...apiResult.metadata.sources_used);
        
        console.log(`📡 API fetch: ${apiCount} properties from ${apiResult.metadata.sources_used.join(', ')}`);
      } catch (error) {
        console.warn('API fetch failed, using fallback:', error);
        // Get fallback data if APIs fail
        const fallbackParams = this.convertFiltersToApiParams(filters);
        const fallbackListings = await realEstateApiService.getFallbackListings(fallbackParams);
        const fallbackProperties = fallbackListings.map(listing => this.transformApiToUnified(listing));
        allProperties.push(...fallbackProperties);
        apiCount = fallbackProperties.length;
        sourcesUsed.push('fallback');
      }
    }

    // Fetch from local/existing services if enabled
    if (filters.includeLocalData !== false) {
      try {
        const localProperties = await this.fetchLocalRecommendations(filters);
        allProperties.push(...localProperties);
        localCount = localProperties.length;
        sourcesUsed.push('local');
        
        console.log(`🏠 Local fetch: ${localCount} properties`);
      } catch (error) {
        console.warn('Local fetch failed:', error);
      }
    }

    // Apply unified filtering and sorting
    const filteredProperties = this.applyUnifiedFilters(allProperties, filters);
    const sortedProperties = this.applySorting(filteredProperties, filters.sortBy || 'smart_score');

    // Apply BrickMatrix scoring to all properties
    const scoredProperties = await this.applyUnifiedScoring(sortedProperties);

    // Cache results
    this.setCachedData(cacheKey, scoredProperties, 900000); // 15 minutes TTL

    const processingTime = Date.now() - startTime;
    console.log(`✨ Unified recommendations complete: ${scoredProperties.length} properties in ${processingTime}ms`);

    return {
      properties: scoredProperties,
      metadata: {
        total_count: scoredProperties.length,
        api_count: apiCount,
        local_count: localCount,
        sources_used: sourcesUsed,
        processing_time_ms: processingTime,
        cache_hit: false
      }
    };
  }

  private async fetchLocalRecommendations(filters: UnifiedRecommendationFilters): Promise<UnifiedProperty[]> {
    // Fetch from existing BrickMatrix service
    const brickMatrixFilters = {
      budget: filters.budget || { min: 1000000, max: 100000000 },
      city: filters.city || 'Mumbai',
      bhk: filters.bhk,
      property_type: filters.property_type,
      builder_rating_min: 3
    };

    try {
      const brickMatrixProperties = await brickMatrixService.fetchBrickMatrixRecommendations(brickMatrixFilters);
      
      return brickMatrixProperties.map(property => ({
        id: property.id,
        title: property.project_details.project_name,
        city: property.location_intelligence.city,
        locality: property.location_intelligence.locality,
        price: property.pricing_offers.total_price_range['3BHK']?.min || 0,
        pricePerSqft: property.pricing_offers.price_per_sqft,
        area: 1200, // Default area
        bhk: property.project_details.bhk_configurations[0] || '3BHK',
        builderName: property.builder_profile.builder_name,
        status: property.project_details.status,
        possessionDate: property.project_details.possession_date,
        amenities: Object.keys(property.buyer_preferences).filter(key => property.buyer_preferences[key]),
        source: 'local' as const,
        brickMatrixScore: property.brickmatrix_scoring.brickmatrix_score,
        recommendation: property.brickmatrix_scoring.ai_recommendation,
        coordinates: property.location_intelligence.coordinates
      }));
    } catch (error) {
      console.warn('BrickMatrix service failed, trying enhanced service:', error);
      
      // Fallback to enhanced property service
      try {
        const enhancedProperties = await enhancedPropertyService.fetchEnhancedDiverseProperties({
          locationProximity: { city: filters.city }
        });
        
        return enhancedProperties.map(property => ({
          id: property.id,
          title: property.title,
          city: property.city,
          locality: property.locality,
          price: property.price,
          pricePerSqft: property.pricePerSqft,
          area: property.area,
          bhk: property.bhk,
          builderName: property.builderName,
          status: property.status,
          possessionDate: property.possessionDate || 'TBD',
          amenities: property.amenities,
          source: 'local' as const,
          coordinates: property.coordinates
        }));
      } catch (enhancedError) {
        console.warn('Enhanced service also failed:', enhancedError);
        return [];
      }
    }
  }

  private transformApiToUnified(listing: any): UnifiedProperty {
    return {
      id: listing.listing_id,
      title: listing.project_name,
      city: listing.city,
      locality: listing.locality,
      price: listing.price,
      pricePerSqft: listing.price_per_sqft || 0,
      area: listing.area || 0,
      bhk: listing.bhk,
      builderName: listing.builder,
      status: listing.project_status,
      possessionDate: listing.possession_date,
      amenities: listing.amenities,
      source: 'api' as const,
      apiSource: listing.source,
      images: listing.images,
      coordinates: listing.coordinates,
      isDuplicate: listing.is_duplicate,
      duplicateReason: listing.duplicate_reason
    };
  }

  private convertFiltersToApiParams(filters: UnifiedRecommendationFilters): any {
    return {
      city: filters.city,
      min_price: filters.budget?.min,
      max_price: filters.budget?.max,
      property_type: filters.property_type,
      builder_name: filters.builder_name,
      bhk: filters.bhk?.[0], // Take first BHK if multiple
      amenities: filters.amenities,
      project_status: filters.project_status,
      possession_date: filters.possession_date
    };
  }

  private applyUnifiedFilters(properties: UnifiedProperty[], filters: UnifiedRecommendationFilters): UnifiedProperty[] {
    return properties.filter(property => {
      // City filter
      if (filters.city && property.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Budget filter
      if (filters.budget) {
        if (property.price < filters.budget.min || property.price > filters.budget.max) {
          return false;
        }
      }

      // BHK filter
      if (filters.bhk && filters.bhk.length > 0) {
        if (!filters.bhk.includes(property.bhk)) {
          return false;
        }
      }

      // Builder filter
      if (filters.builder_name) {
        if (!property.builderName.toLowerCase().includes(filters.builder_name.toLowerCase())) {
          return false;
        }
      }

      // Locality filter
      if (filters.locality) {
        if (!property.locality.toLowerCase().includes(filters.locality.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (filters.project_status) {
        if (property.status.toLowerCase() !== filters.project_status.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }

  private applySorting(properties: UnifiedProperty[], sortBy: string): UnifiedProperty[] {
    const sorted = [...properties];

    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'area':
        return sorted.sort((a, b) => b.area - a.area);
      
      case 'possession_date':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.possessionDate).getTime();
          const dateB = new Date(b.possessionDate).getTime();
          return dateA - dateB;
        });
      
      case 'smart_score':
      default:
        return sorted.sort((a, b) => {
          // Prioritize properties with BrickMatrix scores
          const scoreA = a.brickMatrixScore || 0;
          const scoreB = b.brickMatrixScore || 0;
          
          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }
          
          // Secondary sort by source (API first, then local)
          if (a.source !== b.source) {
            return a.source === 'api' ? -1 : 1;
          }
          
          // Tertiary sort by price
          return a.price - b.price;
        });
    }
  }

  private async applyUnifiedScoring(properties: UnifiedProperty[]): Promise<UnifiedProperty[]> {
    console.log('🧠 Applying unified BrickMatrix scoring...');

    return properties.map(property => {
      // Skip if already has BrickMatrix score
      if (property.brickMatrixScore) {
        return property;
      }

      // Calculate score for API properties
      const locationScore = this.calculateLocationScore(property);
      const builderScore = this.calculateBuilderScore(property);
      const priceScore = this.calculatePriceScore(property);
      const amenityScore = this.calculateAmenityScore(property);

      const brickMatrixScore = Math.round(
        (locationScore * 0.3 + builderScore * 0.3 + priceScore * 0.2 + amenityScore * 0.2) * 10
      ) / 10;

      const recommendation = this.generateRecommendation(brickMatrixScore);

      return {
        ...property,
        brickMatrixScore,
        recommendation
      };
    });
  }

  private calculateLocationScore(property: UnifiedProperty): number {
    let score = 6.0;
    
    // Tier 1 city bonus
    const tier1Cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];
    if (tier1Cities.includes(property.city)) {
      score += 2.0;
    }
    
    // Premium locality bonus
    const premiumLocalities = ['Bandra', 'Gurgaon', 'Whitefield', 'Koramangala', 'HITEC City'];
    if (premiumLocalities.some(loc => property.locality.includes(loc))) {
      score += 1.0;
    }
    
    return Math.min(10, score);
  }

  private calculateBuilderScore(property: UnifiedProperty): number {
    let score = 6.0;
    
    const premiumBuilders = ['DLF', 'Godrej', 'Prestige', 'Brigade', 'Sobha', 'Oberoi', 'Lodha'];
    if (premiumBuilders.some(builder => property.builderName.includes(builder))) {
      score += 2.5;
    }
    
    return Math.min(10, score);
  }

  private calculatePriceScore(property: UnifiedProperty): number {
    // Score based on price per sqft value
    if (property.pricePerSqft > 0 && property.pricePerSqft < 15000) {
      return 8.0; // Good value
    } else if (property.pricePerSqft < 25000) {
      return 6.0; // Average value
    }
    return 4.0; // Expensive
  }

  private calculateAmenityScore(property: UnifiedProperty): number {
    const amenityCount = property.amenities.length;
    return Math.min(10, (amenityCount / 10) * 10);
  }

  private generateRecommendation(score: number) {
    if (score >= 8.5) {
      return {
        action: 'strong_buy',
        confidence: 90,
        reasoning: 'Excellent unified analysis with outstanding metrics'
      };
    } else if (score >= 7.0) {
      return {
        action: 'buy',
        confidence: 75,
        reasoning: 'Good unified recommendation with solid fundamentals'
      };
    } else if (score >= 6.0) {
      return {
        action: 'consider',
        confidence: 60,
        reasoning: 'Average unified metrics, consider other options'
      };
    } else {
      return {
        action: 'wait',
        confidence: 40,
        reasoning: 'Below average unified score, wait for better opportunities'
      };
    }
  }

  private generateCacheKey(filters: UnifiedRecommendationFilters): string {
    return `unified_recommendations_${JSON.stringify(filters)}`;
  }

  private getCachedData(key: string): UnifiedProperty[] | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: UnifiedProperty[], ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Public methods for integration with existing UI
  async searchProperties(query: string, filters?: UnifiedRecommendationFilters): Promise<UnifiedProperty[]> {
    const searchFilters = {
      ...filters,
      includeApiData: true,
      includeLocalData: true
    };

    const result = await this.getUnifiedRecommendations(searchFilters);
    
    // Apply text search
    return result.properties.filter(property =>
      property.title.toLowerCase().includes(query.toLowerCase()) ||
      property.locality.toLowerCase().includes(query.toLowerCase()) ||
      property.builderName.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getPropertyById(id: string): Promise<UnifiedProperty | null> {
    // Try to find in cache first
    for (const cached of this.cache.values()) {
      const property = cached.data.find(p => p.id === id);
      if (property) return property;
    }

    // If not in cache, fetch fresh data
    const result = await this.getUnifiedRecommendations({});
    return result.properties.find(p => p.id === id) || null;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const unifiedRecommendationService = new UnifiedRecommendationService();