import React, { useState, useEffect } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaBars, 
  FaTimes,
  FaPlusCircle,
  FaTachometerAlt
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Properties', href: '/properties', current: location.pathname === '/properties' },
    { name: 'Services', href: '/services', current: location.pathname === '/services' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
    { name: 'Blog', href: '/blog', current: location.pathname === '/blog' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' }
  ];

  const contactInfo = [
    { 
      type: 'phone', 
      value: '+234 913 2080 059', 
      href: 'tel:+2349132080059', 
      icon: <FaPhone className="w-3 h-3" />
    },
    { 
      type: 'email', 
      value: 'info@Octopusrealestate.com', 
      href: 'mailto:info@Octopusrealestate.com', 
      icon: <FaEnvelope className="w-3 h-3" />
    },
    { 
      type: 'website', 
      value: 'www.Octopusrealestate.com', 
      href: 'https://www.Octopusrealestate.com', 
      icon: <FaGlobe className="w-3 h-3" />
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle scroll effect for contact info animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="bg-white sticky top-0 z-40 shadow-sm border-b border-red-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  item.current
                    ? 'text-blue-600 border-b-2 border-red-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-red-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Dashboard Link - Only show if user is authenticated and admin */}
            {isAuthenticated && isAdmin() && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-purple-600 border-b-2 border-purple-600 font-semibold'
                    : 'text-purple-700 hover:text-purple-600 hover:border-b-2 hover:border-purple-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTachometerAlt className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Mobile Contact Info + Menu Button */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* Auto-moving Contact Information */}
            <div className="flex-1 overflow-hidden relative">
              <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap hover:animate-pause">
                {contactInfo.map((contact, index) => (
                  <a
                    key={contact.type}
                    href={contact.href}
                    className="inline-flex items-center space-x-2 mx-4 text-gray-600 hover:text-blue-600 transition duration-200 flex-shrink-0 group"
                  >
                    <div className="bg-blue-100 p-1 rounded group-hover:bg-blue-200 transition duration-200">
                      <div className="text-blue-600">
                        {contact.icon}
                      </div>
                    </div>
                    <span className="text-xs font-medium">{contact.value}</span>
                  </a>
                ))}
                {/* Duplicate for seamless loop */}
                {contactInfo.map((contact, index) => (
                  <a
                    key={`${contact.type}-dup`}
                    href={contact.href}
                    className="inline-flex items-center space-x-2 mx-4 text-gray-600 hover:text-blue-600 transition duration-200 flex-shrink-0 group"
                  >
                    <div className="bg-blue-100 p-1 rounded group-hover:bg-blue-200 transition duration-200">
                      <div className="text-blue-600">
                        {contact.icon}
                      </div>
                    </div>
                    <span className="text-xs font-medium">{contact.value}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition duration-200 flex-shrink-0 ml-4"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin Dashboard Link in CTA area - Only show if admin */}
            {isAuthenticated && isAdmin() && (
              <Link
                to="/admin/dashboard"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <FaTachometerAlt className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
            
            <Link
              to="/list-property"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <FaPlusCircle className="w-4 h-4" />
              <span>List Your Property</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg ${
                    item.current
                      ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Dashboard Link in Mobile Menu - Only show if admin */}
              {isAuthenticated && isAdmin() && (
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg flex items-center space-x-2 ${
                    location.pathname.startsWith('/admin')
                      ? 'text-purple-600 bg-purple-50 border-l-4 border-purple-600'
                      : 'text-purple-700 hover:text-purple-600 hover:bg-purple-50 hover:border-l-4 hover:border-purple-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTachometerAlt className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {/* Contact Info in Mobile Menu */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  {contactInfo.map((contact) => (
                    <a
                      key={contact.type}
                      href={contact.href}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-blue-600 transition duration-200 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition duration-200">
                        <div className="text-blue-600">
                          {contact.icon}
                        </div>
                      </div>
                      <span className="text-sm font-medium">{contact.value}</span>
                    </a>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-center mt-4 flex items-center justify-center space-x-2 shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaPlusCircle className="w-5 h-5" />
                <span>List Your Property</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Add custom styles for animation pause on hover */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .hover\\:animate-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;