import { useEditorStore } from '@/stores/editor-store';
import { usePhotoStore } from '@/stores/photo-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PhotoCard from '../photos/photo-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export function Gallery() {
  const router = useRouter();
  const { photos, removePhoto } = usePhotoStore();
  const { addObject, setSelectedObjectId } = useEditorStore();
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);

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

    router.push(`/gallery/${id}`);
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
          <PhotoCard
            key={photo.id}
            photo={{ ...photo }}
            onDelete={() => handleDeleteClick(photo.id)}
            onEdit={() => handleEditClick(photo.id)}
          />
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
    </>
  );
}
