/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <h2 className="text-destructive text-4xl">มีบางอย่างผิดปกติ!</h2>
      <Button asChild>
        <Link href={"/"}>กลับหน้าหลัก</Link>
      </Button>
    </div>
  );
}

export default ErrorPage;
