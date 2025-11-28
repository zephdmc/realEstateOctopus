


import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, RefreshCw, AlertCircle, X, Upload, MapPin, Image as ImageIcon } from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import { uploadService } from '../../services/uploadService'; // Add this import
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

  // Property Form State - ADD IMAGE STATES
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

  // Initialize form with empty state - UPDATE THIS
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

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await propertiesAPI.getMyProperties();
      
      let propertiesData = [];
      
      if (Array.isArray(response)) {
        propertiesData = response;
      } else if (response && typeof response === 'object') {
        propertiesData = response.data || response.properties || [];
      }
      
      if (!Array.isArray(propertiesData)) {
        propertiesData = [];
      }

      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
      
    } catch (error) {
      console.error('Error fetching properties:', error);
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

  // IMAGE UPLOAD FUNCTIONS
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
  
    setUploading(true);
    setUploadProgress(0);
    setError(''); // Clear previous errors
  
    try {
      // Validate files first
      const validation = uploadService.processFiles(files, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });
  
      if (!validation.canUpload) {
        throw new Error(`Invalid files: ${validation.errors.join(', ')}`);
      }
  
      // Upload files with progress tracking
      const onProgress = (progress) => {
        setUploadProgress(progress);
      };
  
      const response = await uploadService.uploadMultipleFiles(
        validation.validFiles, 
        'property', 
        '', 
        [], 
        onProgress
      );
      
      // FIX: Handle different response structures safely
      let uploadedFiles = [];
      
      if (Array.isArray(response.data)) {
        uploadedFiles = response.data;
      } else if (response.data && Array.isArray(response.data.files)) {
        uploadedFiles = response.data.files;
      } else if (Array.isArray(response)) {
        uploadedFiles = response;
      } else {
        console.warn('Unexpected upload response format:', response);
        throw new Error('Received invalid response from upload service');
      }
  
      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error('No files were uploaded successfully');
      }
  
      const newImages = uploadedFiles.map(upload => ({
        id: upload._id || upload.id,
        url: upload.url || upload.path || upload.secure_url,
        name: upload.originalName || upload.name || 'Property Image',
        cloudinaryId: upload.cloudinaryId || upload.public_id
      }));
      
      setUploadedImages(prev => [...prev, ...newImages]);
      
      // Auto-set featured image if none selected
      if (!featuredImageId && newImages.length > 0) {
        setFeaturedImageId(newImages[0].id);
      }
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError(`Image upload failed: ${error.message}`);
      setUploadProgress(0);
    } finally {
      setUploading(false);
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

  // CRUD Operations - UPDATED WITH IMAGES

  // CREATE - Add new property with images
  const handleAddProperty = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      setError('');

      // Validation - ADD IMAGE VALIDATION
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

      console.log('Creating property with data:', propertyData);

      const createdProperty = await propertiesAPI.createProperty(propertyData);
      
      // Update local state
      setProperties(prev => [createdProperty.data, ...prev]);
      setSuccess(SUCCESS_MESSAGES.PROPERTY_CREATED);
      handleCloseAddModal();

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Error creating property:', error);
      setError(error.message || ERROR_MESSAGES.DEFAULT);
    } finally {
      setUploading(false);
    }
  }, [propertyForm, user, uploadedImages, featuredImageId]);

  // READ - Open edit modal with property data - UPDATED WITH IMAGES
  const handleEditProperty = useCallback((property) => {
    if (!property) return;
    
    setSelectedProperty(property);
    setPropertyForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      currency: property.currency || 'NAG',
      type: property.type || 'house',
      status: property.status || 'for-sale',
      location: {
        address: property.location?.address || '',
        city: property.location?.city || '',
        state: property.location?.state || '',
        zipCode: property.location?.zipCode || '',
        country: property.location?.country || 'Nigeria'
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
      const existingImages = property.images.map(img => ({
        id: img._id || img,
        url: img.url || '/placeholder-property.jpg',
        name: img.originalName || 'Property Image'
      }));
      setUploadedImages(existingImages);
      setFeaturedImageId(property.featuredImage || (existingImages[0]?.id || null));
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
        featuredImage: featuredImageId,
        createdBy: user?.uid,
        agentId: user?.uid
      };

      // Add optional yearBuilt if provided
      if (propertyForm.specifications.yearBuilt && propertyForm.specifications.yearBuilt.trim()) {
        updateData.specifications.yearBuilt = parseInt(propertyForm.specifications.yearBuilt);
      }

      console.log('Updating property with data:', updateData);

      const updatedProperty = await propertiesAPI.updateProperty(selectedProperty._id, updateData);
      
      // Update local state
      setProperties(prev => 
        prev.map(p => p._id === selectedProperty._id ? updatedProperty.data : p)
      );
      setSuccess(SUCCESS_MESSAGES.PROPERTY_UPDATED);
      handleCloseEditModal();

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Error updating property:', error);
      
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
  }, [propertyForm, selectedProperty, user, uploadedImages, featuredImageId]);

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

  // Form Handlers
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

  // Modal Handlers - UPDATED TO RESET IMAGES
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

  // Helper functions
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

 // Update your getPropertyImage function
const getPropertyImage = useCallback((property) => {
  if (property.images && property.images.length > 0) {
    const firstImage = property.images[0];
    // Check if the image URL is valid
    if (firstImage.url && firstImage.url.startsWith('http')) {
      return firstImage.url;
    }
  }
  return PLACEHOLDER_IMAGE;
}, []);

  const getPropertyLocation = useCallback((property) => {
    if (property?.location?.address) {
      return `${property.location.address}, ${property.location.city}, ${property.location.state}`;
    }
    return 'Location not specified';
  }, []);

  const getPropertyDetails = useCallback((property) => {
    const bedrooms = property?.specifications?.bedrooms || 0;
    const bathrooms = property?.specifications?.bathrooms || 0;
    const area = property?.specifications?.area || 0;
    const areaUnit = property?.specifications?.areaUnit || 'sqft';
    return `${bedrooms} beds • ${bathrooms} baths • ${area} ${areaUnit}`;
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

  // Property Form Component - UPDATED WITH IMAGE UPLOAD SECTION
  const PropertyForm = ({ isEdit = false, onSubmit, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Basic Information (keep existing) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter property title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="flex space-x-2">
                  <select
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={propertyForm.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="NAN">NAN</option>
                   
                  </select>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={propertyForm.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {propertyTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={propertyForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property features, location advantages, etc."
              />
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ImageIcon size={20} className="mr-2" />
              Property Images
            </h3>
            
            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading images...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="property-images"
              />
              <label
                htmlFor="property-images"
                className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                  uploading 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Upload size={16} className="mr-2" />
                {uploading ? 'Uploading...' : 'Select Images'}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Upload multiple property images (JPEG, PNG, WebP)
              </p>
            </div>

            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Uploaded Images ({uploadedImages.length})
                  </h4>
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => setAsFeatured(image.id)}
                          className={`text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            featuredImageId === image.id 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          {featuredImageId === image.id ? 'Featured' : 'Set Featured'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      {featuredImageId === image.id && (
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Requirement */}
            {uploadedImages.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <ImageIcon size={32} className="mx-auto mb-2 text-gray-300" />
                <p>At least one property image is required</p>
              </div>
            )}
          </div>

          {/* Location (keep existing) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin size={20} className="mr-2" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.location.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.location.zipCode}
                  onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                  placeholder="ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Specifications (keep existing) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.specifications.bedrooms}
                  onChange={(e) => handleSpecificationsChange('bedrooms', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.specifications.bathrooms}
                  onChange={(e) => handleSpecificationsChange('bathrooms', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    required
                    min="0"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={propertyForm.specifications.area}
                    onChange={(e) => handleSpecificationsChange('area', e.target.value)}
                    placeholder="0"
                  />
                  <select
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={propertyForm.specifications.areaUnit}
                    onChange={(e) => handleSpecificationsChange('areaUnit', e.target.value)}
                  >
                    <option value="sqft">sqft</option>
                    <option value="sqm">sqm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floors
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.specifications.floors}
                  onChange={(e) => handleSpecificationsChange('floors', e.target.value)}
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.specifications.parking}
                  onChange={(e) => handleSpecificationsChange('parking', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyForm.specifications.yearBuilt}
                  onChange={(e) => handleSpecificationsChange('yearBuilt', e.target.value)}
                  placeholder="Year"
                />
              </div>
            </div>
          </div>

          {/* Amenities (keep existing) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenityOptions.map(amenity => (
                <label key={amenity.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={propertyForm.amenities.includes(amenity.value)}
                    onChange={() => handleAmenityToggle(amenity.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || uploadedImages.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading 
                ? (isEdit ? 'Updating Property...' : 'Creating Property...')
                : (isEdit ? 'Update Property' : 'Create Property')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Loading State (keep existing)
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
      {/* Header (keep existing) */}
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

      {/* Alerts (keep existing) */}
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

      {/* Filters (keep existing) */}
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

      {/* Properties Table (keep existing) */}
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
    // Prevent infinite loop by only trying once
    if (e.target.src !== '/placeholder-property.jpg') {
      e.target.src = '/placeholder-property.jpg';
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
                    {formatPrice(property.price)}
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

      {/* Delete Confirmation Modal (keep existing) */}
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