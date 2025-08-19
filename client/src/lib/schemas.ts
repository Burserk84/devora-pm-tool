import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});