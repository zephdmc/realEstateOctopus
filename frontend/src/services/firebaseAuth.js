import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
    sendEmailVerification
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from '../config/firebase';
  
  class FirebaseAuthService {
    constructor() {
      this.googleProvider = new GoogleAuthProvider();
      this.facebookProvider = new FacebookAuthProvider();
      
      // Add custom claims support for roles
      this.googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
    }
  
    // 🔐 Email/Password Registration
    async registerWithEmail(userData) {
      try {
        const { email, password, firstName, lastName, phone } = userData;
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          email, 
          password
        );
        
        const user = userCredential.user;
  
        // Send email verification
        await sendEmailVerification(user);
  
        // Create user profile in Firestore
        await this.createUserProfile(user.uid, {
          email,
          firstName,
          lastName,
          phone,
          role: 'user', // default role
          emailVerified: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        });
  
        // Update auth profile
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
  
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            displayName: `${firstName} ${lastName}`,
            emailVerified: user.emailVerified,
            role: 'user'
          },
          needsVerification: true
        };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Email/Password Login
    async loginWithEmail(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Update last login
        await this.updateUserProfile(user.uid, {
          lastLoginAt: new Date().toISOString()
        });
  
        return {
          success: true,
          user: await this.getUserProfile(user.uid)
        };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Google Sign-In
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, this.googleProvider);
        const user = result.user;
  
        // Check if user exists in Firestore
        const userProfile = await this.getUserProfile(user.uid);
        
        if (!userProfile) {
          // Create new user profile
          await this.createUserProfile(user.uid, {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            role: 'user',
            emailVerified: user.emailVerified,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            photoURL: user.photoURL
          });
        } else {
          // Update last login
          await this.updateUserProfile(user.uid, {
            lastLoginAt: new Date().toISOString()
          });
        }
  
        return {
          success: true,
          user: await this.getUserProfile(user.uid)
        };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Facebook Sign-In
    async signInWithFacebook() {
      try {
        const result = await signInWithPopup(auth, this.facebookProvider);
        const user = result.user;
  
        // Similar logic as Google sign-in
        const userProfile = await this.getUserProfile(user.uid);
        
        if (!userProfile) {
          await this.createUserProfile(user.uid, {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            role: 'user',
            emailVerified: user.emailVerified,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            photoURL: user.photoURL
          });
        }
  
        return {
          success: true,
          user: await this.getUserProfile(user.uid)
        };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Logout
    async logout() {
      try {
        await signOut(auth);
        return { success: true };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Password Reset
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Update Password
    async updatePassword(newPassword) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No authenticated user');
  
        await updatePassword(user, newPassword);
        return { success: true };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Update Profile
    async updateUserProfile(updates) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No authenticated user');
  
        // Update Firebase Auth profile
        if (updates.displayName || updates.photoURL) {
          await updateProfile(user, {
            displayName: updates.displayName,
            photoURL: updates.photoURL
          });
        }
  
        // Update Firestore profile
        await this.updateUserProfile(user.uid, updates);
  
        return {
          success: true,
          user: await this.getUserProfile(user.uid)
        };
      } catch (error) {
        return this.handleAuthError(error);
      }
    }
  
    // 🔐 Auth State Listener
    onAuthStateChange(callback) {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userProfile = await this.getUserProfile(user.uid);
          callback({ user: userProfile, isAuthenticated: true });
        } else {
          callback({ user: null, isAuthenticated: false });
        }
      });
    }
  
    // 🔐 Get Current User
    getCurrentUser() {
      return auth.currentUser;
    }
  
    // 🔐 Check if user is authenticated
    isAuthenticated() {
      return !!auth.currentUser;
    }
  
    // 🔐 Check if user has role
    async hasRole(role) {
      const user = auth.currentUser;
      if (!user) return false;
  
      const userProfile = await this.getUserProfile(user.uid);
      return userProfile?.role === role;
    }
  
    // 🔐 Check if user is admin
    async isAdmin() {
      return this.hasRole('admin');
    }
  
    // Firestore User Profile Management
    async createUserProfile(uid, userData) {
      try {
        await setDoc(doc(db, 'users', uid), userData);
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    }
  
    async getUserProfile(uid) {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { uid, ...docSnap.data() };
        }
        return null;
      } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
      }
    }
  
    async updateUserProfile(uid, updates) {
      try {
        await updateDoc(doc(db, 'users', uid), updates);
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    }
  
    // Error handling
    handleAuthError(error) {
      console.error('Auth error:', error);
      
      const errorMap = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/network-request-failed': 'Network error. Please check your connection',
        'auth/too-many-requests': 'Too many attempts. Please try again later'
      };
  
      return {
        success: false,
        error: errorMap[error.code] || error.message
      };
    }
  }
  
  export const firebaseAuth = new FirebaseAuthService();
  export default firebaseAuth;