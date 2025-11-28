import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, RefreshCw, AlertCircle, X, Upload, MapPin, Image as ImageIcon } from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import { uploadService } from '../../services/uploadService';
import { formatPrice, formatPropertyType, formatPropertyStatus } from '../../utils/formatters';
import { PROPERTY_TYPES, PROPERTY_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxM0MxNi4xMyAxMyAxMyAxNi4xMyAxMyAyMEMxMyAyMy44NyAxNi4xMyAyNyAyMCAyN0MyMy44NyAyNyAyNyAyMy44NyAyNyAyMEMyNyAxNi4xMyAyMy44NyAxMyAyMCAxM1pNMjAgMjVDMTcuMjQgMjUgMTUgMjIuNzYgMTUgMjBDMTUgMTcuMjQgMTcuMjQgMTUgMjAgMTVDMjIuNzYgMTUgMjUgMTcuMjQgMjUgMjBDMjUgMjIuNzYgMjIuNzYgMjUgMjAgMjVaTTI2IDlIMTRDMTIuOSA5IDEyIDguMSAxMiA3VjRDMTIgMi45IDEyLjkgMiAxNCAySDI2QzI3LjEgMiAyOCAyLjkgMjggNFY3QzI4IDguMSAyNy4xIDkgMjYgOVpNMjYgN1Y0SDE0VjdIMjZaIiBmaWxsPSIjOUNBM0FCIi8+Cjwvc3ZnPgo=';

const PropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  // Property Form State
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    type: 'house',
    status: 'for-sale',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    specifications: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      areaUnit: 'sqft',
      yearBuilt: '',
      floors: '1',
      parking: '0'
    },
    amenities: []
  });

  // Image Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [featuredImageId, setFeaturedImageId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize form with empty state
  const initializeForm = () => ({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    type: 'house',
    status: 'for-sale',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    specifications: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      areaUnit: 'sqft',
      yearBuilt: '',
      floors: '1',
      parking: '0'
    },
    amenities: []
  });

  // Fetch properties from API - FIXED DATA STRUCTURE
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await propertiesAPI.getMyProperties();
      
      console.log('📦 Raw API response:', response);
      
      let propertiesData = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        propertiesData = response;
      } else if (response && typeof response === 'object') {
        propertiesData = response.data || response.properties || [];
      }
      
      if (!Array.isArray(propertiesData)) {
        console.warn('⚠️ Properties data is not an array:', propertiesData);
        propertiesData = [];
      }

      console.log('✅ Processed properties:', propertiesData);
      
      // Normalize property data structure
      const normalizedProperties = propertiesData.map(property => ({
        _id: property._id || property.id,
        title: property.title || 'Untitled Property',
        description: property.description || '',
        price: property.price || 0,
        currency: property.currency || 'USD',
        type: property.type || 'house',
        status: property.status || 'for-sale',
        location: property.location || {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        },
        specifications: property.specifications || {
          bedrooms: 0,
          bathrooms: 0,
          area: 0,
          areaUnit: 'sqft',
          yearBuilt: '',
          floors: 1,
          parking: 0
        },
        amenities: property.amenities || [],
        images: property.images || [],
        featuredImage: property.featuredImage,
        createdBy: property.createdBy,
        agentId: property.agentId,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
      }));

      setProperties(normalizedProperties);
      setFilteredProperties(normalizedProperties);
      
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
      setError(error.message || ERROR_MESSAGES.DEFAULT);
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Filter properties based on search and filters
  useEffect(() => {
    if (!Array.isArray(properties)) {
      setFilteredProperties([]);
      return;
    }

    let filtered = properties.filter(property => {
      const matchesSearch = searchTerm === '' || 
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      const matchesType = typeFilter === 'all' || property.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, typeFilter]);

  // IMAGE UPLOAD FUNCTIONS (keep existing)
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
  
    setUploading(true);
    setUploadProgress(0);
    setError('');
  
    try {
      console.log('🔄 Starting image upload...');
      
      const response = await uploadService.uploadMultipleFiles(files, 'property');
      
      console.log('📦 Upload service response:', response);
      
      const uploadedFiles = response.data;
      
      if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
        throw new Error('Upload service returned invalid data format');
      }
  
      const newImages = uploadedFiles.map(upload => ({
        id: upload._id || upload.id,
        url: upload.url || upload.path || upload.secure_url,
        name: upload.originalName || upload.name || 'Property Image',
        cloudinaryId: upload.cloudinaryId || upload.public_id
      }));
      
      setUploadedImages(prev => [...prev, ...newImages]);
      
      if (!featuredImageId && newImages.length > 0) {
        setFeaturedImageId(newImages[0].id);
      }
      
      setSuccess(`Successfully uploaded ${newImages.length} images`);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setError(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async (imageId) => {
    try {
      await uploadService.deleteUpload(imageId);
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      
      if (featuredImageId === imageId) {
        setFeaturedImageId(uploadedImages[0]?.id || null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete image');
    }
  };

  const setAsFeatured = (imageId) => {
    setFeaturedImageId(imageId);
  };

  const clearAllImages = () => {
    setUploadedImages([]);
    setFeaturedImageId(null);
  };

  // CRUD Operations - UPDATED WITH BETTER ERROR HANDLING

  // CREATE - Add new property with images
  const handleAddProperty = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      setError('');

      // Validation
      const validationErrors = [];
      if (!propertyForm.title.trim()) validationErrors.push('Property title is required');
      if (!propertyForm.description.trim()) validationErrors.push('Property description is required');
      if (!propertyForm.price || propertyForm.price <= 0) validationErrors.push('Valid price is required');
      if (!propertyForm.location.address.trim()) validationErrors.push('Address is required');
      if (!propertyForm.location.city.trim()) validationErrors.push('City is required');
      if (!propertyForm.location.state.trim()) validationErrors.push('State is required');
      if (!propertyForm.location.zipCode.trim()) validationErrors.push('ZIP code is required');
      if (!propertyForm.specifications.bedrooms || propertyForm.specifications.bedrooms < 0) validationErrors.push('Number of bedrooms is required');
      if (!propertyForm.specifications.bathrooms || propertyForm.specifications.bathrooms < 0) validationErrors.push('Number of bathrooms is required');
      if (!propertyForm.specifications.area || propertyForm.specifications.area < 0) validationErrors.push('Property area is required');
      if (uploadedImages.length === 0) validationErrors.push('At least one property image is required');

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Prepare property data with images
      const imageIds = uploadedImages.map(img => img.id);
      
      const propertyData = {
        title: propertyForm.title.trim(),
        description: propertyForm.description.trim(),
        price: parseFloat(propertyForm.price),
        currency: propertyForm.currency,
        type: propertyForm.type,
        status: propertyForm.status,
        location: {
          address: propertyForm.location.address.trim(),
          city: propertyForm.location.city.trim(),
          state: propertyForm.location.state.trim(),
          zipCode: propertyForm.location.zipCode.trim(),
          country: propertyForm.location.country
        },
        specifications: {
          bedrooms: parseInt(propertyForm.specifications.bedrooms),
          bathrooms: parseFloat(propertyForm.specifications.bathrooms),
          area: parseInt(propertyForm.specifications.area),
          areaUnit: propertyForm.specifications.areaUnit,
          floors: parseInt(propertyForm.specifications.floors) || 1,
          parking: parseInt(propertyForm.specifications.parking) || 0
        },
        amenities: propertyForm.amenities,
        images: imageIds,
        featuredImage: featuredImageId,
        createdBy: user?.uid,
        agentId: user?.uid
      };

      // Add optional yearBuilt if provided
      if (propertyForm.specifications.yearBuilt && propertyForm.specifications.yearBuilt.trim()) {
        propertyData.specifications.yearBuilt = parseInt(propertyForm.specifications.yearBuilt);
      }

      console.log('🏠 Creating property with data:', propertyData);

      const response = await propertiesAPI.createProperty(propertyData);
      
      // Handle different response structures
      const createdProperty = response.data || response;
      
      // Update local state
      setProperties(prev => [createdProperty, ...prev]);
      setSuccess(SUCCESS_MESSAGES.PROPERTY_CREATED);
      handleCloseAddModal();

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('❌ Error creating property:', error);
      setError(error.message || ERROR_MESSAGES.DEFAULT);
    } finally {
      setUploading(false);
    }
  }, [propertyForm, user, uploadedImages, featuredImageId]);

  // READ - Open edit modal with property data - FIXED DATA STRUCTURE
  const handleEditProperty = useCallback((property) => {
    if (!property) return;
    
    console.log('📝 Editing property:', property);
    
    setSelectedProperty(property);
    setPropertyForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      currency: property.currency || 'USD',
      type: property.type || 'house',
      status: property.status || 'for-sale',
      location: {
        address: property.location?.address || '',
        city: property.location?.city || '',
        state: property.location?.state || '',
        zipCode: property.location?.zipCode || '',
        country: property.location?.country || 'United States'
      },
      specifications: {
        bedrooms: property.specifications?.bedrooms || '',
        bathrooms: property.specifications?.bathrooms || '',
        area: property.specifications?.area || '',
        areaUnit: property.specifications?.areaUnit || 'sqft',
        yearBuilt: property.specifications?.yearBuilt || '',
        floors: property.specifications?.floors || '1',
        parking: property.specifications?.parking || '0'
      },
      amenities: property.amenities || []
    });

    // Set existing images
    if (property.images && Array.isArray(property.images)) {
      const existingImages = property.images.map(img => {
        // Handle both string IDs and image objects
        if (typeof img === 'string') {
          return {
            id: img,
            url: PLACEHOLDER_IMAGE,
            name: 'Property Image'
          };
        } else {
          return {
            id: img._id || img.id,
            url: img.url || PLACEHOLDER_IMAGE,
            name: img.originalName || 'Property Image'
          };
        }
      });
      setUploadedImages(existingImages);
      setFeaturedImageId(property.featuredImage || (existingImages[0]?.id || null));
    } else {
      setUploadedImages([]);
      setFeaturedImageId(null);
    }

    setShowEditModal(true);
  }, []);

  // UPDATE - Update existing property with images
  const handleUpdateProperty = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      setError('');

      if (!selectedProperty) {
        throw new Error('No property selected for update');
      }

      // Prepare update data with images
      const imageIds = uploadedImages.map(img => img.id);
      
      const updateData = {
        title: propertyForm.title.trim(),
        description: propertyForm.description.trim(),
        price: parseFloat(propertyForm.price),
        currency: propertyForm.currency,
        type: propertyForm.type,
        status: propertyForm.status,
        location: {
          address: propertyForm.location.address.trim(),
          city: propertyForm.location.city.trim(),
          state: propertyForm.location.state.trim(),
          zipCode: propertyForm.location.zipCode.trim(),
          country: propertyForm.location.country
        },
        specifications: {
          bedrooms: parseInt(propertyForm.specifications.bedrooms),
          bathrooms: parseFloat(propertyForm.specifications.bathrooms),
          area: parseInt(propertyForm.specifications.area),
          areaUnit: propertyForm.specifications.areaUnit,
          floors: parseInt(propertyForm.specifications.floors) || 1,
          parking: parseInt(propertyForm.specifications.parking) || 0
        },
        amenities: propertyForm.amenities,
        images: imageIds,
        featuredImage: featuredImageId
      };

      // Add optional yearBuilt if provided
      if (propertyForm.specifications.yearBuilt && propertyForm.specifications.yearBuilt.trim()) {
        updateData.specifications.yearBuilt = parseInt(propertyForm.specifications.yearBuilt);
      }

      console.log('🔄 Updating property with data:', updateData);

      const response = await propertiesAPI.updateProperty(selectedProperty._id, updateData);
      
      // Handle different response structures
      const updatedProperty = response.data || response;
      
      // Update local state
      setProperties(prev => 
        prev.map(p => p._id === selectedProperty._id ? updatedProperty : p)
      );
      setSuccess(SUCCESS_MESSAGES.PROPERTY_UPDATED);
      handleCloseEditModal();

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('❌ Error updating property:', error);
      
      let errorMessage = error.message || ERROR_MESSAGES.DEFAULT;
      
      if (error.status === 400 && error.data) {
        if (error.data.details && error.data.details.length > 0) {
          errorMessage = `Validation failed: ${error.data.details.join(', ')}`;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [propertyForm, selectedProperty, uploadedImages, featuredImageId]);

  // DELETE - Remove property
  const handleDeleteProperty = useCallback((property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedProperty) {
      setError('No property selected for deletion');
      setShowDeleteModal(false);
      return;
    }

    try {
      setError('');
      await propertiesAPI.deleteProperty(selectedProperty._id);
      
      // Update local state
      setProperties(prev => prev.filter(p => p._id !== selectedProperty._id));
      setShowDeleteModal(false);
      setSelectedProperty(null);
      setSuccess(SUCCESS_MESSAGES.PROPERTY_DELETED);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }, [selectedProperty]);

  // Form Handlers (keep existing)
  const handleInputChange = useCallback((field, value) => {
    setPropertyForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleLocationChange = useCallback((field, value) => {
    setPropertyForm(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  }, []);

  const handleSpecificationsChange = useCallback((field, value) => {
    setPropertyForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  }, []);

  const handleAmenityToggle = useCallback((amenity) => {
    setPropertyForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }, []);

  // Modal Handlers
  const handleOpenAddModal = useCallback(() => {
    setPropertyForm(initializeForm());
    setUploadedImages([]);
    setFeaturedImageId(null);
    setShowAddModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
    setPropertyForm(initializeForm());
    setUploadedImages([]);
    setFeaturedImageId(null);
    setError('');
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedProperty(null);
    setPropertyForm(initializeForm());
    setUploadedImages([]);
    setFeaturedImageId(null);
    setError('');
  }, []);

  const handleRefresh = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleViewProperty = useCallback((property) => {
    if (!property) return;
    window.location.href = `/properties/${property._id}`;
  }, []);

  // Helper functions - FIXED DATA ACCESS
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'for-sale': return 'bg-green-100 text-green-800';
      case 'for-rent': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      case 'rented': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getTypeColor = useCallback((type) => {
    switch (type) {
      case 'villa': return 'bg-purple-100 text-purple-800';
      case 'apartment': return 'bg-blue-100 text-blue-800';
      case 'house': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-orange-100 text-orange-800';
      case 'land': return 'bg-yellow-100 text-yellow-800';
      case 'condo': return 'bg-pink-100 text-pink-800';
      case 'townhouse': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // FIXED: Better image handling
  const getPropertyImage = useCallback((property) => {
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      // Handle both string IDs and image objects
      if (typeof firstImage === 'string') {
        return PLACEHOLDER_IMAGE;
      } else if (firstImage.url && firstImage.url.startsWith('http')) {
        return firstImage.url;
      }
    }
    return PLACEHOLDER_IMAGE;
  }, []);

  // FIXED: Better location formatting
  const getPropertyLocation = useCallback((property) => {
    const location = property.location || {};
    const parts = [location.address, location.city, location.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  }, []);

  // FIXED: Better property details formatting
  const getPropertyDetails = useCallback((property) => {
    const specs = property.specifications || {};
    const bedrooms = specs.bedrooms || 0;
    const bathrooms = specs.bathrooms || 0;
    const area = specs.area || 0;
    const areaUnit = specs.areaUnit || 'sqft';
    
    return `${bedrooms} beds • ${bathrooms} baths • ${area} ${areaUnit}`;
  }, []);

  // FIXED: Better price formatting with fallback
  const formatPropertyPrice = useCallback((property) => {
    if (!property.price || property.price === 0) {
      return 'Price on request';
    }
    return formatPrice(property.price, property.currency);
  }, []);

  // Options for selects (keep existing)
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'for-sale', label: 'For Sale' },
    { value: 'for-rent', label: 'For Rent' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' }
  ];

  const propertyTypeOptions = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const statusTypeOptions = [
    { value: 'for-sale', label: 'For Sale' },
    { value: 'for-rent', label: 'For Rent' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  const amenityOptions = [
    { value: 'swimming-pool', label: 'Swimming Pool' },
    { value: 'garden', label: 'Garden' },
    { value: 'garage', label: 'Garage' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'fireplace', label: 'Fireplace' },
    { value: 'air-conditioning', label: 'Air Conditioning' },
    { value: 'heating', label: 'Heating' },
    { value: 'security-system', label: 'Security System' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'gym', label: 'Gym' },
    { value: 'parking', label: 'Parking' },
    { value: 'furnished', label: 'Furnished' },
    { value: 'pet-friendly', label: 'Pet Friendly' }
  ];

  // Property Form Component (keep existing)
  // ... (keep the same PropertyForm component)

  // Loading State
  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRefresh}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add New Property</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-green-600 text-sm">{success}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Filter Button */}
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors">
            <Filter size={20} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Properties Table - FIXED DATA DISPLAY */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={getPropertyImage(property)}
                          alt={property.title}
                          onError={(e) => {
                            if (e.target.src !== PLACEHOLDER_IMAGE) {
                              e.target.src = PLACEHOLDER_IMAGE;
                            }
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getPropertyDetails(property)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(property.type)}`}>
                      {formatPropertyType(property.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPropertyPrice(property)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                      {formatPropertyStatus(property.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPropertyLocation(property)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        onClick={() => handleViewProperty(property)}
                        title="View Property"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 transition-colors"
                        onClick={() => handleEditProperty(property)}
                        title="Edit Property"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 transition-colors"
                        onClick={() => handleDeleteProperty(property)}
                        title="Delete Property"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
            <p className="text-gray-500 mt-1">
              {properties.length === 0 ? 'You haven\'t added any properties yet.' : 'Try adjusting your search or filters'}
            </p>
            
            {properties.length === 0 && (
              <button
                onClick={handleOpenAddModal}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Add Your First Property
              </button>
            )}
          </div>
        )}

        {loading && properties.length > 0 && (
          <div className="text-center py-4">
            <RefreshCw className="animate-spin mx-auto text-gray-400" size={20} />
            <p className="text-gray-500 mt-2">Updating properties...</p>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <PropertyForm
          isEdit={false}
          onSubmit={handleAddProperty}
          onCancel={handleCloseAddModal}
        />
      )}

      {/* Edit Property Modal */}
      {showEditModal && (
        <PropertyForm
          isEdit={true}
          onSubmit={handleUpdateProperty}
          onCancel={handleCloseEditModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Delete Property</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesManagement;