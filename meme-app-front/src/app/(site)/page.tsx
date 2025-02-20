import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PublicationsContainer } from '@/components/publications/publications-container';

export default function Home() {
  const isAuthorized = true;

  const posts = [
    { id: 1, content: 'This is the first post!' },
    { id: 2, content: 'Another post here.' },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-4">
        <Button disabled={!isAuthorized} className="w-full sm:w-auto">
          Create New Post
        </Button>
      </div>

      <PublicationsContainer />
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg">
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
