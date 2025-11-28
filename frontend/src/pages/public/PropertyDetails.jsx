import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaBed, 
  FaBath, 
  FaRulerCombined, 
  FaCalendarAlt, 
  FaCar, 
  FaParking,
  FaSwimmingPool,
  FaTree,
  FaUmbrellaBeach,
  FaSnowflake,
  FaFire,
  FaShieldAlt,
  FaPaw,
  FaChair,
  FaWifi,
  FaTv,
  FaUtensils,
  FaDumbbell,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaShare,
  FaHeart,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaExpand,
  FaBuilding,
  FaHome,
  FaRuler,
  FaVectorSquare,
  FaCity,
  FaMoneyBillWave,
  FaClock,
  FaEye,
  FaPrint,
  FaDownload,
  FaVideo,
  FaWalking,
  FaSubway,
  FaSchool,
  FaShoppingBag,
  FaHospital,
  FaUtensilSpoon
} from 'react-icons/fa';
import { MdApartment, MdBalcony, MdElevator, MdFamilyRestroom, MdZoomOutMap } from 'react-icons/md';
import { IoIosResize } from 'react-icons/io';
import MainLayout from '../../components/layout/MainLayout';
import { NarrowContainer, SplitContainer } from '../../components/layout/PageContainer';
import PropertyGallery from '../../components/properties/PropertyGallery';
import PropertyMap from '../../components/properties/PropertyMap';
import ContactForm from '../../components/forms/ContactForm';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { useProperty } from '../../hooks/useProperties';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PropertyDetails = () => {
  const { id } = useParams();
  const { property, loading, error } = useProperty(id);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="text-center">
            <LoadingSpinner size="large" text="Loading property details..." />
            <div className="mt-8 space-y-2">
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto">
                <div className="h-2 bg-blue-600 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-gray-500 text-sm">Preparing your viewing experience</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <NarrowContainer>
            <div className="text-center py-16 max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaHome className="w-16 h-16 text-gray-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Property Not Available</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                This property is no longer available or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/properties"
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Browse Properties
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-gray-600 text-gray-600 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Contact Agent
                </Link>
              </div>
            </div>
          </NarrowContainer>
        </div>
      </MainLayout>
    );
  }

  // Enhanced property data extraction
  const specs = property.specifications || {};
  const location = property.location || {};
  const amenities = property.amenities || [];
  const agent = property.agent || property.agentInfo || {};
  
  // Get background image with fallbacks
  const backgroundImage = property.primaryImage || 
                         property.images?.[0]?.url || 
                         property.featuredImage?.url ||
                         '/images/property-placeholder.jpg';

  // Enhanced features with more property data
  const features = [
    { icon: FaBed, label: 'Bedrooms', value: specs.bedrooms || property.bedrooms || 'N/A', description: 'Spacious bedrooms' },
    { icon: FaBath, label: 'Bathrooms', value: specs.bathrooms || property.bathrooms || 'N/A', description: 'Modern bathrooms' },
    { icon: IoIosResize, label: 'Living Area', value: `${specs.area || property.area || 'N/A'} ${specs.areaUnit || 'sq ft'}`, description: 'Total living space' },
    { icon: FaVectorSquare, label: 'Lot Size', value: specs.lotSize ? `${specs.lotSize} ${specs.lotSizeUnit || 'acres'}` : 'N/A', description: 'Property land size' },
    { icon: FaCalendarAlt, label: 'Year Built', value: specs.yearBuilt || property.yearBuilt || 'N/A', description: 'Construction year' },
    { icon: FaBuilding, label: 'Stories', value: specs.stories || specs.floors || 'N/A', description: 'Number of floors' },
    { icon: FaCar, label: 'Garage', value: specs.garage ? `${specs.garageSpaces || 2} cars` : 'No', description: 'Parking capacity' },
    { icon: FaParking, label: 'Parking', value: specs.parking || 'Available', description: 'Additional parking' },
  ];

  // Property highlights
  const highlights = [
    { icon: FaMoneyBillWave, label: 'Price per Sq Ft', value: property.price && specs.area ? `₦${(property.price / specs.area).toFixed(2)}` : 'N/A', trend: '+5.2%' },
    { icon: FaClock, label: 'Market Presence', value: '2 weeks', badge: 'New' },
    { icon: FaEye, label: 'Property Views', value: '2.4K', trend: '+42%' },
    { icon: FaStar, label: 'Property Rating', value: '4.9/5', reviews: '18 reviews' },
  ];

  // Enhanced amenities
  const amenityIcons = {
    'swimming-pool': FaSwimmingPool,
    'infinity-pool': FaSwimmingPool,
    'garden': FaTree,
    'landscaped-gardens': FaTree,
    'balcony': MdBalcony,
    'terrace': MdBalcony,
    'rooftop-terrace': MdBalcony,
    'air-conditioning': FaSnowflake,
    'smart-home': FaShieldAlt,
    'security-system': FaShieldAlt,
    'gated-community': FaShieldAlt,
    'pet-friendly': FaPaw,
    'furnished': FaChair,
    'designer-furnished': FaChair,
    'wifi': FaWifi,
    'home-theater': FaTv,
    'chef-kitchen': FaUtensilSpoon,
    'wine-cellar': FaUtensils,
    'gym': FaDumbbell,
    'spa': FaUmbrellaBeach,
    'elevator': MdElevator,
    'concierge': MdFamilyRestroom,
    'valet': FaCar,
    'parking': FaParking
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'for-rent':
      case 'forRent':
      case 'rent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'for-sale':
      case 'forSale':
      case 'sale':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'exclusive':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'for-rent':
      case 'forRent':
      case 'rent':
        return 'For Rent';
      case 'for-sale':
      case 'forSale':
      case 'sale':
        return 'For Sale';
      case 'sold':
        return 'Sold';
      case 'exclusive':
        return 'Exclusive';
      default:
        return 'Available';
    }
  };

  const nearbyAmenities = [
    { icon: FaSchool, label: 'Schools', distance: '0.3 mi', type: 'education' },
    { icon: FaShoppingBag, label: 'Shopping', distance: '0.2 mi', type: 'shopping' },
    { icon: FaHospital, label: 'Hospital', distance: '0.8 mi', type: 'healthcare' },
    { icon: FaSubway, label: 'Metro Station', distance: '0.1 mi', type: 'transport' },
    { icon: FaWalking, label: 'Park', distance: '0.4 mi', type: 'recreation' },
    { icon: FaUtensils, label: 'Restaurants', distance: '0.2 mi', type: 'dining' },
  ];

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Enhanced Header Section */}
        <div 
          className="relative min-h-[80vh] flex items-center justify-center text-white bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: backgroundImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${backgroundImage})` : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          }}
        >
          <NarrowContainer>
            <div className="relative z-10 py-12">
              {/* Navigation */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
                <Link 
                  to="/properties" 
                  className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl text-white hover:bg-white/30 transition-all duration-300 border border-white/20"
                >
                  <FaChevronLeft className="text-lg" />
                  <span className="font-semibold">Back to Properties</span>
                </Link>
                <div className="flex items-center space-x-3 flex-wrap gap-3">
                  <button 
                    onClick={() => setFavorite(!favorite)}
                    className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 border ${
                      favorite 
                        ? 'bg-red-500 text-white border-red-400' 
                        : 'bg-white/20 text-white border-white/20 hover:bg-white/30'
                    }`}
                  >
                    <FaHeart className={`text-xl ${favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all duration-300">
                    <FaShare className="text-xl" />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all duration-300">
                    <FaPrint className="text-xl" />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all duration-300">
                    <FaDownload className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Property Header Content */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left Column - Property Info */}
                <div className="space-y-8">
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-6 py-3 rounded-2xl text-base font-bold border ${getStatusColor(property.status)}`}>
                      {getStatusText(property.status)}
                    </span>
                    {property.featured && (
                      <span className="px-6 py-3 rounded-2xl bg-yellow-400 text-yellow-900 text-base font-bold border border-yellow-300 flex items-center gap-3">
                        <FaStar className="fill-current" />
                        Featured
                      </span>
                    )}
                    {specs.isNewConstruction && (
                      <span className="px-6 py-3 rounded-2xl bg-green-400 text-green-900 text-base font-bold border border-green-300">
                        New Construction
                      </span>
                    )}
                  </div>

                  {/* Property Title */}
                  <div className="space-y-6">
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-serif">
                      {property.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-white text-xl">
                      <FaMapMarkerAlt className="text-2xl flex-shrink-0" />
                      <span className="font-semibold">
                        {location.address || property.formattedAddress || 'Prime Location'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.slice(0, 4).map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                          <IconComponent className="text-2xl mx-auto mb-3 text-white" />
                          <div className="text-xl font-bold text-white">{feature.value}</div>
                          <div className="text-sm text-white/80">{feature.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - Price & Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  {/* Price Display */}
                  <div className="text-center mb-8">
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-3 font-serif">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-lg text-white/80">
                      {(property.status === 'for-rent' || property.status === 'forRent' || property.status === 'rent') ? 'per month' : 'Total Price'}
                    </div>
                    {specs.area && (
                      <div className="text-white/70 text-sm mt-3">
                        {formatPrice(property.price / specs.area)} per sq ft
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full bg-white text-blue-600 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl"
                    >
                      <FaPhone className="text-xl" />
                      <span>Contact Agent</span>
                    </button>
                    
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="w-full border-2 border-white text-white py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-lg"
                    >
                      <FaCalendar className="text-xl" />
                      <span>Schedule Viewing</span>
                    </button>

                    <button className="w-full border border-white/40 text-white py-4 rounded-2xl hover:bg-white/5 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-base">
                      <FaVideo className="text-lg" />
                      <span>Virtual Tour</span>
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="grid grid-cols-2 gap-6 text-center text-white/80 text-sm">
                      <div>
                        <div className="font-bold text-white mb-1">Property ID</div>
                        <div className="font-mono text-white">{property._id?.slice(-8) || property.id?.slice(-8)}</div>
                      </div>
                      <div>
                        <div className="font-bold text-white mb-1">Last Updated</div>
                        <div>{property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'Today'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NarrowContainer>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-white/80 text-sm font-medium">Explore More</span>
              <FaChevronDown className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Sticky Quick Actions Bar */}
        {isSticky && (
          <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow">
                    <FaHome className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm truncate max-w-xs lg:max-w-md">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 text-xs flex items-center space-x-1">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span>{location.address?.split(',')[0] || 'Prime Location'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden lg:block">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-sm shadow hover:shadow-md"
                  >
                    Contact Agent
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <NarrowContainer>
          {/* Property Highlights */}
          <div className="py-12 -mt-20 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600 rounded-xl text-white">
                      <highlight.icon className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-gray-900">{highlight.value}</div>
                      <div className="text-sm text-gray-600">{highlight.label}</div>
                      <div className="flex items-center space-x-2 mt-2">
                        {highlight.badge && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {highlight.badge}
                          </span>
                        )}
                        {highlight.trend && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            {highlight.trend}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="py-12">
            <PropertyGallery 
              images={property.images || []}
              title={property.title}
              className="rounded-2xl overflow-hidden shadow-lg"
              onImageChange={setCurrentImageIndex}
            />
          </div>

          {/* Main Content */}
          <SplitContainer gap={8} className="lg:gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Navigation Tabs */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                <nav className="flex flex-wrap gap-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: FaHome },
                    { id: 'features', label: 'Features', icon: FaStar },
                    { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
                    { id: 'details', label: 'Details', icon: FaBuilding },
                    { id: 'amenities', label: 'Amenities', icon: FaSwimmingPool }
                  ].map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex-1 min-w-0 ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="text-lg flex-shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 font-serif">Property Description</h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {property.description || 'This well-maintained property offers comfortable living spaces with modern amenities. Located in a convenient area, it provides easy access to essential services and transportation.'}
                      </p>
                    </div>

                    {/* Key Features */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 font-serif">Property Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => {
                          const IconComponent = feature.icon;
                          return (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300">
                              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                <IconComponent className="text-xl" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-gray-600 font-medium truncate">{feature.label}</span>
                                  <span className="text-lg font-bold text-gray-900 ml-2">{feature.value}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 font-serif">Features & Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {amenities.map((amenity, index) => {
                        const amenityKey = amenity.toLowerCase().replace(/\s+/g, '-');
                        const IconComponent = amenityIcons[amenityKey] || FaStar;
                        return (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition-all duration-300">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                              <IconComponent className="text-lg" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm flex-1">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 font-serif">Location & Neighborhood</h3>
                      <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 text-xl">Address</h4>
                            <div className="space-y-2 text-gray-700">
                              <p className="text-lg">{location.address || property.formattedAddress}</p>
                              {location.city && <p>{location.city}, {location.state} {location.zipCode}</p>}
                              {location.country && <p>{location.country}</p>}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 text-xl">Neighborhood</h4>
                            <p className="text-gray-700 leading-relaxed">
                              Located in {location.neighborhood || location.city || 'this area'}, 
                              this property offers convenient access to schools, shopping centers, 
                              healthcare facilities, and public transportation.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 text-xl">Walk Score</h4>
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl font-bold text-green-600">92</div>
                              <div className="text-sm text-gray-600">
                                <div className="font-semibold">Walker's Paradise</div>
                                <div>Excellent public transportation</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 text-xl">Nearby Amenities</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                              {nearbyAmenities.map((amenity, index) => {
                                const IconComponent = amenity.icon;
                                return (
                                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <IconComponent className="text-blue-600 text-lg flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 truncate">{amenity.label}</div>
                                      <div className="text-gray-600 text-xs">{amenity.distance}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <PropertyMap 
                        property={property}
                        height="400px"
                        interactive={true}
                        className="rounded-xl overflow-hidden shadow-md"
                      />
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 font-serif">Property Details</h3>
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-xl">Basic Information</h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Property Type', value: property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'Residential' },
                              { label: 'Property Status', value: getStatusText(property.status) },
                              { label: 'Year Built', value: specs.yearBuilt || 'N/A' },
                              { label: 'Lot Size', value: specs.lotSize ? `${specs.lotSize} ${specs.lotSizeUnit || 'sq ft'}` : 'N/A' },
                              { label: 'Architectural Style', value: specs.architecturalStyle || 'Contemporary' },
                              { label: 'Construction', value: specs.constructionType || 'Standard' },
                            ].map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">{item.label}</span>
                                <span className="font-semibold text-gray-900">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-xl">Additional Information</h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Currency', value: 'NGN' },
                              { label: 'Listed Date', value: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A' },
                              { label: 'Last Updated', value: property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A' },
                              { label: 'Property ID', value: property._id || property.id },
                              { label: 'MLS Number', value: specs.mlsNumber || 'N/A' },
                              { label: 'Annual Taxes', value: specs.annualTaxes ? formatPrice(specs.annualTaxes) : 'N/A' },
                            ].map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">{item.label}</span>
                                <span className="font-semibold text-gray-900">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 font-serif">Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {amenities.map((amenity, index) => {
                        const amenityKey = amenity.toLowerCase().replace(/\s+/g, '-');
                        const IconComponent = amenityIcons[amenityKey] || FaStar;
                        return (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                              <IconComponent className="text-lg" />
                            </div>
                            <span className="text-gray-800 font-medium text-sm flex-1">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Agent & Actions */}
            <div className="space-y-8">
              {/* Agent Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
                <h4 className="font-semibold text-gray-900 mb-6 text-xl font-serif">Property Agent</h4>
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={agent.avatar || agent.photoURL || '/images/agent-placeholder.jpg'}
                    alt={agent.name}
                    className="w-16 h-16 rounded-xl border-2 border-blue-200 shadow-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-lg truncate">{agent.name || 'Professional Agent'}</p>
                    <p className="text-gray-600 mb-2 text-sm">Licensed Real Estate Agent</p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-400 text-sm fill-current" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">4.9 (128 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Properties Sold</span>
                    <span className="font-semibold text-gray-900">247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Experience</span>
                    <span className="font-semibold text-gray-900">8 years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Response Time</span>
                    <span className="font-semibold text-green-600">~15 mins</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 shadow-md hover:shadow-lg"
                  >
                    <FaPhone className="text-lg" />
                    <span>Contact Agent</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-3"
                  >
                    <FaCalendar className="text-lg" />
                    <span>Schedule Viewing</span>
                  </button>

                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-3">
                    <FaEnvelope className="text-lg" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md">
                <h4 className="font-semibold text-gray-900 mb-6 text-xl">Property Summary</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Property ID', value: property._id || property.id, icon: FaBuilding },
                    { label: 'Total Views', value: '1,247', icon: FaEye },
                    { label: 'Days on Market', value: '14 days', icon: FaClock },
                    { label: 'Last Price Update', value: property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'Today', icon: FaCalendar },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="text-blue-600 text-lg" />
                          <span className="text-gray-600 font-medium">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mortgage Calculator */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-md">
                <h4 className="font-semibold text-gray-900 mb-4 text-xl">Mortgage Estimate</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="font-semibold text-gray-900">~{formatPrice(property.price * 0.004)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold text-gray-900">4.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-semibold text-gray-900">20%</span>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-md hover:shadow-lg">
                    Calculate Mortgage
                  </button>
                </div>
              </div>
            </div>
          </SplitContainer>
        </NarrowContainer>
      </div>

      {/* Modals */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <ContactForm
              propertyId={property._id || property.id}
              propertyTitle={property.title}
              agentId={property.agentId}
              onClose={() => setShowContactForm(false)}
            />
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <AppointmentForm
              propertyId={property._id || property.id}
              propertyTitle={property.title}
              agentId={property.agentId}
              agentName={agent.name}
              onClose={() => setShowAppointmentForm(false)}
            />
            <button
              onClick={() => setShowAppointmentForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PropertyDetails;