
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property, PropertyFilters } from '@/types/property';

interface PropertyContextType {
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider = ({ children }: PropertyProviderProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({
    maxPrice: 200,
    location: 'All',
    propertyType: 'All',
    minArea: 500,
    maxArea: 3000,
    bedrooms: 0,
    searchTerm: ''
  });

  return (
    <PropertyContext.Provider value={{
      selectedProperty,
      setSelectedProperty,
      filters,
      setFilters
    }}>
      {children}
    </PropertyContext.Provider>
  );
};
