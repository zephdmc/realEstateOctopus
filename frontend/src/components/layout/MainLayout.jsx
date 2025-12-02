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
  const { user, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogin = () => {
    // Implement login logic
    login({ name: 'John Doe', email: 'john@example.com' });
  };

  const handleLogout = () => {
    logout();
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
          onLogin={handleLogin}
          onLogout={handleLogout}
          onMenuToggle={toggleSidebar}
        />
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