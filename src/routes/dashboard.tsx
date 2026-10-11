import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import Footer from '@/components/sections/footer';
import ThemeChanger from '@/components/ui/theme-changer';
import UserMenu from '@/components/ui/user-menu';
import { routes } from '@/lib/routes';
import { fetchSession } from '@/server/session';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const session = await fetchSession();
    if (!session) {
      throw redirect({
        to: routes.auth.signIn,
        search: { callbackUrl: location.pathname },
      });
    }
    return { session };
  },
  pendingComponent: DashboardPending,
  component: DashboardLayout,
});

function DashboardPending() {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <span className="loading loading-spinner loading-lg mb-4 text-primary"></span>
      <h2 className="mb-2 font-bold text-2xl">Loading Quiz...</h2>
      <p className="text-base-content/70">
        Please wait while we prepare your quiz
      </p>
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-7xl">
          <nav className="navbar rounded-box border border-base-content/10 bg-base-100/95 shadow-md backdrop-blur">
            <div className="navbar-start">
              <Link
                to={routes.home}
                className="btn btn-ghost px-2 text-xl font-bold"
              >
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
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
