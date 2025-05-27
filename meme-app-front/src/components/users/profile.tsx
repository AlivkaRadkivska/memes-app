'use client';

import { useAuth } from '@/contexts/auth-context';
import { notFound } from 'next/navigation';
import { ProfileHeader } from './profile-header';
import { PublicationGrid } from './profile-publications';

export default function Profile() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading</p>;

  if (!user) return notFound();

  return (
    <div className="flex-1 flex flex-col">
      <ProfileHeader user={user} me />
      <PublicationGrid userId={user.id} me />
    </div>
  );
}
