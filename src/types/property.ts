export interface Property {
  id: string;
  location: string;
  price: number;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  builder: string;
  facing: string;
  parking: boolean;
  metro_nearby: boolean;
  date_listed: string;
  price_per_sqft: number;
  days_since_listed: number;
  predicted_price?: number;
  recommendation_score?: number;
  source?: string;
}

export interface PropertyFilters {
  maxPrice: number;
  location: string;
  propertyType: string;
  minArea: number;
  maxArea: number;
  bedrooms: number;
  searchTerm: string;
}
