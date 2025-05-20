import * as z from 'zod';

export const publicationFormSchema = z.object({
  description: z
    .string()
    .min(1, { message: "Опис обов'язковий" })
    .max(1000, { message: 'Опис надто довгий' }),
  keywords: z
    .array(z.string())
    .min(1, { message: "Ключові слова обов'язкові" })
    .max(15, { message: 'Має бути не більше 15-ти елементів' }),
  status: z.enum(['hidden', 'active'] as const),
});

export type PublicationFormData = z.infer<typeof publicationFormSchema>;
