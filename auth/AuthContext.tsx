import React, { createContext, useContext, useEffect, useState } from 'react';

type User = { email?: string } | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
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
          setUserState(JSON.parse(raw));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setUser = (u: User) => {
    setUserState(u);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (u) {
          window.localStorage.setItem('@user', JSON.stringify(u));
        } else {
          window.localStorage.removeItem('@user');
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
