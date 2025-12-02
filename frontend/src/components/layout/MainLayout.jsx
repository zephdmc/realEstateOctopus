import React, { useState, useEffect } from 'react';
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
  // Add comprehensive debugging for auth context
  console.log('=== MainLayout Mounting ===');
  
  try {
    const authContext = useAuth();
    console.log('Auth Context received:', {
      user: authContext?.user,
      loginWithEmail: authContext?.loginWithEmail,
      signInWithGoogle: authContext?.signInWithGoogle,
      logout: authContext?.logout,
      isAuthenticated: authContext?.isAuthenticated
    });
    
    // Destructure with safe defaults
    const { 
      user, 
      loginWithEmail: authLoginWithEmail, 
      signInWithGoogle: authSignInWithGoogle, 
      logout: authLogout,
      isAuthenticated 
    } = authContext || {};
    
    // Create safe wrapper functions with fallbacks
    const loginWithEmail = typeof authLoginWithEmail === 'function' 
      ? authLoginWithEmail 
      : async (email, password) => {
          console.error('loginWithEmail is not a function, using fallback');
          return { 
            success: false, 
            error: 'Authentication system not available' 
          };
        };
    
    const signInWithGoogle = typeof authSignInWithGoogle === 'function'
      ? authSignInWithGoogle
      : async () => {
          console.error('signInWithGoogle is not a function, using fallback');
          return { 
            success: false, 
            error: 'Google authentication not available' 
          };
        };
    
    const logout = typeof authLogout === 'function'
      ? authLogout
      : async () => {
          console.error('logout is not a function, using fallback');
        };
    
  } catch (authError) {
    console.error('Error accessing auth context:', authError);
    // Fallback context if auth fails
    const user = null;
    const isAuthenticated = false;
    const loginWithEmail = async () => ({ success: false, error: 'Auth context error' });
    const signInWithGoogle = async () => ({ success: false, error: 'Auth context error' });
    const logout = async () => {};
  }
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
    console.log('handleLoginClick called');
    setShowLoginModal(true);
    setLoginError('');
  };

  // Handle actual login with email/password
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    console.log('handleEmailLogin called');
    
    // Validate form
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      console.log('Attempting login with:', loginForm.email);
      const result = await loginWithEmail(loginForm.email, loginForm.password);
      console.log('Login result:', result);
      
      if (result?.success) {
        console.log('Login successful:', result.user);
        setShowLoginModal(false);
        setLoginForm({ email: '', password: '' });
        setLoginError('');
      } else {
        const errorMessage = result?.error?.message || result?.error || 'Login failed. Please try again.';
        console.error('Login failed:', errorMessage);
        setLoginError(errorMessage);
      }
    } catch (error) {
      console.error('Login error caught:', error);
      setLoginError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    console.log('handleGoogleLogin called');
    
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      console.log('Attempting Google login');
      const result = await signInWithGoogle();
      console.log('Google login result:', result);
      
      if (result?.success) {
        console.log('Google login successful:', result.user);
        setShowLoginModal(false);
      } else {
        const errorMessage = result?.error?.message || result?.error || 'Google login failed. Please try again.';
        console.error('Google login failed:', errorMessage);
        setLoginError(errorMessage);
      }
    } catch (error) {
      console.error('Google login error caught:', error);
      setLoginError(error.message || 'An unexpected error occurred with Google login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    console.log('handleLogout called');
    
    try {
      await logout();
      console.log('Logout successful');
      // Optionally show a success message
    } catch (error) {
      console.error('Logout error:', error);
      // Don't alert the user about logout errors as they might not care
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && showLoginModal) {
        setShowLoginModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showLoginModal]);

  // Close modal when clicking outside
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowLoginModal(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      {showHeader && (
        <Header 
          onSearch={handleSearch}
          user={user}
          onLogin={handleLoginClick}
          onLogout={handleLogout}
          onMenuToggle={toggleSidebar}
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 id="login-modal-title" className="text-2xl font-bold text-gray-800">
                Login to EstatePro
              </h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                aria-label="Close login modal"
              >
                &times;
              </button>
            </div>
            
            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {loginError}
              </div>
            )}
            
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                  disabled={isLoggingIn}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                  disabled={isLoggingIn}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full py-3 rounded-md font-medium transition duration-200 ${
                  isLoggingIn 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className={`w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-md font-medium transition duration-200 ${
                isLoggingIn 
                  ? 'bg-gray-100 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => {
                    setShowLoginModal(false);
                    // You can navigate to signup page here
                    console.log('Navigate to signup');
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {/* <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogin={handleLoginClick}
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