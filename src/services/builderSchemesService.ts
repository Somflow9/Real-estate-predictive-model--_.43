interface BuilderProject {
  id: string;
  name: string;
  builder: string;
  area: string;
  configuration: string[];
  priceRange: {
    min: number;
    max: number;
  };
  phaseStatus: 'Planning' | 'Launch' | 'Under Construction' | 'Nearing Completion' | 'Ready';
  amenities: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance?: number;
}

interface BuilderScheme {
  id: string;
  builderName: string;
  schemeName: string;
  description: string;
  validTill: string;
  benefits: string[];
  applicableProjects: string[];
}

export class BuilderSchemesService {
  private builderProjects: BuilderProject[] = [
    {
      id: 'dlf_001',
      name: 'DLF Garden City',
      builder: 'DLF Limited',
      area: 'Sector 92, Gurgaon',
      configuration: ['2BHK', '3BHK', '4BHK'],
      priceRange: { min: 8500000, max: 15000000 },
      phaseStatus: 'Under Construction',
      amenities: ['Swimming Pool', 'Gym', 'Club House', 'Security'],
      location: {
        lat: 28.4089,
        lng: 77.0507,
        address: 'Sector 92, Gurgaon, Haryana'
      }
    },
    {
      id: 'godrej_001',
      name: 'Godrej Meridien',
      builder: 'Godrej Properties',
      area: 'Sector 106, Gurgaon',
      configuration: ['2BHK', '3BHK'],
      priceRange: { min: 7200000, max: 12000000 },
      phaseStatus: 'Ready',
      amenities: ['Swimming Pool', 'Gym', 'Garden', 'Security', 'Power Backup'],
      location: {
        lat: 28.4211,
        lng: 77.0610,
        address: 'Sector 106, Gurgaon, Haryana'
      }
    },
    {
      id: 'sobha_001',
      name: 'Sobha City',
      builder: 'Sobha Limited',
      area: 'Sector 108, Gurgaon',
      configuration: ['3BHK', '4BHK', '5BHK'],
      priceRange: { min: 12000000, max: 25000000 },
      phaseStatus: 'Launch',
      amenities: ['Swimming Pool', 'Gym', 'Club House', 'Tennis Court', 'Security'],
      location: {
        lat: 28.4156,
        lng: 77.0498,
        address: 'Sector 108, Gurgaon, Haryana'
      }
    }
  ];

  private builderSchemes: BuilderScheme[] = [
    {
      id: 'dlf_scheme_1',
      builderName: 'DLF Limited',
      schemeName: 'Early Bird Offer',
      description: 'Special pricing for early bookings with flexible payment plans',
      validTill: '2024-12-31',
      benefits: [
        '5% discount on base price',
        'Free car parking',
        'Waived registration charges',
        '80:20 payment plan'
      ],
      applicableProjects: ['dlf_001']
    },
    {
      id: 'godrej_scheme_1',
      builderName: 'Godrej Properties',
      schemeName: 'Festive Special',
      description: 'Limited time festive offer with attractive benefits',
      validTill: '2024-11-30',
      benefits: [
        '3% discount on total price',
        'Free modular kitchen',
        'Complimentary club membership',
        'Zero processing fee'
      ],
      applicableProjects: ['godrej_001']
    }
  ];

  async getBuilderProjects(builderName: string): Promise<BuilderProject[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.builderProjects.filter(project => 
      project.builder.toLowerCase().includes(builderName.toLowerCase())
    );
  }

  async getNearbyProjects(lat: number, lng: number, radiusKm: number = 3): Promise<BuilderProject[]> {
    // Simulate API call to Google Maps or similar service
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return this.builderProjects.map(project => {
      // Calculate approximate distance (simplified)
      const distance = this.calculateDistance(lat, lng, project.location.lat, project.location.lng);
      
      return {
        ...project,
        distance: Math.round(distance * 10) / 10
      };
    }).filter(project => (project.distance || 0) <= radiusKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  async getActiveSchemes(builderName?: string): Promise<BuilderScheme[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentDate = new Date();
    let schemes = this.builderSchemes.filter(scheme => 
      new Date(scheme.validTill) > currentDate
    );

    if (builderName) {
      schemes = schemes.filter(scheme => 
        scheme.builderName.toLowerCase().includes(builderName.toLowerCase())
      );
    }

    return schemes;
  }

  async searchNearbyProjectsWithGoogleMaps(address: string): Promise<BuilderProject[]> {
    console.log(`Searching nearby projects for: ${address}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced nearby projects with more realistic data
    const builders = ['DLF Limited', 'Godrej Properties', 'Prestige Group', 'Brigade Group', 'Sobha Limited'];
    const projectTypes = ['Heights', 'Residency', 'Gardens', 'Plaza', 'Towers', 'Enclave'];
    const statuses: Array<'Planning' | 'Launch' | 'Under Construction' | 'Nearing Completion' | 'Ready'> = 
      ['Planning', 'Launch', 'Under Construction', 'Nearing Completion', 'Ready'];
    
    const mockNearbyProjects: BuilderProject[] = [];
    const projectCount = Math.floor(Math.random() * 6) + 4; // 4-10 projects
    
    for (let i = 0; i < projectCount; i++) {
      const builder = builders[Math.floor(Math.random() * builders.length)];
      const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      mockNearbyProjects.push({
        id: `nearby_${Date.now()}_${i}`,
        name: `${builder.split(' ')[0]} ${projectType}`,
        builder: builder,
        area: `Near ${address}`,
        configuration: this.generateConfigurations(),
        priceRange: this.generatePriceRange(),
        phaseStatus: status,
        amenities: this.generateProjectAmenities(),
        location: {
          lat: 28.4089 + (Math.random() - 0.5) * 0.02,
          lng: 77.0507 + (Math.random() - 0.5) * 0.02,
          address: `${Math.floor(Math.random() * 50) + 1} km from ${address}`
        },
        distance: Math.round(Math.random() * 5 * 10) / 10
      });
    }

    return mockNearbyProjects.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  private generateConfigurations(): string[] {
    const allConfigs = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 configurations
    return allConfigs.slice(0, count);
  }

  private generatePriceRange(): { min: number; max: number } {
    const baseMin = Math.floor(Math.random() * 5000000) + 3000000; // 30L to 80L
    const baseMax = baseMin + Math.floor(Math.random() * 10000000) + 2000000; // +20L to +120L
    return { min: baseMin, max: baseMax };
  }

  private generateProjectAmenities(): string[] {
    const amenities = [
      'Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Power Backup',
      'Parking', 'Garden', 'Children Play Area', 'Tennis Court', 'Jogging Track'
    ];
    const count = Math.floor(Math.random() * 6) + 4; // 4-10 amenities
    return amenities.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  getProjectsByBuilder(builderName: string): BuilderProject[] {
    return this.builderProjects.filter(project => 
      project.builder.toLowerCase().includes(builderName.toLowerCase())
    );
  }

  getSchemesByProject(projectId: string): BuilderScheme[] {
    return this.builderSchemes.filter(scheme => 
      scheme.applicableProjects.includes(projectId)
    );
  }
}

export const builderSchemesService = new BuilderSchemesService();