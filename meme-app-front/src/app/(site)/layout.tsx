import { Header } from '@/components/site-layout/header';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto mt-14">{children}</main>
    </>
  );
}
