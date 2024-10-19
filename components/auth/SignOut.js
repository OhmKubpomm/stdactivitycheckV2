/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
const SignOut = ({ User }) => {
  const router = useRouter();

  const handleSignOut = () => {
    sessionStorage.clear();
    signOut({ redirect: false }).then(() => {
      router.push("/Signin"); // redirect ไปหน้า /
      router.refresh();
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-2 py-1.5"
        >
          <Avatar className="size-8">
            <AvatarImage src={User?.image} alt={User?.name} />
            <AvatarFallback>{User?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{User?.name}</span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{User?.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {User?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/user/${User._id}`}>
              <UserCircle className="mr-2 size-4" />
              <span>ตั้งค่าผู้ใช้งาน</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" />
          <span>ออกจากระบบ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SignOut;
