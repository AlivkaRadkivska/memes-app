import AuthForm from '@/components/auth/auth-form';
import { UserSidebar } from '@/components/site-layout/user-sidebar';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex px-4 py-0 sm:px-0">
      <div className="w-full flex items-start justify-center px-4 pt-6 pb-2 sm:px-6 lg:px-8">
        <AuthForm />
      </div>

      <UserSidebar />
    </div>
  );
}
