// types/auth.types.ts

export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface RequestOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface AuthResponse {
  user: User;
  // El token NO viene en el body — viene en una cookie HttpOnly
  // Solo retornamos los datos del usuario
}
