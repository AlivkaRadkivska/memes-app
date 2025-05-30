'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LoginForm from './login-form';
import SignupForm from './signup-form';

export default function AuthForm() {
  const { setAuthFromRedirect } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (token && user) {
      setAuthFromRedirect(token, user);
      router.push('/');
    }
  }, [router, searchParams, setAuthFromRedirect]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <div className="mb-4">
        <Tabs defaultValue="login">
          <TabsList className="mb-4">
            <TabsTrigger value="login">Вхід</TabsTrigger>
            <TabsTrigger value="signup">Реєстрація</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <p className="text-muted-foreground">Введіть свої креди тут:</p>
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <p className="text-muted-foreground">Заповніть інфу про себе:</p>
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">або</span>
        </div>
      </div>

      <a href={`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google/login`}>
        <Button variant="outline" className="w-full">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Ввійти через Google
        </Button>
      </a>
    </div>
  );
}
