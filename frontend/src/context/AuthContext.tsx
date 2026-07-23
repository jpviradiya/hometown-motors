import React, { createContext, useState, useEffect } from "react";
import type { User, LoginRequest, RegisterRequest } from "../types/auth";
import { login as loginApi, register as registerApi, getCurrentUser } from "../api/auth.api";
import { getToken, saveToken, removeToken } from "../utils/storage";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getToken());
  const [loading, setLoading] = useState<boolean>(true);

  // Restore authenticated session on page refresh
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        removeToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await loginApi(credentials);
    saveToken(response.token);
    setToken(response.token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
  };

  const register = async (data: RegisterRequest) => {
    await registerApi(data);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
