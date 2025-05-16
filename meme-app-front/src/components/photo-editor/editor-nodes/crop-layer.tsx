import { useEditorStore } from '@/stores/editor-store';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';

export const CropLayer = ({ imageNode }: { imageNode: Konva.Node }) => {
  const { cropConfig, setCropConfig, isCropping } = useEditorStore();
  const cropRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!isCropping || !imageNode) return;

    if (!cropConfig) {
      const { x, y, width, height } = imageNode.getClientRect();
      setCropConfig({
        x: x + 5,
        y: y + 5,
        width: width - 10,
        height: height - 10,
      });
    }
  }, [isCropping, imageNode, cropConfig, setCropConfig]);

  useEffect(() => {
    if (!cropRef.current || !transformerRef.current) return;

    transformerRef.current.nodes([cropRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [cropConfig]);

  if (!isCropping || !cropConfig) return null;

  return (
    <>
      <Rect
        ref={cropRef}
        x={cropConfig.x}
        y={cropConfig.y}
        width={cropConfig.width}
        height={cropConfig.height}
        stroke="#ffffff"
        strokeWidth={2}
        dash={[5, 5]}
        draggable
        onDragEnd={(e) => {
          setCropConfig({
            ...cropConfig,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          if (!cropRef.current) return;

          const node = cropRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          setCropConfig({
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });

          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      <Transformer
        ref={transformerRef}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 10 || newBox.height < 10) {
            return oldBox;
          }
          return newBox;
        }}
        rotateEnabled={false}
        enabledAnchors={[
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
        ]}
      />
    </>
  );
};
