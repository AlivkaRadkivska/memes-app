'use client';

import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor-store';
import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function ImagePanel() {
  const { addObject, canvasWidth, canvasHeight } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const maxWidth = 300;
          const maxHeight = 300;

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }

          if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width = width * ratio;
          }

          addObject({
            id: uuidv4(),
            type: 'image',
            src: event.target?.result as string,
            x: canvasWidth / 2 - width / 2,
            y: canvasHeight / 2 - height / 2,
            width,
            height,
            draggable: true,
          });
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-medium mb-1">Add Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an image to add it as a layer
        </p>
      </div>

      <div className="bg-muted/30 border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
        <ImagePlus className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm text-center text-muted-foreground mb-3">
          Click to upload an image
        </p>
        <Button onClick={handleAddImageClick} variant="outline">
          Select Image
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Supported formats: JPEG, PNG, GIF, WebP
      </p>
    </div>
  );
}
