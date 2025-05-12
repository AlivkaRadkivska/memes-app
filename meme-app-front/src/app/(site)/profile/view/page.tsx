'use client';

import { useAuth } from '@/contexts/auth-context';

export default function AdminPage() {
  const { user } = useAuth();

  return <p>Хальо, {user?.fullName || user?.username}</p>;
}
