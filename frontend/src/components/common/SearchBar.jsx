import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useProperties } from '../../hooks/useProperties';
import PropertyCard from '../properties/PropertyCard';

const SearchBar = ({ placeholder = "Search properties..." }) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    bedrooms: '',
    location: ''
  });
  
  // UI state
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  // Use ref for debouncing
  const searchTimeoutRef = useRef(null);
  
  // ✅ FIXED: Use the hook correctly - remove the extra parameters
  const { 
    properties: allProperties, 
    loading, 
    error, 
    fetchProperties,
    hasProperties
  } = useProperties({}); // Just pass empty filters object

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    if (!allProperties || allProperties.length === 0) return [];
    
    console.log('🔄 Filtering properties. Total:', allProperties.length);
    console.log('🔍 Search term:', searchTerm);
    console.log('🎯 Filters:', filters);
    console.log('🔎 Has searched?', hasSearched);
    
    // If user hasn't searched yet, return empty array (hide all properties)
    if (!hasSearched && !showResults) {
      console.log('👁️‍🗨️ User hasn\'t searched yet - hiding all properties');
      return [];
    }
    
    // If user has searched, apply filters
    let filtered = [...allProperties];
    
    // Apply search term filter (by title, description, or location)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      console.log('🔍 Applying search term:', term);
      
      filtered = filtered.filter(property => {
        const title = (property.title || '').toString().toLowerCase();
        const description = (property.description || '').toString().toLowerCase();
        const location = (property.location || '').toString().toLowerCase();
        const address = (property.address || '').toString().toLowerCase();
        const city = (property.city || '').toString().toLowerCase();
        
        const matches = title.includes(term) || 
               description.includes(term) || 
               location.includes(term) ||
               address.includes(term) ||
               city.includes(term);
        
        return matches;
      });
      
      console.log(`🔍 After search term filter: ${filtered.length} properties`);
    }
    
    // Apply property type filter
    if (filters.type && filters.type !== 'Any Type') {
      console.log('🔍 Applying type filter:', filters.type);
      filtered = filtered.filter(property => {
        const propertyType = (property.type || '').toString().toLowerCase();
        const filterType = filters.type.toLowerCase();
        return propertyType === filterType;
      });
      console.log(`🔍 After type filter: ${filtered.length} properties`);
    }
    
    // Apply bedrooms filter
    if (filters.bedrooms && filters.bedrooms !== 'Any') {
      console.log('🔍 Applying bedrooms filter:', filters.bedrooms);
      filtered = filtered.filter(property => {
        const beds = parseInt(property.bedrooms) || 0;
        if (filters.bedrooms === '5+') {
          return beds >= 5;
        } else {
          return beds === parseInt(filters.bedrooms);
        }
      });
      console.log(`🔍 After bedrooms filter: ${filtered.length} properties`);
    }
    
    // Apply price range filter
    if (filters.priceRange && filters.priceRange !== 'Any Price') {
      console.log('🔍 Applying price filter:', filters.priceRange);
      const priceMap = {
        'Under $100,000': { min: 0, max: 100000 },
        '$100,000 - $200,000': { min: 100000, max: 200000 },
        '$200,000 - $300,000': { min: 200000, max: 300000 },
        '$300,000 - $500,000': { min: 300000, max: 500000 },
        'Over $500,000': { min: 500000, max: Infinity }
      };
      
      const range = priceMap[filters.priceRange];
      if (range) {
        filtered = filtered.filter(property => {
          const price = parseInt(property.price) || 0;
          return price >= range.min && price <= range.max;
        });
      }
      console.log(`🔍 After price filter: ${filtered.length} properties`);
    }
    
    // Apply location filter
    if (filters.location) {
      console.log('🔍 Applying location filter:', filters.location);
      const locationTerm = filters.location.toLowerCase();
      filtered = filtered.filter(property => {
        const location = (property.location || '').toString().toLowerCase();
        const address = (property.address || '').toString().toLowerCase();
        const city = (property.city || '').toString().toLowerCase();
        const country = (property.country || '').toString().toLowerCase();
        
        return location.includes(locationTerm) || 
               address.includes(locationTerm) ||
               city.includes(locationTerm) ||
               country.includes(locationTerm);
      });
      console.log(`🔍 After location filter: ${filtered.length} properties`);
    }
    
    console.log(`✅ Final filtered properties: ${filtered.length}`);
    return filtered;
  }, [allProperties, searchTerm, filters, hasSearched, showResults]);

  const propertyTypes = [
    'Any Type',
    'House',
    'Apartment',
    'Condo',
    'Villa',
    'Commercial'
  ];

  const priceRanges = [
    'Any Price',
    'Under $100,000',
    '$100,000 - $200,000',
    '$200,000 - $300,000',
    '$300,000 - $500,000',
    'Over $500,000'
  ];

  const bedrooms = [
    'Any',
    '1',
    '2',
    '3',
    '4',
    '5+'
  ];

  // Handle search button click
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    console.log('🎯 Starting search with:', { searchTerm, filters });
    console.log('📊 Total properties available:', allProperties?.length || 0);
    setSearchError(null);
    setIsSearching(true);
    
    try {
      // Check if we have any search criteria
      const hasSearchCriteria = searchTerm.trim() || 
        Object.values(filters).some(v => v && v !== 'Any Type' && v !== 'Any Price' && v !== 'Any');
      
      if (!hasSearchCriteria) {
        throw new Error('Please enter search criteria');
      }
      
      console.log('✅ Valid search criteria. Has searched will be set to true');
      setHasSearched(true);
      
      // Close search panel, show results
      setShowSearchPanel(false);
      setShowResults(true);
      
    } catch (err) {
      console.error('❌ Search error:', err);
      setSearchError(err.message || 'Failed to perform search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
  };

  // Handle search term changes
  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim()) {
      const term = value.toLowerCase().trim();
      let updatedFilters = { ...filters };
      let changed = false;
      
      const propertyKeywords = {
        'house': 'House',
        'apartment': 'Apartment',
        'condo': 'Condo',
        'villa': 'Villa',
        'commercial': 'Commercial'
      };
      
      for (const [keyword, type] of Object.entries(propertyKeywords)) {
        if (term.includes(keyword) && filters.type !== type) {
          updatedFilters.type = type;
          changed = true;
          break;
        }
      }
      
      const bedroomMatch = term.match(/(\d+)\s*(?:bed|bedroom|br|bd)/);
      if (bedroomMatch) {
        const bedNum = bedroomMatch[1];
        const bedOption = bedrooms.find(b => b === bedNum || (bedNum >= 5 && b === '5+'));
        if (bedOption && bedOption !== 'Any' && filters.bedrooms !== bedOption) {
          updatedFilters.bedrooms = bedOption;
          changed = true;
        }
      }
      
      if (changed) {
        setFilters(updatedFilters);
      }
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      priceRange: '',
      bedrooms: '',
      location: ''
    });
    setHasSearched(false);
    setShowSearchPanel(false);
    setShowResults(false);
    setSearchError(null);
  };

  // Open search panel
  const openSearchPanel = () => {
    setShowSearchPanel(true);
    setShowResults(false);
  };

  // Open results panel
  const openResultsPanel = () => {
    console.log('📱 Opening results panel');
    console.log('🔍 hasSearched:', hasSearched);
    console.log('🏠 filteredProperties length:', filteredProperties?.length || 0);
    
    if (hasSearched && filteredProperties.length > 0) {
      console.log('✅ Showing results panel');
      setShowResults(true);
      setShowSearchPanel(false);
    } else {
      console.log('🔍 Opening search panel instead');
      openSearchPanel();
    }
  };

  // Close results panel
  const closeResultsPanel = () => {
    setShowResults(false);
  };

  // Close search panel
  const closeSearchPanel = () => {
    setShowSearchPanel(false);
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const active = [];
    if (filters.type && filters.type !== 'Any Type') active.push(`Type: ${filters.type}`);
    if (filters.bedrooms && filters.bedrooms !== 'Any') active.push(`${filters.bedrooms} Bedroom${filters.bedrooms === '1' ? '' : 's'}`);
    if (filters.priceRange && filters.priceRange !== 'Any Price') active.push(filters.priceRange);
    if (filters.location) active.push(`Location: ${filters.location}`);
    return active;
  };

  // Floating Search Button
  const renderFloatingButton = () => (
    <button
      onClick={openResultsPanel}
      className={`fixed bg-blue-600 text-white p-4 rounded-full shadow-lg border-b-2 border-red-600 hover:bg-blue-700 transition-all duration-200 z-40 ${
        (showSearchPanel || showResults) ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        bottom: '1.5rem',
        right: '1.5rem'
      }}
      aria-label={hasSearched ? "Show search results" : "Open search panel"}
      title={hasSearched ? "Click to view search results" : "Click to search properties"}
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      {hasSearched && !showResults && (
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
          </div>
        </div>
      )}
    </button>
  );

  // Search Panel
  const renderSearchPanel = () => (
    showSearchPanel && (
      <div className="fixed inset-0 z-50">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeSearchPanel}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Search Properties</h3>
              <button
                onClick={closeSearchPanel}
                className="p-2 text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{searchError}</p>
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  console.log('📝 Search term changed to:', e.target.value);
                  handleSearchTermChange(e.target.value);
                }}
                placeholder={placeholder}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchTermChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) => {
                  console.log('🎯 Type filter changed:', e.target.value);
                  handleFilterChange('type', e.target.value);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type === 'Any Type' ? '' : type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => {
                  console.log('💰 Price filter changed:', e.target.value);
                  handleFilterChange('priceRange', e.target.value);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range === 'Any Price' ? '' : range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => {
                  console.log('🛏️ Bedrooms filter changed:', e.target.value);
                  handleFilterChange('bedrooms', e.target.value);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {bedrooms.map(bed => (
                  <option key={bed} value={bed === 'Any' ? '' : bed}>
                    {bed} Bed{bed !== 'Any' && 'room'}{bed === '1' ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => {
                  console.log('📍 Location filter changed:', e.target.value);
                  handleFilterChange('location', e.target.value);
                }}
                placeholder="Enter location"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            {(searchTerm || Object.values(filters).some(v => v && v !== 'Any Type' && v !== 'Any Price' && v !== 'Any')) && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-900 mb-2">Searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      "{searchTerm}"
                    </span>
                  )}
                  {getActiveFilters().map((filter, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white pb-2">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                Clear All
              </button>
              <button
                onClick={handleSearch}
                disabled={isSearching || (!searchTerm && !Object.values(filters).some(v => v && v !== 'Any Type' && v !== 'Any Price' && v !== 'Any'))}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Results Panel
  const renderResultsPanel = () => (
    showResults && (
      <div className="fixed inset-0 z-50">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeResultsPanel}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results
                  {searchTerm && (
                    <span className="text-gray-600 font-normal ml-2">
                      for "{searchTerm}"
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {loading ? 'Loading...' : 
                   filteredProperties && filteredProperties.length > 0 ? 
                   `Found ${filteredProperties.length} propert${filteredProperties.length === 1 ? 'y' : 'ies'}` : 
                   'No properties found'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={openSearchPanel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-sm"
                >
                  New Search
                </button>
                <button
                  onClick={closeResultsPanel}
                  className="p-2 text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {getActiveFilters().length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {getActiveFilters().map((filter, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filter}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 md:p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            )}

            {(error || searchError) && !loading && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Properties</h3>
                <p className="text-gray-600 mb-4">{error || searchError}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fetchProperties()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={openSearchPanel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    New Search
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && !searchError && (!filteredProperties || filteredProperties.length === 0) && (
              <div className="text-center py-12 px-4">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Properties Found
                </h3>
                
                <div className="max-w-md mx-auto mb-6">
                  {searchTerm && (
                    <p className="text-gray-600 mb-4">
                      No results found for <span className="font-medium text-gray-900">"{searchTerm}"</span>
                    </p>
                  )}
                  
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or clear some filters to see more properties.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-gray-900 mb-3">Search Tips:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Try broader search terms or check spelling</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Try different price ranges or property types</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Remove some filters to see more properties</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={openSearchPanel}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                  >
                    Try New Search
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && !searchError && filteredProperties && filteredProperties.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProperties.map((property, index) => {
                    console.log(`🏠 Rendering property ${index}:`, property.title || property._id);
                    return (
                      <PropertyCard
                        key={property._id || property.id || index}
                        property={property}
                        className="transform transition-transform duration-200 hover:scale-[1.02]"
                      />
                    );
                  })}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-3">
                    Showing {filteredProperties.length} of {allProperties?.length || 0} properties
                  </p>
                  <button
                    onClick={openSearchPanel}
                    className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-200 font-medium"
                  >
                    Try Different Search
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {renderFloatingButton()}
      {renderSearchPanel()}
      {renderResultsPanel()}
    </>
  );
};

export default SearchBar;