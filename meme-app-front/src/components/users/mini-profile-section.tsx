'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/helpers/css-utils';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MiniProfileSection({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Avatar
        className={cn(
          'transition-all duration-300 ease-in-out cursor-pointer',
          isCollapsed ? 'h-10 w-10' : 'h-20 w-20'
        )}
        onClick={() => router.push('/profile')}
      >
        <AvatarImage
          src={'https://github.com/shadcn.png'}
          alt={user?.username || 'guest'}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(user?.username || 'Гість')}
        </AvatarFallback>
      </Avatar>

      {!isCollapsed && (
        <div className="flex flex-col items-center space-y-1 text-center">
          <h3 className="font-medium leading-none">
            {user?.username || 'Гість'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {user?.email || 'guest@mail'}
          </p>

          {isAuthenticated && (
            <div className="flex gap-4 pt-4">
              <div className="text-center">
                <p className="text-sm font-medium leading-none">
                  {user?.followerCount || 0}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium leading-none">
                  {user?.followingCount || 0}
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
          )}
        </div>
      )}
      {isAuthenticated && (
        <Button
          variant="default"
          size={isCollapsed ? 'icon' : 'default'}
          className={cn(
            'w-full',
            isCollapsed ? 'justify-center' : 'justify-start mt-5'
          )}
          onClick={() => router.push('/gallery')}
        >
          <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
          {!isCollapsed && 'Підкинути мемчиків'}
        </Button>
      )}
    </div>
  );
}
