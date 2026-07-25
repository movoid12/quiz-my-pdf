import Link from 'next/link';
import Footer from '@/components/sections/footer';
import ThemeChanger from '@/components/ui/theme-changer';
import UserMenu from '@/components/ui/user-menu';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-7xl">
          <nav className="navbar rounded-box border border-base-content/10 bg-base-100/95 shadow-md backdrop-blur">
            <div className="navbar-start">
              <Link href="/" className="btn btn-ghost px-2 text-xl font-bold">
                QuizMyPDF
              </Link>
            </div>
            <div className="navbar-end gap-2">
              <ThemeChanger />
              <UserMenu />
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
