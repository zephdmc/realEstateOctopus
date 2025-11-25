import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useApi } from './useApi';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { getItem, setItem, removeItem } = useLocalStorage();
  const { get, post } = useApi();

  // Check if user is authenticated on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getItem('auth_token');
        const userData = getItem('user_data');

        if (token && userData) {
          // Verify token with backend
          const response = await get('/api/auth/verify');
          
          if (response.success) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            removeItem('auth_token');
            removeItem('user_data');
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        // Clear invalid auth data
        removeItem('auth_token');
        removeItem('user_data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [get, getItem, removeItem]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);

      const response = await post('/api/auth/login', credentials);
      
      if (response.success) {
        const { user: userData, token } = response.data;
        
        // Store auth data
        setItem('auth_token', token);
        setItem('user_data', userData);
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, [post, setItem]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);

      const response = await post('/api/auth/register', userData);
      
      if (response.success) {
        const { user: newUser, token } = response.data;
        
        // Store auth data
        setItem('auth_token', token);
        setItem('user_data', newUser);
        
        // Update state
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true, user: newUser };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  }, [post, setItem]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      removeItem('auth_token');
      removeItem('user_data');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [post, removeItem]);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      const response = await put('/api/auth/profile', updates);
      
      if (response.success) {
        const updatedUser = response.data;
        
        // Update stored user data
        setItem('user_data', updatedUser);
        setUser(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: error.message || 'Profile update failed' };
    }
  }, [put, setItem]);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await put('/api/auth/password', passwordData);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Password change failed:', error);
      return { success: false, error: error.message || 'Password change failed' };
    }
  }, [put]);

  // Request password reset
  const requestPasswordReset = useCallback(async (email) => {
    try {
      const response = await post('/api/auth/forgot-password', { email });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
      return { success: false, error: error.message || 'Password reset request failed' };
    }
  }, [post]);

  // Reset password with token
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      const response = await post('/api/auth/reset-password', {
        token,
        password: newPassword
      });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, error: error.message || 'Password reset failed' };
    }
  }, [post]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole('admin') || hasRole('super_admin');
  }, [hasRole]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await get('/api/auth/me');
      
      if (response.success) {
        const userData = response.data;
        setItem('user_data', userData);
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [get, setItem]);

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    refreshUser,
    
    // Role and permission checks
    hasRole,
    hasPermission,
    isAdmin,
    
    // Utility
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
    userAvatar: user?.avatar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher Order Component for protecting routes
export const withAuth = (Component) => {
  return function ProtectedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      // Redirect to login or show access denied
      return <div>Access Denied. Please log in.</div>;
    }
    
    return <Component {...props} />;
  };
};

// Higher Order Component for admin routes
export const withAdmin = (Component) => {
  return function AdminComponent(props) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated || !isAdmin()) {
      // Redirect to login or show access denied
      return <div>Access Denied. Admin privileges required.</div>;
    }
    
    return <Component {...props} />;
  };
};

export default useAuth;