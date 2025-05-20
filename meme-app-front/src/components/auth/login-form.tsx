'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/helpers/css-utils';
import { LoginFormData, loginFormSchema } from '@/helpers/schemas/login.schema';
import useLogin from '@/server/hooks/auth/use-login';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

export default function LoginForm() {
  const { login, isPending, errors } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormData) {
    login(data);
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
            'Ввійти'
          )}
        </Button>
      </form>
    </Form>
  );
}
