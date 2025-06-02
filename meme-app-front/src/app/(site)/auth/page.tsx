import AuthForm from '@/components/auth/auth-form';
import { WithUserSidebar } from '@/components/site-layout/with-use-sidebar';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <WithUserSidebar>
      <div className="w-full flex items-start justify-center">
        <Suspense>
          <AuthForm />
        </Suspense>
      </div>
    </WithUserSidebar>
  );
}
