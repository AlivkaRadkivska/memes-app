import { base64ToFile } from '@/helpers/file-utils';
import { useEditorStore } from '@/stores/editor-store';
import { usePhotoStore } from '@/stores/photo-store';
import { Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Button } from '../../ui/button';

interface ExportButtonProps {
  photoId: string;
}

export function ExportButton({ photoId }: ExportButtonProps) {
  const { getPhoto, updatePhoto } = usePhotoStore();
  const { clearObjects } = useEditorStore();
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const getPhotoData = () => {
    const photo = getPhoto(photoId);
    if (!photo) return null;

    const stage = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!stage) return null;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = stage.width;
    canvas.height = stage.height;
    context.drawImage(stage, 0, 0);

    const dataUrl = canvas.toDataURL('image/png');
    const file = base64ToFile(dataUrl, `${photo.name}.png`, 'image/png');
    return {
      url: dataUrl,
      preview: URL.createObjectURL(file),
      file,
    };
  };

  const handleExport = () => {
    const photo = getPhoto(photoId);
    const photoData = getPhotoData();
    if (!photo || !photoData) return;

    if (linkRef.current) {
      linkRef.current.href = photoData.url;
      linkRef.current.download = `edited-${photo.name.split('.')[0]}.png`;
      linkRef.current.click();
    }
  };

  const handleSave = () => {
    const photoData = getPhotoData();
    if (!photoData) return;

    updatePhoto(photoId, photoData.file, photoData.preview);
    clearObjects();
    router.push('/editor');
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        На памʼять
      </Button>

      <Button size="sm" onClick={handleSave}>
        Далі
      </Button>

      <a ref={linkRef} className="hidden" />
    </>
  );
}
