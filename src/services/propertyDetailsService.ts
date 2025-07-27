interface PropertyDetails {
  id: string;
  basicInfo: {
    title: string;
    price: number;
    area: number;
    bhk: string;
    status: string;
    possession: string;
  };
  location: {
    city: string;
    locality: string;
    address: string;
    coordinates: { lat: number; lng: number };
    nearbyLandmarks: Array<{
      name: string;
      type: string;
      distance: number;
    }>;
  };
  builder: {
    name: string;
    rating: number;
    onTimeDelivery: number;
    totalProjects: number;
    experience: number;
  };
  pricing: {
    pricePerSqft: number;
    totalPrice: number;
    priceBreakdown: {
      basePrice: number;
      gst: number;
      registrationCharges: number;
      otherCharges: number;
    };
    emiCalculation: {
      monthlyEmi: number;
      interestRate: number;
      tenure: number;
      downPayment: number;
    };
  };
  amenities: {
    lifestyle: string[];
    security: string[];
    convenience: string[];
    recreational: string[];
  };
  legal: {
    reraStatus: string;
    reraId: string;
    approvals: string[];
    clearances: string[];
  };
  investment: {
    roi: number;
    rentalYield: number;
    appreciationRate: number;
    investmentGrade: string;
  };
  images: {
    exterior: string[];
    interior: string[];
    amenities: string[];
    floorPlan: string[];
  };
  reviews: {
    overall: number;
    totalReviews: number;
    breakdown: {
      construction: number;
      location: number;
      amenities: number;
      value: number;
    };
    recentReviews: Array<{
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }>;
  };
}

export class PropertyDetailsService {
  private cache: Map<string, { data: PropertyDetails; timestamp: number }> = new Map();
  private cacheTimeout = 15 * 60 * 1000; // 15 minutes

  async getPropertyDetails(propertyId: string): Promise<PropertyDetails> {
    console.log(`Fetching detailed information for property ${propertyId}...`);
    
    // Check cache first
    const cached = this.cache.get(propertyId);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('Returning cached property details');
      return cached.data;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock detailed property data
    const details: PropertyDetails = {
      id: propertyId,
      basicInfo: {
        title: 'Premium 3BHK Apartment in Prime Location',
        price: 18500000,
        area: 1250,
        bhk: '3BHK',
        status: 'Under Construction',
        possession: 'Dec 2025'
      },
      location: {
        city: 'Mumbai',
        locality: 'Bandra West',
        address: 'Plot No. 123, Linking Road, Bandra West, Mumbai - 400050',
        coordinates: { lat: 19.0596, lng: 72.8295 },
        nearbyLandmarks: [
          { name: 'Bandra Station', type: 'Railway', distance: 0.8 },
          { name: 'Linking Road', type: 'Shopping', distance: 0.3 },
          { name: 'Lilavati Hospital', type: 'Hospital', distance: 1.2 },
          { name: 'St. Andrews High School', type: 'School', distance: 0.6 }
        ]
      },
      builder: {
        name: 'Godrej Properties',
        rating: 4.3,
        onTimeDelivery: 87,
        totalProjects: 45,
        experience: 25
      },
      pricing: {
        pricePerSqft: 14800,
        totalPrice: 18500000,
        priceBreakdown: {
          basePrice: 17500000,
          gst: 875000,
          registrationCharges: 100000,
          otherCharges: 25000
        },
        emiCalculation: {
          monthlyEmi: 125000,
          interestRate: 8.75,
          tenure: 20,
          downPayment: 3700000
        }
      },
      amenities: {
        lifestyle: ['Swimming Pool', 'Gym', 'Clubhouse', 'Jogging Track'],
        security: ['24x7 Security', 'CCTV Surveillance', 'Access Control'],
        convenience: ['Power Backup', 'Lift', 'Parking', 'Water Supply'],
        recreational: ['Children Play Area', 'Garden', 'Indoor Games', 'Library']
      },
      legal: {
        reraStatus: 'Approved',
        reraId: 'P51700000271',
        approvals: ['Municipal Corporation', 'Fire Department', 'Pollution Control'],
        clearances: ['Environmental', 'Aviation', 'Coastal Regulation Zone']
      },
      investment: {
        roi: 12.5,
        rentalYield: 3.2,
        appreciationRate: 8.7,
        investmentGrade: 'A+'
      },
      images: {
        exterior: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
        ],
        interior: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop'
        ],
        amenities: [
          'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop'
        ],
        floorPlan: [
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop'
        ]
      },
      reviews: {
        overall: 4.2,
        totalReviews: 156,
        breakdown: {
          construction: 4.3,
          location: 4.5,
          amenities: 4.0,
          value: 4.1
        },
        recentReviews: [
          {
            rating: 5,
            comment: 'Excellent location and quality construction. Very satisfied with the purchase.',
            date: '2024-01-15',
            verified: true
          },
          {
            rating: 4,
            comment: 'Good amenities and connectivity. Builder is reliable.',
            date: '2024-01-10',
            verified: true
          },
          {
            rating: 4,
            comment: 'Value for money property in prime location.',
            date: '2024-01-05',
            verified: false
          }
        ]
      }
    };

    // Cache the result
    this.cache.set(propertyId, { data: details, timestamp: Date.now() });

    return details;
  }

  async getPropertyComparison(propertyIds: string[]): Promise<PropertyDetails[]> {
    console.log(`Fetching comparison data for ${propertyIds.length} properties...`);
    
    const comparisons = await Promise.all(
      propertyIds.map(id => this.getPropertyDetails(id))
    );

    return comparisons;
  }

  async getPropertyHistory(propertyId: string): Promise<{
    priceHistory: Array<{ date: string; price: number }>;
    statusHistory: Array<{ date: string; status: string; description: string }>;
  }> {
    console.log(`Fetching property history for ${propertyId}...`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      priceHistory: [
        { date: '2024-01-01', price: 17500000 },
        { date: '2024-03-01', price: 18000000 },
        { date: '2024-06-01', price: 18500000 }
      ],
      statusHistory: [
        { date: '2023-06-01', status: 'Launch', description: 'Project launched with early bird offers' },
        { date: '2023-09-01', status: 'Foundation', description: 'Foundation work completed' },
        { date: '2024-01-01', status: 'Structure', description: 'Structural work in progress' }
      ]
    };
  }

  async getNeighborhoodAnalysis(locality: string, city: string): Promise<{
    walkabilityScore: number;
    safetyRating: number;
    connectivityScore: number;
    amenitiesScore: number;
    futureGrowth: number;
    demographics: {
      averageAge: number;
      familySize: number;
      incomeLevel: string;
    };
  }> {
    console.log(`Analyzing neighborhood: ${locality}, ${city}...`);
    
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      walkabilityScore: Math.floor(Math.random() * 30) + 70,
      safetyRating: Math.floor(Math.random() * 20) + 80,
      connectivityScore: Math.floor(Math.random() * 25) + 75,
      amenitiesScore: Math.floor(Math.random() * 30) + 70,
      futureGrowth: Math.floor(Math.random() * 25) + 75,
      demographics: {
        averageAge: Math.floor(Math.random() * 10) + 35,
        familySize: Math.round((Math.random() * 2 + 3) * 10) / 10,
        incomeLevel: ['Upper Middle Class', 'High Income', 'Ultra High Income'][Math.floor(Math.random() * 3)]
      }
    };
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

export const propertyDetailsService = new PropertyDetailsService();