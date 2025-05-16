import { useEditorStore } from '@/stores/editor-store';
import { CircleX, Redo2, Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../ui/button';
import { ExportButton } from './export-button';

interface ActionsBarProps {
  photoId: string;
}

export function ActionsBar({ photoId }: ActionsBarProps) {
  const { undo, redo, history, currentHistoryIndex } = useEditorStore();
  const router = useRouter();

  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;

  return (
    <div className="h-14 flex items-center gap-2 px-4 border-b">
      <Button variant="outline" onClick={() => router.push('/editor')}>
        <CircleX size={16} />
        Нє, вернутись
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={undo}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo2 size={16} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={redo}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo2 size={16} />
      </Button>
      <div className="flex gap-2 ml-auto">
        <ExportButton photoId={photoId} />
        <Button onClick={() => router.push('/editor')} size="sm">
          Далі
        </Button>
      </div>
    </div>
  );
}
