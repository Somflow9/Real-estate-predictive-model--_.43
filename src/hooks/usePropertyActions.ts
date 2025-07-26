import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { wishlistService } from '@/services/wishlistService';
import { builderContactService } from '@/services/builderContactService';

export const usePropertyActions = () => {
  const { toast } = useToast();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const handleViewDetails = (propertyId: string, propertyTitle?: string) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsModalOpen(true);
    
    // Analytics tracking
    console.log(`📊 Analytics: User viewed details for property ${propertyId}`);
  };

  const handleCompare = (propertyId: string, propertyData?: any) => {
    setActionLoading(prev => ({ ...prev, [`compare_${propertyId}`]: true }));
    
    try {
      if (propertyData) {
        const result = wishlistService.addToComparison({
          id: propertyId,
          title: propertyData.title || 'Property',
          price: propertyData.price || 0,
          area: propertyData.area || propertyData.area_sqft || 0,
          location: propertyData.location || propertyData.locality || '',
          builder: propertyData.builder || propertyData.builderName || 'Unknown'
        });

        if (result.success) {
          toast({
            title: "Added to Comparison",
            description: result.message,
          });
          
          // Open comparison modal if this is the first item
          const comparisonCount = wishlistService.getComparisonCount();
          if (comparisonCount === 1) {
            setIsComparisonModalOpen(true);
          }
        } else {
          toast({
            title: "Cannot Add to Comparison",
            description: result.message,
            variant: "destructive"
          });
        }
      } else {
        // Just open comparison modal
        setIsComparisonModalOpen(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property to comparison",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`compare_${propertyId}`]: false }));
    }
  };

  const handleAddToWishlist = (propertyData: {
    id: string;
    title: string;
    price: number;
    location: string;
    image?: string;
  }) => {
    setActionLoading(prev => ({ ...prev, [`wishlist_${propertyData.id}`]: true }));
    
    try {
      const success = wishlistService.addToWishlist(propertyData);
      
      if (success) {
        toast({
          title: "Added to Wishlist",
          description: "Property has been saved to your wishlist",
        });
      } else {
        toast({
          title: "Already in Wishlist",
          description: "This property is already in your wishlist",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property to wishlist",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`wishlist_${propertyData.id}`]: false }));
    }
  };

  const handleRemoveFromWishlist = (propertyId: string) => {
    setActionLoading(prev => ({ ...prev, [`remove_wishlist_${propertyId}`]: true }));
    
    try {
      const success = wishlistService.removeFromWishlist(propertyId);
      
      if (success) {
        toast({
          title: "Removed from Wishlist",
          description: "Property has been removed from your wishlist",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove property from wishlist",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`remove_wishlist_${propertyId}`]: false }));
    }
  };

  const handleContactBuilder = async (propertyData: {
    id: string;
    builderName: string;
    title: string;
  }, contactInfo: {
    name: string;
    email: string;
    phone: string;
    message: string;
    requestType?: 'Site Visit' | 'Price Inquiry' | 'Documentation' | 'General Inquiry';
  }) => {
    setActionLoading(prev => ({ ...prev, [`contact_${propertyData.id}`]: true }));
    
    try {
      const result = await builderContactService.contactBuilder({
        propertyId: propertyData.id,
        builderName: propertyData.builderName,
        userInfo: contactInfo,
        requestType: contactInfo.requestType || 'General Inquiry'
      });

      if (result.success) {
        toast({
          title: "Contact Request Sent",
          description: result.message,
        });
        return { success: true, contactId: result.contactId };
      } else {
        toast({
          title: "Contact Failed",
          description: result.message,
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to contact builder",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setActionLoading(prev => ({ ...prev, [`contact_${propertyData.id}`]: false }));
    }
  };

  const handleShare = (propertyData: {
    id: string;
    title: string;
    price: number;
    location: string;
  }) => {
    const shareData = {
      title: propertyData.title,
      text: `Check out this property: ${propertyData.title} in ${propertyData.location} for ₹${(propertyData.price / 100000).toFixed(1)}L`,
      url: `${window.location.origin}/property/${propertyData.id}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: "Link Copied",
        description: "Property details copied to clipboard",
      });
    }
  };

  const handleScheduleSiteVisit = async (propertyData: {
    id: string;
    builderName: string;
    title: string;
  }, visitDetails: {
    preferredDate: string;
    preferredTime: string;
    contactInfo: {
      name: string;
      email: string;
      phone: string;
    };
  }) => {
    setActionLoading(prev => ({ ...prev, [`visit_${propertyData.id}`]: true }));
    
    try {
      const result = await builderContactService.contactBuilder({
        propertyId: propertyData.id,
        builderName: propertyData.builderName,
        userInfo: {
          ...visitDetails.contactInfo,
          message: `I would like to schedule a site visit for ${propertyData.title} on ${visitDetails.preferredDate} at ${visitDetails.preferredTime}.`
        },
        requestType: 'Site Visit'
      });

      if (result.success && result.contactId) {
        // Schedule callback
        await builderContactService.scheduleCallback(
          result.contactId, 
          `${visitDetails.preferredDate} ${visitDetails.preferredTime}`
        );
        
        toast({
          title: "Site Visit Requested",
          description: "Your site visit request has been sent to the builder",
        });
        return { success: true };
      } else {
        toast({
          title: "Request Failed",
          description: result.message,
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule site visit",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setActionLoading(prev => ({ ...prev, [`visit_${propertyData.id}`]: false }));
    }
  };

  const openWishlist = () => {
    setIsWishlistModalOpen(true);
  };

  const openComparison = () => {
    setIsComparisonModalOpen(true);
  };

  const isInWishlist = (propertyId: string) => {
    return wishlistService.isInWishlist(propertyId);
  };

  const isInComparison = (propertyId: string) => {
    return wishlistService.isInComparison(propertyId);
  };

  const getWishlistCount = () => {
    return wishlistService.getWishlist().length;
  };

  const getComparisonCount = () => {
    return wishlistService.getComparisonCount();
  };

  const isActionLoading = (action: string, propertyId: string) => {
    return actionLoading[`${action}_${propertyId}`] || false;
  };

  return {
    // Modal states
    isDetailsModalOpen,
    isComparisonModalOpen,
    isWishlistModalOpen,
    selectedPropertyId,
    
    // Modal controls
    setIsDetailsModalOpen,
    setIsComparisonModalOpen,
    setIsWishlistModalOpen,
    setSelectedPropertyId,
    
    // Actions
    handleViewDetails,
    handleCompare,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    handleContactBuilder,
    handleShare,
    handleScheduleSiteVisit,
    
    // Utilities
    openWishlist,
    openComparison,
    isInWishlist,
    isInComparison,
    getWishlistCount,
    getComparisonCount,
    isActionLoading,
    
    // Loading states
    actionLoading
  };
};