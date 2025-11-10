import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

const ADMIN_PASSWORD = 'admin'; // Simple password as requested
const ADMIN_SESSION_KEY = 'oukrim_admin_session';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch (error) {
        console.error("Could not save admin session", error);
      }
      closeLoginModal();
      return true;
    }
    return false;
  }, [closeLoginModal]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (error) {
      console.error("Could not remove admin session", error);
    }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
