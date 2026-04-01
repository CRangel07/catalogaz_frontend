import { z } from 'zod';

export const LoginAdminSchema = z.object({
  username: z.string().nonempty().max(30),
  password: z.string().nonempty().min(6),
});

export const ProductSchema = z.object({
  code: z.string().min(1, 'El código de producto es obligatorio').max(60, 'Máximo 30 caracteres'),

  name: z.string().min(1, 'El nombre es obligatorio').max(60, 'Máximo 60 caracteres'),

  description: z.string().max(120, 'Máximo 120 caracteres').nullable().optional(),

  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),

  available: z.number().min(0).max(1),
});
