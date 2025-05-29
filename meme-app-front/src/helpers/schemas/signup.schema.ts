import { isDate, isValid } from 'date-fns';
import { z } from 'zod';

export const signupFormSchema = z
  .object({
    email: z.string().email('Невірний формат email'),
    username: z
      .string()
      .min(2, 'Нікнейм має містити щонайменше 2 символи')
      .max(15, 'Нікнейм задовгий'),
    fullName: z
      .string()
      .max(30, 'Повне ім’я задовге')
      .optional()
      .or(z.literal('')),
    signature: z
      .string()
      .max(300, 'Коротше, будь ласка')
      .optional()
      .or(z.literal('')),
    avatar: z.instanceof(File).optional(),
    birthday: z
      .union([
        z.date().refine((date) => isValid(date) && isDate(date), {
          message: 'Некоректна дата',
        }),
        z.undefined(),
      ])
      .optional(),

    password: z
      .string()
      .min(4, 'Пароль має містити щонайменше 4 символа')
      .max(255, 'Пароль задовгий'),

    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Паролі не співпадають',
    path: ['repeatPassword'],
  });

export type SignupFormData = z.infer<typeof signupFormSchema>;
