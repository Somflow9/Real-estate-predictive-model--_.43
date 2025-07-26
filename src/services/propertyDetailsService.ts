interface PropertyDetails {
  id: string;
  basicInfo: {
    title: string;
    price: number;
    area: number;
    bhk: string;
    propertyType: string;
    status: string;
    possession: string;
    facing: string;
    floor: string;
    totalFloors: number;
    age: string;
    furnishing: string;
  };
  location: {
    address: string;
    locality: string;
    city: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
  };
  pricing: {
    totalPrice: number;
    pricePerSqft: number;
    maintenanceCharges: number;
    parkingCharges: number;
    registrationCharges: number;
    stampDuty: number;
    gst: number;
    totalCost: number;
    emiCalculation: {
      monthlyEmi: number;
      interestRate: number;
      tenure: number;
      totalInterest: number;
    };
    priceHistory: Array<{
      date: string;
      price: number;
      source: string;
    }>;
    marketComparison: {
      localityAverage: number;
      cityAverage: number;
      priceAppreciation: number;
    };
  };
  builder: {
    name: string;
    established: number;
    rating: number;
    completedProjects: number;
    ongoingProjects: number;
    onTimeDelivery: number;
    customerRating: number;
    reraRegistered: boolean;
    awards: string[];
    certifications: string[];
    contactInfo: {
      phone: string;
      email: string;
      website: string;
      address: string;
    };
    projectHistory: Array<{
      name: string;
      location: string;
      year: number;
      status: string;
      rating: number;
    }>;
  };
  legal: {
    reraId: string;
    reraStatus: 'Approved' | 'Pending' | 'Expired';
    approvals: Array<{
      authority: string;
      approvalNumber: string;
      validTill: string;
      status: string;
    }>;
    clearances: {
      environmentalClearance: boolean;
      fireSafety: boolean;
      structuralSafety: boolean;
      occupancyCertificate: boolean;
    };
    litigation: {
      hasLitigation: boolean;
      cases: Array<{
        caseNumber: string;
        court: string;
        status: string;
        description: string;
      }>;
    };
  };
  amenities: {
    basic: string[];
    recreational: string[];
    security: string[];
    convenience: string[];
    green: string[];
    premium: string[];
    nearby: Array<{
      name: string;
      type: string;
      distance: number;
      rating?: number;
    }>;
  };
  infrastructure: {
    connectivity: {
      metro: Array<{
        station: string;
        line: string;
        distance: number;
        walkingTime: number;
      }>;
      bus: Array<{
        stop: string;
        routes: string[];
        distance: number;
      }>;
      railway: Array<{
        station: string;
        distance: number;
        trains: string[];
      }>;
      airport: {
        name: string;
        distance: number;
        travelTime: number;
      };
      highways: Array<{
        name: string;
        distance: number;
        connectivity: string[];
      }>;
    };
    utilities: {
      powerBackup: boolean;
      waterSupply: '24x7' | 'Limited' | 'Tanker';
      sewage: boolean;
      internet: string[];
      gasConnection: boolean;
    };
    social: {
      schools: Array<{
        name: string;
        board: string;
        rating: number;
        distance: number;
        fees: string;
      }>;
      hospitals: Array<{
        name: string;
        type: string;
        specialties: string[];
        distance: number;
        rating: number;
      }>;
      shopping: Array<{
        name: string;
        type: string;
        distance: number;
        brands: string[];
      }>;
      entertainment: Array<{
        name: string;
        type: string;
        distance: number;
        rating: number;
      }>;
    };
  };
  images: {
    exterior: string[];
    interior: string[];
    amenities: string[];
    floorPlan: string[];
    locationMap: string[];
    virtualTour?: string;
    droneView?: string;
  };
  reviews: {
    overall: number;
    count: number;
    breakdown: {
      construction: number;
      location: number;
      amenities: number;
      value: number;
      management: number;
    };
    recent: Array<{
      id: string;
      user: string;
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
      helpful: number;
    }>;
  };
  investment: {
    roi: number;
    rentalYield: number;
    appreciation: number;
    marketTrend: 'Rising' | 'Stable' | 'Declining';
    investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
    riskFactor: 'Low' | 'Medium' | 'High';
    liquidityScore: number;
  };
  sources: Array<{
    platform: string;
    url: string;
    lastUpdated: string;
    verified: boolean;
  }>;
}

export class PropertyDetailsService {
  private cache: Map<string, { data: PropertyDetails; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  async fetchPropertyDetails(propertyId: string): Promise<PropertyDetails> {
    console.log(`🔍 Fetching detailed property information for ${propertyId}...`);
    
    // Check cache first
    const cached = this.cache.get(propertyId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('📦 Returning cached property details');
      return cached.data;
    }

    try {
      // Simulate parallel data fetching from multiple sources
      const [basicData, pricingData, builderData, legalData, infrastructureData] = await Promise.allSettled([
        this.fetchBasicPropertyInfo(propertyId),
        this.fetchPricingDetails(propertyId),
        this.fetchBuilderInformation(propertyId),
        this.fetchLegalClearances(propertyId),
        this.fetchInfrastructureData(propertyId)
      ]);

      const propertyDetails: PropertyDetails = {
        id: propertyId,
        basicInfo: basicData.status === 'fulfilled' ? basicData.value : this.getDefaultBasicInfo(),
        location: this.generateLocationData(),
        pricing: pricingData.status === 'fulfilled' ? pricingData.value : this.getDefaultPricing(),
        builder: builderData.status === 'fulfilled' ? builderData.value : this.getDefaultBuilder(),
        legal: legalData.status === 'fulfilled' ? legalData.value : this.getDefaultLegal(),
        amenities: this.generateAmenities(),
        infrastructure: infrastructureData.status === 'fulfilled' ? infrastructureData.value : this.getDefaultInfrastructure(),
        images: this.generateImages(),
        reviews: this.generateReviews(),
        investment: this.generateInvestmentData(),
        sources: this.generateSources()
      };

      // Cache the result
      this.cache.set(propertyId, {
        data: propertyDetails,
        timestamp: Date.now()
      });

      console.log('✅ Property details fetched and cached successfully');
      return propertyDetails;

    } catch (error) {
      console.error('❌ Error fetching property details:', error);
      throw new Error('Failed to fetch property details');
    }
  }

  private async fetchBasicPropertyInfo(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      title: 'Premium 3BHK Apartment in Prime Location',
      price: 12500000,
      area: 1450,
      bhk: '3BHK',
      propertyType: 'Apartment',
      status: 'Ready to Move',
      possession: 'Immediate',
      facing: 'North-East',
      floor: '12th Floor',
      totalFloors: 25,
      age: 'New Construction',
      furnishing: 'Semi-Furnished'
    };
  }

  private async fetchPricingDetails(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const basePrice = 12500000;
    const area = 1450;
    
    return {
      totalPrice: basePrice,
      pricePerSqft: Math.round(basePrice / area),
      maintenanceCharges: 3500,
      parkingCharges: 150000,
      registrationCharges: Math.round(basePrice * 0.01),
      stampDuty: Math.round(basePrice * 0.05),
      gst: Math.round(basePrice * 0.05),
      totalCost: Math.round(basePrice * 1.12),
      emiCalculation: {
        monthlyEmi: 92000,
        interestRate: 8.75,
        tenure: 20,
        totalInterest: 9580000
      },
      priceHistory: this.generatePriceHistory(basePrice),
      marketComparison: {
        localityAverage: Math.round(basePrice / area * 0.95),
        cityAverage: Math.round(basePrice / area * 0.88),
        priceAppreciation: 12.5
      }
    };
  }

  private async fetchBuilderInformation(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const builders = [
      {
        name: 'DLF Limited',
        established: 1946,
        rating: 4.2,
        completedProjects: 250,
        ongoingProjects: 45,
        onTimeDelivery: 87,
        customerRating: 4.1
      },
      {
        name: 'Godrej Properties',
        established: 1990,
        rating: 4.5,
        completedProjects: 180,
        ongoingProjects: 32,
        onTimeDelivery: 92,
        customerRating: 4.3
      },
      {
        name: 'Prestige Group',
        established: 1986,
        rating: 4.3,
        completedProjects: 200,
        ongoingProjects: 38,
        onTimeDelivery: 89,
        customerRating: 4.2
      }
    ];

    const builder = builders[Math.floor(Math.random() * builders.length)];
    
    return {
      ...builder,
      reraRegistered: true,
      awards: ['Best Developer Award 2023', 'Quality Excellence Award', 'Customer Choice Award'],
      certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001:2007'],
      contactInfo: {
        phone: '+91-11-4266-1234',
        email: 'sales@builder.com',
        website: 'www.builder.com',
        address: 'Corporate Office, Sector 54, Gurgaon'
      },
      projectHistory: this.generateProjectHistory(builder.name)
    };
  }

  private async fetchLegalClearances(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      reraId: `HR${Math.floor(Math.random() * 90000) + 10000}`,
      reraStatus: 'Approved' as const,
      approvals: [
        {
          authority: 'Town Planning Department',
          approvalNumber: `TP/2023/${Math.floor(Math.random() * 1000)}`,
          validTill: '2026-12-31',
          status: 'Valid'
        },
        {
          authority: 'Fire Department',
          approvalNumber: `FD/2023/${Math.floor(Math.random() * 1000)}`,
          validTill: '2025-06-30',
          status: 'Valid'
        }
      ],
      clearances: {
        environmentalClearance: true,
        fireSafety: true,
        structuralSafety: true,
        occupancyCertificate: true
      },
      litigation: {
        hasLitigation: false,
        cases: []
      }
    };
  }

  private async fetchInfrastructureData(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      connectivity: {
        metro: [
          {
            station: 'Sector 54 Chowk',
            line: 'Rapid Metro',
            distance: 0.8,
            walkingTime: 10
          },
          {
            station: 'IFFCO Chowk',
            line: 'Yellow Line',
            distance: 2.1,
            walkingTime: 25
          }
        ],
        bus: [
          {
            stop: 'Sector 54 Bus Stop',
            routes: ['Route 1', 'Route 5', 'Route 12'],
            distance: 0.3
          }
        ],
        railway: [
          {
            station: 'Gurgaon Railway Station',
            distance: 8.5,
            trains: ['Delhi-Jaipur Express', 'Shatabdi Express']
          }
        ],
        airport: {
          name: 'Indira Gandhi International Airport',
          distance: 15.2,
          travelTime: 45
        },
        highways: [
          {
            name: 'NH-8',
            distance: 2.0,
            connectivity: ['Delhi', 'Jaipur', 'Mumbai']
          }
        ]
      },
      utilities: {
        powerBackup: true,
        waterSupply: '24x7' as const,
        sewage: true,
        internet: ['Airtel', 'Jio Fiber', 'BSNL'],
        gasConnection: true
      },
      social: {
        schools: this.generateSchools(),
        hospitals: this.generateHospitals(),
        shopping: this.generateShopping(),
        entertainment: this.generateEntertainment()
      }
    };
  }

  private generatePriceHistory(basePrice: number) {
    const history = [];
    let price = basePrice * 0.8; // Start 20% lower
    
    for (let i = 24; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      price *= (1 + (Math.random() * 0.02 + 0.005)); // 0.5-2.5% monthly growth
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price),
        source: ['99acres', 'MagicBricks', 'Housing.com'][Math.floor(Math.random() * 3)]
      });
    }
    
    return history;
  }

  private generateProjectHistory(builderName: string) {
    const projects = [
      'Heights', 'Residency', 'Gardens', 'Plaza', 'Towers', 'Enclave', 'Vista', 'Grandeur'
    ];
    
    return projects.slice(0, 5).map((suffix, index) => ({
      name: `${builderName.split(' ')[0]} ${suffix}`,
      location: ['Gurgaon', 'Noida', 'Mumbai', 'Bangalore'][Math.floor(Math.random() * 4)],
      year: 2020 + index,
      status: index < 3 ? 'Completed' : 'Ongoing',
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10
    }));
  }

  private generateSchools() {
    return [
      {
        name: 'Delhi Public School',
        board: 'CBSE',
        rating: 4.5,
        distance: 1.2,
        fees: '₹2.5L - ₹3.5L per year'
      },
      {
        name: 'Ryan International School',
        board: 'CBSE',
        rating: 4.2,
        distance: 0.8,
        fees: '₹1.8L - ₹2.8L per year'
      },
      {
        name: 'Kendriya Vidyalaya',
        board: 'CBSE',
        rating: 4.0,
        distance: 2.1,
        fees: '₹15K - ₹25K per year'
      }
    ];
  }

  private generateHospitals() {
    return [
      {
        name: 'Max Hospital',
        type: 'Multi-specialty',
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
        distance: 1.5,
        rating: 4.3
      },
      {
        name: 'Fortis Healthcare',
        type: 'Super-specialty',
        specialties: ['Heart Surgery', 'Cancer Treatment', 'Emergency Care'],
        distance: 2.8,
        rating: 4.4
      },
      {
        name: 'Apollo Clinic',
        type: 'Clinic',
        specialties: ['General Medicine', 'Diagnostics', 'Pharmacy'],
        distance: 0.9,
        rating: 4.1
      }
    ];
  }

  private generateShopping() {
    return [
      {
        name: 'Ambience Mall',
        type: 'Shopping Mall',
        distance: 2.1,
        brands: ['Zara', 'H&M', 'Nike', 'Adidas', 'Apple Store']
      },
      {
        name: 'Sector 14 Market',
        type: 'Local Market',
        distance: 0.5,
        brands: ['Grocery Stores', 'Medical Shops', 'Restaurants']
      },
      {
        name: 'DLF Mega Mall',
        type: 'Shopping Mall',
        distance: 3.2,
        brands: ['Lifestyle', 'Pantaloons', 'Big Bazaar', 'PVR Cinemas']
      }
    ];
  }

  private generateEntertainment() {
    return [
      {
        name: 'PVR Cinemas',
        type: 'Movie Theater',
        distance: 2.1,
        rating: 4.2
      },
      {
        name: 'Kingdom of Dreams',
        type: 'Entertainment Complex',
        distance: 5.5,
        rating: 4.0
      },
      {
        name: 'Leisure Valley Park',
        type: 'Park',
        distance: 1.8,
        rating: 4.3
      }
    ];
  }

  private getDefaultBasicInfo() {
    return {
      title: 'Property Details Loading...',
      price: 0,
      area: 0,
      bhk: 'N/A',
      propertyType: 'Apartment',
      status: 'Unknown',
      possession: 'TBD',
      facing: 'N/A',
      floor: 'N/A',
      totalFloors: 0,
      age: 'N/A',
      furnishing: 'N/A'
    };
  }

  private getDefaultPricing() {
    return {
      totalPrice: 0,
      pricePerSqft: 0,
      maintenanceCharges: 0,
      parkingCharges: 0,
      registrationCharges: 0,
      stampDuty: 0,
      gst: 0,
      totalCost: 0,
      emiCalculation: {
        monthlyEmi: 0,
        interestRate: 8.75,
        tenure: 20,
        totalInterest: 0
      },
      priceHistory: [],
      marketComparison: {
        localityAverage: 0,
        cityAverage: 0,
        priceAppreciation: 0
      }
    };
  }

  private getDefaultBuilder() {
    return {
      name: 'Builder Information Loading...',
      established: 0,
      rating: 0,
      completedProjects: 0,
      ongoingProjects: 0,
      onTimeDelivery: 0,
      customerRating: 0,
      reraRegistered: false,
      awards: [],
      certifications: [],
      contactInfo: {
        phone: '',
        email: '',
        website: '',
        address: ''
      },
      projectHistory: []
    };
  }

  private getDefaultLegal() {
    return {
      reraId: 'Loading...',
      reraStatus: 'Pending' as const,
      approvals: [],
      clearances: {
        environmentalClearance: false,
        fireSafety: false,
        structuralSafety: false,
        occupancyCertificate: false
      },
      litigation: {
        hasLitigation: false,
        cases: []
      }
    };
  }

  private getDefaultInfrastructure() {
    return {
      connectivity: {
        metro: [],
        bus: [],
        railway: [],
        airport: {
          name: 'Loading...',
          distance: 0,
          travelTime: 0
        },
        highways: []
      },
      utilities: {
        powerBackup: false,
        waterSupply: 'Limited' as const,
        sewage: false,
        internet: [],
        gasConnection: false
      },
      social: {
        schools: [],
        hospitals: [],
        shopping: [],
        entertainment: []
      }
    };
  }

  private generateLocationData() {
    return {
      address: 'Tower A, Sector 54, Golf Course Road',
      locality: 'Sector 54',
      city: 'Gurgaon',
      pincode: '122002',
      coordinates: {
        lat: 28.4211 + (Math.random() - 0.5) * 0.01,
        lng: 77.0610 + (Math.random() - 0.5) * 0.01
      }
    };
  }

  private generateAmenities() {
    return {
      basic: ['24x7 Security', 'Power Backup', 'Lift', 'Parking', 'Water Supply'],
      recreational: ['Swimming Pool', 'Gym', 'Clubhouse', 'Children Play Area', 'Jogging Track'],
      security: ['CCTV Surveillance', 'Intercom', 'Fire Safety', 'Emergency Response'],
      convenience: ['Maintenance Staff', 'Housekeeping', 'Concierge', 'Visitor Parking'],
      green: ['Garden', 'Rainwater Harvesting', 'Solar Panels', 'Waste Management'],
      premium: ['Spa', 'Business Center', 'Banquet Hall', 'Library', 'Yoga Deck'],
      nearby: [
        { name: 'Metro Station', type: 'Transport', distance: 0.8, rating: 4.2 },
        { name: 'Shopping Mall', type: 'Shopping', distance: 2.1, rating: 4.0 },
        { name: 'Hospital', type: 'Healthcare', distance: 1.5, rating: 4.3 },
        { name: 'School', type: 'Education', distance: 1.2, rating: 4.5 }
      ]
    };
  }

  private generateImages() {
    return {
      exterior: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600'
      ],
      interior: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600'
      ],
      amenities: [
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600'
      ],
      floorPlan: [
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600'
      ],
      locationMap: [
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600'
      ]
    };
  }

  private generateReviews() {
    return {
      overall: Math.round((Math.random() * 2 + 3) * 10) / 10,
      count: Math.floor(Math.random() * 500) + 50,
      breakdown: {
        construction: Math.round((Math.random() * 2 + 3) * 10) / 10,
        location: Math.round((Math.random() * 2 + 3) * 10) / 10,
        amenities: Math.round((Math.random() * 2 + 3) * 10) / 10,
        value: Math.round((Math.random() * 2 + 3) * 10) / 10,
        management: Math.round((Math.random() * 2 + 3) * 10) / 10
      },
      recent: [
        {
          id: '1',
          user: 'Rajesh K.',
          rating: 4,
          comment: 'Excellent location and good amenities. Construction quality is top-notch.',
          date: '2024-01-15',
          verified: true,
          helpful: 12
        },
        {
          id: '2',
          user: 'Priya S.',
          rating: 5,
          comment: 'Great connectivity to metro and office areas. Highly recommended!',
          date: '2024-01-10',
          verified: true,
          helpful: 8
        }
      ]
    };
  }

  private generateInvestmentData() {
    return {
      roi: Math.round((Math.random() * 10 + 12) * 10) / 10,
      rentalYield: Math.round((Math.random() * 2 + 3) * 10) / 10,
      appreciation: Math.round((Math.random() * 8 + 8) * 10) / 10,
      marketTrend: ['Rising', 'Stable', 'Declining'][Math.floor(Math.random() * 3)] as any,
      investmentGrade: ['A+', 'A', 'B+', 'B'][Math.floor(Math.random() * 4)] as any,
      riskFactor: ['Low', 'Medium'][Math.floor(Math.random() * 2)] as any,
      liquidityScore: Math.round((Math.random() * 30 + 70) * 10) / 10
    };
  }

  private generateSources() {
    return [
      {
        platform: '99acres',
        url: 'https://www.99acres.com/property-details',
        lastUpdated: new Date().toISOString(),
        verified: true
      },
      {
        platform: 'MagicBricks',
        url: 'https://www.magicbricks.com/property-details',
        lastUpdated: new Date().toISOString(),
        verified: true
      }
    ];
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const propertyDetailsService = new PropertyDetailsService();