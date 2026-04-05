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
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | undefined>();
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    const stored = localStorage.getItem("cc_auth");
    if (stored) {
      const parsed = JSON.parse(stored) as { token: string; user: UserProfile };
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const login = (tokenValue: string, userValue: UserProfile) => {
    setUser(userValue);
    setToken(tokenValue);
    localStorage.setItem("cc_auth", JSON.stringify({ token: tokenValue, user: userValue }));
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    localStorage.removeItem("cc_auth");
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
