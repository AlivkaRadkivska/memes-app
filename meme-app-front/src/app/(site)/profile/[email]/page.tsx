import { WithUserSidebar } from '@/components/site-layout/with-use-sidebar';
import Profile from '@/components/users/profile';

interface ProfilePageProps {
  params: Promise<{ email: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const email = decodeURIComponent((await params).email);

  return (
    <WithUserSidebar>
      <Profile email={email} />
    </WithUserSidebar>
  );
}
