
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePropertyDataCollector } from '@/hooks/usePropertyDataCollector';
import { Database, Download, Play, RotateCcw, TrendingUp, MapPin, Building, BarChart3 } from 'lucide-react';

export const PropertyDataDashboard = () => {
  const {
    progress,
    collectedProperties,
    startCollection,
    exportData,
    resetCollection
  } = usePropertyDataCollector();

  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleStartCollection = async () => {
    try {
      await startCollection();
      setShowAnalysis(true);
    } catch (error) {
      console.error('Collection failed:', error);
    }
  };

  const statsData = {
    totalProperties: collectedProperties.length,
    uniqueCities: new Set(collectedProperties.map(p => p.city)).size,
    uniqueStates: new Set(collectedProperties.map(p => p.state)).size,
    avgPrice: collectedProperties.length > 0 
      ? Math.round(collectedProperties.reduce((sum, p) => sum + p.price, 0) / collectedProperties.length)
      : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Data Collection Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered property data collection and analysis across India
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartCollection}
            disabled={progress.isCollecting}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {progress.isCollecting ? 'Collecting...' : 'Start Collection'}
          </Button>
          <Button
            onClick={exportData}
            disabled={collectedProperties.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button
            onClick={resetCollection}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      {progress.isCollecting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Collection Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Status: {progress.currentCity}</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="w-full" />
            </div>
            {progress.error && (
              <div className="text-destructive text-sm">
                Error: {progress.error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      {collectedProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                  <p className="text-2xl font-bold">{statsData.totalProperties.toLocaleString()}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cities Covered</p>
                  <p className="text-2xl font-bold">{statsData.uniqueCities}</p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">States</p>
                  <p className="text-2xl font-bold">{statsData.uniqueStates}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                  <p className="text-2xl font-bold">₹{(statsData.avgPrice / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Properties Table */}
      {collectedProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Collected Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {collectedProperties.slice(0, 50).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{property.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {property.location}, {property.city}, {property.state}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(property.price / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-muted-foreground">{property.area} sq ft</p>
                    </div>
                  </div>
                ))}
                {collectedProperties.length > 50 && (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    Showing 50 of {collectedProperties.length} properties. Export data to see all.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyDataDashboard;
