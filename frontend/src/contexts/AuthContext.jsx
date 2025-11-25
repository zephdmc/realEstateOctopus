import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { firebaseAuth } from '../services/firebaseAuth';
import { handleError } from '../utils/helpers';

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  SET_INITIALIZED: 'SET_INITIALIZED',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
  initialized: false,
};

// Admin email detection function
const isAdminEmail = (email) => {
  if (!email) return false;
  
  const adminEmails = [
    'admin@estatepro.com',
    'admin@example.com',
    'zephdmc@gmail.com'
  ].map(email => email.toLowerCase());
  
  const adminPatterns = [
    /@estatepro\.com$/,
    /^admin\./,
    /\.admin@/,
  ];
  
  const normalizedEmail = email.toLowerCase();
  
  return adminEmails.includes(normalizedEmail) || 
         adminPatterns.some(pattern => pattern.test(normalizedEmail));
};

// Reducer function
const authReducer = (state, action) => {
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
      const user = action.payload;
      const adminStatus = user ? isAdminEmail(user.email) : false;
      
      console.log('🔐 Auth Reducer - User logged in:', user?.email);
      console.log('👑 Auth Reducer - Is admin?:', adminStatus);
      
      return {
        ...state,
        user: user,
        isAuthenticated: !!user,
        isAdmin: adminStatus,
        loading: false,
        error: null,
      };

    case ACTION_TYPES.CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null,
      };

    case ACTION_TYPES.SET_INITIALIZED:
      return {
        ...state,
        initialized: action.payload,
      };

    case ACTION_TYPES.UPDATE_PROFILE:
      const updatedUser = {
        ...state.user,
        ...action.payload,
      };
      return {
        ...state,
        user: updatedUser,
        isAdmin: isAdminEmail(updatedUser.email),
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Context provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

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

    updateProfile: (updates) => 
      dispatch({ type: ACTION_TYPES.UPDATE_PROFILE, payload: updates }),

    // Check if current user is admin (utility function)
    checkAdminStatus: () => {
      return isAdminEmail(state.user?.email);
    },
  };

  // Firebase authentication methods
  const authMethods = {
    loginWithEmail: async (email, password) => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const result = await firebaseAuth.loginWithEmail(email, password);
        
        if (result.success) {
          actions.setUser(result.user);
          return { 
            success: true, 
            user: result.user,
            isAdmin: isAdminEmail(result.user.email)
          };
        } else {
          actions.setError(result.error);
          return { success: false, error: result.error };
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
          return { 
            success: true, 
            user: result.user,
            needsVerification: result.needsVerification,
            isAdmin: isAdminEmail(result.user.email)
          };
        } else {
          actions.setError(result.error);
          return { success: false, error: result.error };
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
          return { 
            success: true, 
            user: result.user,
            isAdmin: isAdminEmail(result.user.email)
          };
        } else {
          actions.setError(result.error);
          return { success: false, error: result.error };
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
          return { 
            success: true, 
            user: result.user,
            isAdmin: isAdminEmail(result.user.email)
          };
        } else {
          actions.setError(result.error);
          return { success: false, error: result.error };
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
        await firebaseAuth.logout();
        actions.clearUser();
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        actions.clearUser();
        return { success: true };
      } finally {
        actions.setLoading(false);
      }
    },

    updateUserProfile: async (updates) => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const result = await firebaseAuth.updateUserProfile(updates);
        
        if (result.success) {
          actions.updateProfile(updates);
          return { 
            success: true, 
            user: result.user,
            isAdmin: isAdminEmail(result.user.email)
          };
        } else {
          actions.setError(result.error);
          return { success: false, error: result.error };
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },

    changePassword: async (newPassword) => {
      try {
        actions.setLoading(true);
        actions.clearError();

        const result = await firebaseAuth.updatePassword(newPassword);
        
        if (result.success) {
          return { success: true };
        } else {
          actions.setError(result.error);
          return { success: false, error: result.error };
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
        actions.clearError();

        const result = await firebaseAuth.resetPassword(email);
        
        if (result.success) {
          return { success: true };
        } else {
          actions.setError(result.error);
          return { success: false, error: result.error };
        }
      } catch (error) {
        actions.setError(error);
        return { success: false, error: handleError(error) };
      } finally {
        actions.setLoading(false);
      }
    },

    resendEmailVerification: async () => {
      try {
        const user = firebaseAuth.getCurrentUser();
        if (user && !user.emailVerified) {
          await firebaseAuth.sendEmailVerification(user);
          return { success: true };
        }
        return { success: false, error: 'User not found or already verified' };
      } catch (error) {
        return { success: false, error: handleError(error) };
      }
    },

    checkEmailVerified: async () => {
      try {
        await firebaseAuth.getCurrentUser()?.reload();
        const user = firebaseAuth.getCurrentUser();
        if (user?.emailVerified) {
          actions.updateProfile({ emailVerified: true });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking email verification:', error);
        return false;
      }
    },
  };

  // Permission check methods - FIXED: No naming conflicts
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const checkIsAdmin = () => {
    return state.isAdmin || hasRole('admin') || hasRole('super_admin');
  };

  const canManageProperties = () => {
    return checkIsAdmin() || hasRole('agent') || hasRole('broker');
  };

  const canManageUsers = () => {
    return checkIsAdmin();
  };

  // Initialize authentication state with Firebase listener
  useEffect(() => {
    console.log('🔄 AuthProvider: Setting up Firebase auth listener');
    
    const unsubscribe = firebaseAuth.onAuthStateChange(({ user, isAuthenticated }) => {
      console.log('🔥 Firebase auth state changed:', user ? user.email : 'No user');
      
      if (user) {
        actions.setUser(user);
      } else {
        actions.clearUser();
      }
      actions.setInitialized(true);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Fixed value object - no naming conflicts
  const value = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Auth methods
    ...authMethods,
    
    // Permission checks - FIXED NAMES
    hasRole,
    isAdmin: checkIsAdmin, // This is now a function, not conflicting with state.isAdmin
    canManageProperties,
    canManageUsers,
    
    // Utility getters
    userId: state.user?.uid,
    userEmail: state.user?.email,
    userName: state.user?.displayName || state.user?.email?.split('@')[0] || 'User',
    userAvatar: state.user?.photoURL,
    userRole: state.user?.role,
    isEmailVerified: state.user?.emailVerified,
    
    // Firebase specific
    currentUser: state.user,

    // Token method
    getIdToken: async () => {
      if (state.user) {
        return state.user.getIdToken();
      }
      return null;
    }
  };

  console.log('🎯 AuthProvider rendered:', {
    user: state.user ? state.user.email : 'No user',
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin,
    initialized: state.initialized
  });

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

// Higher Order Component for protected routes
export const withAuth = (Component) => {
  return function ProtectedComponent(props) {
    const { isAuthenticated, loading, initialized } = useAuth();
    
    if (!initialized || loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return null;
    }
    
    return <Component {...props} />;
  };
};

// Higher Order Component for admin routes - FIXED
export const withAdmin = (Component) => {
  return function AdminComponent(props) {
    const { isAuthenticated, isAdmin, loading, initialized } = useAuth();
    
    console.log('🔐 withAdmin HOC:', {
      isAuthenticated,
      isAdmin: isAdmin(), // Now this calls the function
      loading,
      initialized
    });
    
    if (!initialized || loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated || !isAdmin()) {
      window.location.href = `/access-denied`;
      return null;
    }
    
    return <Component {...props} />;
  };
};

// Component for role-based access
export const RequireRole = ({ role, children, fallback = null }) => {
  const { hasRole, initialized } = useAuth();
  
  if (!initialized) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return hasRole(role) ? children : fallback;
};

// Component for admin access - FIXED
export const RequireAdmin = ({ children, fallback = null }) => {
  const { isAdmin, initialized } = useAuth();
  
  console.log('👑 RequireAdmin Component:', {
    isAdmin: isAdmin(), // Now this calls the function
    initialized
  });
  
  if (!initialized) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAdmin() ? children : fallback;
};

// Component for email verification requirement
export const RequireEmailVerification = ({ children, fallback = null }) => {
  const { isEmailVerified, userEmail } = useAuth();
  
  if (!isEmailVerified && userEmail) {
    return fallback || (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <h3 className="text-yellow-800 font-semibold mb-2">Email Verification Required</h3>
        <p className="text-yellow-700 mb-4">
          Please verify your email address to access this feature.
        </p>
        <button 
          onClick={() => window.location.href = '/verify-email'}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Verify Email
        </button>
      </div>
    );
  }
  
  return children;
};

export default AuthContext;