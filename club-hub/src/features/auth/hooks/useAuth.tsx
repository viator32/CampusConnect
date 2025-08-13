import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import { setAuthToken } from '../../../services/api';

interface AuthContextValue {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    studentId: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('access_token');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setToken(result.token);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    studentId: string
  ) => {
    await authService.register(name, email, password, studentId);
  };

  const logout = () => {
    setToken(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
