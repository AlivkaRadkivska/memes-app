'use client';

import { useAuth } from '@/contexts/auth-context';
import useGetUser from '@/server/hooks/users/use-get-user';
import { notFound, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProfileHeader } from './profile-header';
import { PublicationGrid } from './profile-publications';

export default function Profile({ email }: { email: string }) {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { user, isInitialFetching } = useGetUser(email);

  useEffect(() => {
    if (isAuthenticated && user && currentUser && user.id === currentUser.id)
      router.push('/my-profile');
  }, [currentUser, isAuthenticated, router, user]);

  if (isInitialFetching) return <p>Loading</p>;

  if (!user) return notFound();

  return (
    <div className="flex-1 flex flex-col">
      <ProfileHeader user={user} />
      <PublicationGrid userId={user.id} />
    </div>
  );
}
