import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    price,
    type,
    status,
    location,
    bedrooms,
    bathrooms,
    area,
    images,
    primaryImage, // Added: Use primaryImage from backend
    featured,
    createdAt,
    currency = 'USD' // Added: Use currency from backend
  } = property;

  // FIX: Use primaryImage first, then first image from images array
  const imageUrl = primaryImage || 
                   images?.[0]?.url || 
                   '/images/placeholder-property.jpg';

  console.log('🖼️ PropertyCard - Image URL:', imageUrl); // Debug

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency, // Use dynamic currency
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'for-sale': 'bg-green-100 text-green-800',
      'for-rent': 'bg-blue-100 text-blue-800',
      sold: 'bg-gray-100 text-gray-800',
      rented: 'bg-purple-100 text-purple-800',
      // Add your actual status values from backend
      sale: 'bg-green-100 text-green-800',
      rent: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'for-sale': 'For Sale',
      'for-rent': 'For Rent',
      sale: 'For Sale',
      rent: 'For Rent',
      sold: 'Sold',
      rented: 'Rented'
    };
    return statusMap[status] || status;
  };

  const getTypeColor = (type) => {
    const colors = {
      house: 'bg-orange-100 text-orange-800',
      apartment: 'bg-indigo-100 text-indigo-800',
      condo: 'bg-pink-100 text-pink-800',
      villa: 'bg-red-100 text-red-800',
      commercial: 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Link to={`/properties/${id}`}>
          <div className="aspect-w-16 aspect-h-12 bg-gray-200">
            {!imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={imageUrl} 
                  alt={title}
                  className={`w-full h-64 object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error('❌ Image failed to load:', imageUrl);
                    setImageError(true);
                  }}
                />
              </>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {featured && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(type)}`}>
            {type?.charAt(0).toUpperCase() + type?.slice(1)}
          </span>
        </div>

        {/* Favorite Button */}
        <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
          <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{formatPrice(price)}</h3>
          {(status === 'for-rent' || status === 'rent') && <span className="text-gray-600 text-sm">/month</span>}
        </div>

        {/* Title */}
        <Link to={`/properties/${id}`}>
          <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
            {title}
          </h4>
        </Link>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{location?.address || location?.formattedAddress || 'Address not available'}</span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm text-gray-600">{bedrooms || 0} Bed</span>
          </div>

          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-600">{bathrooms || 0} Bath</span>
          </div>

          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <span className="text-sm text-gray-600">{area || 0} sq ft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Listed {formatDate(createdAt)}
          </span>
          <Link
            to={`/properties/${id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;