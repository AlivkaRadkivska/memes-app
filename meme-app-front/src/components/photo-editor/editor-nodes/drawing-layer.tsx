import { useEditorStore } from '@/stores/editor-store';
import { useEffect, useRef, useState } from 'react';
import { Layer, Line } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';

export const DrawingLayer = () => {
  const { mode, addObject } = useEditorStore();
  const isDrawing = useRef(false);
  const [lines, setLines] = useState<any[]>([]);
  const [currentLine, setCurrentLine] = useState<any>(null);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState<string>('#000000');

  useEffect(() => {
    if (mode !== 'draw') {
      isDrawing.current = false;
      setCurrentLine(null);
    }
  }, [mode]);

  useEffect(() => {
    const widthElement = document.getElementById('drawing-width');
    const colorElement = document.getElementById('drawing-color');

    if (widthElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-width'
          ) {
            const width = parseInt(
              widthElement.getAttribute('data-width') || '5'
            );
            setStrokeWidth(width);
          }
        });
      });
      observer.observe(widthElement, { attributes: true });
    }

    if (colorElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-color'
          ) {
            const color = colorElement.getAttribute('data-color') || '#000000';
            setStrokeColor(color);
          }
        });
      });
      observer.observe(colorElement, { attributes: true });
    }

    return () => {
      if (widthElement) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        widthElement?._observer?.disconnect();
      }
      if (colorElement) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        colorElement?._observer?.disconnect();
      }
    };
  }, []);

  const handleMouseDown = (e: any) => {
    if (mode !== 'draw') return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine({
      id: uuidv4(),
      points: [pos.x, pos.y],
      strokeWidth,
      stroke: strokeColor,
      lineCap: 'round',
      lineJoin: 'round',
    });
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || !currentLine) return;

    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, pos.x, pos.y],
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current || !currentLine) return;

    isDrawing.current = false;
    setLines([...lines, currentLine]);

    addObject({
      id: currentLine.id,
      type: 'drawing',
      x: 0,
      y: 0,
      points: currentLine.points,
      stroke: currentLine.stroke,
      strokeWidth: currentLine.strokeWidth,
    });

    setCurrentLine(null);
  };

  if (mode !== 'draw') return null;

  return (
    <Layer
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {currentLine && <Line {...currentLine} />}
    </Layer>
  );
};
