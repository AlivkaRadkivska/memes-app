'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MiniUser } from '@/server/types/user';
import { useRouter } from 'next/navigation';

interface FollowerItemProps {
  user: MiniUser;
}

export function FollowerItem({ user }: FollowerItemProps) {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-between p-3 transition-all duration-200 cursor-pointer border-b border-muted-foreground"
      onClick={() => router.push(`/profile/${user.email}`)}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.avatar || ''}
            alt={user.username}
            className="object-cover"
          />
          <AvatarFallback className="dark:text-white text-black">
            Ніц
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="font-medium text-sm">{user.username}</span>
            {user.fullName && (
              <>
                <span className="text-xs text-muted">•</span>
                <span className="text-sm text-muted truncate max-w-[150px]">
                  {user.fullName}
                </span>
              </>
            )}
          </div>
          <span className="text-xs truncate max-w-[200px]">{user.email}</span>
        </div>
      </div>
    </div>
  );
}
