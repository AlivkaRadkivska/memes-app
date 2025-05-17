import { EditorObject, useEditorStore } from '@/stores/editor-store';
import { usePhotoStore } from '@/stores/photo-store';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { notFound } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import { EmojiNode } from '../editor-nodes/emoji-node';
import { ImageNode } from '../editor-nodes/image-node';
import { TextNode } from '../editor-nodes/text-node';
import { CropLayer } from '../editor-nodes/crop-layer';

const EditorCanvas = ({ photoId }: { photoId: string }) => {
  const { getPhoto } = usePhotoStore();
  const {
    objects,
    selectedObjectId,
    setSelectedObjectId,
    updateObject,
    setCanvasSize,
    canvasWidth,
    canvasHeight,
  } = useEditorStore();

  const photo = getPhoto(photoId);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (!photo) return;

    const container = document.querySelector('main');
    if (!container) return;

    const mainImage = objects.find((item) => item.id === 'main-image');
    const maxWidth = container.clientWidth - 360;
    const maxHeight = window.innerHeight - 160;

    let newWidth, newHeight, aspectRatio;

    if (!mainImage?.src) {
      aspectRatio = photo.width / photo.height;

      newWidth = photo.width;
      newHeight = photo.height;

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
      updateObject('main-image', {
        width: newWidth,
        height: newHeight,
        src: photo.preview,
      });
    } else {
      newWidth = canvasWidth > maxWidth ? maxWidth : canvasWidth;
      newHeight = canvasHeight > maxHeight ? maxHeight : canvasHeight;
    }

    setCanvasSize(newWidth, newHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasHeight, canvasWidth]);

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setSelectedObjectId(null);
    }
  };

  if (!photo) return notFound();

  return (
    <div className="w-min h-min border-4 border-gray-500 border-dashed">
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {objects.map((obj) => {
            const isSelected = selectedObjectId === obj.id;

            const handleSelect = () => {
              setSelectedObjectId(obj.id);
            };

            const handleChange = (newAttrs: EditorObject) => {
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
              default:
                return null;
            }
          })}
        </Layer>

        <CropLayer />
      </Stage>
    </div>
  );
};

export default EditorCanvas;
