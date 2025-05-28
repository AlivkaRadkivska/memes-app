import { z } from 'zod';

export const updateUserFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Введіть дійсну електронну адресу' })
      .optional(),
    username: z
      .string()
      .min(2, { message: 'Нікнейм має містити принаймні 2 символи' })
      .optional(),
    fullName: z.string().optional(),
    signature: z.string().optional(),
    birthday: z.date().optional(),
    password: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
    avatar: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword?.trim() !== '' && data.password?.trim() === '') {
        return false;
      }
      return true;
    },
    {
      message: "Поточний пароль обов'язковий при зміні пароля",
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      if (
        data.newPassword &&
        data.newPassword.trim() !== '' &&
        data.newPassword.length < 4
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Поточний пароль обов'язковий при зміні пароля",
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      if (
        data.newPassword?.trim() !== '' &&
        data.confirmNewPassword?.trim() !== '' &&
        data.newPassword !== data.confirmNewPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Паролі не співпадають',
      path: ['confirmNewPassword'],
    }
  );

export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;
