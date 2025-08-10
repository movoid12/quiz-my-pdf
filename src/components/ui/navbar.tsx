"use client";

import React from "react";
import ThemeChanger from "./theme-changer";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50">
      <div className="navbar bg-base-200 shadow-md border-base-content/10 border-2">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">QuizMyPDF</a>
        </div>
        <div className="flex-none">
          <ThemeChanger />
        </div>
      </div>
    </nav>
  );
}
