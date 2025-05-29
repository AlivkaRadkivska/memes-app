'use client';

import { Button } from '@/components/ui/button';
import {
  PublicationFormData,
  publicationFormSchema,
} from '@/helpers/schemas/publication.schema';
import usePublishMemes from '@/server/hooks/publications/use-publish-memes';
import { Photo, usePhotoStore } from '@/stores/photo-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import AiImageForm from './ai-image-form';
import { Gallery } from './gallery';
import { PublicationDetailsForm } from './publication-details-form';

export default function PublishMemes() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotos, photos } = usePhotoStore();
  const { publish, isPublishing } = usePublishMemes();

  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      description: '',
      keywords: [],
      status: 'active',
    },
  });

  async function onSubmit(data: PublicationFormData) {
    publish({ ...data, pictures: photos.map((photo) => photo.file) });
  }

  const noPhotos = !photos || photos.length < 1;
  const isLimitReached = photos.length >= 8;

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
    <div className="flex flex-col max-w-7xl mx-auto space-y-8 h-full">
      <div className="border-none shadow-sm">
        <div className="w-full pb-2 flex-1">
          <div className="w-full gap-2 flex items-start justify-between">
            <h1 className="text-3xl font-bold">Меми для публікації</h1>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                onClick={!isLimitReached ? handleUpload : undefined}
                disabled={isLimitReached || isPublishing}
              >
                <ImagePlus className="w-8 h-8" />
                Завантажити своє
              </Button>
              {!noPhotos && (
                <Button
                  variant="secondary"
                  onClick={
                    !isLimitReached || isPublishing
                      ? form.handleSubmit(onSubmit)
                      : undefined
                  }
                  disabled={isPublishing}
                >
                  Додати собі меми
                </Button>
              )}
            </div>
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

      {!noPhotos && (
        <>
          <PublicationDetailsForm
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            isDisabled={isLimitReached || isPublishing}
          />
          <Gallery />
        </>
      )}

      {noPhotos && (
        <div className="w-full flex flex-col items-center justify-center py-12 flex-1">
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

      <AiImageForm isDisabled={isLimitReached} />
    </div>
  );
}
