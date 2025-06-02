'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EditorMode, useEditorStore } from '@/stores/editor-store';
import { Crop, ImagePlus, MousePointer, Smile, Type } from 'lucide-react';

const tools = [
  {
    id: 'select',
    name: 'Select',
    icon: MousePointer,
  },
  {
    id: 'crop',
    name: 'Crop',
    icon: Crop,
  },
  {
    id: 'text',
    name: 'Text',
    icon: Type,
  },
  {
    id: 'image',
    name: 'Add Image',
    icon: ImagePlus,
  },
  {
    id: 'emoji',
    name: 'Emoji',
    icon: Smile,
  },
];

export function Toolbar() {
  const { mode, setMode, setSelectedObjectId } = useEditorStore();

  return (
    <div
      className="w-14 border-r bg-card flex flex-row md:flex-col items-center py-4 gap-2"
      onClick={() => setSelectedObjectId(null)}
    >
      <TooltipProvider delayDuration={300}>
        {tools.map((tool, index) => (
          <div key={tool.id}>
            {index === 1 && <Separator className="my-2 w-8" />}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={mode === tool.id ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setMode(tool.id as EditorMode)}
                  className="rounded-md w-10 h-10"
                >
                  <tool.icon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
}
