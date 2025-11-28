import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { 
  FaPhone, 
  FaEnvelope, 
  FaUserCircle, 
  FaSignOutAlt,
  FaHome,
  FaWhatsapp
} from 'react-icons/fa';

const Header = ({ onSearch, user, onLogin, onLogout }) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+2349132080059";
    const message = "Hello! I'm interested in your real estate services. Can you please provide more information?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <FaHome className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Octopus Real Estate </h1>
              <p className="text-xs text-gray-600">Ventures LTD</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaPhone className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-gray-700 font-medium">+ (234)913 2080059</span>
                <p className="text-xs text-gray-500">Call us today</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaEnvelope className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-gray-700 font-medium">info@Octopusrealestate.com</span>
                <p className="text-xs text-gray-500">Email us</p>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <span className="text-sm text-gray-700 font-medium block">Welcome back</span>
                  <span className="text-sm text-blue-600 font-semibold">{user.name}</span>
                </div>
                <div className="relative group">
                  <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <FaUserCircle className="w-5 h-5" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      <FaSignOutAlt className="w-4 h-4 text-gray-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                title="Login"
              >
                <FaUserCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation and Search with WhatsApp */}
        <div className="border-t border-gray-200 relative">
          <Navbar />
          <div className="py-4 relative">
            {/* Search Bar */}
            <SearchBar onSearch={onSearch} />
            
            {/* Floating WhatsApp Button */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                title="Chat with us on WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">Chat on WhatsApp</span>
              </button>

              {/* Optional: Phone Call Button */}
              <button
                onClick={() => window.open('tel:+2349132080059', '_self')}
                className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                title="Call us now"
              >
                <FaPhone className="w-4 h-4" />
                <span className="text-sm font-medium">Call Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating WhatsApp Button (for smaller screens) */}
      {/* <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-bounce"
          title="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6" />
        </button>
      </div> */}
    </header>
  );
};

export default Header;