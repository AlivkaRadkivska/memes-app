'use client';

import PhotoEditor from '@/components/photo-editor/photo-editor';
import { use } from 'react';

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const id = use(params).id;

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col">
      <PhotoEditor id={id} />
    </div>
  );
}
