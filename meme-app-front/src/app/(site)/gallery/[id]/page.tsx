import PhotoEditor from '@/components/photo-editor/photo-editor';

interface GalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col">
      <PhotoEditor id={id} />
    </div>
  );
}
