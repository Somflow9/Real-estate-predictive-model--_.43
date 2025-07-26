interface WishlistItem {
  id: string;
  propertyId: string;
  title: string;
  price: number;
  location: string;
  image: string;
  addedDate: string;
  notes?: string;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
}

interface ComparisonItem {
  propertyId: string;
  title: string;
  price: number;
  area: number;
  location: string;
  builder: string;
  addedDate: string;
}

export class WishlistService {
  private wishlistKey = 'brickmatrix_wishlist';
  private comparisonKey = 'brickmatrix_comparison';
  private maxComparisonItems = 4;

  // Wishlist Management
  addToWishlist(property: {
    id: string;
    title: string;
    price: number;
    location: string;
    image?: string;
  }): boolean {
    try {
      const wishlist = this.getWishlist();
      
      // Check if already exists
      if (wishlist.some(item => item.propertyId === property.id)) {
        return false; // Already in wishlist
      }

      const newItem: WishlistItem = {
        id: `wishlist_${Date.now()}`,
        propertyId: property.id,
        title: property.title,
        price: property.price,
        location: property.location,
        image: property.image || '/placeholder.svg',
        addedDate: new Date().toISOString(),
        tags: [],
        priority: 'Medium'
      };

      wishlist.push(newItem);
      localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
      
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  }

  removeFromWishlist(propertyId: string): boolean {
    try {
      const wishlist = this.getWishlist();
      const filteredWishlist = wishlist.filter(item => item.propertyId !== propertyId);
      
      localStorage.setItem(this.wishlistKey, JSON.stringify(filteredWishlist));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  }

  getWishlist(): WishlistItem[] {
    try {
      const stored = localStorage.getItem(this.wishlistKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  }

  isInWishlist(propertyId: string): boolean {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item.propertyId === propertyId);
  }

  updateWishlistItem(propertyId: string, updates: Partial<WishlistItem>): boolean {
    try {
      const wishlist = this.getWishlist();
      const itemIndex = wishlist.findIndex(item => item.propertyId === propertyId);
      
      if (itemIndex === -1) return false;
      
      wishlist[itemIndex] = { ...wishlist[itemIndex], ...updates };
      localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
      
      return true;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      return false;
    }
  }

  // Comparison Management
  addToComparison(property: {
    id: string;
    title: string;
    price: number;
    area: number;
    location: string;
    builder: string;
  }): { success: boolean; message: string } {
    try {
      const comparison = this.getComparison();
      
      // Check if already exists
      if (comparison.some(item => item.propertyId === property.id)) {
        return { success: false, message: 'Property already in comparison' };
      }

      // Check max limit
      if (comparison.length >= this.maxComparisonItems) {
        return { success: false, message: `Maximum ${this.maxComparisonItems} properties can be compared` };
      }

      const newItem: ComparisonItem = {
        propertyId: property.id,
        title: property.title,
        price: property.price,
        area: property.area,
        location: property.location,
        builder: property.builder,
        addedDate: new Date().toISOString()
      };

      comparison.push(newItem);
      localStorage.setItem(this.comparisonKey, JSON.stringify(comparison));
      
      return { success: true, message: 'Added to comparison' };
    } catch (error) {
      console.error('Error adding to comparison:', error);
      return { success: false, message: 'Failed to add to comparison' };
    }
  }

  removeFromComparison(propertyId: string): boolean {
    try {
      const comparison = this.getComparison();
      const filteredComparison = comparison.filter(item => item.propertyId !== propertyId);
      
      localStorage.setItem(this.comparisonKey, JSON.stringify(filteredComparison));
      return true;
    } catch (error) {
      console.error('Error removing from comparison:', error);
      return false;
    }
  }

  getComparison(): ComparisonItem[] {
    try {
      const stored = localStorage.getItem(this.comparisonKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting comparison:', error);
      return [];
    }
  }

  isInComparison(propertyId: string): boolean {
    const comparison = this.getComparison();
    return comparison.some(item => item.propertyId === propertyId);
  }

  clearComparison(): boolean {
    try {
      localStorage.removeItem(this.comparisonKey);
      return true;
    } catch (error) {
      console.error('Error clearing comparison:', error);
      return false;
    }
  }

  getComparisonCount(): number {
    return this.getComparison().length;
  }

  // Analytics
  getWishlistStats() {
    const wishlist = this.getWishlist();
    
    if (wishlist.length === 0) {
      return {
        totalItems: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        topLocations: [],
        recentActivity: []
      };
    }

    const prices = wishlist.map(item => item.price);
    const locations = wishlist.map(item => item.location);
    
    return {
      totalItems: wishlist.length,
      averagePrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      topLocations: this.getTopLocations(locations),
      recentActivity: wishlist
        .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
        .slice(0, 5)
    };
  }

  private getTopLocations(locations: string[]): Array<{ location: string; count: number }> {
    const locationCounts = locations.reduce((acc, location) => {
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

export const wishlistService = new WishlistService();