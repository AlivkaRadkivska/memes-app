'use client';

import { cn } from '@/helpers/css-utils';
import {
  SignupFormData,
  signupFormSchema,
} from '@/helpers/schemas/signup.schema';
import useSignup from '@/server/hooks/auth/use-signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Paperclip, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
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

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
      fullName: '',
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
          name="avatar"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">
                Аватарка (не обо&apos;язково)
              </FormLabel>
              <FormControl>
                <div className="flex relative items-center justify-center gap-4">
                  <div
                    className="relative w-24 h-24 rounded-full overflow-hidden border border-muted hover:brightness-75 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground flex-col">
                        Ніц
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-[calc(50%+20px)] rounded-full opacity-75"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-16 right-[calc(50%-60px)] rounded-full opacity-75"
                    onClick={() => setAvatarPreview(null)}
                  >
                    <Trash />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const objectUrl = URL.createObjectURL(file);
                        setAvatarPreview(objectUrl);
                        field.onChange(file);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
