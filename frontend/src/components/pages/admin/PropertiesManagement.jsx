import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

const PropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'sold', label: 'Sold' },
    { value: 'pending', label: 'Pending' },
    { value: 'draft', label: 'Draft' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProperties = [
        {
          id: 1,
          title: 'Modern Villa in Beverly Hills',
          price: 2500000,
          type: 'villa',
          status: 'active',
          bedrooms: 5,
          bathrooms: 4,
          area: 3500,
          location: 'Beverly Hills, CA',
          featured: true,
          images: ['/property1.jpg'],
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Downtown Luxury Apartment',
          price: 850000,
          type: 'apartment',
          status: 'sold',
          bedrooms: 3,
          bathrooms: 2,
          area: 1800,
          location: 'Downtown, NY',
          featured: false,
          images: ['/property2.jpg'],
          createdAt: '2024-01-10'
        },
        {
          id: 3,
          title: 'Family House with Garden',
          price: 1200000,
          type: 'house',
          status: 'pending',
          bedrooms: 4,
          bathrooms: 3,
          area: 2200,
          location: 'Suburb, TX',
          featured: true,
          images: ['/property3.jpg'],
          createdAt: '2024-01-08'
        }
      ];
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchTerm, statusFilter, typeFilter, properties]);

  const filterProperties = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleDelete = (property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setProperties(properties.filter(p => p.id !== selectedProperty.id));
    setShowDeleteModal(false);
    setSelectedProperty(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'villa': return 'bg-purple-100 text-purple-800';
      case 'apartment': return 'bg-blue-100 text-blue-800';
      case 'house': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-orange-100 text-orange-800';
      case 'land': return 'bg-brown-100 text-brown-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-6"></div>
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Properties Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your property listings
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base">
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white appearance-none cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <button className="bg-gray-50 text-gray-700 px-4 py-2.5 sm:py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors duration-200 border border-gray-300 w-full text-sm sm:text-base">
            <Filter size={18} className="sm:w-5 sm:h-5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map(property => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <img
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                          src={property.images[0] || '/placeholder-property.jpg'}
                          alt={property.title}
                          onError={(e) => {
                            e.target.src = '/placeholder-property.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-sm sm:text-base font-medium text-gray-900 line-clamp-1">
                          {property.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {property.bedrooms} beds • {property.bathrooms} baths • {property.area} sqft
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(property.type)} capitalize`}>
                      {property.type}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm sm:text-base text-gray-900 font-medium">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)} capitalize`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm sm:text-base text-gray-600">
                    <div className="line-clamp-1">{property.location}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors duration-150"
                        title="View"
                      >
                        <Eye size={16} className="sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-50 transition-colors duration-150"
                        title="Edit"
                      >
                        <Edit size={16} className="sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-150"
                        onClick={() => handleDelete(property)}
                        title="Delete"
                      >
                        <Trash2 size={16} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-300 text-5xl sm:text-6xl mb-4">🏠</div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Delete Property</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Are you sure you want to delete <span className="font-medium">"{selectedProperty?.title}"</span>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                className="px-4 py-2.5 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
                onClick={confirmDelete}
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesManagement;