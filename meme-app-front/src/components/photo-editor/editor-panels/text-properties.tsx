'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TextAlign, useEditorStore } from '@/stores/editor-store';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function TextProperties() {
  const {
    mode,
    addObject,
    textOptions,
    setTextOptions,
    selectedObjectId,
    objects,
    updateObject,
    canvasWidth,
    canvasHeight,
  } = useEditorStore();

  const [text, setText] = useState('Add text here');

  const selectedObject = selectedObjectId
    ? objects.find((obj) => obj.id === selectedObjectId && obj.type === 'text')
    : null;

  const handleFontSizeChange = (value: number[]) => {
    const newFontSize = value[0];

    if (selectedObject) {
      updateObject(selectedObject.id, { fontSize: newFontSize });
    } else {
      setTextOptions({ fontSize: newFontSize });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    if (selectedObject) {
      updateObject(selectedObject.id, { fill: newColor });
    } else {
      setTextOptions({ fill: newColor });
    }
  };

  const handleAlignChange = (align: TextAlign) => {
    if (selectedObject) {
      updateObject(selectedObject.id, { align });
    } else {
      setTextOptions({ align });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);

    if (selectedObject) {
      updateObject(selectedObject.id, { text: newText });
    }
  };

  const handleAddText = () => {
    addObject({
      id: uuidv4(),
      type: 'text',
      text: text,
      x: canvasWidth / 2 - 50,
      y: canvasHeight / 2 - 10,
      fontSize: textOptions.fontSize,
      fontFamily: textOptions.fontFamily,
      fill: textOptions.fill,
      align: textOptions.align,
      draggable: true,
    });
  };

  const displayValue = selectedObject?.text || text;
  const displayFontSize = selectedObject?.fontSize || textOptions.fontSize;
  const displayColor = selectedObject?.fill || textOptions.fill;
  const displayAlign = selectedObject?.align || textOptions.align;

  return (
    <div className="p-4 space-y-4">
      {mode === 'text' && !selectedObject && (
        <div className="pb-4">
          <h3 className="font-medium mb-2">Add New Text</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="textContent">Text Content</Label>
              <Input
                id="textContent"
                value={displayValue as string}
                onChange={handleTextChange}
                className="mt-1"
              />
            </div>
            <Button onClick={handleAddText} className="w-full mt-2">
              Add Text
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label>Font Size: {displayFontSize as number}px</Label>
          <Slider
            min={8}
            max={72}
            step={1}
            value={[Number(displayFontSize) || 0]}
            onValueChange={handleFontSizeChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="textColor">Color</Label>
          <div className="flex gap-2 mt-1">
            <div className="border rounded w-10 h-10 overflow-hidden">
              <input
                type="color"
                id="textColor"
                value={displayColor as string}
                onChange={handleColorChange}
                className="w-12 h-12 transform translate-x-[-2px] translate-y-[-2px] cursor-pointer"
              />
            </div>
            <Input
              value={displayColor as string}
              onChange={handleColorChange}
              className="flex-1"
            />
          </div>
        </div>

        {selectedObject && (
          <div>
            <Label htmlFor="textContent">Text Content</Label>
            <Input
              id="textContent"
              value={displayValue as string}
              onChange={handleTextChange}
              className="mt-1"
            />
          </div>
        )}

        <div>
          <Label className="mb-2 block">Text Alignment</Label>
          <div className="flex gap-2">
            <Button
              variant={displayAlign === 'left' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAlignChange('left')}
              className="flex-1"
            >
              <AlignLeft size={16} />
            </Button>
            <Button
              variant={displayAlign === 'center' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAlignChange('center')}
              className="flex-1"
            >
              <AlignCenter size={16} />
            </Button>
            <Button
              variant={displayAlign === 'right' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAlignChange('right')}
              className="flex-1"
            >
              <AlignRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
