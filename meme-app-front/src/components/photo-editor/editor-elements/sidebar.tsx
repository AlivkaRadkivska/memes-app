import { useEditorStore } from '@/stores/editor-store';
import { Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { CropPanel } from '../editor-panels/crop-panel';
import { EmojisPanel } from '../editor-panels/emojis-panel';
import { ImagePanel } from '../editor-panels/image-panel';
import { TextProperties } from '../editor-panels/text-properties';

export function Sidebar() {
  const { mode, selectedObjectId, objects, removeObject, isCropping } =
    useEditorStore();

  const selectedObject = selectedObjectId
    ? objects.find((obj) => obj.id === selectedObjectId)
    : null;

  const renderPanel = () => {
    if (mode === 'crop' || isCropping) {
      return <CropPanel />;
    }

    if (mode === 'text') {
      return <TextProperties />;
    }

    if (mode === 'emoji') {
      return <EmojisPanel />;
    }

    if (mode === 'image') {
      return <ImagePanel />;
    }

    if (selectedObject) {
      if (selectedObject.type === 'text') {
        return <TextProperties />;
      }
    }

    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Select a tool or an object to edit its properties</p>
      </div>
    );
  };

  return (
    <div className="w-64 border-l bg-card flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Properties</h3>
      </div>

      <div className="overflow-y-auto">{renderPanel()}</div>

      {selectedObjectId && selectedObjectId != 'main-image' && (
        <div className="border-t p-4 mt-auto">
          <Button
            variant="destructive"
            onClick={() => removeObject(selectedObjectId)}
            className="w-full flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete Object
          </Button>
        </div>
      )}
    </div>
  );
}
