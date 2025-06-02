'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import useFollow from '@/server/hooks/follows/use-follow';
import useGetFollowers from '@/server/hooks/follows/use-get-followers';
import useGetFollowings from '@/server/hooks/follows/use-get-followings';
import { User } from '@/server/types/user';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { LogOut, PawPrint, Pen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FollowModal } from '../follows/follow-modal';

interface ProfileHeaderProps {
  user: User;
  me?: boolean;
}

export function ProfileHeader({ user, me = false }: ProfileHeaderProps) {
  const {
    avatar,
    username,
    fullName,
    signature,
    email,
    birthday,
    followerCount,
    followingCount,
    publicationCount,
    isFollowing,
  } = user;

  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const { follow, isPending: isPendingFollow } = useFollow(user);
  const { followers } = useGetFollowers(user.id);
  const { followings } = useGetFollowings(user.id);

  const handleFollow = () => {
    follow({ followingId: user.id, isFollowed: user.isFollowing });
  };

  return (
    <div className="w-full bg-background">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="flex h-full gap-6 items-start flex-wrap justify-center md:justify-start md:flex-nowrap">
          <div className="relative">
            <Avatar className="h-32 w-32 rounded-full border-4 border-background">
              <AvatarImage
                src={avatar}
                alt={username}
                className="object-cover"
              />
              <AvatarFallback>Ніц</AvatarFallback>
            </Avatar>
          </div>

          <div className="h-full w-full flex justify-between gap-4 flex-wrap md:flex-nowrap">
            <div className="flex flex-col gap-3 h-full justify-between">
              <div className="flex items-center text-muted-foreground">
                <h1 className="text-lg md:text-2xl font-bold">@{username}</h1>
                {fullName && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="text-md md:text-lg">
                      {fullName}
                    </Badge>
                  </>
                )}
                {isFollowing && <PawPrint size={25} className="ml-1 -mt-7" />}
              </div>

              <span>{email}</span>

              {birthday && (
                <span>
                  <span className="text-muted-foreground">
                    Поява на цей світ:
                  </span>{' '}
                  {format(birthday, 'PPP', { locale: uk })}
                </span>
              )}

              <div className="flex gap-4 items-center mt-auto text-sm">
                <FollowModal
                  follows={followers || []}
                  trigger={
                    <Button variant="link" className="flex gap-1">
                      <span className="font-semibold">
                        {followerCount.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">Підписники</span>
                    </Button>
                  }
                />

                <FollowModal
                  follows={followings || []}
                  title="Підписки"
                  trigger={
                    <Button variant="link" className="flex gap-1">
                      <span className="font-semibold">
                        {followingCount.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">Підписки</span>
                    </Button>
                  }
                />

                <div className="flex gap-1">
                  <span className="font-semibold">
                    {publicationCount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">Постів</span>
                </div>
              </div>

              <p className="text-foreground italic">{signature || ''}</p>
            </div>

            <div className="flex flex-col gap-3 w-full md:max-w-max">
              {me ? (
                <>
                  <Button
                    variant="secondary"
                    size="default"
                    onClick={logout}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Вийти з аку
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => router.push('/my-profile/update')}
                    className="w-full"
                  >
                    <Pen className="h-4 w-4 mr-2" />
                    Змінити інфо
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => router.push('/gallery')}
                    className="w-full md:w-max"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Підкинути мемчиків
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleFollow}
                  disabled={isPendingFollow || !isAuthenticated}
                  variant={isFollowing ? 'outline' : 'default'}
                  className="w-full"
                >
                  {!isFollowing && <PawPrint />}
                  {isFollowing ? 'Відписатися' : 'Підписатися'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* <div className="w-full mt-3 flex align-baseline justify-between flex-col md:flex-row"></div> */}
      </div>
      <Separator />
    </div>
  );
}
