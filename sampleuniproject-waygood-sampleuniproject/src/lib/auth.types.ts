export interface Admin {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface ApiError {
  message: string;
}
