interface CityData {
  name: string;
  tier: 1 | 2 | 3;
  state: string;
  preferredPropertyTypes: string[];
  averagePriceRange: {
    min: number;
    max: number;
  };
  marketCharacteristics: string[];
}

export class TierCityService {
  private cityDatabase: CityData[] = [
    // Tier 1 Cities
    {
      name: 'Mumbai',
      tier: 1,
      state: 'Maharashtra',
      preferredPropertyTypes: ['Apartment', 'Studio', 'Penthouse'],
      averagePriceRange: { min: 15000, max: 25000 },
      marketCharacteristics: ['High Density', 'Premium Market', 'Space Constraint']
    },
    {
      name: 'Bangalore',
      tier: 1,
      state: 'Karnataka',
      preferredPropertyTypes: ['Apartment', 'Villa', 'Gated Community'],
      averagePriceRange: { min: 8000, max: 15000 },
      marketCharacteristics: ['IT Hub', 'Garden City', 'Cosmopolitan']
    },
    {
      name: 'Delhi',
      tier: 1,
      state: 'Delhi',
      preferredPropertyTypes: ['Apartment', 'Builder Floor', 'Independent House'],
      averagePriceRange: { min: 12000, max: 20000 },
      marketCharacteristics: ['Capital City', 'Government Hub', 'Historical']
    },
    {
      name: 'Chennai',
      tier: 1,
      state: 'Tamil Nadu',
      preferredPropertyTypes: ['Apartment', 'Villa', 'Independent House'],
      averagePriceRange: { min: 6000, max: 12000 },
      marketCharacteristics: ['Industrial Hub', 'Port City', 'Cultural Center']
    },

    // Tier 2 Cities
    {
      name: 'Ahmedabad',
      tier: 2,
      state: 'Gujarat',
      preferredPropertyTypes: ['Apartment', 'Row House', 'Bungalow'],
      averagePriceRange: { min: 4000, max: 8000 },
      marketCharacteristics: ['Commercial Hub', 'Textile Industry', 'Growing IT']
    },
    {
      name: 'Lucknow',
      tier: 2,
      state: 'Uttar Pradesh',
      preferredPropertyTypes: ['Apartment', 'Independent House', 'Villa'],
      averagePriceRange: { min: 3000, max: 6000 },
      marketCharacteristics: ['Government Seat', 'Cultural Heritage', 'Emerging IT']
    },
    {
      name: 'Indore',
      tier: 2,
      state: 'Madhya Pradesh',
      preferredPropertyTypes: ['Apartment', 'Independent House', 'Duplex'],
      averagePriceRange: { min: 3500, max: 7000 },
      marketCharacteristics: ['Commercial Center', 'Educational Hub', 'Clean City']
    },
    {
      name: 'Surat',
      tier: 2,
      state: 'Gujarat',
      preferredPropertyTypes: ['Apartment', 'Row House', 'Commercial'],
      averagePriceRange: { min: 3000, max: 6000 },
      marketCharacteristics: ['Diamond Hub', 'Textile Center', 'Business Friendly']
    },

    // Tier 3 Cities
    {
      name: 'Dehradun',
      tier: 3,
      state: 'Uttarakhand',
      preferredPropertyTypes: ['Villa', 'Independent House', 'Plot', 'Farm House'],
      averagePriceRange: { min: 2500, max: 5000 },
      marketCharacteristics: ['Hill Station', 'Educational Hub', 'Retirement Destination']
    },
    {
      name: 'Nashik',
      tier: 3,
      state: 'Maharashtra',
      preferredPropertyTypes: ['Apartment', 'Independent House', 'Plot', 'Villa'],
      averagePriceRange: { min: 2800, max: 5500 },
      marketCharacteristics: ['Wine Capital', 'Religious Tourism', 'Industrial Growth']
    },
    {
      name: 'Kochi',
      tier: 3,
      state: 'Kerala',
      preferredPropertyTypes: ['Apartment', 'Villa', 'Waterfront', 'Plot'],
      averagePriceRange: { min: 3200, max: 6500 },
      marketCharacteristics: ['Port City', 'IT Growth', 'Backwater Tourism']
    },
    {
      name: 'Trichy',
      tier: 3,
      state: 'Tamil Nadu',
      preferredPropertyTypes: ['Independent House', 'Apartment', 'Plot', 'Villa'],
      averagePriceRange: { min: 2200, max: 4500 },
      marketCharacteristics: ['Educational Center', 'Temple City', 'Industrial Base']
    }
  ];

  getCityData(cityName: string): CityData | null {
    return this.cityDatabase.find(city => 
      city.name.toLowerCase() === cityName.toLowerCase()
    ) || null;
  }

  getCitiesByTier(tier: 1 | 2 | 3): CityData[] {
    return this.cityDatabase.filter(city => city.tier === tier);
  }

  getRecommendedPropertyTypes(cityName: string): string[] {
    const cityData = this.getCityData(cityName);
    return cityData?.preferredPropertyTypes || ['Apartment', 'Independent House'];
  }

  getPriceRange(cityName: string): { min: number; max: number } {
    const cityData = this.getCityData(cityName);
    return cityData?.averagePriceRange || { min: 3000, max: 6000 };
  }

  getMarketInsights(cityName: string): string[] {
    const cityData = this.getCityData(cityName);
    return cityData?.marketCharacteristics || ['Emerging Market'];
  }

  adaptSearchLogic(cityName: string, preferences: any) {
    const cityData = this.getCityData(cityName);
    if (!cityData) return preferences;

    const adaptedPreferences = { ...preferences };

    // Tier-specific adaptations
    switch (cityData.tier) {
      case 1:
        // Tier 1: Focus on apartments, higher density
        adaptedPreferences.preferredTypes = ['Apartment', 'Studio', 'Penthouse'];
        adaptedPreferences.prioritizeLocation = true;
        adaptedPreferences.spaceOptimization = true;
        break;

      case 2:
        // Tier 2: Balanced mix, emerging areas
        adaptedPreferences.preferredTypes = ['Apartment', 'Independent House', 'Villa'];
        adaptedPreferences.considerGrowthPotential = true;
        adaptedPreferences.infrastructureFocus = true;
        break;

      case 3:
        // Tier 3: More plots and independent houses
        adaptedPreferences.preferredTypes = ['Independent House', 'Villa', 'Plot', 'Farm House'];
        adaptedPreferences.landInvestmentOptions = true;
        adaptedPreferences.peacefulEnvironment = true;
        break;
    }

    return adaptedPreferences;
  }

  getAllSupportedCities(): CityData[] {
    return this.cityDatabase;
  }

  searchCities(query: string): CityData[] {
    const searchTerm = query.toLowerCase();
    return this.cityDatabase.filter(city =>
      city.name.toLowerCase().includes(searchTerm) ||
      city.state.toLowerCase().includes(searchTerm)
    );
  }
}

export const tierCityService = new TierCityService();