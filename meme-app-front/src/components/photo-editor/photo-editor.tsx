'use client';

import { ActionsBar } from '@/components/photo-editor/editor-elements/actions-bar';
import EditorCanvas from '@/components/photo-editor/editor-elements/editor-canvas';
import { Sidebar } from '@/components/photo-editor/editor-elements/sidebar';
import { Toolbar } from '@/components/photo-editor/editor-elements/toolbar';
import { useEditorStore } from '@/stores/editor-store';
import { useEffect } from 'react';

export default function PhotoEditor({ id }: { id: string }) {
  const { addHistory } = useEditorStore();

  useEffect(() => {
    addHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ActionsBar photoId={id} />

      <div className="flex flex-col md:flex-row flex-1 px-4 py-0 sm:px-0 flex-wrap">
        <Toolbar />
        <main className="flex flex-1 relative items-center justify-center">
          <EditorCanvas photoId={id} />
        </main>
        <Sidebar />
      </div>
    </>
  );
}
