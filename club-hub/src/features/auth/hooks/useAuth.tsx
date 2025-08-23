import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import { setAuthToken } from '../../../services/api';

interface AuthContextValue {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
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

  // automatically refresh auth token every 15 minutes
  useEffect(() => {
    if (!token) return;
    const handle = setInterval(async () => {
      try {
        const res = await authService.refresh(token);
        setToken(res.token);
      } catch {
        setToken(null);
      }
    }, 13 * 60 * 1000);
    return () => clearInterval(handle);
  }, [token]);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setToken(result.token);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    await authService.register(name, email, password);
  };

  const logout = async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch {}
    }
    setToken(null);
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
