"use server";

import * as React from "react";
import { auth } from "@/utils/auth";

import Link from "next/link";
import SignOut from "../auth/SignOut";

import Themebutton from "./Themebutton";

import MenuResponNav from "./MenuResponNav";

const Headers = async () => {
  const session = await auth();

  return (
    <div className="bg-transparent p-0">
      <nav className="flex flex-wrap items-center justify-between p-4 ">
        <div className="mr-6 flex shrink-0 items-center text-2xl">
          <Link href="/">
            <button className="glass-button px-4 py-2 hover:text-blue-800">
              StdActivitycheck
            </button>
          </Link>
        </div>
        <div className="block lg:hidden">
          <MenuResponNav />
        </div>
        <div
          id="menu-links"
          className="hidden w-full lg:flex lg:w-auto lg:items-center"
        >
          <div className="text-sm lg:grow">
            {session ? (
              <>
                {(session.user as { role: string }).role === "admin" ? (
                  <>{/* Links for Admin */}</>
                ) : (
                  <>{/* Links for Users */}</>
                )}
                <div className="flex items-center space-x-4">
                  <div>
                    <Themebutton />
                  </div>
                  <div>
                    <SignOut User={session?.user} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
          {!session && (
            <div>
              <Link
                href="/Signin"
                className="inline-block rounded border-2 border-red-500 px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-800"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Headers;
