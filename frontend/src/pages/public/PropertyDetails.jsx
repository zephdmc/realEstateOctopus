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
  FaWhatsapp,
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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="text-center">
            <LoadingSpinner size="large" text="Loading luxury property details..." />
            <div className="mt-8 space-y-2">
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto">
                <div className="h-2 bg-blue-600 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-gray-500 text-sm">Preparing your exclusive viewing experience</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
          <NarrowContainer>
            <div className="text-center py-16 max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaHome className="w-16 h-16 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Property Not Available</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                This exclusive property is no longer available or has been moved to our private collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/properties"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Browse Luxury Properties
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-semibold"
                >
                  Contact Concierge
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
                         '/images/luxury-property-placeholder.jpg';

  // Enhanced features with more property data
  const features = [
    { icon: FaBed, label: 'Bedrooms', value: specs.bedrooms || property.bedrooms || 'N/A', description: 'Luxury suites' },
    { icon: FaBath, label: 'Bathrooms', value: specs.bathrooms || property.bathrooms || 'N/A', description: 'Spa-like bathrooms' },
    { icon: IoIosResize, label: 'Living Area', value: `${specs.area || property.area || 'N/A'} ${specs.areaUnit || 'sq ft'}`, description: 'Total living space' },
    { icon: FaVectorSquare, label: 'Lot Size', value: specs.lotSize ? `${specs.lotSize} ${specs.lotSizeUnit || 'acres'}` : 'N/A', description: 'Private estate' },
    { icon: FaCalendarAlt, label: 'Year Built', value: specs.yearBuilt || property.yearBuilt || 'N/A', description: 'Construction year' },
    { icon: FaBuilding, label: 'Stories', value: specs.stories || specs.floors || 'N/A', description: 'Architectural floors' },
    { icon: FaCar, label: 'Garage', value: specs.garage ? `${specs.garageSpaces || 2}+ cars` : 'Private', description: 'Secure parking' },
    { icon: FaParking, label: 'Parking', value: specs.parking || 'Valet', description: 'Guest parking' },
  ];

  // Luxury property highlights
  const highlights = [
    { icon: FaMoneyBillWave, label: 'Price per Sq Ft', value: property.price && specs.area ? `$${(property.price / specs.area).toFixed(2)}` : 'Premium', trend: '+5.2%' },
    { icon: FaClock, label: 'Market Presence', value: '2 weeks', badge: 'Exclusive' },
    { icon: FaEye, label: 'Elite Views', value: '2.4K', trend: '+42%' },
    { icon: FaStar, label: 'Luxury Rating', value: '4.9/5', reviews: '18 reviews' },
  ];

  // Enhanced amenities with luxury focus
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: property.currency || 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'for-rent':
      case 'forRent':
      case 'rent':
        return 'bg-blue-500/20 text-blue-700 border-blue-300 backdrop-blur-sm';
      case 'for-sale':
      case 'forSale':
      case 'sale':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-300 backdrop-blur-sm';
      case 'sold':
        return 'bg-rose-500/20 text-rose-700 border-rose-300 backdrop-blur-sm';
      case 'exclusive':
        return 'bg-purple-500/20 text-purple-700 border-purple-300 backdrop-blur-sm';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-300 backdrop-blur-sm';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'for-rent':
      case 'forRent':
      case 'rent':
        return 'Premium Rental';
      case 'for-sale':
      case 'forSale':
      case 'sale':
        return 'Exclusive Listing';
      case 'sold':
        return 'Property Sold';
      case 'exclusive':
        return 'Private Collection';
      default:
        return 'Available';
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "+2349132080059";
    const message = `Hello! I'm interested in the property: ${property.title} (${property._id || property.id}). Please provide more information.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const nearbyAmenities = [
    { icon: FaSchool, label: 'International Schools', distance: '0.3 mi', type: 'education' },
    { icon: FaShoppingBag, label: 'Luxury Boutiques', distance: '0.2 mi', type: 'shopping' },
    { icon: FaHospital, label: 'Medical Center', distance: '0.8 mi', type: 'healthcare' },
    { icon: FaSubway, label: 'Metro Station', distance: '0.1 mi', type: 'transport' },
    { icon: FaWalking, label: 'Central Park', distance: '0.4 mi', type: 'recreation' },
    { icon: FaUtensils, label: 'Fine Dining', distance: '0.2 mi', type: 'dining' },
  ];

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Enhanced Luxury Header with Parallax */}
        <div 
          className="relative min-h-[90vh] flex items-center justify-center text-white bg-cover bg-center bg-fixed bg-no-repeat overflow-hidden"
          style={{
            backgroundImage: backgroundImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white/60 rounded-full animate-ping"></div>
          </div>
          
          <NarrowContainer>
            <div className="relative z-10 py-16 lg:py-24">
              {/* Enhanced Navigation */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 lg:mb-16 gap-6">
                <Link 
                  to="/properties" 
                  className="flex items-center space-x-3 bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl text-white/90 hover:text-white hover:bg-white/30 transition-all duration-500 border border-white/30 hover:scale-105 shadow-2xl"
                >
                  <FaChevronLeft className="text-lg" />
                  <span className="font-semibold text-lg">Back to Collection</span>
                </Link>
                <div className="flex items-center space-x-3 flex-wrap gap-3">
                  <button 
                    onClick={() => setFavorite(!favorite)}
                    className={`p-4 rounded-2xl backdrop-blur-lg transition-all duration-500 border shadow-2xl ${
                      favorite 
                        ? 'bg-rose-500 text-white border-rose-400 hover:bg-rose-600' 
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-110'
                    }`}
                  >
                    <FaHeart className={`text-xl ${favorite ? 'fill-current animate-heartbeat' : ''}`} />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/20 backdrop-blur-lg text-white border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-500 shadow-2xl">
                    <FaShare className="text-xl" />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/20 backdrop-blur-lg text-white border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-500 shadow-2xl">
                    <FaPrint className="text-xl" />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/20 backdrop-blur-lg text-white border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-500 shadow-2xl">
                    <FaDownload className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Enhanced Property Header Content */}
              <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">
                {/* Left Column - Property Info */}
                <div className="space-y-8 lg:space-y-12">
                  {/* Enhanced Status Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-6 py-3 rounded-2xl text-base font-bold border-2 backdrop-blur-lg ${getStatusColor(property.status)} shadow-2xl`}>
                      {getStatusText(property.status)}
                    </span>
                    {property.featured && (
                      <span className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 text-base font-bold border-2 border-yellow-300 backdrop-blur-lg flex items-center gap-3 shadow-2xl">
                        <FaStar className="fill-current" />
                        Featured Property
                      </span>
                    )}
                    {specs.isNewConstruction && (
                      <span className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 text-emerald-900 text-base font-bold border-2 border-emerald-300 backdrop-blur-lg shadow-2xl">
                        New Construction
                      </span>
                    )}
                  </div>

                  {/* Enhanced Property Title */}
                  <div className="space-y-6">
                    <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight font-serif tracking-tight">
                      {property.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-white/90 text-xl">
                      <FaMapMarkerAlt className="text-2xl flex-shrink-0" />
                      <span className="font-semibold text-2xl leading-relaxed">
                        {location.address || property.formattedAddress || 'Prime Luxury Location'}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {features.slice(0, 4).map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="text-center p-4 lg:p-6 bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 shadow-2xl group">
                          <IconComponent className="text-2xl lg:text-3xl mx-auto mb-3 text-white/90 group-hover:scale-110 transition-transform duration-500" />
                          <div className="text-xl lg:text-2xl font-bold text-white">{feature.value}</div>
                          <div className="text-sm lg:text-base text-white/80">{feature.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - Price & Actions */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl lg:sticky lg:top-8">
                  {/* Enhanced Price Display */}
                  <div className="text-center mb-8">
                    <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 font-serif">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-lg lg:text-xl text-white/80">
                      {(property.status === 'for-rent' || property.status === 'forRent' || property.status === 'rent') ? 'per month' : 'Exclusive Price'}
                    </div>
                    {specs.area && (
                      <div className="text-white/70 text-sm lg:text-base mt-3">
                        {formatPrice(property.price / specs.area)} per sq ft
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full bg-gradient-to-r from-white to-blue-50 text-blue-600 py-5 rounded-2xl hover:from-blue-50 hover:to-blue-100 transition-all duration-500 font-bold flex items-center justify-center space-x-4 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                    >
                      <FaPhone className="text-xl" />
                      <span>Contact Concierge</span>
                    </button>
                    
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="w-full border-2 border-white text-white py-5 rounded-2xl hover:bg-white/10 transition-all duration-500 font-bold flex items-center justify-center space-x-4 text-lg backdrop-blur-sm hover:scale-105 shadow-2xl"
                    >
                      <FaCalendar className="text-xl" />
                      <span>Private Viewing</span>
                    </button>

                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-500 font-bold flex items-center justify-center space-x-4 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                    >
                      <FaWhatsapp className="text-xl" />
                      <span>WhatsApp Now</span>
                    </button>

                    <button className="w-full border border-white/40 text-white/90 py-4 rounded-2xl hover:bg-white/5 transition-all duration-500 font-semibold flex items-center justify-center space-x-3 text-base backdrop-blur-sm hover:scale-105">
                      <FaVideo className="text-lg" />
                      <span>Virtual Tour</span>
                    </button>
                  </div>

                  {/* Enhanced Additional Info */}
                  <div className="mt-8 pt-6 border-t border-white/30">
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

          {/* Enhanced Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-white/80 text-sm font-medium">Explore More</span>
              <FaChevronDown className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Sticky Quick Actions Bar */}
        {isSticky && (
          <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-40 transform animate-slide-down shadow-2xl">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaHome className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg truncate max-w-xs lg:max-w-md">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center space-x-1">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span>{location.address?.split(',')[0] || 'Prime Location'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden lg:block">
                    <div className="text-2xl font-bold text-gray-900 font-serif">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl"
                    >
                      Contact
                    </button>
                    <button
                      onClick={handleWhatsAppClick}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <FaWhatsapp className="text-lg" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <NarrowContainer>
          {/* Enhanced Property Highlights */}
          <div className="py-12 lg:py-16 -mt-20 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {highlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 lg:p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group">
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <div className="p-3 lg:p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <highlight.icon className="text-xl lg:text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900">{highlight.value}</div>
                      <div className="text-sm lg:text-base text-gray-600">{highlight.label}</div>
                      <div className="flex items-center space-x-2 mt-2">
                        {highlight.badge && (
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold">
                            {highlight.badge}
                          </span>
                        )}
                        {highlight.trend && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold">
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

          {/* Enhanced Gallery Section */}
          <div className="py-12 lg:py-16">
            <PropertyGallery 
              images={property.images || []}
              title={property.title}
              className="rounded-3xl overflow-hidden shadow-3xl"
              onImageChange={setCurrentImageIndex}
            />
          </div>

          {/* Enhanced Main Content */}
          <SplitContainer gap={8} className="lg:gap-12">
            {/* Left Column */}
            <div className="space-y-8 lg:space-y-12">
              {/* Luxury Navigation Tabs */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 lg:p-4">
                <nav className="flex flex-wrap gap-2 lg:gap-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: FaHome },
                    { id: 'features', label: 'Luxury Features', icon: FaStar },
                    { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
                    { id: 'details', label: 'Details', icon: FaBuilding },
                    { id: 'amenities', label: 'Amenities', icon: FaSwimmingPool }
                  ].map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 lg:space-x-3 py-3 lg:py-4 px-4 lg:px-6 rounded-2xl font-semibold text-sm lg:text-base transition-all duration-500 flex-1 lg:flex-none min-w-0 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105'
                        }`}
                      >
                        <IconComponent className="text-lg lg:text-xl flex-shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Enhanced Tab Content */}
              <div className="space-y-8 lg:space-y-12">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 lg:space-y-12">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
                      <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8 font-serif">Property Description</h3>
                      <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                        {property.description || 'This exceptional property represents the pinnacle of luxury living, meticulously crafted with unparalleled attention to detail. Featuring exquisite finishes, state-of-the-art amenities, and breathtaking views, this residence offers an extraordinary lifestyle experience in one of the world\'s most prestigious locations.'}
                      </p>
                    </div>

                    {/* Enhanced Key Features */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
                      <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8 font-serif">Property Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {features.map((feature, index) => {
                          const IconComponent = feature.icon;
                          return (
                            <div key={index} className="flex items-center space-x-4 p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-500 group hover:shadow-lg">
                              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                <IconComponent className="text-xl lg:text-2xl" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm lg:text-base text-gray-600 font-semibold truncate">{feature.label}</span>
                                  <span className="text-lg lg:text-xl font-bold text-gray-900 ml-2">{feature.value}</span>
                                </div>
                                <p className="text-xs lg:text-sm text-gray-500 truncate">{feature.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab - Enhanced */}
                {activeTab === 'features' && (
                  <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
                    <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8 font-serif">Luxury Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {amenities.map((amenity, index) => {
                        const amenityKey = amenity.toLowerCase().replace(/\s+/g, '-');
                        const IconComponent = amenityIcons[amenityKey] || FaStar;
                        return (
                          <div key={index} className="flex items-center space-x-4 p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-500 group hover:shadow-lg">
                            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                              <IconComponent className="text-lg lg:text-xl" />
                            </div>
                            <span className="text-gray-700 font-semibold text-sm lg:text-base flex-1">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Location Tab - Enhanced */}
                {activeTab === 'location' && (
                  <div className="space-y-8 lg:space-y-12">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
                      <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8 font-serif">Location & Neighborhood</h3>
                      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-xl lg:text-2xl">Prime Address</h4>
                            <div className="space-y-3 text-gray-700 text-base lg:text-lg">
                              <p className="font-semibold text-xl">{location.address || property.formattedAddress}</p>
                              {location.city && <p>{location.city}, {location.state} {location.zipCode}</p>}
                              {location.country && <p>{location.country}</p>}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-xl lg:text-2xl">Neighborhood</h4>
                            <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                              Nestled in the prestigious {location.neighborhood || location.city || 'this exclusive'} enclave, 
                              this property offers unparalleled access to world-class amenities, Michelin-starred restaurants, 
                              luxury boutiques, and cultural landmarks. The neighborhood boasts exceptional security, 
                              privacy, and convenience.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-xl lg:text-2xl">Walk Score</h4>
                            <div className="flex items-center space-x-6">
                              <div className="text-4xl lg:text-5xl font-bold text-emerald-600">96</div>
                              <div className="text-sm lg:text-base text-gray-600">
                                <div className="font-semibold text-lg">Walker's Paradise</div>
                                <div>Exceptional public transportation</div>
                                <div>Bike score: 88</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-xl lg:text-2xl">Nearby Luxury Amenities</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm lg:text-base text-gray-700">
                              {nearbyAmenities.map((amenity, index) => {
                                const IconComponent = amenity.icon;
                                return (
                                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                    <IconComponent className="text-blue-600 text-lg flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-gray-900 truncate">{amenity.label}</div>
                                      <div className="text-gray-600 text-sm">{amenity.distance}</div>
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
                        className="rounded-2xl overflow-hidden shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Details Tab - Enhanced */}
                {activeTab === 'details' && (
                  <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
                    <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8 font-serif">Property Details</h3>
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-xl lg:text-2xl">Basic Information</h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Property Type', value: property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'Luxury Residential' },
                              { label: 'Property Status', value: getStatusText(property.status) },
                              { label: 'Year Built', value: specs.yearBuilt || 'N/A' },
                              { label: 'Lot Size', value: specs.lotSize ? `${specs.lotSize} ${specs.lotSizeUnit || 'acres'}` : 'N/A' },
                              { label: 'Architectural Style', value: specs.architecturalStyle || 'Contemporary Luxury' },
                              { label: 'Construction', value: specs.constructionType || 'Premium Materials' },
                            ].map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-3 lg:py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-semibold text-base lg:text-lg">{item.label}</span>
                                <span className="font-bold text-gray-900 text-base lg:text-lg">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-xl lg:text-2xl">Additional Information</h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Currency', value: property.currency || 'USD' },
                              { label: 'Listed Date', value: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A' },
                              { label: 'Last Updated', value: property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A' },
                              { label: 'Property ID', value: property._id || property.id },
                              { label: 'MLS Number', value: specs.mlsNumber || 'N/A' },
                              { label: 'Annual Taxes', value: specs.annualTaxes ? formatPrice(specs.annualTaxes) : 'N/A' },
                            ].map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-3 lg:py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-semibold text-base lg:text-lg">{item.label}</span>
                                <span className="font-bold text-gray-900 text-base lg:text-lg">{item.value}</span>
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
                  <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
                    <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8 font-serif">Luxury Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {amenities.map((amenity, index) => {
                        const amenityKey = amenity.toLowerCase().replace(/\s+/g, '-');
                        const IconComponent = amenityIcons[amenityKey] || FaStar;
                        return (
                          <div key={index} className="flex items-center space-x-4 p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-500 group hover:shadow-lg">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white group-hover:scale-110 transition-transform duration-500 shadow-lg">
                              <IconComponent className="text-lg lg:text-xl" />
                            </div>
                            <span className="text-gray-800 font-semibold text-sm lg:text-base flex-1">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Enhanced Agent & Actions */}
            <div className="space-y-8 lg:space-y-12">
              {/* Luxury Agent Card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8 sticky top-8">
                <h4 className="font-bold text-gray-900 mb-6 text-2xl lg:text-3xl font-serif">Luxury Concierge</h4>
                <div className="flex items-center space-x-4 lg:space-x-6 mb-6 lg:mb-8">
                  <img
                    src={agent.avatar || agent.photoURL || '/images/luxury-agent-placeholder.jpg'}
                    alt={agent.name}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border-4 border-blue-200 shadow-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xl lg:text-2xl truncate">{agent.name || 'Elite Agent'}</p>
                    <p className="text-gray-600 mb-2 lg:mb-3 text-sm lg:text-base">Senior Luxury Property Specialist</p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-400 text-sm lg:text-base fill-current" />
                      ))}
                      <span className="text-sm lg:text-base text-gray-500 ml-2">4.9 (247 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                  <div className="flex items-center justify-between text-sm lg:text-base text-gray-600">
                    <span>Luxury Properties Sold</span>
                    <span className="font-bold text-gray-900">512</span>
                  </div>
                  <div className="flex items-center justify-between text-sm lg:text-base text-gray-600">
                    <span>Experience</span>
                    <span className="font-bold text-gray-900">12+ years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm lg:text-base text-gray-600">
                    <span>Response Time</span>
                    <span className="font-bold text-emerald-600">~10 mins</span>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 lg:py-5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-500 font-bold flex items-center justify-center space-x-3 lg:space-x-4 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    <FaPhone className="text-xl" />
                    <span>Contact Concierge</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="w-full border-2 border-blue-600 text-blue-600 py-4 lg:py-5 rounded-2xl hover:bg-blue-50 transition-all duration-500 font-bold flex items-center justify-center space-x-3 lg:space-x-4 text-lg hover:scale-105 shadow-lg"
                  >
                    <FaCalendar className="text-xl" />
                    <span>Private Viewing</span>
                  </button>

                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 lg:py-5 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-500 font-bold flex items-center justify-center space-x-3 lg:space-x-4 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>WhatsApp Direct</span>
                  </button>
                </div>
              </div>

              {/* Enhanced Quick Facts */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 lg:p-8 border border-blue-200 shadow-2xl">
                <h4 className="font-bold text-gray-900 mb-6 text-xl lg:text-2xl">Property Insights</h4>
                <div className="space-y-4 lg:space-y-5">
                  {[
                    { label: 'Property ID', value: property._id || property.id, icon: FaBuilding },
                    { label: 'Total Views', value: '2,458', icon: FaEye },
                    { label: 'Days on Market', value: '14 days', icon: FaClock },
                    { label: 'Last Price Update', value: property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'Today', icon: FaCalendar },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex items-center justify-between py-2 lg:py-3">
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <IconComponent className="text-blue-600 text-lg lg:text-xl" />
                          <span className="text-gray-600 font-semibold text-sm lg:text-base">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-900 text-sm lg:text-base">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Mortgage Calculator */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl p-6 lg:p-8 border border-emerald-200 shadow-2xl">
                <h4 className="font-bold text-gray-900 mb-4 lg:mb-6 text-xl lg:text-2xl">Financing Estimate</h4>
                <div className="space-y-3 lg:space-y-4 text-sm lg:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="font-bold text-gray-900">~{formatPrice(property.price * 0.004)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-bold text-gray-900">3.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-bold text-gray-900">20%</span>
                  </div>
                  <button className="w-full mt-4 lg:mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 lg:py-4 rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-500 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Custom Financing
                  </button>
                </div>
              </div>
            </div>
          </SplitContainer>
        </NarrowContainer>
      </div>

      {/* Enhanced Luxury Modals */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-3xl transform animate-scale-in">
            <ContactForm
              propertyId={property._id || property.id}
              propertyTitle={property.title}
              agentId={property.agentId}
              onClose={() => setShowContactForm(false)}
            />
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-3xl transform animate-scale-in">
            <AppointmentForm
              propertyId={property._id || property.id}
              propertyTitle={property.title}
              agentId={property.agentId}
              agentName={agent.name}
              onClose={() => setShowAppointmentForm(false)}
            />
            <button
              onClick={() => setShowAppointmentForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-2xl shadow-3xl hover:shadow-4xl transition-all duration-500 transform hover:scale-110 animate-bounce"
          title="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7" />
        </button>
      </div>
    </MainLayout>
  );
};

export default PropertyDetails;