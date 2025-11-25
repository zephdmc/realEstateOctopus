import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from './useApi';

export const useProperties = (filters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  const { get, post, put, del } = useApi();
  
  // Use ref to prevent infinite loops with filters object
  const filtersRef = useRef(filters);
  const initialLoadRef = useRef(true);

  // Update ref when filters actually change
  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(filtersRef.current);
    if (filtersChanged) {
      filtersRef.current = { ...filters };
    }
  }, [filters]);

  // Fetch properties with filters
  const fetchProperties = useCallback(async (customFilters = null) => {
    try {
      setLoading(true);
      setError(null);

      const filtersToUse = customFilters || filtersRef.current;
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', filtersToUse.page || '1');
      queryParams.append('limit', filtersToUse.limit || '12');
      
      // Add filter parameters
      Object.entries(filtersToUse).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && !['page', 'limit'].includes(key)) {
          queryParams.append(key, value.toString());
        }
      });

      console.log('📡 Fetching properties with filters:', filtersToUse);
      
      const response = await get(`/properties?${queryParams.toString()}`);
      
      console.log('🔍 Properties API Response:', response);
      
      if (response && response.success !== false) {
        // Extract data properly from API response
        let propertiesData = [];
        let paginationData = {};
        
        // Handle nested data structure: response.data.data or response.data
        if (response.data) {
          if (Array.isArray(response.data.data)) {
            propertiesData = response.data.data;
          } else if (Array.isArray(response.data)) {
            propertiesData = response.data;
          }
        } else if (response.properties !== undefined) {
          propertiesData = Array.isArray(response.properties) ? response.properties : [];
        } else if (Array.isArray(response)) {
          propertiesData = response;
        }
        
        // Extract pagination data
        if (response.pagination) {
          paginationData = response.pagination;
        } else if (response.data?.pagination) {
          paginationData = response.data.pagination;
        } else {
          // Fallback to direct response fields
          paginationData = {
            page: response.page || response.currentPage || 1,
            pages: response.pages || response.totalPages || 1,
            total: response.total || response.count || propertiesData.length,
            limit: response.limit || response.itemsPerPage || 12
          };
        }
        
        console.log('📊 Processed properties:', propertiesData);
        console.log('📊 Processed pagination:', paginationData);
        
        setProperties(propertiesData);
        setPagination({
          currentPage: paginationData.page || 1,
          totalPages: paginationData.pages || 1,
          totalItems: paginationData.total || propertiesData.length,
          itemsPerPage: paginationData.limit || 12
        });
      } else {
        throw new Error(response?.error || response?.message || 'Failed to fetch properties');
      }
    } catch (err) {
      console.error('❌ Error fetching properties:', err);
      setError(err.message || 'An error occurred while fetching properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [get]);

  // Initial fetch
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      fetchProperties();
    }
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (!initialLoadRef.current) {
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(filtersRef.current);
      if (filtersChanged) {
        filtersRef.current = { ...filters };
        fetchProperties(filters);
      }
    }
  }, [filters, fetchProperties]);

  // Fetch single property by ID
  const fetchProperty = useCallback(async (propertyId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await get(`/properties/${propertyId}`);
      
      console.log('🔍 Single Property API Response:', response);
      
      if (response && response.success !== false) {
        // Handle nested data structure
        let propertyData = response;
        
        if (response.data) {
          // If response.data has its own data property, that's the actual property
          if (response.data.data && (response.data.data.title || response.data.data.price)) {
            propertyData = response.data.data;
          } 
          // If response.data is the property object
          else if (response.data.title || response.data.price) {
            propertyData = response.data;
          }
        }
        
        return propertyData;
      } else {
        throw new Error(response?.error || response?.message || 'Failed to fetch property');
      }
    } catch (err) {
      console.error('❌ Error fetching property:', err);
      setError(err.message || 'An error occurred while fetching the property');
      return null;
    } finally {
      setLoading(false);
    }
  }, [get]);

  // Create new property
  const createProperty = useCallback(async (propertyData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await post('/properties', propertyData);
      
      console.log('🔍 Create Property API Response:', response);
      
      if (response && response.success !== false) {
        // Extract the created property data from nested structure
        let newProperty = response;
        if (response.data) {
          if (response.data.data && (response.data.data.title || response.data.data.price)) {
            newProperty = response.data.data;
          } else if (response.data.title || response.data.price) {
            newProperty = response.data;
          }
        }
        
        setProperties(prev => [newProperty, ...prev]);
        return newProperty;
      } else {
        throw new Error(response?.error || response?.message || 'Failed to create property');
      }
    } catch (err) {
      console.error('❌ Error creating property:', err);
      setError(err.message || 'An error occurred while creating the property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [post]);

  // Update property
  const updateProperty = useCallback(async (propertyId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const response = await put(`/properties/${propertyId}`, updates);
      
      console.log('🔍 Update Property API Response:', response);
      
      if (response && response.success !== false) {
        // Extract the updated property data from nested structure
        let updatedProperty = response;
        if (response.data) {
          if (response.data.data && (response.data.data.title || response.data.data.price)) {
            updatedProperty = response.data.data;
          } else if (response.data.title || response.data.price) {
            updatedProperty = response.data;
          }
        }
        
        setProperties(prev => 
          prev.map(prop => prop._id === propertyId || prop.id === propertyId ? updatedProperty : prop)
        );
        return updatedProperty;
      } else {
        throw new Error(response?.error || response?.message || 'Failed to update property');
      }
    } catch (err) {
      console.error('❌ Error updating property:', err);
      setError(err.message || 'An error occurred while updating the property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  // Delete property
  const deleteProperty = useCallback(async (propertyId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await del(`/properties/${propertyId}`);
      
      console.log('🔍 Delete Property API Response:', response);
      
      if (response && response.success !== false) {
        // Remove the property from the list
        setProperties(prev => prev.filter(prop => prop._id !== propertyId && prop.id !== propertyId));
        return true;
      } else {
        throw new Error(response?.error || response?.message || 'Failed to delete property');
      }
    } catch (err) {
      console.error('❌ Error deleting property:', err);
      setError(err.message || 'An error occurred while deleting the property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [del]);

// Get featured properties - UPDATED VERSION
// In your useProperties.js file, update the getFeaturedProperties method:

// Get featured properties - FIXED VERSION
const getFeaturedProperties = useCallback(async (limit = 6) => {
  try {
    setLoading(true);
    setError(null);

    console.log('🔄 Fetching featured properties...');
    const response = await get(`/properties/featured?limit=${limit}`);
    
    console.log('🔍 Featured Properties API Response:', response);
    
    if (response && response.success !== false) {
      // Extract featured properties data from nested structure
      let featuredData = [];
      
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          featuredData = response.data.data;
        } else if (Array.isArray(response.data)) {
          featuredData = response.data;
        }
      } else if (response.properties !== undefined) {
        featuredData = Array.isArray(response.properties) ? response.properties : [];
      } else if (Array.isArray(response)) {
        featuredData = response;
      }
      
      console.log('✅ Featured properties extracted:', featuredData);
      
      // ✅ CRITICAL FIX: Update the hook state with featured properties
      setProperties(featuredData);
      
      return featuredData;
    } else {
      throw new Error(response?.error || response?.message || 'Failed to fetch featured properties');
    }
  } catch (err) {
    console.error('❌ Error fetching featured properties:', err);
    setError(err.message || 'Failed to fetch featured properties');
    return [];
  } finally {
    setLoading(false);
  }
}, [get]);

  // Refetch properties with current filters
  const refetch = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

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
    refetch,
    
    // Pagination helpers
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    itemsPerPage: pagination.itemsPerPage,
    
    // Utility
    hasProperties: properties.length > 0,
    isEmpty: !loading && properties.length === 0
  };
};

// Hook for single property
export const useProperty = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { get } = useApi();

  const fetchProperty = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await get(`/properties/${id}`);
      
      console.log('🔍 Single Property API Response:', response);
      
      if (response && response.success !== false) {
        // ✅ FIXED: Handle deeply nested data structure
        let propertyData = response;
        
        // Debug: Log all possible data locations
        console.log('🔍 response.data:', response.data);
        console.log('🔍 response.data?.data:', response.data?.data);
        
        // Extract from nested structure: response.data.data -> actual property
        if (response.data?.data && (response.data.data.title || response.data.data.price)) {
          propertyData = response.data.data;
          console.log('✅ Extracted from response.data.data');
        } 
        // If response.data is the actual property
        else if (response.data && (response.data.title || response.data.price)) {
          propertyData = response.data;
          console.log('✅ Extracted from response.data');
        }
        // If response itself is the property (fallback)
        else if (response.title || response.price) {
          propertyData = response;
          console.log('✅ Using response directly');
        }
        
        console.log('📊 Final property data:', propertyData);
        setProperty(propertyData);
      } else {
        throw new Error(response?.error || response?.message || 'Failed to fetch property');
      }
    } catch (err) {
      console.error('❌ Error fetching property:', err);
      setError(err.message || 'An error occurred while fetching the property');
    } finally {
      setLoading(false);
    }
  }, [get]);

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
    property,  // ✅ Now this should be the actual property object
    loading,
    error,
    refetch,
    exists: !!property && !loading
  };
};

export default useProperties;