
import { Property } from '@/types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    location: 'Gurgaon',
    price: 85,
    area_sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    property_type: 'Apartment',
    builder: 'DLF',
    facing: 'North',
    parking: true,
    metro_nearby: true,
    date_listed: '2024-01-15',
    price_per_sqft: 7083,
    days_since_listed: 25,
    predicted_price: 82,
    recommendation_score: 8.5
  },
  {
    id: '2',
    location: 'Noida',
    price: 65,
    area_sqft: 1000,
    bedrooms: 2,
    bathrooms: 1,
    property_type: 'Apartment',
    builder: 'Supertech',
    facing: 'East',
    parking: true,
    metro_nearby: true,
    date_listed: '2024-01-20',
    price_per_sqft: 6500,
    days_since_listed: 20,
    predicted_price: 67,
    recommendation_score: 7.8
  },
  {
    id: '3',
    location: 'Delhi',
    price: 120,
    area_sqft: 1500,
    bedrooms: 3,
    bathrooms: 2,
    property_type: 'Villa',
    builder: 'Godrej',
    facing: 'South',
    parking: true,
    metro_nearby: false,
    date_listed: '2024-01-10',
    price_per_sqft: 8000,
    days_since_listed: 30,
    predicted_price: 118,
    recommendation_score: 9.2
  },
  {
    id: '4',
    location: 'Bangalore',
    price: 75,
    area_sqft: 1100,
    bedrooms: 2,
    bathrooms: 2,
    property_type: 'Apartment',
    builder: 'Brigade',
    facing: 'West',
    parking: true,
    metro_nearby: true,
    date_listed: '2024-01-25',
    price_per_sqft: 6818,
    days_since_listed: 15,
    predicted_price: 73,
    recommendation_score: 8.1
  },
  {
    id: '5',
    location: 'Mumbai',
    price: 150,
    area_sqft: 900,
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'Studio',
    builder: 'Tata',
    facing: 'North',
    parking: false,
    metro_nearby: true,
    date_listed: '2024-01-12',
    price_per_sqft: 16667,
    days_since_listed: 28,
    predicted_price: 145,
    recommendation_score: 7.5
  },
  {
    id: '6',
    location: 'Gurgaon',
    price: 95,
    area_sqft: 1400,
    bedrooms: 3,
    bathrooms: 2,
    property_type: 'Apartment',
    builder: 'Emaar',
    facing: 'East',
    parking: true,
    metro_nearby: true,
    date_listed: '2024-01-18',
    price_per_sqft: 6786,
    days_since_listed: 22,
    predicted_price: 92,
    recommendation_score: 8.7
  }
];

export const getProperties = (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProperties), 500);
  });
};

export const getFilteredProperties = (filters: Partial<any>): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockProperties];
      
      if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
      }
      
      if (filters.location && filters.location !== 'All') {
        filtered = filtered.filter(p => p.location === filters.location);
      }
      
      if (filters.propertyType && filters.propertyType !== 'All') {
        filtered = filtered.filter(p => p.property_type === filters.propertyType);
      }
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
          p.location.toLowerCase().includes(term) ||
          p.builder.toLowerCase().includes(term) ||
          p.property_type.toLowerCase().includes(term)
        );
      }
      
      resolve(filtered);
    }, 300);
  });
};
