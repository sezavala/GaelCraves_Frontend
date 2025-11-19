import React, { createContext, useContext, useEffect, useState } from 'react';

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
    // Hydrate from localStorage on web / when available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('@user');
        if (raw) {
          const userData = JSON.parse(raw);
          setUserState(userData);
          console.log('💾 User loaded from storage:', userData);
        }
      }
    } catch (e) {
      console.error('Failed to load user from storage:', e);
    }
  }, []);

  const setUser = (u: User) => {
    console.log('👤 Setting user in AuthContext:', u);
    setUserState(u);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (u) {
          window.localStorage.setItem('@user', JSON.stringify(u));
          console.log('💾 User saved to storage');
        } else {
          window.localStorage.removeItem('@user');
          console.log('🗑️ User removed from storage');
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
