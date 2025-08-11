'use client';

import ThemeChanger from './theme-changer';

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50">
      <div className="navbar border-2 border-base-content/10 bg-base-200 shadow-md">
        <div className="flex-1">
          <a href="/" className="btn btn-ghost text-xl">
            QuizMyPDF
          </a>
        </div>
        <div className="flex-none">
          <ThemeChanger />
        </div>
      </div>
    </nav>
  );
}
