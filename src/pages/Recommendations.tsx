import BrickMatrixRecommendationsRevamped from '@/components/BrickMatrixRecommendationsRevamped';
import PropertyDetailsModal from '@/components/PropertyDetailsModal';
import ComparisonModal from '@/components/ComparisonModal';
import { usePropertyActions } from '@/hooks/usePropertyActions';

const Recommendations = () => {
  const {
    isDetailsModalOpen,
    isComparisonModalOpen,
    selectedPropertyId,
    setIsDetailsModalOpen,
    setIsComparisonModalOpen,
    handleViewDetails,
    handleCompare
  } = usePropertyActions();

  return (
    <>
      <BrickMatrixRecommendationsRevamped />
      
      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        propertyId={selectedPropertyId || ''}
      />
      
      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        onViewDetails={handleViewDetails}
        onCompare={handleCompare}
      />
    </>
  );
};

export default Recommendations;