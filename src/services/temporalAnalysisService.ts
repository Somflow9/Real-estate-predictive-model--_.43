
interface PriceHistory {
  date: string;
  price: number;
  season: 'Spring' | 'Summer' | 'Monsoon' | 'Winter';
}

interface TemporalAnalysis {
  currentPrice: number;
  priceHistory: PriceHistory[];
  trend: 'Bullish' | 'Bearish' | 'Stable';
  yearlyGrowth: number;
  seasonalPattern: string;
  recommendation: 'Buy' | 'Sell' | 'Wait';
  reasoning: string;
}

export class TemporalAnalysisService {
  generateTemporalAnalysis(location: string, propertyType: string): TemporalAnalysis {
    // Generate realistic price history for the last 3 years
    const currentPrice = this.getCurrentPrice(location, propertyType);
    const priceHistory = this.generatePriceHistory(currentPrice, location);
    
    // Calculate trends
    const yearlyGrowth = this.calculateYearlyGrowth(priceHistory);
    const trend = this.determineTrend(yearlyGrowth);
    const seasonalPattern = this.analyzeSeasonalPattern(priceHistory);
    
    // Generate smart recommendation
    const { recommendation, reasoning } = this.generateRecommendation(
      trend, yearlyGrowth, location, propertyType
    );

    return {
      currentPrice,
      priceHistory,
      trend,
      yearlyGrowth,
      seasonalPattern,
      recommendation,
      reasoning
    };
  }

  private getCurrentPrice(location: string, propertyType: string): number {
    const basePrices: Record<string, number> = {
      'Mumbai': 18000,
      'Delhi': 12000,
      'Bangalore': 8500,
      'Pune': 7200,
      'Hyderabad': 6800,
      'Chennai': 7000,
      'Kolkata': 5500,
      'Gurgaon': 11000,
      'Ahmedabad': 4800,
      'Surat': 3200,
      'Jaipur': 4200,
      'Lucknow': 3500
    };

    const basePrice = basePrices[location] || 4000;
    const typeMultiplier = propertyType === 'Villa' ? 1.5 : propertyType === 'Studio' ? 0.7 : 1;
    
    return Math.floor(basePrice * typeMultiplier);
  }

  private generatePriceHistory(currentPrice: number, location: string): PriceHistory[] {
    const history: PriceHistory[] = [];
    const seasons = ['Spring', 'Summer', 'Monsoon', 'Winter'] as const;
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 3);

    let price = Math.floor(currentPrice * 0.75); // Start 25% lower

    for (let i = 0; i < 36; i++) { // 36 months = 3 years
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const seasonIndex = Math.floor((date.getMonth() % 12) / 3);
      const season = seasons[seasonIndex];
      
      // Add seasonal variations and gradual growth
      const seasonalMultiplier = this.getSeasonalMultiplier(season, location);
      const growthFactor = 1 + (Math.random() * 0.02) + 0.005; // 0.5-2.5% monthly growth
      
      price = Math.floor(price * growthFactor * seasonalMultiplier);
      
      history.push({
        date: date.toISOString().split('T')[0],
        price,
        season
      });
    }

    return history;
  }

  private getSeasonalMultiplier(season: string, location: string): number {
    // Different cities have different seasonal patterns
    const patterns: Record<string, Record<string, number>> = {
      'Mumbai': { Spring: 1.02, Summer: 0.98, Monsoon: 0.96, Winter: 1.04 },
      'Delhi': { Spring: 1.05, Summer: 0.95, Monsoon: 0.98, Winter: 1.02 },
      'Bangalore': { Spring: 1.03, Summer: 1.01, Monsoon: 0.97, Winter: 0.99 },
      default: { Spring: 1.02, Summer: 0.99, Monsoon: 0.97, Winter: 1.02 }
    };

    return patterns[location]?.[season] || patterns.default[season];
  }

  private calculateYearlyGrowth(history: PriceHistory[]): number {
    if (history.length < 12) return 0;
    
    const currentYearAvg = history.slice(-12).reduce((sum, h) => sum + h.price, 0) / 12;
    const previousYearAvg = history.slice(-24, -12).reduce((sum, h) => sum + h.price, 0) / 12;
    
    return Math.round(((currentYearAvg - previousYearAvg) / previousYearAvg) * 100);
  }

  private determineTrend(yearlyGrowth: number): 'Bullish' | 'Bearish' | 'Stable' {
    if (yearlyGrowth > 8) return 'Bullish';
    if (yearlyGrowth < -2) return 'Bearish';
    return 'Stable';
  }

  private analyzeSeasonalPattern(history: PriceHistory[]): string {
    const seasonalAvg = { Spring: 0, Summer: 0, Monsoon: 0, Winter: 0 };
    const seasonalCount = { Spring: 0, Summer: 0, Monsoon: 0, Winter: 0 };

    history.forEach(h => {
      seasonalAvg[h.season] += h.price;
      seasonalCount[h.season]++;
    });

    Object.keys(seasonalAvg).forEach(season => {
      const s = season as keyof typeof seasonalAvg;
      seasonalAvg[s] = seasonalAvg[s] / seasonalCount[s];
    });

    const bestSeason = Object.entries(seasonalAvg).reduce((a, b) => 
      seasonalAvg[a[0] as keyof typeof seasonalAvg] > seasonalAvg[b[0] as keyof typeof seasonalAvg] ? a : b
    )[0];

    return `Peak prices typically occur in ${bestSeason}`;
  }

  private generateRecommendation(
    trend: 'Bullish' | 'Bearish' | 'Stable',
    yearlyGrowth: number,
    location: string,
    propertyType: string
  ): { recommendation: 'Buy' | 'Sell' | 'Wait'; reasoning: string } {
    if (trend === 'Bullish' && yearlyGrowth > 12) {
      return {
        recommendation: 'Buy',
        reasoning: `Strong upward trend with ${yearlyGrowth}% annual growth. ${location} ${propertyType} market is heating up.`
      };
    }

    if (trend === 'Bearish' && yearlyGrowth < -5) {
      return {
        recommendation: 'Wait',
        reasoning: `Market correction ongoing with ${Math.abs(yearlyGrowth)}% decline. Better entry points ahead.`
      };
    }

    if (trend === 'Stable' && yearlyGrowth > 5 && yearlyGrowth < 10) {
      return {
        recommendation: 'Buy',
        reasoning: `Healthy, sustainable growth at ${yearlyGrowth}%. Good time for long-term investment.`
      };
    }

    return {
      recommendation: 'Wait',
      reasoning: `Market showing mixed signals. Monitor for clearer trends before major decisions.`
    };
  }
}

export const temporalAnalysisService = new TemporalAnalysisService();
