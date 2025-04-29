'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return <p>Redirecting...</p>;
}
