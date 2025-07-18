
export interface IndianCity {
  id: string;
  name: string;
  state: string;
  tier: 1 | 2;
  population: number;
  averagePrice: number;
  growth: number;
}

export interface IndianProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  state: string;
  type: 'apartment' | 'villa' | 'house' | 'plot' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  description: string;
  imageUrl: string;
  isNew: boolean;
  rating: number;
  developer?: string;
}

export const indianCities: IndianCity[] = [
  // Tier 1 Cities
  { id: '1', name: 'Mumbai', state: 'Maharashtra', tier: 1, population: 20411000, averagePrice: 15000, growth: 8.2 },
  { id: '2', name: 'Delhi', state: 'Delhi', tier: 1, population: 32941000, averagePrice: 12000, growth: 9.1 },
  { id: '3', name: 'Bengaluru', state: 'Karnataka', tier: 1, population: 13608000, averagePrice: 8500, growth: 12.5 },
  { id: '4', name: 'Hyderabad', state: 'Telangana', tier: 1, population: 10268000, averagePrice: 7200, growth: 11.8 },
  { id: '5', name: 'Chennai', state: 'Tamil Nadu', tier: 1, population: 11503000, averagePrice: 7800, growth: 7.9 },
  { id: '6', name: 'Kolkata', state: 'West Bengal', tier: 1, population: 15134000, averagePrice: 6500, growth: 6.2 },
  { id: '7', name: 'Pune', state: 'Maharashtra', tier: 1, population: 7764000, averagePrice: 8900, growth: 10.3 },
  { id: '8', name: 'Ahmedabad', state: 'Gujarat', tier: 1, population: 8450000, averagePrice: 5800, growth: 9.7 },

  // Tier 2 Cities
  { id: '9', name: 'Jaipur', state: 'Rajasthan', tier: 2, population: 3971000, averagePrice: 4500, growth: 8.9 },
  { id: '10', name: 'Surat', state: 'Gujarat', tier: 2, population: 7784000, averagePrice: 4200, growth: 11.2 },
  { id: '11', name: 'Lucknow', state: 'Uttar Pradesh', tier: 2, population: 3645000, averagePrice: 3800, growth: 7.4 },
  { id: '12', name: 'Kanpur', state: 'Uttar Pradesh', tier: 2, population: 3765000, averagePrice: 3200, growth: 6.8 },
  { id: '13', name: 'Nagpur', state: 'Maharashtra', tier: 2, population: 3290000, averagePrice: 4100, growth: 8.1 },
  { id: '14', name: 'Indore', state: 'Madhya Pradesh', tier: 2, population: 3276000, averagePrice: 3900, growth: 9.3 },
  { id: '15', name: 'Thane', state: 'Maharashtra', tier: 2, population: 2325000, averagePrice: 12500, growth: 10.8 },
  { id: '16', name: 'Bhopal', state: 'Madhya Pradesh', tier: 2, population: 2371000, averagePrice: 3500, growth: 7.6 },
  { id: '17', name: 'Visakhapatnam', state: 'Andhra Pradesh', tier: 2, population: 2358000, averagePrice: 4800, growth: 8.7 },
  { id: '18', name: 'Pimpri-Chinchwad', state: 'Maharashtra', tier: 2, population: 2109000, averagePrice: 7800, growth: 9.9 },
  { id: '19', name: 'Patna', state: 'Bihar', tier: 2, population: 2049000, averagePrice: 2800, growth: 6.5 },
  { id: '20', name: 'Vadodara', state: 'Gujarat', tier: 2, population: 2065000, averagePrice: 4600, growth: 8.4 },
  { id: '21', name: 'Ghaziabad', state: 'Uttar Pradesh', tier: 2, population: 1729000, averagePrice: 5200, growth: 12.1 },
  { id: '22', name: 'Ludhiana', state: 'Punjab', tier: 2, population: 1613000, averagePrice: 4300, growth: 7.2 },
  { id: '23', name: 'Agra', state: 'Uttar Pradesh', tier: 2, population: 1585000, averagePrice: 3100, growth: 6.9 },
  { id: '24', name: 'Nashik', state: 'Maharashtra', tier: 2, population: 1562000, averagePrice: 4700, growth: 9.8 },
  { id: '25', name: 'Faridabad', state: 'Haryana', tier: 2, population: 1394000, averagePrice: 6800, growth: 11.4 },
  { id: '26', name: 'Meerut', state: 'Uttar Pradesh', tier: 2, population: 1305000, averagePrice: 3600, growth: 7.8 },
  { id: '27', name: 'Rajkot', state: 'Gujarat', tier: 2, population: 1390000, averagePrice: 3900, growth: 8.6 },
  { id: '28', name: 'Kalyan-Dombivali', state: 'Maharashtra', tier: 2, population: 1247000, averagePrice: 9200, growth: 10.2 },
  { id: '29', name: 'Vasai-Virar', state: 'Maharashtra', tier: 2, population: 1222000, averagePrice: 8500, growth: 13.8 },
  { id: '30', name: 'Varanasi', state: 'Uttar Pradesh', tier: 2, population: 1198000, averagePrice: 3300, growth: 6.7 },
  { id: '31', name: 'Srinagar', state: 'Jammu and Kashmir', tier: 2, population: 1180000, averagePrice: 4200, growth: 5.9 },
  { id: '32', name: 'Aurangabad', state: 'Maharashtra', tier: 2, population: 1175000, averagePrice: 4400, growth: 8.3 },
  { id: '33', name: 'Dhanbad', state: 'Jharkhand', tier: 2, population: 1162000, averagePrice: 2900, growth: 6.1 },
  { id: '34', name: 'Amritsar', state: 'Punjab', tier: 2, population: 1132000, averagePrice: 4100, growth: 7.5 },
  { id: '35', name: 'Navi Mumbai', state: 'Maharashtra', tier: 2, population: 1120000, averagePrice: 11500, growth: 14.2 },
  { id: '36', name: 'Allahabad', state: 'Uttar Pradesh', tier: 2, population: 1112000, averagePrice: 3200, growth: 6.8 },
  { id: '37', name: 'Ranchi', state: 'Jharkhand', tier: 2, population: 1073000, averagePrice: 3400, growth: 7.9 },
  { id: '38', name: 'Howrah', state: 'West Bengal', tier: 2, population: 1072000, averagePrice: 5800, growth: 6.4 },
  { id: '39', name: 'Coimbatore', state: 'Tamil Nadu', tier: 2, population: 1061000, averagePrice: 5200, growth: 8.8 },
  { id: '40', name: 'Jabalpur', state: 'Madhya Pradesh', tier: 2, population: 1055000, averagePrice: 3100, growth: 7.1 },
];

export const indianProperties: IndianProperty[] = [
  // Mumbai Properties
  {
    id: 'MUM001',
    title: 'Luxury 3BHK in Bandra West',
    price: 28500000,
    location: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 1200,
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden'],
    description: 'Premium apartment with sea view in prime Bandra location',
    imageUrl: '/placeholder.svg',
    isNew: true,
    rating: 4.8,
    developer: 'Godrej Properties'
  },
  {
    id: 'MUM002',
    title: 'Modern 2BHK in Powai',
    price: 18900000,
    location: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    amenities: ['Clubhouse', 'Swimming Pool', 'Gym', 'Security'],
    description: 'Contemporary living with lake view in IT hub of Mumbai',
    imageUrl: '/placeholder.svg',
    isNew: false,
    rating: 4.6,
    developer: 'Hiranandani Group'
  },

  // Delhi Properties
  {
    id: 'DEL001',
    title: 'Spacious 4BHK in Gurgaon',
    price: 22000000,
    location: 'Sector 54, Gurgaon',
    city: 'Delhi',
    state: 'Delhi',
    type: 'apartment',
    bedrooms: 4,
    bathrooms: 4,
    area: 1800,
    amenities: ['Swimming Pool', 'Gym', 'Club', 'Security', 'Parking', 'Garden'],
    description: 'Premium residential complex with world-class amenities',
    imageUrl: '/placeholder.svg',
    isNew: true,
    rating: 4.7,
    developer: 'DLF Limited'
  },
  {
    id: 'DEL002',
    title: 'Elegant Villa in Vasant Kunj',
    price: 45000000,
    location: 'Vasant Kunj',
    city: 'Delhi',
    state: 'Delhi',
    type: 'villa',
    bedrooms: 5,
    bathrooms: 6,
    area: 3500,
    amenities: ['Private Garden', 'Swimming Pool', 'Servant Quarters', 'Parking'],
    description: 'Independent villa in prestigious South Delhi location',
    imageUrl: '/placeholder.svg',
    isNew: false,
    rating: 4.9,
  },

  // Bangalore Properties
  {
    id: 'BLR001',
    title: 'Tech-friendly 3BHK in Whitefield',
    price: 12500000,
    location: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 1400,
    amenities: ['Swimming Pool', 'Gym', 'Club', 'Security', 'Wi-Fi'],
    description: 'Perfect for IT professionals in tech corridor',
    imageUrl: '/placeholder.svg',
    isNew: true,
    rating: 4.5,
    developer: 'Brigade Group'
  },
  {
    id: 'BLR002',
    title: 'Garden Apartment in Koramangala',
    price: 16800000,
    location: 'Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    amenities: ['Garden View', 'Gym', 'Clubhouse', 'Security'],
    description: 'Prime location apartment in startup hub of Bangalore',
    imageUrl: '/placeholder.svg',
    isNew: false,
    rating: 4.4,
    developer: 'Prestige Group'
  },

  // Continue with more properties for other cities...
  {
    id: 'HYD001',
    title: 'IT Corridor 3BHK in HITEC City',
    price: 9800000,
    location: 'HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 1350,
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
    description: 'Modern apartment in prime IT location',
    imageUrl: '/placeholder.svg',
    isNew: true,
    rating: 4.6,
    developer: 'My Home Group'
  },

  {
    id: 'CHN001',
    title: 'Beachside 2BHK in OMR',
    price: 8900000,
    location: 'Old Mahabalipuram Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    amenities: ['Beach Access', 'Swimming Pool', 'Gym', 'Security'],
    description: 'Coastal living with IT connectivity',
    imageUrl: '/placeholder.svg',
    isNew: false,
    rating: 4.3,
    developer: 'Phoenix Mills'
  },

  {
    id: 'KOL001',
    title: 'Heritage 3BHK in Salt Lake',
    price: 7200000,
    location: 'Salt Lake City',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1250,
    amenities: ['Club', 'Garden', 'Security', 'Parking'],
    description: 'Well-planned residential complex in New Town',
    imageUrl: '/placeholder.svg',
    isNew: false,
    rating: 4.2,
    developer: 'Ambuja Neotia'
  },

  {
    id: 'PUN001',
    title: 'Hill View Villa in Lonavala Road',
    price: 15600000,
    location: 'Lonavala Road',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 4,
    area: 2200,
    amenities: ['Hill View', 'Garden', 'Swimming Pool', 'Security'],
    description: 'Serene villa with scenic mountain views',
    imageUrl: '/placeholder.svg',
    isNew: true,
    rating: 4.7,
    developer: 'Kolte Patil'
  },

  {
    id: 'AHM001',
    title: 'Commercial Space in SG Highway',
    price: 12000000,
    location: 'SG Highway',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 800,
    amenities: ['Parking', 'Security', 'Elevator', 'AC'],
    description: 'Prime commercial space in business district',
    imageUrl: '/placeholder.svg',
    isNew: true,
    rating: 4.5,
    developer: 'Adani Realty'
  }
];

// Helper functions
export const getCitiesByTier = (tier: 1 | 2): IndianCity[] => {
  return indianCities.filter(city => city.tier === tier);
};

export const getPropertiesByCity = (cityName: string): IndianProperty[] => {
  return indianProperties.filter(property => property.city === cityName);
};

export const getPropertiesByState = (stateName: string): IndianProperty[] => {
  return indianProperties.filter(property => property.state === stateName);
};

export const getCitiesByState = (stateName: string): IndianCity[] => {
  return indianCities.filter(city => city.state === stateName);
};
