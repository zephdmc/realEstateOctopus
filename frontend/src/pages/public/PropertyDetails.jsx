import React, { useState } from 'react';
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
  FaEye
} from 'react-icons/fa';
import { MdApartment, MdBalcony, MdElevator, MdFamilyRestroom } from 'react-icons/md';
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="large" text="Loading property details..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <NarrowContainer>
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/properties"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
            >
              Browse All Properties
            </Link>
          </div>
        </NarrowContainer>
      </MainLayout>
    );
  }

  // Extract property data
  const specs = property.specifications || {};
  const location = property.location || {};
  const amenities = property.amenities || [];
  
  // Get background image - use primaryImage or first image from images array
  const backgroundImage = property.primaryImage || 
                         property.images?.[0]?.url || 
                         property.featuredImage?.url;

  // Enhanced features with more property data
  const features = [
    { icon: FaBed, label: 'Bedrooms', value: specs.bedrooms || property.bedrooms || 'N/A', description: 'Spacious bedrooms' },
    { icon: FaBath, label: 'Bathrooms', value: specs.bathrooms || property.bathrooms || 'N/A', description: 'Modern bathrooms' },
    { icon: FaRulerCombined, label: 'Area', value: `${specs.area || property.area || 'N/A'} ${specs.areaUnit || 'sq ft'}`, description: 'Total living area' },
    { icon: FaVectorSquare, label: 'Lot Size', value: specs.lotSize ? `${specs.lotSize} ${specs.lotSizeUnit || 'sq ft'}` : 'N/A', description: 'Property land size' },
    { icon: FaCalendarAlt, label: 'Year Built', value: specs.yearBuilt || property.yearBuilt || 'N/A', description: 'Construction year' },
    { icon: FaBuilding, label: 'Stories', value: specs.stories || specs.floors || 'N/A', description: 'Number of floors' },
    { icon: FaCar, label: 'Garage', value: specs.garage ? `${specs.garageSpaces || 1} spaces` : 'No', description: 'Parking capacity' },
    { icon: FaParking, label: 'Parking', value: specs.parking || property.parking || 'N/A', description: 'Additional parking' },
  ];

  // Property highlights
  const highlights = [
    { icon: FaMoneyBillWave, label: 'Price per Sq Ft', value: property.price && specs.area ? `€${(property.price / specs.area).toFixed(2)}` : 'N/A' },
    { icon: FaClock, label: 'Time on Market', value: '2 weeks', badge: 'New' },
    { icon: FaEye, label: 'Property Views', value: '1,247', trend: '+25%' },
    { icon: FaStar, label: 'Property Rating', value: '4.8/5', reviews: '12 reviews' },
  ];

  const amenityIcons = {
    'swimming-pool': FaSwimmingPool,
    'garden': FaTree,
    'balcony': MdBalcony,
    'terrace': MdBalcony,
    'air-conditioning': FaSnowflake,
    'heating': FaFire,
    'security-system': FaShieldAlt,
    'pet-friendly': FaPaw,
    'furnished': FaChair,
    'wifi': FaWifi,
    'tv': FaTv,
    'kitchen': FaUtensils,
    'gym': FaDumbbell,
    'elevator': MdElevator,
    'family-friendly': MdFamilyRestroom,
    'parking': FaParking
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: property.currency || 'EUR',
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

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Enhanced Header Section with Background Image */}
        <div 
          className="relative min-h-[70vh] flex items-center justify-center text-white bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: backgroundImage ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <NarrowContainer>
            <div className="relative z-10 py-12">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-12">
                <Link 
                  to="/properties" 
                  className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/30 transition-all duration-300 border border-white/20"
                >
                  <FaChevronLeft className="text-sm" />
                  <span className="font-medium">Back to Properties</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setFavorite(!favorite)}
                    className={`p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 border ${
                      favorite 
                        ? 'bg-red-500 text-white border-red-400 shadow-lg' 
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-105'
                    }`}
                  >
                    <FaHeart className={favorite ? 'fill-current' : ''} />
                  </button>
                  <button className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                    <FaShare />
                  </button>
                  <button className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                    <FaExpand />
                  </button>
                </div>
              </div>

              {/* Property Header Content */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Property Info */}
                <div className="space-y-8">
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 backdrop-blur-sm ${getStatusColor(property.status)}`}>
                      {getStatusText(property.status)}
                    </span>
                    {property.featured && (
                      <span className="px-4 py-2 rounded-2xl bg-yellow-400/90 text-yellow-900 text-sm font-semibold border-2 border-yellow-300 backdrop-blur-sm flex items-center gap-2">
                        <FaStar className="fill-current" />
                        Featured Property
                      </span>
                    )}
                    {specs.isNewConstruction && (
                      <span className="px-4 py-2 rounded-2xl bg-green-400/90 text-green-900 text-sm font-semibold border-2 border-green-300 backdrop-blur-sm">
                        New Construction
                      </span>
                    )}
                  </div>

                  {/* Property Title */}
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight font-serif">
                      {property.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-white/90 text-lg">
                      <FaMapMarkerAlt className="text-xl" />
                      <span className="font-medium">{location.address || property.formattedAddress || 'Prime Location'}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.slice(0, 4).map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                          <IconComponent className="text-2xl mx-auto mb-2 text-white/90" />
                          <div className="text-2xl font-bold text-white">{feature.value}</div>
                          <div className="text-sm text-white/80">{feature.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - Price & Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="text-5xl lg:text-6xl font-bold text-white mb-2">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-xl text-white/80">
                      {(property.status === 'for-rent' || property.status === 'forRent' || property.status === 'rent') ? 'per month' : 'Total Price'}
                    </div>
                    {specs.area && (
                      <div className="text-white/70 text-sm mt-2">
                        {formatPrice(property.price / specs.area)} per sq ft
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full bg-white text-blue-600 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <FaPhone className="text-lg" />
                      <span>Contact Agent</span>
                    </button>
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="w-full border-2 border-white text-white py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-lg backdrop-blur-sm hover:scale-105"
                    >
                      <FaCalendar className="text-lg" />
                      <span>Schedule Viewing</span>
                    </button>
                    <button className="w-full border border-white/30 text-white/90 py-4 rounded-2xl hover:bg-white/5 transition-all duration-300 font-medium flex items-center justify-center space-x-3 text-lg backdrop-blur-sm">
                      <FaEnvelope className="text-lg" />
                      <span>Email Details</span>
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="grid grid-cols-2 gap-4 text-center text-white/80 text-sm">
                      <div>
                        <div className="font-semibold">Property ID</div>
                        <div className="font-mono">{property._id?.slice(-8) || property.id?.slice(-8)}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Updated</div>
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
            <FaChevronDown className="text-white text-2xl" />
          </div>
        </div>

        <NarrowContainer>
          {/* Property Highlights */}
          <div className="py-12 -mt-20 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                      <highlight.icon className="text-xl" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{highlight.value}</div>
                      <div className="text-sm text-gray-600">{highlight.label}</div>
                      {highlight.badge && (
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          {highlight.badge}
                        </span>
                      )}
                      {highlight.trend && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          {highlight.trend}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="py-12">
            <PropertyGallery 
              images={property.images || []}
              title={property.title}
              className="rounded-3xl overflow-hidden shadow-2xl"
            />
          </div>

          {/* Main Content */}
          <SplitContainer gap={12}>
            {/* Left Column */}
            <div className="space-y-12">
              {/* Enhanced Navigation Tabs */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-2">
                <nav className="flex space-x-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: FaHome },
                    { id: 'features', label: 'Features', icon: FaStar },
                    { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
                    { id: 'details', label: 'Details', icon: FaBuilding }
                  ].map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-6 rounded-2xl font-medium text-sm transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="text-lg" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Enhanced Tab Content */}
              <div className="space-y-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Property Description</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {property.description || 'This exquisite property represents the pinnacle of modern luxury living. Meticulously designed with attention to every detail, this home offers an unparalleled living experience in one of the most sought-after locations.'}
                      </p>
                    </div>

                    {/* Enhanced Key Features */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Property Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => {
                          const IconComponent = feature.icon;
                          return (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 group hover:shadow-lg">
                              <div className="p-3 bg-blue-100 rounded-xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                <IconComponent className="text-xl" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 font-medium">{feature.label}</span>
                                  <span className="text-lg font-bold text-gray-900">{feature.value}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
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
                  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Amenities & Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {amenities.map((amenity, index) => {
                        const amenityKey = amenity.toLowerCase().replace(/\s+/g, '-');
                        const IconComponent = amenityIcons[amenityKey] || FaStar;
                        return (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 group hover:shadow-lg">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="text-lg" />
                            </div>
                            <span className="text-gray-700 font-medium">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Location & Neighborhood</h3>
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Address</h4>
                            <div className="space-y-2 text-gray-700">
                              <p className="text-lg">{location.address || property.formattedAddress}</p>
                              {location.city && <p>{location.city}, {location.state} {location.zipCode}</p>}
                              {location.country && <p>{location.country}</p>}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Neighborhood</h4>
                            <p className="text-gray-700 leading-relaxed">
                              Located in the prestigious {location.neighborhood || location.city || 'this sought-after'} neighborhood, 
                              this property offers unparalleled access to top-rated schools, luxury shopping centers, fine dining establishments, 
                              and beautiful parks. Excellent transportation links make commuting effortless.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Walk Score</h4>
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl font-bold text-green-600">92</div>
                              <div className="text-sm text-gray-600">
                                <div>Walker's Paradise</div>
                                <div>Excellent public transportation</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Nearby Amenities</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                              <div>🏫 Schools: 0.3 mi</div>
                              <div>🛒 Shopping: 0.2 mi</div>
                              <div>🏥 Hospital: 0.8 mi</div>
                              <div>🚇 Metro: 0.1 mi</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <PropertyMap 
                        property={property}
                        height="500px"
                        interactive={true}
                        className="rounded-2xl overflow-hidden shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Property Details</h3>
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
                              { label: 'Property Style', value: specs.architecturalStyle || 'Contemporary' },
                              { label: 'Construction', value: specs.constructionType || 'Brick' },
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
                              { label: 'Currency', value: property.currency || 'EUR' },
                              { label: 'Listed Date', value: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A' },
                              { label: 'Last Updated', value: property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A' },
                              { label: 'Property ID', value: property._id || property.id },
                              { label: 'MLS Number', value: specs.mlsNumber || 'N/A' },
                              { label: 'Tax Amount', value: specs.annualTaxes ? formatPrice(specs.annualTaxes) : 'N/A' },
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
              </div>
            </div>

            {/* Right Column - Agent & Actions */}
            <div className="space-y-8">
              {/* Enhanced Agent Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
                <h4 className="font-semibold text-gray-900 mb-6 text-2xl font-serif">Property Agent</h4>
                <div className="flex items-center space-x-6 mb-8">
                  <img
                    src={property.agent?.avatar || property.agentInfo?.photoURL || '/images/avatar-placeholder.jpg'}
                    alt={property.agent?.name || property.agentInfo?.name}
                    className="w-20 h-20 rounded-2xl border-4 border-blue-200 shadow-lg"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xl">{property.agent?.name || property.agentInfo?.name || 'Professional Agent'}</p>
                    <p className="text-gray-600 mb-2">Licensed Real Estate Agent</p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-400 text-sm fill-current" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">4.9 (128 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
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

                <div className="space-y-4">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <FaPhone className="text-lg" />
                    <span>Contact Agent</span>
                  </button>
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-lg hover:scale-105"
                  >
                    <FaCalendar className="text-lg" />
                    <span>Schedule Viewing</span>
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 text-lg">
                    <FaEnvelope className="text-lg" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>

              {/* Enhanced Quick Facts */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border border-blue-200 shadow-lg">
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

              {/* Mortgage Calculator Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 border border-green-200 shadow-lg">
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
                  <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition duration-200 font-semibold">
                    Calculate Mortgage
                  </button>
                </div>
              </div>
            </div>
          </SplitContainer>
        </NarrowContainer>
      </div>

      {/* Enhanced Modals */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scale-in">
            <ContactForm
              propertyId={property._id || property.id}
              propertyTitle={property.title}
              agentId={property.agentId}
              onClose={() => setShowContactForm(false)}
            />
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scale-in">
            <AppointmentForm
              propertyId={property._id || property.id}
              propertyTitle={property.title}
              agentId={property.agentId}
              agentName={property.agent?.name || property.agentInfo?.name}
              onClose={() => setShowAppointmentForm(false)}
            />
            <button
              onClick={() => setShowAppointmentForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
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