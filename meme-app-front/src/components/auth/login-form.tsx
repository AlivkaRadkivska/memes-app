'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/server/hooks/auth/use-login';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      router.replace('/not-found');
      return;
    }

    if (token && user) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', user);
      router.replace('/');
    }
  }, [router, searchParams]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login({ email, password });
        }}
        className="flex flex-col gap-4 max-w-sm"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
        {error && <p className="text-red-500">Вхід в акаунт провалено</p>}
      </form>

      <a href="http://localhost:3000/auth/google/login">
        <Button variant="outline" className="w-full mt-2">
          Увійти з Google
        </Button>
      </a>
    </>
  );
}
