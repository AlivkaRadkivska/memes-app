import { PublicationsContainer } from '@/components/publications/publications-container';
import { WithUserSidebar } from '@/components/site-layout/with-use-sidebar';

export default function HomePage() {
  return (
    <WithUserSidebar>
      <PublicationsContainer onlyFollowing />
    </WithUserSidebar>
  );
}
