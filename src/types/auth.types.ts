// types/auth.types.ts

export type User =
  | {
      sub: number;
      role: 'admin';
      username: string;
    }
  | {
      sub: number;
      role: 'customer';
      phone: string;
      name: string;
    };

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
