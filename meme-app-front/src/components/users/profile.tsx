'use client';

import useGetUser from '@/server/hooks/users/use-get-user';
import { notFound } from 'next/navigation';
import { ProfileHeader } from './profile-header';
import { PublicationGrid } from './profile-publications';

export default function Profile({ email }: { email: string }) {
  const { user, isInitialFetching } = useGetUser(email);

  if (isInitialFetching) return <p>Loading</p>;

  if (!user) return notFound();

  return (
    <div className="flex-1 flex flex-col">
      <ProfileHeader user={user} />
      <PublicationGrid userId={user.id} />
    </div>
  );
}
