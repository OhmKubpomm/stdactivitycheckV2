/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import SignOut from "../auth/SignOut";

import Themebutton from "./Themebutton";
const MenuResponNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session } = useSession();

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div className="absolute inset-x-0 top-full border-b bg-background shadow-md">
          <div className="container mx-auto space-y-4 py-4">
            {session ? (
              <>
                <div className="flex items-center space-x-4">
                  <Themebutton />
                  <SignOut User={session?.user} />
                </div>
              </>
            ) : null}
            {!session && (
              <Link
                href="/Signin"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuResponNav;
