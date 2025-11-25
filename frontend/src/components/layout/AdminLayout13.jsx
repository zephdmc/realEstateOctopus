import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminLayout = ({ children }) => {
  const { user, isAdmin, loading, initialized } = useAuth();

  // Show loading until auth state is determined
  if (loading || !initialized) {
    return <LoadingSpinner size="large" text="Loading..." />;
  }

  // Check admin status
  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Simple Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <nav className="mt-4 space-y-2">
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Dashboard</div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Properties</div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Blog</div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white p-4 mb-4 rounded shadow">
            <h1 className="text-xl font-bold">Dashboard Header</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;