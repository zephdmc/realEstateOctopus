import { useState, useEffect } from 'react';
import { firebaseAuth } from '../services/firebaseAuth';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChange(({ user, isAuthenticated }) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await firebaseAuth.loginWithEmail(email, password);
    if (!result.success) setError(result.error);
    setLoading(false);
    return result;
  };

  const registerWithEmail = async (userData) => {
    setLoading(true);
    setError(null);
    const result = await firebaseAuth.registerWithEmail(userData);
    if (!result.success) setError(result.error);
    setLoading(false);
    return result;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const result = await firebaseAuth.signInWithGoogle();
    if (!result.success) setError(result.error);
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await firebaseAuth.logout();
    setLoading(false);
    return result;
  };

  return {
    user,
    loading,
    error,
    loginWithEmail,
    registerWithEmail,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user
  };
};