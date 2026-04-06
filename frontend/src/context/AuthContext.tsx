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
}

interface AuthContextValue {
  user?: UserProfile;
  token?: string;
  isReady: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cc_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { token: string; user: UserProfile };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem("cc_auth");
      }
    }
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

  const value = useMemo(() => ({ user, token, isReady, login, logout }), [user, token, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
