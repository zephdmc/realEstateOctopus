import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { WideContainer, GridContainer } from '../../components/layout/PageContainer';
import { 
  FaHome, 
  FaMoneyBillWave, 
  FaBuilding, 
  FaChartLine, 
  FaCity, 
  FaComments, 
  FaSearchDollar, 
  FaFileContract, 
  FaHandshake,
  FaUserFriends,
  FaKey,
  FaSearch,
  FaChartBar,
  FaHandshake as FaNegotiation,
  FaFileSignature,
  FaPhone,
  FaRocket
} from 'react-icons/fa';

const Services = () => {
  const mainServices = [
    {
      icon: <FaHome className="w-12 h-12" />,
      title: 'Property Buying',
      description: 'Find and purchase your dream home with expert guidance through every step of the process.',
      features: [
        'Personalized property search',
        'Market analysis and pricing',
        'Negotiation and offer management',
        'Mortgage assistance',
        'Closing coordination'
      ],
      cta: 'Start Your Search'
    },
    {
      icon: <FaMoneyBillWave className="w-12 h-12" />,
      title: 'Property Selling',
      description: 'Maximize your property value and sell quickly with our comprehensive marketing strategy.',
      features: [
        'Professional valuation',
        'Staging and photography',
        'Multi-channel marketing',
        'Buyer screening and showings',
        'Contract negotiation'
      ],
      cta: 'Get Free Valuation'
    },
    {
      icon: <FaBuilding className="w-12 h-12" />,
      title: 'Property Rental',
      description: 'Find perfect rental properties or manage your rental investments efficiently.',
      features: [
        'Tenant screening',
        'Lease management',
        'Rent collection',
        'Maintenance coordination',
        'Property inspections'
      ],
      cta: 'Browse Rentals'
    }
  ];

  const additionalServices = [
    {
      icon: <FaChartLine className="w-10 h-10" />,
      title: 'Property Management',
      description: 'Professional management services for rental properties and investment portfolios.'
    },
    {
      icon: <FaCity className="w-10 h-10" />,
      title: 'Commercial Real Estate',
      description: 'Expert services for commercial property transactions and investments.'
    },
    {
      icon: <FaComments className="w-10 h-10" />,
      title: 'Real Estate Consulting',
      description: 'Strategic advice for property investors and portfolio optimization.'
    },
    {
      icon: <FaSearchDollar className="w-10 h-10" />,
      title: 'Property Valuation',
      description: 'Accurate market valuations for sales, purchases, and investment analysis.'
    },
    {
      icon: <FaFileContract className="w-10 h-10" />,
      title: 'Legal Support',
      description: 'Assistance with contracts, disclosures, and legal documentation.'
    },
    {
      icon: <FaHandshake className="w-10 h-10" />,
      title: 'Mortgage Services',
      description: 'Connections with trusted lenders and mortgage assistance.'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Consultation',
      description: 'We discuss your needs, preferences, and budget to understand your requirements.',
      icon: <FaUserFriends className="w-6 h-6" />
    },
    {
      step: '02',
      title: 'Property Search',
      description: 'Our agents search for properties that match your criteria and schedule viewings.',
      icon: <FaSearch className="w-6 h-6" />
    },
    {
      step: '03',
      title: 'Analysis & Offer',
      description: 'We provide market analysis and help you make competitive offers.',
      icon: <FaChartBar className="w-6 h-6" />
    },
    {
      step: '04',
      title: 'Negotiation',
      description: 'Our experts negotiate the best terms and price on your behalf.',
      icon: <FaNegotiation className="w-6 h-6" />
    },
    {
      step: '05',
      title: 'Closing',
      description: 'We coordinate all paperwork and ensure a smooth closing process.',
      icon: <FaFileSignature className="w-6 h-6" />
    }
  ];

  return (
    <MainLayout>
      <WideContainer>
        {/* Header */}
        <div className="relative py-20 mb-16 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
  {/* Canvas-style background elements */}
  <div className="absolute inset-0">
    {/* Signal lines */}
    <div className="absolute top-1/4 left-0 w-full">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent animate-pulse"></div>
    </div>
    <div className="absolute top-2/3 right-0 w-1/2">
      <div className="h-0.5 bg-gradient-to-l from-transparent via-cyan-300/40 to-transparent animate-pulse delay-75"></div>
    </div>
    
    {/* Strip lines */}
    <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-200/30 to-transparent animate-bounce"></div>
    <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-200/30 to-transparent animate-bounce delay-150"></div>
    
    {/* Floating geometric shapes */}
    <div className="absolute top-20 left-10 w-6 h-6 border-2 border-blue-300/50 rounded-lg transform rotate-45 animate-float"></div>
    <div className="absolute bottom-20 right-16 w-8 h-8 border-2 border-cyan-300/40 rounded-full animate-float delay-200"></div>
    <div className="absolute top-40 right-20 w-4 h-4 bg-blue-400/20 rounded-sm transform rotate-12 animate-ping"></div>
    
    {/* Connection dots */}
    <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
    
    {/* Wave patterns */}
    <div className="absolute bottom-10 left-0 w-full opacity-10">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-blue-300"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-cyan-300"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-blue-400"></path>
      </svg>
    </div>
  </div>

  {/* Content */}
  <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
    <div className="inline-block mb-4">
      <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mb-2 mx-auto"></div>
      <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">What We Offer</div>
    </div>
    
    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
      Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Services</span>
    </h1>
    
    <div className="relative inline-block max-w-3xl">
      <div className="absolute -inset-4 bg-white/50 rounded-2xl transform rotate-2 blur-sm"></div>
      <p className="relative text-xl md:text-2xl text-gray-700 leading-relaxed bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-lg">
        Comprehensive real estate solutions tailored to meet your unique needs. 
        From buying your first home to managing investment properties, we've got you covered.
      </p>
    </div>

    {/* Decorative elements around text */}
    <div className="flex justify-center items-center space-x-4 mt-8">
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping delay-150"></div>
    </div>
  </div>
</div>

        {/* Main Services */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-blue-100">
                <div className="p-8">
                  {/* Icon Container */}
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white border border-blue-200 mb-6 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                    <div className="text-blue-600">
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/contact"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {service.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized services to support all your real estate needs
            </p>
          </div>

          <GridContainer cols={3} gap={6}>
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 group hover:border-blue-200">
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white border border-blue-200 mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                  <div className="text-blue-600">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </GridContainer>
        </section>

        {/* Process Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A streamlined approach to ensure your real estate journey is smooth and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  {/* Step Number with Icon */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex flex-col items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-xs font-semibold opacity-90">{step.step}</div>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-100 to-blue-50 -translate-y-10"></div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-12 text-center text-white shadow-xl">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-10 rounded-2xl mb-6">
              <FaKey className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Start Your Real Estate Journey Today</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Let our expert team guide you through every step of your property transaction. 
              Experience the difference of professional real estate services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <FaRocket className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
              <a
                href="tel:+2349132080059"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <FaPhone className="w-5 h-5" />
                <span>Call Now: + (234)913 2080059</span>
              </a>
            </div>
          </div>
        </section>
      </WideContainer>
    </MainLayout>
  );
};

export default Services;