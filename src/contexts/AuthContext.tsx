import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      }, (error) => {
        console.error('Firebase auth error:', error);
        setError(error.message);
        setLoading(false);
      });
    } catch (err) {
      console.error('Error setting up auth listener:', err);
      setError('Failed to initialize authentication');
      setLoading(false);
    }

    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    login,
    logout,
    resetPassword,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};