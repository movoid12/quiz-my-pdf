"use client";

import React from "react";
import ThemeChanger from "./theme-changer";

export default function NavBar() {
  return (
    <nav>
      <div className="navbar bg-base-200 shadow-md">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="flex-none">
          <ThemeChanger />
        </div>
      </div>
    </nav>
  );
}
