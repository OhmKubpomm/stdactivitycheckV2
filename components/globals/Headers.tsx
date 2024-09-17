/* eslint-disable tailwindcss/no-custom-classname */
"use server";

import * as React from "react";
import { auth } from "@/auth";

import Link from "next/link";
import SignOut from "../auth/SignOut";

import Themebutton from "./Themebutton";

import MenuResponNav from "./MenuResponNav";

const Headers = async () => {
  const session = await auth();

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="hover:text-primary/90 items-start text-left text-2xl font-bold transition-colors duration-300"
          >
            ระบบกิจกรรมนักศึกษา
          </Link>
        </div>
        <div className="lg:hidden">
          <MenuResponNav />
        </div>
        <div className="hidden items-center space-x-4 lg:flex">
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
      </nav>
    </div>
  );
};

export default Headers;
