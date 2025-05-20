import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('Невірний формат email'),
  password: z.string().min(4, 'Пароль має містити щонайменше 4 символа'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
