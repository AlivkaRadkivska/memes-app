import { cn } from '@/helpers/css-utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '../ui/dialog';

interface PhotoCardProps {
  photo: {
    preview: string;
    name?: string;
    ai?: boolean;
  };
  mini?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PhotoCard({
  photo,
  onEdit,
  onDelete,
  mini = false,
}: PhotoCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Card className="overflow-hidden group">
        <CardContent
          className={cn(
            'w-full p-0 relative aspect-square',
            mini ? 'h-28' : 'h-64'
          )}
        >
          <div
            className={cn(
              'relative w-full h-full',
              mini ? 'min-h-14' : 'min-h-52'
            )}
          >
            <Image
              src={photo.preview}
              alt={photo.name || 'photo to preview'}
              fill
              style={{
                objectFit: 'cover',
                minHeight: '100px',
              }}
              className="cursor-pointer"
              onClick={() =>
                setSelectedImage((prev) =>
                  photo.preview === prev ? null : photo.preview
                )
              }
            />
            {photo.ai && (
              <p className="text-white absolute flex items-center bottom-1 right-1 px-1 rounded bg-red-700 bg-opacity-40">
                AI
              </p>
            )}
            <div className="absolute inset-0 h-min opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-4">
              {onEdit && (
                <Button
                  size="icon"
                  variant="default"
                  onClick={onEdit}
                  className="bg-white/70 flex items-center gap-1 absolute top-1 left-1 px-3 w-max "
                >
                  <Edit2 size={14} />
                  Редагувати
                </Button>
              )}
              {onDelete && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={onDelete}
                  className="absolute flex items-center top-1 right-1"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          </div>
          {photo.name && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
              <p className="text-sm truncate">{photo.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

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
