import { WithUserSidebar } from '@/components/site-layout/with-use-sidebar';
import ProfileUpdateForm from '@/components/users/profile-update-form';

export default function ProfileUpdatePage() {
  return (
    <WithUserSidebar>
      <ProfileUpdateForm />
    </WithUserSidebar>
  );
}
