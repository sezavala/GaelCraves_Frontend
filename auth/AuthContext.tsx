import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type User = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  token?: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User>(null);

  useEffect(() => {
    // Hydrate from localStorage and check token expiration
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('@user');
        if (raw) {
          const userData = JSON.parse(raw);
          
          // Check if token is expired
          if (userData.token) {
            try {
              const payload = userData.token.split('.')[1];
              const decoded = JSON.parse(atob(payload));
              const exp = decoded.exp * 1000; // Convert to milliseconds
              
              if (Date.now() >= exp) {
                console.log('🔐 Token expired, clearing user');
                window.localStorage.removeItem('@user');
                window.localStorage.removeItem('@token');
                return;
              }
            } catch (e) {
              console.error('Failed to decode token:', e);
              window.localStorage.removeItem('@user');
              window.localStorage.removeItem('@token');
              return;
            }
          }
          
          setUserState(userData);
          console.log('💾 User loaded from storage:', userData);
        }
      }
    } catch (e) {
      console.error('Failed to load user from storage:', e);
    }
  }, []);

  const setUser = async (u: User) => {
    console.log('👤 Setting user in AuthContext:', u);
    setUserState(u);
    
    try {
      if (u) {
        // Store in SecureStore (React Native)
        try {
          if (u.token) {
            await SecureStore.setItemAsync('userToken', u.token);
            console.log('💾 Token saved to SecureStore');
          }
        } catch (secureStoreError) {
          console.log('📱 SecureStore not available (web), using localStorage');
        }

        // Store in localStorage (Web)
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('@user', JSON.stringify(u));
          if (u.token) {
            window.localStorage.setItem('@token', u.token);
          }
          console.log('💾 User saved to localStorage with token');
        }
      } else {
        // Clear SecureStore
        try {
          await SecureStore.deleteItemAsync('userToken');
          console.log('🗑️ Token removed from SecureStore');
        } catch (e) {
          console.log('📱 SecureStore not available');
        }

        // Clear localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('@user');
          window.localStorage.removeItem('@token');
          console.log('🗑️ User removed from localStorage');
        }
      }
    } catch (e) {
      console.error('Failed to save user to storage:', e);
    }
  };

  const logout = () => {
    console.log('👋 Logging out user');
    setUser(null);
    // Clear any stored tokens
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('@user');
      window.localStorage.removeItem('@token');
    }
  };

  const isAuthenticated = !!user;

  return <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
