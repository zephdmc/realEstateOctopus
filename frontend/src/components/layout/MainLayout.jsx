import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
// import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  containerWidth = 'default',
  className = '' 
}) => {
  const { 
    user, 
    loginWithEmail, 
    signInWithGoogle, 
    logout,
    isAuthenticated 
  } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const containerClasses = {
    default: 'max-w-7xl',
    wide: 'max-w-full',
    narrow: 'max-w-4xl',
    tight: 'max-w-2xl'
  };

  const handleSearch = (searchData) => {
    console.log('Search performed:', searchData);
    // Handle search logic here
  };

  // Handle login button click - show modal/form
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // Handle actual login with email/password
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginWithEmail(loginForm.email, loginForm.password);
      if (result.success) {
        console.log('Login successful:', result.user);
        setShowLoginModal(false);
        setLoginForm({ email: '', password: '' });
      } else {
        console.error('Login failed:', result.error);
        alert(`Login failed: ${result.error.message || result.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error occurred');
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        console.log('Google login successful:', result.user);
        setShowLoginModal(false);
      } else {
        console.error('Google login failed:', result.error);
        alert(`Google login failed: ${result.error.message || result.error}`);
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login error occurred');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      {showHeader && (
        <Header 
          onSearch={handleSearch}
          user={user}
          onLogin={handleLoginClick} // Just opens modal
          onLogout={handleLogout}
          onMenuToggle={toggleSidebar}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Login to EstatePro</h2>
            
            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {/* <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      /> */}

      {/* Main Content */}
      <main className="flex-1">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${containerClasses[containerWidth]}`}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

// Layout variations
export const WideLayout = (props) => <MainLayout containerWidth="wide" {...props} />;
export const NarrowLayout = (props) => <MainLayout containerWidth="narrow" {...props} />;
export const TightLayout = (props) => <MainLayout containerWidth="tight" {...props} />;
export const NoHeaderLayout = (props) => <MainLayout showHeader={false} {...props} />;
export const NoFooterLayout = (props) => <MainLayout showFooter={false} {...props} />;

export default MainLayout;