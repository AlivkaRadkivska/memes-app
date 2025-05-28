'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/helpers/css-utils';
import { Pen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MiniProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Avatar
        className={cn(
          'transition-all duration-300 ease-in-out cursor-pointer',
          isCollapsed ? 'h-10 w-10' : 'h-20 w-20'
        )}
        onClick={() => router.push('/my-profile')}
      >
        <AvatarImage src={user?.avatar} alt={user?.username} />
        <AvatarFallback className="bg-primary/10 text-primary">
          Ніц
        </AvatarFallback>
      </Avatar>

      {!isCollapsed && (
        <div className="flex flex-col items-center space-y-1 text-center">
          <h3 className="font-medium leading-none">{user?.username}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>

          <div className="flex gap-4 py-4">
            <div className="text-center">
              <p className="text-sm font-medium leading-none">
                {user?.followerCount || 0}
              </p>
              <p className="text-xs text-muted-foreground">Підписники</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium leading-none">
                {user?.followingCount || 0}
              </p>
              <p className="text-xs text-muted-foreground">Підписки</p>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="default"
        size={isCollapsed ? 'icon' : 'default'}
        className={cn(
          'w-full',
          isCollapsed ? 'justify-center' : 'justify-start'
        )}
        onClick={() => router.push('/gallery')}
      >
        <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
        {!isCollapsed && 'Підкинути мемчиків'}
      </Button>
      <Button
        variant="outline"
        size={isCollapsed ? 'icon' : 'default'}
        className={cn(
          'w-full',
          isCollapsed ? 'justify-center' : 'justify-start'
        )}
        onClick={() => router.push('/my-profile/update')}
      >
        <Pen className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
        {!isCollapsed && 'Змінити інфо'}
      </Button>
    </div>
  );
}
