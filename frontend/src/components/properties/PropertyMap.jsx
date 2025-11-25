import React, { useState, useEffect } from 'react';

const PropertyMap = ({ 
  property,
  height = '400px',
  className = "",
  showMarker = true,
  interactive = true
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Mock coordinates - in real app, these would come from property data
  const defaultCoordinates = {
    lat: property?.location?.lat || 40.7128,
    lng: property?.location?.lng || -74.0060
  };

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?
    center=${defaultCoordinates.lat},${defaultCoordinates.lng}
    &zoom=15
    &size=600x400
    &markers=color:red%7C${defaultCoordinates.lat},${defaultCoordinates.lng}
    &key=YOUR_GOOGLE_MAPS_API_KEY`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${defaultCoordinates.lat},${defaultCoordinates.lng}`;

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!mapLoaded) {
    return (
      <div 
        className={`bg-gray-200 rounded-2xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div 
        className={`bg-gray-100 rounded-2xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Unavailable</h3>
          <p className="text-gray-600 mb-4">We couldn't load the map for this property.</p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View on Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Map Container */}
      <div 
        className="bg-gray-200 rounded-2xl overflow-hidden relative"
        style={{ height }}
      >
        {/* Static Map Image */}
        <img
          src={staticMapUrl}
          alt={`Location of ${property?.title}`}
          className="w-full h-full object-cover"
          onError={() => setMapError(true)}
        />

        {/* Overlay for interactive features */}
        {interactive && (
          <div className="absolute inset-0 bg-transparent cursor-pointer"
               onClick={() => window.open(googleMapsUrl, '_blank')}
          >
            {/* Interactive Elements */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">View larger map</span>
              </div>
            </div>

            {/* Property Marker */}
            {showMarker && (
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg text-xs font-semibold whitespace-nowrap">
                    {property?.title}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location Details */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">Location Details</h4>
        
        <div className="space-y-2 text-sm text-gray-600">
          {property?.location?.address && (
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property.location.address}</span>
            </div>
          )}

          {property?.location?.neighborhood && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{property.location.neighborhood}</span>
            </div>
          )}

          {(property?.location?.city || property?.location?.state || property?.location?.zipCode) && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>
                {[
                  property.location.city,
                  property.location.state,
                  property.location.zipCode
                ].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
          >
            Open in Maps
          </a>
          <button className="flex-1 bg-white text-gray-700 text-center py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200 text-sm font-medium">
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;