import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public Pages
import Home from './pages/public/Home';
import Properties from './pages/public/Properties';
import PropertyDetails from './pages/public/PropertyDetails';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import Contact from './pages/public/Contact';
import About from './pages/public/About';
import Services from './pages/public/Services';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import PropertiesManagement from './pages/admin/PropertiesManagement';
import BlogManagement from './pages/admin/BlogManagement';
import MediaLibrary from './pages/admin/MediaLibrary';
import Settings from './pages/admin/Settings';

// Layout Components
import AdminLayout from './components/layout/AdminLayout';
import { useAuth } from '../src/contexts/AuthContext';

// Protected Route Component with Debugging
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading, initialized } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute Debug:', {
    path: location.pathname,
    requireAdmin,
    isAuthenticated,
    isAdmin: isAdmin(),
    loading,
    initialized,
    timestamp: new Date().toISOString()
  });

  if (!initialized || loading) {
    console.log('🔄 ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    console.log('🚫 ProtectedRoute: Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted - rendering children');
  return children;
};

// Auth Debug Component
const AuthDebug = () => {
  const auth = useAuth();
  const location = useLocation();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🔐 Auth Debug</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Current Location:</h3>
          <pre className="bg-gray-100 p-2 rounded">{location.pathname + location.search}</pre>
        </div>
        
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({
            user: auth.user ? {
              email: auth.user.email,
              uid: auth.user.uid,
              emailVerified: auth.user.emailVerified
            } : 'No user',
            isAuthenticated: auth.isAuthenticated,
            isAdmin: auth.isAdmin(),
            loading: auth.loading,
            initialized: auth.initialized,
            userRole: auth.userRole
          }, null, 2)}
        </pre>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${auth.isAuthenticated ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <h3 className="font-semibold">Authentication</h3>
            <p>{auth.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${auth.isAdmin() ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <h3 className="font-semibold">Admin Status</h3>
            <p>{auth.isAdmin() ? '✅ Is Admin' : '❌ Not Admin'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Router Component
const AppRouter = () => {
  const location = useLocation();
  
  console.log('🛣️ AppRouter - Current location:', {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    timestamp: new Date().toISOString()
  });

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />

      {/* ADMIN ROUTES */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/properties" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <PropertiesManagement />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/blog" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <BlogManagement />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/media" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <MediaLibrary />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />

      {/* Debug Route */}
      <Route 
        path="/admin/debug" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <AuthDebug />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />

      {/* Admin redirects */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Catch all route - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🔍</span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Go Home
          </a>
          <button 
            onClick={() => window.history.back()} 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppRouter;