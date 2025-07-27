import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { builderContactService } from '@/services/builderContactService';

export const usePropertyActions = () => {
  const { toast } = useToast();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
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
      // Just open comparison modal
      setIsComparisonModalOpen(true);
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
    // Wishlist functionality removed
  };

  const openComparison = () => {
    setIsComparisonModalOpen(true);
  };

  const isInWishlist = (propertyId: string) => false;
  const isInComparison = (propertyId: string) => false;
  const getWishlistCount = () => 0;
  const getComparisonCount = () => 0;

  const isActionLoading = (action: string, propertyId: string) => {
    return actionLoading[`${action}_${propertyId}`] || false;
  };

  return {
    // Modal states
    isDetailsModalOpen,
    isComparisonModalOpen,
    selectedPropertyId,
    
    // Modal controls
    setIsDetailsModalOpen,
    setIsComparisonModalOpen,
    setSelectedPropertyId,
    
    // Actions
    handleViewDetails,
    handleCompare,
    handleContactBuilder,
    handleShare,
    handleScheduleSiteVisit,
    
    // Utilities
    openComparison,
    isInWishlist,
    isInComparison,
    getComparisonCount,
    isActionLoading,
    
    // Loading states
    actionLoading
  };
};