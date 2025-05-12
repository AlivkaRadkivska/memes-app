'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/server/hooks/auth/use-login';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const { mutate: login, isPending, errors } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push('/');
    } catch {}
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Пароль</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full"
        />
      </div>

      {errors &&
        errors.length > 0 &&
        errors.map((error) => (
          <p key={error} className="text-destructive text-sm mt-2">
            {error}
          </p>
        ))}

      <Button
        type="submit"
        disabled={isPending || !email || !password}
        className="w-full mt-2"
      >
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
  );
}
