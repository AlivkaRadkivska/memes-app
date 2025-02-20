'use client';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { SearchInput } from './search-input';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const isAuthorized = true;

  return (
    <header className="border-b">
      <div className="grid grid-cols-3 max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-xl bold flex items-center justify-start">
          <p>Meme&apos;s basement</p>
        </div>

        <Tabs defaultValue="main">
          <TabsList>
            <TabsTrigger value="main">Recommendations</TabsTrigger>
            <TabsTrigger value="followings" disabled={!isAuthorized}>
              Followings
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex max-w-sm items-center space-x-2 ml-auto justify-end">
          <SearchInput />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
