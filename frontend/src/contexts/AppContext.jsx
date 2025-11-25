import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { firebaseAuth } from '../services/firebaseAuth'; // Change to Firebase auth
import { safeLocalStorage, handleError } from '../utils/helpers';

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  ADD_RECENT_PROPERTY: 'ADD_RECENT_PROPERTY',
  TOGGLE_SIDEBAR: 'SET_INITIALIZED', // Add initialization state
  SET_INITIALIZED: 'SET_INITIALIZED',
};

// Initial state
const initialState = {
  // User state
  user: null,
  isAuthenticated: false,
  
  // UI state
  loading: false,
  error: null,
  theme: safeLocalStorage.get('theme', 'light'),
  language: safeLocalStorage.get('language', 'en-US'),
  sidebarOpen: false,
  
  // Notifications
  notification: null,
  
  // User preferences
  recentProperties: safeLocalStorage.get('recentProperties', []),
  savedSearches: safeLocalStorage.get('savedSearches', []),
  
  // App state
  initialized: false, // 🔥 Important: Track if Firebase auth state is determined
};

// Reducer function (mostly same, but add SET_INITIALIZED)
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        initialized: true, // 🔥 Mark as initialized when user is set
      };

    case ACTION_TYPES.CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        initialized: true, // 🔥 Mark as initialized when user is cleared
      };

    case ACTION_TYPES.SET_INITIALIZED:
      return {
        ...state,
        initialized: action.payload,
      };

    // ... keep all your existing reducer cases unchanged ...
    case ACTION_TYPES.SET_THEME:
      safeLocalStorage.set('theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };

    case ACTION_TYPES.SET_LANGUAGE:
      safeLocalStorage.set('language', action.payload);
      return {
        ...state,
        language: action.payload,
      };

    case ACTION_TYPES.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };

    case ACTION_TYPES.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null,
      };

    case ACTION_TYPES.ADD_RECENT_PROPERTY:
      const recentProperties = [
        action.payload,
        ...state.recentProperties.filter(p => p.id !== action.payload.id),
      ].slice(0, 10);
      
      safeLocalStorage.set('recentProperties', recentProperties);
      return {
        ...state,
        recentProperties,
      };

    case ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.payload ?? !state.sidebarOpen,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) => 
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),

    setError: (error) => 
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: handleError(error) }),

    clearError: () => 
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR }),

    setUser: (user) => 
      dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),

    clearUser: () => 
      dispatch({ type: ACTION_TYPES.CLEAR_USER }),

    setInitialized: (initialized) =>
      dispatch({ type: ACTION_TYPES.SET_INITIALIZED, payload: initialized }),

    setTheme: (theme) => 
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme }),

    setLanguage: (language) => 
      dispatch({ type: ACTION_TYPES.SET_LANGUAGE, payload: language }),

    setNotification: (notification) => 
      dispatch({ type: ACTION_TYPES.SET_NOTIFICATION, payload: notification }),

    clearNotification: () => 
      dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATION }),

    addRecentProperty: (property) => 
      dispatch({ type: ACTION_TYPES.ADD_RECENT_PROPERTY, payload: property }),

    toggleSidebar: (open) => 
      dispatch({ type: ACTION_TYPES.TOGGLE_SIDEBAR, payload: open }),

    // 🔥 UPDATED: Firebase Authentication Actions
    loginWithEmail: async (email, password) => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const result = await firebaseAuth.loginWithEmail(email, password);
        
        if (result.success) {
          actions.setUser(result.user);
          actions.setNotification({
            type: 'success',
            message: 'Welcome back!',
          });
          return result;
        } else {
          actions.setError(result.error);
          return result;
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },

    registerWithEmail: async (userData) => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const result = await firebaseAuth.registerWithEmail(userData);
        
        if (result.success) {
          actions.setUser(result.user);
          actions.setNotification({
            type: 'success',
            message: result.needsVerification 
              ? 'Account created! Please check your email for verification.'
              : 'Account created successfully!',
          });
          return result;
        } else {
          actions.setError(result.error);
          return result;
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },

    signInWithGoogle: async () => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const result = await firebaseAuth.signInWithGoogle();
        
        if (result.success) {
          actions.setUser(result.user);
          actions.setNotification({
            type: 'success',
            message: 'Welcome!',
          });
          return result;
        } else {
          actions.setError(result.error);
          return result;
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },

    signInWithFacebook: async () => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const result = await firebaseAuth.signInWithFacebook();
        
        if (result.success) {
          actions.setUser(result.user);
          actions.setNotification({
            type: 'success',
            message: 'Welcome!',
          });
          return result;
        } else {
          actions.setError(result.error);
          return result;
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },

    logout: async () => {
      try {
        actions.setLoading(true);
        const result = await firebaseAuth.logout();
        actions.clearUser();
        actions.setNotification({
          type: 'info',
          message: 'You have been logged out',
        });
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        // Still clear user even if Firebase call fails
        actions.clearUser();
        return { success: true };
      } finally {
        actions.setLoading(false);
      }
    },

    // 🔥 NEW: Firebase-specific actions
    resendEmailVerification: async () => {
      try {
        const result = await firebaseAuth.resendEmailVerification();
        if (result.success) {
          actions.setNotification({
            type: 'success',
            message: 'Verification email sent!',
          });
        }
        return result;
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      }
    },

    checkEmailVerified: async () => {
      try {
        const isVerified = await firebaseAuth.checkEmailVerified();
        if (isVerified && state.user) {
          actions.setUser({ ...state.user, emailVerified: true });
        }
        return isVerified;
      } catch (error) {
        console.error('Email verification check error:', error);
        return false;
      }
    },

    updateUserProfile: async (updates) => {
      try {
        actions.setLoading(true);
        const result = await firebaseAuth.updateUserProfile(updates);
        
        if (result.success) {
          actions.setUser(result.user);
          actions.setNotification({
            type: 'success',
            message: 'Profile updated successfully!',
          });
          return result;
        } else {
          actions.setError(result.error);
          return result;
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },

    requestPasswordReset: async (email) => {
      try {
        actions.setLoading(true);
        const result = await firebaseAuth.resetPassword(email);
        
        if (result.success) {
          actions.setNotification({
            type: 'success',
            message: 'Password reset email sent!',
          });
          return result;
        } else {
          actions.setError(result.error);
          return result;
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },
  };

  // 🔥 UPDATED: Initialize with Firebase Auth Listener
  useEffect(() => {
    // Set a temporary loading state
    actions.setLoading(true);

    // Firebase auth state listener
    const unsubscribe = firebaseAuth.onAuthStateChange(({ user, isAuthenticated }) => {
      if (user) {
        actions.setUser(user);
      } else {
        actions.clearUser();
      }
      actions.setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Apply theme to document (keep this)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Auto-hide notifications (keep this)
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        actions.clearNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  // Permission check helpers
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const isAdmin = () => {
    return hasRole('admin') || hasRole('super_admin');
  };

  const isAgent = () => {
    return hasRole('agent') || isAdmin();
  };

  const canManageProperty = (property = null) => {
    if (!state.user) return false;
    
    // Admins can manage all properties
    if (isAdmin()) return true;
    
    // Agents can manage properties they own
    if (isAgent()) {
      if (!property) return true;
      return property.agentId === state.user.uid || property.createdBy === state.user.uid;
    }
    
    // Regular users can only manage their own properties
    if (property) {
      return property.createdBy === state.user.uid;
    }
    
    return false;
  };

  const value = {
    // State
    ...state,
    
    // Actions
    ...actions,

    // 🔥 NEW: Permission check methods
    hasRole,
    isAdmin,
    isAgent,
    canManageProperty,

    // Utility getters
    userId: state.user?.uid,
    userEmail: state.user?.email,
    userName: state.user?.displayName || `${state.user?.firstName} ${state.user?.lastName}`,
    userAvatar: state.user?.photoURL,
    userRole: state.user?.role,
    isEmailVerified: state.user?.emailVerified,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;