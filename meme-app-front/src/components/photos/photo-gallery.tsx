'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePhotoStore } from '@/stores/photo-store';
import { Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useEditorStore } from '@/stores/editor-store';

export function PhotoGallery() {
  const router = useRouter();
  const { photos, removePhoto } = usePhotoStore();
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
  const { addObject } = useEditorStore();

  const handleEditClick = (id: string) => {
    addObject({
      id: 'main-image',
      type: 'image',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      src: '',
      draggable: true,
    });

    router.push(`/editor/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setDeletePhotoId(id);
  };

  const confirmDelete = () => {
    if (deletePhotoId) {
      removePhoto(deletePhotoId);
      setDeletePhotoId(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
            <CardContent className="w-full p-0 relative aspect-square h-64">
              <div className="relative w-full h-full min-h-52">
                <Image
                  src={photo.preview}
                  alt={photo.name}
                  fill
                  style={{
                    objectFit: 'cover',
                    minHeight: '200px',
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditClick(photo.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 size={14} />
                    Редагувати
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(photo.id)}
                    className="absolute flex items-center gap-1 top-1 right-1"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                <p className="text-sm truncate">{photo.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!deletePhotoId}
        onOpenChange={(open) => !open && setDeletePhotoId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Точно видалити?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Нє</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Так
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
