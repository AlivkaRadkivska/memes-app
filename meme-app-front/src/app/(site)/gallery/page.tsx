import UploadPhotos from '@/components/photos/upload-photos';
import { UserSidebar } from '@/components/site-layout/user-sidebar';

export default function GalleryPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex px-4 py-0 sm:px-0">
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <UploadPhotos />
      </div>

      <UserSidebar />
    </div>
  );
}
