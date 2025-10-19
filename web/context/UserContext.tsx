"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  clearUser: () => void;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  clearUser: () => {},
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Check for existing token and user data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, clearUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
