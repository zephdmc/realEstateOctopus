// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useApi } from './useApi';

// export const useProperties = (filters = {}) => {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 12
//   });

//   const { get, post, put, del } = useApi();
  
//   // Use ref to prevent infinite loops with filters object
//   const filtersRef = useRef(filters);
//   const initialLoadRef = useRef(true);

//   // Update ref when filters actually change
//   useEffect(() => {
//     const filtersChanged = JSON.stringify(filters) !== JSON.stringify(filtersRef.current);
//     if (filtersChanged) {
//       filtersRef.current = { ...filters };
//     }
//   }, [filters]);

//   // Fetch properties with filters
//   const fetchProperties = useCallback(async (customFilters = null) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const filtersToUse = customFilters || filtersRef.current;
//       const queryParams = new URLSearchParams();
      
//       // Add pagination parameters
//       queryParams.append('page', filtersToUse.page || '1');
//       queryParams.append('limit', filtersToUse.limit || '12');
      
//       // Add filter parameters
//       Object.entries(filtersToUse).forEach(([key, value]) => {
//         if (value !== undefined && value !== null && value !== '' && !['page', 'limit'].includes(key)) {
//           queryParams.append(key, value.toString());
//         }
//       });

//       console.log('📡 Fetching properties with filters:', filtersToUse);
      
//       const response = await get(`/properties?${queryParams.toString()}`);
      
//       console.log('🔍 Properties API Response:', response);
      
//       if (response && response.success !== false) {
//         // Extract data properly from API response
//         let propertiesData = [];
//         let paginationData = {};
        
//         // Handle nested data structure: response.data.data or response.data
//         if (response.data) {
//           if (Array.isArray(response.data.data)) {
//             propertiesData = response.data.data;
//           } else if (Array.isArray(response.data)) {
//             propertiesData = response.data;
//           }
//         } else if (response.properties !== undefined) {
//           propertiesData = Array.isArray(response.properties) ? response.properties : [];
//         } else if (Array.isArray(response)) {
//           propertiesData = response;
//         }
        
//         // Extract pagination data
//         if (response.pagination) {
//           paginationData = response.pagination;
//         } else if (response.data?.pagination) {
//           paginationData = response.data.pagination;
//         } else {
//           // Fallback to direct response fields
//           paginationData = {
//             page: response.page || response.currentPage || 1,
//             pages: response.pages || response.totalPages || 1,
//             total: response.total || response.count || propertiesData.length,
//             limit: response.limit || response.itemsPerPage || 12
//           };
//         }
        
//         console.log('📊 Processed properties:', propertiesData);
//         console.log('📊 Processed pagination:', paginationData);
        
//         setProperties(propertiesData);
//         setPagination({
//           currentPage: paginationData.page || 1,
//           totalPages: paginationData.pages || 1,
//           totalItems: paginationData.total || propertiesData.length,
//           itemsPerPage: paginationData.limit || 12
//         });
//       } else {
//         throw new Error(response?.error || response?.message || 'Failed to fetch properties');
//       }
//     } catch (err) {
//       console.error('❌ Error fetching properties:', err);
//       setError(err.message || 'An error occurred while fetching properties');
//       setProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [get]);

//   // Initial fetch
//   useEffect(() => {
//     if (initialLoadRef.current) {
//       initialLoadRef.current = false;
//       fetchProperties();
//     }
//   }, []);

//   // Refetch when filters change
//   useEffect(() => {
//     if (!initialLoadRef.current) {
//       const filtersChanged = JSON.stringify(filters) !== JSON.stringify(filtersRef.current);
//       if (filtersChanged) {
//         filtersRef.current = { ...filters };
//         fetchProperties(filters);
//       }
//     }
//   }, [filters, fetchProperties]);

//   // Fetch single property by ID
//   const fetchProperty = useCallback(async (propertyId) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await get(`/properties/${propertyId}`);
      
//       console.log('🔍 Single Property API Response:', response);
      
//       if (response && response.success !== false) {
//         // Handle nested data structure
//         let propertyData = response;
        
//         if (response.data) {
//           // If response.data has its own data property, that's the actual property
//           if (response.data.data && (response.data.data.title || response.data.data.price)) {
//             propertyData = response.data.data;
//           }
//           // If response.data is the property object
//           else if (response.data.title || response.data.price) {
//             propertyData = response.data;
//           }
//         }
        
//         return propertyData;
//       } else {
//         throw new Error(response?.error || response?.message || 'Failed to fetch property');
//       }
//     } catch (err) {
//       console.error('❌ Error fetching property:', err);
//       setError(err.message || 'An error occurred while fetching the property');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, [get]);

//   // Create new property
//   const createProperty = useCallback(async (propertyData) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await post('/properties', propertyData);
      
//       console.log('🔍 Create Property API Response:', response);
      
//       if (response && response.success !== false) {
//         // Extract the created property data from nested structure
//         let newProperty = response;
//         if (response.data) {
//           if (response.data.data && (response.data.data.title || response.data.data.price)) {
//             newProperty = response.data.data;
//           } else if (response.data.title || response.data.price) {
//             newProperty = response.data;
//           }
//         }
        
//         setProperties(prev => [newProperty, ...prev]);
//         return newProperty;
//       } else {
//         throw new Error(response?.error || response?.message || 'Failed to create property');
//       }
//     } catch (err) {
//       console.error('❌ Error creating property:', err);
//       setError(err.message || 'An error occurred while creating the property');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [post]);

//   // Update property
//   const updateProperty = useCallback(async (propertyId, updates) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await put(`/properties/${propertyId}`, updates);
      
//       console.log('🔍 Update Property API Response:', response);
      
//       if (response && response.success !== false) {
//         // Extract the updated property data from nested structure
//         let updatedProperty = response;
//         if (response.data) {
//           if (response.data.data && (response.data.data.title || response.data.data.price)) {
//             updatedProperty = response.data.data;
//           } else if (response.data.title || response.data.price) {
//             updatedProperty = response.data;
//           }
//         }
        
//         setProperties(prev =>
//           prev.map(prop => prop._id === propertyId || prop.id === propertyId ? updatedProperty : prop)
//         );
//         return updatedProperty;
//       } else {
//         throw new Error(response?.error || response?.message || 'Failed to update property');
//       }
//     } catch (err) {
//       console.error('❌ Error updating property:', err);
//       setError(err.message || 'An error occurred while updating the property');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [put]);

//   // Delete property
//   const deleteProperty = useCallback(async (propertyId) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await del(`/properties/${propertyId}`);
      
//       console.log('🔍 Delete Property API Response:', response);
      
//       if (response && response.success !== false) {
//         // Remove the property from the list
//         setProperties(prev => prev.filter(prop => prop._id !== propertyId && prop.id !== propertyId));
//         return true;
//       } else {
//         throw new Error(response?.error || response?.message || 'Failed to delete property');
//       }
//     } catch (err) {
//       console.error('❌ Error deleting property:', err);
//       setError(err.message || 'An error occurred while deleting the property');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [del]);

// // Get featured properties - UPDATED VERSION
// // In your useProperties.js file, update the getFeaturedProperties method:

// // Get featured properties - FIXED VERSION
// const getFeaturedProperties = useCallback(async (limit = 6) => {
//   try {
//     setLoading(true);
//     setError(null);

//     console.log('🔄 Fetching featured properties...');
//     const response = await get(`/properties/featured?limit=${limit}`);
    
//     console.log('🔍 Featured Properties API Response:', response);
    
//     if (response && response.success !== false) {
//       // Extract featured properties data from nested structure
//       let featuredData = [];
      
//       if (response.data) {
//         if (Array.isArray(response.data.data)) {
//           featuredData = response.data.data;
//         } else if (Array.isArray(response.data)) {
//           featuredData = response.data;
//         }
//       } else if (response.properties !== undefined) {
//         featuredData = Array.isArray(response.properties) ? response.properties : [];
//       } else if (Array.isArray(response)) {
//         featuredData = response;
//       }
      
//       console.log('✅ Featured properties extracted:', featuredData);
      
//       // ✅ CRITICAL FIX: Update the hook state with featured properties
//       setProperties(featuredData);
      
//       return featuredData;
//     } else {
//       throw new Error(response?.error || response?.message || 'Failed to fetch featured properties');
//     }
//   } catch (err) {
//     console.error('❌ Error fetching featured properties:', err);
//     setError(err.message || 'Failed to fetch featured properties');
//     return [];
//   } finally {
//     setLoading(false);
//   }
// }, [get]);

//   // Refetch properties with current filters
//   const refetch = useCallback(() => {
//     fetchProperties();
//   }, [fetchProperties]);

//   return {
//     // State
//     properties,
//     loading,
//     error,
//     pagination,
    
//     // Actions
//     fetchProperties,
//     fetchProperty,
//     createProperty,
//     updateProperty,
//     deleteProperty,
//     getFeaturedProperties,
//     refetch,
    
//     // Pagination helpers
//     currentPage: pagination.currentPage,
//     totalPages: pagination.totalPages,
//     totalItems: pagination.totalItems,
//     itemsPerPage: pagination.itemsPerPage,
    
//     // Utility
//     hasProperties: properties.length > 0,
//     isEmpty: !loading && properties.length === 0
//   };
// };

// // Hook for single property
// export const useProperty = (propertyId) => {
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const { get } = useApi();

//   const fetchProperty = useCallback(async (id) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await get(`/properties/${id}`);
      
//       console.log('🔍 Single Property API Response:', response);
      
//       if (response && response.success !== false) {
//         // ✅ FIXED: Handle deeply nested data structure
//         let propertyData = response;
        
//         // Debug: Log all possible data locations
//         console.log('🔍 response.data:', response.data);
//         console.log('🔍 response.data?.data:', response.data?.data);
        
//         // Extract from nested structure: response.data.data -> actual property
//         if (response.data?.data && (response.data.data.title || response.data.data.price)) {
//           propertyData = response.data.data;
//           console.log('✅ Extracted from response.data.data');
//         }
//         // If response.data is the actual property
//         else if (response.data && (response.data.title || response.data.price)) {
//           propertyData = response.data;
//           console.log('✅ Extracted from response.data');
//         }
//         // If response itself is the property (fallback)
//         else if (response.title || response.price) {
//           propertyData = response;
//           console.log('✅ Using response directly');
//         }
        
//         console.log('📊 Final property data:', propertyData);
//         setProperty(propertyData);
//       } else {
//         throw new Error(response?.error || response?.message || 'Failed to fetch property');
//       }
//     } catch (err) {
//       console.error('❌ Error fetching property:', err);
//       setError(err.message || 'An error occurred while fetching the property');
//     } finally {
//       setLoading(false);
//     }
//   }, [get]);

//   useEffect(() => {
//     if (propertyId) {
//       fetchProperty(propertyId);
//     }
//   }, [propertyId, fetchProperty]);

//   const refetch = useCallback(() => {
//     if (propertyId) {
//       fetchProperty(propertyId);
//     }
//   }, [propertyId, fetchProperty]);

//   return {
//     property,  // ✅ Now this should be the actual property object
//     loading,
//     error,
//     refetch,
//     exists: !!property && !loading
//   };
// };

// export default useProperties;


import { useState, useEffect, useCallback, useRef } from 'react';
import { propertiesAPI } from '../services/api';

export const useProperties = (filters = {}, searchMode = 'auto', immediate = false) => {
  // searchMode: 'auto', 'search', 'filter', 'quick'
  // immediate: whether to fetch immediately on mount
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Use refs for state management
  const filtersRef = useRef(filters);
  const hasFetchedRef = useRef(false);
  const abortControllerRef = useRef(null);
  const searchModeRef = useRef(searchMode);
  const isMountedRef = useRef(true);

  // Update ref when filters change
  useEffect(() => {
    const oldFilters = filtersRef.current;
    const newFilters = filters;
    
    const oldJson = JSON.stringify(oldFilters || {});
    const newJson = JSON.stringify(newFilters || {});
    
    if (oldJson !== newJson) {
      filtersRef.current = { ...newFilters };
    }
  }, [filters]);

  // Update search mode ref
  useEffect(() => {
    searchModeRef.current = searchMode;
  }, [searchMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Abort any pending request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch properties with filters
  const fetchProperties = useCallback(async (customFilters = null, customSearchMode = null) => {
    if (!isMountedRef.current) return;

    try {
      // Abort previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        console.log('🛑 Aborted previous request');
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      const filtersToUse = customFilters !== undefined ? customFilters : filtersRef.current;
      const currentSearchMode = customSearchMode || searchModeRef.current;
      
      // Don't fetch if no filters (empty object)
      if (!filtersToUse || Object.keys(filtersToUse).length === 0) {
        console.log('⏸️ Skipping fetch - no filters provided');
        if (isMountedRef.current) {
          setProperties([]);
          setLoading(false);
        }
        return;
      }

      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }
      
      console.log(`🔍 Fetching properties with mode: ${currentSearchMode}`, filtersToUse);
      
      let response;
      const signal = abortControllerRef.current.signal;
      
      // Use the appropriate API method based on search mode
      switch (currentSearchMode) {
        case 'search':
          // Use advanced search
          response = await propertiesAPI.advancedSearch({
            ...filtersToUse,
            signal
          });
          break;
          
        case 'filter':
          // Use filter only
          response = await propertiesAPI.filterProperties({
            ...filtersToUse,
            signal
          });
          break;
          
        case 'quick':
          // Use quick search
          response = await propertiesAPI.quickSearch(
            filtersToUse.search || filtersToUse.q,
            { ...filtersToUse, signal }
          );
          break;
          
        case 'auto':
        default:
          // Auto-detect: use unified search method
          response = await propertiesAPI.searchProperties({
            ...filtersToUse,
            signal
          }, 'auto');
          break;
      }
      
      console.log('🔍 API Response:', response);
      
      if (response && response.data && response.data.success !== false) {
        // Extract data properly from API response
        let propertiesData = [];
        let paginationData = {};
        
        // Handle different response structures
        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            propertiesData = response.data.data;
          } else if (Array.isArray(response.data)) {
            propertiesData = response.data;
          }
        } else if (response.data.properties !== undefined) {
          propertiesData = Array.isArray(response.data.properties) ? response.data.properties : [];
        } else if (Array.isArray(response.data)) {
          propertiesData = response.data;
        }
        
        // Extract pagination data
        if (response.data.pagination) {
          paginationData = response.data.pagination;
        } else {
          // Fallback to direct response fields
          paginationData = {
            page: response.data.page || 1,
            pages: response.data.pages || 1,
            total: response.data.total || response.data.count || propertiesData.length,
            limit: response.data.limit || 12
          };
        }
        
        console.log(`✅ Found ${propertiesData.length} properties`);
        
        if (isMountedRef.current) {
          setProperties(propertiesData);
          setPagination({
            currentPage: paginationData.page || 1,
            totalPages: paginationData.pages || 1,
            totalItems: paginationData.total || propertiesData.length,
            itemsPerPage: paginationData.limit || 12
          });
        }
        
        // Mark that we have fetched
        hasFetchedRef.current = true;
        
        return propertiesData;
      } else {
        const errorMsg = response?.data?.error || response?.data?.message || 'Failed to fetch properties';
        console.error('❌ API returned error:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      // Don't set error for aborted requests
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        console.log('🛑 Request aborted');
        return;
      }
      
      console.error('❌ Error fetching properties:', err);
      if (isMountedRef.current) {
        setError(err.message || 'An error occurred while fetching properties');
        setProperties([]);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, []);

  // Initial fetch if immediate is true
  useEffect(() => {
    if (immediate && Object.keys(filters).length > 0) {
      fetchProperties();
    }
  }, []); // Run only once on mount

  // Refetch when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(filters).length > 0) {
        fetchProperties();
      }
    }, 300); // Debounce to prevent rapid firing
    
    return () => clearTimeout(timeoutId);
  }, [filters, fetchProperties]);

  // Fetch single property by ID
  const fetchProperty = useCallback(async (propertyId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertiesAPI.getProperty(propertyId);
      
      console.log('🔍 Single Property API Response:', response);
      
      if (response && response.data && response.data.success !== false) {
        // Handle nested data structure
        let propertyData = response.data;
        
        if (response.data.data) {
          if (response.data.data.title || response.data.data.price) {
            propertyData = response.data.data;
          } 
          else if (response.data.title || response.data.price) {
            propertyData = response.data;
          }
        }
        
        return propertyData;
      } else {
        throw new Error(response?.data?.error || response?.data?.message || 'Failed to fetch property');
      }
    } catch (err) {
      console.error('❌ Error fetching property:', err);
      setError(err.message || 'An error occurred while fetching the property');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new property
  const createProperty = useCallback(async (propertyData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertiesAPI.createProperty(propertyData);
      
      console.log('🔍 Create Property API Response:', response);
      
      if (response && response.data && response.data.success !== false) {
        // Extract the created property data from nested structure
        let newProperty = response.data;
        
        if (response.data.data && (response.data.data.title || response.data.data.price)) {
          newProperty = response.data.data;
        } else if (response.data.title || response.data.price) {
          newProperty = response.data;
        }
        
        setProperties(prev => [newProperty, ...prev]);
        return newProperty;
      } else {
        throw new Error(response?.data?.error || response?.data?.message || 'Failed to create property');
      }
    } catch (err) {
      console.error('❌ Error creating property:', err);
      setError(err.message || 'An error occurred while creating the property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update property
  const updateProperty = useCallback(async (propertyId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertiesAPI.updateProperty(propertyId, updates);
      
      console.log('🔍 Update Property API Response:', response);
      
      if (response && response.data && response.data.success !== false) {
        // Extract the updated property data from nested structure
        let updatedProperty = response.data;
        
        if (response.data.data && (response.data.data.title || response.data.data.price)) {
          updatedProperty = response.data.data;
        } else if (response.data.title || response.data.price) {
          updatedProperty = response.data;
        }
        
        setProperties(prev => 
          prev.map(prop => prop._id === propertyId || prop.id === propertyId ? updatedProperty : prop)
        );
        return updatedProperty;
      } else {
        throw new Error(response?.data?.error || response?.data?.message || 'Failed to update property');
      }
    } catch (err) {
      console.error('❌ Error updating property:', err);
      setError(err.message || 'An error occurred while updating the property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete property
  const deleteProperty = useCallback(async (propertyId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertiesAPI.deleteProperty(propertyId);
      
      console.log('🔍 Delete Property API Response:', response);
      
      if (response && response.data && response.data.success !== false) {
        // Remove the property from the list
        setProperties(prev => prev.filter(prop => prop._id !== propertyId && prop.id !== propertyId));
        return true;
      } else {
        throw new Error(response?.data?.error || response?.data?.message || 'Failed to delete property');
      }
    } catch (err) {
      console.error('❌ Error deleting property:', err);
      setError(err.message || 'An error occurred while deleting the property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get featured properties
  const getFeaturedProperties = useCallback(async (limit = 6) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching featured properties...');
      const response = await propertiesAPI.getFeaturedProperties(limit);
      
      console.log('🔍 Featured Properties API Response:', response);
      
      if (response && response.data && response.data.success !== false) {
        // Extract featured properties data from nested structure
        let featuredData = [];
        
        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            featuredData = response.data.data;
          } else if (Array.isArray(response.data)) {
            featuredData = response.data;
          }
        } else if (response.data.properties !== undefined) {
          featuredData = Array.isArray(response.data.properties) ? response.data.properties : [];
        } else if (Array.isArray(response.data)) {
          featuredData = response.data;
        }
        
        console.log('✅ Featured properties extracted:', featuredData.length);
        
        setProperties(featuredData);
        return featuredData;
      } else {
        throw new Error(response?.data?.error || response?.data?.message || 'Failed to fetch featured properties');
      }
    } catch (err) {
      console.error('❌ Error fetching featured properties:', err);
      setError(err.message || 'Failed to fetch featured properties');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Search properties (using advanced search endpoint)
  const searchProperties = useCallback(async (searchFilters) => {
    return fetchProperties(searchFilters, 'search');
  }, [fetchProperties]);

  // Filter properties (using filter endpoint)
  const filterProperties = useCallback(async (filterParams) => {
    return fetchProperties(filterParams, 'filter');
  }, [fetchProperties]);

  // Quick search properties
  const quickSearch = useCallback(async (searchTerm, filters = {}) => {
    const searchFilters = { ...filters, search: searchTerm, q: searchTerm };
    return fetchProperties(searchFilters, 'quick');
  }, [fetchProperties]);

  // Refetch properties with current filters
  const refetch = useCallback(() => {
    return fetchProperties();
  }, [fetchProperties]);

  // Clear properties
  const clearProperties = useCallback(() => {
    setProperties([]);
    setError(null);
    hasFetchedRef.current = false;
  }, []);

  return {
    // State
    properties,
    loading,
    error,
    pagination,
    
    // Actions
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getFeaturedProperties,
    searchProperties,    // Dedicated search method
    filterProperties,    // Dedicated filter method
    quickSearch,         // Quick search method
    refetch,
    clearProperties,
    
    // Pagination helpers
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    itemsPerPage: pagination.itemsPerPage,
    
    // Utility
    hasProperties: properties.length > 0,
    isEmpty: !loading && properties.length === 0,
    hasSearched: hasFetchedRef.current
  };
};

// Hook for single property
export const useProperty = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProperty = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertiesAPI.getProperty(id);
      
      console.log('🔍 Single Property API Response:', response);
      
      if (response && response.data && response.data.success !== false) {
        let propertyData = response.data;
        
        console.log('🔍 response.data:', response.data);
        console.log('🔍 response.data?.data:', response.data?.data);
        
        if (response.data.data && (response.data.data.title || response.data.data.price)) {
          propertyData = response.data.data;
          console.log('✅ Extracted from response.data.data');
        } 
        else if (response.data.title || response.data.price) {
          propertyData = response.data;
          console.log('✅ Extracted from response.data');
        }
        
        console.log('📊 Final property data:', propertyData);
        setProperty(propertyData);
      } else {
        throw new Error(response?.data?.error || response?.data?.message || 'Failed to fetch property');
      }
    } catch (err) {
      console.error('❌ Error fetching property:', err);
      setError(err.message || 'An error occurred while fetching the property');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId);
    }
  }, [propertyId, fetchProperty]);

  const refetch = useCallback(() => {
    if (propertyId) {
      fetchProperty(propertyId);
    }
  }, [propertyId, fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch,
    exists: !!property && !loading
  };
};

export default useProperties;