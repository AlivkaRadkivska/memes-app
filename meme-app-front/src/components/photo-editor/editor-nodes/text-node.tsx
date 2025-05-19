import { EditorObject } from '@/stores/editor-store';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';

interface TextNodeProps {
  object: EditorObject;
  isSelected: boolean;
  onChange: (attrs: EditorObject) => void;
  onSelect?: () => void;
}

export const TextNode = ({
  object,
  isSelected,
  onChange,
  onSelect,
}: TextNodeProps) => {
  const { x, y, text, fontSize, fontFamily, fill, align } = object;
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        x={x}
        y={y}
        text={text as string}
        fontSize={fontSize as number}
        fontFamily={fontFamily as string}
        fill={fill as string}
        align={align as string}
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
          if (!textRef.current) return;

          const node = textRef.current;
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
          enabledAnchors={['middle-left', 'middle-right']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};
