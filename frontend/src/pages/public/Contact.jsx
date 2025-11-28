import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { WideContainer, SplitContainer } from '../../components/layout/PageContainer';

const Contact = () => {
  const officeLocations = [
    {
      city: 'New York',
      address: '123 Broadway,Port Harcourt',
      phone: '+ (234)913 2080059',
      email: 'ny@estatepro.com',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
    }
  ];

  const contactMethods = [
    {
      icon: '📞',
      title: 'Call Us',
      description: 'Speak directly with our agents',
      details: '+ (234)913 2080059',
      action: 'tel:+2349132080059'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      description: 'Send us a message anytime',
      details: 'nfo@Octopusrealestate.com',
      action: 'mailto:nfo@Octopusrealestate.com'
    }
  ];

  // Simple contact form replacement
  const SimpleContactForm = () => (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input 
          type="email" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="your.email@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea 
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="How can we help you?"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Send Message
      </button>
    </form>
  );

  return (
    <MainLayout>
      <WideContainer>
        {/* Header Section */}
        <div className="relative text-center mb-16 py-12 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-2 h-20 bg-blue-400/30 animate-pulse rounded-full"></div>
            <div className="absolute bottom-10 right-20 w-1 h-16 bg-blue-500/40 animate-bounce rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-300 rounded-full animate-ping"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with our expert real estate agents. We're here to help you with all your property needs.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Side */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-6">We'll get back to you within 2 hours</p>
            <SimpleContactForm />
          </div>

          {/* Contact Info Side */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              <div className="grid grid-cols-1 gap-4">
                {contactMethods.map((method, index) => (
                  <Link
                    key={index}
                    href={method.action}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{method.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                        <p className="text-blue-600 font-semibold mt-2">{method.details}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Office Locations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Offices</h3>
              <div className="space-y-4">
                {officeLocations.map((office, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 text-lg mb-3">{office.city} Office</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📍 {office.address}</p>
                      <p>📞 {office.phone}</p>
                      <p>✉️ {office.email}</p>
                      <p>🕒 {office.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WideContainer>
    </MainLayout>
  );
};

export default Contact;