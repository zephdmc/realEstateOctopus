import { apiService } from './api';
import { useAuth } from '../contexts/AuthContext';
// Token storage keys
const AUTH_TOKEN_KEY = 'estatepro_auth_token';
const REFRESH_TOKEN_KEY = 'estatepro_refresh_token';
const USER_DATA_KEY = 'estatepro_user_data';

// Token management
export const getAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const setRefreshToken = (token) => {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting refresh token:', error);
  }
};

// User data management
export const getUserData = () => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const setUserData = (userData) => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

// Authentication service
class AuthService {
  // Login with email and password
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);

      if (response.data?.token) {
        const { token, refreshToken, user } = response.data;
        
        // Store tokens and user data
        setAuthToken(token);
        if (refreshToken) {
          setRefreshToken(refreshToken);
        }
        setUserData(user);

        return {
          success: true,
          user,
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);

      if (response.data?.token) {
        const { token, refreshToken, user } = response.data;
        
        // Store tokens and user data
        setAuthToken(token);
        if (refreshToken) {
          setRefreshToken(refreshToken);
        }
        setUserData(user);

        return {
          success: true,
          user,
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side logout even if API call fails
    } finally {
      // Clear local storage
      clearAuthToken();
    }
  }

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post('/auth/refresh', {
        refreshToken,
      });

      if (response.data?.token) {
        setAuthToken(response.data.token);
        return {
          success: true,
          token: response.data.token,
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      clearAuthToken();
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      };
    }
  }

  // Verify token validity
  async verifyToken() {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, valid: false };
      }

      const response = await apiService.get('/auth/verify');
      return {
        success: true,
        valid: response.data?.valid || false,
        user: response.data?.user,
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        valid: false,
        error: error.message,
      };
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      await apiService.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: error.message || 'Failed to request password reset',
      };
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      await apiService.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      };
    }
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const response = await apiService.put(`/users/${userId}`, updates);
      
      if (response.data) {
        // Update stored user data
        const currentUserData = getUserData();
        setUserData({ ...currentUserData, ...response.data });
        
        return {
          success: true,
          user: response.data,
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile',
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      await apiService.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: error.message || 'Failed to change password',
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!getAuthToken();
  }

  // Get current user
  getCurrentUser() {
    return getUserData();
  }

  // Check if user has role
  hasRole(role) {
    const user = getUserData();
    return user?.roles?.includes(role) || false;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin') || this.hasRole('super_admin');
  }
}


export const createApiClient = () => {
  const { user, getIdToken } = useAuth(); // You'll need to add getIdToken to your auth context
  
  const getAuthHeaders = async () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (user) {
      const token = await user.getIdToken(); // Firebase method to get fresh token
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  };
  
  const api = {
    get: async (url) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    },
    
    post: async (url, data) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    
    put: async (url, data) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    
    delete: async (url) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    },
  };
  
  return api;
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

export const authService = new AuthService();
export default authService;