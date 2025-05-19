'use client';

import { PhotoGallery } from '@/components/photos/photo-gallery';
import { Button } from '@/components/ui/button';
import useGenerateImage from '@/server/hooks/publications/use-generate-image';
import { Photo, usePhotoStore } from '@/stores/photo-store';
import { Bot, ImagePlus, LoaderCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Input } from '../ui/input';

export default function UploadPhotos() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotos, photos } = usePhotoStore();
  const noPhotos = !photos || photos.length < 1;

  const [prompt, setPrompt] = useState('');
  const { generateImage, isLoading } = useGenerateImage();

  const isLimitReached = photos.length >= 8;

  const handleGenerateImage = () => {
    generateImage(prompt);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos: Photo[] = Array.from(e.target.files).map((file) => {
        return {
          id: uuid(),
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          width: 0,
          height: 0,
          edited: false,
          ai: false,
        };
      });

      addPhotos(newPhotos);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full">
      <div className="border-none shadow-sm">
        <div className="w-full pb-2">
          <div className="w-full gap-2 flex items-start justify-between">
            <h1 className="text-3xl font-bold">Меми для публікації</h1>
            <Button
              onClick={!isLimitReached ? handleUpload : undefined}
              disabled={isLimitReached}
            >
              <ImagePlus className="w-8 h-8" />
              Завантажити своє
            </Button>
          </div>
          {photos.length > 8 ? (
            <p className="text-destructive">
              Можна публікувати максимум 8 зображень, тому деякі треба видалити
            </p>
          ) : (
            <p className="text-muted-foreground">Давай сюди, але не більше 8</p>
          )}
        </div>
        <div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
          </div>
        </div>
      </div>

      {!noPhotos && <PhotoGallery />}
      {noPhotos && (
        <div className="w-full flex flex-col items-center justify-center py-12">
          {noPhotos && (
            <div className="text-lg text-muted-foreground">
              <p className="ml-8">мають бути ваші меми</p>
              <p>
                Тут <span className="line-through">може бути ваша реклама</span>
                ...
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center py-6 bg-muted/30 rounded-lg border border-dashed mt-auto">
        <div className="gap-1 p-2 w-full flex flex-col items-center justify-center">
          {isLoading ? (
            <LoaderCircle className="w-12 h-12 text-muted-foreground mb-3 animate-spin duration-1000" />
          ) : (
            <Bot className="w-12 h-12 text-muted-foreground mb-3" />
          )}
          <p className="text-xl font-medium">
            Додати зображення згенероване Ai
          </p>
          <p className="text-muted-foreground mb-2">Gemini, якщо точніше</p>
          <div className="w-full flex gap-2 justify-center items-center mt-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading || isLimitReached}
              placeholder="Опишіть бажане зображення..."
              className="max-w-96"
            />
            <Button
              onClick={!isLimitReached ? handleGenerateImage : undefined}
              disabled={isLoading || isLimitReached}
            >
              Згенерувати
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
