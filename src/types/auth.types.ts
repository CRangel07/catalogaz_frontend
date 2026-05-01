// types/auth.types.ts

export type UserAdmin = {
  sub: number;
  role: 'admin' | 'pedidos' | 'caja';
  username: string;
};
export type UserCustomer = {
  sub: number;
  role: 'customer';
  phone: string;
  name: string;
};

export type User = UserAdmin | UserCustomer;

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
