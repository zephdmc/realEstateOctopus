import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SerachComponent';

const GlobalSearch = () => {
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle opening the search panel (when floating button is clicked)
  const handleOpenSearch = () => {
    setShowSearchPanel(true);
  };

  // Handle search from SearchBar
  const handleSearch = (criteria) => {
    console.log('🔍 GlobalSearch: Search performed:', criteria);
    
    // Save the search criteria
    setSearchCriteria(criteria);
    setHasSearched(true);
    
    // Close search panel, show results
    setShowSearchPanel(false);
    setShowResults(true);
  };

  // Handle opening results (when floating button is clicked after search)
  const handleOpenResults = () => {
    if (searchCriteria) {
      setShowResults(true);
    }
  };

  // Close results panel
  const handleCloseResults = () => {
    setShowResults(false);
  };

  // Close search panel
  const handleCloseSearch = () => {
    setShowSearchPanel(false);
  };

  return (
    <>
      {/* Floating Search Button - Shows after first search OR when no search yet */}
      {(!hasSearched || !showResults) && (
        <button
          onClick={hasSearched ? handleOpenResults : handleOpenSearch}
          className={`fixed bg-blue-600 text-white p-4 rounded-full shadow-lg border-b-2 border-red-600 hover:bg-blue-700 transition-all duration-200 z-40`}
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
          
          {/* Show indicator if we have search results */}
          {hasSearched && (
            <div className="absolute -top-1 -right-1">
              <div className="relative">
                <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
              </div>
            </div>
          )}
        </button>
      )}
      
      {/* Search Panel - Opens when floating button is clicked (before search) */}
      <SearchBar 
        onSearch={handleSearch}
        isOpen={showSearchPanel}
        onClose={handleCloseSearch}
      />
      
      {/* Search Results Panel - Shows after search */}
      <SearchResults 
        searchCriteria={searchCriteria}
        isOpen={showResults}
        onClose={handleCloseResults}
      />
    </>
  );
};

export default GlobalSearch;