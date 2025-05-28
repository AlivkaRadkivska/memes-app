'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/helpers/css-utils';
import {
  UpdateUserFormData,
  updateUserFormSchema,
} from '@/helpers/schemas/update-user.schema';
import useUpdateUser from '@/server/hooks/users/use-update-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Paperclip, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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

export default function UserUpdateForm() {
  const { updateUser, isPending, errors } = useUpdateUser();
  const { user, isLoading } = useAuth();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      email: '',
      username: '',
      fullName: '',
      signature: '',
      birthday: new Date(),
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || '',
        username: user.username || '',
        fullName: user.fullName || '',
        signature: user.signature || '',
        birthday: user.birthday ? new Date(user.birthday) : undefined,
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [form, user]);

  function onSubmit(data: UpdateUserFormData) {
    updateUser({ ...data });
  }

  if (isLoading) return <p>Loading</p>;
  if (!isLoading && !user) return <p>Not found</p>;

  return (
    <div className="w-full flex flex-col justify-start items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-4 max-w-lg"
        >
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="space-y-2 transition-all w-full h-full">
                <FormLabel className="text-base font-medium">
                  Аватарка
                </FormLabel>
                <FormControl>
                  <div className="flex relative items-center justify-center gap-4">
                    <div
                      className="relative w-24 h-24 rounded-full overflow-hidden border border-muted hover:brightness-75 cursor-pointer transition-all"
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
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-[calc(50%+20px)] rounded-full opacity-75 hover:opacity-100 transition-opacity"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute bottom-16 right-[calc(50%-60px)] rounded-full opacity-75 hover:opacity-100 transition-opacity"
                      onClick={() => setAvatarPreview(null)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isPending}
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
                        field.value && field.value.length > 0 && 'pr-16'
                      )}
                      disabled={isPending}
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
                        field.value && field.value.length > 0 && 'pr-16'
                      )}
                      disabled={isPending}
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
                  Повне ім&apos;я
                </FormLabel>
                <FormControl>
                  <div className="relative min-h-full">
                    <Input
                      placeholder="Name Surname"
                      className={cn(
                        'resize-none transition-all w-full',
                        field.value && field.value.length > 0 && 'pr-16'
                      )}
                      disabled={isPending}
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
            name="signature"
            render={({ field }) => (
              <FormItem className="space-y-2 transition-all w-full h-full">
                <FormLabel className="text-base font-medium">
                  Важлива інформація для профілю
                </FormLabel>
                <FormControl>
                  <div className="relative min-h-full">
                    <Input
                      placeholder="Пафосна цитата"
                      className={cn(
                        'resize-none transition-all w-full',
                        field.value && field.value.length > 0 && 'pr-16'
                      )}
                      disabled={isPending}
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
                  Дата народження
                </FormLabel>
                <FormControl>
                  <div className="relative min-h-full">
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      className={'resize-none transition-all w-full'}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t border-border pt-4 mt-2">
            <h3 className="text-lg font-medium mb-4">Зміна пароля</h3>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2 transition-all w-full h-full">
                  <FormLabel className="text-base font-medium">
                    Поточний пароль
                  </FormLabel>
                  <FormControl>
                    <div className="relative min-h-full">
                      <Input
                        type="password"
                        placeholder="𓁹"
                        className={cn(
                          'resize-none transition-all w-full',
                          field.value && field.value.length > 0 && 'pr-16'
                        )}
                        disabled={isPending}
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
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2 transition-all w-full h-full mt-4">
                  <FormLabel className="text-base font-medium">
                    Новий пароль
                  </FormLabel>
                  <FormControl>
                    <div className="relative min-h-full">
                      <Input
                        type="password"
                        placeholder="𓁹"
                        className={cn(
                          'resize-none transition-all w-full',
                          field.value && field.value.length > 0 && 'pr-16'
                        )}
                        disabled={isPending}
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
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="space-y-2 transition-all w-full h-full mt-4">
                  <FormLabel className="text-base font-medium">
                    Підтвердіть новий пароль
                  </FormLabel>
                  <FormControl>
                    <div className="relative min-h-full">
                      <Input
                        type="password"
                        placeholder="𓁹"
                        className={cn(
                          'resize-none transition-all w-full',
                          field.value && field.value.length > 0 && 'pr-16'
                        )}
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {errors &&
            errors.length > 0 &&
            errors.map((error) => (
              <p key={error} className="text-destructive text-sm mt-2">
                {error}
              </p>
            ))}

          <Button type="submit" disabled={isPending} className="w-full mt-4">
            {isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Оновлення...
              </>
            ) : (
              'Зберегти зміни'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
