import Footer from '@/components/sections/footer';
import BubbleMenu from '@/components/ui/bubble-menu';
import ThemeChanger from '@/components/ui/theme-changer';
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
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
