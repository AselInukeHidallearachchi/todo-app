"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  setUser: (userData: User, token: string) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  clearUser: () => {},
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        clearUser();
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await api.get("/auth/me");
        setUserState(response.data.user);
      } catch (error) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    if (!["/login", "/register"].includes(pathname)) {
      router.replace("/login");
    }
  };

  const setUser = (userData: User, token: string) => {
    if (!userData || !token) {
      clearUser();
      return;
    }
    setUserState(userData);
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  // Handle storage events for multi-tab support: Multi-tab sync (logout everywhere)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (!e.newValue) {
          clearUser();
        } else {
          // Token changed in another tab, reinitialize auth
          api.defaults.headers.common.Authorization = `Bearer ${e.newValue}`;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
