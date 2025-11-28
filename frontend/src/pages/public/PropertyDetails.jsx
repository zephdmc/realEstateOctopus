import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaSchool,
  FaShoppingBag,
  FaBed, 
  FaBath, 
  FaRulerCombined, 
  FaCalendarAlt, 
  FaCar, 
  FaParking,
  FaSwimmingPool,
  FaTree,
  FaSnowflake,
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
  FaChevronDown,
  FaBuilding,
  FaHome,
  FaVectorSquare,
  FaMoneyBillWave,
  FaClock,
  FaHospital,
  FaSubway,
  FaEye,
  FaPrint,
  FaWalking,
  FaDownload,
  FaVideo,
  FaTimes
} from 'react-icons/fa';
import { MdBalcony, MdElevator, MdFamilyRestroom } from 'react-icons/md';
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowContactForm(false);
        setShowAppointmentForm(false);
      }
    };

    if (showContactForm || showAppointmentForm) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showContactForm, showAppointmentForm]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen bg-white">
          <LoadingSpinner size="large" text="Loading property details..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <NarrowContainer>
            <div className="text-center py-16">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
              <p className="text-gray-600 mb-8 text-sm md:text-base">The property you're looking for doesn't exist.</p>
              <Link
                to="/properties"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm md:text-base"
              >
                Browse Properties
              </Link>
            </div>
          </NarrowContainer>
        </div>
      </MainLayout>
    );
  }

  // Extract property data with proper fallbacks
  const specs = property.specifications || {};
  const location = property.location || {};
  const amenities = property.amenities || [];
  const agent = property.agentInfo || property.agent || {};
  
  // Get images array properly
  const images = property.images || [];
  const primaryImage = property.primaryImage || (images[0]?.url || images[0]);
  const allImages = primaryImage ? [primaryImage, ...images.filter(img => img !== primaryImage && img.url !== primaryImage).map(img => img.url || img)] : images.map(img => img.url || img);

  // Enhanced features with proper data access
  const features = [
    { 
      icon: FaBed, 
      label: 'Bedrooms', 
      value: specs.bedrooms || property.bedrooms || 'N/A',
      description: 'Comfortable bedrooms'
    },
    { 
      icon: FaBath, 
      label: 'Bathrooms', 
      value: specs.bathrooms || property.bathrooms || 'N/A',
      description: 'Modern bathrooms'
    },
    { 
      icon: FaRulerCombined, 
      label: 'Area', 
      value: `${specs.area || property.area || 'N/A'} ${specs.areaUnit || 'sqft'}`,
      description: 'Total living area'
    },
    { 
      icon: FaVectorSquare, 
      label: 'Lot Size', 
      value: specs.lotSize ? `${specs.lotSize} ${specs.lotSizeUnit || 'sqft'}` : 'N/A',
      description: 'Property land size'
    },
    { 
      icon: FaCalendarAlt, 
      label: 'Year Built', 
      value: specs.yearBuilt || property.yearBuilt || 'N/A',
      description: 'Construction year'
    },
    { 
      icon: FaBuilding, 
      label: 'Stories', 
      value: specs.stories || specs.floors || 'N/A',
      description: 'Number of floors'
    },
    { 
      icon: FaCar, 
      label: 'Garage', 
      value: specs.garage ? `${specs.garageSpaces || 1} spaces` : 'No',
      description: 'Parking capacity'
    },
    { 
      icon: FaParking, 
      label: 'Parking', 
      value: specs.parking || property.parking || 'Available',
      description: 'Additional parking'
    },
  ];

  const highlights = [
    { 
      icon: FaMoneyBillWave, 
      label: 'Price per Sq Ft', 
      value: property.price && specs.area ? `₦${Math.round(property.price / specs.area).toLocaleString()}` : 'N/A',
      trend: '+5.2%' 
    },
    { 
      icon: FaClock, 
      label: 'Time on Market', 
      value: '2 weeks', 
      badge: 'New' 
    },
    { 
      icon: FaEye, 
      label: 'Property Views', 
      value: '1,247',
      trend: '+25%'
    },
    { 
      icon: FaStar, 
      label: 'Property Rating', 
      value: '4.8/5',
      reviews: '12 reviews'
    },
  ];

  // Enhanced amenities mapping
  const amenityIcons = {
    'balcony': MdBalcony,
    'security-system': FaShieldAlt,
    'furnished': FaChair,
    'heating': FaSnowflake,
    'air-conditioning': FaSnowflake,
    'swimming-pool': FaSwimmingPool,
    'garden': FaTree,
    'terrace': MdBalcony,
    'pet-friendly': FaPaw,
    'wifi': FaWifi,
    'tv': FaTv,
    'kitchen': FaUtensils,
    'gym': FaDumbbell,
    'elevator': MdElevator,
    'family-friendly': MdFamilyRestroom,
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

  // Close modal function
  const closeModal = () => {
    setShowContactForm(false);
    setShowAppointmentForm(false);
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="absolute inset-0 bg-black/50"></div>
          <NarrowContainer>
            <div className="relative py-4 md:py-8">
              {/* Navigation */}
              <div className="flex justify-between items-center mb-4 md:mb-8">
                <Link 
                  to="/properties" 
                  className="flex items-center space-x-2 bg-white/20 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-white/30 transition text-sm md:text-base"
                >
                  <FaChevronLeft className="text-sm md:text-base" />
                  <span className="hidden xs:inline">Back to Properties</span>
                  <span className="xs:hidden">Back</span>
                </Link>
                <div className="flex space-x-1 md:space-x-2">
                  <button 
                    onClick={() => setFavorite(!favorite)}
                    className={`p-2 md:p-3 rounded-lg ${favorite ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30 transition`}
                  >
                    <FaHeart className={`text-sm md:text-base ${favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 md:p-3 rounded-lg bg-white/20 hover:bg-white/30 transition">
                    <FaShare className="text-sm md:text-base" />
                  </button>
                </div>
              </div>

              {/* Property Header */}
              <div className="grid lg:grid-cols-3 gap-4 md:gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold ${getStatusColor(property.status)}`}>
                      {getStatusText(property.status)}
                    </span>
                    {property.featured && (
                      <span className="px-3 py-1 md:px-4 md:py-2 rounded-lg bg-yellow-400 text-yellow-900 text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2">
                        <FaStar className="fill-current text-xs md:text-sm" />
                        <span className="hidden xs:inline">Featured</span>
                        <span className="xs:hidden">Feat.</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 leading-tight">
                      {property.title}
                    </h1>
                    <div className="flex items-center space-x-2 text-sm md:text-lg">
                      <FaMapMarkerAlt className="flex-shrink-0" />
                      <span className="truncate">{property.formattedAddress || location.address}</span>
                    </div>
                  </div>

                  {/* Quick Features - Show actual data */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
                    {features.slice(0, 4).map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="text-center p-2 md:p-4 bg-white/10 rounded-lg">
                          <IconComponent className="text-lg md:text-2xl mx-auto mb-1 md:mb-2" />
                          <div className="text-sm md:text-xl font-bold truncate">{feature.value}</div>
                          <div className="text-xs md:text-sm text-white/80 truncate">{feature.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - Price & Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                  <div className="text-center mb-4 md:mb-6">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-white/80 text-sm md:text-base">
                      {property.status === 'for-rent' || property.status === 'rent' ? 'per month' : 'Total Price'}
                    </div>
                    {specs.area && (
                      <div className="text-white/60 text-xs md:text-sm mt-1 md:mt-2">
                        {formatPrice(Math.round(property.price / specs.area))} per sq ft
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full bg-white text-blue-600 py-2 md:py-3 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <FaPhone className="text-sm md:text-base" />
                      <span>Contact Agent</span>
                    </button>
                    
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="w-full border-2 border-white text-white py-2 md:py-3 rounded-lg hover:bg-white/10 transition font-semibold flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <FaCalendar className="text-sm md:text-base" />
                      <span>Schedule Viewing</span>
                    </button>

                    <button className="w-full border border-white/40 text-white py-2 md:py-3 rounded-lg hover:bg-white/5 transition font-semibold flex items-center justify-center space-x-2 text-sm md:text-base">
                      <FaVideo className="text-sm md:text-base" />
                      <span>Virtual Tour</span>
                    </button>
                  </div>

                  {/* Property ID */}
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/20 text-center text-white/70 text-xs md:text-sm">
                    Property ID: {property._id?.slice(-8) || property.id?.slice(-8)}
                  </div>
                </div>
              </div>
            </div>
          </NarrowContainer>
        </div>

        {/* Main Content */}
        <NarrowContainer>
          {/* Highlights */}
          <div className="py-6 md:py-8 -mt-6 md:-mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-lg p-3 md:p-4 shadow-md border">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-blue-100 rounded-lg text-blue-600">
                      <highlight.icon className="text-lg md:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg md:text-xl font-bold text-gray-900 truncate">{highlight.value}</div>
                      <div className="text-xs md:text-sm text-gray-600 truncate">{highlight.label}</div>
                      {highlight.badge && (
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {highlight.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="py-6 md:py-8">
            <PropertyGallery 
              images={allImages}
              title={property.title}
            />
          </div>

          {/* Tabs and Content */}
          <SplitContainer gap={6} className="md:gap-8">
            {/* Left Column */}
            <div className="space-y-6 md:space-y-8">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md border">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {['overview', 'features', 'location', 'details'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 min-w-0 px-4 py-3 md:px-6 md:py-4 font-medium text-xs md:text-sm capitalize border-b-2 transition whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6 md:space-y-8">
                {activeTab === 'overview' && (
                  <>
                    <div className="bg-white rounded-lg shadow-md border p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Property Description</h3>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {property.description}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Property Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {features.map((feature, index) => {
                          const IconComponent = feature.icon;
                          return (
                            <div key={index} className="flex items-center space-x-3 md:space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                                <IconComponent className="text-base md:text-lg" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-gray-600 font-medium text-sm md:text-base truncate">{feature.label}</span>
                                  <span className="font-bold text-gray-900 text-sm md:text-base ml-2">{feature.value}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'features' && (
                  <div className="bg-white rounded-lg shadow-md border p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Amenities</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {amenities.map((amenity, index) => {
                        const amenityKey = amenity.toLowerCase();
                        const IconComponent = amenityIcons[amenityKey] || FaStar;
                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                              <IconComponent className="text-base md:text-lg" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm md:text-base truncate">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="bg-white rounded-lg shadow-md border p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Location</h3>
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-lg md:text-xl">Address</h4>
                        <p className="text-gray-700 text-base md:text-lg font-medium">{property.formattedAddress}</p>
                        {location.city && (
                          <p className="text-gray-600 text-sm md:text-base">
                            {location.city}, {location.state} {location.zipCode}, {location.country}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-lg md:text-xl">Neighborhood</h4>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                          {property.description?.split('.')[0] || 'This property is located in a well-established neighborhood with good access to amenities and transportation.'}
                        </p>
                      </div>
                      <div className="h-48 md:h-64 bg-gray-200 rounded-lg">
                        <PropertyMap property={property} height="100%" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="bg-white rounded-lg shadow-md border p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Property Details</h3>
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-lg md:text-xl">Basic Information</h4>
                        <div className="space-y-2 md:space-y-3">
                          {[
                            { label: 'Property Type', value: property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'Residential' },
                            { label: 'Property Status', value: getStatusText(property.status) },
                            { label: 'Year Built', value: specs.yearBuilt || 'N/A' },
                            { label: 'Construction Type', value: specs.constructionType || 'Standard' },
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600 text-sm md:text-base">{item.label}</span>
                              <span className="font-semibold text-gray-900 text-sm md:text-base text-right">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-lg md:text-xl">Additional Information</h4>
                        <div className="space-y-2 md:space-y-3">
                          {[
                            { label: 'Property ID', value: property._id?.slice(-8) || property.id?.slice(-8) },
                            { label: 'Listed Date', value: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A' },
                            { label: 'Last Updated', value: property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A' },
                            { label: 'Currency', value: 'NGN' },
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600 text-sm md:text-base">{item.label}</span>
                              <span className="font-semibold text-gray-900 text-sm md:text-base text-right">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Agent Info */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white rounded-lg shadow-md border p-4 md:p-6 sticky top-4">
                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-lg md:text-xl">Property Agent</h4>
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <img
                    src={agent.photoURL || '/images/agent-placeholder.jpg'}
                    alt={agent.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover border-2 border-blue-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base md:text-lg truncate">{agent.name}</p>
                    <p className="text-gray-600 text-xs md:text-sm">Licensed Real Estate Agent</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-400 text-xs md:text-sm fill-current" />
                      ))}
                      <span className="text-xs md:text-sm text-gray-500 ml-1 md:ml-2">4.9 (128)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                  <div className="flex justify-between text-xs md:text-sm text-gray-600">
                    <span>Properties Sold</span>
                    <span className="font-semibold text-gray-900">247</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm text-gray-600">
                    <span>Experience</span>
                    <span className="font-semibold text-gray-900">8 years</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm text-gray-600">
                    <span>Response Time</span>
                    <span className="font-semibold text-green-600">~15 mins</span>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2 text-sm md:text-base"
                  >
                    <FaPhone className="text-sm md:text-base" />
                    <span>Contact Agent</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="w-full border-2 border-blue-600 text-blue-600 py-2 md:py-3 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center space-x-2 text-sm md:text-base"
                  >
                    <FaCalendar className="text-sm md:text-base" />
                    <span>Schedule Viewing</span>
                  </button>

                  <button className="w-full border border-gray-300 text-gray-700 py-2 md:py-3 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center space-x-2 text-sm md:text-base">
                    <FaEnvelope className="text-sm md:text-base" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-lg md:text-xl">Mortgage Estimate</h4>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="font-semibold text-gray-900">
                      ~{formatPrice(property.price * 0.004)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold text-gray-900">4.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-semibold text-gray-900">20%</span>
                  </div>
                  <button className="w-full mt-3 md:mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base">
                    Calculate Mortgage
                  </button>
                </div>
              </div>
            </div>
          </SplitContainer>
        </NarrowContainer>
      </div>

      {/* Enhanced Responsive Modals */}
      {(showContactForm || showAppointmentForm) && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in"
          onClick={handleOverlayClick}
        >
          <div className={`bg-white rounded-xl sm:rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scale-in ${
            isMobile ? 'mx-2 my-4' : ''
          }`}>
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10 flex justify-between items-center p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {showContactForm ? 'Contact Agent' : 'Schedule Viewing'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              {showContactForm && (
                <ContactForm
                  propertyId={property._id || property.id}
                  propertyTitle={property.title}
                  agentId={property.agentId}
                  onClose={closeModal}
                  isMobile={isMobile}
                />
              )}
              
              {showAppointmentForm && (
                <AppointmentForm
                  propertyId={property._id || property.id}
                  propertyTitle={property.title}
                  agentId={property.agentId}
                  agentName={agent.name}
                  onClose={closeModal}
                  isMobile={isMobile}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PropertyDetails;