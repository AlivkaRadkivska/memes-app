'use client';

import { cn } from '@/helpers/css-utils';
import {
  SignupFormData,
  signupFormSchema,
} from '@/helpers/schemas/signup.schema';
import useSignup from '@/server/hooks/auth/use-signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export default function SignupForm() {
  const { signup, isPending, errors } = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
    },
  });

  function onSubmit(data: SignupFormData) {
    signup(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">Email</FormLabel>
              <FormControl>
                <div className="relative min-h-full">
                  <Input
                    placeholder="user@mail.com"
                    className={cn(
                      'resize-none transition-all w-full',
                      field.value.length > 0 && 'pr-16'
                    )}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">Нікнейм</FormLabel>
              <FormControl>
                <div className="relative min-h-full">
                  <Input
                    placeholder="meme_lover_#1"
                    className={cn(
                      'resize-none transition-all w-full',
                      field.value.length > 0 && 'pr-16'
                    )}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">
                Повне ім&apos;я (не обов&apos;язково)
              </FormLabel>
              <FormControl>
                <div className="relative min-h-full">
                  <Input
                    placeholder="Name Surname"
                    className={cn(
                      'resize-none transition-all w-full',
                      field.value && field.value.length > 0 && 'pr-16'
                    )}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">
                Дата народження (не обов&apos;язково)
              </FormLabel>
              <FormControl>
                <div className="relative min-h-full">
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    className={'resize-none transition-all w-full'}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">Пароль</FormLabel>
              <FormControl>
                <div className="relative min-h-full">
                  <Input
                    type="password"
                    placeholder="𓁹"
                    className={cn(
                      'resize-none transition-all w-full',
                      field.value.length > 0 && 'pr-16'
                    )}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">
                Повторіть пароль
              </FormLabel>
              <FormControl>
                <div className="relative min-h-full">
                  <Input
                    type="password"
                    placeholder="𓁹"
                    className={cn(
                      'resize-none transition-all w-full',
                      field.value.length > 0 && 'pr-16'
                    )}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errors &&
          errors.length > 0 &&
          errors.map((error) => (
            <p key={error} className="text-destructive text-sm mt-2">
              {error}
            </p>
          ))}

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Завантаження...
            </>
          ) : (
            'Зареєструватися'
          )}
        </Button>
      </form>
    </Form>
  );
}
