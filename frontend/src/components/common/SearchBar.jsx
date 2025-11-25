import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search properties...", className = "" }) => {
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

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    
    await onSearch({
      term: searchTerm,
      ...filters
    });
    
    // Close search panel after search
    setShowSearchPanel(false);
    
    setIsLoading(false);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    
    // Trigger search when filters change (optional)
    onSearch({
      term: searchTerm,
      ...newFilters
    });
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

  // Floating Search Button for all screen sizes
  const renderFloatingSearchButton = () => (
    <button
      onClick={() => setShowSearchPanel(true)}
      className={`fixed bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-40 ${
        showSearchPanel ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        bottom: '1.5rem',
        right: '1.5rem'
      }}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                autoFocus
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
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