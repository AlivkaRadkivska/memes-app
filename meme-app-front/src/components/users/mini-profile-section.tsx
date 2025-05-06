'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export function MiniProfileSection({ isCollapsed }: { isCollapsed: boolean }) {
  const isAuthenticated = false;
  const user = {
    avatarUrl: 'https://github.com/shadcn.png',
    email: 'guest@mail.com',
    username: 'Guest',
    followers: 0,
    followings: 0,
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Avatar
        className={`${
          isCollapsed ? 'h-10 w-10' : 'h-20 w-20'
        } transition-all duration-300 ease-in-out`}
      >
        <AvatarImage src={user.avatarUrl} alt={user.username} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(user.username)}
        </AvatarFallback>
      </Avatar>

      {!isCollapsed && (
        <div className="flex flex-col items-center space-y-1 text-center">
          <h3 className="font-medium leading-none">{user.username}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          {isAuthenticated && (
            <div className="flex gap-4 mt-2">
              <div className="text-center">
                <p className="text-sm font-medium leading-none">
                  {user.followers}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium leading-none">
                  {user.followings}
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
          )}
        </div>
      )}
      {/* {isAuthenticated && ( */}
      <Button
        variant="default"
        size={isCollapsed ? 'icon' : 'default'}
        className={cn(
          'w-full',
          isCollapsed ? 'justify-center' : 'justify-start mt-5'
        )}
        onClick={() => {}}
      >
        <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
        {!isCollapsed && 'Підкинути мемчиків'}
      </Button>
      {/* )} */}
    </div>
  );
}
