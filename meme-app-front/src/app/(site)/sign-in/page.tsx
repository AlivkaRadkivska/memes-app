import LoginForm from '@/components/auth/login-form';

export default function Home() {
  return (
    <div className="px-4 py-0 sm:px-0 w-full h-[70vh] flex items-center justify-center gap-4 flex-col">
      <LoginForm />
    </div>
  );
}
