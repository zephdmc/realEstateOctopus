import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { HeroContainer, WideContainer } from '../../components/layout/PageContainer';
import SearchForm from '../../components/forms/SearchForm';
import FeaturedProperties from '../../components/properties/FeaturedProperties';
import { 
  FaHome, 
  FaMoneyBillWave, 
  FaBuilding, 
  FaChartLine
} from 'react-icons/fa';

const Home = () => {
  const services = [
    {
      icon: <FaHome className="w-10 h-10" />,
      title: 'Buying Properties',
      description: 'Find your dream home with our extensive property listings and expert guidance.'
    },
    {
      icon: <FaMoneyBillWave className="w-10 h-10" />,
      title: 'Selling Properties',
      description: 'Get the best value for your property with our marketing expertise and negotiation skills.'
    },
    {
      icon: <FaBuilding className="w-10 h-10" />,
      title: 'Property Rental',
      description: 'Discover perfect rental properties for your needs with our comprehensive rental services.'
    },
    {
      icon: <FaChartLine className="w-10 h-10" />,
      title: 'Property Management',
      description: 'Professional management services to maximize your property investment returns.'
    }
  ];

  const handleSearch = (searchData) => {
    console.log('Home search:', searchData);
    // Navigate to properties page with search parameters
  };

  return (
    <MainLayout>
      {/* Hero Section with Luxury Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `linear-gradient(
              rgba(37, 99, 235, 0.85),
              rgba(29, 78, 216, 0.90)
            ), url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/50 rounded-full animate-ping"></div>
          </div>
        </div>

        <HeroContainer>
          <div className="text-center space-y-4 md:space-y-8 relative z-10">
            <div className="space-y-6">
              {/* Main Heading with Enhanced Styling */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Find Your 
                <span className="block text-blue-200 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Dream Home
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
                Discover exclusive properties with premium amenities. Expert agents ready to guide you home.
              </p>
            </div>

            {/* Search Form with Enhanced Styling */}
            <div className="max-w-4xl mx-auto transform transition-all duration-500 hover:scale-[1.02]">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-2xl">
                <SearchForm 
                  onSearch={handleSearch}
                  variant="hero"
                />
              </div>
            </div>

            {/* Trust Indicators */}
          
          </div>
        </HeroContainer>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <WideContainer>
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
           
          </div>
          <FeaturedProperties 
            title=""
            subtitle=""
            limit={6}
          />
        </WideContainer>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full translate-y-24 -translate-x-24"></div>

        <WideContainer>
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive real estate services tailored to meet all your property needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-200 hover:-translate-y-2"
              >
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white mb-6 group-hover:bg-blue-700 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-800 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm relative">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </WideContainer>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:20px_20px]"></div>

        <WideContainer>
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
  {/* Luxury Background Image with Overlay */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `linear-gradient(
        rgba(37, 99, 235, 0.85),
        rgba(29, 78, 216, 0.92)
      ), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80')`
    }}
  >
    {/* Enhanced Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-500"></div>
    </div>

    {/* Subtle Pattern Overlay */}
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:20px_20px]"></div>
  </div>

  <WideContainer>
    <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
        Ready to Find Your Dream Property?
      </h2>
      <p className="text-blue-100 text-lg md:text-xl mb-8 leading-relaxed font-light">
        Join thousands of satisfied clients who found their perfect home with our expert guidance.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/properties"
          className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 min-w-[200px] text-center"
        >
          Browse Properties
        </Link>
        <Link
          href="/contact"
          className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold hover:shadow-xl hover:scale-105 min-w-[200px] text-center"
        >
          Contact Agent
        </Link>
      </div>

      {/* Additional Trust Element */}
      <div className="mt-8 text-blue-200 text-sm">
        Trusted by 5,000+ happy homeowners
      </div>
    </div>
  </WideContainer>
</section>
        </WideContainer>
      </section>
    </MainLayout>
  );
};

export default Home;