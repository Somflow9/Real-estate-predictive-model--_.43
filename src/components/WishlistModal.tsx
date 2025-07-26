import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  Heart, 
  Trash2, 
  Search, 
  Filter,
  MapPin,
  Building,
  Star,
  TrendingUp,
  BarChart3,
  Calendar,
  Tag,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Share2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistService } from '@/services/wishlistService';
import { useToast } from '@/hooks/use-toast';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails?: (propertyId: string) => void;
  onCompare?: (propertyId: string) => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onViewDetails,
  onCompare
}) => {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState('all');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadWishlistData();
    }
  }, [isOpen]);

  useEffect(() => {
    filterAndSortItems();
  }, [wishlistItems, searchQuery, sortBy, sortOrder, filterBy]);

  const loadWishlistData = () => {
    const items = wishlistService.getWishlist();
    const statistics = wishlistService.getWishlistStats();
    setWishlistItems(items);
    setStats(statistics);
  };

  const filterAndSortItems = () => {
    let filtered = [...wishlistItems];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => {
        switch (filterBy) {
          case 'high-priority':
            return item.priority === 'High';
          case 'recent':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(item.addedDate) > weekAgo;
          case 'expensive':
            return item.price > 10000000; // Above 1 Cr
          case 'affordable':
            return item.price <= 5000000; // Below 50L
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dateAdded':
          comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
                     (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredItems(filtered);
  };

  const handleRemoveFromWishlist = (propertyId: string) => {
    const success = wishlistService.removeFromWishlist(propertyId);
    if (success) {
      loadWishlistData();
      toast({
        title: "Removed from Wishlist",
        description: "Property has been removed from your wishlist",
      });
    }
  };

  const handleUpdatePriority = (propertyId: string, priority: 'High' | 'Medium' | 'Low') => {
    const success = wishlistService.updateWishlistItem(propertyId, { priority });
    if (success) {
      loadWishlistData();
      toast({
        title: "Priority Updated",
        description: `Property priority set to ${priority}`,
      });
    }
  };

  const handleAddNote = (propertyId: string, notes: string) => {
    const success = wishlistService.updateWishlistItem(propertyId, { notes });
    if (success) {
      loadWishlistData();
      toast({
        title: "Note Added",
        description: "Your note has been saved",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const exportWishlist = () => {
    const csvContent = [
      ['Title', 'Location', 'Price', 'Added Date', 'Priority', 'Notes'],
      ...wishlistItems.map(item => [
        item.title,
        item.location,
        item.price,
        new Date(item.addedDate).toLocaleDateString(),
        item.priority,
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wishlist.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Wishlist Exported",
      description: "Your wishlist has been exported to CSV",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-black border border-purple-600/30 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-purple-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <DialogTitle className="text-2xl font-bold text-white flex items-center space-x-2">
                    <Heart className="h-6 w-6 text-red-400 fill-current" />
                    <span>My Wishlist</span>
                  </DialogTitle>
                  <p className="text-purple-300 mt-1">
                    {wishlistItems.length} saved properties
                  </p>
                </div>
                
                {stats && (
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{formatPrice(stats.averagePrice)}</div>
                      <div className="text-xs text-purple-300">Avg Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.topLocations.length}</div>
                      <div className="text-xs text-purple-300">Locations</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={exportWishlist}
                  variant="outline"
                  size="sm"
                  className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
                  disabled={wishlistItems.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-purple-400 hover:text-white hover:bg-purple-600/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Filters and Controls */}
          <div className="p-6 pb-4 border-b border-purple-600/30 space-y-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <Input
                    placeholder="Search wishlist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-purple-600/50 text-white placeholder:text-purple-400"
                  />
                </div>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48 bg-gray-900/50 border-purple-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-purple-600">
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="high-priority">High Priority</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="expensive">Above ₹1Cr</SelectItem>
                    <SelectItem value="affordable">Below ₹50L</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-gray-900/50 border-purple-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-purple-600">
                    <SelectItem value="dateAdded">Date Added</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant="outline"
                  size="icon"
                  className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>

                <div className="flex items-center space-x-1 bg-gray-900/50 rounded-lg border border-purple-600/30 p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white'}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white'}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {stats && stats.topLocations.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-purple-400 text-sm">Top locations:</span>
                <div className="flex space-x-2">
                  {stats.topLocations.slice(0, 3).map((location: any, index: number) => (
                    <Badge key={index} variant="outline" className="border-purple-600/50 text-purple-300">
                      {location.location} ({location.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center">
                    <Heart className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {wishlistItems.length === 0 ? 'Your Wishlist is Empty' : 'No Properties Match Your Filter'}
                  </h3>
                  <p className="text-purple-400 max-w-md mx-auto">
                    {wishlistItems.length === 0 
                      ? 'Start adding properties to your wishlist to keep track of your favorites'
                      : 'Try adjusting your search or filter criteria'
                    }
                  </p>
                  {wishlistItems.length === 0 && (
                    <Button
                      onClick={onClose}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Browse Properties
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <WishlistItemCard
                        item={item}
                        viewMode={viewMode}
                        onRemove={handleRemoveFromWishlist}
                        onUpdatePriority={handleUpdatePriority}
                        onAddNote={handleAddNote}
                        onViewDetails={onViewDetails}
                        onCompare={onCompare}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Wishlist Item Card Component
const WishlistItemCard: React.FC<{
  item: any;
  viewMode: 'grid' | 'list';
  onRemove: (propertyId: string) => void;
  onUpdatePriority: (propertyId: string, priority: 'High' | 'Medium' | 'Low') => void;
  onAddNote: (propertyId: string, notes: string) => void;
  onViewDetails?: (propertyId: string) => void;
  onCompare?: (propertyId: string) => void;
}> = ({ 
  item, 
  viewMode, 
  onRemove, 
  onUpdatePriority, 
  onAddNote, 
  onViewDetails, 
  onCompare 
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(item.notes || '');

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const handleSaveNote = () => {
    onAddNote(item.propertyId, noteText);
    setShowNoteInput(false);
  };

  return (
    <Card className={`bg-gray-900/50 border border-purple-600/30 hover:border-purple-400/50 transition-all duration-300 group ${
      viewMode === 'list' ? 'flex' : ''
    }`}>
      <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center space-x-4 w-full' : 'space-y-4'}`}>
        {/* Image */}
        <div className={`relative ${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'w-full h-48'}`}>
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${getPriorityColor(item.priority)} text-white text-xs`}>
              {item.priority}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className={`${viewMode === 'list' ? 'flex-1' : 'space-y-3'}`}>
          <div className={viewMode === 'list' ? 'flex items-start justify-between' : 'space-y-2'}>
            <div className={viewMode === 'list' ? 'space-y-1' : 'space-y-2'}>
              <h4 className="font-bold text-purple-200 group-hover:text-white transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center space-x-2 text-purple-300">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{item.location}</span>
              </div>
              <div className="text-xl font-bold text-purple-400">
                {formatPrice(item.price)}
              </div>
              <div className="text-xs text-purple-400">
                Added {new Date(item.addedDate).toLocaleDateString()}
              </div>
            </div>

            {viewMode === 'list' && (
              <div className="flex items-center space-x-2">
                <ActionButtons 
                  item={item}
                  onRemove={onRemove}
                  onViewDetails={onViewDetails}
                  onCompare={onCompare}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          {item.notes && !showNoteInput && (
            <div className="p-2 bg-purple-900/30 rounded text-sm text-purple-300">
              <strong>Note:</strong> {item.notes}
            </div>
          )}

          {showNoteInput && (
            <div className="space-y-2">
              <Input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="bg-gray-800 border-purple-600/50 text-white text-sm"
              />
              <div className="flex space-x-2">
                <Button onClick={handleSaveNote} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Save
                </Button>
                <Button onClick={() => setShowNoteInput(false)} size="sm" variant="outline" className="border-purple-600 text-purple-300">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'space-y-3'}`}>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400 text-xs">Priority:</span>
              <Select value={item.priority} onValueChange={(priority: 'High' | 'Medium' | 'Low') => onUpdatePriority(item.propertyId, priority)}>
                <SelectTrigger className="w-20 h-6 text-xs bg-gray-800 border-purple-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-purple-600">
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setShowNoteInput(!showNoteInput)}
              size="sm"
              variant="outline"
              className="border-purple-600/50 text-purple-300 hover:bg-purple-600 hover:text-white text-xs"
            >
              <Tag className="h-3 w-3 mr-1" />
              {item.notes ? 'Edit Note' : 'Add Note'}
            </Button>

            {viewMode === 'grid' && (
              <ActionButtons 
                item={item}
                onRemove={onRemove}
                onViewDetails={onViewDetails}
                onCompare={onCompare}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Action Buttons Component
const ActionButtons: React.FC<{
  item: any;
  onRemove: (propertyId: string) => void;
  onViewDetails?: (propertyId: string) => void;
  onCompare?: (propertyId: string) => void;
}> = ({ item, onRemove, onViewDetails, onCompare }) => {
  return (
    <div className="flex space-x-2">
      {onViewDetails && (
        <Button
          onClick={() => onViewDetails(item.propertyId)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          View Details
        </Button>
      )}
      
      {onCompare && (
        <Button
          onClick={() => onCompare(item.propertyId)}
          size="sm"
          variant="outline"
          className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
        >
          Compare
        </Button>
      )}
      
      <Button
        onClick={() => onRemove(item.propertyId)}
        size="sm"
        variant="outline"
        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WishlistModal;