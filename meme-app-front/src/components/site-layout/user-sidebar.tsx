'use client';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { MiniProfileSection } from '../users/mini-profile-section';
import { useState } from 'react';
import { SidebarToggle } from '../ui/sidebar-toggle';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface UserSidebarProps {
  className?: string;
}

export function UserSidebar({ className }: UserSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <aside
      className={cn(
        'sticky top-[80px] group flex h-[calc(100vh-80px)] flex-col border-l bg-background transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[70px]' : 'w-[240px]',
        className
      )}
    >
      <SidebarToggle
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed((prev) => !prev)}
      />

      <div className="flex flex-col h-full cursor-pointer">
        <div className="pt-10" onClick={() => router.push('/profile')}>
          <MiniProfileSection isCollapsed={isCollapsed} />
        </div>

        <div className="flex-1"></div>

        <Separator className="mt-4" />
        <div className="p-4 mt-auto">
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
              <LogOut className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
              {!isCollapsed && 'Вийти з аку'}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
