import { z } from 'zod';

export const RegisterRequest = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(10),
});
