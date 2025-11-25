import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ 
  isOpen = false,
  onClose,
  user,
  onLogin,
  onLogout,
  variant = 'main',
  navItems = [],
  className = ''
}) => {
  const location = useLocation();

  // Default navigation items for main sidebar
  const defaultNavItems = [
    {
      name: 'Home',
      href: '/',
      icon: '🏠',
      current: location.pathname === '/'
    },
    {
      name: 'Properties',
      href: '/properties',
      icon: '🔍',
      current: location.pathname.startsWith('/properties')
    },
    {
      name: 'Services',
      href: '/services',
      icon: '⚡',
      current: location.pathname.startsWith('/services')
    },
    {
      name: 'About Us',
      href: '/about',
      icon: '👥',
      current: location.pathname.startsWith('/about')
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: '📝',
      current: location.pathname.startsWith('/blog')
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: '📞',
      current: location.pathname.startsWith('/contact')
    }
  ];

  const items = navItems.length > 0 ? navItems : defaultNavItems;

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Real Estate" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900">EstatePro</h1>
            <p className="text-xs text-gray-600">
              {variant === 'admin' ? 'Admin Panel' : 'Premium Properties'}
            </p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* User Info Section */}
      {user ? (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              className="w-10 h-10 rounded-full"
              src={user.avatar || '/images/avatar-placeholder.jpg'}
              alt={user.name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          
          {variant === 'main' && (
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                onClick={onClose}
              >
                👤 My Profile
              </Link>
              <Link
                to="/favorites"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                onClick={onClose}
              >
                ❤️ Favorites
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition duration-200"
                  onClick={onClose}
                >
                  ⚙️ Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Sign in to access more features</p>
          <button
            onClick={() => {
              onLogin();
              onClose?.();
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              item.current
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Quick Actions */}
      {variant === 'main' && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/list-property"
            className="flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 font-semibold text-sm"
            onClick={onClose}
          >
            🏡 List Your Property
          </Link>
          <Link
            to="/schedule-consultation"
            className="flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-200 font-semibold text-sm"
            onClick={onClose}
          >
            📅 Free Consultation
          </Link>
        </div>
      )}

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <button
            onClick={() => {
              onLogout();
              onClose?.();
            }}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
          >
            <span className="mr-2">🚪</span>
            Sign Out
          </button>
        ) : (
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Need help?</p>
            <Link
              to="/contact"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              onClick={onClose}
            >
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'admin') {
    return sidebarContent;
  }

  // For main sidebar, render with mobile overlay
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${className}`}>
        {sidebarContent}
      </div>
    </>
  );
};

// Sidebar variations
export const MainSidebar = (props) => <Sidebar variant="main" {...props} />;
export const AdminSidebar = (props) => <Sidebar variant="admin" {...props} />;

export default Sidebar;