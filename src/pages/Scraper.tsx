
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, ExternalLink } from 'lucide-react';

const Scraper = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    website: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    customUrl: ''
  });

  const websites = [
    { value: '99acres', label: '99acres.com', url: 'https://www.99acres.com' },
    { value: 'nobroker', label: 'NoBroker.com', url: 'https://www.nobroker.in' },
    { value: 'magicbricks', label: 'MagicBricks.com', url: 'https://www.magicbricks.com' },
    { value: 'housing', label: 'Housing.com', url: 'https://housing.com' },
    { value: 'custom', label: 'Custom URL', url: '' }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'plot', label: 'Plot' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScrape = async () => {
    if (!formData.website || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please select a website and enter a location.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate scraping process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock scraped data
      const mockData = [
        {
          id: 1,
          title: "3 BHK Apartment in Sector 62, Noida",
          price: "₹85 Lakh",
          area: "1200 sq ft",
          location: formData.location,
          source: formData.website,
          url: "#"
        },
        {
          id: 2,
          title: "2 BHK Villa in Gated Community",
          price: "₹1.2 Crore",
          area: "1800 sq ft",
          location: formData.location,
          source: formData.website,
          url: "#"
        },
        {
          id: 3,
          title: "4 BHK Independent House",
          price: "₹2.5 Crore",
          area: "2500 sq ft",
          location: formData.location,
          source: formData.website,
          url: "#"
        }
      ];

      setScrapedData(mockData);
      toast({
        title: "Scraping Completed",
        description: `Found ${mockData.length} properties from ${formData.website}`,
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "An error occurred while scraping data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    if (scrapedData.length === 0) {
      toast({
        title: "No Data",
        description: "No data to export. Please scrape some properties first.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      ['Title', 'Price', 'Area', 'Location', 'Source'],
      ...scrapedData.map(item => [item.title, item.price, item.area, item.location, item.source])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scraped_properties.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Data exported to CSV file.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Property Scraper</h1>
        <p className="text-muted-foreground">
          Scrape property data from popular real estate websites
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Scraping Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Select onValueChange={(value) => handleInputChange('website', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a website to scrape" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((site) => (
                    <SelectItem key={site.value} value={site.value}>
                      <div className="flex items-center gap-2">
                        <span>{site.label}</span>
                        {site.url && <ExternalLink className="h-3 w-3" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.website === 'custom' && (
              <div>
                <Label htmlFor="customUrl">Custom URL</Label>
                <Input
                  id="customUrl"
                  placeholder="Enter custom website URL"
                  value={formData.customUrl}
                  onChange={(e) => handleInputChange('customUrl', e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Noida, Gurgaon, Mumbai"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPrice">Min Price (Lakhs)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.minPrice}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price (Lakhs)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="e.g., 200"
                  value={formData.maxPrice}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleScrape} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Scraping..." : "Start Scraping"}
              </Button>
              <Button 
                onClick={exportData} 
                variant="outline"
                disabled={scrapedData.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scraped Results ({scrapedData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {scrapedData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data scraped yet.</p>
                <p className="text-sm">Configure your search and start scraping to see results here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {scrapedData.map((property) => (
                  <div key={property.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">{property.title}</h4>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{property.price}</span>
                      <span>{property.area}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{property.location}</span>
                      <span className="capitalize">{property.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {scrapedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{scrapedData.length}</div>
                <div className="text-sm text-muted-foreground">Properties Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {formData.website?.charAt(0).toUpperCase() + formData.website?.slice(1)}
                </div>
                <div className="text-sm text-muted-foreground">Source</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{formData.location}</div>
                <div className="text-sm text-muted-foreground">Location</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">CSV</div>
                <div className="text-sm text-muted-foreground">Export Format</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Scraper;
