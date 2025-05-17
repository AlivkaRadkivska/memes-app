'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEditorStore } from '@/stores/editor-store';
import { X } from 'lucide-react';

export function CropPanel() {
  const { isCropping, setIsCropping, cropConfig, setCropConfig, setMode } =
    useEditorStore();

  // const handleApplyCrop = () => {
  //   setIsCropping(false);
  //   setCropConfig(null);
  //   setMode('select');
  //   addHistory();
  // };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setCropConfig(null);
    setMode('select');
  };

  const startCropping = () => {
    setIsCropping(true);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-medium mb-2">Crop Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Adjust the crop area by dragging the corners of the selection
          rectangle.
        </p>
      </div>

      {!isCropping ? (
        <Button onClick={startCropping} className="w-full">
          Start Cropping
        </Button>
      ) : (
        <div className="space-y-4">
          {cropConfig && (
            <div className="space-y-2">
              <Label>Crop Dimensions</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-secondary p-2 rounded-md">
                  <span className="text-muted-foreground">Width:</span>{' '}
                  {Math.round(cropConfig.width)}px
                </div>
                <div className="bg-secondary p-2 rounded-md">
                  <span className="text-muted-foreground">Height:</span>{' '}
                  {Math.round(cropConfig.height)}px
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelCrop}
              className="flex-1 gap-1"
            >
              <X size={16} />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
