import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<{
  apiKey: string | null;
  login: (key: string) => void;
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(sessionStorage.getItem('admin_key'));

  const login = (key: string) => {
    sessionStorage.setItem('admin_key', key);
    setApiKey(key);
  };

  const logout = () => {
    sessionStorage.removeItem('admin_key');
    setApiKey(null);
  };

  return (
    <AuthContext.Provider value={{ apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};