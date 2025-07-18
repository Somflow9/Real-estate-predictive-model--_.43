
import { useState, useCallback } from 'react';
import { propertyDataCollector, integrateWithScraper, exportCollectedData } from '@/scripts/PropertyDataCollector';
import { type IndianProperty } from '@/data/indianCitiesData';
import { useToast } from '@/hooks/use-toast';

interface CollectionProgress {
  isCollecting: boolean;
  progress: number;
  currentCity: string;
  totalProperties: number;
  error: string | null;
}

export const usePropertyDataCollector = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<CollectionProgress>({
    isCollecting: false,
    progress: 0,
    currentCity: '',
    totalProperties: 0,
    error: null
  });

  const [collectedProperties, setCollectedProperties] = useState<IndianProperty[]>([]);

  const startCollection = useCallback(async () => {
    setProgress({
      isCollecting: true,
      progress: 0,
      currentCity: 'Initializing...',
      totalProperties: 0,
      error: null
    });

    try {
      toast({
        title: "Data Collection Started",
        description: "Starting nationwide property data collection with AI analysis...",
      });

      const result = await integrateWithScraper();
      
      setCollectedProperties(result.properties);
      setProgress({
        isCollecting: false,
        progress: 100,
        currentCity: 'Completed',
        totalProperties: result.properties.length,
        error: null
      });

      toast({
        title: "Collection Completed",
        description: `Successfully collected ${result.properties.length} properties with AI analysis`,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setProgress(prev => ({
        ...prev,
        isCollecting: false,
        error: errorMessage
      }));

      toast({
        title: "Collection Failed",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [toast]);

  const exportData = useCallback(() => {
    try {
      const exportedData = exportCollectedData();
      
      // Create and download CSV file
      const blob = new Blob([exportedData.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `india_property_data_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Property data exported successfully",
      });

      return exportedData;
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export property data",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const resetCollection = useCallback(() => {
    setProgress({
      isCollecting: false,
      progress: 0,
      currentCity: '',
      totalProperties: 0,
      error: null
    });
    setCollectedProperties([]);
  }, []);

  return {
    progress,
    collectedProperties,
    startCollection,
    exportData,
    resetCollection,
    propertyDataCollector
  };
};
