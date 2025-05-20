'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { SearchInput } from './search-input';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const renderCenterContent = () => {
    if (pathname === '/') {
      return (
        <Tabs defaultValue="main">
          <TabsList>
            <TabsTrigger value="main">Шось новеньке</TabsTrigger>
            <TabsTrigger value="followings" disabled={!isAuthenticated}>
              Меми друзів
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
    }

    if (pathname === '/auth') {
      return <p className="text-center h-full text-xl">Авторизація</p>;
    }

    if (pathname.startsWith('/profile')) {
      return <p className="text-center">Профіль</p>;
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
