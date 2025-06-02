import PublishMemes from '@/components/publish-memes/publish-memes';
import { WithUserSidebar } from '@/components/site-layout/with-use-sidebar';

export default function GalleryPage() {
  return (
    <WithUserSidebar>
      <PublishMemes />
    </WithUserSidebar>
  );
}
