import React, { useState, useEffect } from 'react';
import { useProperties } from '../../hooks/useProperties';
import PropertyCard from '../properties/PropertyCard';

const SearchResults = ({ searchCriteria, isOpen, onClose }) => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  
  const { properties, loading, error, pagination } = useProperties(filters);

  // Intelligent search parser
  const parseSearchTerm = (term) => {
    if (!term) return {};
    
    const termLower = term.toLowerCase().trim();
    const parsed = {};
    
    console.log('🔍 Parsing search term:', termLower);
    
    // Extract bedrooms from search term
    const bedroomMatch = termLower.match(/(\d+)\s*(?:bed(?:room)?s?|br|bd|beds?)/) || termLower.match(/^(\d+)$/);
    if (bedroomMatch) {
      const beds = parseInt(bedroomMatch[1]);
      if (beds >= 1 && beds <= 4) {
        parsed.bedrooms = beds;
        console.log('✅ Detected bedrooms:', beds);
      } else if (beds >= 5) {
        parsed.bedrooms = '5+';
        console.log('✅ Detected bedrooms: 5+');
      }
    }
    
    // Extract property type from search term
    const typeKeywords = {
      'house': 'House',
      'apartment': 'Apartment',
      'condo': 'Condo',
      'villa': 'Villa',
      'commercial': 'Commercial',
      'studio': 'Studio',
      'townhouse': 'Townhouse',
      'penthouse': 'Penthouse',
      'duplex': 'Duplex'
    };
    
    for (const [keyword, typeValue] of Object.entries(typeKeywords)) {
      if (termLower.includes(keyword)) {
        parsed.type = typeValue;
        console.log('✅ Detected property type:', typeValue);
        break;
      }
    }
    
    // Extract price from search term
    const priceMatch = termLower.match(/(under|below|less than|up to|over|above|more than)?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|m|million)?/);
    if (priceMatch) {
      const [, modifier, amountStr, unit] = priceMatch;
      let amount = parseFloat(amountStr.replace(/,/g, ''));
      
      if (unit === 'k' || termLower.includes('thousand')) amount *= 1000;
      if (unit === 'm' || termLower.includes('million')) amount *= 1000000;
      
      if (modifier) {
        const modLower = modifier.toLowerCase();
        if (modLower.includes('under') || modLower.includes('below') || modLower.includes('less')) {
          parsed.maxPrice = amount;
          console.log('✅ Detected max price:', amount);
        } else if (modLower.includes('over') || modLower.includes('above') || modLower.includes('more')) {
          parsed.minPrice = amount;
          console.log('✅ Detected min price:', amount);
        }
      } else {
        parsed.minPrice = amount * 0.8;
        parsed.maxPrice = amount * 1.2;
        console.log('✅ Detected price range:', parsed.minPrice, '-', parsed.maxPrice);
      }
    }
    
    // If still no specific filters, treat as general search or location
    if (Object.keys(parsed).length === 0 && termLower.length > 0) {
      const words = termLower.split(/\s+/);
      if (words.length <= 3 && !/^\d+$/.test(termLower)) {
        parsed.location = term;
        console.log('✅ Treating as location:', term);
      } else {
        parsed.search = term;
        console.log('✅ Treating as general search:', term);
      }
    }
    
    return parsed;
  };

  // Convert search criteria to API filters
  useEffect(() => {
    if (searchCriteria && isOpen) {
      const apiFilters = {
        page: currentPage,
        limit: 12
      };

      // Parse search term for intelligent filtering
      const termFilters = searchCriteria.term ? parseSearchTerm(searchCriteria.term) : {};
      
      // Apply explicit filters from dropdowns
      const explicitFilters = {};
      
      if (searchCriteria.type && searchCriteria.type !== 'Any Type') {
        explicitFilters.type = searchCriteria.type;
      }
      
      if (searchCriteria.priceRange && searchCriteria.priceRange !== 'Any Price') {
        const priceMap = {
          'Under $100,000': { minPrice: 0, maxPrice: 100000 },
          '$100,000 - $200,000': { minPrice: 100000, maxPrice: 200000 },
          '$200,000 - $300,000': { minPrice: 200000, maxPrice: 300000 },
          '$300,000 - $500,000': { minPrice: 300000, maxPrice: 500000 },
          'Over $500,000': { minPrice: 500000, maxPrice: 10000000 }
        };
        
        const range = priceMap[searchCriteria.priceRange];
        if (range) {
          explicitFilters.minPrice = range.minPrice;
          explicitFilters.maxPrice = range.maxPrice;
        }
      }
      
      if (searchCriteria.bedrooms && searchCriteria.bedrooms !== 'Any') {
        explicitFilters.bedrooms = searchCriteria.bedrooms === '5+' ? '5+' : parseInt(searchCriteria.bedrooms);
      }
      
      if (searchCriteria.location) {
        explicitFilters.location = searchCriteria.location;
      }

      // MERGE FILTERS INTELLIGENTLY
      // Priority: Explicit filters > Term-parsed filters, but be smart about conflicts
      const mergedFilters = { ...apiFilters };
      
      // Merge term filters first
      Object.assign(mergedFilters, termFilters);
      
      // Now apply explicit filters, but be careful about conflicts
      Object.keys(explicitFilters).forEach(key => {
        // If the user explicitly selected something in dropdown, use it (overrides term parsing)
        mergedFilters[key] = explicitFilters[key];
      });
      
      // Special case: If search term contains a type AND user selected a different type,
      // we should search for BOTH or prioritize? Let's log this conflict
      if (termFilters.type && explicitFilters.type && termFilters.type !== explicitFilters.type) {
        console.warn(`⚠️ Type conflict: Search term suggests "${termFilters.type}" but dropdown selected "${explicitFilters.type}"`);
        console.warn('Using dropdown selection:', explicitFilters.type);
      }
      
      // Special case: If search term has bedrooms AND user selected bedrooms
      if (termFilters.bedrooms !== undefined && explicitFilters.bedrooms !== undefined) {
        console.warn(`⚠️ Bedrooms conflict: Search term suggests "${termFilters.bedrooms}" but dropdown selected "${explicitFilters.bedrooms}"`);
        console.warn('Using dropdown selection:', explicitFilters.bedrooms);
      }
      
      // Clean up - remove any empty filters
      Object.keys(mergedFilters).forEach(key => {
        if (mergedFilters[key] === '' || mergedFilters[key] === null || mergedFilters[key] === undefined) {
          delete mergedFilters[key];
        }
      });
      
      console.log('🔍 Search Criteria:', searchCriteria);
      console.log('📊 Term Parsed Filters:', termFilters);
      console.log('🎯 Explicit Filters:', explicitFilters);
      console.log('🚀 Final API Filters:', mergedFilters);
      
      setFilters(mergedFilters);
    }
  }, [searchCriteria, currentPage, isOpen]);

  // Debug: Log what we're getting from the API
  useEffect(() => {
    console.log('📈 Properties from API:', properties);
    console.log('📊 Pagination:', pagination);
    console.log('⏳ Loading:', loading);
    console.log('❌ Error:', error);
  }, [properties, pagination, loading, error]);

  // Rest of your component (pagination, render, etc.)...
  // [Keep all the existing render logic]

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Results Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Search Results
                {searchCriteria?.term && (
                  <span className="text-gray-600 font-normal ml-2">
                    for "{searchCriteria.term}"
                  </span>
                )}
              </h3>
              {/* Show active filters */}
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.type && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Type: {filters.type}
                  </span>
                )}
                {filters.bedrooms && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {filters.bedrooms === '5+' ? '5+' : filters.bedrooms} Bedroom{filters.bedrooms === 1 ? '' : 's'}
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Price: 
                    {filters.minPrice ? ` $${filters.minPrice.toLocaleString()}` : ''}
                    {filters.minPrice && filters.maxPrice ? ' - ' : ''}
                    {filters.maxPrice ? ` $${filters.maxPrice.toLocaleString()}` : ''}
                  </span>
                )}
                {filters.location && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Location: {filters.location}
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Keyword: {filters.search}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition duration-200"
              aria-label="Close results"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results Content */}
        <div className="p-4 md:p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Searching properties...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Properties</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => setFilters({...filters})} // Trigger refetch
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State with suggestions */}
          {!loading && !error && properties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any properties matching your search criteria.
                Try adjusting your filters or search terms.
              </p>
              
              {/* Suggestions */}
              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="font-medium text-gray-900 mb-2">Search Tips:</h4>
                <ul className="text-sm text-gray-600 text-left space-y-1">
                  <li>• Try searching with fewer filters</li>
                  <li>• Check your spelling</li>
                  <li>• Use specific keywords like "2 bedroom apartment"</li>
                  <li>• Try different price ranges</li>
                  <li>• Clear all filters and start over</li>
                </ul>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && properties.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id || property.id}
                    property={property}
                    className="transform transition-transform duration-200 hover:scale-[1.02]"
                  />
                ))}
              </div>

              {/* Pagination - same as before */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  {/* ... pagination code ... */}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;