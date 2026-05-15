import Footer from '@/components/sections/footer';
import BubbleMenu from '@/components/ui/bubble-menu';
import ThemeChanger from '@/components/ui/theme-changer';
import UserMenu from '@/components/ui/user-menu';
import { menuItems } from '@/lib/constants';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="z-10 mb-20">
        <BubbleMenu logo={<ThemeChanger />} items={menuItems} />
        <div className="fixed top-8 right-28 z-1002">
          <UserMenu />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
