/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Users, Menu, ChevronLast, AlignJustify, Home } from "lucide-react";

const menus = [
  { name: "หน้าหลัก", icon: Home, link: "/dashboard/cruduser/Dashboard" },
  { name: "ข้อมูลกิจกรรม", icon: Users, link: "/dashboard/cruduser/Dashboard" },
  {
    name: "ทำแบบสอบถามกิจกรรม",
    icon: Users,
    link: "/dashboard/crudfeedback/AddFeedback",
  },
];

const Usernavbar = () => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setOpen(!isMobileView);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const NavContent = ({ isMobileView = false }) => (
    <motion.div
      initial={{ width: isMobileView ? 280 : open ? 280 : 80 }}
      animate={{ width: open || isMobileView ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col border-r bg-background"
    >
      <div className="flex items-center justify-between p-4">
        <AnimatePresence>
          {(open || isMobileView) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            ></motion.div>
          )}
        </AnimatePresence>
        {!isMobile && !isMobileView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="rounded-full transition-transform duration-300 ease-in-out hover:bg-orange-100 hover:text-orange-500"
          >
            <motion.div
              animate={{ rotate: open ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {open ? (
                <AlignJustify className="size-5" />
              ) : (
                <ChevronLast className="size-5" />
              )}
            </motion.div>
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-1 py-2">
          {menus.map((menu, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={menu.link}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300 ease-in-out
                      ${!open && !isMobileView ? "justify-center" : ""} 
                      ${
                        i === 0
                          ? "bg-orange-100 text-orange-500"
                          : "hover:bg-orange-100 hover:text-orange-500"
                      }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <menu.icon className="size-5 shrink-0" />
                    </motion.div>
                    <AnimatePresence>
                      {(open || isMobileView) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {menu.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </TooltipTrigger>
                {!open && !isMobileView && (
                  <TooltipContent side="right">{menu.name}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </ScrollArea>
    </motion.div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen lg:block">
        <NavContent />
      </aside>

      {/* Mobile Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50  lg:hidden">
        <div className="flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="transition-colors duration-300 hover:bg-orange-100 hover:text-orange-500"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <NavContent isMobileView={true} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

export default Usernavbar;
