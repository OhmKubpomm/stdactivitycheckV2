import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen max-h-screen min-h-screen min-w-full flex-col bg-background">
      <nav className="flex h-[60px] items-center justify-between border-b border-border px-4 py-2"></nav>
      <main className="flex w-full grow">{children}</main>
    </div>
  );
}

export default Layout;
