import React, { createContext, useContext, useState } from 'react';
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
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setToken(result.token);
    setAuthToken(result.token);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    studentId: string
  ) => {
    const result = await authService.register(
      name,
      email,
      password,
      studentId
    );
    setToken(result.token);
    setAuthToken(result.token);
  };

  const logout = () => {
    setToken(null);
    setAuthToken(null);
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
