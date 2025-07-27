interface ApiQueryParams {
  city?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  possession_date?: string;
  builder_name?: string;
  bhk?: string;
  amenities?: string[];
  project_status?: string;
}

interface UnifiedListing {
  listing_id: string;
  project_name: string;
  builder: string;
  city: string;
  locality: string;
  price: number;
  bhk: string;
  possession_date: string;
  amenities: string[];
  project_status: string;
  source: "housing" | "squareyards" | "nobroker";
  area?: number;
  price_per_sqft?: number;
  coordinates?: { lat: number; lng: number };
  images?: string[];
  rera_id?: string;
  is_duplicate?: boolean;
  duplicate_reason?: string;
}

interface ApiResponse {
  success: boolean;
  data: UnifiedListing[];
  source: string;
  error?: string;
  total_count?: number;
}

export class RealEstateApiService {
  private readonly API_ENDPOINTS = {
    housing: 'https://api.housing.com/v1/listings',
    squareyards: 'https://api.squareyards.com/v2/properties',
    nobroker: 'https://api.nobroker.in/listings'
  };

  private readonly API_TIMEOUT = 10000; // 10 seconds
  private readonly MAX_RETRIES = 1;
  
  private cache: Map<string, { data: UnifiedListing[]; timestamp: number; ttl: number }> = new Map();
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> = new Map();

  async fetchUnifiedListings(params: ApiQueryParams): Promise<{
    listings: UnifiedListing[];
    metadata: {
      total_count: number;
      sources_used: string[];
      api_responses: Record<string, boolean>;
      cache_hit: boolean;
      processing_time_ms: number;
    };
  }> {
    const startTime = Date.now();
    console.log('🔍 Starting unified real estate data fetch...');
    
    // Check cache first
    const cacheKey = this.generateCacheKey(params);
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('📦 Returning cached unified listings');
      return {
        listings: cached,
        metadata: {
          total_count: cached.length,
          sources_used: ['cache'],
          api_responses: {},
          cache_hit: true,
          processing_time_ms: Date.now() - startTime
        }
      };
    }

    // Fetch from all APIs in parallel
    const apiPromises = [
      this.fetchFromHousing(params),
      this.fetchFromSquareYards(params),
      this.fetchFromNoBroker(params)
    ];

    const apiResults = await Promise.allSettled(apiPromises);
    
    // Process results
    const allListings: UnifiedListing[] = [];
    const sourcesUsed: string[] = [];
    const apiResponses: Record<string, boolean> = {};

    apiResults.forEach((result, index) => {
      const sources = ['housing', 'squareyards', 'nobroker'];
      const source = sources[index];
      
      if (result.status === 'fulfilled' && result.value.success) {
        allListings.push(...result.value.data);
        sourcesUsed.push(source);
        apiResponses[source] = true;
        console.log(`✅ ${source}: ${result.value.data.length} listings fetched`);
      } else {
        apiResponses[source] = false;
        console.warn(`❌ ${source}: Failed to fetch listings`);
      }
    });

    // Deduplicate and process
    const processedListings = this.deduplicateListings(allListings);
    
    // Cache results
    this.setCachedData(cacheKey, processedListings, 900000); // 15 minutes TTL

    const processingTime = Date.now() - startTime;
    console.log(`✨ Unified fetch complete: ${processedListings.length} listings in ${processingTime}ms`);

    return {
      listings: processedListings,
      metadata: {
        total_count: processedListings.length,
        sources_used: sourcesUsed,
        api_responses: apiResponses,
        cache_hit: false,
        processing_time_ms: processingTime
      }
    };
  }

  private async fetchFromHousing(params: ApiQueryParams): Promise<ApiResponse> {
    console.log('🏠 Fetching from Housing.com...');
    
    try {
      if (!this.checkRateLimit('housing')) {
        throw new Error('Rate limit exceeded for Housing.com API');
      }

      const queryParams = this.buildHousingQuery(params);
      const response = await this.makeApiCall(
        `${this.API_ENDPOINTS.housing}?${queryParams}`,
        {
          'Authorization': `Bearer ${process.env.HOUSING_API_KEY || 'demo_key'}`,
          'Content-Type': 'application/json',
          'User-Agent': 'BrickMatrix-RecommendationCenter/1.0'
        }
      );

      if (!response.ok) {
        throw new Error(`Housing.com API error: ${response.status}`);
      }

      const data = await response.json();
      const unifiedListings = this.transformHousingData(data);

      return {
        success: true,
        data: unifiedListings,
        source: 'housing',
        total_count: unifiedListings.length
      };

    } catch (error) {
      console.error('Housing.com API error:', error);
      return {
        success: false,
        data: [],
        source: 'housing',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async fetchFromSquareYards(params: ApiQueryParams): Promise<ApiResponse> {
    console.log('🏢 Fetching from SquareYards...');
    
    try {
      if (!this.checkRateLimit('squareyards')) {
        throw new Error('Rate limit exceeded for SquareYards API');
      }

      const queryParams = this.buildSquareYardsQuery(params);
      const response = await this.makeApiCall(
        `${this.API_ENDPOINTS.squareyards}?${queryParams}`,
        {
          'Authorization': `Bearer ${process.env.SQUAREYARDS_API_KEY || 'demo_key'}`,
          'Content-Type': 'application/json',
          'X-API-Version': '2.0'
        }
      );

      if (!response.ok) {
        throw new Error(`SquareYards API error: ${response.status}`);
      }

      const data = await response.json();
      const unifiedListings = this.transformSquareYardsData(data);

      return {
        success: true,
        data: unifiedListings,
        source: 'squareyards',
        total_count: unifiedListings.length
      };

    } catch (error) {
      console.error('SquareYards API error:', error);
      return {
        success: false,
        data: [],
        source: 'squareyards',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async fetchFromNoBroker(params: ApiQueryParams): Promise<ApiResponse> {
    console.log('🏘️ Fetching from NoBroker...');
    
    try {
      if (!this.checkRateLimit('nobroker')) {
        throw new Error('Rate limit exceeded for NoBroker API');
      }

      const queryParams = this.buildNoBrokerQuery(params);
      const response = await this.makeApiCall(
        `${this.API_ENDPOINTS.nobroker}?${queryParams}`,
        {
          'Authorization': `Bearer ${process.env.NOBROKER_API_KEY || 'demo_key'}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      );

      if (!response.ok) {
        throw new Error(`NoBroker API error: ${response.status}`);
      }

      const data = await response.json();
      const unifiedListings = this.transformNoBrokerData(data);

      return {
        success: true,
        data: unifiedListings,
        source: 'nobroker',
        total_count: unifiedListings.length
      };

    } catch (error) {
      console.error('NoBroker API error:', error);
      return {
        success: false,
        data: [],
        source: 'nobroker',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async makeApiCall(url: string, headers: Record<string, string>): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private buildHousingQuery(params: ApiQueryParams): string {
    const queryParams = new URLSearchParams();
    
    if (params.city) queryParams.append('city', params.city);
    if (params.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params.max_price) queryParams.append('max_price', params.max_price.toString());
    if (params.property_type) queryParams.append('property_type', params.property_type);
    if (params.bhk) queryParams.append('bhk', params.bhk);
    if (params.builder_name) queryParams.append('builder', params.builder_name);
    if (params.project_status) queryParams.append('status', params.project_status);
    
    queryParams.append('limit', '50');
    queryParams.append('sort', 'price_asc');
    
    return queryParams.toString();
  }

  private buildSquareYardsQuery(params: ApiQueryParams): string {
    const queryParams = new URLSearchParams();
    
    if (params.city) queryParams.append('location', params.city);
    if (params.min_price) queryParams.append('price_min', params.min_price.toString());
    if (params.max_price) queryParams.append('price_max', params.max_price.toString());
    if (params.property_type) queryParams.append('type', params.property_type);
    if (params.bhk) queryParams.append('bedrooms', params.bhk.replace('BHK', ''));
    if (params.builder_name) queryParams.append('developer', params.builder_name);
    
    queryParams.append('page_size', '50');
    queryParams.append('include_images', 'true');
    
    return queryParams.toString();
  }

  private buildNoBrokerQuery(params: ApiQueryParams): string {
    const queryParams = new URLSearchParams();
    
    if (params.city) queryParams.append('city', params.city);
    if (params.min_price) queryParams.append('minPrice', params.min_price.toString());
    if (params.max_price) queryParams.append('maxPrice', params.max_price.toString());
    if (params.property_type) queryParams.append('propertyType', params.property_type);
    if (params.bhk) queryParams.append('bhk', params.bhk);
    if (params.builder_name) queryParams.append('builderName', params.builder_name);
    
    queryParams.append('limit', '50');
    queryParams.append('verified', 'true');
    
    return queryParams.toString();
  }

  private transformHousingData(data: any): UnifiedListing[] {
    if (!data?.listings || !Array.isArray(data.listings)) {
      return [];
    }

    return data.listings.map((listing: any) => ({
      listing_id: `housing_${listing.id || Date.now()}`,
      project_name: listing.project_name || listing.title || 'Unknown Project',
      builder: listing.builder_name || listing.developer || 'Unknown Builder',
      city: listing.city || 'Unknown City',
      locality: listing.locality || listing.area || 'Unknown Locality',
      price: this.parsePrice(listing.price),
      bhk: this.standardizeBHK(listing.bhk || listing.bedrooms),
      possession_date: listing.possession_date || listing.ready_date || 'TBD',
      amenities: this.parseAmenities(listing.amenities),
      project_status: this.standardizeStatus(listing.status || listing.project_status),
      source: 'housing' as const,
      area: listing.carpet_area || listing.area,
      price_per_sqft: listing.price_per_sqft,
      coordinates: listing.coordinates ? {
        lat: listing.coordinates.latitude,
        lng: listing.coordinates.longitude
      } : undefined,
      images: listing.images || [],
      rera_id: listing.rera_id
    }));
  }

  private transformSquareYardsData(data: any): UnifiedListing[] {
    if (!data?.properties || !Array.isArray(data.properties)) {
      return [];
    }

    return data.properties.map((property: any) => ({
      listing_id: `squareyards_${property.id || Date.now()}`,
      project_name: property.name || property.project_name || 'Unknown Project',
      builder: property.developer || property.builder || 'Unknown Builder',
      city: property.city || property.location?.city || 'Unknown City',
      locality: property.locality || property.location?.area || 'Unknown Locality',
      price: this.parsePrice(property.price || property.total_price),
      bhk: this.standardizeBHK(property.bedrooms || property.bhk),
      possession_date: property.possession_date || property.completion_date || 'TBD',
      amenities: this.parseAmenities(property.amenities || property.features),
      project_status: this.standardizeStatus(property.status || property.project_status),
      source: 'squareyards' as const,
      area: property.carpet_area || property.built_up_area,
      price_per_sqft: property.price_per_sqft,
      coordinates: property.location?.coordinates ? {
        lat: property.location.coordinates.lat,
        lng: property.location.coordinates.lng
      } : undefined,
      images: property.images || property.photos || [],
      rera_id: property.rera_number
    }));
  }

  private transformNoBrokerData(data: any): UnifiedListing[] {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((listing: any) => ({
      listing_id: `nobroker_${listing.id || Date.now()}`,
      project_name: listing.projectName || listing.title || 'Unknown Project',
      builder: listing.builderName || listing.builder || 'Unknown Builder',
      city: listing.city || 'Unknown City',
      locality: listing.locality || listing.area || 'Unknown Locality',
      price: this.parsePrice(listing.price || listing.rent),
      bhk: this.standardizeBHK(listing.bhk || listing.bedroom),
      possession_date: listing.possessionDate || listing.availableFrom || 'TBD',
      amenities: this.parseAmenities(listing.amenities),
      project_status: this.standardizeStatus(listing.propertyStatus || listing.status),
      source: 'nobroker' as const,
      area: listing.carpetArea || listing.builtUpArea,
      price_per_sqft: listing.pricePerSqft,
      coordinates: listing.latitude && listing.longitude ? {
        lat: listing.latitude,
        lng: listing.longitude
      } : undefined,
      images: listing.images || [],
      rera_id: listing.reraId
    }));
  }

  private parsePrice(price: any): number {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove currency symbols and convert to number
      const numericPrice = price.replace(/[₹,\s]/g, '');
      const parsed = parseFloat(numericPrice);
      
      // Handle Lakh/Crore conversions
      if (price.toLowerCase().includes('crore')) {
        return parsed * 10000000;
      } else if (price.toLowerCase().includes('lakh')) {
        return parsed * 100000;
      }
      
      return parsed || 0;
    }
    return 0;
  }

  private standardizeBHK(bhk: any): string {
    if (!bhk) return 'Unknown';
    
    const bhkStr = bhk.toString().toLowerCase();
    if (bhkStr.includes('1')) return '1BHK';
    if (bhkStr.includes('2')) return '2BHK';
    if (bhkStr.includes('3')) return '3BHK';
    if (bhkStr.includes('4')) return '4BHK';
    if (bhkStr.includes('5')) return '5BHK';
    
    return bhk.toString();
  }

  private parseAmenities(amenities: any): string[] {
    if (Array.isArray(amenities)) {
      return amenities.filter(a => typeof a === 'string');
    }
    if (typeof amenities === 'string') {
      return amenities.split(',').map(a => a.trim()).filter(a => a.length > 0);
    }
    return [];
  }

  private standardizeStatus(status: any): string {
    if (!status) return 'Unknown';
    
    const statusStr = status.toString().toLowerCase();
    if (statusStr.includes('ready') || statusStr.includes('completed')) return 'Ready';
    if (statusStr.includes('construction') || statusStr.includes('ongoing')) return 'Under Construction';
    if (statusStr.includes('launch') || statusStr.includes('new')) return 'New Launch';
    if (statusStr.includes('plan') || statusStr.includes('upcoming')) return 'Planning';
    
    return status.toString();
  }

  private deduplicateListings(listings: UnifiedListing[]): UnifiedListing[] {
    const uniqueListings: UnifiedListing[] = [];
    const seenKeys = new Set<string>();

    for (const listing of listings) {
      // Create a unique key for deduplication
      const key = `${listing.project_name.toLowerCase()}_${listing.locality.toLowerCase()}_${listing.builder.toLowerCase()}`;
      
      if (seenKeys.has(key)) {
        // Mark as duplicate but keep it
        listing.is_duplicate = true;
        listing.duplicate_reason = `Duplicate of project in ${listing.locality} by ${listing.builder}`;
      } else {
        seenKeys.add(key);
      }
      
      uniqueListings.push(listing);
    }

    // Sort by price and source priority
    return uniqueListings.sort((a, b) => {
      // Prioritize non-duplicates
      if (a.is_duplicate && !b.is_duplicate) return 1;
      if (!a.is_duplicate && b.is_duplicate) return -1;
      
      // Then by price
      return a.price - b.price;
    });
  }

  private checkRateLimit(source: string): boolean {
    const now = Date.now();
    const tracker = this.rateLimitTracker.get(source);
    
    if (!tracker || now > tracker.resetTime) {
      // Reset or initialize rate limit
      this.rateLimitTracker.set(source, {
        count: 1,
        resetTime: now + 60000 // 1 minute
      });
      return true;
    }
    
    if (tracker.count >= 60) { // 60 requests per minute
      return false;
    }
    
    tracker.count++;
    return true;
  }

  private generateCacheKey(params: ApiQueryParams): string {
    return `unified_listings_${JSON.stringify(params)}`;
  }

  private getCachedData(key: string): UnifiedListing[] | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: UnifiedListing[], ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Public method to get fallback listings when APIs fail
  async getFallbackListings(params: ApiQueryParams): Promise<UnifiedListing[]> {
    console.log('🔄 Generating fallback listings...');
    
    // Generate mock listings that match the unified schema
    const fallbackListings: UnifiedListing[] = [];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];
    const builders = ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group'];
    
    for (let i = 0; i < 20; i++) {
      const city = params.city || cities[Math.floor(Math.random() * cities.length)];
      const builder = builders[Math.floor(Math.random() * builders.length)];
      
      fallbackListings.push({
        listing_id: `fallback_${Date.now()}_${i}`,
        project_name: `${builder.split(' ')[0]} Heights`,
        builder: builder,
        city: city,
        locality: 'Central Area',
        price: Math.floor(Math.random() * 50000000) + 10000000,
        bhk: ['2BHK', '3BHK', '4BHK'][Math.floor(Math.random() * 3)],
        possession_date: 'Dec 2025',
        amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
        project_status: 'Ready',
        source: 'housing' as const,
        area: Math.floor(Math.random() * 1000) + 800,
        price_per_sqft: Math.floor(Math.random() * 5000) + 8000
      });
    }
    
    return fallbackListings;
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

export const realEstateApiService = new RealEstateApiService();