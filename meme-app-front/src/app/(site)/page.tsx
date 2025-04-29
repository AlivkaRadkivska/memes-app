import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PublicationsContainer } from '@/components/publications/publications-container';

export default function Home() {
  const isAuthorized = true;

  return (
    <div className="px-4 py-0 sm:px-0">
      <div className="mb-4">
        <Button disabled={!isAuthorized} className="w-full sm:w-auto">
          Створити новий пост
        </Button>
      </div>

      <PublicationsContainer />
    </div>
  );
}
