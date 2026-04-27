import { Admin, LoginCredentials, SignupCredentials, AuthResponse, ApiError } from "./auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = data || { message: "An error occurred" };
    throw new Error(error.message);
  }

  return data as T;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  signup: async (credentials: SignupCredentials): Promise<{ message: string }> => {
    return request<{ message: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
  },

  getMe: async (): Promise<{ admin: Admin }> => {
    return request<{ admin: Admin }>("/api/auth/me", {
      method: "GET",
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return request<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },
};

