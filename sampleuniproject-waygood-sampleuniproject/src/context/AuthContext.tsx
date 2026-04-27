"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Admin, LoginCredentials } from "@/lib/auth.types";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authApi.getMe();
      setAdmin(data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials);
    setAdmin(data.admin);
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
    router.push("/admin/dashboard");
  };

  const signup = async (email: string, password: string) => {
    await authApi.signup({ email, password });
    toast({
      title: "Account Created",
      description: "Please log in with your credentials.",
    });
    router.push("/admin/login");
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAdmin(null);
      router.push("/admin/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}



