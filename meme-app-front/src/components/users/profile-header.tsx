'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { User } from '@/server/types/user';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { LogOut, Pen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProfileHeaderProps {
  user: User;
  me?: boolean;
}

export function ProfileHeader({ user, me = false }: ProfileHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="w-full bg-background">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="flex gap-6 items-start">
          <div className="relative">
            <Avatar className="h-32 w-32 rounded-full border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>Ніц</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 gap-2">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center text-muted-foreground">
                  <h1 className="text-2xl font-bold">@{user.username}</h1>
                  {user.fullName && (
                    <>
                      <span className="mx-2">•</span>
                      <Badge variant="outline" className="text-lg">
                        {user.fullName}
                      </Badge>
                    </>
                  )}
                </div>
                <span>{user.email}</span>
                {user.birthday && (
                  <span>{format(user.birthday, 'PPP', { locale: uk })}</span>
                )}
                {user.signature && (
                  <p className="text-foreground mb-3">{user.signature}</p>
                )}

                <div className="flex gap-4 items-center text-sm">
                  <div className="flex gap-1">
                    <span className="font-semibold">
                      {user.followerCount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">Підписники</span>
                  </div>

                  <div className="flex gap-1">
                    <span className="font-semibold">
                      {user.followingCount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">Підписки</span>
                  </div>

                  <div className="flex gap-1">
                    <span className="font-semibold">
                      {user.publicationCount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">Постів</span>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="default"
                  onClick={() => router.push('/gallery')}
                  className="w-max"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Підкинути мемчиків
                </Button>
              </div>

              {me ? (
                <div className="flex flex-col gap-3">
                  <Button variant="secondary" size="default" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Вийти з аку
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => router.push('/my-profile/edit')}
                  >
                    <Pen className="h-4 w-4 mr-2" />
                    Змінити інфо
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? 'outline' : 'default'}
                  size="sm"
                >
                  {isFollowing ? 'Відписатися' : 'Підписатися'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
