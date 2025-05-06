import LoginForm from '@/components/auth/login-form';
import { UserSidebar } from '@/components/site-layout/user-sidebar';

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex px-4 py-0 sm:px-0">
      <div className="w-full flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 pb-32">
        <LoginForm />
      </div>

      <UserSidebar />
    </div>
  );
}
