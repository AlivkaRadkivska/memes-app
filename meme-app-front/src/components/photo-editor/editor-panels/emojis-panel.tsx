'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { useEditorStore } from '@/stores/editor-store';

// Common emojis for demo purposes
const commonEmojis = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😎',
  '😍',
  '😘',
  '😗',
  '😙',
  '😚',
  '🙂',
  '🤗',
  '🤔',
  '🫡',
  '🤨',
  '😐',
  '😑',
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '🤍',
  '👍',
  '👎',
  '👏',
  '🙌',
  '👐',
  '🤲',
  '🤝',
  '🙏',
  '✌️',
  '🤘',
  '👈',
  '👉',
  '👆',
  '👇',
  '👋',
  '🎉',
  '🎊',
  '🎈',
  '🎂',
  '🎁',
  '🎄',
  '🎃',
];

export function EmojisPanel() {
  const { addObject, canvasWidth, canvasHeight } = useEditorStore();
  const [emojiSize, setEmojiSize] = useState(50);

  const handleAddEmoji = (emoji: string) => {
    addObject({
      id: uuidv4(),
      type: 'emoji',
      text: emoji,
      x: canvasWidth / 2 - 25,
      y: canvasHeight / 2 - 25,
      fontSize: emojiSize,
      draggable: true,
    });
  };

  const handleSizeChange = (value: number[]) => {
    setEmojiSize(value[0]);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-medium mb-1">Додати емоджі</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Тицьніть на емоджі, щоб додати
        </p>
      </div>

      <div>
        <Label>Розмір: {emojiSize}px</Label>
        <Slider
          min={20}
          max={120}
          step={1}
          value={[emojiSize]}
          onValueChange={handleSizeChange}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-5 gap-3 max-h-[calc(100vh-420px)] overflow-y-auto overflow-x-hidden p-3">
        {commonEmojis.map((emoji, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-10 text-lg hover:bg-secondary"
            onClick={() => handleAddEmoji(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </div>
  );
}
