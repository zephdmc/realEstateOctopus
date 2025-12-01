import React, { useEffect } from 'react';
import { WideContainer } from '../../components/layout/PageContainer';
import PropertyGrid from '../../components/properties/PropertyGrid';
import { useProperties } from '../../hooks/useProperties';

const FeaturedProperties = ({ 
  title = "Featured Properties",
  subtitle = "Discover our handpicked selection of premium properties",
  className = "",
  limit = 20 // Show 20 properties as featured
}) => {
  // Use the same hook pattern as Properties component
  const {
    properties,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    refetch
  } = useProperties({ 
    page: 1,
    limit: limit,
    sort: 'newest' // Show newest properties first
  });

  // Debug: Log what we're getting from the hook
  useEffect(() => {
    console.log('🔍 FeaturedProperties Hook State:', {
      loading,
      error,
      propertiesCount: properties?.length || 0,
      totalItems,
      limit
    });
  }, [properties, loading, error, totalItems, limit]);

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // If we have an error, show a simple error message
  if (error) {
    return (
      <section className={`py-2 md:py-16 bg-gray-50 ${className}`}>
        <WideContainer>
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Temporary Issue</h3>
              <p className="text-gray-600 mb-6">
                We're having trouble loading featured properties. Please try again.
              </p>
              <button 
                onClick={handleRetry}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </WideContainer>
      </section>
    );
  }

  return (
    <section className={`py-2 md:py-2 bg-gray-50 ${className}`}>
      <WideContainer>
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Use the same PropertyGrid component as Properties page */}
        <PropertyGrid
          properties={properties}
          loading={loading}
          error={error}
          currentPage={1}
          totalPages={1}
          totalItems={properties?.length || 0}
          onPageChange={() => {}} // No pagination needed for featured
          onSortChange={() => {}} // No sorting needed for featured
          sortBy="newest"
          view="grid"
          showPagination={false} // Hide pagination for featured section
        />

        {/* CTA Section */}
        {!loading && properties && properties.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Find Your Dream Property?
              </h3>
              <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Browse our complete collection of properties or speak with one of our expert agents.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a
                  href="/properties"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View All Properties
                </a>
                <a
                  href="/contact"
                  className="bg-transparent text-white px-8 py-4 rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Contact an Agent
                </a>
              </div>
            </div>
          </div>
        )}
      </WideContainer>
    </section>
  );
};

export default FeaturedProperties;