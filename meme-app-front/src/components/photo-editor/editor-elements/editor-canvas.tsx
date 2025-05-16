import { useEditorStore } from '@/stores/editor-store';
import { usePhotoStore } from '@/stores/photo-store';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { notFound } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import { CropLayer } from '../editor-nodes/crop-layer';
import { DrawingLayer } from '../editor-nodes/drawing-layer';
import { EmojiNode } from '../editor-nodes/emoji-node';
import { ImageNode } from '../editor-nodes/image-node';
import { TextNode } from '../editor-nodes/text-node';

const EditorCanvas = ({ photoId }: { photoId: string }) => {
  const { getPhoto, updatePhoto } = usePhotoStore();
  const {
    mode,
    objects,
    selectedObjectId,
    setSelectedObjectId,
    updateObject,
    isCropping,
    cropConfig,
    setCropConfig,
    setCanvasSize,
    addHistory,
  } = useEditorStore();

  const photo = getPhoto(photoId);
  const stageRef = useRef<Konva.Stage>(null);
  const mainImageRef = useRef<Konva.Image>(null);
  const [stageSize, setStageSize] = useState({
    width: photo?.width,
    height: photo?.height,
  });

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('main');
      if (!container || !photo) return;

      const maxWidth = container.clientWidth - 360;
      const maxHeight = window.innerHeight - 160;

      const aspectRatio = photo.width / photo.height;

      let newWidth = photo.width;
      let newHeight = photo.height;

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      setStageSize({
        width: newWidth,
        height: newHeight,
      });

      setCanvasSize(newWidth, newHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [photo, setCanvasSize]);

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setSelectedObjectId(null);
    }
  };

  const applyCrop = () => {
    if (!cropConfig || !photo || !mainImageRef.current) return;

    const imageNode = mainImageRef.current;
    const stage = stageRef.current;
    if (!stage) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const originalImage = new Image();
    originalImage.src = photo.preview;

    originalImage.onload = () => {
      const scaleX = originalImage.width / imageNode.width();
      const scaleY = originalImage.height / imageNode.height();

      const cropX = (cropConfig.x - imageNode.x()) * scaleX;
      const cropY = (cropConfig.y - imageNode.y()) * scaleY;
      const cropWidth = cropConfig.width * scaleX;
      const cropHeight = cropConfig.height * scaleY;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      context.drawImage(
        originalImage,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const croppedImage = canvas.toDataURL();

      updatePhoto(photoId, croppedImage);
      setCropConfig(null);
      addHistory();

      setCanvasSize(cropWidth, cropHeight);
    };
  };

  useEffect(() => {
    if (isCropping === false && cropConfig && mode !== 'crop') {
      applyCrop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCropping, cropConfig, mode]);

  if (!photo) return notFound();

  return (
    <Stage
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      onClick={handleStageClick}
      onTap={handleStageClick}
    >
      <Layer>
        <ImageNode
          object={{
            id: 'main-image',
            type: 'image',
            x: 0,
            y: 0,
            width: stageSize.width,
            height: stageSize.height,
            src: photo.preview,
            draggable: false,
          }}
          isSelected={selectedObjectId === 'main-image'}
          onChange={() => {}}
          onSelect={() => {
            setSelectedObjectId(null);
          }}
          ref={mainImageRef}
        />

        {objects.map((obj) => {
          const isSelected = selectedObjectId === obj.id;

          const handleSelect = () => {
            setSelectedObjectId(obj.id);
          };

          const handleChange = (newAttrs: any) => {
            updateObject(obj.id, newAttrs);
          };

          switch (obj.type) {
            case 'text':
              return (
                <TextNode
                  key={obj.id}
                  object={obj}
                  isSelected={isSelected}
                  onChange={handleChange}
                  onSelect={handleSelect}
                />
              );
            case 'emoji':
              return (
                <EmojiNode
                  key={obj.id}
                  object={obj}
                  isSelected={isSelected}
                  onChange={handleChange}
                  onSelect={handleSelect}
                />
              );
            case 'image':
              return (
                <ImageNode
                  key={obj.id}
                  object={obj}
                  isSelected={isSelected}
                  onChange={handleChange}
                  onSelect={handleSelect}
                />
              );
            case 'drawing':
              return (
                <Line
                  key={obj.id}
                  points={obj.points}
                  stroke={obj.stroke}
                  strokeWidth={obj.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            default:
              return null;
          }
        })}

        {isCropping && mainImageRef.current && (
          <CropLayer imageNode={mainImageRef.current} />
        )}
      </Layer>

      <DrawingLayer />
    </Stage>
  );
};

export default EditorCanvas;
