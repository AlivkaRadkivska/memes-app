import { useEditorStore } from '@/stores/editor-store';
import { usePhotoStore } from '@/stores/photo-store';
import { Download } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../../ui/button';
import { useRouter } from 'next/navigation';

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

    // Convert DataURL to Blob
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], `${photo.name}.png`, {
      type: mimeString,
      lastModified: Date.now(),
    });

    console.log(file);
    console.log(URL.createObjectURL(file));

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
