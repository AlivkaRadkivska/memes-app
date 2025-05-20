import { EditorObject } from '@/stores/editor-store';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

interface ImageNodeProps {
  object: EditorObject;
  isSelected: boolean;
  onChange: (attrs: EditorObject) => void;
  onSelect?: () => void;
}

export const ImageNode = ({
  object,
  isSelected,
  onChange,
  onSelect,
}: ImageNodeProps) => {
  const { x, y, width, height, src } = object;
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [image] = useImage(src as string);

  useEffect(() => {
    if (isSelected && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        alt={image}
        ref={shapeRef}
        image={image}
        x={x}
        y={y}
        width={width}
        height={height}
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
          if (!shapeRef.current) return;

          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...object,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};
