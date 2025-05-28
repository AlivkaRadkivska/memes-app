'use client';

import { useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { SearchInput } from './search-input';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const renderCenterContent = () => {
    if (pathname === '/' || pathname === '/follows') {
      return (
        <Tabs value={pathname}>
          <TabsList>
            <TabsTrigger value="/" onClick={() => router.push('/')}>
              Шось новеньке
            </TabsTrigger>
            <TabsTrigger
              value="/follows"
              onClick={() => router.push('/follows')}
              disabled={!isAuthenticated}
            >
              Меми друзів
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
    }

    if (pathname === '/auth') {
      return <p className="text-center h-full text-xl">Авторизація</p>;
    }

    if (pathname.startsWith('/my-profile')) {
      return <p className="text-center h-full text-xl">{user?.username}</p>;
    }

    return null;
  };

  return (
    <header className="border-b fixed top-0 w-full z-40 bg-background">
      <div className="grid grid-cols-3 max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <Button
            variant="ghost"
            className="w-min text-xl bold flex items-center justify-start"
            onClick={() => router.push('/')}
          >
            <p>Підвал з мемами</p>
          </Button>
        </div>

        <div>{renderCenterContent()}</div>

        <div className="relative flex max-w-sm items-center space-x-2 ml-auto justify-end">
          <SearchInput />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
