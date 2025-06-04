'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/stores/editor-store';
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

  return (
    <div className="p-4 space-y-4">
      {mode === 'text' && !selectedObject && (
        <div className="pb-4">
          <h3 className="font-medium mb-2">Текст</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="textContent">Текст</Label>
              <Input
                id="textContent"
                value={displayValue as string}
                onChange={handleTextChange}
                className="mt-1"
              />
            </div>
            <Button onClick={handleAddText} className="w-full mt-2">
              Додати текст
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label>Розмір шрифту: {displayFontSize as number}px</Label>
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
          <Label htmlFor="textColor">Коліп</Label>
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
            <Label htmlFor="textContent">Вміст тексту</Label>
            <Input
              id="textContent"
              value={displayValue as string}
              onChange={handleTextChange}
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}
