import { useEditorStore } from '@/stores/editor-store';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Layer, Rect, Transformer } from 'react-konva';

export const CropLayer = () => {
  const { isCropping, setCanvasSize, canvasWidth, canvasHeight, addHistory } =
    useEditorStore();

  const canvasRectRef = useRef<Konva.Rect>(null);
  const canvasTransformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (canvasTransformerRef.current && canvasRectRef.current) {
      canvasTransformerRef.current.nodes([canvasRectRef.current]);
      canvasTransformerRef.current.getLayer()?.batchDraw();
    }
  }, [canvasWidth, canvasHeight]);

  if (!isCropping) return null;

  if (isCropping)
    return (
      <Layer>
        <Rect
          ref={canvasRectRef}
          x={10}
          y={10}
          width={canvasWidth - 20}
          height={canvasHeight - 20}
          strokeWidth={2}
          draggable={false}
          listening={false}
          name="canvas-boundary"
          onTransformEnd={(e) => {
            const node = e.target;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);
            node.position({ x: 10, y: 10 });

            const newWidth = node.width() * scaleX;
            const newHeight = node.height() * scaleY;

            setCanvasSize(newWidth, newHeight);
            addHistory();
          }}
        />

        <Transformer
          ref={canvasTransformerRef}
          nodes={canvasRectRef.current ? [canvasRectRef.current] : []}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 100 || newBox.height < 100) return oldBox;

            return newBox;
          }}
          rotateEnabled={false}
        />
      </Layer>
    );
};
