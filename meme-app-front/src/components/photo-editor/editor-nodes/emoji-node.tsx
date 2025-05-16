import { EditorObject } from '@/stores/editor-store';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';

interface EmojiNodeProps {
  object: EditorObject;
  isSelected: boolean;
  onChange: (attrs: any) => void;
  onSelect?: () => void;
}

export const EmojiNode = ({
  object,
  isSelected,
  onChange,
  onSelect,
}: EmojiNodeProps) => {
  const { x, y, text, fontSize } = object;
  const emojiRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && emojiRef.current && trRef.current) {
      trRef.current.nodes([emojiRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={emojiRef}
        x={x}
        y={y}
        text={text as string}
        fontSize={fontSize as number}
        draggable={object.draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...object,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          if (!emojiRef.current) return;

          const node = emojiRef.current;
          const scaleX = node.scaleX();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...object,
            x: node.x(),
            y: node.y(),
            fontSize: (fontSize as number) * scaleX,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
