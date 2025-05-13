'use client';

import { PhotoGallery } from '@/components/photos/photo-gallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { usePhotoStore } from '@/stores/photo-store';
import { PlusCircle } from 'lucide-react';
import { useRef } from 'react';
import { v4 as uuid } from 'uuid';

export default function UploadPhotos() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotos, photos } = usePhotoStore();
  const noPhotos = !photos || photos.length < 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map((file) => {
        return {
          id: uuid(),
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        };
      });

      addPhotos(newPhotos);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <h1 className="text-3xl font-bold">Почати створення публікації</h1>
          <p className="text-muted-foreground">Сюди, сюди</p>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {!noPhotos && <PhotoGallery />}
      <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg border border-dashed">
        <PlusCircle className="h-12 w-12 text-muted-foreground mb-3" />
        <h2 className="text-xl font-medium mb-1">
          {noPhotos ? 'Ще нічого не додано' : 'Додати ще'}
        </h2>
        {noPhotos && (
          <p className="text-muted-foreground">
            Завантажте меми, щоб продовжити
          </p>
        )}
        <Button className="mt-4" onClick={handleUploadClick}>
          Завантажити сюди
        </Button>
      </div>
    </div>
  );
}
