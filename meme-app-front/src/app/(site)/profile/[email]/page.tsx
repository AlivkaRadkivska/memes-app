import { UserSidebar } from '@/components/site-layout/user-sidebar';
import Profile from '@/components/users/profile';

interface ProfilePageProps {
  params: Promise<{ email: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const email = decodeURIComponent((await params).email);

  return (
    <div className="min-h-[calc(100vh-60px)] flex px-4 py-0 sm:px-0">
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Profile email={email} />
      </div>

      <UserSidebar />
    </div>
  );
}
