import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "student" | "teacher" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  faculty: string;
  bio?: string;
  classLevel?: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextValue {
  user?: UserProfile;
  token?: string;
  isReady: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | undefined>(() => {
    const stored = localStorage.getItem("cc_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.user;
      } catch {
        return undefined;
      }
    }
    return undefined;
  });
  const [token, setToken] = useState<string | undefined>(() => {
    const stored = localStorage.getItem("cc_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.token;
      } catch {
        return undefined;
      }
    }
    return undefined;
  });
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    // Initial check is done in state initializers
    setIsReady(true);
  }, []);

  const login = (tokenValue: string, userValue: UserProfile) => {
    setUser(userValue);
    setToken(tokenValue);
    setIsReady(true);
    localStorage.setItem("cc_auth", JSON.stringify({ token: tokenValue, user: userValue }));
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    setIsReady(true);
    localStorage.removeItem("cc_auth");
  };

  const updateUser = (newUser: UserProfile) => {
    setUser(newUser);
    if (token) {
      localStorage.setItem("cc_auth", JSON.stringify({ token, user: newUser }));
    }
  };

  const value = useMemo(() => ({ user, token, isReady, login, logout, updateUser }), [user, token, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
