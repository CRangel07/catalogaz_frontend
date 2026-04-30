import { z } from 'zod';

// ________________________ ADMIN _______________________________________

export const LoginAdminSchema = z.object({
  username: z.string().nonempty().max(30),
  password: z.string().nonempty().min(6),
});

export type AdminRole = 'admin' | 'pedidos' | 'caja';

export const CreateAdminDto = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.enum(['admin', 'pedidos', 'caja']),
});

export const UpdateAdminDto = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string().optional(),
  role: z.enum(['admin', 'pedidos', 'caja']),
});

export type CreateAdmin = z.infer<typeof CreateAdminDto>;
export type UpdateAdmin = Partial<CreateAdmin>;
// ________________________ PRODUCT _______________________________________

export const ProductSchema = z.object({
  code: z.string().min(1, 'El código de producto es obligatorio').max(60, 'Máximo 30 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(60, 'Máximo 60 caracteres'),
  description: z.string().max(120, 'Máximo 120 caracteres').nullable().optional(),
  priceOne: z.number().min(0.01, 'El precio Uno debe ser mayor a 0'),
  priceFour: z.number().min(0.01, 'El precio Cuatro debe ser mayor a 0'),
  isActive: z.boolean().optional(),
});

// ________________________ CLIENT ________________________________________

export const CreateClientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(30, 'Máximo 30 caracteres'),
  phone: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .max(10, 'Máximo diez digitos')
    .regex(/^\d+$/, 'Solo se permiten números'),
});

export const UpdateClientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(30, 'Máximo 30 caracteres').optional(),
  phone: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .max(10, 'Máximo diez digitos')
    .regex(/^\d+$/, 'Solo se permiten números')
    .optional(),
  isActive: z.boolean().optional(),
});

// _______________________________ ORDER _____________________________________

export const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'preparing', 'cancelled', 'ready']).optional(),
});
