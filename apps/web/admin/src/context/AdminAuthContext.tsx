import { AdminApiService } from '@portfolio/shared';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: () => void; // No arguments needed anymore
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkSession = async () => {
      try {
        const api = new AdminApiService(import.meta.env.VITE_API_URL);
        const valid = await api.verifyKey();
        setIsAuthenticated(valid);
      } catch {
        setIsAuthenticated(false);
      } finally {
        // CRITICAL: This stops the "hang"
        setIsLoading(false); 
      }
    };
    checkSession();
  }, []);

  if (isLoading) return <div>Verifying Session...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: () => setIsAuthenticated(true), logout: () => setIsAuthenticated(false) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};