import React from 'react';
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <HeroContainer>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Find Your Perfect 
                <span className="block text-blue-200">Dream Home</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Discover thousands of properties for sale and rent. Expert agents ready to help you find the perfect match.
              </p>
            </div>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto">
              <SearchForm 
                onSearch={handleSearch}
                variant="hero"
              />
            </div>
          </div>
        </HeroContainer>
      </section>

      {/* Featured Properties - Let it handle its own data fetching */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
        <WideContainer>
          <FeaturedProperties 
            title="Featured Properties"
            subtitle="Handpicked selections of premium properties"
            limit={6}
          />
        </WideContainer>
      </section>

      {/* Rest of your Home component remains the same... */}
      {/* Services Section */}
      <section className="py-10 bg-white">
        <WideContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive real estate services tailored to meet all your property needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group">
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white border border-blue-200 mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                  <div className="text-blue-600">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </WideContainer>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/20 rounded-full blur-lg"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
        </div>

        <WideContainer>
          <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-gray-700 mb-6 md:mb-8 leading-relaxed">
              Join thousands of satisfied clients who found their perfect home with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/properties"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg"
              >
                Browse Properties
              </a>
              <a
                href="/contact"
                className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
              >
                Contact Agent
              </a>
            </div>
          </div>
        </WideContainer>
      </section>
    </MainLayout>
  );
};

export default Home;