import { usePhotoStore } from '@/stores/photo-store';
import { Download } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../../ui/button';

interface ExportButtonProps {
  photoId: string;
}

export function ExportButton({ photoId }: ExportButtonProps) {
  const { getPhoto } = usePhotoStore();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleExport = () => {
    const photo = getPhoto(photoId);
    if (!photo) return;

    const stage = document.querySelector('canvas');
    if (!stage) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = stage.width;
    canvas.height = stage.height;

    const stageCanvas = stage as HTMLCanvasElement;
    context.drawImage(stageCanvas, 0, 0);

    const dataURL = canvas.toDataURL('image/png');

    if (linkRef.current) {
      linkRef.current.href = dataURL;
      linkRef.current.download = `edited-${photo.name}`;
      linkRef.current.click();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        На пам&apos;ять
      </Button>
      <a ref={linkRef} className="hidden" />
    </>
  );
}
