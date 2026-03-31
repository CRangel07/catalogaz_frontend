import { z } from 'zod';

export const LoginAdminSchema = {
  username: z.string().nonempty(),
  password: z.string().nonempty(),
};
