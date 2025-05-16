import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';

export function DrawingPanel() {
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState('#000000');

  // Update the DOM with drawing options
  useEffect(() => {
    const widthElement =
      document.getElementById('drawing-width') || document.createElement('div');
    widthElement.id = 'drawing-width';
    widthElement.setAttribute('data-width', strokeWidth.toString());

    const colorElement =
      document.getElementById('drawing-color') || document.createElement('div');
    colorElement.id = 'drawing-color';
    colorElement.setAttribute('data-color', strokeColor);

    if (!document.getElementById('drawing-width')) {
      document.body.appendChild(widthElement);
    }

    if (!document.getElementById('drawing-color')) {
      document.body.appendChild(colorElement);
    }
  }, [strokeWidth, strokeColor]);

  const handleSizeChange = (value: number[]) => {
    setStrokeWidth(value[0]);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(e.target.value);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-medium mb-1">Drawing Tool</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click and drag to draw on the canvas
        </p>
      </div>

      <div>
        <Label>Brush Size: {strokeWidth}px</Label>
        <Slider
          min={1}
          max={30}
          step={1}
          value={[strokeWidth]}
          onValueChange={handleSizeChange}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="strokeColor">Brush Color</Label>
        <div className="flex gap-2 mt-1">
          <div className="border rounded w-10 h-10 overflow-hidden">
            <input
              type="color"
              id="strokeColor"
              value={strokeColor}
              onChange={handleColorChange}
              className="w-12 h-12 transform translate-x-[-2px] translate-y-[-2px] cursor-pointer"
            />
          </div>
          <div className="flex-1 bg-secondary rounded-md flex items-center justify-center">
            {strokeColor}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          Draw directly on the canvas. Use the color picker and size slider to
          customize your brush.
        </p>
      </div>
    </div>
  );
}
