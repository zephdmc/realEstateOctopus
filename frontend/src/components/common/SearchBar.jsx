import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, onOpenResults, placeholder = "Search properties...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    bedrooms: '',
    location: ''
  });
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Auto-detect and sync filters from search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      let updatedFilters = { ...filters };
      let changed = false;

      // Detect property type from search term
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

      // Detect bedrooms from search term
      const bedroomMatch = term.match(/(\d+)\s*(?:bed|bedroom|br|bd)/);
      if (bedroomMatch) {
        const bedNum = bedroomMatch[1];
        const bedOption = bedrooms.find(b => b === bedNum || (bedNum >= 5 && b === '5+'));
        if (bedOption && bedOption !== 'Any' && filters.bedrooms !== bedOption) {
          updatedFilters.bedrooms = bedOption;
          changed = true;
        }
      }

      // Detect price from search term
      const priceMatch = term.match(/\$?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|m|million)?/);
      if (priceMatch && !filters.priceRange) {
        const [, amountStr, unit] = priceMatch;
        let amount = parseFloat(amountStr.replace(/,/g, ''));
        
        if (unit === 'k' || term.includes('thousand')) amount *= 1000;
        if (unit === 'm' || term.includes('million')) amount *= 1000000;

        // Find matching price range
        let matchedRange = '';
        if (amount < 100000) matchedRange = 'Under $100,000';
        else if (amount <= 200000) matchedRange = '$100,000 - $200,000';
        else if (amount <= 300000) matchedRange = '$200,000 - $300,000';
        else if (amount <= 500000) matchedRange = '$300,000 - $500,000';
        else matchedRange = 'Over $500,000';

        if (matchedRange && filters.priceRange !== matchedRange) {
          updatedFilters.priceRange = matchedRange;
          changed = true;
        }
      }

      if (changed) {
        setFilters(updatedFilters);
      }
    }
  }, [searchTerm]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    
    // Process search term and handle conflicts intelligently
    let finalFilters = { ...filters };
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      
      // If search term contains property type, use it (override dropdown if different)
      const propertyKeywords = {
        'house': 'House',
        'apartment': 'Apartment',
        'condo': 'Condo',
        'villa': 'Villa',
        'commercial': 'Commercial'
      };
      
      for (const [keyword, type] of Object.entries(propertyKeywords)) {
        if (term.includes(keyword)) {
          finalFilters.type = type; // Override dropdown with search term
          break;
        }
      }
      
      // If search term contains bedroom info, use it
      const bedroomMatch = term.match(/(\d+)\s*(?:bed|bedroom|br|bd)/);
      if (bedroomMatch) {
        const bedNum = bedroomMatch[1];
        const bedOption = bedrooms.find(b => b === bedNum || (bedNum >= 5 && b === '5+'));
        if (bedOption && bedOption !== 'Any') {
          finalFilters.bedrooms = bedOption;
        }
      }
    }
    
    // Create search criteria
    const searchCriteria = {
      term: searchTerm,
      ...finalFilters
    };
    
    console.log('🔍 Final search criteria:', searchCriteria);
    
    // Call the parent's search handler
    await onSearch(searchCriteria);
    
    // Close search panel
    setShowSearchPanel(false);
    
    // Notify parent to open results (if provided)
    if (onOpenResults) {
      onOpenResults();
    }
    
    setIsLoading(false);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    
    // Only trigger search if we're in the search panel
    // or if there's actually a value to search with
    if (searchTerm || Object.values(newFilters).some(v => v)) {
      onSearch({
        term: searchTerm,
        ...newFilters
      });
    }
  };

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    
    // Auto-search as user types (debounced)
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (value.trim() || Object.values(filters).some(v => v)) {
        onSearch({
          term: value,
          ...filters
        });
      }
    }, 300);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      priceRange: '',
      bedrooms: '',
      location: ''
    });
    onSearch({});
    setShowSearchPanel(false);
  };

  // Check for conflicts between search term and dropdowns
  const hasTypeConflict = () => {
    if (!searchTerm.trim()) return false;
    
    const term = searchTerm.toLowerCase();
    const dropdownType = filters.type.toLowerCase();
    
    const conflicts = {
      'house': ['apartment', 'condo', 'villa', 'commercial'],
      'apartment': ['house', 'villa', 'commercial'],
      'condo': ['house', 'villa', 'commercial'],
      'villa': ['house', 'apartment', 'condo', 'commercial'],
      'commercial': ['house', 'apartment', 'condo', 'villa']
    };
    
    if (dropdownType && dropdownType !== 'any type') {
      for (const [type, conflictingTypes] of Object.entries(conflicts)) {
        if (dropdownType.includes(type)) {
          return conflictingTypes.some(conflict => term.includes(conflict));
        }
      }
    }
    
    return false;
  };

  // Floating Search Button for all screen sizes
  const renderFloatingSearchButton = () => (
    <button
      onClick={() => setShowSearchPanel(true)}
      className={`fixed bg-blue-600 text-white p-4 rounded-full shadow-lg border-b-2 border-red-600 hover:bg-blue-700 transition-all duration-200 z-40 ${
        showSearchPanel ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        bottom: '1.5rem',
        right: '1.5rem'
      }}
      aria-label="Open search panel"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );

  // Search Panel Overlay for all screen sizes
  const renderSearchPanel = () => (
    showSearchPanel && (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowSearchPanel(false)}
        />
        
        {/* Search Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Search Properties</h3>
              <button
                onClick={() => setShowSearchPanel(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Conflict Warning */}
            {hasTypeConflict() && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                <div className="flex items-center text-amber-700">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">
                    Search term will override dropdown selection
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search Content */}
          <div className="p-6 space-y-4">
            {/* Main Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
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

            {/* Property Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                {searchTerm && filters.type && hasTypeConflict() && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    Will use search term
                  </span>
                )}
              </div>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type === 'Any Type' ? '' : type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range === 'Any Price' ? '' : range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                {searchTerm && filters.bedrooms && searchTerm.match(/(\d+)\s*(?:bed|bedroom|br|bd)/) && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    Will use search term
                  </span>
                )}
              </div>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {bedrooms.map(bed => (
                  <option key={bed} value={bed === 'Any' ? '' : bed}>
                    {bed} Bed{bed !== 'Any' && 'room'}{bed === '1' ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Enter location"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            {/* Current Filters Summary */}
            {(searchTerm || Object.values(filters).some(v => v)) && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Current search:</p>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      "{searchTerm}"
                    </span>
                  )}
                  {filters.type && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Type: {filters.type}
                    </span>
                  )}
                  {filters.bedrooms && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {filters.bedrooms} Bedroom{filters.bedrooms === '1' ? '' : 's'}
                    </span>
                  )}
                  {filters.priceRange && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {filters.priceRange}
                    </span>
                  )}
                  {filters.location && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Location: {filters.location}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
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
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
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

  return (
    <>
      {/* Floating Search Button - Always visible when panel is closed */}
      {renderFloatingSearchButton()}
      
      {/* Search Panel Overlay - Shows when clicked */}
      {renderSearchPanel()}
    </>
  );
};

export default SearchBar;