import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useAuthContext } from './AuthContext';

type AdminContextType = {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    // Check if user has admin role
    if (user && user.roles && Array.isArray(user.roles)) {
      const hasAdminRole = user.roles.includes('ADMIN') || user.roles.includes('GAEL_HIMSELF');
      setIsAdmin(hasAdminRole);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return ctx;
};