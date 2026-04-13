// services/auth.service.ts
//
// ¿Por qué separar el service del store?
// El store maneja ESTADO (¿quién está autenticado?).
// El service maneja COMUNICACIÓN con el API (cómo hacer las peticiones).
// Esta separación hace que ambas partes sean testeables independientemente
// y evita que el store sea demasiado grande.

import type { AuthResponse, RequestOtpPayload, User, VerifyOtpPayload } from '@/types/auth.types';
import { http } from './http';

export const authService = {
  /**
   * Solicita el envío de un código OTP al número de WhatsApp.
   * El backend genera el código, lo almacena con expiración en BD y lo envía.
   */
  async requestOtp(phone: string): Promise<void> {
    const payload: RequestOtpPayload = { phone };
    await http.post('/auth/request-otp', payload);
  },

  /**
   * Verifica el código OTP.
   *
   * Si es válido, el backend responde con:
   * - Status 200
   * - Header: Set-Cookie: access_token=JWT; HttpOnly; Secure; SameSite=Strict; Path=/
   * - Body: { user: { id, phone, name, role } }
   *
   * La cookie es guardada automáticamente por el navegador.
   * Nosotros solo extraemos los datos del usuario del body.
   */
  async verifyOtp(phone: string, code: string): Promise<User> {
    const payload: VerifyOtpPayload = { phone, code };
    const response = await http.post<AuthResponse>('/auth/verify-otp', payload);
    return response.user;
  },

  /**
   * Obtiene el usuario actual basándose en la cookie de sesión.
   * Llamar al cargar la app para restaurar la sesión.
   *
   * Si la cookie está expirada o es inválida, el servidor responde 401
   * y axios lo convierte en un error que el store maneja.
   */
  async getMe(): Promise<User> {
    const response = await http.get<User>('/auth/me');
    return response;
  },

  async loginAdmin(data: { username: string; password: string }): Promise<{ message: string }> {
    const response = await http.post<{ message: string }>('/auth/admin/login', data);
    return response;
  },

  /**
   * Cierra la sesión.
   * El servidor invalida la cookie enviando:
   * Set-Cookie: access_token=; Max-Age=0; HttpOnly; Secure
   */
  async logout(): Promise<void> {
    await http.post('/auth/logout');
  },
};
