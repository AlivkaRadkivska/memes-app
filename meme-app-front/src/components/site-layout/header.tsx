'use client';

import { useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { SearchInput } from './search-input';
import { ThemeToggle } from './theme-toggle';
import { Badge } from '../ui/badge';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const renderCenterContent = () => {
    if (pathname === '/' || pathname === '/follows') {
      return (
        <Tabs value={pathname}>
          <TabsList className="flex justify-center gap-2 sm:gap-4">
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
      return <Badge className="text-lg opacity-60">Авторизація</Badge>;
    }

    if (pathname.startsWith('/my-profile')) {
      return <Badge className="text-lg opacity-60">{user?.username}</Badge>;
    }

    return null;
  };

  return (
    <header className="border-b fixed top-0 inset-x-0 w-full z-40 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full sm:w-auto space-x-2">
          <Button
            variant="outline"
            className="text-md sm:text-xl font-bold"
            onClick={() => router.push('/')}
          >
            <span>Підвал з мемами</span>
          </Button>

          <div className="flex items-center space-x-2 sm:hidden">
            <SearchInput />
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-2 sm:mt-0 flex justify-center sm:justify-center sm:ml-auto sm:mr-auto">
          {renderCenterContent()}
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <SearchInput />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
