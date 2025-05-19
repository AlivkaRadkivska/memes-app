'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEditorStore } from '@/stores/editor-store';
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
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '../ui/dialog';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function Gallery() {
  const router = useRouter();
  const { photos, removePhoto } = usePhotoStore();
  const { addObject, setSelectedObjectId } = useEditorStore();
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    setSelectedObjectId(null);
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
                {photo.ai && (
                  <p className="text-white absolute flex items-center top-1 left-1 px-1 rounded bg-red-700 bg-opacity-40">
                    AI
                  </p>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setSelectedImage((prev) =>
                        photo.preview === prev ? null : photo.preview
                      )
                    }
                    className="flex items-center gap-1"
                  >
                    Глянути ближче
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditClick(photo.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="w-8 h-8" />
                    Редагувати
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(photo.id)}
                    className="absolute flex items-center top-1 right-1"
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
            <AlertDialogCancel>Ні</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Так
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogOverlay />
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle>Full Image Preview</DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Full Image"
              width={1200}
              height={800}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded cursor-pointer"
              onClick={() => setSelectedImage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
