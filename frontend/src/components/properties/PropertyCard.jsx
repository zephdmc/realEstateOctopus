// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const PropertyCard = ({ property, className = "" }) => {
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   const {
//     id,
//     title,
//     price,
//     type,
//     status,
//     location,
//     bedrooms,
//     bathrooms,
//     area,
//     images,
//     primaryImage, // Added: Use primaryImage from backend
//     featured,
//     createdAt,
//     currency = 'USD' // Added: Use currency from backend
//   } = property;

//   // FIX: Use primaryImage first, then first image from images array
//   const imageUrl = primaryImage ||
//                    images?.[0]?.url ||
//                    '/images/placeholder-property.jpg';

//   console.log('🖼️ PropertyCard - Image URL:', imageUrl); // Debug

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: currency, // Use dynamic currency
//       maximumFractionDigits: 0
//     }).format(price);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'for-sale': 'bg-green-100 text-green-800',
//       'for-rent': 'bg-blue-100 text-blue-800',
//       sold: 'bg-gray-100 text-gray-800',
//       rented: 'bg-purple-100 text-purple-800',
//       // Add your actual status values from backend
//       sale: 'bg-green-100 text-green-800',
//       rent: 'bg-blue-100 text-blue-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       'for-sale': 'For Sale',
//       'for-rent': 'For Rent',
//       sale: 'For Sale',
//       rent: 'For Rent',
//       sold: 'Sold',
//       rented: 'Rented'
//     };
//     return statusMap[status] || status;
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       house: 'bg-orange-100 text-orange-800',
//       apartment: 'bg-indigo-100 text-indigo-800',
//       condo: 'bg-pink-100 text-pink-800',
//       villa: 'bg-red-100 text-red-800',
//       commercial: 'bg-teal-100 text-teal-800'
//     };
//     return colors[type] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
//       {/* Image Section */}
//       <div className="relative overflow-hidden">
//         <Link to={`/properties/${id}`}>
//           <div className="aspect-w-16 aspect-h-12 bg-gray-200">
//             {!imageError ? (
//               <>
//                 {!imageLoaded && (
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                   </div>
//                 )}
//                 <img
//                   src={imageUrl}
//                   alt={title}
//                   className={`w-full h-64 object-cover transition-opacity duration-300 ${
//                     imageLoaded ? 'opacity-100' : 'opacity-0'
//                   }`}
//                   onLoad={() => setImageLoaded(true)}
//                   onError={() => {
//                     console.error('❌ Image failed to load:', imageUrl);
//                     setImageError(true);
//                   }}
//                 />
//               </>
//             ) : (
//               <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                 <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//               </div>
//             )}
//           </div>
//         </Link>

//         {/* Badges */}
//         <div className="absolute top-4 left-4 flex flex-col space-y-2">
//           {featured && (
//             <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
//               Featured
//             </span>
//           )}
//           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
//             {getStatusText(status)}
//           </span>
//         </div>

//         <div className="absolute top-4 right-4">
//           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(type)}`}>
//             {type?.charAt(0).toUpperCase() + type?.slice(1)}
//           </span>
//         </div>

//         {/* Favorite Button */}
//         <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
//           <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//           </svg>
//         </button>
//       </div>

//       {/* Content Section */}
//       <div className="p-6">
//         {/* Price */}
//         <div className="mb-3">
//           <h3 className="text-2xl font-bold text-gray-900">{formatPrice(price)}</h3>
//           {(status === 'for-rent' || status === 'rent') && <span className="text-gray-600 text-sm">/month</span>}
//         </div>

//         {/* Title */}
//         <Link to={`/properties/${id}`}>
//           <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
//             {title}
//           </h4>
//         </Link>

//         {/* Location */}
//         <div className="flex items-center text-gray-600 mb-4">
//           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//           <span className="text-sm">{location?.address || location?.formattedAddress || 'Address not available'}</span>
//         </div>

//         {/* Property Features */}
//         <div className="flex items-center justify-between border-t border-gray-200 pt-4">
//           <div className="flex items-center space-x-1">
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//             <span className="text-sm text-gray-600">{bedrooms || 0} Bed</span>
//           </div>

//           <div className="flex items-center space-x-1">
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span className="text-sm text-gray-600">{bathrooms || 0} Bath</span>
//           </div>

//           <div className="flex items-center space-x-1">
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
//             </svg>
//             <span className="text-sm text-gray-600">{area || 0} sq ft</span>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
//           <span className="text-xs text-gray-500">
//             Listed {formatDate(createdAt)}
//           </span>
//           <Link
//             to={`/properties/${id}`}
//             className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200"
//           >
//             View Details →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const PropertyCard = ({ property, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [favorite, setFavorite] = useState(false);

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
    primaryImage,
    featured,
    createdAt,
    specifications, // Added: Use specifications from backend
    currency = 'NGN' // Default to Naira
  } = property;

  // FIX: Use specifications data if available, otherwise use direct props
  const propertySpecs = specifications || {};
  const displayBedrooms = propertySpecs.bedrooms || bedrooms || 0;
  const displayBathrooms = propertySpecs.bathrooms || bathrooms || 0;
  const displayArea = propertySpecs.area || area || 0;
  const areaUnit = propertySpecs.areaUnit || 'sq ft';

  // FIX: Use primaryImage first, then first image from images array
  const imageUrl = primaryImage || 
                   images?.[0]?.url || 
                   images?.[0] || 
                   '/images/placeholder-property.jpg';

  console.log('🖼️ PropertyCard - Image URL:', imageUrl); // Debug
  console.log('📊 PropertyCard - Specifications:', { 
    specs: propertySpecs, 
    displayBedrooms, 
    displayBathrooms, 
    displayArea 
  });

  const formatPrice = (price) => {
    // Force Naira currency regardless of what's in the data
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN', // Always use Naira
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
      'for-sale': 'bg-green-100 text-green-800 border border-green-200',
      'for-rent': 'bg-blue-100 text-blue-800 border border-blue-200',
      'sale': 'bg-green-100 text-green-800 border border-green-200',
      'rent': 'bg-blue-100 text-blue-800 border border-blue-200',
      'sold': 'bg-gray-100 text-gray-800 border border-gray-200',
      'rented': 'bg-purple-100 text-purple-800 border border-purple-200',
      'forSale': 'bg-green-100 text-green-800 border border-green-200',
      'forRent': 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'for-sale': 'For Sale',
      'for-rent': 'For Rent',
      'sale': 'For Sale',
      'rent': 'For Rent',
      'sold': 'Sold',
      'rented': 'Rented',
      'forSale': 'For Sale',
      'forRent': 'For Rent'
    };
    return statusMap[status] || 'Available';
  };

  const getTypeColor = (type) => {
    const colors = {
      house: 'bg-orange-100 text-orange-800 border border-orange-200',
      apartment: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      condo: 'bg-pink-100 text-pink-800 border border-pink-200',
      villa: 'bg-red-100 text-red-800 border border-red-200',
      commercial: 'bg-teal-100 text-teal-800 border border-teal-200',
      duplex: 'bg-purple-100 text-purple-800 border border-purple-200',
      studio: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 ${className}`}>
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Link to={`/properties/${id}`}>
          <div className="aspect-w-16 aspect-h-12 bg-gray-200">
            {!imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
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
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500 text-sm">Image not available</span>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {featured && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Featured
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(type)}`}>
            {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Property'}
          </span>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 ${
            favorite 
              ? 'bg-red-500 text-white transform scale-110' 
              : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-red-500'
          }`}
        >
          <FaHeart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{formatPrice(price)}</h3>
          {(status === 'for-rent' || status === 'rent' || status === 'forRent') && (
            <span className="text-gray-600 text-sm">/month</span>
          )}
        </div>

        {/* Title */}
        <Link to={`/properties/${id}`}>
          <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2 leading-tight">
            {title}
          </h4>
        </Link>

        {/* Location */}
        <div className="flex items-start text-gray-600 mb-4">
          <FaMapMarkerAlt className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
          <span className="text-sm leading-relaxed">
            {location?.address || location?.formattedAddress || 'Location not specified'}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-blue-50 px-3 py-2 rounded-lg">
              <FaBed className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">{displayBedrooms}</span>
              <span className="text-xs text-gray-500">Bed</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-green-50 px-3 py-2 rounded-lg">
              <FaBath className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">{displayBathrooms}</span>
              <span className="text-xs text-gray-500">Bath</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-purple-50 px-3 py-2 rounded-lg">
              <FaRulerCombined className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">{displayArea.toLocaleString()}</span>
              <span className="text-xs text-gray-500">{areaUnit}</span>
            </div>
          </div>
        </div>

        {/* Alternative compact layout for very small screens */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4 sm:hidden">
          <div className="flex items-center space-x-1 text-gray-600">
            <FaBed className="w-3 h-3" />
            <span className="text-xs">{displayBedrooms} Bed</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <FaBath className="w-3 h-3" />
            <span className="text-xs">{displayBathrooms} Bath</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <FaRulerCombined className="w-3 h-3" />
            <span className="text-xs">{displayArea} {areaUnit}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Listed {formatDate(createdAt)}
          </span>
          <Link
            to={`/properties/${id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200 flex items-center space-x-1"
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;