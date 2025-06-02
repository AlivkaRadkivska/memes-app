'use client';

import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/helpers/css-utils';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { SidebarToggle } from '../ui/sidebar-toggle';
import { MiniProfile } from '../users/mini-profile';
import { MiniProfilePlaceholder } from '../users/mini-profile-placeholder';

interface UserSidebarProps {
  className?: string;
  children?: ReactNode;
}

export function WithUserSidebar({ className, children }: UserSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    } else {
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (isCollapsed !== null) {
      localStorage.setItem('sidebar-collapsed', String(isCollapsed));
    }
  }, [isCollapsed]);

  if (isCollapsed === null) return null;

  return (
    <div className="min-h-[calc(100vh-60px)] flex p-0">
      <div className="flex-1 max-w-[calc(100%-50px)] py-2 px-2 md:px-4">
        {children}
      </div>

      <aside
        className={cn(
          'fixed right-0 z-30 md:sticky top-[80px] group flex h-[calc(100vh-80px)] md:top-[54px] md:h-[calc(100vh-54px)] flex-col border-l border-muted-foreground bg-background transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[50px] md:w-[70px]' : 'w-[240px]',
          className
        )}
      >
        <SidebarToggle
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed((prev) => !prev)}
        />

        <div className="flex flex-col h-full cursor-pointer">
          <div className="pt-10">
            {isAuthenticated ? (
              <MiniProfile isCollapsed={isCollapsed} />
            ) : (
              <MiniProfilePlaceholder isCollapsed={isCollapsed} />
            )}
          </div>

          <div className="flex-1"></div>

          <Separator className="mt-4" />
          <div className="mt-auto p-2 md:p-4">
            {!isAuthenticated ? (
              <Button
                variant="outline"
                size={isCollapsed ? 'icon' : 'default'}
                className={cn(
                  'w-full',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                onClick={() => router.push('/auth')}
              >
                <User className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
                {!isCollapsed && 'Авторизуватись'}
              </Button>
            ) : (
              <Button
                variant="outline"
                size={isCollapsed ? 'icon' : 'default'}
                className={cn(
                  'w-full',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                onClick={logout}
              >
                <LogOut className={cn(!isCollapsed && 'mr-2')} />
                {!isCollapsed && 'Вийти з аку'}
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
