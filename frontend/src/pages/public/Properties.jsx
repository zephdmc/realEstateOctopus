import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiGrid, FiList, FiChevronDown, FiHome, FiDollarSign, FiMapPin, FiSearch, FiSliders } from 'react-icons/fi';
import { MdApartment, MdHouse, MdBusiness, MdSort } from 'react-icons/md';
import { TbBuildingEstate } from 'react-icons/tb';
import MainLayout from '../../components/layout/MainLayout';
import { WideContainer, GridContainer } from '../../components/layout/PageContainer';
import PropertyGrid from '../../components/properties/PropertyGrid';
import PropertyFilters from '../../components/properties/PropertyFilters';
import SearchForm from '../../components/forms/SearchForm';
import { useProperties } from '../../hooks/useProperties';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState('');

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Clean filters to remove any 'id' parameter that might be coming from URL
  const cleanFilters = React.useMemo(() => {
    const { id, ...cleanFilters } = filters;
    return {
      page: parseInt(searchParams.get('page')) || 1,
      limit: 12,
      ...cleanFilters,
      sort: sortBy
    };
  }, [filters, searchParams, sortBy]);

  const {
    properties,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    refetch
  } = useProperties(cleanFilters);

  // Debug: Log property images when properties change
  useEffect(() => {
    if (properties.length > 0) {
      console.log('🖼️ Properties Page - First property images:', {
        title: properties[0].title,
        primaryImage: properties[0].primaryImage,
        images: properties[0].images,
        featuredImage: properties[0].featuredImage,
        hasPrimaryImage: !!properties[0].primaryImage,
        hasImages: !!properties[0].images?.length
      });
    }
  }, [properties]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'id') {
        params.set(key, value.toString());
      }
    });
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    setSearchParams(params);
  }, [filters, currentPage, setSearchParams]);

  const handleSearch = (searchData) => {
    const { id, ...cleanSearchData } = searchData;
    setFilters(prev => ({
      ...prev,
      ...cleanSearchData,
      page: 1
    }));
  };

  const handleFiltersChange = (newFilters) => {
    const { id, ...cleanFilters } = newFilters;
    setFilters(cleanFilters);
    if (isMobile) {
      setShowFilterOverlay(false);
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const quickFilters = [
    { label: 'All Properties', value: '', icon: FiHome, count: totalItems },
    { label: 'For Sale', value: 'sale', icon: FiDollarSign, count: '1.2k' },
    { label: 'For Rent', value: 'rent', icon: MdBusiness, count: '856' },
    { label: 'Featured', value: 'featured', icon: MdHouse, count: '43' },
    { label: 'Luxury', value: 'luxury', icon: TbBuildingEstate, count: '127' },
    { label: 'New', value: 'new', icon: MdApartment, count: '89' }
  ];

  const handleQuickFilter = (status) => {
    setActiveQuickFilter(status);
    if (status === '') {
      setFilters({ page: 1 });
    } else {
      setFilters(prev => ({ ...prev, status, page: 1 }));
    }
  };

  const sortOptions = [
    { label: 'Newest First', value: 'newest', icon: MdSort },
    { label: 'Price: Low to High', value: 'price_asc', icon: FiDollarSign },
    { label: 'Price: High to Low', value: 'price_desc', icon: FiDollarSign },
    { label: 'Most Popular', value: 'popular', icon: FiMapPin },
    { label: 'Largest First', value: 'area_desc', icon: MdApartment }
  ];

  const appliedFiltersCount = Object.keys(filters).filter(key => 
    key !== 'page' && filters[key] && filters[key] !== ''
  ).length;

  return (
    <MainLayout>
      <WideContainer>
        {/* Header Section */}
        <div className="relative py-12 md:py-16 mb-8 md:mb-12 overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-3xl border border-blue-100 animate-fade-in px-4 sm:px-0">
  {/* Background Design Elements */}
  <div className="absolute inset-0">
    {/* Blue Strip Lines */}
    <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-200/50 to-transparent animate-pulse"></div>
    <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-sky-200/40 to-transparent animate-pulse delay-75"></div>
    <div className="absolute top-0 left-2/3 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-200/30 to-transparent animate-pulse delay-150"></div>
    
    {/* Signal Waves */}
    <div className="absolute top-1/4 left-0 w-full">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent animate-pulse"></div>
    </div>
    <div className="absolute bottom-1/3 right-0 w-2/3">
      <div className="h-0.5 bg-gradient-to-l from-transparent via-sky-300/30 to-transparent animate-pulse delay-100"></div>
    </div>
    
    {/* Floating Blue Elements */}
    <div className="absolute top-16 left-20 w-6 h-6 border-2 border-blue-300/60 rounded-lg transform rotate-45 animate-float"></div>
    <div className="absolute bottom-20 right-24 w-8 h-8 border-2 border-sky-300/50 rounded-full animate-float delay-300"></div>
    <div className="absolute top-28 right-32 w-4 h-4 bg-blue-400/30 rounded-sm transform rotate-12 animate-ping"></div>
    <div className="absolute bottom-28 left-32 w-5 h-5 border border-cyan-300/40 rounded-full animate-bounce delay-200"></div>
    
    {/* Connection Dots */}
    <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
    <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse delay-150"></div>
    <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-500 rounded-full animate-ping delay-300"></div>
    
    {/* Gradient Orbs */}
    <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-r from-blue-200 to-sky-200 rounded-full blur-3xl opacity-50"></div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-40"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-sky-200 to-cyan-200 rounded-full blur-2xl opacity-30"></div>
    
    {/* Decorative Corner Accents */}
    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-300/60 rounded-tl-lg"></div>
    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-300/60 rounded-br-lg"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 text-center max-w-4xl mx-auto">
    {/* Company Badge */}
    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-blue-200 shadow-sm mb-4 md:mb-6 hover:scale-105 transition-transform duration-200">
      <TbBuildingEstate className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
      <span className="text-sm md:text-base font-semibold text-blue-700 tracking-wide">Octopus Real Estate</span>
    </div>
    
    {/* Main Heading */}
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 font-serif tracking-tight leading-tight">
      Discover Your <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent">Perfect</span> Property
    </h1>
    
    {/* Description */}
    <div className="relative inline-block max-w-2xl">
      <div className="absolute -inset-4 bg-white/40 rounded-2xl transform rotate-1 blur-sm"></div>
      <p className="relative text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/30 shadow-sm">
        Explore luxury homes, modern apartments, and premium commercial spaces worldwide.
      </p>
    </div>

    {/* Decorative Bottom Elements */}
    <div className="flex justify-center items-center space-x-2 mt-6 md:mt-8">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse delay-75"></div>
      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-150"></div>
      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-200"></div>
      <div className="w-2 h-2 bg-sky-400 rounded-full animate-ping delay-300"></div>
    </div>
  </div>
</div>

        {/* Main Search Bar */}
        <div className="mb-8 md:mb-12 animate-slide-in px-4 sm:px-0">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-medium md:shadow-large p-4 md:p-6 border border-secondary-100">
            <SearchForm 
              onSearch={handleSearch}
              initialValues={filters}
              showAdvancedFilters={false}
            />
          </div>
        </div>

        {/* Quick Filters - Hidden on Mobile */}
        {!isMobile && (
          <div className="mb-8 md:mb-10">
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6 justify-center">
              {quickFilters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = activeQuickFilter === filter.value;
                
                return (
                  <button
                    key={filter.value}
                    onClick={() => handleQuickFilter(filter.value)}
                    className={`group relative flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 border-2 ${
                      isActive
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-medium'
                        : 'border-secondary-200 bg-white text-secondary-700 hover:border-primary-300 hover:shadow-soft'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                      isActive ? 'text-primary-600' : 'text-secondary-500 group-hover:text-primary-500'
                    }`} />
                    <div className="text-left">
                      <div className="font-semibold text-sm md:text-base">{filter.label}</div>
                      <div className={`text-xs md:text-sm ${
                        isActive ? 'text-primary-600' : 'text-secondary-500'
                      }`}>
                        {filter.count} properties
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results & Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6 mb-6 md:mb-8 p-4 md:p-6 bg-secondary-50 rounded-xl md:rounded-2xl border border-secondary-200 mx-4 sm:mx-0">
          <div className="flex items-center gap-3 md:gap-4 w-full justify-between md:justify-start">
            <div className="text-secondary-700">
              <p className="text-base md:text-lg font-semibold whitespace-nowrap">
                <span className="text-primary-600">{totalItems}+</span> properties
              </p>
              <p className="text-xs md:text-sm text-secondary-500">
                {appliedFiltersCount > 0 && `${appliedFiltersCount} filter${appliedFiltersCount > 1 ? 's' : ''} applied`}
              </p>
            </div>

            {/* Mobile Quick Actions */}
            {isMobile && (
              <button
                onClick={() => setShowFilterOverlay(true)}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-200 relative"
              >
                <FiSliders className="w-4 h-4" />
                {appliedFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-bounce-in">
                    {appliedFiltersCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Desktop Controls */}
          {!isMobile && (
            <div className="flex items-center gap-3 md:gap-4">
              {/* View Toggle */}
              <div className="flex bg-white rounded-lg md:rounded-xl shadow-soft border border-secondary-200 p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-md md:rounded-lg transition-all duration-200 ${
                    view === 'grid' 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100'
                  }`}
                >
                  <FiGrid className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-md md:rounded-lg transition-all duration-200 ${
                    view === 'list' 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100'
                  }`}
                >
                  <FiList className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">List</span>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-secondary-200 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 pr-8 md:pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-soft hover:shadow-medium text-sm md:text-base min-w-32 md:min-w-48"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none w-3 h-3 md:w-4 md:h-4" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilterOverlay(true)}
                className="flex items-center gap-2 md:gap-3 bg-primary-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 relative"
              >
                <FiSliders className="w-4 h-4" />
                <span className="font-semibold text-sm md:text-base">Filters</span>
                {appliedFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-accent-500 text-white text-xs rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center animate-bounce-in text-xs">
                    {appliedFiltersCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="relative px-4 sm:px-0">
          {/* Filter Overlay */}
          {showFilterOverlay && (
            <div className="fixed inset-0 z-90 animate-fade-in">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => setShowFilterOverlay(false)}
              />
              
              {/* Filter Panel */}
              <div className="absolute inset-0 md:right-0 md:top-0 md:h-full md:w-full md:max-w-md bg-white shadow-2xl transform animate-slide-in overflow-y-auto">
                <div className="p-4 md:p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 md:pb-4 border-b border-secondary-200">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-secondary-900 font-serif">Filters</h2>
                      <p className="text-secondary-500 text-xs md:text-sm mt-1">
                        Refine your property search
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFilterOverlay(false)}
                      className="p-2 md:p-3 hover:bg-secondary-100 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-110"
                    >
                      <FiX className="w-5 h-5 md:w-6 md:h-6 text-secondary-500" />
                    </button>
                  </div>

                  {/* Filter Content */}
                  <div className="flex-1">
                    <PropertyFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onReset={() => {
                        setFilters({ page: 1 });
                        setActiveQuickFilter('');
                        setShowFilterOverlay(false);
                      }}
                      compact={true}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 md:gap-3 pt-4 md:pt-6 mt-4 md:mt-6 border-t border-secondary-200">
                    <button
                      onClick={() => {
                        setFilters({ page: 1 });
                        setActiveQuickFilter('');
                        setShowFilterOverlay(false);
                      }}
                      className="flex-1 px-4 py-2 md:px-6 md:py-3 border border-secondary-300 text-secondary-700 rounded-lg md:rounded-xl hover:bg-secondary-50 transition-colors duration-200 font-medium text-sm md:text-base"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowFilterOverlay(false)}
                      className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-primary-600 text-white rounded-lg md:rounded-xl hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-md text-sm md:text-base"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Debug Info - Only in development */}
          {process.env.NODE_ENV === 'development' && properties.length > 0 && (
            <div className="hidden">
              <h3>Debug - First Property Images:</h3>
              <pre>{JSON.stringify(properties[0].images, null, 2)}</pre>
              <pre>{JSON.stringify({
                primaryImage: properties[0].primaryImage,
                hasImages: !!properties[0].images,
                imageCount: properties[0].images?.length,
                firstImageUrl: properties[0].images?.[0]?.url
              }, null, 2)}</pre>
            </div>
          )}

          {/* Properties Grid */}
          <div className="animate-fade-in">
            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              view={view}
            />
          </div>
        </div>

        {/* Loading Animation */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-12 md:py-16 space-y-3 md:space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary-600"></div>
            <p className="text-secondary-600 font-medium text-sm md:text-base">Loading premium properties...</p>
          </div>
        )}
      </WideContainer>
    </MainLayout>
  );
};

export default Properties;