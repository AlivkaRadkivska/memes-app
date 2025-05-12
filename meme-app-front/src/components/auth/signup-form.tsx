'use client';

import { useSignup } from '@/server/hooks/auth/use-signup';
import { SignupCredentials } from '@/server/types/auth';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/date-picker';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function SignupForm() {
  const router = useRouter();
  const { mutate: signup, isPending, errors } = useSignup();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    if (password) setPasswordsMatch(password === repeatPassword);
  }, [password, repeatPassword]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch || !birthday) {
      return;
    }

    const signupData: SignupCredentials = {
      email,
      username,
      password,
      repeatPassword,
      fullName,
      birthday,
    };

    try {
      await signup(signupData);
      router.push('/');
    } catch {}
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col w-full gap-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-username">Нікнейм</Label>
        <Input
          id="signup-username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-fullname">
          Повне ім&apos;я (не обов&apos;язково)
        </Label>
        <Input
          id="signup-fullname"
          type="text"
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-birthday">
          Дата народження (не обов&apos;язково)
        </Label>
        <DatePicker
          date={birthday}
          setDate={setBirthday}
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Пароль</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-repeat-password">Повторіть Пароль</Label>
        <Input
          id="signup-repeat-password"
          type="password"
          placeholder="••••••••"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
          autoComplete="new-password"
          className={`w-full ${
            !passwordsMatch && repeatPassword ? 'border-destructive' : ''
          }`}
        />
        {!passwordsMatch && (
          <p className="text-destructive text-sm">Пароль має співпадати</p>
        )}
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
        disabled={isPending || !passwordsMatch || !email || !username}
        className="w-full mt-2"
      >
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
  );
}
