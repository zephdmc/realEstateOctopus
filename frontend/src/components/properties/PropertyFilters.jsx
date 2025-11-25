import React, { useState } from 'react';

const PropertyFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset,
  className = "" 
}) => {
  const [localFilters, setLocalFilters] = useState(filters || {});

  const propertyTypes = [
    { value: '', label: 'Any Type' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const statusOptions = [
    { value: '', label: 'Any Status' },
    { value: 'forSale', label: 'For Sale' },
    { value: 'forRent', label: 'For Rent' }
  ];

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-100000', label: 'Under $100,000' },
    { value: '100000-200000', label: '$100,000 - $200,000' },
    { value: '200000-300000', label: '$200,000 - $300,000' },
    { value: '300000-500000', label: '$300,000 - $500,000' },
    { value: '500000-1000000', label: '$500,000 - $1,000,000' },
    { value: '1000000-', label: 'Over $1,000,000' }
  ];

  const bedroomOptions = [
    { value: '', label: 'Any Bedrooms' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5', label: '5+ Bedrooms' }
  ];

  const bathroomOptions = [
    { value: '', label: 'Any Bathrooms' },
    { value: '1', label: '1 Bathroom' },
    { value: '2', label: '2 Bathrooms' },
    { value: '3', label: '3 Bathrooms' },
    { value: '4', label: '4+ Bathrooms' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (range) => {
    let minPrice, maxPrice;
    if (range) {
      [minPrice, maxPrice] = range.split('-').map(val => val === '' ? undefined : parseInt(val));
    }
    const newFilters = {
      ...localFilters,
      minPrice,
      maxPrice,
      priceRange: range
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {};
    setLocalFilters(resetFilters);
    onReset();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {propertyTypes.map(type => (
              <button
                key={type.value}
                onClick={() => handleFilterChange('type', type.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                  localFilters.type === type.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map(status => (
              <button
                key={status.value}
                onClick={() => handleFilterChange('status', status.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                  localFilters.status === status.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <select
            value={localFilters.priceRange || ''}
            onChange={(e) => handlePriceRangeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <select
              value={localFilters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {bedroomOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <select
              value={localFilters.bathrooms || ''}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {bathroomOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Area (sq ft)
            </label>
            <input
              type="number"
              value={localFilters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Area (sq ft)
            </label>
            <input
              type="number"
              value={localFilters.maxArea || ''}
              onChange={(e) => handleFilterChange('maxArea', e.target.value)}
              placeholder="Any"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['parking', 'garden', 'pool', 'furnished', 'petFriendly', 'balcony'].map(feature => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localFilters[feature] || false}
                  onChange={(e) => handleFilterChange(feature, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={localFilters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Enter city, neighborhood, or ZIP code"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === '') return null;

              let displayValue = value;
              if (key === 'priceRange') {
                const range = priceRanges.find(r => r.value === value);
                displayValue = range?.label;
              } else if (key === 'type') {
                const type = propertyTypes.find(t => t.value === value);
                displayValue = type?.label;
              } else if (key === 'status') {
                const status = statusOptions.find(s => s.value === value);
                displayValue = status?.label;
              } else if (typeof value === 'boolean') {
                displayValue = key.replace(/([A-Z])/g, ' $1').trim();
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {displayValue}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-2 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;